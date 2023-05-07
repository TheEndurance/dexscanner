import { useParams } from "react-router-dom";

import { ApolloError, DocumentNode, QueryResult, gql, useQuery } from '@apollo/client';


// get all the pools, trading pairs, volume and other info for the pools
const MESSARI_POOLS_QUERY = gql`
    query GetPools($protocolId: ID!) @api(contextKey: "apiName") {
        dexAmmProtocol(id: $protocolId) {
            pools(where: { cumulativeVolumeUSD_gt: 0}) {
                id
                cumulativeVolumeUSD
                inputTokens {
                    name
                    lastPriceUSD
                }
            }
        }
    }
`
// get specific information for a pool
const MESSARI_POOL_QUERY = gql`
    query GetPool($poolId: ID!, $protocolId: ID!) @api(contextKey: "apiName") {
        dexAmmProtocol(id: $protocolId) {
            pools(where: { id: $id }) {
                id
                cumulativeVolumeUSD
                swaps {
                    timestamp
                    tokenOut {
                        name
                        lastPriceUSD
                    }
                    tokenIn {
                        name
                        lastPriceUSD
                    }
            
                }
                inputTokens {
                    name
                    lastPriceUSD
                }
            }
        }
    }
`;

type ChainsKey = "arbitrum" | "ethereum";
const CHAINS: Record<ChainsKey, ChainsKey> = {
    arbitrum: "arbitrum",
    ethereum: "ethereum"
}

type DexesKey = "sushiswap" | "uniswap-v2" | "uniswap-v3";
const DEXES: Record<DexesKey, DexesKey> = {
    sushiswap: "sushiswap",
    "uniswap-v2": "uniswap-v2",
    "uniswap-v3": "uniswap-v3"
};

type QueryTypes = "getPools"

interface IQueryContext {
    apiName: string,
    contractId: string,
    uri: string,
    queries: {
        [key in QueryTypes]: {
            query: DocumentNode,
            variables: object
        }
    }
}


type QueryContextByChainByDexMap = {
    [key in ChainsKey]: {
        [key in DexesKey]?: IQueryContext
    }
}


type QueryResults = {
    [key in ChainsKey]?: {
        [key in DexesKey]?: {
            [key in QueryTypes]?: {
                data?: any;
                loading?: boolean;
                error?: ApolloError;
            }
        }
    };
};

const queryContextByChainByDex: QueryContextByChainByDexMap = {
    arbitrum: {
        [DEXES["uniswap-v3"]]: {
            apiName: `${CHAINS.arbitrum}-${DEXES["uniswap-v3"]}`,
            contractId: "0x1f98431c8ad98523631ae4a59f267346ea31f984",
            uri: "https://api.thegraph.com/subgraphs/name/messari/uniswap-v3-arbitrum",
            queries: {
                getPools: {
                    query: MESSARI_POOLS_QUERY,
                    variables: {
                        protocolId: "0xc35dadb65012ec5796536bd9864ed8773abc74c4",
                    }
                }
            }
        },
        [DEXES.sushiswap]: {
            apiName: `${CHAINS.arbitrum}-${DEXES.sushiswap}`,
            uri: "https://api.thegraph.com/subgraphs/name/messari/sushiswap-arbitrum",
            queries: {
                getPools: {
                    query: MESSARI_POOLS_QUERY,
                    variables: {
                        protocolId: "0xc35dadb65012ec5796536bd9864ed8773abc74c4",
                    }
                }
            }
        }
    },
    ethereum: {

    }
};


function setQueryResults(queryResults: QueryResults, chainKey: ChainsKey, dexKey: DexesKey, queryName: QueryTypes, queryResult: QueryResult) {
    if (!queryResults[chainKey]) {
        queryResults[chainKey] = {};
    }
    if (!queryResults[chainKey]![dexKey]) {
        queryResults[chainKey]![dexKey] = {};
    }
    const { data, loading, error } = queryResult;
    queryResults[chainKey]![dexKey]![queryName] = {
        data,
        loading,
        error
    };
}

function isQueryContext(context: any): context is IQueryContext {
    return context && context.apiName && context.uri && context.queries;
}

function setQueryResultsByChainsAndDexes(queryContextByChainByDex: QueryContextByChainByDexMap, chains: Array<ChainsKey>, dexes: Array<DexesKey>, queryName: QueryTypes, queryResults: QueryResults) {
    chains.forEach((chainKey) => {
        dexes.forEach((dexKey) => {
            const queryContext = queryContextByChainByDex[chainKey][dexKey];
            if (isQueryContext(queryContext)) {
                const { apiName, queries } = queryContext;
                const { query, variables } = queries[queryName];
                const queryResult = useQuery(query, { context: { apiName }, variables });
                setQueryResults(queryResults, chainKey, dexKey, queryName, queryResult)
            }
        })
    })
}

function getQueries(queryContextByChainByDex: QueryContextByChainByDexMap, chains: Array<ChainsKey>, dexes: Array<DexesKey>, queryName: QueryTypes): QueryResults {
    const queryResults: QueryResults = {};
    if (chains.length === 0) {
        setQueryResultsByChainsAndDexes(queryContextByChainByDex, Object.values(CHAINS), Object.values(DEXES), queryName, queryResults);
    }
    else if (dexes.length === 0) {
        setQueryResultsByChainsAndDexes(queryContextByChainByDex, chains, Object.values(DEXES), queryName, queryResults);
    }
    else {
        setQueryResultsByChainsAndDexes(queryContextByChainByDex, chains, dexes, queryName, queryResults);
    }
    return queryResults;
}

// if we have no chain --> return every chain and every dex
// if we have a chain but no dex --> return every dex on that chain
// if we have a chain and dex --> return only that chain & dex

export default function Listings() {
    const { chain, dex } = useParams();
    const chains: Array<ChainsKey> = chain ? [chain as ChainsKey] : [];
    const dexes: Array<DexesKey> = dex ? [dex as DexesKey] : [];
    const queryResults = getQueries(queryContextByChainByDex,chains, dexes, "getPools");


    return (
        <div className="flex flex-nowrap">
            Listings 
        </div>
    )
}
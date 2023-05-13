import { useParams } from "react-router-dom";

import { gql, request } from "graphql-request";
import { useQueries, useQuery } from "@tanstack/react-query";

import { format } from "d3-format";

import { ListingsTable } from "./ListingsTable";
import { useMemo } from "react";


interface MessariPool {
    id: string,
    createdTimestamp: string,
    dailySnapshots: [{
        dailyVolumeUSD: string,
        totalValueLockedUSD: string
    }]
    inputTokens: [
        {
            id: string
            name: string,
            lastPriceUSD: string
        },
        {
            id: string,
            name: string,
            lastPriceUSD: string
        }
    ]
}

export interface MessariTablePool extends MessariPool {
    chain: ChainsKey,
    dex: DexesKey
}


// get all the pools, trading pairs, volume and other info for the pools

interface MesarriPoolsResponse {
    dexAmmProtocol: {
        id: string,
        financialMetrics: [{
            timestamp: string,
            dailyVolumeUSD: string
        }]
        dailyUsageMetrics: [{
            dailyTransactionCount: number,
            dailyActiveUsers: number
        }]
        pools: Array<MessariPool>
    }
}

function isMessariPoolsResponse(obj: any): obj is MesarriPoolsResponse {
    return obj && obj.dexAmmProtocol && obj.dexAmmProtocol.pools;
}

const MESSARI_SUSHISWAP_POOLS_QUERY = gql`
    query GetPools($protocolId: ID!) {
        dexAmmProtocol(id: $protocolId) {
            id
            financialMetrics(orderBy: timestamp, orderDirection:desc, first: 1) {
                timestamp
                dailyVolumeUSD
            }
            dailyUsageMetrics(orderBy: timestamp, orderDirection:desc, first: 1) {
                dailyTransactionCount
                dailyActiveUsers
            }
            pools(where: { cumulativeVolumeUSD_gt: 0}, orderBy: totalValueLockedUSD, orderDirection: desc, first: 1000) {
                id
                createdTimestamp
                dailySnapshots(orderBy: timestamp, orderDirection:desc, first: 1) {
                    dailyVolumeUSD
                    totalValueLockedUSD
                }
                inputTokens {
                    id
                    name
                    lastPriceUSD
                }
            }
        }
    }
`;


const MESSARI_UNISWAPV3_POOLS_QUERY = gql`
    query GetPools($protocolId: ID!) {
        dexAmmProtocol(id: $protocolId) {
            id
            financialMetrics(orderBy: timestamp, orderDirection:desc, first: 1) {
                timestamp
                dailyVolumeUSD
            }
            dailyUsageMetrics(orderBy: timestamp, orderDirection:desc, first: 1) {
                dailyTransactionCount
                dailyActiveUsers
            }
            pools(where: { cumulativeVolumeUSD_gt: 0}, orderBy: totalValueLockedUSD, orderDirection: desc, first: 1000) {
                id
                createdTimestamp
                dailySnapshots(orderBy: timestamp, orderDirection:desc, first: 1) {
                    totalValueLockedUSD
                }
                inputTokens {
                    id
                    name
                    lastPriceUSD
                }
            }
        }
    }
`;
// get specific information for a pool
const MESSARI_POOL_QUERY = gql`
    query GetPool($poolId: ID!, $protocolId: ID!) {
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
const CHAINS: ChainsKey[] = ["arbitrum", "ethereum"];

type DexesKey = "sushiswap" | "uniswap-v2" | "uniswap-v3";
const DEXES: DexesKey[] = ["sushiswap", "uniswap-v2", "uniswap-v3"];

type ApiName = `${ChainsKey}-${DexesKey}`;

type QueryTypes = "getPools";

type SubgraphProviders = "Messari";

const apiNameToProviderMap = {
    "arbitrum-sushiswap": {
        "Messari": {
            uri: ""
        }
    }
}

// map that has apiname "arbitrum-sushiswap" , can swap out the uri to anything else and we dynamically get the correct set of queries (standardized names like getPools) and correct typing

interface IQueryContext {
    apiName: ApiName,
    queries: {
        [key in QueryTypes]: {
            queryFn: () => Promise<unknown>,
            queryKey: Array<any>,
            type: SubgraphProviders
        }
    }
}

type QueryContextByChainByDexMap = {
    [key in ChainsKey]: {
        [key in DexesKey]?: IQueryContext
    }
}


type Query = {
    chain: ChainsKey,
    dex: DexesKey,
    queryName: QueryTypes
    type: string,
    queryFn: () => Promise<unknown>,
    queryKey: Array<any>
}

const queryContextByChainByDex: QueryContextByChainByDexMap = {
    arbitrum: {
        "uniswap-v3": {
            apiName: "arbitrum-uniswap-v3",
            queries: {
                getPools: {
                    queryKey: ["pools", "arbitrum", "uniswap-v3"],
                    queryFn: async () => {
                        return await request(
                            "https://api.thegraph.com/subgraphs/name/messari/uniswap-v3-arbitrum",
                            MESSARI_UNISWAPV3_POOLS_QUERY,
                            {
                                protocolId: "0x1f98431c8ad98523631ae4a59f267346ea31f984",
                            }
                        );
                    },
                    type: "Messari",

                }
            }
        },
        sushiswap: {
            apiName: "arbitrum-sushiswap",
            queries: {
                getPools: {
                    queryKey: ["pools", "arbitrum", "sushiswap"],
                    queryFn: async () => {
                        return await request(
                            "https://api.thegraph.com/subgraphs/name/messari/sushiswap-arbitrum",
                            MESSARI_SUSHISWAP_POOLS_QUERY,
                            {
                                protocolId: "0xc35dadb65012ec5796536bd9864ed8773abc74c4",
                            }
                        );
                    },
                    type: "Messari",
                }
            }
        }
    },
    ethereum: {
        "uniswap-v3": {
            apiName: "ethereum-uniswap-v3",
            queries: {
                getPools: {
                    queryKey: ["pools", "ethereum", "uniswap-v3"],
                    queryFn: async () => {
                        return await request(
                            "https://api.thegraph.com/subgraphs/name/messari/uniswap-v3-ethereum",
                            MESSARI_UNISWAPV3_POOLS_QUERY,
                            {
                                protocolId: "0x1f98431c8ad98523631ae4a59f267346ea31f984",
                            }
                        );
                    },
                    type: "Messari",
                }
            }
        }
    }
};


// function setQueryResults(queries: queries, chainKey: ChainsKey, dexKey: DexesKey, queryName: QueryTypes, Query: Query) {
//     if (!queries[chainKey]) {
//         queries[chainKey] = {};
//     }
//     if (!queries[chainKey]![dexKey]) {
//         queries[chainKey]![dexKey] = {};
//     }
//     const { data, loading, error } = Query;
//     queries[chainKey]![dexKey]![queryName] = {
//         data,
//         loading,
//         error
//     };
// }

function isQueryContext(context: any): context is IQueryContext {
    return context && context.apiName && context.queries;
}


function setQueryResultsByChainsAndDexes(queryContextByChainByDex: QueryContextByChainByDexMap, chains: Array<ChainsKey>, dexes: Array<DexesKey>, queryName: QueryTypes, queries: Array<Query>) {
    chains.forEach((chainKey) => {
        dexes.forEach((dexKey) => {
            const queryContext = queryContextByChainByDex[chainKey][dexKey];
            if (isQueryContext(queryContext)) {
                const { apiName, queries: queryContextQueries } = queryContext;
                const { queryFn, queryKey, type } = queryContextQueries[queryName];

                const Query: Query = {
                    chain: chainKey,
                    dex: dexKey,
                    queryName,
                    type,
                    queryFn,
                    queryKey
                };
                queries.push(Query);
            }
        })
    })
}


// if we have no chain --> return every chain and every dex
// if we have a chain but no dex --> return every dex on that chain
// if we have a chain and dex --> return only that chain & dex
function getQueryByChainByDex(queryContextByChainByDex: QueryContextByChainByDexMap, chains: Array<ChainsKey>, dexes: Array<DexesKey>, queryName: QueryTypes): Array<Query> {
    const queries: Array<Query> = [];
    if (chains.length === 0) {
        setQueryResultsByChainsAndDexes(queryContextByChainByDex, CHAINS, DEXES, queryName, queries);
    }
    else if (dexes.length === 0) {
        setQueryResultsByChainsAndDexes(queryContextByChainByDex, chains, Object.values(DEXES), queryName, queries);
    }
    else {
        setQueryResultsByChainsAndDexes(queryContextByChainByDex, chains, dexes, queryName, queries);
    }
    return queries;
}



export default function Listings() {
    const { chain, dex } = useParams();
    const chains: Array<ChainsKey> = chain ? [chain as ChainsKey] : [];
    const dexes: Array<DexesKey> = dex ? [dex as DexesKey] : [];
    const queries = getQueryByChainByDex(queryContextByChainByDex, chains, dexes, "getPools");
    const results = useQueries({
        queries: queries.map((Query) => ({
            queryKey: Query.queryKey,
            queryFn: Query.queryFn
        }))
    });
    console.log(results);
    const loading = results.every((result) => result.isLoading);

    const mutatedData = (() => {
        let volumeUSD = 0;
        let transactionCount = 0;
        let activeUsers = 0;
        let aggregatePools = [];
        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            const { data } = result;
            if (isMessariPoolsResponse(data)) {
                volumeUSD += parseFloat(data.dexAmmProtocol.financialMetrics[0].dailyVolumeUSD);
                transactionCount += data.dexAmmProtocol.dailyUsageMetrics[0].dailyTransactionCount;
                activeUsers += data.dexAmmProtocol.dailyUsageMetrics[0].dailyActiveUsers;
                for (let pool of data.dexAmmProtocol.pools) {
                    aggregatePools.push({
                        chain: queries[i].chain,
                        dex: queries[i].dex,
                        ...pool
                    });
                }
            }
        }
        return {
            dailyVolumeUSD: format(".4~s")(volumeUSD).replace(/G/, "B"),
            dailyTransactionCount: format(",")(transactionCount),
            dailyActiveUsers: format(",")(activeUsers),
            pools: aggregatePools
        }
    })();

    return (
        <div className="flex flex-col flex-nowrap w-full h-full overflow-y-scroll">
            <div className="flex flex-nowrap gap-2 p-2 flex-initial">
                <div className="border dark:border-slate-600 rounded p-4 flex-auto text-center">
                    <span className="text-sm">24H VOLUME: </span><span className="font-bold">{loading ? "loading ..." : ("$" + mutatedData.dailyVolumeUSD)}</span>
                </div>
                <div className="border dark:border-slate-600 rounded p-4 flex-auto text-center">
                    <span className="text-sm">24H TXNS: </span><span className="font-bold">{loading ? "loading ..." : mutatedData.dailyTransactionCount}</span>
                </div>
                <div className="border dark:border-slate-600 rounded p-4 flex-auto text-center">
                    <span className="text-sm">24H ACTIVE USERS: </span><span className="font-bold">{loading ? "loading ..." : mutatedData.dailyActiveUsers}</span>
                </div>
            </div>
            <ListingsTable loading={loading} data={mutatedData.pools} />
        </div>
    )
}




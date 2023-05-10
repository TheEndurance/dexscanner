import { useParams } from "react-router-dom";

import { DocumentNode, gql, useQuery, QueryResult as ApolloQueryResult } from '@apollo/client';
import { useEffect, useMemo, useState } from "react";

import { format } from "d3-format";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { ListingsTable } from "./ListingsTable";


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

const MESSARI_POOLS_QUERY = gql`
    query GetPools($protocolId: ID!) @api(contextKey: "apiName") {
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
    contractId: string,
    uri: string,
    queries: {
        [key in QueryTypes]: {
            query: DocumentNode,
            type: SubgraphProviders,
            variables: object
        }
    }
}

type QueryContextByChainByDexMap = {
    [key in ChainsKey]: {
        [key in DexesKey]?: IQueryContext
    }
}


type QueryResult = {
    chain: ChainsKey,
    dex: DexesKey,
    queryName: QueryTypes
    result: ApolloQueryResult
}

const queryContextByChainByDex: QueryContextByChainByDexMap = {
    arbitrum: {
        "uniswap-v3": {
            apiName: "arbitrum-uniswap-v3",
            contractId: "0x1f98431c8ad98523631ae4a59f267346ea31f984",
            uri: "https://api.thegraph.com/subgraphs/name/messari/uniswap-v3-arbitrum",
            queries: {
                getPools: {
                    query: MESSARI_POOLS_QUERY,
                    type: "Messari",
                    variables: {
                        protocolId: "0xc35dadb65012ec5796536bd9864ed8773abc74c4",
                    }
                }
            }
        },
        sushiswap: {
            apiName: "arbitrum-sushiswap",
            contractId: "0xc35dadb65012ec5796536bd9864ed8773abc74c4",
            uri: "https://api.thegraph.com/subgraphs/name/messari/sushiswap-arbitrum",
            queries: {
                getPools: {
                    query: MESSARI_POOLS_QUERY,
                    type: "Messari",
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


// function setQueryResults(queryResults: QueryResults, chainKey: ChainsKey, dexKey: DexesKey, queryName: QueryTypes, queryResult: QueryResult) {
//     if (!queryResults[chainKey]) {
//         queryResults[chainKey] = {};
//     }
//     if (!queryResults[chainKey]![dexKey]) {
//         queryResults[chainKey]![dexKey] = {};
//     }
//     const { data, loading, error } = queryResult;
//     queryResults[chainKey]![dexKey]![queryName] = {
//         data,
//         loading,
//         error
//     };
// }

function isQueryContext(context: any): context is IQueryContext {
    return context && context.apiName && context.uri && context.queries;
}


function setQueryResultsByChainsAndDexes(queryContextByChainByDex: QueryContextByChainByDexMap, chains: Array<ChainsKey>, dexes: Array<DexesKey>, queryName: QueryTypes, queryResults: Array<QueryResult>) {
    chains.forEach((chainKey) => {
        dexes.forEach((dexKey) => {
            const queryContext = queryContextByChainByDex[chainKey][dexKey];
            if (isQueryContext(queryContext)) {
                const { apiName, queries } = queryContext;
                const { query, variables, type } = queries[queryName];

                let result;
                if (type === "Messari" && queryName === "getPools") {
                    result = useQuery<MesarriPoolsResponse>(query, { context: { apiName }, variables });
                }
                else {
                    result = useQuery(query, { context: { apiName }, variables });
                }
                // console.log(result);
                const queryResult: QueryResult = {
                    chain: chainKey,
                    dex: dexKey,
                    queryName,
                    result
                };
                queryResults.push(queryResult);
                // setQueryResults(queryResults, chainKey, dexKey, queryName, queryResult)
            }
        })
    })
}


// if we have no chain --> return every chain and every dex
// if we have a chain but no dex --> return every dex on that chain
// if we have a chain and dex --> return only that chain & dex
function getQueryByChainByDex(queryContextByChainByDex: QueryContextByChainByDexMap, chains: Array<ChainsKey>, dexes: Array<DexesKey>, queryName: QueryTypes): Array<QueryResult> {
    const queryResults: Array<QueryResult> = [];
    if (chains.length === 0) {
        setQueryResultsByChainsAndDexes(queryContextByChainByDex, CHAINS, DEXES, queryName, queryResults);
    }
    else if (dexes.length === 0) {
        setQueryResultsByChainsAndDexes(queryContextByChainByDex, chains, Object.values(DEXES), queryName, queryResults);
    }
    else {
        setQueryResultsByChainsAndDexes(queryContextByChainByDex, chains, dexes, queryName, queryResults);
    }
    return queryResults;
}



export default function Listings() {
    const { chain, dex } = useParams();
    const chains: Array<ChainsKey> = chain ? [chain as ChainsKey] : [];
    const dexes: Array<DexesKey> = dex ? [dex as DexesKey] : [];
    const queryResults = getQueryByChainByDex(queryContextByChainByDex, chains, dexes, "getPools");
    const loading = queryResults.every((queryResult) => queryResult.result.loading);

    const mutatedData = (() => {
        let volumeUSD = 0;
        let transactionCount = 0;
        let activeUsers = 0;
        let aggregatePools = [];
        for (let queryResult of queryResults) {
            console.log(queryResult);
            const { data } = queryResult.result;
            if (isMessariPoolsResponse(data)) {
                volumeUSD += parseFloat(data.dexAmmProtocol.financialMetrics[0].dailyVolumeUSD);
                transactionCount += data.dexAmmProtocol.dailyUsageMetrics[0].dailyTransactionCount;
                activeUsers += data.dexAmmProtocol.dailyUsageMetrics[0].dailyActiveUsers;
                for (let pool of data.dexAmmProtocol.pools) {
                    aggregatePools.push({
                        chain: queryResult.chain,
                        dex: queryResult.dex,
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
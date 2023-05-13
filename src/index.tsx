import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ViewportProvider from './context/ViewportContext';
import Home from './pages/Home';
import TradingPair from './pages/TradingPair';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';



const endpoints = {

}

// const multiLink = ApolloLink.from([
//     new MultiAPILink({
//         endpoints: {
//             "arbitrum-uniswap-v3": "https://api.thegraph.com/subgraphs/name/messari/uniswap-v3-arbitrum",
//             "arbitrum-sushiswap": "https://api.thegraph.com/subgraphs/name/messari/sushiswap-arbitrum",
//             "ethereum-uniswap-v3": "https://api.thegraph.com/subgraphs/name/messari/uniswap-v3-ethereum"
//         },
//         createHttpLink: () => createHttpLink(),
//         httpSuffix: "",
        
//     })]);


const queryClient = new QueryClient();

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/:chain",
        element: <Home />
    },
    {
        path: "/:chain/:dex",
        element: <Home />
    },
    {
        path: "/:chain/:dex/:contractId",
        element: <TradingPair />
    }
]);

// @ts-ignore
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ViewportProvider>
                <RouterProvider router={router} />
            </ViewportProvider>
        </QueryClientProvider>
    </React.StrictMode>
)

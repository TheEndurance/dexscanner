import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ViewportProvider from './context/ViewportContext';
import Home from './pages/Home';
import TradingPair from './pages/TradingPair';
import { ApolloClient, ApolloLink, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { MultiAPILink } from '@habx/apollo-multi-endpoint-link';


// const httpLink = new HttpLink({
//     uri: "https://api.thegraph.com/subgraphs/name/messari/uniswap-v3-arbitrum"
// })

// const wsLink = new GraphQLWsLink(
//     createClient({
//         url: "wss://api.thegraph.com/subgraphs/name/messari/uniswap-v3-arbitrum/graphql",
//     }),
// );


const multiLink = ApolloLink.from([
    new MultiAPILink({
        endpoints: {
            "arbitrum-uniswap-v3": "https://api.thegraph.com/subgraphs/name/messari/uniswap-v3-arbitrum",
            "arbitrum-sushiswap": "https://api.thegraph.com/subgraphs/name/messari/sushiswap-arbitrum"
        },
        createHttpLink: () => createHttpLink(),
        httpSuffix: "",
        
    })]);


const client = new ApolloClient({
    link: multiLink,
    cache: new InMemoryCache()
});


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
        <ApolloProvider client={client}>
            <ViewportProvider>
                <RouterProvider router={router} />
            </ViewportProvider>
        </ApolloProvider>
    </React.StrictMode>
)

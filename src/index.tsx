import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';


import ViewportProvider from './context/ViewportContext';
import Home from './pages/Home';
import TradingPair from './pages/TradingPair';

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
        path: "/:chain/:contractId",
        element: <TradingPair />
    }
]);

// @ts-ignore
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <ViewportProvider>
            <RouterProvider router={router}/>
        </ViewportProvider>
    </React.StrictMode>
)

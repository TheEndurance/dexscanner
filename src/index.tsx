import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom';


import ViewportProvider, { useViewport } from './context/ViewportContext';
import SidebarMainAsideLayout from './layouts/SidebarMainAsideLayout';
import Sidebar from './components/Sidebar';
import DesktopChartsAndTrades from './components/DesktopChartsAndTrades';
import { ChartTradesLocalStorageContextProvider, LayoutLocalStorageContextProvider, } from './context/LocalStorageContexts';
import InfoSection from './components/InfoSection';
import Home from './pages/Home';
import TradingPair from './pages/TradingPair';


const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
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

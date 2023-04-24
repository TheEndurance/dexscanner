import React from 'react';
import ReactDOM from 'react-dom/client';


import ViewportProvider, { useViewport } from './context/ViewportContext';
import SidebarMainAsideLayout from './components/SidebarMainAsideLayout';
import Sidebar from './components/Sidebar';
import Infobar from './components/Infobar';
import DesktopChartsAndTrades from './components/DesktopChartsAndTrades';
import { ChartTradesLocalStorageContextProvider } from './context/LocalStorageContexts';


function App() {
    const { isMobile, isTablet, isDesktop } = useViewport();
    if (isMobile) {
        return (
            <div>
                Mobile not implemented
            </div>
        )
    }
    else if (isDesktop || isTablet) {
        return (
            <SidebarMainAsideLayout>
                <Sidebar />
                <ChartTradesLocalStorageContextProvider>
                    <DesktopChartsAndTrades />
                </ChartTradesLocalStorageContextProvider>
                <Infobar />
            </SidebarMainAsideLayout>
        )
    }
    else {
        return (<div>Error</div>);
    }
}

// @ts-ignore
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <ViewportProvider>
            <App />
        </ViewportProvider>
    </React.StrictMode>
)

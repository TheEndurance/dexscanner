import DesktopChartsAndTrades from "../components/DesktopChartsAndTrades";
import InfoSection from "../components/InfoSection";
import Sidebar from "../components/Sidebar";
import { ChartTradesLocalStorageContextProvider, LayoutLocalStorageContextProvider } from "../context/LocalStorageContexts";
import { useViewport } from "../context/ViewportContext";
import SidebarMainAsideLayout from "../layouts/SidebarMainAsideLayout";
import { Chain, getChains } from "../data/chains";
import { useEffect, useState } from "react";

export default function Home() {
    const { isMobile, isTablet, isDesktop } = useViewport();
    const [chains,setChains] = useState<Chain[]>([]);

    useEffect(() => {
        async function fetchChains() {
            const response = await getChains();
            setChains(response);
        }
        fetchChains();
    }, []);
    
    if (isMobile) {
        return (
            <div>
                Mobile not implemented
            </div>
        )
    }
    else if (isDesktop || isTablet) {
        return (
            <LayoutLocalStorageContextProvider>
                <SidebarMainAsideLayout>
                    <Sidebar chains={chains}/>
                    <ChartTradesLocalStorageContextProvider>
                        <DesktopChartsAndTrades />
                    </ChartTradesLocalStorageContextProvider>
                    <InfoSection />
                </SidebarMainAsideLayout>
            </LayoutLocalStorageContextProvider>
        )
    }
    else {
        return (<div>Error</div>);
    }
}
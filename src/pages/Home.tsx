import Listings from "../components/Listings";
import Sidebar from "../components/Sidebar";
import { LayoutLocalStorageContextProvider } from "../context/LocalStorageContexts";
import { useViewport } from "../context/ViewportContext";
import SidebarMainLayout from "../layouts/SidebarMainLayout";
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
                <SidebarMainLayout>
                    <Sidebar chains={chains} />
                    <Listings />
                </SidebarMainLayout>
            </LayoutLocalStorageContextProvider>
        )
    }
    else {
        return (<div>Error</div>);
    }
}
import { ReactNode, useEffect, useState, createContext, useContext } from "react";

interface ViewportState {
    isMobile?: boolean,
    isTablet?: boolean,
    isDesktop?: boolean
}

const ViewportContext = createContext<ViewportState>({});


export default function ViewportProvider ({ children }: { children: Array<ReactNode> | ReactNode}) {
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const tabletQuery = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');
    const desktopQuery = window.matchMedia('(min-width: 1024px)');


    useEffect(() => {
        const handleResize = () => {
            setIsMobile(mobileQuery.matches);
            setIsTablet(tabletQuery.matches);
            setIsDesktop(desktopQuery.matches);
        };

        handleResize();

        mobileQuery.addEventListener('change', handleResize);
        tabletQuery.addEventListener('change', handleResize);
        desktopQuery.addEventListener('change', handleResize);

        return () => {
            mobileQuery.removeEventListener('change', handleResize);
            tabletQuery.removeEventListener('change', handleResize);
            desktopQuery.removeEventListener('change', handleResize);
        };
    }, []);

    return (
        <ViewportContext.Provider value={{ isMobile, isTablet, isDesktop }}>
            {children}
        </ViewportContext.Provider>
    );
};

export const useViewport = () => {
    const { isMobile, isTablet, isDesktop } = useContext(ViewportContext);
    return { isMobile, isTablet, isDesktop };
};
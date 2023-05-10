import { useContext } from 'react';
import { LAYOUT_SETTINGS_KEYS, LayoutLocalStorageContext, UPDATE_KEY } from '../context/LocalStorageContexts';
import { Chain } from '../data/chains';
import ChainList from './ChainList';

export interface SidebarProps {
    chains: Chain[];
}


export default function Sidebar({ chains }: SidebarProps) {
    const { state, dispatch } = useContext(LayoutLocalStorageContext);

    const handleToggleSidebar = () => {
        dispatch({
            type: UPDATE_KEY,
            payload: {
                key: LAYOUT_SETTINGS_KEYS.SIDEBAR_COLLAPSED,
                value: !state.SIDEBAR_COLLAPSED
            }
        });
    };

    const chevronRight = (
        <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none">
            <g id="Arrow / Chevron_Right_Duo">
                <path id="Vector" d="M13 8L17 12L13 16M7 8L11 12L7 16" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
        </svg>
    );

    const chevronLeft = (
        <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none">
            <g id="Arrow / Chevron_Left_Duo">
                <path id="Vector" d="M17 16L13 12L17 8M11 16L7 12L11 8" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
        </svg>
    );
    return (
        <div className='flex flex-col flex-nowrap gap-2 p-2 w-full h-full text-center overflow-hidden'>
            <div className="flex justify-between">
                <div className="grow text-center">
                    <h1 className='font-bold text-2xl transition-transform'>{state.SIDEBAR_COLLAPSED ? 'DS' : 'DexScanner'}</h1>
                </div>
                <button className="self-start" onClick={handleToggleSidebar} title="Toggle Side Menu">
                    {state.SIDEBAR_COLLAPSED ? chevronRight : chevronLeft}
                </button>
            </div>
            {/* List of chains */}
            <div className="flex flex-col flex-nowrap mt-2 gap-2">
                <ChainList linkCssClasses={"flex flex-row flex-nowrap ml-[1.5rem] gap-2"} textCssClasses={"font-bold text-md"} chains={chains}/>
            </div>
        </div>
    )
}
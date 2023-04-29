import { useContext } from 'react';
import { LAYOUT_SETTINGS_KEYS, LayoutLocalStorageContext, UPDATE_KEY } from '../context/LocalStorageContexts';




export default function Sidebar() {
    const { state, dispatch } = useContext(LayoutLocalStorageContext);
    const SIDEBAR_COLLAPSED_KEY = LAYOUT_SETTINGS_KEYS.SIDEBAR_COLLAPSED;
    const handleToggleSidebar = () => {
        dispatch({
            type: UPDATE_KEY,
            payload: {
                key: SIDEBAR_COLLAPSED_KEY,
                value: !state[SIDEBAR_COLLAPSED_KEY]
            }
        })
    };

    const chevronRight = (
        <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="Arrow / Chevron_Right_Duo">
                <path id="Vector" d="M13 8L17 12L13 16M7 8L11 12L7 16" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
        </svg>
    );
    
    const chevronLeft = (
        <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="Arrow / Chevron_Left_Duo">
                <path id="Vector" d="M17 16L13 12L17 8M11 16L7 12L11 8" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
        </svg>
    );
    return (
        <div className='flex flex-col flex-nowrap p-2 w-full h-full text-center overflow-hidden'>
            <div className="flex justify-between">
                <div className="grow text-center">
                    <h1 className='font-bold text-2xl transition-transform'>{state[SIDEBAR_COLLAPSED_KEY] ? 'DS' : 'DexScanner'}</h1>
                </div>
                <button className="self-start" onClick={handleToggleSidebar} title="Toggle Side Menu">
                    {state.SIDEBAR_COLLAPSED ? chevronRight : chevronLeft }
                </button>
            </div>
        </div>
    )
}
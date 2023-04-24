import React, { useContext } from 'react';
import { DESKTOP_LAYOUT_SETTINGS_KEYS, DesktopLayoutLocalStorageContext, UPDATE_KEY } from '../context/LocalStorageContexts';



export default function Sidebar() {
    const { state, dispatch } = useContext(DesktopLayoutLocalStorageContext);
    const SIDEBAR_COLLAPSED_KEY = DESKTOP_LAYOUT_SETTINGS_KEYS.SIDEBAR_COLLAPSED;
    const handleToggleSidebar = () => {
      dispatch({
        type: UPDATE_KEY,
        payload: {
            key: SIDEBAR_COLLAPSED_KEY,
            value: !state[SIDEBAR_COLLAPSED_KEY]
        }
      })
    };
    
    return (
        <div className='p-2 w-full h-full text-center overflow-hidden'>
            <h1 className='font-bold text-2xl transition-transform'>{state[SIDEBAR_COLLAPSED_KEY] ? 'DS' : 'DexScanner'}</h1>
            <button className='p-1 rounded-md shadow-2xl bg-blue-500' onClick={handleToggleSidebar}>
                Collapse
            </button>
        </div>
    )
    
}
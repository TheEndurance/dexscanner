import React, { useContext } from 'react';

import { AppContext, AppDispatchContext } from '../context/AppContext';

export default function Sidebar() {
    const state = useContext(AppContext);
    const dispatch = useContext(AppDispatchContext);

    const handleToggleSidebar = () => {
      dispatch({ type: 'TOGGLE_SIDEBAR' });
    };
    
    return (
        <div className={'p-2 text-center shadow-lg dark:bg-slate-950 overflow-hidden transition-all duration-300 text-black dark:text-white hidden md:block ' + (state.sidebarCollapsed ? 'md:w-1/12' : 'md:w-2/12')}>
            <h1 className='font-bold text-2xl transition-transform'>{state.sidebarCollapsed ? 'DS' : 'DexScanner'}</h1>
            <button className='p-1 rounded-md shadow-2xl bg-blue-500' onClick={handleToggleSidebar}>
                Collapse
            </button>
            <p>Sidebar is {state.sidebarCollapsed ? 'collapsed' : 'not collapsed'}</p>
        </div>
    )
}
import React, { useContext } from 'react';

import { AppContext, AppDispatchContext, toggleSideBar } from '../context/AppContext';

export default function Sidebar() {
    const appState = useContext(AppContext);
    const dispatch = useContext(AppDispatchContext);

    const handleToggleSidebar = () => {
      const toggleSidebarAction = toggleSideBar();
      dispatch(toggleSidebarAction);
    };
    
    return (
        <div className='p-2 w-full h-full text-center overflow-hidden'>
            <h1 className='font-bold text-2xl transition-transform'>{appState.isSidebarOpen ? 'DexScanner' : 'DS'}</h1>
            <button className='p-1 rounded-md shadow-2xl bg-blue-500' onClick={handleToggleSidebar}>
                Collapse
            </button>
        </div>
    )
    
}
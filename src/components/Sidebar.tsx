import React, { useContext } from 'react';

import { AppContext, AppDispatchContext } from '../context/AppContext';

export default function Sidebar() {
    const state = useContext(AppContext);
    const dispatch = useContext(AppDispatchContext);

    const handleToggleSidebar = () => {
      dispatch({ type: 'TOGGLE_SIDEBAR' });
    };
    
    return (
        <div>
            <button onClick={handleToggleSidebar}>
                Toggle sidebar
            </button>
            <p>Sidebar is {state.sidebarCollapsed ? 'collapsed' : 'not collapsed'}</p>
        </div>
    )
}
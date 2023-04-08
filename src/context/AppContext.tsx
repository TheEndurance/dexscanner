import React, { createContext, useReducer } from 'react';

export interface AppState {
 sidebarCollapsed: boolean;
}

const initialAppState : AppState = { 
    sidebarCollapsed: false
};

type AppAction =
| { type: 'TOGGLE_SIDEBAR' }
| { type: 'TOGGLE_LIGHTMODE' }

// contexts
export const AppContext = createContext<AppState>(initialAppState);
export const AppDispatchContext = createContext<Function>(() => {});

// reducers
export const AppReducer = (state: AppState, action: AppAction) => {
    switch (action.type) {
    case 'TOGGLE_SIDEBAR':
        return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    default:
        return state;
    }
};

// provider
export function AppContextProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(
        AppReducer, 
        initialAppState
    );
    
    return (
        <AppContext.Provider value={state}>
            <AppDispatchContext.Provider value={dispatch}>
                {children}
            </AppDispatchContext.Provider>
        </AppContext.Provider>
    )
}

  
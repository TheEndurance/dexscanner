import React, { createContext, useReducer } from 'react';

export interface AppState {
    isSidebarOpen: boolean;
    isChartVisible: boolean;
    isTradeHistoryVisible: boolean;
    isMobile: boolean;
}

const initialAppState: AppState = {
    isSidebarOpen: true,
    isChartVisible: true,
    isTradeHistoryVisible: false,
    isMobile: false
};

enum ActionType {
    SET_DISPLAY_MODE = 'SET_DISPLAY_MODE',
    TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR',
    DISPLAY_CHART = 'DISPLAY_CHART',
    DISPLAY_TRADE_HISTORY = 'DISPLAY_TRADE_HISTORY'
}

enum DisplayMode {
    MOBILE = 'MOBILE',
    DEKSTOP = 'DESKTOP'
}

interface Action {
    type: string;
    payload: any
}

interface SetDisplayModeAction extends Action {
    type: ActionType.SET_DISPLAY_MODE;
    payload: DisplayMode;
}

interface ToggleSidebarAction extends Action {
    type: ActionType.TOGGLE_SIDEBAR;
    payload: null
}

interface DisplayChartAction extends Action {
    type: ActionType.DISPLAY_CHART;
    payload: boolean;
}

interface DisplayTradeHistoryAction extends Action {
    type: ActionType.DISPLAY_TRADE_HISTORY;
    payload: boolean;
}

export function toggleSideBar(): ToggleSidebarAction {
    return {
        type: ActionType.TOGGLE_SIDEBAR,
        payload: null
    };
}

export function displayChart(display: boolean): DisplayChartAction {
    return {
        type: ActionType.DISPLAY_CHART,
        payload: display
    };
}

export function displayTradeHistory(display: boolean): DisplayTradeHistoryAction {
    return {
        type: ActionType.DISPLAY_TRADE_HISTORY,
        payload: display
    };
}

export function setDisplayMode(displayMode: DisplayMode): SetDisplayModeAction {
    return {
        type: ActionType.SET_DISPLAY_MODE,
        payload: displayMode
    };
}

// contexts
export const AppContext = createContext<AppState>(initialAppState);
export const AppDispatchContext = createContext<Function>(() => { });

// reducers
export const AppReducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
        case ActionType.TOGGLE_SIDEBAR:
            return { ...state, isSidebarOpen: !state.isSidebarOpen };
        case ActionType.DISPLAY_CHART:
            return { ...state, isChartVisible: action.payload };
        case ActionType.DISPLAY_TRADE_HISTORY:
            return { ...state, isTradeHistoryVisible: action.payload };
        case ActionType.SET_DISPLAY_MODE:
            return { ...state, isMobile: action.payload }
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


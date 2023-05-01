import { createContext, useEffect, useMemo, useReducer } from "react";

export const UPDATE_KEY = "UPDATE_KEY";
const DARK_MODE = "DARK_MODE";


// these are the primary keys by which local storage is shared, i.e CHART_TRADES will be the key for all settings related to CHART_TRADES_SETTINGS_KEYS
enum LOCAL_STORAGE_STATE_PRIMARY_KEYS {
    CHART_TRADES = "CHART_TRADES",
    LAYOUT = "LAYOUT"
}

// these are the keys for settings related to the main display which shows charts and trades
export enum CHART_TRADES_SETTINGS_KEYS {
    SHOW_TRADES = "SHOW_TRADES",
    SHOW_CHART = "SHOW_CHART"
}

// these are the keys for settings related to layout on desktop
export enum LAYOUT_SETTINGS_KEYS {
    SIDEBAR_COLLAPSED = "SIDEBAR_COLLAPSED"
}

type LocalStorageStateSettingsKeys = CHART_TRADES_SETTINGS_KEYS | LAYOUT_SETTINGS_KEYS;


// ------------------------------------------- STATE INTERFACES -------------------------------------------
export type ChartTradesLocalStorageState = {
    [key in CHART_TRADES_SETTINGS_KEYS]: boolean
}

export type LayoutLocalStorageState = {
    [key in LAYOUT_SETTINGS_KEYS]: boolean
}

type LocalStorageState = ChartTradesLocalStorageState | LayoutLocalStorageState;


// -------------------------------------------- DEFAULT STATES --------------------------------------------
const defaultChartTradesState = {
    [CHART_TRADES_SETTINGS_KEYS.SHOW_CHART]: true,
    [CHART_TRADES_SETTINGS_KEYS.SHOW_TRADES]: false
}

const defaultLayoutState = {
    [LAYOUT_SETTINGS_KEYS.SIDEBAR_COLLAPSED]: false
}


// ------------------------------------------ DEFAULT STATE INITS ------------------------------------------
function initLocalStorageState(defaultLocalStorageState: LocalStorageState, key: LOCAL_STORAGE_STATE_PRIMARY_KEYS) {
    try {
        const parsed = JSON.parse(window.localStorage.getItem(key) || "");
        if (!parsed) {
            return defaultLocalStorageState
        } else {
            return { ...defaultLocalStorageState, ...parsed }
        }
    } catch {
        return defaultLocalStorageState
    }
}

function initChartTradesLocalStorageState(): ChartTradesLocalStorageState {
    return initLocalStorageState(defaultChartTradesState, LOCAL_STORAGE_STATE_PRIMARY_KEYS.CHART_TRADES);
}

function initLayoutLocalStorageState(): LayoutLocalStorageState {
    return initLocalStorageState(defaultLayoutState, LOCAL_STORAGE_STATE_PRIMARY_KEYS.LAYOUT);
}

// ------------------------------------------- PROVIDER INTERFACES -------------------------------------------
export interface ChartTradesLocalStorageStateProvider {
    state: ChartTradesLocalStorageState,
    dispatch: Function
}

export interface LayoutLocalStorageStateProvider {
    state: LayoutLocalStorageState,
    dispatch: Function
}

// ------------------------------------------------- CONTEXTS -------------------------------------------------

export const ChartTradesLocalStorageContext = createContext<ChartTradesLocalStorageStateProvider>({ state: defaultChartTradesState, dispatch: () => { } });
export const LayoutLocalStorageContext = createContext<LayoutLocalStorageStateProvider>({state: defaultLayoutState, dispatch: () => { }});

// ------------------------------------------------- REDUCERS -------------------------------------------------

function LocalStorageReducer(state: any, { type, payload }: { type: string, payload: { key: LocalStorageStateSettingsKeys, value: boolean } }) {
    switch (type) {
        case UPDATE_KEY: {
            const { key, value } = payload
            if (!Object.keys(state).some((k) => k === key)) {
                throw Error(`Unexpected key in LocalStorageContext reducer: '${key}'.`)
            } else {
                return {
                    ...state,
                    [key]: value
                }
            }
        }
        default: {
            throw Error(`Unexpected action type in LocalStorageContext reducer: '${type}'.`)
        }
    }
}

function ChartTradesLocalStorageReducer(state: ChartTradesLocalStorageState, { type, payload }: { type: string, payload: { key: CHART_TRADES_SETTINGS_KEYS, value: boolean } }): ChartTradesLocalStorageState {
    return LocalStorageReducer(state, { type, payload });
}

function LayoutLocalStorageReducer(state: LayoutLocalStorageState, { type, payload }: { type: string, payload: { key: LAYOUT_SETTINGS_KEYS, value: boolean } }): LayoutLocalStorageState {
    return LocalStorageReducer(state, { type, payload });
}

// -------------------------------------------------- PROVIDERS --------------------------------------------------
export function ChartTradesLocalStorageContextProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(
        ChartTradesLocalStorageReducer,
        undefined,
        initChartTradesLocalStorageState
    );

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_STATE_PRIMARY_KEYS.CHART_TRADES, JSON.stringify(state));
    }, [state]);

    const values = useMemo(() => ({
        state,
        dispatch
    }), [state, dispatch]);

    return (
        <ChartTradesLocalStorageContext.Provider value={values}>
            {children}
        </ChartTradesLocalStorageContext.Provider>
    )
}

export function LayoutLocalStorageContextProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(
        LayoutLocalStorageReducer,
        undefined,
        initLayoutLocalStorageState
    );

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_STATE_PRIMARY_KEYS.LAYOUT, JSON.stringify(state));
    }, [state]);

    const values = useMemo(() => ({
        state,
        dispatch
    }), [state, dispatch]);

    return (
        <LayoutLocalStorageContext.Provider value={values}>
            {children}
        </LayoutLocalStorageContext.Provider>
    )
}
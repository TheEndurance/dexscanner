import { useContext } from "react";
import { AppDispatchContext, displayTradeHistory, displayChart, AppContext } from "../context/AppContext";


export default function MobileControls() {
    const appState = useContext(AppContext);
    const dispatch = useContext(AppDispatchContext);
    const showChartAndTradeHistory = function (display: boolean): void {
        const displayTradeHistoryAction = displayTradeHistory(display);
        const displayChartAction = displayChart(display);
        dispatch(displayTradeHistoryAction);
        dispatch(displayChartAction);
    }
    return (
        <div className="flex w-full h-full gap-3 p-2 dark:bg-slate-400 dark:hover:bg-slate-200 cursor-pointer justify-center items-center"
            onClick={() => appState.isChartVisible ? showChartAndTradeHistory(false) : showChartAndTradeHistory(true)}>
            <svg className={appState.isChartVisible ? "hidden" : "inline-block"} xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 24 24" fill="none">
                <g id="Arrow / Chevron_Up">
                    <path id="Vector" d="M5 16L12 9L19 16" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </g>
            </svg>
            <svg className={appState.isChartVisible ? "inline-block" : "hidden"} xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 20 20" fill="none">
                <path stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7l6 6 6-6" />
            </svg>
            <h1 className="text-sm font-bold text-slate-950">{appState.isChartVisible ? "HIDE CHART & TRADING HISTORY" : "SHOW CHART & TRADING HISTORY"}</h1>
        </div>
    )
}
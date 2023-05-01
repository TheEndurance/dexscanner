import React, { useContext } from "react";
import ControlledCheckbox from "./ControlledCheckbox";
import { CHART_TRADES_SETTINGS_KEYS, ChartTradesLocalStorageContext, UPDATE_KEY } from "../context/LocalStorageContexts";



export default function DesktopControls() {
    const { state, dispatch } = useContext(ChartTradesLocalStorageContext);
    const { SHOW_CHART, SHOW_TRADES } = CHART_TRADES_SETTINGS_KEYS;
    const onChangeChart = function (e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.checked;
        dispatch({
            type: UPDATE_KEY,
            payload: {
                key: SHOW_CHART,
                value
            }
        });
    }
    const onChangeTrades = function (e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.checked;
        dispatch({
            type: UPDATE_KEY,
            payload: {
                key: SHOW_TRADES,
                value
            }
        });
    }

    return (
        <div className={"flex justify-start gap-3 items-center w-full p-2 h-full"}>
            <ControlledCheckbox
                label="SHOW TRADES"
                labelPosition="RIGHT"
                checked={state[SHOW_TRADES]}
                disabled={state[SHOW_TRADES] && !state[SHOW_CHART]}
                labelCSSClasses="text-slate-300 text-xs font-bold"
                onChange={onChangeTrades}
            />
            <ControlledCheckbox
                label="SHOW CHART"
                labelPosition="RIGHT"
                checked={state[SHOW_CHART]}
                disabled={state[SHOW_CHART] && !state[SHOW_TRADES]}
                labelCSSClasses="text-slate-300 text-xs font-bold"
                onChange={onChangeChart}
            />
        </div>
    )
}
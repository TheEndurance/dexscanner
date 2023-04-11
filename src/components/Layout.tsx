
import React, { useContext } from "react";
import { AppContext, AppState } from '../context/AppContext';
import Sidebar from "./Sidebar";
import Chart from "./Chart";
import Infobar from "./Infobar";



export default function Layout() {
    const state = useContext(AppContext)
    return (
        <div className="flex md:flex-row flex-col w-full h-full dark:bg-slate-800">
            <Sidebar />
            <Chart />
            <Infobar />
        </div>
    )
}


import { ReactElement, useContext } from "react";



import { LAYOUT_SETTINGS_KEYS, LayoutLocalStorageContext } from "../context/LocalStorageContexts";



export default function SidebarMainAsideLayout({ children }: { children: Array<ReactElement>}) {
    const [sidebar,main,aside] = children;
    const { state } = useContext(LayoutLocalStorageContext);
    const SIDEBAR_COLLAPSED_KEY = LAYOUT_SETTINGS_KEYS.SIDEBAR_COLLAPSED;

    return (
        <div className="flex flex-row w-full h-full dark:bg-gray-950 text-slate-900 dark:text-slate-300">
            <div className={"grow-0 shrink-0 dark:border-r-gray-700 border-r h-full" + " " + (state[SIDEBAR_COLLAPSED_KEY] ? "basis-24" : "basis-48")}>
                {sidebar}
            </div>
            <div className={"h-full grow shrink basis-auto overflow-hidden"}>
                {main}
            </div>
            <div className={"grow-0 shrink-0 basis-64 h-full dark:border-l-gray-700 border-l"}>
                {aside}
            </div>
        </div>
    )
}

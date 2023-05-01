import { useContext } from "react";
import { LayoutLocalStorageContext } from "../context/LocalStorageContexts";
import { Chain } from "../data/chains";
import { Link } from "react-router-dom";
import Image from "./Image";

export interface ChainListProps {
    chains: Chain[],
    linkCssClasses?: string,
    textCssClasses?: string
}

export default function ChainList({ chains, linkCssClasses, textCssClasses }: ChainListProps) {
    const { state } = useContext(LayoutLocalStorageContext);
    const list = chains.map((chain, index) => {
        return (
            <Link key={index} className={linkCssClasses} to={"/" + chain.name} replace>
                <Image fileName={chain.fileName} alt={chain.alt} width={26} />
                <p className={textCssClasses + " " + (state.SIDEBAR_COLLAPSED ? "hidden" : "")}>{chain.label}</p>
            </Link>
        )
    })
    return (
        <>
            {list}
        </>
    )
}
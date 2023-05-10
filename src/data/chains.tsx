export interface Chain {
    name: string,
    label: string,
    fileName: string,
    alt: string,
    width: number
}

const WIDTH = 24;

export async function getChains(): Promise<Chain[]> {
    // maybe call an api to get the list of available chains
    return [
        {
            name: "arbitrum",
            label: "Arbitrum",
            fileName: "arbitrum-logo.svg",
            alt: "Arbitrum Logo",
            width: WIDTH
        },
        {
            name: "ethereum",
            label: "Ethereum",
            fileName: "ethereum-logo.svg",
            alt: "Ethereum Logo",
            width: WIDTH
        }
    ]
}

export const DEXByChain = {
    "arbitrum": [ "uniswap", "sushiswap" ]
}


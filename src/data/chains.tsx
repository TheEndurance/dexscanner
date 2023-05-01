export interface Chain {
    name: string,
    label: string,
    fileName: string,
    alt: string
}

export async function getChains(): Promise<Chain[]> {
    // maybe call an api to get the list of available chains
    return [
        {
            name: "arbitrum",
            label: "Arbitrum",
            fileName: "arbitrum-logo.png",
            alt: "Arbitrum Logo"
        }
    ]
}


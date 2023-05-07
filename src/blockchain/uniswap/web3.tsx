// import Web3 from "web3";
// import { abi as FACTORY_ABI } from '@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json'
// import { abi as POOL_ABI } from "@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json";

// const web3 = new Web3("https://wispy-evocative-pallet.arbitrum-mainnet.discover.quiknode.pro/806ecea7f1977508c2bd1ee28328239cb878382f");
// // Use the Uniswap V2 factory contract address deployed on Arbitrum
// const uniswapFactoryAddress = "0x1F98431c8aD98523631AE4a59f267346ea31F984";


// // Create a contract instance for the Uniswap V2 factory on Arbitrum
// const uniswapFactoryContract = new web3.eth.Contract(FACTORY_ABI, uniswapFactoryAddress);
// // console.log(uniswapFactoryContract);


// const endBlock = await web3.eth.getBlockNumber();
// // console.log(startBlock);
// // Get all 'poolCreated' events since the start block
// const events = await uniswapFactoryContract.getPastEvents('PoolCreated', {
//     fromBlock: 0,
//     toBlock: 9999
// });

// // Log the events to console
// console.log(events);

// for (let event of events) {
//     const { token0, token1, pool } = event.returnValues;
//     const uniswapPoolContract = new web3.eth.Contract(POOL_ABI, pool);
//     const promises = [];
//     for (let i = 0; i < endBlock; i += 10000) {
//         promises.push(uniswapPoolContract.getPastEvents("Swap", {
//             fromBlock: i,
//             toBlock: i + 10000
//         }));
//         await new Promise(resolve => setTimeout(resolve, 50));
//     }
//     await Promise.all(promises);
//     const res  = await uniswapPoolContract.methods.slot0().call();
//     console.log(res);
// }


///wss://api.thegraph.com/subgraphs/name/messari/uniswap-v3-arbitrum/graphql
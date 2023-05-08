import { CodegenConfig } from '@graphql-codegen/cli'
 
const config: CodegenConfig = {
//   schema: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
//   documents: ['src/**/*.tsx'],
//   ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './src/gql/': {
      schema: "https://api.thegraph.com/subgraphs/name/messari/uniswap-v3-arbitrum",
      preset: 'client'
    }
  }
}
 
export default config
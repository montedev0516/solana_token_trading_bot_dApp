import { Token, TradeParams } from "@/utils/types";
import { deserializeTransaction } from "./sign-transaction";

// const HYGRAPH_ENDPOINT = 'http://46.4.5.53:4000/graphql';  // Replace with your endpoint
const HYGRAPH_ENDPOINT = 'https://gibbon-direct-abnormally.ngrok-free.app/graphql';  // Replace with your endpoint

const GET_ALL_Token_QUERY = `
    query { tokens { address name symbol logoURI decimals price lastTradeUnixTime liquidity mc v24hChangePercent v24hUSD } }
    `;
    
// const GET_SINGLE_POST_QUERY = `
// query GET_SINGLE_POST($slug: String!) {
//     post(where: { slug: $slug }) {
//     title
//     summary
//     id
//     createdAt
//     coverImage {
//         url(transformation: { image: { resize: { height: 768, width: 1366 } } })
//     }
//     content {
//         json
//     }
//     author {
//         id
//         linkedIn
//         twitter
//         name
//         photo {
//         url
//         }
//     }
//     date
//     }
// }
// `;
    
// const GET_TAGS_QUERY = `
// query GET_TAGS {
//     categories {
//     name
//     slug
//     }
// }
// `;
    
// const GET_POST_FOR_TAG_QUERY = `
// query GetCategoryPost($slug: String!) {
//     postsConnection(where: { categories_some: { slug: $slug } }) {
//     edges {
//         cursor
//         node {
//         author {
//             bio
//             name
//             id
//             photo {
//             url
//             }
//         }
//         createdAt
//         slug
//         title
//         summary
//         coverImage {
//             url
//         }
//         categories {
//             name
//             slug
//         }
//         date
//         }
//     }
//     }
// }
// `;

export const getAllTokenList = async (): Promise<Token[]> => {
    try{
        const res = await fetch(HYGRAPH_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'query': GET_ALL_Token_QUERY
            })
        });
        const tokenList = await res.json();

        let tokens :Token[] = [];
        tokenList.data.tokens?.map((data, id)=>{
            const token = {
                    id: ""+id,
                    name: data.name,
                    symbol: data.symbol,
                    price: data.price,
                    priceChange24h: data.v24hChangePercent,
                    volume24h: data.v24hUSD,
                    logoUrl: data.logoURI,
                    address: data.address,
                    decimal: data.decimals
            }
            tokens.push(token);
        })
        console.log(tokens);

        return tokens;
        
    }
    catch(err:any){
        throw new Error(err.message);
    }
}

export const buySellGraph = async (param: TradeParams) => {
    const BuySellQuery = `
    query { trade(type: \"${param.action}\", address: \"${param.tokenAddress}\", publicKey: \"${param.walletAddress}\", slippage: ${param.slippageTolerance}, amount: ${param.amount*Math.pow(10,param.decimal)}) }
    `;
    console.log(BuySellQuery);
    try{
        const res = await fetch(HYGRAPH_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'query': BuySellQuery
            })
        });
        const swapTransaction = await res.json();
        
        console.log(swapTransaction);

        const transaction = await deserializeTransaction(swapTransaction.data.trade, param.wallet);

        param.wallet.signTransaction(transaction);
        

        return transaction
    }
    catch(err:any){
        throw new Error(err.message);
    }
}

export const addNewToken = async (token: string, id:number) =>{
    const newTokenQuery = `
    query { token(address: \"${token}\") {address name symbol decimals logoURI price lastTradeUnixTime liquidity mc v24hChangePercent v24hUSD} }
    `;
    try{
        const res = await fetch(HYGRAPH_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'query': newTokenQuery
            })
        });
        const newTokenJson = await res.json();
        const newToken = {
            id: ""+id,
            name: newTokenJson.data.token.name,
            symbol: newTokenJson.data.token.symbol,
            price: newTokenJson.data.token.price,
            priceChange24h: newTokenJson.data.token.v24hChangePercent,
            volume24h: newTokenJson.data.token.v24hUSD,
            logoUrl: newTokenJson.data.token.logoURI,
            address: newTokenJson.data.token.address,
            decimal: newTokenJson.data.token.decimals
    }

        return newToken;
    }
    catch(err:any){
        throw new Error(err.message);
    }
}

// try {
//     const response = await fetch(HYGRAPH_ENDPOINT, {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//         query: GET_ALL_Token_QUERY
//     })
//     });
    
    
    
    
//     const response = await fetch(HYGRAPH_ENDPOINT, {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//         query: GET_SINGLE_POST_QUERY,
//         variables: {
//         slug: 'usher-in-a-new-era-of-footwear-innovation-with-online-review-analytics'
//         }
//     })
//     });
    
    
    

//     const { data } = await response.json();

//     if (data && data.postsConnection) {
//     console.log('Posts:', data.postsConnection.edges);
//     return data.postsConnection.edges;
//     } else {
//     console.error('Failed to fetch posts:', data);
//     }
// } catch (error) {
//     console.error('Error fetching posts:', error);
// }

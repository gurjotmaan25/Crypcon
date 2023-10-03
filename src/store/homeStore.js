import { create } from 'zustand'
import axios from "axios";
import debounce from '../helpers/debounce';

const homeStore = create((set) => ({
    coins: [],
    trending: [],
    query: '',
    searching : false,
    searched: false,

    setQuery :(e) =>{
        set({query: e.target.value})
        homeStore.getState().searchCoins()
    },

    searchCoins: debounce( async()=>{
        set({searching:true})
        const {query, trending} = homeStore.getState() 

        if(query.length > 2){
            const res = await axios.get(`https://api.coingecko.com/api/v3/search?query=${query}`)
            // console.log(res.data);
            const coins = res.data.coins.map(coin =>{
                return {
                    name: coin.name,
                    image: coin.large,
                    id: coin.id
                }
            })
            console.log(res);
            set({coins, searching : false, searched:true})
        }else{
            set({coins: trending, searching : false, searched: false})
        }
    },500),

    fetchCoins: async () => {
        const [res, btcRes] = await Promise.all([
            axios.get('https://api.coingecko.com/api/v3/search/trending'),
            axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd
            `)
        ])
        const btcP = btcRes.data.bitcoin.usd
        // console.log(btcP);
        const coins = res.data.coins.map(coin =>{
            return{
                name: coin.item.name,
                image: coin.item.large,
                id: coin.item.id,
                priceBtc: coin.item.price_btc.toFixed(10),
                priceUsd: (coin.item.price_btc * btcP).toFixed(10)
            }
        })
        // console.log(res);f
        set({coins, trending: coins})
    }
}))

export default homeStore
import { create } from 'zustand'
import axios from "axios";

const showStore = create((set) => ({
    graphData:[],
    coinData: '',
    reset:()=>{
        set({graphData: [], coinData: ''})
    },
    watchlist: [],

    addToWatchlist: (coin) => {
        set((state) => ({
            watchlist :[...state.watchlist, coin],
        }))
    },
    removeFromWatchlist: (coinId) => {
        set((state) => ({
            watchlist: state.watchlist.filter((coin) => coin.id !== coinId),
        }));
    },

    fetchData: async(id)=>{
        const [graphRes, dataRes] = await Promise.all([
            axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=1500`),
            axios.get(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&market_data=true`)
        ])

        const graphData = graphRes.data.prices.map((price)=>{
            const [timestamp, p] = price
            const date = new Date(timestamp).toLocaleDateString("en-us")
            return {
                Date: date,
                Price: p,
                pv: 4300,
                amt: 2100,
            }
        })
        // console.log(dataRes);
         set({graphData, coinData: dataRes.data})
    }
}))

export default showStore
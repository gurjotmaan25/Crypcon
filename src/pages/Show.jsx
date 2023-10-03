import React, { useState, useEffect } from 'react';
import showStore from '../store/showStore';
import { useParams } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Header from '../components/Header';
import axios from 'axios'
import { useAuth } from '../context/auth';
import { toast } from 'react-hot-toast'


export default function Show() {
    const store = showStore();
    const params = useParams();


    const [butText, setButText] = useState('Click to see Price in INR');
    const [curr, setCurr] = useState('$');
    const [pri1, setPri1] = useState(null);
    const [pri2, setPri2] = useState(null);
    const [pri3, setPri3] = useState(null);
    const [loading, setLoading] = useState(true);

    const fun1 = () => {
        if (butText === 'Click to see Price in INR') {
            setButText('Click to see Price in USD');
        } else {
            setButText('Click to see Price in INR');
        }
    };

    const fun2 = () => {
        if (curr === '$') {
            setCurr('₹');
            setPri1(store.coinData.market_data ? store.coinData.market_data.current_price.inr : null);
            setPri2(store.coinData.market_data ? store.coinData.market_data.high_24h.inr : null);
            setPri3(store.coinData.market_data ? store.coinData.market_data.low_24h.inr : null);
        } else {
            setCurr('$');
            setPri1(store.coinData.market_data ? store.coinData.market_data.current_price.usd : null);
            setPri2(store.coinData.market_data ? store.coinData.market_data.high_24h.usd : null);
            setPri3(store.coinData.market_data ? store.coinData.market_data.low_24h.usd : null);
        }
    };
    const [graphData, setGraphData] = useState()
    const [yAxisDomain, setYAxisDomain] = useState()
    const [activeInterval, setActiveInterval] = useState('1d')
    const fetchDataWithInterval = async (interval) => {
        try {
            const apiURL = `https://api.coingecko.com/api/v3/coins/${params.id}/market_chart?vs_currency=usd&days=${interval}`;
            const graphRes = await axios.get(apiURL)
            const prices = graphRes.data.prices.map((price) => price[1]);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            setGraphData(graphRes.data.prices.map((price)=>{
                const [timestamp, p] = price
                const date = new Date(timestamp).toLocaleDateString("en-us")
                return {
                    Date: date,
                    Price: p,
                    pv: 4300,
                    amt: 2100,
                }
            }))
            setYAxisDomain([minPrice, maxPrice]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const handleIntervalButtonClick = (interval) => {
        setActiveInterval(interval);
        fetchDataWithInterval(interval);
    };

    const fetchData = async () => {
        try {
            await store.fetchData(params.id);
            setPri1(store.coinData.market_data ? store.coinData.market_data.current_price.usd : null);
            setPri2(store.coinData.market_data ? store.coinData.market_data.high_24h.usd : null);
            setPri3(store.coinData.market_data ? store.coinData.market_data.low_24h.usd : null);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleClick = () => {
        fun1();
        fun2();
    };

    const [inWatchlist, setInWatchlist] = useState(false);
    const [auth] = useAuth()
    const addToWatchlist = async (coinId) => {
        try {
            const coinData = {
                name: store.coinData.name,   // Name of the coin
                id: store.coinData.id,       // Unique ID of the coin
                image: store.coinData.image.large, // URL of the coin's image
              };
            // Make an HTTP POST request to your server to add the coin
            // await axios.post(`/api/user/${auth.user._id}/watchlist/add/${store.coinData.name}`);
            const res = await axios.post(`/api/user/${auth.user._id}/watchlist/add/`, coinData);
            const currentWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
            if (!currentWatchlist.includes(coinId)) {
                currentWatchlist.push(coinId);
                localStorage.setItem('watchlist', JSON.stringify(currentWatchlist));
            }
            // Set the state to indicate that the coin is in the user's watchlist
            toast.success(res.data.message)

            setInWatchlist(true);
        } catch (error) {
            console.error('Error adding coin to watchlist:', error);
        }
    };
    const deleteFromWatchlist = async (coinId) => {
        try {
            // Make an HTTP POST request to your server to remove the coin
            const res = await axios.post(`/api/user/${auth.user._id}/watchlist/remove/${coinId}`);
            const currentWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
            const index = currentWatchlist.indexOf(coinId);
            if (index !== -1) {
                currentWatchlist.splice(index, 1);
                localStorage.setItem('watchlist', JSON.stringify(currentWatchlist));
            }
            toast.success(res.data.message)
            // Set the state to indicate that the coin is no longer in the user's watchlist
            setInWatchlist(false);
        } catch (error) {
            console.error('Error removing coin from watchlist:', error);
        }
    };
    const toggleWatchlist = () => {
        if (inWatchlist) {
            deleteFromWatchlist(store.coinData.id);
            setInWatchlist(false);
        } else {
            addToWatchlist(store.coinData.id);
            setInWatchlist(true);
        }
    };
    const checkIfInWatchlist = async () => {
        try {
            const response = await axios.get(`/api/user/${auth.user._id}/watchlist/check/${store.coinData.id}`);
            setInWatchlist(response.data.inWatchlist); // Update the state based on the response
        } catch (error) {
            console.error('Error checking if in watchlist:', error);
        }
    };
    useEffect(() => {
        fetchData();
        fetchDataWithInterval('1d')
        checkIfInWatchlist()
      }, [params.id, store.coinData.id]);

    return (
        <div className='show-body'>
            <Header />
            {loading ? ( // Display loading indicator while loading
                <p>Loading...</p>
            ) : (
                <>
                    {store.coinData.image && (
                        <header className="show-head">
                            <img src={store.coinData.image.large} alt="loading" />
                            {store.coinData.name.length > 15 ? <h3>{store.coinData.name} ({store.coinData.symbol})</h3> : <h2>{store.coinData.name} ({store.coinData.symbol})</h2>}
                        </header>
                    )}
                    <div className="width">
                        <div className="show-graph">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    // data={store.graphData}
                                    data={graphData}
                                    margin={{
                                        top: 10,
                                        right: 30,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="1 1" />
                                    {/* <XAxis dataKey="Date" tick={{ fill: 'white' }} />
                                    <YAxis tick={{ fill: 'white' }} />
                                    <Tooltip labelStyle={{ color: 'white' }} contentStyle={{ backgroundColor: 'black', border: '1px solid white' }} />
                                    <Area type="monotone" dataKey="Price" stroke="white" fill="#6A1B9A" /> */}

                                    <XAxis dataKey="Date" tick={{ fontSize: '12px' }} />
                                    <YAxis 
                                        label={{
                                            // value: 'Custom Label',
                                            angle: -90,
                                            position: 'insideLeft',
                                            offset: 1, // Adjust the offset as needed
                                          }}
                                          domain={yAxisDomain} // Set the Y-axis domain here
                                          scale="log" 
                                    />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="Price" stroke="black" fill="#6A1B9A" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="graphbtn">
                            <button className={activeInterval === '1d' ? 'active-button' : ''} onClick={() => handleIntervalButtonClick('1d')}>1d</button>
                            <button className={activeInterval === '7d' ? 'active-button' : ''} onClick={() => handleIntervalButtonClick('7d')}>7d</button>
                            <button className={activeInterval === '30d' ? 'active-button' : ''} onClick={() => handleIntervalButtonClick('30d')}>1m</button>
                            <button className={activeInterval === '365d' ? 'active-button' : ''} onClick={() => handleIntervalButtonClick('365d')}>1y</button>
                            <button className={activeInterval === '1825d' ? 'active-button' : ''} onClick={() => handleIntervalButtonClick('1825d')}>5y</button>
                        </div>
                    </div>
                    {auth.user && (
                        <div className="listbtn">
                            <button onClick={toggleWatchlist}>
                                {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                            </button>
                        </div>
                    )}
                    <div className="show-details">
                        <h2>Details</h2>
                        {store.coinData.market_data && (
                            <div className="detail-item">
                                <h4>Current Price</h4>
                                <span>{curr} {pri1}</span>
                            </div>
                        )}
                        <div className="detail-item">
                            <h4>Market Cap Rank</h4>
                            <span> {store.coinData.market_cap_rank} </span>
                        </div>
                        {store.coinData.market_data && (
                            <div className="detail-item">
                                <h4>24Hr High</h4>
                                <span>{curr} {pri2}</span>
                            </div>
                        )}
                        {store.coinData.market_data && (
                            <div className="detail-item">
                                <h4>24Hr Low</h4>
                                <span>{curr} {pri3}</span>
                            </div>
                        )}
                        {store.coinData.market_data && (
                            <div className="detail-item">
                                <h4>Circulating Supply</h4>
                                <span> {store.coinData.market_data.circulating_supply} </span>
                            </div>
                        )}
                        <div className="btn">
                            <button onClick={handleClick}>{butText} </button>
                        </div>
                    </div>

                </>
            )}
        </div>
    );
}

import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/auth'
import { toast } from 'react-hot-toast'

export default function Mylist() {
    const [auth] = useAuth()
    const [userWatchlist, setUserWatchlist] = useState([]);

    useEffect(() => {
        if (auth.user) {
            const userId = auth.user._id;

            // Make an API request to fetch the user's watchlist
            axios.get(`/api/user/${userId}/watchlist`)
                .then(response => {
                    // Assuming the API response contains an array of coins in userWatchlist
                    setUserWatchlist(response.data);
                })
                .catch(error => {
                    console.error('Error fetching user watchlist:', error);
                });
        }
    }, [auth]);
    const deleteCoin = async (coinId) => {
        const userId = auth.user._id;

        // Make an API request to delete the coin from the watchlist
        axios.post(`/api/user/${userId}/watchlist/remove/${coinId}`)
            .then(res => {
                // If the deletion is successful, update the userWatchlist state
                setUserWatchlist(userWatchlist.filter(coin => coin.id !== coinId));
                const currentWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
                const index = currentWatchlist.indexOf(coinId);
                if (index !== -1) {
                    currentWatchlist.splice(index, 1);
                    localStorage.setItem('watchlist', JSON.stringify(currentWatchlist));
                }
                toast.success(res.data.message)
            })
            .catch(error => {
                console.error('Error deleting coin from watchlist:', error);
            });
    };
// const fullName = auth.user.name; 
// const nameParts = fullName.split(" ");
// const firstName = nameParts[0];

    return (
        <div className='listhead'>
            <Header />
            <div className='list'>
                {/* <h2>{firstName}'s Watch List</h2> */}
                <h2>My Watch List</h2>
                {userWatchlist.length === 0 ? (<p className='noitem'>No coins are selected</p>) : (<div className='listwidth'>
                    {userWatchlist.map((coin) => (
                        <div className='listfun' key={coin.id}>
                            <div className='listflex'>
                                <Link className='list-items' to={`/${coin.id}`} >
                                    <div className="list-item">
                                        <span> {coin.name.length > 15
                                            ? `${coin.name.slice(0, 15)}...`
                                            : coin.name}
                                        </span>
                                        <img src={coin.image} alt="loading" />
                                    </div>
                                </Link>
                            </div>
                            <div>
                                <button onClick={() => deleteCoin(coin.id)}>Delete</button>
                            </div>

                        </div>
                    ))}
                </div>)}
            </div>
        </div>
    )
}

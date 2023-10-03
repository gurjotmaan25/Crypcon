import React from 'react'
import { Link } from 'react-router-dom'

export default function ListItems({coin}) {
    return (
        <div>
            <div className='home-cryp' >
                
                <Link to={`/${coin.id}`}>
                    <span className='cryp-img'><img src={coin.image} alt='loading...'/></span>
                    <span className='cryp-name'>{coin.name.length > 15 ? `${coin.name.slice(0, 10)}...`: coin.name}</span>
                    {coin.priceBtc && <span className='cryp-pri'>
                        <span className='pri-btc'>{coin.priceBtc} BTC</span>
                        <span className='pri-usd'>{coin.priceUsd} USD</span>
                    </span>}
                </Link>
            </div>
        </div>
    )
}

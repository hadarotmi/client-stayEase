import React from 'react'
import { useSelector } from 'react-redux'
import AdList from './adList'
import Checkout from './addAd/addAd'

function MyAds() {
    const dataUser = useSelector(state => state.userSlice.dataUser)

    return (
        <div>
            <h1 className='center display-4'>המודעות שלי</h1>
            <AdList url={`/ads/userId/${dataUser._id}?page=`} countURL={`/ads/count/userId/${dataUser._id}`} myAds={true}/>
        </div>
    )
}

export default MyAds
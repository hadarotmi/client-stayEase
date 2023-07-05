import { useEffect, useState } from 'react'
import AdList from './adList'
import SearchInput from './searchInput'
import Strip from './strip'
import { useSelector } from 'react-redux'

function Home() {
  const [search, setSearch] = useState({
    checkIn: null,
    checkOut: null,
    minPrice: 0,
    maxPrice: 5000,
    city: "",
    // amenities: [""]
  });
  const dataUser = useSelector(state => state.userSlice.dataUser)

  useEffect(() => {
    
  }, [])


  const doApiSearch = async (s) => {
    const search = {
      checkIn: s.checkIn,
      checkOut: s.checkOut,
      minPrice: s.minPrice,
      maxPrice: s.maxPrice,
      city: s.city,
      // amenities: s.amenities
    }
    // let data = await doApiMethod(`/ads/searchAds`,'POST',search)
    setSearch(search)
  }


  return (
    <div>
      <Strip />
      <SearchInput doApiSearch={doApiSearch} />
      {dataUser? 
      <AdList url={`/adsLikes/myLike/${dataUser._id}?page=`} search={search} countURL={"/ads/count"} />:
      <AdList url={`/ads/all?page=`} search={search} countURL={"/ads/count"} />

      }
     

    </div>
  )
}

export default Home
import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import { OpenStreetMapProvider } from "leaflet-geosearch";



function AdMap(props) {
    const searchProvider = new OpenStreetMapProvider();

    const [pos_ar, setPosAr] = useState([32.1630729, 34.8081001]);
    useEffect(() => {
        console.log(props.address);
        //doApi()
    }, [])
    const doApi = async () => {
        let results = await searchProvider.search({ query: props.address });
        console.log(results);
        setPosAr([results[0].y, results[0].x])
    }
    return (
        <div style={{width:"100%"}}>
            <iframe class="mt-4 responsive-map"  style= {{border:"0",width:"100%",height:"400px"}} frameborder="0" src={`https://www.google.com/maps?q=${pos_ar[0]},34.8081001&z=18&amp;output=embed`}></iframe>
        </div>
    )
}
export default AdMap;
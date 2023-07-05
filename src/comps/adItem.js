import React, { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel'
import { Button, Checkbox } from '@mui/material'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useSelector } from 'react-redux';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { redirect, useNavigate } from 'react-router-dom';
import { doApiMethod } from '../services/apiService';



function AdItem(props) {
    const isLoggedIn = useSelector(state => state.userSlice.isLoggedIn)
    const user = useSelector(state => state.userSlice.dataUser)

    const nav = useNavigate();

    let ad = props.item

    useEffect(() => {

    }, [])

    const moreInfo = () => {
        if (props.myAds) {
            nav(`/myAds/moreInfo/${ad._id}`)
        }
        else {
            nav(`/moreInfo/${ad._id}`)
        }

    }

    const saveAd = async () => {
        if (!ad.like) {
            let like =
                ({
                    id_user: user._id,
                    id_ad: ad._id,
                    note: ""
                });
            try {
                console.log(like);
                await doApiMethod("/adsLikes", "POST", like)
                ad.like = true

            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            try {
                await doApiMethod(`/adsLikes/${ad._id}`, "DELETE")
                ad.like = false


            }
            catch (err) {
                console.log(err);
            }
        }

    }



    return (

        <Card sx={{ width: "300px", boxShadow: "15px", margin: "16px", padding: "0px" }}>
            <Carousel sx={{ width: "300px" }}>
                {ad.arr_img.length>0 ?
                    ad.arr_img.map((img, i) => <Item key={i} item={img} />)
                    : <div className='mb-5'><Item item={"https://i.ibb.co/Qp1TRxQ/no-image.png"} /></div>

                }
            </Carousel>
            <CardContent sx={{ height: "130px" }}>
                <div className='d-flex justify-content-between'>
                    {ad.price_type ?
                        <Typography gutterBottom variant="h5" component="div"> {ad.price} ₪ ללילה</Typography> :
                        <Typography gutterBottom variant="h5" component="div">  {ad.price} ₪ לאדם</Typography>
                    }
                    {isLoggedIn && !props.myAds && !props.orderAd &&
                        <div>{ad.like == true ?
                            <Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />} color='red' onClick={saveAd} defaultChecked /> :
                            <Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />} color='red' onClick={saveAd} />}
                        </div>

                        //defaultChecked
                    }
                </div>

                <Typography variant="body2" color="text.secondary">
                    {ad.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <b>כמות אנשים מקסימאלית: </b>{ad.amount_people}
                </Typography>

            </CardContent>
            <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>

                <Button size="small" onClick={moreInfo}>מידע נוסף</Button>
                <Typography sx={{ direction: "ltr" }} variant="body2" color="text.secondary">
                    <LocationOnIcon />{ad.address}
                </Typography>

            </CardActions>
        </Card>






    )
}

function Item(props) {
    return (
        <img src={props.item} width={400} height={200}></img>
    )
}


export default AdItem
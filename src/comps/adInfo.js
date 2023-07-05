import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { doApiGet } from '../services/apiService';
import Carousel from 'react-material-ui-carousel';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HotTubIcon from '@mui/icons-material/HotTub'//ז'קוזי
import AccessibleIcon from '@mui/icons-material/Accessible';//נכה
import PoolIcon from '@mui/icons-material/Pool';//בריכה
import LocalParkingIcon from '@mui/icons-material/LocalParking';//חניה
import GridOnIcon from '@mui/icons-material/GridOn';//סורגים
import ElevatorIcon from '@mui/icons-material/Elevator';//מעלית
import AcUnitIcon from '@mui/icons-material/AcUnit';//מזגן
import { Box, Container, Skeleton, Tooltip, Typography } from '@mui/material';
import ChooseDate from './chooseDate';
import AdChats from './adChats';
import AddOrder from './addOrder';
import AdMap from './adMap';
import Loading from './loading';



function AdInfo() {
    const nav = useNavigate();
    const params = useParams();
    const [openPhone, setOpenPhone] = useState(false)

    const [info, setInfo] = useState({})
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 5000);

        window.scroll({ top: 0, left: 0, behavior: 'auto' });
        window.history.scrollRestoration = 'manual';
        doApi()
        return () => clearTimeout(timer);

    }, [params])

    const doApi = async () => {
        try {
            let data = await doApiGet(`/ads/adId/${params["idAd"]}`)
            console.log(data);
            setInfo(data)
            if (data.msg) {
                nav("/*")
            }
        }
        catch (err) {
            console.log(err);
        }

    }
    return (
        <div>
            {!isLoading ?
                <Container id='myInfo' component={"main"}>
                    <div className="card mb-3 container p-2  my-3 shadow rounded-3" style={{ minHeight: "450px" }}>
                        <div className="row g-0">
                            <div className="col-md-6">
                                <Carousel>
                                    {info.arr_img.length > 0 ?
                                        info.arr_img?.map((img, i) => <Item key={i} item={img} />)
                                        : <Item  item={"https://i.ibb.co/Qp1TRxQ/no-image.png"} />

                                    }
                                </Carousel>
                            </div>
                            <div className="col-md-6">
                                <div className="card-body">
                                    <div className='d-flex  justify-content-between center'>
                                        <Tooltip style={{ direction: "rtl" }} placement="right" title={info.price_type ? "מחיר ללילה" : "מחיר לאדם"} arrow>
                                            <h2 className="card-title display-5 "><b>₪{info.price}</b>
                                            </h2>
                                        </Tooltip>
                                        <Typography >
                                            <LocationOnIcon />{info.address}
                                        </Typography>
                                    </div>

                                    <Typography>{info.description}</Typography>

                                    <div className='row row-cols-4 center my-3'>
                                        <div className='d-flex flex-column shadow'>
                                            <div>{info.floor == 0 ? "קרקע" : info.floor}</div>
                                            <div><b>קומה</b></div>
                                        </div>
                                        <div className='d-flex flex-column shadow'>
                                            <div>{info.amount_people}</div>
                                            <div><b>כמות אנשים</b></div>
                                        </div>
                                        <div className='d-flex flex-column shadow'>
                                            <div>{info.kind}</div>
                                            <div><b>סוג נכס</b></div>
                                        </div>
                                        <div className='d-flex flex-column shadow'>
                                            <div style={{ color: "#0D9488" }}>{info.rooms}</div>
                                            <div><b>מס' חדרים</b></div>
                                        </div>
                                    </div>
                                    <Typography ><b>מה יש בנכס?</b></Typography>

                                    <div className='row row-cols-4' >
                                        {info.elevator &&
                                            <Typography sx={{ margin: "8px 0", color: "#0D9488" }}><ElevatorIcon color='turquoise' /> מעלית</Typography>}
                                        {info.merger &&
                                            <Typography sx={{ margin: "8px 0", color: "#0D9488" }}><AcUnitIcon color='turquoise' /> מזגן</Typography>}
                                        {info.bars &&
                                            <Typography sx={{ margin: "8px 0", color: "#0D9488" }} ><GridOnIcon color='turquoise' /> סורגים</Typography>}
                                        {info.parking &&
                                            <Typography sx={{ margin: "8px 0", color: "#0D9488" }} ><LocalParkingIcon color='turquoise' /> חניה</Typography>}
                                        {info.disabled &&
                                            <Typography sx={{ margin: "8px 0", color: "#0D9488" }} ><AccessibleIcon color='turquoise' /> גישה לנכים</Typography>}
                                        {info.pool &&
                                            <Typography sx={{ margin: "8px 0", color: "#0D9488" }} ><PoolIcon color='turquoise' /> בריכה</Typography>}
                                        {info.jacuzzi &&
                                            <Typography sx={{ margin: "8px 0", color: "#0D9488" }} ><HotTubIcon color='turquoise' /> ז'קוזי</Typography>}
                                    </div>
                                    {!openPhone ?
                                        <button className='btn bg-success-subtle m-1 w-100' onClick={() => { setOpenPhone(true) }}>  פרטי קשר</button> :
                                        <button className='btn bg-success-subtle m-1 w-100' onDoubleClick={() => { setOpenPhone(false) }}><a className='text-black' href={`tel:${info.phone}`}>{info.phone}</a>
                                            -{info.nameOwner}</button>
                                    }
                                    <div className='center pt-5'>
                                        <button className='btn btn-light m-1' onClick={() => {
                                            nav(-1)
                                        }}>חזור למודעות</button>
                                        <AddOrder ad={info} />

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <AdChats idAd={params["idAd"]} iduser={info.id_user}/>
                </Container> :
                <Loading />
            }
        </div>
    )
}

function Item(props) {
    return (
        <img src={props.item} width={600} height={400}></img>
    )
}

export default AdInfo
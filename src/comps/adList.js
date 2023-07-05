import React, { useEffect, useState } from 'react'
import AdItem from './adItem'
import { doApiGet, doApiMethod } from '../services/apiService';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CircularProgress, Pagination, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';


function AdList(props) {

    const nav = useNavigate();
    const [querys] = useSearchParams();
    const [ar, setAr] = useState(null)
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const dataUser = useSelector(state => state.userSlice.dataUser)


    const handleChange = (event, value) => {
        setPage(value);
        nav(`/?page=${value}`)

    };
    useEffect(() => {
        let p = querys.get("page") || "1";
        setPage(Number(p));
        doApi(p)

    }, [querys, page, props.search])

    const doApi = async (p) => {
        let data;
        if (props.myAds) {
            data = await doApiGet(props.url + p)
            setAr(data)
            setCount(Math.ceil(doApiGet(props.countURL) / 9))

        }
        else {
            data = await doApiMethod(props.url + p, "POST", props.search)
            setAr(data.data)
            let number = await doApiMethod(props.countURL, "POST", props.search)
            setCount(Math.ceil(number.data / 9))
        }


    }
    return (
        <div>
            {props.myAds && ar?.length == 0 ?
                <Typography className='m-2 p-2 bg-success-subtle  rounded-3 center' color="text.secondary" variant="body5"><b> אין לך מודעות, לפרסום מודעה</b><Link to="/addAd" className='text-black me-2'>לחץ כאן </Link>
                </Typography>:                    
            <div>
                {ar ?
                    <div className='container-fluid py-5'>
                        <div className="row row-cols-3 justify-content-center">
                            {ar.map(item => {
                                return (
                                    <AdItem key={item._id} item={item} myAds={props.myAds} />
                                )
                            })}
                        </div>
                        <Pagination count={count} defaultPage={page} variant="outlined" size='large' className='center' color="turquoise" onChange={handleChange} />
                    </div> :
                    <div className='center ' sx={{ color: 'grey.500', height: "100px" }} spacing={2} direction="row">
                        <img src='https://cdn.dribbble.com/users/2035064/screenshots/4599692/____.gif' />
                    </div>
                }
            </div>}
        </div>
    )
}

export default AdList
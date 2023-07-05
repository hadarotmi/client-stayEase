import { Pagination, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import LikeItem from './likeItem';
import { doApiGet } from '../services/apiService';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

function ListLike() {

  const nav = useNavigate();
  const [querys] = useSearchParams();
  const [ar, setAr] = useState(null)
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(1);


  const handleChange = (event, value) => {
    setPage(value);
    nav(`?page=${value}`)

  };
  useEffect(() => {
    let p = querys.get("page") || "1";
    setPage(Number(p));
    doApi(p)

  }, [querys, page])

  const doApi = async (p) => {
    try {
      let data = await doApiGet(`/adsLikes/?page=${p}`)
      if (data.msg) {
        window.location.href = "/login"
      }

      setCount(Math.ceil(await doApiGet("/adsLikes/count") / 4))
      console.log(data);
      setAr(data)
    }
    catch (err) {
    }

  }
  return (
    <div>
      <h1 className='center display-4'>מודעות שמורות</h1>
      {ar ?
        <div>
          {ar.length > 0 ?
            <div className='container-fluid py-5'>
              <div className="">
                {ar.map(item => {
                  return (
                    <LikeItem key={item._id} item={item} doApi={doApi} />
                  )
                })}
              </div>
              <Pagination count={count} defaultPage={page} variant="outlined" size='large' className='center' color="turquoise" onChange={handleChange} />
            </div> :
            <Typography className='m-2 p-2 bg-success-subtle  rounded-3 center m-5' color="text.secondary" variant="body5"><b>אין לך מודעות שאהבת, חזור <Link to={"/"} style={{ color: "black" }}>לדף הבית</Link></b></Typography>
          }
        </div>
        :
        <div className='center ' sx={{ color: 'grey.500', height: "100px" }} spacing={2} direction="row">
          <img src='https://cdn.dribbble.com/users/2035064/screenshots/4599692/____.gif' />
        </div>
      }
    </div>
  )
}

export default ListLike
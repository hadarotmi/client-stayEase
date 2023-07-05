import { Avatar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { TOKEN_NAME, doApiGet } from '../services/apiService'

function Profile() {
    const dataUser = useSelector(state => state.userSlice.dataUser)
    const [bank, setBank] = useState([]);

    useEffect(() => {
        doApi()

    }, [])

    const doApi = async () => {
        if (localStorage[TOKEN_NAME] != null) {
            let data = await doApiGet(`/userBanks/userId/${dataUser._id}`)
            setBank(data)
            
        }
        console.log(dataUser);

    }
    return (
        <div className='img-fluid center text-white flex-column container-fluid' style={{ backgroundImage: "url(https://i.ibb.co/DYxZQGS/pexels-pixabay-261156.jpg)", opacity:"0.9" }}>
            <div className=' p-4  ' style={{ minWidth: "600px" }}>
                <h1 className='display-1 text-center '><b>{dataUser.name}</b></h1>
                <div className='flex-column center shadow rounded-4  bg-dark  opacity-75 p-4' style={{ direction: "rtl" }}>
                    {/* <div className='col-5 '>
                        <h3><ins><b>פרטי חשבון בנק:</b></ins></h3>
                        {bank ?
                            <div>
                                <p>מספר חשבון: {bank.account_number}</p>
                                <p>מספר סניף: {bank.branch_number}</p>
                                <p>מספר בנק: {bank.bank_number}</p>
                            </div>
                            :
                            <div>
                                אין לך עדיין פרטי חשבון מעודכנים במערכת
                            </div>}

                    </div> */}
                    <Typography  variant="body5" className='col-10 center flex-column'>
                        <h3><ins>מייל:</ins> {dataUser.email}</h3>
                        <h3><ins>פלאפון:</ins>  {dataUser.phone}</h3>
                    </Typography>
                    <Link to="/singUp" className='col-12 m-2 btn btn-light'>עדכון פרטים</Link>
                </div>



            </div>
            <div className='d-flex '>
                <Link to="/like" className='btn btn-outline-light m-2 fs-4'>מודעות שמורות</Link>
                <Link to="/myAds" className='btn btn-outline-light m-2 fs-4'>מודעות שלי</Link>
                <Link to="/myOrders" className='btn btn-outline-light m-2 fs-4'>הזמנות שלי</Link>

            </div>
        </div>
    )
}

export default Profile
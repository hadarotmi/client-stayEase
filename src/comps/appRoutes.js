import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from './home';
import Login from './login';
import SingUp from './singUp';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/userSlice';
import { Avatar, Button, CircularProgress, Menu, MenuItem, Stack } from '@mui/material';
import { TOKEN_NAME } from '../services/apiService';
import HomeIcon from '@mui/icons-material/Home';
import AdInfo from './adInfo';
import MyAds from './myAds';
import Profile from './profile';
import Loading from './loading';
import NotFound from './notFound';
import OrdersToAd from './ordersToAd';
import ListLike from './likeList';
import MyOrders from './myOrders';
import ForgetPassword from './forgetPassword';
import Checkout from './addAd/addAd';
import UploadComponent from './addAd/picAndBonus';
import LogoutIcon from '@mui/icons-material/Logout';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import CottageIcon from '@mui/icons-material/Cottage';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


export default function AppRoutes() {
  const dataUser = useSelector(state => state.userSlice.dataUser)
  const isLoggedIn = useSelector(state => state.userSlice.isLoggedIn)
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);

  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <BrowserRouter >
      {!isLoading ? <div>
        <header className=' container-fluid sticky-top' style={{ background: "black", height: "80px" }}>
          {isLoggedIn ?
            <div className='d-flex justify-content-between align-items-center p-4'>
              <div>
                <Avatar sx={{ bgcolor: "#0D9488", margin: "0", direction: "rtl" }}
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                >
                  {dataUser?.name[0]}
                </Avatar>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  
                  <MenuItem onClick={handleClose} dir='rtl' ><Link to="/profile" className='text-decoration-none text-black py-2  px-0'><AccountCircleIcon color='turquoise' />פרופיל אישי</Link></MenuItem>
                  {/* <MenuItem onClick={handleClose} dir='rtl' ><Link to="" className='btn'>חיפושים אחרונים</Link></MenuItem> */}
                  <MenuItem onClick={handleClose} dir='rtl' ><Link to="/like" className='text-decoration-none text-black py-2 px-0'><FavoriteBorderIcon color='turquoise' />מודעות שמורות</Link></MenuItem>
                  <MenuItem onClick={handleClose} dir='rtl' ><Link to="/myAds" className='text-decoration-none text-black py-2 px-0'><CottageIcon color='turquoise' />מודעות שלי</Link></MenuItem>
                  <MenuItem onClick={handleClose} dir='rtl' ><Link to="/myOrders" className='text-decoration-none text-black py-2 px-0'><InsertInvitationIcon color='turquoise' />הזמנות שלי</Link></MenuItem>
                  <MenuItem onClick={handleClose} dir='rtl' ><Link onClick={() => { dispatch(logout({})) }} className='text-decoration-none text-black py-2 px-0'><LogoutIcon color='turquoise' />יציאה</Link>
                  </MenuItem>
                  <MenuItem className='bg-dark' onClick={handleClose} dir='rtl' ><img className='me-3' src='https://i.ibb.co/Bs6MHb6/01.png' width={130} />
                  </MenuItem>
                </Menu>
              </div>
              <nav className=''>

                <Link to="/?page=1" className='me-3 btn btn-outline-light'><HomeIcon color="white" />
                </Link>
                <Link to="/addAd" className='me-3 btn btn-outline-light'>פרסום מודעה</Link>


              </nav>

            </div> :
            <nav className='container p-4'>

              <Link to="/login" className='me-3 btn btn-outline-light'>כניסה לאיזור האישי</Link>
              <Link to="/?page=1" className='me-3 btn btn-outline-light'><HomeIcon color="white" /></Link>
            </nav>
          }

        </header>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/like" element={<ListLike />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/singUp" element={<SingUp />}></Route>
          <Route path="moreInfo/:idAd" element={<AdInfo />}></Route>
          <Route path="/myAds" element={<MyAds />}></Route>
          <Route path="myAds/moreInfo/:idAd" element={<OrdersToAd />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/myOrders" element={<MyOrders />}></Route>
          <Route path="/forgetPassword" element={<ForgetPassword />}></Route>
          <Route path="/*" element={<NotFound />}></Route>
          <Route path="/addAd" element={<Checkout />}></Route>
          <Route path="/editAd/:idAd" element={<Checkout />}></Route>
        </Routes>
      </div> :
        <Loading />}
    </BrowserRouter>
  )
}

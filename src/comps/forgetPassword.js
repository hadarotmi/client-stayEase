import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Alert, FormControl, InputLabel, OutlinedInput, Tooltip } from '@mui/material';
import { doApiGet, doApiMethod } from '../services/apiService';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { emailPasswordTemplateId, emailServiceId, emailUserId } from '../config/secret';

const ForgetPassword = () => {
  const { register, getValues, handleSubmit, formState: { errors } } = useForm();
  const nav = useNavigate();
  const [errEmail, setErrEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState();
  const [openCode, setOpenCode] = useState(false)
  const [openNewPass, setOpenNewPass] = useState(false)
  const [errCode, setErrCode] = useState(false);
  const emailRef = useRef()
  const codeRef = useRef()


  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  const checkEmail = async () => {
    try {
      let confirm = await doApiMethod("/users/confirmAccount", "POST", { email: emailRef.current.value });
      if (confirm.data.email) {
        setErrEmail(false)
        setOpenCode(true)
        sendEmail(confirm.data)
      }
    }
    catch (err) {
      setErrEmail(true)
    }

  }

  const sendEmail = (user) => {
    const min = 100000;
    const max = 999999;
    let mycode = (Math.floor(Math.random() * (max - min + 1)) + min).toString()
    setCode(mycode)
    const templateParams = {
      name: user.name,
      email: user.email,
      message: mycode
    };

    emailjs.send(emailServiceId, emailPasswordTemplateId, templateParams, emailUserId)
      .then((result) => {
        console.log(result)
      }, (error) => {
        // show the user an error
      });
  };

  const confirmCode = async () => {
    console.log(code);
    if (code == codeRef.current.value) {
      setOpenNewPass(true)
    }
    else {
      setErrCode(true)
    }
  }

  const onSub = async (bodyData) => {
    bodyData.email=emailRef.current.value;
    delete bodyData.confirmPass;
    try {
      let data=await doApiMethod(`/users/changePassword`, "PATCH", bodyData)
        nav("/login")
    }
    catch (err) {
      console.log(err);
    }
  }


  return (
    <div className='img-fluid center text-white flex-column container-fluid' style={{ opacity: ".8", backgroundImage: "url(https://i.ibb.co/DYxZQGS/pexels-pixabay-261156.jpg)" }}>

      <Container dir='rtl' component="main" maxWidth="xs" >
        {errEmail && <Alert severity="error">המשתמש אינו קיים במערכת</Alert>}
        <CssBaseline />
        <Box
          sx={{
            marginTop: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: "30px",
            borderRadius: "20px",
            //border: "2px solid #0D9488",
            background: "white",
            opacity: ".9",
            boxShadow: "15px",
            color: "white",
          }}

        >
          <Avatar sx={{ m: 1, bgcolor: '#0D9488' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ color: "black" }}>
            שיחזור סיסמה
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit(onSub)} sx={{ mt: 1 }} width={"300px"}>

            <FormControl fullWidth sx={{ my: 2 }} variant="outlined">
              <InputLabel color='turquoise'>מייל</InputLabel>
              <OutlinedInput
                inputRef={emailRef}
                margin="normal"
                fullWidth
                id="email"
                label="מייל"
                name="email"
                autoComplete="email"
                autoFocus
                color='turquoise'
                endAdornment={
                  <InputAdornment position="end">
                    <Button className='btn bg-success-subtle text-dark' size="small" onClick={checkEmail}>שלח מייל</Button>
                  </InputAdornment>
                }
              />
            </FormControl>
            {!openNewPass ?
              <div>
                {openCode && <Typography>
                  <div className='text-dark'>הכנס כאן את הקוד שנשלח לך במייל</div>
                  <TextField
                    inputRef={codeRef}
                    margin="normal"
                    fullWidth
                    id="code"
                    label="קוד"
                    name="code"
                    autoComplete="code"
                    color='turquoise'
                  />
                  {errCode && <div className='text-danger d-block' style={{ fontSize: "11px" }}>קוד שגוי</div>}
                </Typography>
                }
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  color='turquoise'
                  onClick={confirmCode}
                >
                  המשך
                </Button>
              </div> :
              <div>
                <Tooltip style={{ direction: "rtl" }} placement="bottom" title="סיסמא חייבת להיות בין 6-16 תוים מספרים ואותיות באנגלית" arrow>
                  <FormControl fullWidth sx={{ mt: 1 }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">סיסמה חדשה</InputLabel>
                    <OutlinedInput
                      {...register("password", { required: true, pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*.<>])[a-zA-Z0-9!@#$%^&*]{6,16}$/ })}
                      margin="normal"
                      fullWidth
                      name="password"
                      label="סיסמה חדשה"
                      id="password"
                      autoComplete="current-password"
                      color='turquoise'
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff color='turquoise' /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }

                    />
                    {errors.password && <div className='text-danger d-block' style={{ fontSize: "11px" }}>הכנס סיסמא תיקנית</div>}

                  </FormControl>
                </Tooltip>
                <FormControl fullWidth sx={{ mt: 1 }} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">אישור סיסמה</InputLabel>
                  <OutlinedInput
                    {...register("confirmPass", { required: true, validate: (value) => value === getValues("password") })}
                    margin="normal"
                    fullWidth
                    name="confirmPass"
                    label="אישור סיסמה"
                    id="confirmPass"
                    autoComplete="current-password"
                    color='turquoise'
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff color='turquoise' /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }

                  />
                  {errors.confirmPass && <div className='text-danger d-block' style={{ fontSize: "11px" }}>אין התאמה בין הסיסמאות</div>}

                </FormControl>
                <Button
                  type='submit'
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  color='turquoise'
                >
                  סיום
                </Button>
              </div>}


          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default ForgetPassword;
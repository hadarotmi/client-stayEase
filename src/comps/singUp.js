import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
// import nodemailer from 'nodemailer';
import { useForm } from "react-hook-form"
import { Alert, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Tooltip } from '@mui/material';
import { TOKEN_NAME, doApiGet, doApiMethod } from '../services/apiService';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const user = useSelector(state => state.userSlice.dataUser)
    const [err, setErr] = useState({ err: " " });
    const [successful, setSuccessful] = useState({ succ: " " });

    const [password, setPassword] = useState();

    const { register, getValues, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        doApi()

    }, [])

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const doApi = async () => {
        if (localStorage[TOKEN_NAME] != null) {
            let data = await doApiGet(`/users/myPassword`)
            setPassword(data);
        }
    }


    const onSub = async (bodyData) => {
        bodyData.name = bodyData.firstName + " " + bodyData.lastName
        delete bodyData.firstName;
        delete bodyData.lastName;
        delete bodyData.confirmPass;
        try {
            if (user) {
                delete bodyData.password
                await doApiMethod(`/users/${user._id}`, "PUT", bodyData)
                setSuccessful({ succ: "update" })
            }
            else {
                await doApiMethod("/users", "POST", bodyData)
                setSuccessful({ succ: "successful" })
            }

        }
        catch (err) {
            console.log(err);
            setErr(err.response.data)
        }
    }

    return (
        <div className='img-fluid center text-white flex-column container-fluid' style={{ opacity: ".8", backgroundImage: "url(https://i.ibb.co/DYxZQGS/pexels-pixabay-261156.jpg)" }}>

            <Container dir='rtl' component="main" maxWidth="md" >
                {err.err != " " && <Alert severity="error">{successful.err}</Alert>}
                {successful.succ == "successful" && <Alert severity="success">נרשמת בהצלחה!   <Link href="/login" variant="body2" sx={{ color: "#0D9488", }}>היכנס</Link></Alert>}
                {successful.succ == "update" && <Alert severity="success">פרטיך עודכנו בהצלחה!   <Link href="/profile" variant="body2" sx={{ color: "#0D9488", }}>דף פרופיל</Link></Alert>}
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        paddingTop: "0px !importent",
                        padding: "10px  30px",
                        borderRadius: "20px",
                        background: "white",
                        opacity: ".97",
                        boxShadow: "15px",

                    }}
                >
                    <Typography component="h1" variant="h5" sx={{ color: '#0D9488' }}>
                        {!user ?
                            <h2> הרשמה...</h2> :
                            <h2> עדכון פרטים...</h2>
                        }
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit(onSub)} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField {...register("firstName", { required: true, minLength: 2, maxLength: 25 })}
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="שם פרטי"
                                    autoFocus
                                    color='turquoise'
                                    defaultValue={user?.name.split(" ")[0]}

                                />
                                {errors.firstName && <div className='text-danger d-block' style={{ fontSize: "11px" }}>הכנס שם פרטי תקין</div>}

                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField {...register("lastName", { required: true, minLength: 2, maxLength: 25 })}
                                    required
                                    fullWidth
                                    autoFocus
                                    id="lastName"
                                    label="שם משפחה"
                                    name="lastName"
                                    autoComplete="family-name"
                                    color='turquoise'
                                    defaultValue={user?.name.split(" ")[1]}


                                />
                                {errors.lastName && <div className='text-danger d-block' style={{ fontSize: "11px" }}>הכנס שם משפחה תקין</div>}

                            </Grid>
                            <Grid item xs={12} >
                                <TextField  {...register("email", { required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })}
                                    required
                                    autoFocus
                                    fullWidth
                                    id="email"
                                    label="כתובת מייל"
                                    name="email"
                                    autoComplete="email"
                                    color='turquoise'
                                    defaultValue={user?.email}

                                />
                                {errors.email && <div className='text-danger d-block' style={{ fontSize: "11px" }}>הכנס מייל תקין</div>}

                            </Grid>

                            <Grid item xs={12}>
                                <TextField {...register("phone", { required: true, minLength: 9, maxLength: 10 })}
                                    required
                                    fullWidth
                                    autoFocus
                                    id="phone"
                                    label="פלאפון"
                                    name="phone"
                                    autoComplete="phone"
                                    color='turquoise'
                                    defaultValue={user?.phone}

                                />
                                {errors.phone && <div className='text-danger d-block' style={{ fontSize: "11px" }}>הכנס פלאפון תקין</div>}
                            </Grid>

                            {!user && <Grid item xs={12} sm={6}>
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
                            </Grid>}

                            {!user &&
                                <Grid item xs={12} sm={6}>
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
                                </Grid>
                            }

                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color='turquoise'
                            sx={{ mt: 3, mb: 2, color: "white" }}
                        >
                            {!user ?
                                <h5 className='fs-6'>הירשם</h5> :
                                <h5 className='fs-6'>עדכון</h5>}
                        </Button>
                        {!user &&
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link href="/login" variant="body2" sx={{ color: "#0D9488", }}>
                                        יש לך כבר חשבון? היכנס
                                    </Link>
                                </Grid>

                            </Grid>}
                    </Box>
                </Box>
            </Container>
        </div>
    );
}
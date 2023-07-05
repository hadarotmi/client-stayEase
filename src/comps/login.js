import React, { useState } from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
// import { Tooltip } from '@mui/material';
import { TOKEN_NAME, doApiLogin } from '../services/apiService';
import { useDispatch } from 'react-redux';
import { login } from '../features/userSlice';
import { Alert, FormControl, InputLabel, OutlinedInput } from '@mui/material';


function Login() {
  const dispatch = useDispatch();
  const [err, setErr] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let user =
      ({
        email: data.get('email'),
        password: data.get('password'),
      });

    try {
      await doApiLogin(user);
      if (localStorage[TOKEN_NAME] != null) {
        dispatch(login({}))
        window.location.href = "/"
      } else {
        setErr(true)
      }
    }
    catch (err) {
      console.log(err);
    }

  };


  return (
    <div className='img-fluid center text-white flex-column container-fluid' style={{ opacity: ".8", backgroundImage: "url(https://i.ibb.co/DYxZQGS/pexels-pixabay-261156.jpg)" }}>

      <Container dir='rtl' component="main" maxWidth="xs" >
        {err && <Alert severity="error">שם משתמש או סיסמא שגויים</Alert>}
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
            color: "white"
          }}

        >
          <Avatar sx={{ m: 1, bgcolor: '#0D9488' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ color: "black" }}>
            כניסה
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="מייל"
              name="email"
              autoComplete="email"
              autoFocus
              color='turquoise'
            />
            <FormControl fullWidth sx={{ mt: 1}} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">סיסמה</InputLabel>

              <OutlinedInput
                margin="normal"
                fullWidth
                name="password"
                label="סיסמה"
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
                      {showPassword ? <VisibilityOff color='turquoise' /> : <Visibility/>}
                    </IconButton>
                  </InputAdornment>
                }

              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              color='turquoise'

            >
              כניסה
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/forgetPassword" variant="body2" sx={{ color: "#0D9488" }}>
                  שכחת את הסיסמה?
                </Link>
              </Grid>
              <Grid item >
                <Link href="/singUp" variant="body2" sx={{ color: "#0D9488", }}>
                  {"אין לך חשבון? הירשם"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>

  )
}

export default Login
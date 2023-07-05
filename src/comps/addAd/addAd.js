import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AdDetails from './adDetails';
import BusyDay from './busyDay';
import CloudinaryUploader from './picAndBonus';
import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { doApiMethod } from '../../services/apiService';
import { useDispatch } from 'react-redux';
import { addParameter, removeSlice } from '../../features/adSlice';
import GoogleMaps from './location';


const steps = ['כמה פרטים', 'פרטים אחרונים', 'כבר מסיימים!'];



export default function Checkout() {
  const params = useParams();
  const [activeStep, setActiveStep] = React.useState(0);
  const [adData, setAdDate] = React.useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    setActiveStep(0)
    if(!params["idAd"]){
      dispatch(removeSlice({}))
    }
  }, [params["idAd"]]);

  const handleNext = async (data, finish = false) => {
    setAdDate(prevData => ({ ...prevData, ...data }));
    console.log(data);
    dispatch(addParameter({data:data}))
    if (finish == true) {
      doApi(adData)
    }
    else {
      setActiveStep(activeStep + 1);

    }

  };

  const doApi = async (data) => {
    try {
      if(params["idAd"]){
        await doApiMethod(`/ads/${params["idAd"]}`, "PUT", data)
      }
      else{
         await doApiMethod("/ads", "POST", data)
      }
      dispatch(removeSlice({}))
      setActiveStep(activeStep + 1);
    }
    catch (err) {
      //setErr(true);
      console.log(err);
    }
  }



  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <AdDetails handleNext={handleNext} />;
      case 1:
        return <CloudinaryUploader handleNext={handleNext} handleBack={handleBack}/>;
      case 2:
        return <BusyDay handleNext={handleNext} handleBack={handleBack}/>;
      default:
        throw new Error('Unknown step');
    }
  }

  return (
    <div className='img-fluid center text-white flex-column container-fluid shadow rounded-3' style={{ opacity: ".8", backgroundImage: "url(https://i.ibb.co/DYxZQGS/pexels-pixabay-261156.jpg)" }}>
      <CssBaseline />
      <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
        
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h4" align="center">
            {params["idAd"]?"עדכן":"פרסם"} את המודעה שלך
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography variant="h5" gutterBottom className='flex-column center bg-success-subtle shadow rounded-3 p-4'>
              {params["idAd"]?"המודעה עודכנה בהצלחה":"המודעה נוספה בהצלחה"}
                <Link to="/myAds" className='btn btn-dark m-1'>עבור למודעות שלך</Link>
              </Typography>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {getStepContent(activeStep)}
            </React.Fragment>
          )}
        </Paper>
      </Container>
    </div>
  );
}

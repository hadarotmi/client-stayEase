import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import AddIcon from '@mui/icons-material/Add';
import { useForm } from 'react-hook-form';
import { Box, Button, Container, Fab, IconButton, Typography } from '@mui/material';
import ChooseDate from '../chooseDate';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { sortBy } from 'lodash';


export default function BusyDay(props) {
  const [openDays, setOpenDays] = React.useState(false);
  const [days, setDays] = useState([])
  const [busyDays, setBusyDays] = useState([])
  const [dateStartValue, setDateStartValue] = useState(null);
  const [dateEndValue, setDateEndValue] = useState(null);
  const adData = useSelector(state => state.adSlice.adData)
  const [deletedIndices, setDeletedIndices] = useState([]);
  const dispatch = useDispatch();


  useEffect(() => {
    if (adData.arr_busy_days) {
      let d = sortBy(adData.arr_busy_days, "entry_date")
      setBusyDays(d)
      setOpenDays(true)
      setDays([])
      for (let i = 0; i < d.length; i++) {
        setDays(prevDays => [...prevDays, <ChooseDate handleStartDateChange={handleStartDateChange} handleEndDateChange={handleEndDateChange} dates={d[i]}></ChooseDate>])

      }
    }
    if (adData.arr_busy_days?.length == 0) {
      setOpenDays(false)
    }

  }, [adData.arr_busy_days])




  let startDay = ""
  const handleStartDateChange = (newDate) => {
    setDateStartValue(newDate);
    startDay = newDate
  };

  const handleEndDateChange = (newDate) => {
    setDateEndValue(newDate);
    setBusyDays(prevDays => [...prevDays, { entry_date: startDay, release_date: newDate }]);

  };

  const handleAddDate = () => {
    setDays(prevDays => [...prevDays, <ChooseDate handleStartDateChange={handleStartDateChange} handleEndDateChange={handleEndDateChange} busy_days={busyDays} ></ChooseDate>])
  };

  const onSub = () => {
    let data = {};
    console.log(busyDays);
    data.arr_busy_days = {...busyDays};
    props.handleNext(data, true)
  }

  const handleDeleteDate = (index) => {
    setBusyDays(prevDays => prevDays.filter((day, i) => i !== index));
    setDeletedIndices(prevIndices => [...prevIndices, index]);
  };

  return (
    <Container component={'form'} >
      <div className='center flex-column'>
        <h3>האם יש כבר תאריכים תפוסים?</h3>
        <FormControl >
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            defaultValue={adData.arr_busy_days?.length == 0 ? "no" : "yes"}
          >
            <div className='d-flex justify-content-center'>
              <FormControlLabel value="yes" control={<Radio color='turquoise' />} label={"כן"} onClick={() => { setOpenDays(true) }} />
              <FormControlLabel value="no" control={<Radio color='turquoise' />} label={"לא"} onClick={() => { setOpenDays(false) }} />
            </div>
            {openDays &&
              <div className='center flex-column shadow rounded-3 p-4 m-2'>
                <Typography variant="h5" align="center">
                  בחר תאריכים:
                </Typography>
                {days.map((day, index) => {
                  if (deletedIndices.includes(index)) return null; // Exclude deleted dates
                  return (
                    <div className='d-flex' key={index}>{day}
                      <IconButton aria-label="delete" className='me-3' disabled={new Date(busyDays[index]?.entry_date) < Date.now()} onClick={() => handleDeleteDate(index)}>
                        <DeleteIcon fontSize="inherit" color={`${new Date(busyDays[index]?.entry_date) > Date.now() && "red"}`} />
                      </IconButton>
                    </div>
                  )
                })}
                <Box sx={{ '& > :not(style)': { m: 1 } }}>
                  <Fab color="turquoise" className=' m-3' aria-label="add" onClick={handleAddDate}>
                    <AddIcon />
                  </Fab>
                </Box>
              </div>
            }
          </RadioGroup>
        </FormControl>
      </div>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button color='turquoise' onClick={props.handleBack} sx={{ mt: 3, ml: 1 }}>
          עמוד קודם
        </Button>
        <Button
          onClick={onSub}
          color='turquoise'
          variant="contained"
          sx={{ mt: 3, ml: 1, color: "white" }}
        >
          פרסם מודעה
        </Button>
      </Box>

    </Container>
  );


}
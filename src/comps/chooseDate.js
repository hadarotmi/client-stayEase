import React, { useEffect, useRef, useState } from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers-pro';
import { Box, div } from '@mui/material';
import dayjs from 'dayjs';


function ChooseDate(props) {
    const [dateStart, setDateStart] = useState(new Date(Date.now));
    const [openEnd, setOpenEnd] = useState(false);


    const handleStartDateChange = (newDate) => {
        props.handleStartDateChange(newDate);
        setDateStart(newDate)
        setOpenEnd(true)
    };
    const isWeekend = (date) => {
        if (props.busy_days) {
            const dateInterditesRaw = props.busy_days
            const dates = [];
            dateInterditesRaw.forEach(item => {
                const start = new Date(item.entry_date);
                const end = new Date(item.release_date);
                const days = Math.floor((end - start) / (1000 * 60 * 60 * 24));
                for (let i = 0; i <= days; i++) {
                    const currentDate = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
                    dates.push(currentDate);
                }
            });

            const dateInterdites = dates.map((item) => {
                return new Date(item).getTime()
            });

            return dateInterdites.includes(new Date(date).getTime());
        }

    };
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} >

            <DemoContainer components={['DateRangePicker']} >
                <div className='d-flex justify-content-between'>
                    <div >
                        <DatePicker
                            label={`תאריך כניסה`}
                            sx={{ direction: "ltr" }}
                            disablePast
                            shouldDisableDate={isWeekend}
                            calendars={2}
                            onChange={handleStartDateChange}
                            defaultValue={props.dates && dayjs(props.dates.entry_date)}
                            disabled={props.dates}

                        />
                    </div>
                    <div >

                        <DatePicker label={`תאריך יציאה`}
                            sx={{ direction: "ltr" }}
                            disablePast
                            shouldDisableDate={isWeekend}
                            calendars={2}
                            onChange={props.handleEndDateChange}
                            minDate={dateStart}
                            disabled={openEnd ? false : true}
                            defaultValue={props.dates && dayjs(props.dates.release_date)}

                        /></div>
                </div>

            </DemoContainer>
        </LocalizationProvider>
    )
}

export default ChooseDate
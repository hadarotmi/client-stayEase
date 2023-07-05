import { Autocomplete, Slider, TextField, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import HotTubIcon from '@mui/icons-material/HotTub'//ז'קוזי
import AccessibleIcon from '@mui/icons-material/Accessible';//נכה
import PoolIcon from '@mui/icons-material/Pool';//בריכה
import LocalParkingIcon from '@mui/icons-material/LocalParking';//חניה
import GridOnIcon from '@mui/icons-material/GridOn';//סורגים
import ElevatorIcon from '@mui/icons-material/Elevator';//מעלית
import AcUnitIcon from '@mui/icons-material/AcUnit';//מזגן
import ChooseDate from './chooseDate';
import { doApiGet, doApiMethod } from '../services/apiService';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 1;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
const names = [
    { name: 'מעלית', icon: <ElevatorIcon color='turquoise' />, data: "elevator" },
    { name: 'מזגן', icon: <AcUnitIcon color='turquoise' />, data: "merger" },
    { name: 'סורגים', icon: <GridOnIcon color='turquoise' />, data: "bars" },
    { name: 'חניה', icon: <LocalParkingIcon color='turquoise' />, data: "parking" },
    { name: 'גישה לנכים', icon: <AccessibleIcon color='turquoise' />, data: "disabled" },
    { name: 'בריכה', icon: <PoolIcon color='turquoise' />, data: "pool" },
    { name: "ז'קוזי", icon: <HotTubIcon color='turquoise' />, data: "jacuzzi" },
];



// function getStyles(name, bonus, theme) {
//     return {
//         fontWeight:
//             bonus.indexOf(name) === -1
//                 ? theme.typography.fontWeightRegular
//                 : theme.typography.fontWeightMedium,
//     };
// }


function SearchInput(props) {
    const [price, setPrice] = React.useState([0, 5000]);
    const theme = useTheme();
    const [bonus, setBonus] = React.useState([]);
    const [cities, setCities] = React.useState([]);
    const [dateStartValue, setDateStartValue] = useState(null);
    const [dateEndValue, setDateEndValue] = useState(null);
    const cityRef = useRef()

    useEffect(() => {
        doApi();
    }, [])


    const doApiSearch = async () => {
        // let amenities = [];
        // bonus.forEach(item => {
        //     amenities.push(names.filter(n => { return n.name == item })[0].data)
        // })
        const search = {
            checkIn: dateStartValue,
            checkOut: dateEndValue,
            minPrice: price[0],
            maxPrice: price[1],
            city: cityRef.current.value,
            // amenities: amenities
        }
        // let data = await doApiMethod(`/ads/searchAds`,'POST',search)
        props.doApiSearch(search)
    }

    const noSearch = async () => {

        const search = {
            checkIn: null,
            checkOut: null,
            minPrice: 0,
            maxPrice: 5000,
            city: "",
        }
        props.doApiSearch(search)
    }

    const doApi = async () => {
        let myUrl = `https://raw.githubusercontent.com/royts/israel-cities/master/israel-cities.json`
        let resp = await fetch(myUrl);
        let data = await resp.json();
        let c = data.map((city, i) => {
            if (i > 0) {
                if (city.name.includes("שבט")) {
                    return { label: city.name.split(")")[0] }
                }
                return { label: city.name }
            }
            return { label: "בחר עיר..." }


        })
        setCities(c)
    }


    const handleStartDateChange = (newDate) => {
        setDateStartValue(newDate);
    };

    const handleEndDateChange = (newDate) => {
        setDateEndValue(newDate);
    };
    const handleChangePrice = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }
        if (activeThumb === 0) {
            setPrice([Math.min(newValue[0], price[1] - 10), price[1]]);
        } else {
            setPrice([price[0], Math.max(newValue[1], price[0] + 10)]);
        }
    };

    // const handleChange = (event) => {
    //     const {
    //         target: { value },
    //     } = event;
    //     setBonus(
    //         typeof value === 'string' ? value.split(',') : value,
    //     );
    // };

    return (
        <div className='m-3 shadow rounded-3 '>

            <div className='d-flex p-3 mt-3 justify-content-between overflow-hidden'>
                {/* <FormControl sx={{ mt: 1 }}>
                    <InputLabel color='turquoise' id="demo-multiple-chip-label">הנכס צריך לכלול:</InputLabel>
                    <Select
                        color='turquoise'
                        fullWidth
                        labelId="demo-multiple-chip-label"
                        id="demo-multiple-chip"
                        multiple
                        value={bonus}
                        onChange={handleChange}
                        input={<OutlinedInput id="select-multiple-chip" label="הנכס צריך לכלול:" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                    >

                        {names.map((name) => (
                            <MenuItem
                                dir='rtl'
                                key={name.name}
                                value={name.name}
                                style={getStyles(name.name, bonus, theme)}
                            >
                                <Typography sx={{ margin: "8px 0", color: "#0D9488" }}>{name.icon}{name.name}</Typography>
                            </MenuItem>))}
                    </Select>
                </FormControl> */}
                <Autocomplete
                    className='col-lg-6 '
                    color='turquoise'
                    disablePortal
                    id="combo-box-demo"
                    options={cities}
                    sx={{ mt: 1 }}
                    renderInput={(params) => <TextField {...params} label="עיר" inputRef={cityRef} />}
                />
                <div className='col-lg-5'>
                    <ChooseDate handleStartDateChange={handleStartDateChange} handleEndDateChange={handleEndDateChange} />

                </div>

            </div>
            <div className='m-auto p-4 col-12 '>
                <Typography color="text.secondary" variant="body5" className='text-dark'>טווח מחירים: {price[1]}-{price[0]} ₪</Typography>
                <Slider className='center'
                    color='turquoise'
                    getAriaLabel={() => 'Minimum distance'}
                    value={price}
                    onChange={handleChangePrice}
                    valueLabelDisplay="auto"
                    max={5000}
                    step={50}
                    disableSwap
                />
            </div>

            <button className=' m-2 bg-success-subtle px-4 btn  fs-6' onClick={doApiSearch}>חפש</button>
            <button className=' m-2 bg-success-subtle px-4 btn  fs-6' onClick={noSearch}>איפוס חיפוש</button>
        </div>
    )
}

export default SearchInput
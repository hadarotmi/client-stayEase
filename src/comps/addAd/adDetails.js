import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup';
import FormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useForm } from 'react-hook-form';
import { Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import GoogleMaps from './location';

export default function AdDetails(props) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [kind, setKind] = useState('דירה');
    const [address, setAddress] = useState("");
    const [errorAddress, setErrorAddress] = useState(false);

    const [typePrice, setTypePrice] = useState(true);
    const adData = useSelector(state => state.adSlice.adData)

    const StyledFormControlLabel = styled((props) => <FormControlLabel {...props} />)(
        ({ theme, checked }) => ({
            '.MuiFormControlLabel-label': checked && {
                color: theme.palette.turquoise.main,
            },
        }),
    );

    const getAddress = (value) => {
        if (value == "") {
            setErrorAddress(true)
        }
        else {
            setErrorAddress(false)
        }
        setAddress(value)
    }



    const onSub = (data) => {
        if (address == "") {
            setErrorAddress(true)
        }
        else {
            setErrorAddress(false)
            data.address = address
            data.kind = kind;
            data.price_type = typePrice
            props.handleNext(data)
        }

    }
    const handleChange = (event) => {
        setKind(event.target.value);
    };

    const handleType = (event) => {
        setTypePrice(event.target.value);
    }

    return (
        <Container className='p-3' component={'form'} noValidate onSubmit={handleSubmit(onSub)}>
            <Grid sx={{ mt: 3 }} container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth >
                            <InputLabel variant="filled" color='turquoise'>סוג נכס</InputLabel>
                            <Select {...register("kind")}
                                required
                                id="kind"
                                name="kind"
                                value={adData.kind != null ? adData.kind : kind}
                                label="סוג נכס"
                                variant="filled"
                                color='turquoise'
                                onChange={handleChange}
                                inputProps={{
                                    name: 'סוג נכס',
                                }}
                            >
                                <MenuItem dir='rtl' value={"דירה"}>דירה</MenuItem>
                                <MenuItem dir='rtl' value={"צימר"}>צימר</MenuItem>
                                <MenuItem dir='rtl' value={"אחר"}>אחר</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <GoogleMaps address={adData != {} && adData.address} getAddress={getAddress}></GoogleMaps>
                    {errorAddress && <div className='text-danger d-block' style={{ fontSize: "11px" }}>הכנס כתובת תקינה</div>}
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField {...register("floor", { required: true, minLength: 1, maxLength: 2, min: -7 })}
                        required
                        id="floor"
                        name="floor"
                        label="קומה"
                        type="number"
                        fullWidth
                        autoComplete="shipping address-line2"
                        variant="filled"
                        color='turquoise'
                        defaultValue={adData != {} && adData.floor}
                    />
                    {errors.floor && <div className='text-danger d-block' style={{ fontSize: "11px" }}>הכנס קומה תקינה</div>}
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField {...register("rooms", { required: true, minLength: 1, maxLength: 2, min: 0 })}
                        required
                        id="rooms"
                        name="rooms"
                        label="כמות חדרים"
                        type="number"
                        fullWidth
                        autoComplete="shipping address-level2"
                        variant="filled"
                        color='turquoise'
                        defaultValue={adData != {} && adData.rooms}
                    />
                    {errors.rooms && <div className='text-danger d-block' style={{ fontSize: "11px" }}>הכנס כמות חדרים תקינה</div>}
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField {...register("price", { required: true, minLength: 1, maxLength: 5, min: 0 })}
                        required
                        id="price"
                        name="price"
                        label="מחיר"
                        fullWidth
                        type="number"
                        autoComplete="shipping country"
                        variant="filled"
                        color='turquoise'
                        defaultValue={adData != {} && adData.price}
                    />
                    {errors.price && <div className='text-danger d-block' style={{ fontSize: "11px" }}>הכנס מחיר תקין</div>}
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField {...register("amount_people", { required: true, minLength: 1, maxLength: 3, min: 1 })}
                        required
                        id="amount_people"
                        name="amount_people"
                        type="number"
                        label="כמות מקסימלית של אנשים"
                        fullWidth
                        variant="filled"
                        color='turquoise'
                        defaultValue={adData != {} && adData.amount_people}
                    />
                    {errors.amount_people && <div className='text-danger d-block' style={{ fontSize: "11px" }}>הכנס כמות מקסימלית של אנשים תקינה</div>}
                </Grid>
                <Grid item xs={12} sm={12}>
                    <TextField {...register("description", { required: true, minLength: 10, maxLength: 180 })}
                        id="description"
                        name="description"
                        label="כמה מילים על הנכס שלך..."
                        fullWidth
                        autoComplete="shipping country"
                        multiline
                        rows={3}
                        color='turquoise'
                        variant="filled"
                        defaultValue={adData != {} && adData.description}
                    />
                    {errors.description && <div className='text-danger d-block' style={{ fontSize: "11px" }}>תיאור חייב לכלול בין 10-180 תוים</div>}
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Typography
                        id="price_type"
                        name="price_type"
                        required>סוג מחיר *:
                    </Typography>
                    <Grid item xs={12} sm={6}>
                        <RadioGroup color='turquoise'
                            name="use-radio-group" defaultValue={adData.price_type != null ? adData.price_type : typePrice}
                            onChange={handleType}>
                            <FormControlLabel value="true" label="מחיר ליום" control={<Radio color='turquoise' />} />
                            <FormControlLabel value="false" label="מחיר לנפש" control={<Radio color='turquoise' />} />
                        </RadioGroup>
                    </Grid>
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    type='submit'
                    color='turquoise'
                    variant="contained"
                    sx={{ mt: 3, ml: 1, color: "white" }}
                >
                    עמוד הבא
                </Button>
            </Box>
        </Container>
    );
}


import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, Slide, Typography } from '@mui/material';
import React, { useState } from 'react'
import ChooseDate from './chooseDate';
import PayPalCheckout from './payPal';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { doApiMethod } from '../services/apiService';
import { emailOrderTemplateId, emailServiceId, emailUserId } from '../config/secret';
import emailjs from '@emailjs/browser';



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
function AddOrder(props) {
    const [open, setOpen] = useState(false);
    const [err, setErr] = useState(false);
    const [success, setSuccess] = useState(false);

    const [openPrice, setOpenPrice] = useState(false);
    const [people, setPeople] = useState("");
    const [dateStartValue, setDateStartValue] = useState(null);
    const [dateEndValue, setDateEndValue] = useState(null);
    const [price, setPrice] = useState(0);
    const params = useParams();

    const user = useSelector(state => state.userSlice.dataUser)

    const handleStartDateChange = (newDate) => {
        setDateStartValue(newDate);
    };

    const handleEndDateChange = (newDate) => {
        setDateEndValue(newDate);
    };


    const amountPeople = (event) => {
        const selectedValue = event.target.value;
        setPeople(selectedValue);
    };

    const finalPrice = () => {
        const Difference_In_Time = new Date(dateEndValue).getTime() - new Date(dateStartValue).getTime();
        const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        if (props.ad.price_type) {
            setPrice(Difference_In_Days * (props.ad.price))
        }
        else {
            setPrice(Difference_In_Days * (props.ad.price) * people)
        }
        setOpenPrice(true)
    };

    const handleClickOpen = () => {
        setErr(false)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setOpenPrice(false)
    };

    const newOrder = async () => {

        let order =
        {
            id_invit: user._id,
            id_ad: params["idAd"],
            entry_date: dateStartValue,
            release_date: dateEndValue,
            number_people: people,
            price: price
        }


        try {
            let newOrder = await doApiMethod("/orders", "POST", order)
            sendEmail(newOrder.data)
            setSuccess(true)
            const timer = setTimeout(() => {
                setSuccess(false);
            }, 3000);
        }
        catch (err) {
            console.log(err);
            setErr(true)
        }
        props.ad.arr_busy_days.push({
            entry_date: dateStartValue,
            release_date: dateEndValue
        })
        try {
            let data = { ...props.ad };
            delete data.nameOwner
            delete data.phone
            delete data._id
            await doApiMethod(`/ads/${params["idAd"]}`, "PUT", data)
            setOpen(false);
            setOpenPrice(false)


        }
        catch (err) {
            console.log(err);
        }


    };

    const sendEmail = (order) => {
        const templateParams = {
            name: user.name,
            email: user.email,
            id: order._id,
            checkIn: new Date(order.entry_date).toLocaleDateString(),
            checkOut: new Date(order.release_date).toLocaleDateString(),
            people: order.number_people,
            price: order.price
        };
        emailjs.send(emailServiceId, emailOrderTemplateId, templateParams, emailUserId)
            .then((result) => {
                console.log(result)
            }, (error) => {
                // show the user an error
            });
    };
    return (
        <div className='d-flex'>
            {props.ad.isActive ?
                <div>
                    {user ?
                        <div>{user._id != props.ad.id_user ?
                            <button className='btn btn-light m-1' onClick={handleClickOpen}>הזמן מקום</button> :
                            <Typography className='m-2 p-2 bg-success-subtle  rounded-3' color="text.secondary" variant="body5"><b>זאת המודעה שלך!</b></Typography>
                        }</div>
                        :
                        <Typography className='m-2 p-2 bg-success-subtle  rounded-3' color="text.secondary" variant="body5"><b>כדי להזמין מקום עלייך </b><Link className='' to="/login" style={{ color: "black" }}>להתחבר</Link></Typography>
                    }
                </div> :
                <Typography className='m-2 p-2 bg-success-subtle  rounded-3' color="text.secondary" variant="body5"><b>המודעה לא פעילה</b></Typography>

            }
            {err && <Alert severity="error">אירעה שגיאה, נסה שוב</Alert>}
            {success && <Alert severity="success">ההזמנה בוצעה, פרטי ההזמנה במייל</Alert>}

            <Dialog
                fullWidth
                dir='rtl'
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle className='bg-success-subtle text-center pb-3'>{"הזמנת מקום"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {!openPrice ? <div>
                            <ChooseDate handleStartDateChange={handleStartDateChange} handleEndDateChange={handleEndDateChange} busy_days={props.ad.arr_busy_days} />
                            <FormControl fullWidth sx={{ margin: "21px 0" }}>
                                <InputLabel id="demo-simple-select-label">כמות אנשים להזמנה</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="כמות אנשים להזמנה"
                                    onChange={amountPeople}

                                >
                                    {(() => {
                                        const options = [];
                                        for (let i = 1; i <= props.ad.amount_people; i++) {
                                            options.push(
                                                <MenuItem key={i} value={i}>
                                                    {i}
                                                </MenuItem>
                                            );
                                        }
                                        return options;
                                    })()}

                                </Select>
                            </FormControl>
                        </div>
                            : <div>
                                <h2>מחיר סופי: {price} ₪</h2>
                                <PayPalCheckout />
                            </div>}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {openPrice ?
                        <div>
                            <Button className='btn bg-success-subtle text-dark m-2' onClick={() => { setOpenPrice(false) }}>חזור</Button>
                            <Button className='btn bg-success-subtle text-dark m-2' onClick={newOrder}>שלם</Button>
                        </div> :
                        <Button className='btn bg-success-subtle text-dark m-2' disabled={!dateEndValue || !dateEndValue || people == ""} onClick={finalPrice}>המשך</Button>
                    }
                </DialogActions>
            </Dialog>

        </div>
    )
}

export default AddOrder
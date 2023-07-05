import { Alert, Button, CardActions, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'
import Carousel from 'react-material-ui-carousel'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';
import { doApiMethod } from '../services/apiService';

function LikeItem(props) {
    const note = useRef()
    const nav = useNavigate();
    const [open, setOpen] = useState(false);
    const [save, setSave] = useState(false);

    let ad = props.item
    const moreInfo = () => {
        nav(`/moreInfo/${ad._id}`)
    }

    const deleteLike = async () => {
        if (!open) {
            setOpen(true)
        } else {
            try {
                await doApiMethod(`/adsLikes/${ad._id}`, "DELETE")
                props.doApi()
            }
            catch (err) {
                console.log(err);
            }
        }
    }

    const cancel = () => {
        setOpen(false)
    }

    const ButtonSave = () => {
        setSave(true)
    }

    const saveNote = async () => {
        try {
            await doApiMethod(`/adsLikes/changeNote/${ad._id}`, "PATCH", { note: note.current.value })
            props.doApi()
        }
        catch (err) {
            console.log(err);
        }
    }



    return (
        <div className='center'>
            <div classNameName="card mb-3  " >

                <div className=" m-3 p-4 shadow rounded-2 " style={{ minWidth: "1000px" }}>
                    <button class="btn-close d-flex justify-content-start align-self-start bg-success-subtle" onClick={() => { setOpen(true) }}></button>
                    <div className="row g-0 justify-content-between">
                        <div className="col-md-6">
                            <Carousel className=' rounded-3'>
                                {
                                ad.arr_img.length > 0 ?
                                    ad.arr_img.map((img, i) => <Item key={i} item={img} />)
                                    : <Item item={"https://i.ibb.co/Qp1TRxQ/no-image.png"} />

                                }
                            </Carousel>
                        </div>
                        <div className="col-md-6">
                            <div className="card-body">
                                <h5 className="card-title d-flex justify-content-between">
                                    {ad.price_type ?
                                        <Typography gutterBottom variant="h5" component="div"> {ad.price} ₪ ללילה</Typography> :
                                        <Typography gutterBottom variant="h5" component="div">  {ad.price} ₪ לאדם</Typography>
                                    }
                                    <Typography sx={{ direction: "ltr" }} variant="body2" color="text.secondary">
                                        <LocationOnIcon />{ad.address}
                                    </Typography>
                                </h5>
                                <Typography variant="body6" color="text.secondary">
                                    {ad.description}
                                </Typography><br />
                                <Typography variant="body4" color="text.secondary">
                                    <b>כמות אנשים מקסימאלית: </b>{ad.amount_people}
                                </Typography>
                                <br />
                                <FormControl fullWidth sx={{ my: 2 }} variant="outlined">
                                    <InputLabel color='turquoise'>הערה אישית על המודעה</InputLabel>
                                    <OutlinedInput
                                        inputRef={note}
                                        margin="normal"
                                        fullWidth
                                        name="note"
                                        label='הערה אישית על המודעה'
                                        id="note"
                                        autoComplete="current-note"
                                        color='turquoise'
                                        type='text'
                                        defaultValue={ad.note}
                                        onInput={ButtonSave}
                                        autoFocus
                                        endAdornment={
                                            <InputAdornment position="end">
                                                {save && <Button className='btn bg-success-subtle text-dark' size="small" onClick={saveNote}>שמור</Button>}
                                            </InputAdornment>
                                        }

                                    />
                                </FormControl>
                                <br />
                                <Button className='btn bg-success-subtle text-dark' size="small" onClick={moreInfo}>מידע נוסף</Button>

                            </div>
                        </div>
                    </div>
                    {open &&
                        <Alert severity="warning">האם אתה בטוח שברצונך למחוק מודעה שמורה זאת?
                            <Button className='btn bg-danger-subtle text-dark mx-2' size="small" onClick={deleteLike}>אישור</Button>
                            <Button className='btn bg-danger-subtle text-dark mx-2' size="small" onClick={cancel}>ביטול</Button>

                        </Alert>}


                </div>
            </div>
        </div>
    )
}

function Item(props) {
    return (
        <img src={props.item} width={460} height={230}></img>
    )
}

export default LikeItem
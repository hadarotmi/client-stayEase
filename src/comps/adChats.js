import React, { useEffect, useRef, useState } from 'react'
import { doApiGet, doApiMethod } from '../services/apiService'
import { Alert, Checkbox, Container, IconButton, Rating, TextareaAutosize, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import { useConfirm } from 'material-ui-confirm';
import { Link } from 'react-router-dom';
import { sortBy } from 'lodash';


function AdChats(props) {
    const [comments, setComments] = useState()
    const [add, setAdd] = useState(false)
    const [star, setStar] = useState(0);
    const myComment = useRef()
    const dataUser = useSelector(state => state.userSlice.dataUser)
    const [err, setErr] = useState(false);
    const confirm = useConfirm();


    useEffect(() => {
        doApi()
    }, [])

    const addComment = async () => {
        let chat =
            ({
                comment: myComment.current.value,
                score: star,
                id_ad: props.idAd
            });
        console.log(chat);
        try {
            await doApiMethod("/chats", "POST", chat)
            doApi()
            setAdd(false)
            setStar(0)
        }
        catch (err) {
            setErr(true);
            console.log(err);
        }

    }

    const RemoveComment = async (id) => {
        confirm({ title: "אישור מחיקה", description: "אתה בטוח שברצונך למחוק את התגובה?", cancellationText: "ביטול", confirmationText: "אישור" })
            .then(async () => {
                await doApiMethod(`/chats/${id}`, "DELETE")
                doApi()
            })
            .catch(() => {
                /* ... */
            });
    }

    const doApi = async () => {
        let chats = await doApiGet(`/chats/${props.idAd}`)
        chats=sortBy(chats, "date_created")
        setComments(chats)
    }
    return (
        <div className='' style={{ width: "600px", minHeight: "500px" }}>
            <Container>
                <h3 ><b>תגובות</b></h3>

                {comments?.map(item => {
                    return (

                        <div key={item._id} className=' border-dark m-2 p-2 d-flex justify-content-between bg-light rounded-3' >

                            <div>
                                <Typography color="text.secondary" variant="body5"><b>{item.name}</b></Typography>
                                <Typography color="text.secondary" variant="body2"> <div>{item.comment}</div></Typography>
                                <Rating name="read-only" value={item.score} readOnly />

                            </div>


                            <div className="">
                                <Typography color="text.secondary" variant="body5"><b>{new Date(item.date_created).toLocaleDateString()}</b></Typography><br />
                                {item.id_invit == dataUser?._id && <IconButton sx={{ height: "60px" }} aria-label="delete" className='p-3' width={100} onClick={() => RemoveComment(item._id)}>
                                    <DeleteIcon fontSize="inherit" color='red' />
                                </IconButton>}
                            </div>
                        </div>)
                })}
                {dataUser ?
                    <div>
                        {dataUser._id === props.iduser ?
                            <Typography className='m-2 p-2 rounded-3' color="text.secondary" variant="body5"><b>זאת המודעה שלך ולכן אינך יכול להגיב</b></Typography>
                            :
                            <div>
                                {!add ? <button className='btn btn-light m-1' onClick={() => {
                                    setAdd(true)
                                }}>הוסף תגובה</button> :
                                    <div className='shadow rounded-3 p-3' style={{ width: "1000px" }}>
                                        {err && <Alert severity="error" className='mx-3 mb-3'>תגובה לא יכולה להיות ריקה או מתחת לשני תוים, נא מלא את תגובתך</Alert>}
                                        <TextareaAutosize onInput={() => { setErr(false) }} ref={myComment} minRows={3} placeholder="התגובה שלך" style={{ width: "100%" }} /><br />
                                        <Rating name="hover-feedback" value={star} onChange={(event, newstar) => { setStar(newstar); }} /><br />
                                        <button onClick={addComment} className='btn btn-light m-1'>אישור</button>
                                    </div>}
                            </div>
                        }
                    </div> :
                    <div>
                        <Typography className='m-2 p-2 rounded-3' color="text.secondary" variant="body5"><b>כדי לכתוב תגובה על המודעה עלייך </b><Link className='' to="/login" style={{ color: "black" }}>להתחבר</Link></Typography>

                    </div>}

            </Container>
        </div>
    )
}

export default AdChats
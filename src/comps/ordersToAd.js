import React, { useEffect, useState } from 'react'
import { TOKEN_NAME, doApiGet, doApiMethod } from '../services/apiService';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Collapse, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, Slide, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AdItem from './adItem';
import Loading from './loading';
import { useDispatch } from 'react-redux';
import { adEdit } from '../features/adSlice';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function OrdersToAd() {
    const [openDelete, setOpenDelete] = useState(false);
    const [orders, setOrders] = useState(null);
    const [info, setInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch()
    const params = useParams();
    const nav = useNavigate()

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        doApi()

        return () => clearTimeout(timer);


    }, [])

    const doApi = async () => {
        if (localStorage[TOKEN_NAME] != null) {
            let data = await doApiGet(`/orders/idAd/${params["idAd"]}`)
            setOrders(data)
            let ad = await doApiGet(`/ads/adId/${params["idAd"]}`)
            setInfo(ad)
        }
    }

    const editAd = () => {
        dispatch(adEdit({ data: info }))
        nav(`/editAd/${params["idAd"]}`)
    }

    const isActive = async () => {
        setOpenDelete(false);
        await doApiMethod(`/ads/${params["idAd"]}`, "PATCH", { isActive: !info.isActive })
        doApi()
    }


    const handleClickDelete = () => {
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };
    return (
        <div>{!isLoading ?
            <Container >

                <div className='center '>
                    <div className='col-lg-4'>
                        {info && <AdItem key={info?._id} item={info} orderAd={true} />}
                    </div>
                    <TableContainer component={Paper} className=''>
                        <Typography className='mt-3 center fs-3' color="text.secondary" variant="body5">ההזמנות למודעה שלך</Typography>
                        {orders.length > 0 ?
                            <Table aria-label="collapsible table col-lg-6">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className='bg-success-subtle' />
                                        <TableCell align="left" className='bg-success-subtle'>שם</TableCell>
                                        <TableCell align="left" className='bg-success-subtle'>תאריך כניסה</TableCell>
                                        <TableCell align="left" className='bg-success-subtle'>תאריך יציאה</TableCell>
                                        <TableCell align="left" className='bg-success-subtle'>כמות אנשים</TableCell>
                                        <TableCell align="left" className='bg-success-subtle'>מחיר</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orders?.map((row) => (
                                        <Row key={row._id} row={row} />
                                    ))}
                                </TableBody>
                            </Table> :
                            <Typography className='m-2 p-2 bg-success-subtle  rounded-3 center' color="text.secondary" variant="body5"><b>אין לך הזמנות למודעה זו</b></Typography>
                        }

                    </TableContainer>
                </div>
                <div className='center mb-3'>
                    {info?.isActive ?
                        <Button className='col-lg-6' onClick={handleClickDelete} variant="contained" sx={{ mt: 3, ml: 1, color: "white" }} color='red'>הקפאת מודעה</Button> :
                        <Typography className='col-lg-6' color="text.secondary" variant="body5">מודעה מוקפאת- להחזרה לפעילות
                            <Button className='' onClick={isActive} variant="contained" sx={{ ml: 1, color: "white" }} color='red'>לחץ כאן</Button></Typography>
                    }

                    <Button className='col-lg-6' onClick={editAd} variant="contained" sx={{ mt: 3, color: "white" }} color='turquoise'>עדכון פרטי מודעה</Button>

                </div>
                <Dialog
                dir='rtl'
                    open={openDelete}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleCloseDelete}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle className='bg-success-subtle text-center pb-3'>הקפאת מודעה</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            שים לב! המודעה תוקפא ומשתמשים לא יוכלו להזמין ממנה יותר, אבל משתמשים שכבר הזמינו מקום לפני ההקפאה- ההזמנה שלהם בתוקף
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={isActive}>אישור</Button>
                        <Button onClick={handleCloseDelete}>ביטול</Button>
                    </DialogActions>
                </Dialog>
            </Container> :
            <Loading />}
        </div>
    )
}

function Row(props) {
    const { row } = props;
    const [openDelete, setOpenDelete] = React.useState(false);
    const [start, setStart] = React.useState();
    const [end, setEnd] = React.useState();

    useEffect(() => {
        if (row.entry_date) {
            setStart(new Date(row.entry_date).toLocaleDateString())
        }
        if (row.release_date) {
            setEnd(new Date(row.release_date).toLocaleDateString())
        }

    }, [])
    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpenDelete(!openDelete)}
                        className='bg-success-subtle'
                    >
                        {openDelete ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.name}
                </TableCell>
                <TableCell align="left">{start}</TableCell>
                <TableCell align="left">{end}</TableCell>
                <TableCell align="left">{row.number_people}</TableCell>
                <TableCell align="left">{row.price}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={openDelete} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography color="text.secondary" variant="body5" gutterBottom component="div">
                                פרטי מזמין
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className='bg-success-subtle'>שם</TableCell>
                                        <TableCell className='bg-success-subtle'>פלאפון</TableCell>
                                        <TableCell className='bg-success-subtle'>מייל</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell>{row.phone}</TableCell>
                                        <TableCell>{row.email}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}
export default OrdersToAd
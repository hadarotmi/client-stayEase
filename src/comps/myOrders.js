import React, { useEffect, useState } from 'react'
import { TOKEN_NAME, doApiGet, doApiMethod } from '../services/apiService';
import { Link, useParams } from 'react-router-dom';
import { Box, Collapse, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Loading from './loading';
import { useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import { sortBy } from 'lodash';


function MyOrders() {
    const [orders, setOrders] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const dataUser = useSelector(state => state.userSlice.dataUser)

    const params = useParams();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        doApi()

        return () => clearTimeout(timer);


    }, [])

    const doApi = async () => {
        if (localStorage[TOKEN_NAME] != null) {
            let data = await doApiGet(`/orders/idinvit/${dataUser._id}`)
            let d = sortBy(data, "entry_date")
            console.log(data);
            setOrders(d)
        }
    }
    return (
        <div>{!isLoading ?
            <Container >
                <div className='center mt-5'>
                    <TableContainer component={Paper} className=''>
                        <Typography className='mt-3 center fs-1' color="text.secondary" variant="body5">ההזמנות  שלך</Typography>

                        {orders.length > 0 ?
                            <Table aria-label="collapsible table col-lg-6">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left" className='bg-success-subtle'>כתובת</TableCell>
                                        <TableCell align="left" className='bg-success-subtle'>תאריך כניסה</TableCell>
                                        <TableCell align="left" className='bg-success-subtle'>תאריך יציאה</TableCell>
                                        <TableCell align="left" className='bg-success-subtle'>כמות אנשים</TableCell>
                                        <TableCell align="left" className='bg-success-subtle'>מחיר</TableCell>
                                        <TableCell align="left" className='bg-success-subtle'></TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orders?.map((row) => (
                                        <Row key={row._id} row={row} doApi={doApi}/>
                                    ))}
                                </TableBody>
                            </Table> :
                            <Typography className='m-2 p-2 bg-success-subtle  rounded-3 center' color="text.secondary" variant="body5"><b>אין לך הזמנות בסל</b></Typography>
                        }
                    </TableContainer>
                </div>
                <Typography className='mt-3 ' color="text.secondary" >***ההזמנות ניתנות לביטול רק עד 7 ימים לפני מועד ההזמנה!</Typography>

            </Container> :

            <Loading />}
        </div>
    )
}

function Row(props) {
    const { row } = props;
    const [start, setStart] = React.useState();
    const [end, setEnd] = React.useState();
    const [currentDate, setCurrentDate] = useState(new Date().getDate() + 7);


    useEffect(() => {
        if (row.entry_date) {
            setStart(new Date(row.entry_date).toLocaleDateString())
        }
        if (row.release_date) {
            setEnd(new Date(row.release_date).toLocaleDateString())
        }

    }, [])

    const deleteOrder = async () => {
        try{
            let busyDate = await doApiGet(`/ads/busyDate/adId/${row.id_ad}`)
            busyDate = busyDate.filter(date => { return date.entry_date != row.entry_date })
            await doApiMethod(`/ads/busyDate/adId/${row.id_ad}`, 'PATCH', {busyDate:busyDate})
            await doApiMethod(`/orders/${row._id}`, 'DELETE')
            props.doApi()
            console.log(busyDate);
        }
        catch(err) {
            console.log(err);
        }

    }

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset', background: `${new Date(row.release_date) < Date.now() && "#ededed"}` } }}>
                <TableCell component="th" scope="row">
                    {row.address}
                </TableCell>
                <TableCell align="left">{start}</TableCell>
                <TableCell align="left">{end}</TableCell>
                <TableCell align="left">{row.number_people}</TableCell>
                <TableCell align="left">{row.price}</TableCell>
                <TableCell align="left">
                    <Link to={`/moreInfo/${row.id_ad}`} className='btn bg-success-subtle'>פרטי מקום</Link>
                    {new Date(row.entry_date) >= new Date().setDate(new Date().getDate() + 7) &&
                        <IconButton aria-label="delete" className='me-3' onClick={() => { deleteOrder() }}>
                            <DeleteIcon fontSize="inherit" color='red' />
                        </IconButton>}
                </TableCell>

            </TableRow>
        </React.Fragment>
    );
}
export default MyOrders
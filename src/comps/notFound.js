import { Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
    return (
        <div className='center m-5 flex-column' sx={{ color: 'grey.500', }} spacing={2} direction="row">
            <img className='rounded-3 shadow' style={{ width: "600px" }} src='https://media2.giphy.com/media/UoeaPqYrimha6rdTFV/giphy.gif' />
            <Typography className='m-2 p-2 fs-3' color="text.secondary" variant="body5"><b>אופססססס, העמוד שביקשת לא נמצא, אתה יכול לחזור  </b><Link className='' to="/" style={{ color: "#0D9488" }}>לדף הבית</Link></Typography>

        </div>
    )
}

export default NotFound
import React from 'react'
import { Link } from 'react-router-dom'
import { TOKEN_NAME } from '../services/apiService'
import SearchInput from './searchInput'

function Strip() {
  return (
    <div className='img-fluid center text-white flex-column container-fluid' style={{ backgroundImage: "url(https://i.ibb.co/DYxZQGS/pexels-pixabay-261156.jpg", opacity:".8"}}>
      <h1 className='display-1 text-white' ><b>הדרך לחופשה מושלמת</b>...</h1>
      {localStorage[TOKEN_NAME]==null&&<Link to="/login" className='px-4 btn btn-dark m-4 fs-4'>כניסה</Link>}
    </div>
    )
}

export default Strip
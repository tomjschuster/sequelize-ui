import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

const Home = () => (
  <Fragment>
    <h2>Home</h2>
    <Link to='/models'>Models</Link>
  </Fragment>
)

export default Home

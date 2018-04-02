import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => (
  <React.Fragment>
    <h2>Home</h2>
    <Link to='/models'>Models</Link>
  </React.Fragment>
)

export default Home

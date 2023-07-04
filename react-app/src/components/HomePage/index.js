import React from 'react'
import "./HomePage.css"
import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div className='homepage-container'>

      <div className='homepage-startmatch'>
        <Link to={`/match/2`}>Start Match</Link>
      </div>



    </div>
  )
}

export default HomePage

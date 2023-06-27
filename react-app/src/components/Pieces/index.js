import React from 'react'
import "./Pieces.css"



function Pieces({ number, image, type, id}) {

  if (number % 2 === 0) {
    return (
      <div className='tile black-tile'>
        {image && <div style={{backgroundImage: `url(${image})`}} className='chess-piece'></div>}
      </div>
    )

  } else {
    return (
      <div className='tile white-tile'>
        {image && <div style={{backgroundImage: `url(${image})`}} className='chess-piece'></div>}
      </div>
    )
  }

}

export default Pieces

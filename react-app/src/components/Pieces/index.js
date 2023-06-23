import React from 'react'
import "./Pieces.css"

function Pieces({ number, image, type }) {

  let pieceClass = type ? `piece ${type}` : 'piece';


  if (number % 2 === 0) {

    return (
      <div className='black-tile'>
        {image && <img src={image} className={pieceClass}/>}
      </div>
    )

  } else {

    return (
      <div className='white-tile'>
        {image && <img src={image} className={pieceClass}/>}
      </div>
    )
  }

}

export default Pieces

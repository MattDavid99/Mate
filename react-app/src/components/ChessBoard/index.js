import React, { useRef, useState } from 'react'
import './ChessBoard.css'
import Pieces from '../Pieces'

function ChessBoard() {

  const [positionPieces, setPositionPieces] = useState([])

  const horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  const verticalAxis = ['1', '2', '3', '4', '5', '6', '7', '8']

  let board = []

  const chessBoardRef = useRef(null)

  let grabbedPiece = null;

  // const pieces = [
  //   {image: '../assets/images/whitepawn.png', x: 0, y: 0},
  //   {image: '../assets/images/whitebishop.png', x: 0, y: 0},
  //   {image: '../assets/images/whiterook.png', x: 0, y: 0},
  //   {image: '../assets/images/whiteknight.png', x: 0, y: 0},
  //   {image: '../assets/images/whiteking.png', x: 0, y: 0},
  //   {image: '../assets/images/whitequeen.png', x: 0, y: 0},
  //   {image: '../assets/images/blackpawn.png', x: 0, y: 0},
  //   {image: '../assets/images/blackbishop.png', x: 0, y: 0},
  //   {image: '../assets/images/blackrook.png', x: 0, y: 0},
  //   {image: '../assets/images/blackknight.png', x: 0, y: 0},
  //   {image: '../assets/images/blackking.png', x: 0, y: 0},
  //   {image: '../assets/images/blackqueen.png', x: 0, y: 0}
  // ]

  // SETTING UP PIECES ⬇️⬇️⬇️
  let pieces = []

  for (let i = 0; i < 8; i++) {
    pieces.push({image: '../assets/images/whitepawn.png', x: 1, y: i, type: 'whitepawn'});
  }

  for (let i = 0; i < 8; i++) {
    pieces.push({image: '../assets/images/blackpawn.png', x: 6, y: i, type: 'blackpawn'});
  }

  // black pieces
  pieces.push({image: '../assets/images/blackrook.png', x: 7, y: 7, type: 'blackrook'})
  pieces.push({image: '../assets/images/blackrook.png', x: 7, y: 0, type: 'blackrook'})
  pieces.push({image: '../assets/images/blackknight.png', x: 7, y: 1, type: 'blackknight'})
  pieces.push({image: '../assets/images/blackknight.png', x: 7, y: 6, type: 'blackknight'})
  pieces.push({image: '../assets/images/blackbishop.png', x: 7, y: 2, type: 'blackbishop'})
  pieces.push({image: '../assets/images/blackbishop.png', x: 7, y: 5, type: 'blackbishop'})
  pieces.push({image: '../assets/images/blackking.png', x: 7, y: 4, type: 'blackking'})
  pieces.push({image: '../assets/images/blackqueen.png', x: 7, y: 3, type: 'blackqueen'})


  // white pieces
  pieces.push({image: '../assets/images/whiterook.png', x: 0, y: 0, type: 'whiterook'});
  pieces.push({image: '../assets/images/whiterook.png', x: 0, y: 7, type: 'whiterook'});
  pieces.push({image: '../assets/images/whiteknight.png', x: 0, y: 6, type: 'whiteknight'});
  pieces.push({image: '../assets/images/whiteknight.png', x: 0, y: 1, type: 'whiteknight'});
  pieces.push({image: '../assets/images/whitebishop.png', x: 0, y: 2, type: 'whitebishop'});
  pieces.push({image: '../assets/images/whitebishop.png', x: 0, y: 5, type: 'whitebishop'});
  pieces.push({image: '../assets/images/whitequeen.png', x: 0, y: 3, type: 'whitequeen'});
  pieces.push({image: '../assets/images/whiteking.png', x: 0, y: 4, type: 'whiteking'});



  for (let i = verticalAxis.length - 1; i >= 0; i--){
    for (let j = 0; j < horizontalAxis.length; j++){

      const number = j + i + 2

      let image = undefined
      let type = undefined

      pieces.forEach((p) => {
        if (p.x === i && p.y === j) {
          image = p.image
          type = p.type
        }
      })

      board.push(<Pieces key={`${i},${j}`} number={number} image={image} type={type}/>)
    }
  }




  const handleGrabbingPiece = (e) => {
    const ele = e.target

    if (ele.classList.contains("piece")){

      const x = e.clientX - 50
      const y = e.clientY - 50
      ele.style.position = 'absolute'
      ele.style.left = `${x}px`
      ele.style.top = `${y}px`

      grabbedPiece = ele

    }
  }

  const handleMovingPiece = (e) => {

    let chessboard = chessBoardRef.current

    if (grabbedPiece && chessboard) {

      const minX = chessboard.offsetLeft - 5
      const minY = chessboard.offsetTop - 5
      const maxX = chessboard.offsetLeft + chessboard.clientWidth - 85
      const maxY = chessboard.offsetTop + chessboard.clientHeight - 85
      const x = e.clientX - 50
      const y = e.clientY - 50
      // const maxX = chessboard.offsetLeft + chessboard.clientWidth - grabbedPiece.clientWidth;
      // const maxY = chessboard.offsetTop + chessboard.clientHeight - grabbedPiece.clientHeight;
      // const x = e.clientX - grabbedPiece.clientWidth / 2;
      // const y = e.clientY - grabbedPiece.clientHeight / 2;
      grabbedPiece.style.position = 'absolute'

      // grabbedPiece.style.top = `${x}px`
      // grabbedPiece.style.top = `${y}px`

      // if (x < minX) {
      //   grabbedPiece.style.left = `${minX}px`

      // } else {
      //   grabbedPiece.style.left = `${x}px`
      // }

      // X axis styling (so piece cannot exit board left to right)
      if (x < minX) {
        grabbedPiece.style.left = `${minX}px`

      } else if (x > maxX) {
        grabbedPiece.style.left = `${maxX}px`

      } else {
        grabbedPiece.style.left = `${x}px`
      }

      // Y axis styling (so piece cannot exit board top to bottom)
      if (y < minY) {
        grabbedPiece.style.top = `${minY}px`

      } else if (y > maxY) {
        grabbedPiece.style.top = `${maxY}px`

      } else {
        grabbedPiece.style.top = `${y}px`
      }

      // grabbedPiece.style.left = x < minX ? `${minX}px` : `${x}px`
      // grabbedPiece.style.top = y < minY ? `${minY}px` : `${y}px`
    }
  }

  const handleDroppingPiece = (e) => {
    if (grabbedPiece) {
      grabbedPiece = null
    }
  }


  return (
    <div className='chessboard-container'>
      <div onMouseUp={(e => handleDroppingPiece(e))} onMouseMove={(e => handleMovingPiece(e))} onMouseDown={(e => handleGrabbingPiece(e))} className='chessboard' ref={chessBoardRef}>{board}</div>
    </div>
  )
}

export default ChessBoard

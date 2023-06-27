import React, { useEffect, useRef, useState } from 'react'
import './ChessBoard.css'
import Pieces from '../Pieces'

function ChessBoard() {

  const initialBoardState = []
  const [xAxis, setXAxis] = useState(0)
  const [yAxis, setYAxis] = useState(0)
  const [grabbedPiece, setGrabbedPiece] = useState(null) || null



  for (let i = 0; i < 8; i++) {
    initialBoardState.push({image: '../assets/images/blackpawn.png', x: 1, y: i, type: 'blackpawn'});
  }

  for (let i = 0; i < 8; i++) {
    initialBoardState.push({image: '../assets/images/whitepawn.png', x: 6, y: i, type: 'whitepawn'});
  }

  // white pieces
  initialBoardState.push({image: '../assets/images/whiterook.png', x: 7, y: 7, type: 'whiterook'})
  initialBoardState.push({image: '../assets/images/whiterook.png', x: 7, y: 0, type: 'whiterook'})
  initialBoardState.push({image: '../assets/images/whiteknight.png', x: 7, y: 1, type: 'whiteknight'})
  initialBoardState.push({image: '../assets/images/whiteknight.png', x: 7, y: 6, type: 'whiteknight'})
  initialBoardState.push({image: '../assets/images/whitebishop.png', x: 7, y: 2, type: 'whitebishop'})
  initialBoardState.push({image: '../assets/images/whitebishop.png', x: 7, y: 5, type: 'whitebishop'})
  initialBoardState.push({image: '../assets/images/whiteking.png', x: 7, y: 3, type: 'whiteking'})
  initialBoardState.push({image: '../assets/images/whitequeen.png', x: 7, y: 4, type: 'whitequeen'})


  // black pieces
  initialBoardState.push({image: '../assets/images/blackrook.png', x: 0, y: 0, type: 'blackrook'});
  initialBoardState.push({image: '../assets/images/blackrook.png', x: 0, y: 7, type: 'blackrook'});
  initialBoardState.push({image: '../assets/images/blackknight.png', x: 0, y: 6, type: 'blackknight'});
  initialBoardState.push({image: '../assets/images/blackknight.png', x: 0, y: 1, type: 'blackknight'});
  initialBoardState.push({image: '../assets/images/blackbishop.png', x: 0, y: 2, type: 'blackbishop'});
  initialBoardState.push({image: '../assets/images/blackbishop.png', x: 0, y: 5, type: 'blackbishop'});
  initialBoardState.push({image: '../assets/images/blackqueen.png', x: 0, y: 4, type: 'blackqueen'});
  initialBoardState.push({image: '../assets/images/blackking.png', x: 0, y: 3, type: 'blackking'});

  const [pieces, setPieces] = useState(initialBoardState)

  const horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  const verticalAxis = ['1', '2', '3', '4', '5', '6', '7', '8']

  let board = []

  const chessBoardRef = useRef(null)


    // grabPiece
    const handleGrabbingPiece = (e) => {
      const ele = e.target

      if (ele.classList.contains("piece") && chessBoardRef.current){

        setXAxis(Math.floor((e.clientX - chessBoardRef.current.offsetLeft) / 100))
        setYAxis(7 - Math.floor((e.clientY - chessBoardRef.current.offsetTop) / 100))

        const x = e.clientX - 50
        const y = e.clientY - 50
        ele.style.position = 'absolute'
        ele.style.left = `${x}px`
        ele.style.top = `${y}px`

        setGrabbedPiece(ele)

      }
    }
    // movePiece
    const handleMovingPiece = (e) => {

      let chessboard = chessBoardRef.current

      if (grabbedPiece && chessboard) {

        const minX = chessboard.offsetLeft - 5
        const minY = chessboard.offsetTop - 5
        const maxX = chessboard.offsetLeft + chessboard.clientWidth - 85
        const maxY = chessboard.offsetTop + chessboard.clientHeight - 85
        const x = e.clientX - 50
        const y = e.clientY - 50

        grabbedPiece.style.position = 'absolute'


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


      }
    }

    // dropPiece
    const handleDroppingPiece = (e) => {

      if (grabbedPiece) {

        const squareSize = 100;
        const x = Math.floor((e.clientX - chessBoardRef.current.offsetLeft) / squareSize);
        const y = 7 - Math.floor((e.clientY - chessBoardRef.current.offsetTop) / squareSize);
        console.log(x,y);

        // Make pieces lock in place
        const centerX = chessBoardRef.current.offsetLeft + x * squareSize + squareSize / 2;
        const centerY = chessBoardRef.current.offsetTop + (7 - y) * squareSize + squareSize / 2;

        grabbedPiece.style.left = `${centerX - grabbedPiece.clientWidth / 2}px`;
        grabbedPiece.style.top = `${centerY - grabbedPiece.clientHeight / 2}px`;

        setPieces(value => {
          const pieces = value.map((p) => {
            if (p.x == xAxis && p.y == yAxis){
              p.x = x
              p.y = y
            }
            return p
          })
          return pieces
        })

        setGrabbedPiece(null)

      }
    }

    for (let i = 0; i < horizontalAxis.length; i++){
      for (let j = verticalAxis.length - 1; j >= 0; j--){

        const number =  j + i + 2

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



  return (
    <div className='chessboard-container'>
      <div onMouseUp={(e => handleDroppingPiece(e))} onMouseMove={(e => handleMovingPiece(e))} onMouseDown={(e => handleGrabbingPiece(e))} className='chessboard' ref={chessBoardRef}>{board}</div>
    </div>
  )
}

export default ChessBoard

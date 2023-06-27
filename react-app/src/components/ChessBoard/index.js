import React, { useEffect, useRef, useState } from 'react'
import './ChessBoard.css'
import Pieces from '../Pieces'

// X and Y axis for chess board = [a8, b8, c8, d8, etc.]
const horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const verticalAxis = ['1', '2', '3', '4', '5', '6', '7', '8']





const initialBoardState = []

 for (let p = 0; p < 2; p++){
   const type = p === 0 ? "black" : "white"
   const y = p === 0 ? 7 : 0
   // rooks
   initialBoardState.push({image: `../assets/images/${type}rook.png`, x:0, y})
   initialBoardState.push({image: `../assets/images/${type}rook.png`, x:7, y})
   // knights
   initialBoardState.push({image: `../assets/images/${type}knight.png`, x:1, y})
   initialBoardState.push({image: `../assets/images/${type}knight.png`, x:6, y})
   // bishops
   initialBoardState.push({image: `../assets/images/${type}bishop.png`, x:2, y})
   initialBoardState.push({image: `../assets/images/${type}bishop.png`, x:5, y})
   // king and queen
   initialBoardState.push({image: `../assets/images/${type}queen.png`, x:3, y})
   initialBoardState.push({image: `../assets/images/${type}king.png`, x:4, y})
 }

  for (let i = 0; i < 8; i++) {
    initialBoardState.push({image: "../assets/images/blackpawn.png", x:i, y:6})
  }

  for (let i = 0; i < 8; i++) {
    initialBoardState.push({image: "../assets/images/whitepawn.png", x:i, y:1})
  }




function ChessBoard() {

  const [activePiece, setActivePiece] = useState(null)
  const [gridX, setGridX] = useState(0)
  const [gridY, setGridY] = useState(0)
  const [pieces, setPieces] = useState(initialBoardState)
  const chessboardRef = useRef(null)



  function grabPiece(e) {
    const element = e.target
    const chessboard = chessboardRef.current

    if (element.classList.contains("chess-piece") && chessboard){


      setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / 100))
      setGridY(Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100)))

      const x = e.clientX - 50;
      const y = e.clientY - 50;
      element.style.position = "absolute"
      element.style.left = `${x}px`
      element.style.top = `${y}px`

      setActivePiece(element)
    }
  }

  function movePiece(e) {
    const chessboard = chessboardRef.current

    if (activePiece && chessboard) {
      const minX = chessboard.offsetLeft - 25;
      const minY = chessboard.offsetTop - 25;
      const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
      const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;
      const x = e.clientX - 50;
      const y = e.clientY - 50;
      activePiece.style.position = "absolute";

      // X
      if (x < minX) {
        activePiece.style.left = `${minX}px`;

      } else if (x > maxX) {
        activePiece.style.left = `${maxX}px`;

      } else {
        activePiece.style.left = `${x}px`
      }

      // Y
      if (y < minY) {
        activePiece.style.top = `${minY}px`;

      } else if (y > maxY) {
        activePiece.style.top = `${maxY}px`;

      } else {
        activePiece.style.top = `${y}px`
      }

    }
  }


  function dropPiece(e) {
    // However, be aware that if you want to access the event properties in an asynchronous way, you'll need to call event.persist()
    const chessboard = chessboardRef.current

    if(activePiece && chessboard){

      const x = Math.floor((e.clientX - chessboard.offsetLeft) / 100)
      const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100))

      console.log(x,y);

      setPieces((value) => {
        const pieces = value.map((p) => {
          if (p.x === gridX && p.y === gridY) {
            p.x = x
            p.y = y
          }

          return p
        })
        return pieces
      })

      setActivePiece(null)
    }
  }


  let board = []

  for (let j = verticalAxis.length - 1; j >= 0; j--){
    for (let i = 0; i < horizontalAxis.length; i++) {

      const number = j + i + 2
      let image = undefined

      pieces.forEach(p => {
        if(p.x === i && p.y === j){
          image = p.image
        }
      })

      board.push(<Pieces key={`${j},${i}`} number={number} image={image}/>)

    }
  }

  return (
    <div className='chessboard-container'>
      <div className='chessboard'
           onMouseDown={e => grabPiece(e)}
           onMouseMove={e => movePiece(e)}
           onMouseUp={e => dropPiece(e)}
           ref={chessboardRef}

      >{board}
      </div>
    </div>
  )


}

export default ChessBoard

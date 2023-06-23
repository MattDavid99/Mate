import React from 'react'
import './ChessBoard.css'
import Pieces from '../Pieces'

function ChessBoard() {

  const horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  const verticalAxis = ['1', '2', '3', '4', '5', '6', '7', '8']

  let board = []

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


  return (
    <div className='chessboard-container'>
      <div className='chessboard'>{board}</div>
    </div>
  )
}

export default ChessBoard

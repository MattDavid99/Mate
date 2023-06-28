import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from "react-redux"
import { createMatch } from '../../store/match'
import './ChessBoard.css'
import Pieces from '../Pieces'
import MatchRef from '../ref/ref'

// X and Y axis for chess board = [a8, b8, c8, d8, etc.]
const horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const verticalAxis = ['1', '2', '3', '4', '5', '6', '7', '8']



const initialBoardState = []


export const Type = {
  PAWN: 'PAWN',
  BISHOP: 'BISHOP',
  ROOK: 'ROOK',
  KNIGHT: 'KNIGHT',
  QUEEN: 'QUEEN',
  KING: 'KING'
}

export const Team = {
  BLACK: "BLACK",
  WHITE: "WHITE"
}

const enPassantProperty = null


 for (let p = 0; p < 2; p++){
   const teamType = (p === 0) ? Team.BLACK : Team.WHITE
   const type = (teamType === Team.BLACK) ? "black" : "white"
   const y = (teamType === Team.BLACK) ? 7 : 0
   // rooks
   initialBoardState.push({image: `../assets/images/${type}rook.png`, x:0, y, type: Type.ROOK, team: teamType})
   initialBoardState.push({image: `../assets/images/${type}rook.png`, x:7, y, type: Type.ROOK, team: teamType})
   // knights
   initialBoardState.push({image: `../assets/images/${type}knight.png`, x:1, y, type: Type.KNIGHT, team: teamType})
   initialBoardState.push({image: `../assets/images/${type}knight.png`, x:6, y, type: Type.KNIGHT, team: teamType})
   // bishops
   initialBoardState.push({image: `../assets/images/${type}bishop.png`, x:2, y, type: Type.BISHOP, team: teamType})
   initialBoardState.push({image: `../assets/images/${type}bishop.png`, x:5, y, type: Type.BISHOP, team: teamType})
   // king and queen
   initialBoardState.push({image: `../assets/images/${type}queen.png`, x:3, y, type: Type.QUEEN, team: teamType})
   initialBoardState.push({image: `../assets/images/${type}king.png`, x:4, y, type: Type.KING, team: teamType})
 }

  for (let i = 0; i < 8; i++) {
    initialBoardState.push({image: "../assets/images/blackpawn.png", x:i, y:6, type: Type.PAWN, team: Team.BLACK, enPassant: enPassantProperty})
  }

  for (let i = 0; i < 8; i++) {
    initialBoardState.push({image: "../assets/images/whitepawn.png", x:i, y:1, type: Type.PAWN, team: Team.WHITE, enPassant: enPassantProperty})
  }

  function findPiece(x, y, pieces) {
    return pieces.find(piece => piece.x === x && piece.y === y);
  }


function ChessBoard() {

  const [activePiece, setActivePiece] = useState(null)
  const [gridX, setGridX] = useState(0)
  const [gridY, setGridY] = useState(0)
  const [pieces, setPieces] = useState(initialBoardState)
  const chessboardRef = useRef(null)
  const Ref = new MatchRef()

  const dispatch = useDispatch()



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
    const chessboard = chessboardRef.current

    if(activePiece && chessboard){

      const x = Math.floor((e.clientX - chessboard.offsetLeft) / 100)
      const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100))

      const pieceAtNewSquare = findPiece(x, y, pieces); // <<-- you commented out a bunch of code below that used this, if app breaks this is the reason

      const currentPiece = pieces.find((p) => p.x == gridX && p.y == gridY)
      const attackedPiece = pieces.find((p) => p.x == x && p.y == y)



      if (currentPiece){

        const IsValidMove = Ref.validMove(gridX, gridY, x, y, currentPiece.type, currentPiece.team, pieces)

        const isEnpassant = Ref.theEnPassant(gridX, gridY, x, y, currentPiece.type, currentPiece.team, pieces)

        const direction = currentPiece.team == Team.WHITE ? 1 : -1


        if (isEnpassant) {

          const updatedPieces = pieces.reduce((arr, piece) => {

            if (piece.x == gridX && piece.y == gridY){
              piece.enPassant = false
              piece.x = x
              piece.y = y
              arr.push(piece)

            } else if (!(piece.x == x && piece.y == y - direction)) {
              if (piece.type == Type.PAWN) {
                piece.enPassant = false
              }
              arr.push(piece)
            }

            return arr
          }, [])

          setPieces(updatedPieces)

        } else if (IsValidMove) {
          const updatedPieces = pieces.reduce((arr, piece) => {
            if (piece.x == gridX && piece.y == gridY){
              if(Math.abs(gridY - y) == 2 && piece.type == Type.PAWN){
                piece.enPassant = true
              } else {
                piece.enPassant = false
              }

              piece.x = x
              piece.y = y
              arr.push(piece)

            } else if (!(piece.x == x && piece.y == y)){
              if (piece.type == Type.PAWN) {
                piece.enPassant = false
              }
              arr.push(piece)
            }


            return arr
          }, [])

          setPieces(updatedPieces)


        // setPieces((prevState) => {
        //   // const newPieces = prevState.reduce((arr, piece) => {
        //   //   if (piece.x == currentPiece.x && piece.y == currentPiece.y){
        //   //     piece.x = x
        //   //     piece.y = y
        //   //     arr.push(piece)

        //   //   } else if (!(piece.x == x && piece.y == y)){
        //   //     arr.push(piece)
        //   //   }


        //   //   return arr
        //   // }, [])
        //   return newPieces
        // })

       } else {
        activePiece.style.position = 'relative'
        activePiece.style.removeProperty('top')
        activePiece.style.removeProperty('left')
       }
       setActivePiece(null)
      }


      // setPieces((prevState) => {
      //   const newPieces = prevState.map((p) => {
      //     if (p.x === gridX && p.y === gridY) {
      //       const IsValidMove = Ref.validMove(gridX, gridY, x, y, p.type, p.team, prevState)

      //       if (IsValidMove && !pieceAtNewSquare) {
      //         p.x = x
      //         p.y = y

      //       } else {
      //         activePiece.style.position = 'relative'
      //         activePiece.style.removeProperty('top')
      //         activePiece.style.removeProperty('left')
      //       }

      //     }

      //     return p
      //   })
      //   return newPieces
      // })

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

import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux"
import { createMatch, postMove, postReset } from '../../store/match'
import './ChessBoard.css'
import Pieces from '../Pieces'
import MatchRef from '../ref/ref'
import CheckMateModal from '../CheckMateModal/CheckMateModal';
import DrawModal from '../DrawModal/DrawModal';

// X and Y axis for chess board = [a8, b8, c8, d8, etc.]
const horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const verticalAxis = ['1', '2', '3', '4', '5', '6', '7', '8']


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


const createInitialBoardState = () => {
const initialBoardState = []


   for (let p = 0; p < 2; p++){
     const teamType = (p === 0) ? Team.BLACK : Team.WHITE
     const type = (teamType === Team.BLACK) ? "black" : "white"
     const y = (teamType === Team.BLACK) ? 7 : 0
     // rooks                                                           x: 7, y
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
     initialBoardState.push({image: "../assets/images/whitepawn.png", x:i, y:1, type: Type.PAWN, team: Team.WHITE, enPassant: enPassantProperty})
   }

   for (let i = 0; i < 8; i++) {
     initialBoardState.push({image: "../assets/images/blackpawn.png", x:i, y:6, type: Type.PAWN, team: Team.BLACK, enPassant: enPassantProperty})
    }

    return initialBoardState
  }


  function findPiece(x, y, pieces) {
    return pieces.find(piece => piece.x === x && piece.y === y);
  }


function ChessBoard() {

  const [activePiece, setActivePiece] = useState(null)
  const [gridX, setGridX] = useState(0)
  const [gridY, setGridY] = useState(0)
  const [pieces, setPieces] = useState(createInitialBoardState)
  const [currentTurn, setCurrentTurn] = useState(Team.WHITE);
  const [promotionPawn, setPromotionPawn] = useState()
  const [isCheckmate, setIsCheckmate] = useState(false)
  const [isDraw, setIsDraw] = useState(false)
  const modalRef = useRef(null)
  const chessboardRef = useRef(null)
  const Ref = new MatchRef()

  const matchSelector = useSelector((state) => state.match.match)
  const currentUser = useSelector((state) => state.session.user)

  const { matchId } = useParams();
  const dispatch = useDispatch()


  // useEffect(() => {

  //   const whitePlayerId = 1; // <<-- NEED TO UNHARDCODE
  //   const blackPlayerId = 2; // <<-- NEED TO UNHARDCODE
  //   dispatch(createMatch(whitePlayerId, blackPlayerId));

  // }, []);

  useEffect(() => {
    if (matchSelector) {
      console.log("White player ID: ", matchSelector.whitePlayerId);
      console.log("Black player ID: ", matchSelector.blackPlayerId);
    }
  }, [matchSelector]);


  useEffect(() => {

   if (matchSelector && matchSelector.status == "Checkmate"){
      setIsCheckmate(true)
    } else if (matchSelector && matchSelector.status == "Draw") {
      setIsDraw(true)
   }

  }, [matchSelector]);


  const handleResetMatch = async () => {
    dispatch(postReset(matchId));
    setPieces(createInitialBoardState());
  };

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

  const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];


  async function dropPiece(e) {
    const chessboard = chessboardRef.current

    if(activePiece && chessboard){

      const x = Math.floor((e.clientX - chessboard.offsetLeft) / 100)
      const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100))


      const pieceAtNewSquare = findPiece(x, y, pieces); // <<-- you commented out a bunch of code below that used this, if app breaks this is the reason

      const currentPiece = pieces.find((p) => p.x == gridX && p.y == gridY)
      console.log(currentPiece);
      const attackedPiece = pieces.find((p) => p.x == x && p.y == y)



      if (currentPiece){

        const IsValidMove = Ref.validMove(gridX, gridY, x, y, currentPiece.type, currentPiece.team, pieces)

        const isEnpassant = Ref.theEnPassant(gridX, gridY, x, y, currentPiece.type, currentPiece.team, pieces)

        const direction = currentPiece.team == Team.WHITE ? 1 : -1

        if (currentPiece.team !== currentTurn) {
          activePiece.style.position = 'relative'
          activePiece.style.removeProperty('top')
          activePiece.style.removeProperty('left')
          setActivePiece(null)
          return;
        }


        if (isEnpassant) {

          const updatedPieces = pieces.reduce((arr, piece) => {

            if (piece.x == gridX && piece.y == gridY){
              piece.enPassant = false
              piece.x = x
              piece.y = y
              arr.push(piece)
              let uciMove = `${alphabet[gridX]}${gridY+1}${alphabet[x]}${y+1}`;
              console.log(matchId,uciMove);
              dispatch(postMove(matchId, uciMove));



            } else if (!(piece.x == x && piece.y == y - direction)) {
              if (piece.type == Type.PAWN) {
                piece.enPassant = false
              }

              arr.push(piece)

            }

            return arr
          }, [])

          setPieces(updatedPieces)
          console.log("------> updatedPieces", updatedPieces);
          setCurrentTurn(currentTurn === Team.WHITE ? Team.BLACK : Team.WHITE);

        } else if (IsValidMove) {

          let promotionRow = (currentPiece.team == Team.WHITE) ? 7 : 0;
          if (y == promotionRow && currentPiece.type == Type.PAWN) {
            modalRef.current.classList.remove("hide-modal")
            setPromotionPawn({
              piece: currentPiece,
              from: [gridX, gridY],
              to: [x, y],
            })
            console.log(promotionPawn, "<------Promotion Pawn");

          } else {
            let uciMove = `${alphabet[gridX]}${gridY+1}${alphabet[x]}${y+1}`;
            // await dispatch(postMove(matchId, uciMove));
            try {
              await dispatch(postMove(matchId, uciMove));

              const updatedPieces = pieces.reduce((arr, piece) => {
                if (piece.x == gridX && piece.y == gridY){

                  if(Math.abs(gridY - y) == 2 && piece.type == Type.PAWN){
                    piece.enPassant = true
                  } else {
                    piece.enPassant = false
                  }

                  piece.x = x
                  piece.y = y

                  let promotionRow = (piece.team == Team.WHITE) ? 7 : 0;

                  if (y == promotionRow && piece.type == Type.PAWN) {
                    modalRef.current.classList.remove("hide-modal")
                    setPromotionPawn(piece)
                    console.log(promotionPawn, "<------Promotion Pawn");
                  }

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
              console.log("------> updatedPieces", updatedPieces)
              setCurrentTurn(currentTurn == Team.WHITE ? Team.BLACK : Team.WHITE);
            } catch (err) {
              console.error(err);
              activePiece.style.position = 'relative'
              activePiece.style.removeProperty('top')
              activePiece.style.removeProperty('left')
            } finally {
              setActivePiece(null);
            }
          }


       } else {
        activePiece.style.position = 'relative'
        activePiece.style.removeProperty('top')
        activePiece.style.removeProperty('left')
       }
       setActivePiece(null)
      }

      setActivePiece(null)
    }
  }


  // This must be above promotePawn() ⬇
  function promotionWhiteOrBlack() {
    // return (promotionPawn?.team == Team.WHITE) ? "white" : "black";
    return currentTurn == Team.WHITE ? "white" : "black";
  }


  const uciPromotionCodes = {
    [Type.PAWN]: 'p',
    [Type.ROOK]: 'r',
    [Type.KNIGHT]: 'n',
    [Type.BISHOP]: 'b',
    [Type.QUEEN]: 'q',
    [Type.KING]: 'k',
  };


  async function promotePawn(promotionType) {

    if (!promotionPawn) return;

      const [fromX, fromY] = promotionPawn.from;
      const [toX, toY] = promotionPawn.to;

      const updatedPieces = pieces.reduce((arr, piece) => {
        if (piece.x == promotionPawn.piece.x && piece.y == promotionPawn.piece.y) {
          piece.type = promotionType;
          const teamType = promotionPawn.piece.team == Team.WHITE ? "white" : "black";
          piece.image = `../assets/images/${teamType}${promotionType.toLowerCase()}.png`;
          piece.x = toX;
          piece.y = toY;
        }
        arr.push(piece);
        return arr;
      }, []);


      setPieces(updatedPieces);

      modalRef.current.classList.add("hide-modal");

      const uciMove = `${alphabet[fromX]}${fromY+1}${alphabet[toX]}${toY+1}${uciPromotionCodes[promotionType]}`;
      await dispatch(postMove(matchId, uciMove));
      setCurrentTurn(currentTurn === Team.WHITE ? Team.BLACK : Team.WHITE);

      setPromotionPawn(null);

      console.log(promotionPawn, "<------Promotion Pawn");
      console.log(promotionType, uciPromotionCodes[promotionType]);
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
    <>

      {isCheckmate && <CheckMateModal winner={matchSelector.result} onClose={() => setIsCheckmate(false)} />}
      {isDraw && <DrawModal onClose={() => setIsDraw(false)} />}

      <div className='promotion-modal hide-modal' ref={modalRef}>
        <div className='modal-body'>
          <img onClick={async () => await promotePawn(Type.ROOK)} src={`../assets/images/${promotionWhiteOrBlack()}rook.png`}
          className='promotion-image'/>
          <img onClick={async () => await promotePawn(Type.KNIGHT)} src={`../assets/images/${promotionWhiteOrBlack()}knight.png`} className='promotion-image'/>
          <img onClick={async () => await promotePawn(Type.QUEEN)} src={`../assets/images/${promotionWhiteOrBlack()}queen.png`} className='promotion-image'/>
          <img onClick={async () => await promotePawn(Type.BISHOP)} src={`../assets/images/${promotionWhiteOrBlack()}bishop.png`} className='promotion-image'/>
        </div>
      </div>


        <div className='chessboard-container'>
          <div className='chessboard'
               onMouseDown={e => grabPiece(e)}
               onMouseMove={e => movePiece(e)}
               onMouseUp={e => dropPiece(e)}
               ref={chessboardRef}

          >{board}
          </div>
        <button onClick={handleResetMatch}>Reset Match</button>
        </div>
    </>
  )


}

export default ChessBoard

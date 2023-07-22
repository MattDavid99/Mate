import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux"
import { postMove, postReset, createMatch, startMatch, makeMoves, loadExistingMatch, loadMatch, fetchMatch } from '../../store/match'
import './ChessBoard.css'
import CheckMateModal from '../CheckMateModal/CheckMateModal';
import DrawModal from '../DrawModal/DrawModal';
import { socket } from '../../socket';
import Chat from '../Chat';
import Chess from "chess.js";
import Chessboard from "chessboardjsx";


function ChessBoard() {
  const [fen, setFen] = useState("start");
  const [isCheckmate, setIsCheckmate] = useState(false)
  const [isDraw, setIsDraw] = useState(false)
  const [prevPosition, setPrevPosition] = useState(null);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);

  const { matchId } = useParams();
  const matchSelector = useSelector((state) => state.match.match)
  const user = useSelector((state) => state.session.user)
  const history = useHistory()

  const dispatch = useDispatch()
  let game = new Chess();
  console.log(matchSelector);

  useEffect(() => {
    socket.emit('join', { room: matchId });
  }, [matchId]);
  /*
  matchSelector = [
           {
             blackPlayerId: 4,
             boardState: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
             chats: [],
             createdAt: '2023-07-21T00:29:00.034917',
             id: 2,
             result: null,
             status: 'In Progress',
             updatedAt: '2023-07-21T00:29:00.034924',
             whitePlayerId: 7
           }
         ]
       20:29:29.393
         [
           {
             blackPlayerId: 4,
             boardState: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
             chats: [],
             createdAt: '2023-07-21T00:29:00.034917',
             id: 2,
             result: null,
             status: 'In Progress',
             updatedAt: '2023-07-21T00:29:00.034924',
             whitePlayerId: 7
           }
         ]
    */


  console.log(user);

  const [userId, setUserId] = useState(user ? user.id : null);


 useEffect(() => {
  if (!user) {
    history.push("/login");
  }
}, [user, history]);


useEffect(() => {
  socket.on('move', (data) => {
    console.log('Move event received', data);

    // Load the game state from the server
    game.load(data.match[0].boardState);

    // Update the FEN and make moves on the UI
    setFen(game.fen());
    setIsWhiteTurn(data.turn === "white");

    if (data.result) {
      if (data.result.includes("checkmate")) {
        setIsCheckmate(true);
      } else {
        setIsDraw(true);
      }
    }
  });

  return () => {
    socket.off('move');
  };
}, [dispatch]);



  useEffect(() => {
    dispatch(fetchMatch(matchId));
  }, [dispatch, matchId]);

  useEffect(() => {
    if (matchSelector && matchSelector[0] && matchSelector[0].boardState) {
      game.load(matchSelector[0].boardState);
      setFen(matchSelector[0].boardState);
    }
  }, [matchSelector]);



  const handleMove = ({ sourceSquare, targetSquare }) => {
    let combinedMove = sourceSquare + targetSquare;
    dispatch(postMove(matchId, combinedMove));
  };



  return (
    <>
    <div className='app-container'>

    <Chat matchId={matchId}/>

      {isCheckmate && <CheckMateModal winner={matchSelector.result} onClose={() => setIsCheckmate(false)} />}
      {isDraw && <DrawModal onClose={() => setIsDraw(false)} />}


        <div className='chessboard-container'>
          <div className='chessboard'>
               <Chessboard
               id="humanVsHuman"
               width={800}
               position={fen}
               onDrop={handleMove}
             />
          </div>
        </div>
    </div>
    </>
  )

}

export default ChessBoard

import React, { useEffect, useState, useCallback } from 'react'
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
  const [matchData, setMatchData] = useState(null);
  const [whitePlayer, setWhitePlayer] = useState()
  const [blackPlayer, setBlackPlayer] = useState()

  const { matchId } = useParams();
  const matchSelector = useSelector((state) => state.match.match)
  const user = useSelector((state) => state.session.user)
  const history = useHistory()

  const dispatch = useDispatch()
  let game = new Chess();

  console.log(matchSelector);
  /*
  matchSelector =   {
    id: 58,
    whitePlayerId: 7,
    blackPlayerId: 1,
    status: 'In Progress',
    result: null,
    boardState: 'rnbqkbnr/pppp1ppp/4p3/8/8/4P3/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
    chats: [],
    createdAt: '2023-07-24T21:36:21.658334',
    updatedAt: '2023-07-24T21:41:06.086147'
  }
  */
  console.log(matchData);
  console.log(user);

  useEffect(() => {
    socket.emit('join', { room: matchId });
  }, [matchId]);

  socket.on('connect', () => {
    console.log('Connected to the server');
    // socket.emit('join', { room: matchId });
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from the server');
  });

  // useEffect(() => {
  //   dispatch(fetchMatch(matchId));
  // }, [dispatch, matchId]);

  socket.on('chess_move', (data) => {
    console.log('Move event received', data);
    setMatchData(data.match[0]);  // data.match is an array with one object, so we take the first element
  });

  useEffect(() => {
    if (matchSelector && matchSelector.boardState) {
      game.load(matchSelector.boardState);
      setFen(matchSelector.boardState);
      setWhitePlayer(matchSelector.whitePlayerId)
      setBlackPlayer(matchSelector.blackPlayerId)
    }
  }, [matchSelector]);

  useEffect(() => {
    if (!user) {
      history.push("/login");
    }
  }, [user, history]);


  useEffect(() => {
    console.log('Setting up chess_move event handler');
    const handler = (data) => {
      console.log('Move event received', data);
      setMatchData(data.match[0]);
    };
    socket.on('chess_move', handler);

    /*
      data = data:
         {
           match: [
             {
               id: 58,
               whitePlayerId: 7,
               blackPlayerId: 1,
               status: 'In Progress',
               result: null,
               boardState: 'rnbqkbnr/pppp1ppp/4p3/8/8/4P3/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
               chats: [],
               createdAt: '2023-07-24T21:36:21.658334',
               updatedAt: '2023-07-24T21:41:06.086147'
             }
           ],
           boardState: 'rnbqkbnr/pppp1ppp/4p3/8/8/4P3/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
           status: 'In Progress',
           result: null
         }
     */

    // cleanup function
    return () => {
      socket.off('chess_move', handler);
    };
  }, []);

  const handleMove = ({ sourceSquare, targetSquare }) => {

      let move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // Always promote to a queen for simplicity
      });


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


// useEffect(() => {
//   socket.on('move', (data) => {
//     console.log('Move event received', data);
//     // Load the game state from the server
//     dispatch(makeMoves(data))
//     game.load(data.match[0].boardState);
//     // Update the FEN and make moves on the UI
//     setFen(game.fen());
//     setIsWhiteTurn(data.turn === "white");
//     if (data.result) {
//       if (data.result.includes("checkmate")) {
//         setIsCheckmate(true);
//       } else {
//         setIsDraw(true);
//       }
//     }
//   });
//   return () => {
//     socket.off('move');
//   };
// }, [dispatch]);

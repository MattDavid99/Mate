import React, { useEffect, useState, useRef } from 'react'
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

const dropSound = new Audio('/assets/images/move-self.mp3');

const captureSound = new Audio('/assets/images/capture.mp3');

const castleSound = new Audio('/assets/images/castle.mp3');
const checkSound = new Audio('/assets/images/move-check.mp3');
const promoteSound = new Audio('/assets/images/promote.mp3');

function ChessBoard() {
  const [fen, setFen] = useState("start");
  const [isCheckmate, setIsCheckmate] = useState(false)
  const [isDraw, setIsDraw] = useState(false)
  const [matchData, setMatchData] = useState(null);
  const [whitePlayer, setWhitePlayer] = useState()
  const [blackPlayer, setBlackPlayer] = useState()
  const [currentTurn, setCurrentTurn] = useState('w')
  const [rematchRequested, setRematchRequested] = useState(false);
  const [opponentRematch, setOpponentRematch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chessBoardSize, setChessBoardSize] = useState(Math.min(window.innerHeight - 200, 800));


  const { matchId } = useParams();
  const matchSelector = useSelector((state) => state.match.match)
  const user = useSelector((state) => state.session.user)
  const history = useHistory()

  const dispatch = useDispatch()
  const gameRef = useRef(new Chess());

  const currentUserIsWhite = user.id === whitePlayer;
  const currentUserIsBlack = user.id === blackPlayer;

  const whitePlayerName = matchSelector ? matchSelector.whitePlayerUsername : null;
  const blackPlayerName = matchSelector ? matchSelector.blackPlayerUsername : null;

  useEffect(() => {
    if (!user) history.push("/login");
  }, [user, history]);

  useEffect(() => {
    socket.emit('join', { room: matchId });
  }, [matchId]);
  
  socket.on('connect', () => {
    console.log('Connected to the server');
  });
  socket.on('disconnect', () => {
    console.log('Disconnected from the server');
  });

  useEffect(() => {
    dispatch(loadExistingMatch(matchId));
  }, [dispatch, matchId]);

  useEffect(() => {
    if (matchSelector && matchSelector.boardState) {
      gameRef.current.load(matchSelector.boardState);
      setFen(matchSelector.boardState);
      setWhitePlayer(matchSelector.whitePlayerId)
      setBlackPlayer(matchSelector.blackPlayerId)
    }
  }, [matchSelector]);

  const handleMove = ({ sourceSquare, targetSquare }) => {
      if((currentTurn === 'w' && user.id !== whitePlayer) ||
        (currentTurn === 'b' && user.id !== blackPlayer)) {
        alert("Not your turn");
        return;
      }
      let move = {
        from: sourceSquare,
        to: targetSquare,
        promotion: "q"
      }
      let moveResult = gameRef.current.move(move);

      if (moveResult === null) return;
      if (moveResult.flags.includes('c') || moveResult.flags.includes('e')) captureSound.play();
      if (gameRef.current.in_check()) checkSound.play();
      if (moveResult.flags.includes('k') || moveResult.flags.includes('q')) castleSound.play();
      if (moveResult.flags.includes('n') || moveResult.flags.includes('b')) dropSound.play();
    
      let combinedMove = sourceSquare + targetSquare;
      if (moveResult.flags.includes("p")) {
        combinedMove += "q";
        promoteSound.play();
      }
      dispatch(postMove(matchId, combinedMove, user.id));
  };

  useEffect(() => {
    const handler = (data) => {
      console.log('Move event received', data);
      setFen(data.boardState);
      setMatchData(data.boardState);
      gameRef.current.load(data.boardState);
      setCurrentTurn(gameRef.current.turn());

      const move = gameRef.current.history({ verbose: true }).pop();

      if (move && (move.flags.includes('c') || move.flags.includes('e'))) captureSound.play();
      if (gameRef.current.in_check()) checkSound.play();
      if (move && (move.flags.includes('k') || move.flags.includes('q'))) castleSound.play();
      if (move && (move.flags.includes('n') || move.flags.includes('b'))) dropSound.play();
      if (move && (move.flags.includes("p"))) promoteSound.play();
      
      if (gameRef.current.game_over()) {
        if (gameRef.current.in_checkmate()) setIsCheckmate(true);
        if (gameRef.current.in_draw()) setIsDraw(true);
      }
    };
    
    socket.on('chess_move', handler);
    return () => {
      socket.off('chess_move', handler);
    };
}, [matchSelector]);

  useEffect(() => {
    const handleResize = () => {
      setChessBoardSize(Math.min(window.innerHeight - 200, 800));
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
    <div className='app-container'>
    <Chat matchId={matchId}/>
      {isCheckmate && <CheckMateModal winner={matchSelector.result} onClose={() => setIsCheckmate(false)} />}
      {isDraw && <DrawModal onClose={() => setIsDraw(false)} />}
        <div className='chessboard-container'>
        <h3 className={`chessboard-h3-top ${((currentTurn === 'b' && currentUserIsWhite) || (currentTurn === 'w' && currentUserIsBlack)) ? 'highlight' : ''}`}>{currentUserIsWhite ? blackPlayerName : whitePlayerName}</h3>
            <div className='chessboard'>
              <div>
                    <Chessboard
                     id="humanVsHuman"
                     width={chessBoardSize}
                     position={fen}
                     onDrop={handleMove}
                     orientation={currentUserIsWhite ? "white" : "black"}
                   />
                </div>
            </div>
            <h3 className={`chessboard-h3-bottom ${((currentTurn === 'w' && currentUserIsWhite) || (currentTurn === 'b' && currentUserIsBlack)) ? 'highlight' : ''}`}>{currentUserIsWhite ? whitePlayerName : blackPlayerName}</h3>
        </div>
    </div>
    </>
  )
}

export default ChessBoard

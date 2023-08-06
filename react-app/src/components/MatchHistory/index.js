import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserMatches, fetchMoves } from '../../store/history';
import { useParams } from 'react-router-dom';
import Chessboard from "chessboardjsx";
import Chess from "chess.js";
import "./MatchHistory.css"

function MatchHistory() {
    const dispatch = useDispatch();
    const userMatches = useSelector(state => state.history.userMatches);
    const user = useSelector(state => state.session.user)
    const matchMoves = useSelector(state => state.history.matchMoves);
    const { userId } = useParams()

    const [expandedMatchId, setExpandedMatchId] = useState(null);
    const [currentBoardState, setCurrentBoardState] = useState(null);
    const [chessMoves, setChessMoves] = useState([]);
    const [moveIndex, setMoveIndex] = useState(0);
    const [viewingChessboard, setViewingChessboard] = useState(false);
    const [loadingMoves, setLoadingMoves] = useState(false);


    const chess = new Chess();

    useEffect(() => {
       dispatch(fetchUserMatches(userId));
    }, [dispatch])

    useEffect(() => {
      console.log(user);
      console.log(matchMoves);
      console.log(userMatches);

    }, [user, userMatches])


  const handleMatchClick = async (matchId, boardState) => {
    setExpandedMatchId(matchId);
    setCurrentBoardState(boardState);

    setLoadingMoves(true);

    await dispatch(fetchMoves(matchId));

    setLoadingMoves(false);

    setViewingChessboard(true)
  };

  useEffect(() => {
    if (!loadingMoves && matchMoves && matchMoves.length > 0) {
      setChessMoves(matchMoves);
      setCurrentBoardState(matchMoves[0].boardState);
      setMoveIndex(0);
    }
  }, [matchMoves, loadingMoves]);

  const handleNextClick = () => {
    if (moveIndex < chessMoves.length - 1) {
      let newMoveIndex = moveIndex + 1;
      setMoveIndex(newMoveIndex);
      setCurrentBoardState(chessMoves[newMoveIndex].boardState);
    }
  };

  const handlePrevClick = () => {
    if (moveIndex > 0) {
      let newMoveIndex = moveIndex - 1;
      setMoveIndex(newMoveIndex);
      setCurrentBoardState(chessMoves[newMoveIndex].boardState);
    }
  };
    const handleGoBackClick = () => {
      setViewingChessboard(false);
  };

    return (
      <div className='history-wrapper'>
      <div className='history-container'>
        <h2 className='history-h2'>Match History</h2>
        {!viewingChessboard ? (
          <div className='history-button-container'>
            <div className='history-column'>
              <h3 className='history-h3-white'>As White</h3>
              <div className='history-scroll-container'>
                 {userMatches && userMatches
                   .filter(match => match.whitePlayerId === user.id)
                   .map(match => (
                     <button className="history-match-button" key={match.id} onClick={() => handleMatchClick(match.id, match.boardState)}>
                       <div>{match.whitePlayerUsername} vs. {match.blackPlayerUsername}</div>
                       <div className='history-match-date'>{new Date(match.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(match.createdAt).toLocaleDateString()}</div>
                     </button>
                   ))}
              </div>
            </div>
            <div className='history-column'>
              <h3 className='history-h3-black'>As Black</h3>
              <div className='history-scroll-container'>
                  {userMatches && userMatches
                    .filter(match => match.blackPlayerId === user.id)
                    .map(match => (
                      <button className="history-match-button" key={match.id} onClick={() => handleMatchClick(match.id, match.boardState)}>
                        <div>{match.whitePlayerUsername} vs. {match.blackPlayerUsername}</div>
                        <div className='history-match-date'>{new Date(match.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(match.createdAt).toLocaleDateString()}</div>
                      </button>
                    ))}
                </div>
            </div>
          </div>
        ) : (
            <>
              <div className='history-chessboard-container'>
                  <Chessboard position={currentBoardState} className="custom-chessboard"/>
              </div>
              <div className='history-button-container'>
                  <button className='history-button' onClick={handleGoBackClick}><i class="fas fa-undo"></i></button>
                  <button className='history-button' onClick={handlePrevClick}><i class="fas fa-angle-double-left"></i></button>
                  <button className='history-button' onClick={handleNextClick}><i class="fas fa-angle-double-right"></i></button>
              </div>
            </>
          )}
      </div>
  </div>
 )
}

export default MatchHistory

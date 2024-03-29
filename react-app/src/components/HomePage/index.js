import React, { useEffect, useState } from 'react'
import "./HomePage.css"
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { createMatch } from '../../store/match'
import { socket } from '../../socket';

function HomePage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [startClicked, setStartClicked] = useState(false);
  const [waitingMessage, setWaitingMessage] = useState('...waiting');

  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    if (!user) {
      history.push("/login");
    }
  }, [user, history]);

  const startNewMatch = () => {
    setStartClicked(true);
    socket.emit('new_match', { player_id: user.id });
  }

  const playBot = () => {
    return window.alert("Feature coming soon!")
  }

  const matchHistory = () => {
    if (user){
      history.push(`/${user.id}/history`)
    }
  }

  useEffect(() => {
    const handleNewMatch = (data) => {
        const matchId = data.match[0].id;
        const whitePlayerId = data.players.white;
        const blackPlayerId = data.players.black;

        const playerColor = user.id === whitePlayerId ? "white" : "black";

        history.push(`/match/${matchId}`);
    };
    socket.on('new_match', handleNewMatch);
    return () => {
        socket.off('new_match', handleNewMatch);
    }
  }, []);

  useEffect(() => {
    if (startClicked) {
      let dots = '...';
      const intervalId = setInterval(() => {
        dots = dots.length === 1 ? '...' : dots.slice(1);
        setWaitingMessage(dots + 'waiting');
      }, 500);
      return () => clearInterval(intervalId);
    }
  }, [startClicked]);

  return (
    <div className='homepage-container'>
          <div className='chess-pieces-wrapper'>
            <div className='chess-piece piece1'></div>
            <div className='chess-piece piece2'></div>
            <div className='chess-piece piece3'></div>
            <div className='chess-piece piece4'></div>
            <div className='chess-piece piece5'></div>
            <div className='chess-piece piece6'></div>
            <div className='chess-piece piece7'></div>
          </div>
      <div className='homepage-startmatch'>
      <div className='homepage-logo'><img className="logo-img" src='../assets/images/crownblack2.png'/></div>
        {!startClicked &&
        <div className='homepage-span-container'>
          <span className='homepage-span'>Join Queue</span>
          <span className='homepage-span'>Play a bot</span>
          <span className='homepage-span'>Match History</span>
        </div>
        }
        {startClicked ? (
          <div className='homepage-grader'>
            <p className='homepage-p'><strong>{waitingMessage}</strong></p>
          </div>
        ) : (
          <div className='homepage-button-container'>
            <button onClick={startNewMatch} className='homepage-button'>Find Match</button>
            <button onClick={playBot} className='homepage-button'>Find Match</button>
            <button onClick={matchHistory} className='homepage-button'>View History</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;

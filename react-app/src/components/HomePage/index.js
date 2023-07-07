import React, { useEffect, useState } from 'react'
import "./HomePage.css"
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { createMatch } from '../../store/match'
import { socket } from '../../socket';

function HomePage() {
  const dispatch = useDispatch();
  const history = useHistory();

  const user = useSelector((state) => state.session.user);

  const startNewMatch = () => {
    socket.emit('new_match', { player_id: user.id });
  }

  useEffect(() => {
    socket.on('new_match', (data) => {
      const matchId = data.match[0].id;
      history.push(`/match/${matchId}`)
    })

    return () => {
      socket.off('new_match');
    }
  }, [])


  return (
    <div className='homepage-container'>
      <div className='homepage-startmatch'>
        <button onClick={startNewMatch}>Start Match</button>
      </div>
    </div>
  );
}

export default HomePage;

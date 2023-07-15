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

  const user = useSelector((state) => state.session.user);


  useEffect(() => {
    if (!user) {
      history.push("/login");
    }
  }, [user, history]);


  const startNewMatch = () => {
    console.log("Emitting new match event", user.id);
    setStartClicked(true)
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
        {!startClicked && <span>Join Queue</span>}
        {startClicked ? (
          <div className='homepage-grader'>
            <p className='homepage-p'>...waiting</p>
            <p>For grading purposes: Open up a new icognito window, Log in, then click "Find Match"</p>
          </div>
        ) : (
          <button onClick={startNewMatch} className='homepage-button'>Find Match</button>
        )}
      </div>
    </div>
  );
}

export default HomePage;

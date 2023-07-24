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


//   const startNewMatch = () => {
//     console.log("Emitting new match event", user.id);
//     setStartClicked(true);
//     socket.emit('new_match', { player_id: user.id });

//     // Define the 'new_match' event listener here
//     socket.on('new_match', (data) => {
//       console.log(data);
//       const matchId = data.match[0].id;
//       const whitePlayerId = data.players.white;
//       const blackPlayerId = data.players.black;

//       // Determine the player color based on the user ID
//       const playerColor = user.id === whitePlayerId ? "white" : "black";

//       history.push({
//           pathname: `/match/${matchId}`,
//           state: { playerColor: playerColor }
//       });
//   });
// }

// useEffect(() => {
//     return () => {
//         // Remove the 'new_match' event listener when the component unmounts
//         socket.off('new_match');
//     }
// }, []);

// ----------------------------------------------

const startNewMatch = () => {
  console.log("Emitting new match event", user.id);
  setStartClicked(true);
  socket.emit('new_match', { player_id: user.id });
}

useEffect(() => {
  const handleNewMatch = (data) => {
      console.log(data);
      const matchId = data.match[0].id;
      const whitePlayerId = data.players.white;
      const blackPlayerId = data.players.black;

      // Determine the player color based on the user ID
      const playerColor = user.id === whitePlayerId ? "white" : "black";

      history.push(`/match/${matchId}`);
  };

  socket.on('new_match', handleNewMatch);

  return () => {
      // Remove the 'new_match' event listener when the component unmounts
      socket.off('new_match', handleNewMatch);
  }
}, []);
// ----------------------------------------------


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

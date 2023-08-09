import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import { postDeclineChallenge, getChallenges, fetchChallenges, acceptTheChallenge } from '../../store/match';
import { socket } from '../../socket';
import "./Challenges.css"

function Challenges() {

  const sessionUser = useSelector(state => state.session.user);
  const user = useSelector((state) => state.session.user);
  const theChallenges = useSelector((state) => state.match.challenges)
  const dispatch = useDispatch()
  const history = useHistory()
  const [refresh, setRefresh] = useState(false);
  const [challenges, setChallenges] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState(theChallenges);

  useEffect(() => {
    if (!user) {
      history.push("/login");
    }
  }, [user, history]);

  useEffect(() => {
    if (sessionUser) {
      dispatch(fetchChallenges())
    }
  }, [dispatch, sessionUser]);

  useEffect(() => {
    setFilteredChallenges(theChallenges);
  }, [theChallenges]);

  useEffect(() => {
    console.log(theChallenges);
    /*
    theChallenges = [
    {
      challenger: {
        email: 'brit@aa.io',
        firstName: 'Brit',
        id: 7,
        lastName: 'lewis',
        profilePicUrl: null,
        username: 'brit'
      },
      createdAt: 'Tue, 08 Aug 2023 20:57:06 GMT',
      id: 1,
      receiver: {
        email: 'demo@aa.io',
        firstName: 'demo',
        id: 1,
        lastName: 'lition',
        profilePicUrl: null,
        username: 'Demo'
      },
      status: 'Sent',
      updatedAt: 'Tue, 08 Aug 2023 20:57:06 GMT'
    }
  ]

    */

  }, [theChallenges])


  const handleDeclineChallenge = (challengeId) => {
    dispatch(postDeclineChallenge(challengeId));
    setFilteredChallenges(filteredChallenges.filter(ch => ch.id !== challengeId));
  };

  const handleAcceptChallenge = (challenge) => {
    console.log(challenge);
    socket.emit('new_match', { player_id: user.id });

    dispatch(acceptTheChallenge(challenge.id));
  };



  useEffect(() => {
    const handleNewMatch = (data) => {
      console.log(data);
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
  }, [user]);

  return (
    <div className='challenges-wrapper'>
      <div className='challenges-container'>
        <h2 className='challenges-h2'>Challenges</h2>
        {filteredChallenges && filteredChallenges.length > 0 ? (
          <div className='challenges-div'>
          <ul className='challenges-ul'>
            {filteredChallenges.map((challenge, index) => (
              <li key={index} className='challenges-li'>
                <strong style={{fontSize: "18px"}}>{challenge.challenger ? challenge.challenger.firstName + " has challenged you!" : 'Unknown challenger'}</strong>
                <button onClick={() => handleAcceptChallenge(challenge)} className='challenges-button'>Accept</button>
                <button onClick={() => handleDeclineChallenge(challenge.id)} className='challenges-button'>Clear</button>
              </li>
            ))}
          </ul>
          </div>
        ) : (
          <p className='challenges-p'>No challenges yet.</p>
        )}
      </div>
    </div>
  );
}

export default Challenges;

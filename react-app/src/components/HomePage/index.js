import React, {useEffect} from 'react'
import "./HomePage.css"
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { joinLobby, checkMatchStatus, createMatch } from '../../store/match';

function HomePage() {
  const dispatch = useDispatch();
  const history = useHistory();

  const people = useSelector((state) => state.match.match)
  console.log(people);

  const startMatch = async () => {
    await dispatch(joinLobby());

    const intervalId = setInterval(async () => {
      await dispatch(checkMatchStatus());
    }, 5000);
  };

  useEffect(() => {
    if (people) {
      dispatch(createMatch(people.whitePlayerId, people.blackPlayerId));
      history.push(`/match/${people.id}`);
    }
  }, [people]);

  return (
    <div className='homepage-container'>
      <div className='homepage-startmatch'>
        <button onClick={startMatch}>Start Match</button>
      </div>
    </div>
  );
}

export default HomePage;

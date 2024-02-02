import React, { useState, useEffect } from 'react'
import { fetchUserById } from '../../store/session';
import { deleteFriend, getAllFriends, getFriendRequests, postDeclineFriendRequest, postAcceptFriendRequest } from '../../store/friendrequest';
import { postChallenge } from '../../store/match';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import { socket } from '../../socket';
import "./AddedFriends.css"

function AddedFriends() {

  const sessionUser = useSelector(state => state.session.user);
  const allFriends = useSelector(state => state.friendrequest.friends)
  const user = useSelector((state) => state.session.user);
  const [challengedFriends, setChallengedFriends] = useState(new Set());
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    if (!sessionUser) {
      history.push("/login");
    }
  }, [sessionUser, history]);


  useEffect(() => {
    if (sessionUser){
      dispatch(fetchUserById(sessionUser.id));
    }
  }, [dispatch]);

  useEffect(() => {
     dispatch(getAllFriends());
  }, [dispatch]);

  useEffect(() => {
     console.log(allFriends);
  }, [allFriends])


  useEffect(() => {
     console.log(sessionUser);
  }, [dispatch,sessionUser]);

  const handleRemoveFriend = (friend_id) => {
    dispatch(deleteFriend(friend_id));
  }

  const handleSendChallenge = (friendId) => {
    dispatch(postChallenge(friendId));
    setChallengedFriends(prevState => new Set([...prevState, friendId]));
    socket.emit('new_match', { player_id: user.id });
  };

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

return (
     <div className='added-friends-wrapper'>
     <div className='added-friends-container'>
       <h2 className='added-friends-h2'>Added Friends</h2>
       {sessionUser && allFriends.length > 0 ? (
         <div className='added-friends-div'>
           <ul className='added-friends-ul'>
              {allFriends.map((friend, index) => (
                <li key={index} className='added-friends-li'>
                  {challengedFriends.has(friend.id) ? (
                    <span>Challenge sent!</span>
                  ) : (
                    <>
                      {friend.firstName}
                      <button onClick={() => handleSendChallenge(friend.id)} className='added-friends-button'>Challenge</button>
                    </>
                  )}
                  <button onClick={() => handleRemoveFriend(friend.id)} className='added-friends-button'>Remove</button>
                </li>
              ))}
           </ul>
         </div>
       ) : (
         <p className='added-friends-p'>No added friends yet.</p>
       )}
     </div>
   </div>
);
}

export default AddedFriends

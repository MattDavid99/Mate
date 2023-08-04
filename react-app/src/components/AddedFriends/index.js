import React, { useState, useEffect } from 'react'
import { fetchUserById } from '../../store/session';
import { deleteFriend, getAllFriends, getFriendRequests, postDeclineFriendRequest, postAcceptFriendRequest } from '../../store/friendrequest';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import "./AddedFriends.css"

function AddedFriends() {

  const sessionUser = useSelector(state => state.session.user);
  const allFriends = useSelector(state => state.friendrequest.friends)
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

return (
  <div className='added-friends-wrapper'>
  <div className='added-friends-container'>
    <h2 className='added-friends-h2'>Added Friends</h2>
    {sessionUser && allFriends.length > 0 ? (
      <ul className='added-friends-ul'>
        {allFriends.map((friend, index) => (
          <li key={index} className='added-friends-li'>
            {friend.firstName}
            <button onClick={() => handleRemoveFriend(friend.id)} className='added-friends-button'>remove</button>
          </li>
        ))}
      </ul>
    ) : (
      <p className='added-friends-p'>No added friends yet.</p>
    )}
  </div>
  </div>
)
}

export default AddedFriends

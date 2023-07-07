import React, { useState, useEffect } from 'react'
import { fetchUserById } from '../../store/session';
import { deleteFriend, getAllFriends } from '../../store/friendrequest';
import { useDispatch, useSelector } from "react-redux";
import "./AddedFriends.css"

function AddedFriends() {

  const sessionUser = useSelector(state => state.session.user);
  const allFriends = useSelector(state => state.friendrequest.friends)
  const dispatch = useDispatch()

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
    /*
    allFriends = [
        {
          email: 'bobbie@aa.io',
          firstName: 'Bobbie',
          id: 3,
          lastName: 'davis',
          profilePicUrl: null,
          username: 'bobbie'
        }
      ]

    */
}, [dispatch]);



	useEffect(() => {
    console.log(sessionUser);
		/*
		sessionUser =  {
    addedBy: [ 2 ],
    addedFriends: [ 3 ],
    email: 'marnie@aa.io',
    firstName: 'Marnie',
    id: 2,
    lastName: 'david',
    profilePicUrl: null,
    username: 'marnie'
  }
		*/
}, [dispatch,sessionUser]);

const handleRemoveFriend = (friend_id) => {
  dispatch(deleteFriend(friend_id));
}

return (
  <div className='added-friends-container'>
    <h2 className='added-friends-h2'>Added Friends</h2>
    {sessionUser && allFriends.length > 0 ? (
      <ul className='added-friends-ul'>
        {allFriends.map((friend, index) => (
          <li key={index} className='added-friends-li'>
            {friend.firstName}
            <button onClick={() => handleRemoveFriend(friend.id)}>Remove Friend</button>
          </li>
        ))}
      </ul>
    ) : (
      <p className='added-friends-p'>No added friends yet.</p>
    )}
  </div>
)
}

export default AddedFriends

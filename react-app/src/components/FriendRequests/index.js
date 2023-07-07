import React, { useState, useEffect } from 'react'
import { fetchUserById } from '../../store/session';
import { deleteFriend, getAllFriends, getFriendRequests, postDeclineFriendRequest, postAcceptFriendRequest, addFriend } from '../../store/friendrequest';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';

function FriendRequests() {

  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch()
  const allFriendRequests = useSelector(state => state.friendrequest.friendRequests)
  const history = useHistory()
  const [refresh, setRefresh] = useState(false);




  useEffect(() => {
    if (sessionUser){
      dispatch(fetchUserById(sessionUser.id));
    }
}, [dispatch]);



  useEffect(() => {
    dispatch(getFriendRequests())
    setRefresh(false);
  }, [dispatch, refresh])



	useEffect(() => {
    console.log(sessionUser);

}, [dispatch,sessionUser]);

  useEffect(() => {
    console.log(allFriendRequests);
  }, [allFriendRequests])



  const handleAcceptFriendRequest = async (requestId) => {
    await dispatch(postAcceptFriendRequest(requestId));
    await dispatch(getAllFriends());
    setRefresh(true);
  }

  const handleDeclineFriendRequest = async (requestId) => {
    await dispatch(postDeclineFriendRequest(requestId));
    await dispatch(getAllFriends());
    setRefresh(true);
  }



  return (

      <div className='added-friends-container'>
       <h2 className='added-friends-h2'>Friend Requests</h2>
       {sessionUser && allFriendRequests && allFriendRequests.length > 0 ? (
         <ul className='added-friends-ul'>
           {allFriendRequests.map((request, index) => (
            <li key={index} className='added-friends-li'>
              {request.sender && request.sender.firstName ? `${request.sender.firstName} wants to be your friend!` :
              'Someone wants to be your friend!'}
              <button onClick={() => handleAcceptFriendRequest(request.id)}>Accept</button>
              <button onClick={() => handleDeclineFriendRequest(request.id)}>Decline</button>
            </li>
            ))}
         </ul>
       ) : (
         <p className='added-friends-p'>No friend requests yet.</p>
       )}
    </div>
)
}

export default FriendRequests

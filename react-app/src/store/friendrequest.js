const ACCEPT_FRIEND_REQUEST = "friend-request/ACCEPT_FRIEND_REQUEST";
const SEND_FRIEND_REQUEST = "friend-request/SEND_FRIEND_REQUEST";
const REMOVE_FRIEND = "friend-request/REMOVE_FRIEND"
const GET_ALL_FRIENDS = "friend-request/GET_ALL_FRIENDS"
const ADD_FRIEND = "friend-request/ADD_FRIEND";
const GET_FRIEND_REQUESTS = "friend-request/GET_FRIEND_REQUESTS";
const DECLINE_FRIEND_REQUEST = "friend-request/DECLINE_FRIEND_REQUEST";

const getFriendRequestsAction = (friendRequests) => {
  return {
    type: GET_FRIEND_REQUESTS,
    payload: friendRequests,
  }
};

const declineFriendRequestAction = (requestId) => {
  return {
    type: DECLINE_FRIEND_REQUEST,
    payload: requestId
  }
};

const addFriendAction = (friendId) => {
  return {
    type: ADD_FRIEND,
    payload: friendId,
  }
};

const sendFriendRequestAction = (friendRequest) => {
  return {
    type: SEND_FRIEND_REQUEST,
    payload: friendRequest,
  }
};

const acceptFriendRequest = (friendRequest) => {
  return {
    type: ACCEPT_FRIEND_REQUEST,
    payload: friendRequest,
  }
};

const removeFriend = (friendId) => {
  return {
    type: REMOVE_FRIEND,
    payload: friendId
  }
}

const getFriends = (friends) => {
  return {
    type: GET_ALL_FRIENDS,
    payload: friends
  }
}

export const addFriend = (friend_id) => async (dispatch) => {
  const response = await fetch(`/api/friend-request/${friend_id}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (response.ok) {
    dispatch(addFriendAction(friend_id));
  } else {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  }
};

export const sendFriendRequest = (receiver_id) => async (dispatch) => {
  const response = await fetch(`/api/friend-request/${receiver_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (response.ok) {
    const data = await response.json();
    dispatch(sendFriendRequestAction({ receiver_id }));
  } else {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  }
};

export const postAcceptFriendRequest = (request_id) => async (dispatch) => {
  try {
    const response = await fetch(`/api/friend-request/${request_id}/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (response.ok) {
      const data = await response.json()
      console.log(data);
      dispatch(acceptFriendRequest(data))

    } else {
      const data = await response.json()

      if (data.errors) {
        return data.errors
      }
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }

};

export const deleteFriend = (friend_id) => async (dispatch) => {
  const response = await fetch(`/api/friend-request/${friend_id}/remove`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (response.ok) {
    dispatch(removeFriend(friend_id))
  } else {
    const data = await response.json()
    if (data.errors) {
      return data.errors
    }
  }
}

export const getAllFriends = () => async (dispatch) => {
  const response = await fetch(`/api/friend-request/friends`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (response.ok) {
    const data = await response.json()
    dispatch(getFriends(data.friends))
  } else {
    const data = await response.json()

    if (data.errors) {
      return data.errors
    }
  }
}

export const getFriendRequests = () => async (dispatch) => {
  const response = await fetch(`/api/friend-request/requests`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (response.ok) {
    const data = await response.json()
    dispatch(getFriendRequestsAction(data.friend_requests))
  } else {
    const data = await response.json()
    if (data.errors) {
      return data.errors
    }
  }
};

export const postDeclineFriendRequest = (request_id) => async (dispatch) => {
  const response = await fetch(`/api/friend-request/${request_id}/decline`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (response.ok) {
    dispatch(declineFriendRequestAction(request_id))

  } else {
    const data = await response.json()

    if (data.errors) {
      return data.errors
    }
  }
};

const initialState = { friendRequests: [], friends: [] };
export default function friendRequestReducer(state = initialState, action) {
	switch (action.type) {

    case GET_FRIEND_REQUESTS:
      return {
       ...state,
       friendRequests: action.payload
     }

    case DECLINE_FRIEND_REQUEST:
     return {
       ...state,
       friendRequests: state.friendRequests.filter((i) => i.id !== action.payload)
     }

     case ACCEPT_FRIEND_REQUEST:
      return {
        ...state,
        friendRequests: state.friendRequests.filter((i) => i.id !== action.payload.id),
        friends: [...state.friends, ...action.payload]
      }

    case SEND_FRIEND_REQUEST:
      return {
        ...state,
        friendRequests: [...state.friendRequests, action.payload]
      }

    case REMOVE_FRIEND:
      return {
        ...state,
        friends: state.friends.filter((i) => i.id !== action.payload)
      }

    case GET_ALL_FRIENDS:
      return {
        ...state,
        friends: action.payload
      }

    case ADD_FRIEND:
      return {
        ...state,
        friendRequests: state.friendRequests.filter((i) => i.id !== action.payload.id),
        friends: [...state.friends, action.payload]
      }

		default:
			return state;
	}
}

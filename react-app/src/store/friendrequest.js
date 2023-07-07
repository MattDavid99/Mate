// constants
const ACCEPT_FRIEND_REQUEST = "friend-request/ACCEPT_FRIEND_REQUEST";
const SEND_FRIEND_REQUEST = "friend-request/SEND_FRIEND_REQUEST";
const REMOVE_FRIEND = "friend-request/REMOVE_FRIEND"
const GET_ALL_FRIENDS = "friend-requesr/GET_ALL_FRIENDS"
const ADD_FRIEND = "friend-request/ADD_FRIEND";


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


// @friendrequest_routes.route('/<int:request_id>/accept', methods=['POST'])
export const postAcceptFriendRequest = (request_id) => async (dispatch) => {
  const response = await fetch(`/api/friend-request/${request_id}/accept`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (response.ok) {
    const data = await response.json()
    dispatch(acceptFriendRequest(data.friend_requests[0]))

  } else {
    const data = await response.json()

    if (data.errors) {
      return data.errors
    }
  }

};


// @friendrequest_routes.route('/<int:friend_id>/remove', methods=['DELETE'])
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


// @friendrequest_routes.route('/friends', methods=['GET'])
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


const initialState = { friendRequests: [], friends: [] };

export default function friendRequestReducer(state = initialState, action) {
	switch (action.type) {

    case ACCEPT_FRIEND_REQUEST:
      return {
        ...state,
        friendRequests: [...state.friendRequests, action.payload]
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
        friends: [...state.friends, action.payload]
      }

		default:
			return state;
	}
}

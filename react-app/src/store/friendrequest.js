// constants
const ACCEPT_FRIEND_REQUEST = "friend-request/ACCEPT_FRIEND_REQUEST";
const REMOVE_FRIEND = "friend-request/REMOVE_FRIEND"
const GET_ALL_FRIENDS = "friend-requesr/GET_ALL_FRIENDS"


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

		default:
			return state;
	}
}

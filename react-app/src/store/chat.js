// constants
const SEND_MESSAGE = "chat/SEND_MESSAGE";
const GET_CHATS = "chat/GET_CHATS"


const sendMessage = (message) => {
  return {
    type: SEND_MESSAGE,
    payload: message,
  }
};

const getChat = (chats) => {
  return {
    type: GET_CHATS,
    payload: chats
  }
}


// @chat_routes.route('/<int:match_id>', methods=['POST'])
export const postMessage = (match_id, message) => async (dispatch) => {
  const response = await fetch(`/api/chat/${match_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: message
    })
  })

  if (response.ok) {
    const data = await response.json();
    dispatch(sendMessage(data.chat[0]))

  } else {
    const data = await response.json();

    if (data.errors) {
      return data.errors
    }
  }
};

// @chat_routes.route('/<int:match_id>', methods=['GET'])
export const fetchChats = (match_id) => async (dispatch) => {
  const response = await fetch(`/api/chat/${match_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (response.ok) {
    const data = await response.json()
    dispatch(getChat(data.chats))

  } else {
    const data = await response.json()

    if (data.errors) {
      return data.errors
    }
  }
}




const initialState = { chat: [] };

export default function chatReducer(state = initialState, action) {
	switch (action.type) {

    case SEND_MESSAGE:
      return {
        ...state,
        chat: [...state.chat, action.payload]
      }

    case GET_CHATS:
      return {
        ...state,
        chat: action.payload
      }

		default:
			return state;
	}
}

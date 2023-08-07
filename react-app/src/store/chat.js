import { socket } from "../socket";
// constants
const SEND_MESSAGE = "chat/SEND_MESSAGE";
const GET_CHATS = "chat/GET_CHATS"
const EDIT_MESSAGE = "chat/EDIT_MESSAGE";
const DELETE_MESSAGE = "chat/DELETE_MESSAGE";


export const sendMessage = (message) => {
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

export const editMessage = (message) => {
  return {
    type: EDIT_MESSAGE,
    payload: message,
  }
};

export const deleteMessage = (messageId) => {
  return {
    type: DELETE_MESSAGE,
    payload: messageId,
  }
};


// @chat_routes.route('/<int:match_id>', methods=['POST'])
export const postChatMessage = (match_id, user_id, message) => async (dispatch) => {
  socket.emit('send_message', {match_id, user_id, message})
};

export const receiveChatMessage = (match_id, user_id, message) => async (dispatch) => {
  socket.emit('receive_message', {match_id, user_id, message})
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
    console.log(data);
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

    case EDIT_MESSAGE:
      return {
        ...state,
        chat: state.chat.map(chatMessage => chatMessage.id === action.payload.id ? action.payload : chatMessage)
      }

    case DELETE_MESSAGE:
      return {
        ...state,
        chat: state.chat.filter(chatMessage => chatMessage.id !== action.payload)
      }

		default:
			return state;
	}
}

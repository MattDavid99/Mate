import { socket } from "../socket";
// constants
const CREATE_MATCH = "match/CREATE_MATCH";
const MAKE_MOVES = "match/MAKE_MOVES";
const RESIGN_MATCH = "match/RESIGN_MATCH";
const GET_MATCH = "match/GET_MATCH";
const RESET_MATCH = "match/RESET_MATCH";
const LOAD_MATCH = "match/LOAD_MATCH";



export const loadMatch = (match) => {
  return {
    type: LOAD_MATCH,
    payload: match
  }
};

export const startMatch = (match) => {
  return {
    type: CREATE_MATCH,
    payload: match,
  }
};

export const makeMoves = (match) => {
  return {
    type: MAKE_MOVES,
    payload: match
  }
}

const resignMatch = (match) => {
  return {
    type: RESIGN_MATCH,
    payload: match
  }
}

const getMatch = (match) => {
  return {
    type: GET_MATCH,
    payload: match
  }
}

const resetMatch = (match) => {
  return {
    type: RESET_MATCH,
    payload: match,
  }
};



export const loadExistingMatch = (match_id) => () => {
  socket.emit('load_match', {match_id});
}

// @match_routes.route('/', methods=['POST'])
export const createMatch = (white_player_id, black_player_id) => () => {
  socket.emit('new_match', {white_player_id, black_player_id})
}


// @match_routes.route('/<int:match_id>/move', methods=['POST'])
export const postMove = (match_id, uci_move) => () => {
  socket.emit('move', {match_id, move: uci_move})
}


// @match_routes.route('/<int:match_id>/resign', methods=['POST'])
export const postResign = (match_id) => async (dispatch) => {
  const response = await fetch(`/api/match/${match_id}/resign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (response.ok) {
    const data = await response.json()
    dispatch(resignMatch(data.match))
  }
}


// @match_routes.route('/<int:match_id>', methods=['GET'])
export const fetchMatch = (match_id) => async (dispatch) => {
  const response = await fetch(`/api/match/${match_id}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (response.ok) {
    const data = await response.json()
    dispatch(getMatch(data.match))

  } else {
    const data = await response.json()

    if (data.errors) {
      return data.errors
    }
  }
}

// @match_routes.route('/<int:match_id>/reset', methods=['POST'])
export const postReset = (match_id) => async (dispatch) => {
  const response = await fetch(`/api/match/${match_id}/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (response.ok) {
    const data = await response.json()
    dispatch(resetMatch(data.match))
  }
}


const initialState = { match: null };

export default function matchReducer(state = initialState, action) {
	switch (action.type) {

    case CREATE_MATCH:
      return {
        ...state,
        match: action.payload
      }

    case MAKE_MOVES:
      return {
        ...state,
        match: action.payload
      }

    case RESIGN_MATCH:
      return {
        ...state,
        match: action.payload
      }

    case GET_MATCH:
      return {
        ...state,
        match: action.payload
      }

    case RESET_MATCH:
      return {
        ...state,
        match: action.payload
      }

    case LOAD_MATCH:
      return {
        ...state,
        match: action.payload
      }


		default:
			return state;
	}
}

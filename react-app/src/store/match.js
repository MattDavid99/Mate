// constants
const CREATE_MATCH = "match/CREATE_MATCH";
const MAKE_MOVES = "match/MAKE_MOVES";
const RESIGN_MATCH = "match/RESIGN_MATCH";


const startMatch = (match) => {
  return {
    type: CREATE_MATCH,
    payload: match,
  }
};

const makeMoves = (match) => {
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



// @match_routes.route('/', methods=['POST'])
export const createMatch = (white_player_id, black_player_id) => async (dispatch) => {
  const response = await fetch('/api/match/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      white_player_id,
      black_player_id
    })
  })

  if (response.ok) {
    const data = await response.json()
    dispatch(startMatch(data.match[0])) // <<-- might just be data.match

  } else if (response.status < 500) {
    const data = await response.json()

    if (data.errors) {
      return data.errors
    }

  }
};


// @match_routes.route('/<int:match_id>/move', methods=['POST'])
export const postMove = (match_id, uci_move) => async (dispatch) => {
  const response = await fetch(`/api/match/${match_id}/move`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      move: uci_move
    })
  })

  if (response.ok) {
    const data = await response.json()
    dispatch(makeMoves(data.match[0]))

  } else if (response.status < 500) {
    const data = await response.json()

    if (data.errors) {
      return data.errors
    }
  }
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
    dispatch(resignMatch(data.match[0]))
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

		default:
			return state;
	}
}

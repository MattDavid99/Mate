// constants
const CREATE_MATCH = "match/CREATE_MATCH";
const MAKE_MOVES = "match/MAKE_MOVES";
const RESIGN_MATCH = "match/RESIGN_MATCH";
const GET_MATCH = "match/GET_MATCH";
const RESET_MATCH = "match/RESET_MATCH";
const JOIN_LOBBY = 'match/JOIN_LOBBY';
const SET_MATCH_STATUS = "match/SET_MATCH_STATUS";
const WAITING_FOR_OPPONENT = "match/WAITING_FOR_OPPONENT";
const WAITING_FOR_MATCH = "match/WAITING_FOR_MATCH";


const waitingForOpponentAction = (message) => ({
  type: WAITING_FOR_OPPONENT,
  payload: message,
});

const waitingForMatchAction = (message) => ({
  type: WAITING_FOR_MATCH,
  payload: message,
});



const joinLobbyAction = (data) => ({
  type: JOIN_LOBBY,
  payload: data
});


const setMatchStatus = (match) => ({
  type: SET_MATCH_STATUS,
  payload: match,
});


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
    dispatch(startMatch(data.match)) // <<-- might just be data.match

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
    dispatch(makeMoves(data.match))

  } else if (!response.ok) {
    const data = await response.json()

    if (data.errors) {
      console.log(data.errors);
      return data.errors
    }
    throw new Error(`HTTP error! status: ${response.status}`);
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

// @match_routes.route('/lobby', methods=['POST'])
export const joinLobby = () => async (dispatch) => {
  const response = await fetch('/api/match/lobby', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (response.ok) {
    if (data.success) {
      dispatch(joinLobbyAction(data));
    } else if (data.message) {
      dispatch(waitingForOpponentAction(data.message));
    }
  } else if (data.errors) {
    console.log(data.errors);
    return data.errors;
  }
};

// @match_routes.route('/status', methods=['GET'])
export const checkMatchStatus = () => async (dispatch) => {
  try {
    const response = await fetch('/api/match/status', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      if (data.match) {
        dispatch(setMatchStatus(data.match));
      } else if (data.message) {
        dispatch(waitingForMatchAction(data.message));
      }
    } else if (data.errors) {
      console.log(data.errors);
    }
  } catch (error) {
    console.log(error);
  }
};



const initialState = { match: null, statusMessage: null };

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

    case JOIN_LOBBY: {
      if (action.payload.match) {
        return { ...state, match: action.payload.match[0] };
      } else {
        return { ...state, match: null };
      }
    }

    case SET_MATCH_STATUS:
      return {
        ...state,
        match: action.payload
      };

    case WAITING_FOR_OPPONENT:
      return {
        ...state,
        statusMessage: action.payload,
      }

    case WAITING_FOR_MATCH:
      return {
        ...state,
        statusMessage: action.payload,
      }


		default:
			return state;
	}
}

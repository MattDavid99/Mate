import { socket } from "../socket";

const CREATE_MATCH = "match/CREATE_MATCH";
const MAKE_MOVES = "match/MAKE_MOVES";
const RESIGN_MATCH = "match/RESIGN_MATCH";
const GET_MATCH = "match/GET_MATCH";
const RESET_MATCH = "match/RESET_MATCH";
const LOAD_MATCH = "match/LOAD_MATCH";
const GET_CHALLENGES = "match/GET_CHALLENGES";
const SEND_CHALLENGE = "match/SEND_CHALLENGE";
const DECLINE_CHALLENGE = "match/DECLINE_CHALLENGE";
const ACCEPT_CHALLENGE = 'challenges/ACCEPT_CHALLENGE';


export const getChallenges = (challenges) => {
  return {
    type: GET_CHALLENGES,
    payload: challenges
  }
};

export const acceptTheChallenge = (challengeId) => ({
  type: ACCEPT_CHALLENGE,
  challengeId
});


export const sendChallenge = (message) => {
  return {
    type: SEND_CHALLENGE,
    payload: message
  }
};

export const declineChallenge = (message) => {
  return {
    type: DECLINE_CHALLENGE,
    payload: message
  }
};


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

const getMatch = (match) => {
  return {
    type: GET_MATCH,
    payload: match
  }
}

const resignMatch = (match) => {
  return {
    type: RESIGN_MATCH,
    payload: match
  }
}


const resetMatch = (match) => {
  return {
    type: RESET_MATCH,
    payload: match,
  }
};


export const acceptChallenge = (challenge_id) => (dispatch) => {
  socket.emit('accept_challenge', { challenge_id });

  socket.on('new_match', (data) => {
    dispatch(startMatch(data));
  });

  socket.on('error', (data) => {
    console.error(data.error);
  });
};


export const fetchChallenges = () => async (dispatch) => {
  const response = await fetch('/api/match/challenges', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(getChallenges(data.challenges));
    return data;
  }
}

export const postChallenge = (receiver_id) => async (dispatch) => {
  const response = await fetch(`/api/match/challenge/${receiver_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(sendChallenge(data.message));
  }
}

export const postDeclineChallenge = (challenge_id) => async (dispatch) => {
  const response = await fetch(`/api/match/${challenge_id}/decline`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(declineChallenge(data.message));
  }
}


export const loadExistingMatch = (match_id) => (dispatch) => {
  socket.emit('load_match', { match_id });

  socket.on('load_match', (data) => {
    dispatch(loadMatch(data.match[0]));
  });

  socket.on('error', (data) => {
    console.error(data.error);
  });
}

// @match_routes.route('/', methods=['POST'])
export const createMatch = (white_player_id, black_player_id) => (dispatch) => {
  socket.emit('new_match', { white_player_id, black_player_id })

  socket.on('new_match', (data) => {
    dispatch(startMatch(data));
  });

  socket.on('error', (data) => {
    console.error(data.error);
  });
}

export const postMove = (match_id, uci_move, player_id) => (dispatch) => {
  socket.emit('chess_move', { room: match_id, move: uci_move, player_id: player_id });

  socket.on('chess_move', (data) => {
    dispatch(makeMoves(data.match[0]));
  });

  socket.on('error', (data) => {
    console.error(data.error);
  });
};

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
    const data = await response.json();
    if (data.match && data.match.length > 0) {
      dispatch(getMatch(data.match[0]));
    } else {
      return "data.match[0] is NOT HERE, match.js redux"
    }
  } else {
    const data = await response.json();

    if (data.errors) {
      return data.errors;
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


const initialState = { match: null, challenges: [], message: null };

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

    case GET_CHALLENGES:
      return {
        ...state,
        challenges: action.payload
      }

    case ACCEPT_CHALLENGE:
      return {
        ...state,
        challenges: state.challenges.filter(ch => ch.id !== action.challengeId)
      };

    case SEND_CHALLENGE:
    case DECLINE_CHALLENGE:
      return {
        ...state,
        message: action.payload
      }

    default:
      return state;
  }
}

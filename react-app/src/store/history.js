const GET_MATCH_HISTORY = "history/GET_MATCH_HISTORY";
const GET_USER_MATCHES = "history/GET_USER_MATCHES";
const GET_MOVES = 'GET_MOVES';

const getHistory = (matchHistory) => {
  return {
    type: GET_MATCH_HISTORY,
    payload: matchHistory,
  }
};

const getUserMatches = (userMatches) => {
  return {
    type: GET_USER_MATCHES,
    payload: userMatches,
  }
};

const getMoves = (moves) => {
  return {
    type: GET_MOVES,
    payload: moves,
  }
};

export const getMatchHistory = (match_id) => async (dispatch) => {
  const response = await fetch(`/api/history/${match_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (response.ok) {
    const data = await response.json()
    dispatch(getHistory(data.history))
  } else {
    const data = await response.json()
    if (data.errors) {
      return data.errors
    }
  }
};

export const fetchUserMatches = (user_id) => async (dispatch) => {
  const response = await fetch(`/api/history/${user_id}/matches`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (response.ok) {
    const data = await response.json()
    dispatch(getUserMatches(data.matches))

  } else {
    const data = await response.json()

    if (data.errors) {
      return data.errors
    }
  }
};

export const fetchMoves = (match_id) => async (dispatch) => {
  const response = await fetch(`/api/match/${match_id}/moves`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (response.ok) {
    const data = await response.json()
    dispatch(getMoves(data))

  } else {
    const data = await response.json()

    if (data.errors) {
      return data.errors
    }
  }
};


const initialState = { matchHistory: [], userMatches: [], matchMoves: [] };

export default function historyReducer(state = initialState, action) {
  switch (action.type) {

    case GET_MATCH_HISTORY:
      return {
        ...state,
        matchHistory: action.payload
      }

    case GET_USER_MATCHES:
      return {
        ...state,
        userMatches: action.payload
      }

    case GET_MOVES:
      return {
        ...state,
        matchMoves: action.payload
      }

    default:
      return state;
  }
}

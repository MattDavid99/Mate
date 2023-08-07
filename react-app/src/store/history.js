// constants
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

// @history_routes.route('/<int:match_id>')
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
    /*
    data =   Array(7) [
    {
      boardState: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
      createdAt: '2023-08-01T16:52:00.179551',
      id: 1,
      matchId: 2,
      turn: 'b',
      uciMove: 'e2e4'
    }, {
      boardState: 'rnbqkbnr/ppppppp1/7p/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
      createdAt: '2023-08-01T16:52:02.632204',
      id: 2,
      matchId: 2,
      turn: 'w',
      uciMove: 'h7h6'
    },
    {
      boardState: 'rnbqkbnr/ppppppp1/7p/7Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2',
      createdAt: '2023-08-01T16:52:06.034164',
      id: 3,
      matchId: 2,
      turn: 'b',
      uciMove: 'd1h5'
    },
    {
      boardState: 'rnbqkbnr/1pppppp1/p6p/7Q/4P3/8/PPPP1PPP/RNB1KBNR w KQkq - 0 3',
      createdAt: '2023-08-01T16:52:09.317573',
      id: 4,
      matchId: 2,
      turn: 'w',
      uciMove: 'a7a6'
    },
    */
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

// constants
const GET_MATCH_HISTORY = "history/GET_MATCH_HISTORY";

const getHistory = (matchHistory) => {
  return {
    type: GET_MATCH_HISTORY,
    payload: matchHistory,
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


const initialState = { matchHistory: [] };

export default function historyReducer(state = initialState, action) {
	switch (action.type) {

    case GET_MATCH_HISTORY:
      return {
        ...state,
        matchHistory: action.payload
      }

		default:
			return state;
	}
}

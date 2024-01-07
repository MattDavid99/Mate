// constants
const ALL_USERS = "user/ALL_USERS";
const USER_BY_ID = "user/USER_BY_ID";

const allUsers = (users) => ({
	type: ALL_USERS,
	payload: users,
});

const userById = (user) => ({
	type: USER_BY_ID,
	payload: user
})



export const getAllUsers = () => async (dispatch) => {
	const response = await fetch("/api/users/", {
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (response.ok) {
		const data = await response.json();
		console.log('Data from API: ', data);
		if (data.errors) {
			console.log(data.errors);
		}

		dispatch(allUsers(data.users));
	}
};

export const getUserById = (user_id) => async (dispatch) => {
	const response = await fetch(`/api/users/${user_id}`, {
		headers: {
			"Content-Type": "application/json",
		}
	});

	if (response.ok) {
		const data = await response.json();
		console.log(data);
		dispatch(userById(data))
	} else if (response.status < 500) {
		const data = await response.json();
		if (data.errors) {
			return data.errors;
		}
	} else {
		return ["An error occurred. Please try again."];
	}
};

const initialState = { users: [], selectedUser: null };

export default function userReducer(state = initialState, action) {
	console.log('Action received in reducer: ', action);
	switch (action.type) {
		case ALL_USERS:
			return {
				...state,
				users: [...action.payload]
			};

		case USER_BY_ID:
			return {
				...state,
				selectedUser: action.payload
			}
		default:
			return state;
	}
}

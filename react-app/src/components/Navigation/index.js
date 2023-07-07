import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from 'react-router-dom';
import ProfileButton from './ProfileButton';
import { getAllUsers, getUserById } from '../../store/user';
import { deleteFriend, getAllFriends, postAcceptFriendRequest, addFriend, sendFriendRequest } from '../../store/friendrequest';
import './Navigation.css';

function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);
	const allUsers = useSelector((state) => sessionUser ? state.user.users.filter(user => user.id !== sessionUser.id) : [])
	const dispatch = useDispatch()
	const history = useHistory()

	// ------------------ Search
	const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);


	useEffect(() => {
    dispatch(getAllUsers());
}, [dispatch]);

	useEffect(() => {
    console.log(allUsers);
		/*
		allUsers =  Array(9) [
    {
      addedBy: [],
      addedFriends: [ 'marnie', 'bobbie' ],
      email: 'demo@aa.io',
      firstName: 'demo',
      id: 1,
      lastName: 'lition',
      profilePicUrl: null,
      username: 'Demo'
    }, {
      addedBy: [ 'marnie' ],
      addedFriends: [ 'bobbie' ],
      email: 'marnie@aa.io',
      firstName: 'Marnie',
      id: 2,
      lastName: 'david',
      profilePicUrl: null,
      username: 'marnie'
    },
		*/
}, [allUsers]);

const handleSearch = (e) => {
	e.preventDefault();

	setSearchText(e.target.value);

	if (e.target.value === '') {
		setSearchResults([])
		return
	}

	const results = allUsers.filter((i) =>
		i.username.toLowerCase().includes(e.target.value.toLowerCase())
	);

	setSearchResults(results);
};

	const handleAddFriend = async (userId) => {
	  await dispatch(sendFriendRequest(userId));
	  history.push("/added-friends");
	}

	useEffect(() => {
		if (sessionUser) {
			dispatch(getAllFriends(sessionUser.id));
		}
	}, [dispatch, sessionUser]);


	return (
		<>
      <ul className="navBar">
        <div className="logoSearch">
          <li>
            <NavLink exact to="/">Home</NavLink>
          </li>
          {isLoaded && (
            <li className="searchArea">
              <form className="searchForm">
                <input
                  type="text"
                  name="search"
                  placeholder="Search..."
                  className="searchInput"
                  value={searchText}
                  onChange={handleSearch}
                />
                {searchResults.length > 0 && (
        						<ul className="search-results">
        						  {searchResults.map((i) => (
        						    <li className="search-li" key={i.id}>
        						      <NavLink
        						        to={`/user/${i.id}`}
        						        onClick={() => {
        						          setSearchResults([]);
        						          setSearchText("");
        						        }}
        						      >
        						        <p className="search-title">{i.username}</p>
        						      </NavLink>
        						      {!sessionUser?.addedFriends?.includes(i.id) && (
        						        <button type="button" onClick={() => handleAddFriend(i.id)}>Send Request</button>
        						      )}
        						    </li>
        						  ))}
        						</ul>
      						)}
                <button type="submit" onClick={e => e.preventDefault()} className="search-button">
								  Search
								</button>
              </form>
            </li>
          )}
        </div>
        {isLoaded && (
          <li>
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </ul>
    </>
	);
}

export default Navigation;

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
	const [isNavBarVisible, setIsNavBarVisible] = useState(true);
	const [sentRequests, setSentRequests] = useState([]);
	const [refresh, setRefresh] = useState(false);
	// const [isLoading, setIsLoading] = useState(true);


	useEffect(() => {
    dispatch(getAllUsers());
		setRefresh(false)
}, [dispatch, refresh]);

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

	setRefresh(true)
	setSearchResults(results);
};

	const handleSearchSubmit = (e) => {
		e.preventDefault();
	};

	const handleAddFriend = async (userId) => {
	  await dispatch(sendFriendRequest(userId));
		setSentRequests(prev => [...prev, userId]);
	}

	useEffect(() => {
		if (sessionUser) {
			dispatch(getAllFriends(sessionUser.id));
		}
	}, [dispatch, sessionUser]);


	return (
		<>


		{isNavBarVisible ? (
			<ul className="navBar">
				<div className='navBar-contents'>
        <div className="logoSearch">
				<button onClick={() => setIsNavBarVisible(!isNavBarVisible)} className='toggle-nav-button'>{isNavBarVisible ? "X" : "<"}</button>
          <li className='nav-home'>
            <NavLink exact to="/" className="nav-link">Home</NavLink>
          </li>
          {isLoaded && (
            <li className="searchArea">
              <form className="searchForm" onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  name="search"
                  placeholder="Search for Friends..."
                  className="searchInput"
                  value={searchText}
                  onChange={handleSearch}
                />
                {searchResults.length > 0 && (
        						<ul className="search-results">
        						  {searchResults.map((i) => (
												     <li className="search-li" key={i.id}>
														 <div className="search-item-container">
															 <strong
																 onClick={() => {
																	 setSearchResults([]);
																	 setSearchText("");
																 }}
															 >
																 <p className="search-title">{i.username}</p>
															 </strong>
															 <div>
																 {!sessionUser?.addedFriends?.includes(i.id) && !sentRequests.includes(i.id) && (
																	 <button type="button" onClick={() => handleAddFriend(i.id)} className='request-button'>Send Request</button>
																 )}
																 {sentRequests.includes(i.id) && (
																	 <p className='request-p'>Sent</p>
																 )}
															 </div>
														 </div>
													 </li>
        						  ))}
        						</ul>
      						)}
              </form>
            </li>
          )}
        </div>
        {isLoaded && (
          <li className='profile-drop'>
            <ProfileButton user={sessionUser} />
          </li>
        )}
				</div>
      </ul>
		) : (
			<button onClick={() => setIsNavBarVisible(true)} className="open-nav-button">Menu</button>
		)}
		</>
	);
}

export default Navigation;

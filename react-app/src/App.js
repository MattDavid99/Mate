import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import ChessBoard from "./components/ChessBoard";
import AddedFriends from "./components/AddedFriends";
import HomePage from "./components/HomePage";
import FriendRequests from "./components/FriendRequests";
import MatchHistory from "./components/MatchHistory";
import Challenges from "./components/Challenges";
import About from "./components/About";

function App() {
  const dispatch = useDispatch();
  const history = useHistory()
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  const handleLogoClick = () => {
    history.push('/');
  }

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <div className='navBar-logo'><img className="the-logo" src='../assets/images/crownblack2.png' onClick={handleLogoClick}/></div>
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/login" >
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route path="/match/:matchId">
            <ChessBoard />
          </Route>
          <Route path="/friend-requests">
            <FriendRequests />
          </Route>
          <Route path="/added-friends">
            <AddedFriends />
          </Route>
          <Route path="/:userId/history">
            <MatchHistory />
          </Route>
          <Route path="/challenges">
            <Challenges />
          </Route>
          <Route path="/about">
            <About />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;

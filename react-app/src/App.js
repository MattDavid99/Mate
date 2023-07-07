import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import ChessBoard from "./components/ChessBoard";
import AddedFriends from "./components/AddedFriends";
import HomePage from "./components/HomePage";
import FriendRequests from "./components/FriendRequests";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
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
        </Switch>
      )}
    </>
  );
}

export default App;

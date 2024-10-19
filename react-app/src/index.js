import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { ModalProvider, Modal } from "./context/Modal";
import configureStore from "./store";
import * as sessionActions from "./store/session";
import * as matchActions from "./store/match"
import * as chatActions from "./store/chat"
import * as friendRequestActions from "./store/friendrequest"
import * as historyActions from "./store/history"
import * as userActions from "./store/user"
import App from "./App";

import "./index.css";

const store = configureStore();

if (process.env.NODE_ENV !== "production") {
	window.store = store;
	window.sessionActions = sessionActions;
	window.matchActions = matchActions;
	window.chatActions = chatActions;
	window.friendRequestActions = friendRequestActions;
	window.historyActions = historyActions;
	window.userActions = userActions;
}
function Root() {
	return (
		<ModalProvider>
			<Provider store={store}>
				<BrowserRouter>
					<App />
					<Modal />
				</BrowserRouter>
			</Provider>
		</ModalProvider>
	);
}

ReactDOM.render(
	<React.StrictMode>
		<Root />
	</React.StrictMode>,
	document.getElementById("root")
);

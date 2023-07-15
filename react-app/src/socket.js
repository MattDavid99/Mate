import {io} from "socket.io-client";

// const SERVER_URL = "http://127.0.0.1:5000";

export const socket = io();

socket.on('connect', () => {
  console.log('Connected to the server');
});
socket.on('connect_error', (error) => {
  console.log('Connection Failed', error);
});

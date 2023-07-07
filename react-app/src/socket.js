import {io} from "socket.io-client";

export const socket = io("http://127.0.0.1:5000");

socket.on('connect', () => {
  console.log('Connected to the server');
});
socket.on('connect_error', (error) => {
  console.log('Connection Failed', error);
});

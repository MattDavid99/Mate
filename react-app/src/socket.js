import {io} from "socket.io-client";


export const socket = io();

socket.on('connect', () => {
  console.log('Connected to the server');
});
socket.on('connect_error', (error) => {
  console.log('Connection Failed', error);
});

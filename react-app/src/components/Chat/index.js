import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { postChatMessage, sendMessage, fetchChats, receiveChatMessage, deleteMessage, editMessage } from "../../store/chat";
import { socket } from '../../socket';
import "./Chat.css"

function Chat({ matchId }) {
  const [message, setMessage] = useState('');
  const [editMessageId, setEditMessageId] = useState(null);
  const [editMessageText, setEditMessageText] = useState('');
  const history = useHistory()
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const chat = useSelector((state) => state.chat.chat);

  console.log("--------> Message",message);
  console.log("--------> User",user);
  console.log("--------> Chat",chat);
  /*
  chat =  '--------> Chat',
  [
    {
      createdAt: 'Thu, 06 Jul 2023 17:53:06 GMT',
      id: 3,
      matchId: 4,
      message: 'Hello',
      updatedAt: 'Thu, 06 Jul 2023 17:53:06 GMT',
      userId: 4
    }, {
      createdAt: 'Thu, 06 Jul 2023 17:53:07 GMT',
      id: 4,
      matchId: 4,
      message: 'Hello',
      updatedAt: 'Thu, 06 Jul 2023 17:53:07 GMT',
      userId: 4
    },

  ]

  */

  useEffect(() => {
    if (!user) {
      history.push("/login");
    }
  }, [user, history]);

  // ChessBoard.js
  socket.on('connect', () => {
    console.log('Successfully connected to the server!');
  });


  useEffect(() => {
    socket.on('new_message', (data) => {
      console.log(data);
      const messageData = Array.isArray(data) ? data[0] : data;
      dispatch(sendMessage(messageData));
      dispatch(fetchChats(matchId));
    });

    return () => {
      socket.off('new_message');
    }
  }, [dispatch, matchId]);

// ----------------------------------------------(Editing and deleting chats)
  useEffect(() => {
    socket.on('message_edited', (data) => {
      dispatch(editMessage(data));
    });

    socket.on('message_deleted', (data) => {
      dispatch(deleteMessage(data.message_id));
    });

    return () => {
      socket.off('message_edited');
      socket.off('message_deleted');
    }
  }, [dispatch]);
// -------------------------------------------------------------

  const handleEditMessage = (messageId) => {
    socket.emit('edit_message', {
      message_id: messageId,
      new_message: editMessageText
    });
    setEditMessageId(null);
    setEditMessageText('');
  };

  const handleDeleteMessage = (messageId) => {
    socket.emit('delete_message', {
      message_id: messageId
    });
  };

  const handleEditButtonClick = (messageId, currentMessageText) => {
    setEditMessageId(messageId);
    setEditMessageText(currentMessageText);
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('send_message', {
      match_id: parseInt(matchId),
      user_id: user?.id,
      message: message
    });
    setMessage('');

  };


  return (
   <div className='chat-container'>
    <div className='chat-box'>
    <ul className='chat-messages'>
      {chat.map((message, index) => (
        <li key={index} className='chat-message'>
          <strong className='chat-username'>{message.username}:</strong>
          {editMessageId === message.id ? (
            <input
              value={editMessageText}
              onChange={(e) => setEditMessageText(e.target.value)}
            />
          ) : (
            message.message
          )}
          {message.userId === user?.id && (
            <>
              <button onClick={() => handleEditButtonClick(message.id, message.message)} className='chat-button'>Edit</button>
              {editMessageId === message.id && (
                <button onClick={() => handleEditMessage(message.id)} className='chat-button'>Save</button>
              )}
              <button onClick={() => handleDeleteMessage(message.id)} className='chat-button'>Delete</button>
            </>
          )}
        </li>
      ))}
    </ul>
    </div>
    <form onSubmit={handleSubmit} className='chat-form'>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className='chat-input'
      />
      <button type="submit" className='chat-button'>Send</button>
    </form>
  </div>
  );
}

export default Chat;

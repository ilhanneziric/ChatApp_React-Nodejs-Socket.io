import React from 'react'
import { useState, useEffect } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

const Chat = ({socket, name, room}) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async() => {
      if(currentMessage !== ''){
          const messageData = {
              room: room,
              author: name, 
              message: currentMessage,
              time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes() 
          };
          socket.emit('send_message', messageData);
          setMessageList((list) => [...list, messageData]);
          setCurrentMessage('');
      }
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
        setMessageList((list) => [...list, data]);
    })
  }, [socket]);
  return (
    <div className='chat-window'>
        <div className='chat-header'>
            <p>Live chat</p>
        </div>
        <div className='chat-body'>
            <ScrollToBottom className='message-container'>
            {
                messageList.map((messageContent, index) => (
                    <div className='message' id={name === messageContent.author ? 'you' : 'other'} key={index}>
                        <div>
                            <div className='message-content'>
                                <p>{messageContent.message}</p>
                            </div>
                            <div className='message-meta'>
                                <p id='time'>{messageContent.time}</p>
                                <p id='author'>{messageContent.author}</p>
                            </div>
                        </div>
                    </div>
                ))
            }
            </ScrollToBottom>
        </div>
        <div className='chat-footer'>
            <input 
                type='text' 
                placeholder='Hi' 
                value={currentMessage} 
                onChange={(event) => {setCurrentMessage(event.target.value)}}
                onKeyPress={(event) => {event.key === 'Enter' && sendMessage();}}
            />
            <button onClick={sendMessage}>&#9658;</button>
        </div>
    </div>
  )
}

export default Chat
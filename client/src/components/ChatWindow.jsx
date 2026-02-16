import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import api from '../utils/api';

const ChatWindow = ({ currentUser, otherUser, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const socket = useRef();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Connect to Socket.io
        socket.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

        // Join my own room
        socket.current.emit('join', currentUser._id);

        // Fetch history
        const fetchHistory = async () => {
            try {
                const res = await api.get(`/chat/history/${otherUser._id}`);
                setMessages(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchHistory();

        // Listen for incoming messages
        socket.current.on('receiveMessage', (message) => {
            if (message.sender === otherUser._id || message.sender === currentUser._id) {
                setMessages((prev) => [...prev, message]);
            }
        });

        return () => {
            socket.current.disconnect();
        };
    }, [currentUser, otherUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = () => {
        if (!newMessage.trim()) return;

        const messageData = {
            sender: currentUser._id,
            senderModel: currentUser.role === 'shg' ? 'SHGProvider' : 'User',
            receiver: otherUser._id,
            receiverModel: otherUser.role === 'shg' ? 'SHGProvider' : 'User',
            content: newMessage
        };

        // Emit to server
        socket.current.emit('sendMessage', messageData);

        // Optimistic UI update (optional, but socket callback is fast usually)
        // For now, let's rely on the socket 'receiveMessage' or just append manually if needed.
        // Actually, our backend doesn't broadcast back to sender in the 'receiveMessage' event to 'sender' room
        // unless we join both.
        // Let's just append it locally as well for immediate feedback.
        setMessages((prev) => [...prev, { ...messageData, timestamp: new Date() }]);

        setNewMessage('');
    };

    return (
        <div className="chat-window-overlay" style={{
            position: 'fixed', bottom: '20px', right: '20px', width: '300px',
            backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)', zIndex: 1001, display: 'flex', flexDirection: 'column'
        }}>
            <div style={{
                padding: '10px', backgroundColor: '#333', color: 'white',
                borderTopLeftRadius: '8px', borderTopRightRadius: '8px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <span>Chat with {otherUser.name}</span>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>X</button>
            </div>

            <div style={{ height: '300px', overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{
                        maxWidth: '80%', padding: '8px', margin: '5px', borderRadius: '8px',
                        alignSelf: msg.sender === currentUser._id ? 'flex-end' : 'flex-start',
                        backgroundColor: msg.sender === currentUser._id ? '#007bff' : '#f1f1f1',
                        color: msg.sender === currentUser._id ? 'white' : 'black'
                    }}>
                        {msg.content}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '10px', display: 'flex' }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    style={{ flex: 1, padding: '5px', marginRight: '5px' }}
                />
                <button onClick={handleSend} style={{ padding: '5px 10px' }}>Send</button>
            </div>
        </div>
    );
};

export default ChatWindow;

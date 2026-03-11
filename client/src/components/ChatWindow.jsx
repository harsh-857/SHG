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
        const socketUrl = import.meta.env.VITE_SOCKET_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://shg-6s8l.onrender.com');
        socket.current = io(socketUrl);

        // Join my own room
        socket.current.emit('join', currentUser._id);

        // Fetch history and mark as read
        const fetchHistoryAndMarkRead = async () => {
            try {
                // Mark messages from otherUser to currentUser as read
                await api.put(`/chat/mark-read/${otherUser._id}`);

                // Fetch history
                const res = await api.get(`/chat/history/${otherUser._id}`);
                setMessages(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchHistoryAndMarkRead();

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
            position: 'fixed',
            bottom: window.innerWidth <= 768 ? '0' : '20px',
            right: window.innerWidth <= 768 ? '0' : '20px',
            width: window.innerWidth <= 768 ? '100%' : '450px',
            height: window.innerWidth <= 768 ? '100%' : '600px',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: window.innerWidth <= 768 ? 'none' : '1px solid rgba(255, 255, 255, 0.5)',
            borderRadius: window.innerWidth <= 768 ? '0' : '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
            overflow: 'hidden'
        }}>
            <div style={{
                padding: '15px 20px',
                backgroundColor: 'rgba(51, 51, 51, 0.95)',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '10px', height: '10px', backgroundColor: '#2ecc71', borderRadius: '50%' }}></div>
                    <span style={{ fontWeight: '600' }}>Chat with {otherUser.name}</span>
                </div>
                <button onClick={onClose} style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s'
                }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 1L1 13M1 1L13 13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '25px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                backgroundColor: 'rgba(248, 249, 250, 0.3)'
            }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{
                        maxWidth: '85%',
                        padding: '12px 16px',
                        margin: '5px 0',
                        borderRadius: '14px',
                        fontSize: '1rem',
                        lineHeight: '1.4',
                        alignSelf: msg.sender === currentUser._id ? 'flex-end' : 'flex-start',
                        backgroundColor: msg.sender === currentUser._id ? 'var(--gov-blue)' : '#ffffff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        color: msg.sender === currentUser._id ? 'white' : '#333',
                        border: msg.sender === currentUser._id ? 'none' : '1px solid #eee'
                    }}>
                        {msg.content}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '20px 25px', display: 'flex', gap: '15px', backgroundColor: 'white', borderTop: '1px solid #f0f0f0' }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    style={{
                        flex: 1,
                        padding: '15px 20px',
                        borderRadius: '30px',
                        border: '1.5px solid #eee',
                        outline: 'none',
                        fontSize: '1rem',
                        backgroundColor: '#f8f9fa'
                    }}
                />
                <button onClick={handleSend} className="btn" style={{
                    padding: '12px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: '#333',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    flexShrink: 0
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;

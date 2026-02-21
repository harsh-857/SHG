const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const http = require('http');
const socketIo = require('socket.io');
const Message = require('./models/Message');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
const clientUrl = (process.env.CLIENT_URL || process.env.CLIENT_URL_ || "https://shg-six.vercel.app").replace(/\/$/, "");

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl) 
        // or any origin from vercel.app or localhost
        if (!origin || origin.includes('vercel.app') || origin.includes('localhost')) {
            callback(null, true);
        } else {
            console.log('CORS Blocked for origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

const io = socketIo(server, {
    cors: {
        ...corsOptions,
        methods: ["GET", "POST"]
    }
});
app.use(express.json());

// Database Connection
connectDB();

// Socket.io Logic
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User/SHG joined room: ${userId}`);
    });

    socket.on('sendMessage', async (data) => {
        const { sender, senderModel, receiver, receiverModel, content } = data;

        // Save to DB
        try {
            const newMessage = new Message({ sender, senderModel, receiver, receiverModel, content });
            await newMessage.save();

            // Emit to receiver's room
            io.to(receiver).emit('receiveMessage', newMessage);
            // Also emit back to sender (or just update UI optimistically)
            // io.to(sender).emit('receiveMessage', newMessage); 
        } catch (err) {
            console.error(err);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/services', require('./routes/services'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/appointments', require('./routes/appointments'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

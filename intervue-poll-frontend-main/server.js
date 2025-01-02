const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173/", // Replace with your frontend URL in production
    methods: ["GET", "POST"],
  },
});

// In-memory data storage
let polls = []; // Stores all polls
let currentPoll = null; // The active poll
let pollResults = {}; // Stores answers per poll
let students = {}; // Track connected students by their socket ID

// Socket.IO Event Handling
io.on('connection', (socket) => {
  console.log(`Student connected: ${socket.id}`);

  // Store connected student
  socket.on('registerStudent', (username) => {
    students[socket.id] = username;
    console.log(`Student registered: ${username}`);
  });

  // Broadcast a new poll to all students
  socket.on('createPoll', ({ question, options, timer }) => {
    const pollId = Date.now();
    currentPoll = { id: pollId, question, options, timer, isActive: true };
    polls.push(currentPoll);
    pollResults[pollId] = {};

    io.emit('pollCreated', { ...currentPoll, _id: pollId });
    console.log('Poll created:', question);
  });

  // Handle answer submission by students
  socket.on('submitAnswer', ({ username, option, pollId }) => {
    if (!pollResults[pollId]) return;

    // Record the student's answer
    pollResults[pollId][username] = option;

    // Calculate live results
    const resultSummary = currentPoll.options.reduce((acc, option) => {
      acc[option.text] = Object.values(pollResults[pollId]).filter(
        (answer) => answer === option.text
      ).length;
      return acc;
    }, {});

    io.emit('pollResults', resultSummary);
    console.log('Answer submitted:', username, option);
  });

  // Handle teacher kicking out a student
  socket.on('kickStudent', (username) => {
    const studentSocketId = Object.keys(students).find(
      (id) => students[id] === username
    );
    if (studentSocketId) {
      io.to(studentSocketId).emit('kickedOut');
      delete students[studentSocketId];
      console.log(`Student kicked out: ${username}`);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const disconnectedStudent = students[socket.id];
    delete students[socket.id];
    console.log(`Student disconnected: ${disconnectedStudent || socket.id}`);
  });
});

// REST API Endpoints
app.post('/teacher-login', (req, res) => {
  res.json({ username: 'teacher123' });
});

app.get('/active-poll', (req, res) => {
  if (currentPoll && currentPoll.isActive) {
    return res.json(currentPoll);
  }
  res.status(404).json({ message: 'No active poll' });
});

app.get('/poll-results/:pollId', (req, res) => {
  const pollId = req.params.pollId;
  if (pollResults[pollId]) {
    return res.json(pollResults[pollId]);
  }
  res.status(404).json({ message: 'Poll results not found' });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

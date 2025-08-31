const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static(__dirname));
app.use('/uploads', express.static('uploads'));

// File upload setup
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Upload endpoint
app.post('/upload', upload.single('photo'), (req, res) => {
  res.json({ url: `/uploads/${req.file.filename}` });
});

// WebSocket for chat
io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    socket.join(userId);
  });

  socket.on('privateMessage', ({ sender, recipient, content, type }) => {
    io.to(recipient).emit('message', { sender, content, type });
    io.to(sender).emit('message', { sender, content, type });
  });

  socket.on('joinGroup', (groupId) => {
    socket.join(groupId);
  });

  socket.on('groupMessage', ({ groupId, sender, content, type }) => {
    io.to(groupId).emit('groupMessage', { sender, content, type });
  });

  socket.on('banUser', ({ groupId, userId, adminId }) => {
    io.to(groupId).emit('userBanned', { userId });
  });
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));

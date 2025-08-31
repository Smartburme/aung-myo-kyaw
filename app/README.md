Backend Setup (Minimal Node.js Server)To support real-time chat and photo uploads, we need a backend. This will use Node.js with Express and Socket.IO. Save this as server.js.javascript


```
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

```

Install dependencies:bash


```
npm init -y
npm install express socket.io multer
mkdir uploads
```


Run the server:bash



node server.js



This backend serves the frontend, handles photo uploads, and supports real-time chat via WebSocket.3. Frontend Implementation3.1 HTML (index.html)The HTML structure includes sections for friend finding, chat, group chat, and settings.html

```

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Burme Chat</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <!-- Navigation -->
    <nav>
      <button onclick="showSection('friends')">Find Friends</button>
      <button onclick="showSection('chat')">Chat</button>
      <button onclick="showSection('group')">Group Chat</button>
      <button onclick="showSection('settings')">Settings</button>
    </nav>

    <!-- Friends Section -->
    <section id="friends" class="section">
      <h2>Find Friends Nearby</h2>
      <button onclick="getLocation()">Get My Location</button>
      <div id="map">Map placeholder (use Mapbox/Google Maps API)</div>
      <ul id="nearby-users"></ul>
    </section>

    <!-- Chat Section -->
    <section id="chat" class="section" style="display: none;">
      <h2>Chat</h2>
      <input id="recipient-id" placeholder="Recipient User ID">
      <div id="chat-messages"></div>
      <input id="chat-input" placeholder="Type a message...">
      <button onclick="toggleEmojiPicker()">😊</button>
      <input type="file" id="photo-upload" accept="image/*">
      <button onclick="sendMessage()">Send</button>
      <div id="emoji-picker" style="display: none;">
        <!-- Emoji buttons (simplified) -->
        <button onclick="addEmoji('😊')">😊</button>
        <button onclick="addEmoji('❤️')">❤️</button>
        <button onclick="addEmoji('👍')">👍</button>
      </div>
    </section>

    <!-- Group Chat Section -->
    <section id="group" class="section" style="display: none;">
      <h2>Group Chat</h2>
      <input id="group-id" placeholder="Group ID">
      <button onclick="joinGroup()">Join Group</button>
      <div id="group-messages"></div>
      <input id="group-input" placeholder="Type a group message...">
      <button onclick="sendGroupMessage()">Send</button>
      <button onclick="banUser()">Ban User (Admin)</button>
      <input id="ban-user-id" placeholder="User ID to ban">
    </section>

    <!-- Settings Section -->
    <section id="settings" class="section" style="display: none;">
      <h2>Settings</h2>
      <label>
        <input type="checkbox" id="dark-mode" onclick="toggleDarkMode()">
        Dark Mode
      </label>
      <h3>About</h3>
      <p>Burme Chat: Connect with friends and meet new people!</p>
      <label>
        <input type="checkbox" id="location-sharing">
        Enable Location Sharing
      </label>
    </section>
  </div>

  <script src="/socket.io/socket.io.js"></script>
  <script src="script.js"></script>
</body>
</html>

```

3.2 CSS (styles.css)This CSS includes basic styling and light/dark mode support.css

```

body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
  color: #333;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

nav {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

nav button {
  padding: 10px;
  cursor: pointer;
}

.section {
  display: none;
}

.section.active {
  display: block;
}

#map {
  height: 200px;
  background: #ddd;
  margin: 10px 0;
}

#chat-messages, #group-messages {
  border: 1px solid #ccc;
  height: 300px;
  overflow-y: scroll;
  padding: 10px;
  margin-bottom: 10px;
}

#chat-messages img, #group-messages img {
  max-width: 100px;
}

input, button {
  padding: 8px;
  margin: 5px;
}

#emoji-picker {
  margin-top: 10px;
}

/* Dark Mode */
body.dark-mode {
  background-color: #333;
  color: #f0f0f0;
}

body.dark-mode .container {
  background-color: #444;
}

body.dark-mode #chat-messages, body.dark-mode #group-messages {
  border-color: #666;
  background-color: #555;
}

body.dark-mode input, body.dark-mode button {
  background-color: #666;
  color: #fff;
  border: 1px solid #888;
}

```

3.3 JavaScript (script.js)This handles GPS, chat, group chat, and settings logic.javascript

```

const socket = io();
const userId = 'user-' + Math.random().toString(36).substr(2, 9); // Mock user ID

// Show/hide sections
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(sectionId).classList.add('active');
}

// GPS-based Friend Finding
function getLocation() {
  if (navigator.geolocation && document.getElementById('location-sharing').checked) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        document.getElementById('map').innerText = `Location: ${latitude}, ${longitude}`;
        // Mock nearby users (replace with backend API call)
        const nearbyUsers = [
          { id: 'user1', name: 'Alice', distance: '2km' },
          { id: 'user2', name: 'Bob', distance: '3km' },
        ];
        const userList = document.getElementById('nearby-users');
        userList.innerHTML = nearbyUsers.map(user => `<li>${user.name} (${user.distance})</li>`).join('');
      },
      (error) => {
        alert('Error getting location: ' + error.message);
      }
    );
  } else {
    alert('Location sharing is disabled or not supported.');
  }
}

// Chat Functionality
socket.on('connect', () => {
  socket.emit('join', userId);
});

socket.on('message', ({ sender, content, type }) => {
  const chatMessages = document.getElementById('chat-messages');
  const messageDiv = document.createElement('div');
  messageDiv.innerHTML = type === 'image' ? `<img src="${content}" alt="Photo">` : content;
  messageDiv.innerHTML = `<strong>${sender}:</strong> ${messageDiv.innerHTML}`;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

function toggleEmojiPicker() {
  const picker = document.getElementById('emoji-picker');
  picker.style.display = picker.style.display === 'none' ? 'block' : 'none';
}

function addEmoji(emoji) {
  document.getElementById('chat-input').value += emoji;
  toggleEmojiPicker();
}

function sendMessage() {
  const recipient = document.getElementById('recipient-id').value;
  const content = document.getElementById('chat-input').value;
  if (content && recipient) {
    socket.emit('privateMessage', { sender: userId, recipient, content, type: 'text' });
    document.getElementById('chat-input').value = '';
  }
  const photo = document.getElementById('photo-upload').files[0];
  if (photo) {
    const formData = new FormData();
    formData.append('photo', photo);
    fetch('/upload', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(({ url }) => {
        socket.emit('privateMessage', { sender: userId, recipient, content: url, type: 'image' });
        document.getElementById('photo-upload').value = '';
      });
  }
}

// Group Chat Functionality
function joinGroup() {
  const groupId = document.getElementById('group-id').value;
  if (groupId) {
    socket.emit('joinGroup', groupId);
  }
}

socket.on('groupMessage', ({ sender, content, type }) => {
  const groupMessages = document.getElementById('group-messages');
  const messageDiv = document.createElement('div');
  messageDiv.innerHTML = type === 'image' ? `<img src="${content}" alt="Photo">` : content;
  messageDiv.innerHTML = `<strong>${sender}:</strong> ${messageDiv.innerHTML}`;
  groupMessages.appendChild(messageDiv);
  groupMessages.scrollTop = groupMessages.scrollHeight;
});

socket.on('userBanned', ({ userId: bannedUserId }) => {
  alert(`User ${bannedUserId} was banned from the group.`);
});

function sendGroupMessage() {
  const groupId = document.getElementById('group-id').value;
  const content = document.getElementById('group-input').value;
  if (content && groupId) {
    socket.emit('groupMessage', { groupId, sender: userId, content, type: 'text' });
    document.getElementById('group-input').value = '';
  }
}

function banUser() {
  const groupId = document.getElementById('group-id').value;
  const banUserId = document.getElementById('ban-user-id').value;
  if (groupId && banUserId) {
    socket.emit('banUser', { groupId, userId: banUserId, adminId: userId });
  }
}

// Settings (Light/Dark Mode)
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Load saved theme
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
  document.getElementById('dark-mode').checked = true;
}

```

4. How It WorksGPS-based Friend Finding:The getLocation() function uses the browser’s Geolocation API to fetch the user’s location (if permitted).

A mock list of nearby users is displayed (in a real app, this would query a backend with geospatial data).

The map is a placeholder (integrate Mapbox/Google Maps for a real map).


Chat with Photo and Emoji:Users enter a recipient’s user ID (mocked for simplicity) and send text, emojis, or photos.

Emojis are added via buttons (a simple picker; for a full picker, use a library like emoji-mart).

Photos are uploaded to the server (/uploads) and displayed in the chat.

Socket.IO handles real-time messaging.


Group Chat with Admin Controls:Users join a group by entering a group ID.

Messages are sent to all group members via WebSocket.

Admins can ban users (mocked; assumes the current user is the admin for simplicity).


Settings:Toggle light/dark mode using CSS classes and localStorage for persistence.

The "About" section displays static app info.

Location sharing can be toggled (affects GPS access).


5. LimitationsNo Database: This uses a minimal backend without a database. For a production app, use MongoDB or PostgreSQL to store users, messages, and groups.

Mock GPS Data: The friend-finding feature uses mock data. Integrate a geospatial database and Mapbox/Google Maps for real functionality.

Simple Emoji Picker: The emoji picker is basic. Use a library like emoji-mart for a better experience.

No Authentication: User IDs are randomly generated. Add Firebase Authentication or JWT for secure login.

Basic Admin Controls: The ban feature is mocked. A real app would verify admin privileges via a database.



6. DeploymentRun the Node.js server:bash



node server.js


Open http://localhost:3000 in a browser.

Test features:Click "Get My Location" (enable location sharing in settings first).

Send messages/photos in the "Chat" section (use another browser tab with a different user ID to test).

Join a group and send messages.

Toggle dark mode in settings.


7. Next StepsTo enhance this app:Add a Database: Use MongoDB for user profiles, messages, and group metadata.

Integrate Mapbox: Replace the map placeholder with a real map for friend finding.

Improve Emoji Picker: Use a library like emoji-mart.

Add Authentication: Implement user login with Firebase or JWT.

Enhance Admin Controls: Add message moderation and group settings.

Make it a PWA: Add a service worker for offline support and mobile optimization.


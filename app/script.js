
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

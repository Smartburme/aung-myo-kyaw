// Check if user is logged in
auth.onAuthStateChanged((user) => {
    const chatBtn = document.getElementById('toggleChatBtn');
    if (user) {
        // User is logged in, show the chat button
        chatBtn.style.display = 'block';
        console.log("User is logged in.");
    } else {
        // User is not logged in, hide the chat button
        chatBtn.style.display = 'none';
        console.log("User is not logged in.");
    }
});

document.getElementById('toggleChatBtn').addEventListener('click', () => {
    const chatbotContainer = document.getElementById('chatbot-container');
    if (chatbotContainer.style.display === 'flex') {
        chatbotContainer.style.display = 'none';
    } else {
        chatbotContainer.style.display = 'flex';
    }
});

document.getElementById('closeChatBtn').addEventListener('click', () => {
    document.getElementById('chatbot-container').style.display = 'none';
});

document.getElementById('sendBtn').addEventListener('click', sendMessage);
document.getElementById('userInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const userInput = document.getElementById('userInput');
    const userMessage = userInput.value.trim();
    if (userMessage === '') return;

    // Display user's message
    appendMessage(userMessage, 'user');

    // Here, you would call an API (e.g., Gemini API, or your own custom backend)
    // For this example, we'll use a simple static response
    const botResponse = "Thank you for your message. This is a static response. Please note that the chatbot logic needs to be integrated with a backend service or an AI API.";
    
    // Simulate a delay for the bot's response
    setTimeout(() => {
        appendMessage(botResponse, 'bot');
    }, 1000);

    userInput.value = '';
}

function appendMessage(message, sender) {
    const chatbotBody = document.getElementById('chatbot-body');
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageElement.className = sender;
    chatbotBody.appendChild(messageElement);
    chatbotBody.scrollTop = chatbotBody.scrollHeight; // Auto-scroll to the latest message
}

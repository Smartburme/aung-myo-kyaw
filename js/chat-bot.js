// Chat Bot functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-message');
    const chatMessages = document.getElementById('chat-messages');
    const suggestionButtons = document.querySelectorAll('.suggestion-btn');
    
    // Function to add a message to the chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        
        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('message-avatar');
        avatarDiv.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        
        const messageP = document.createElement('p');
        messageP.textContent = text;
        
        const timeSpan = document.createElement('span');
        timeSpan.classList.add('message-time');
        timeSpan.textContent = getCurrentTime();
        
        contentDiv.appendChild(messageP);
        contentDiv.appendChild(timeSpan);
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Get current time in HH:MM format
    function getCurrentTime() {
        const now = new Date();
        return now.getHours().toString().padStart(2, '0') + ':' + 
               now.getMinutes().toString().padStart(2, '0');
    }
    
    // Generate bot response based on user input
    function getBotResponse(userMessage) {
        userMessage = userMessage.toLowerCase();
        
        if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
            return "Hello there! How can I assist you today?";
        } else if (userMessage.includes('service') || userMessage.includes('offer')) {
            return "We offer chat bot services, member chat groups, and e-commerce solutions. What would you like to know more about?";
        } else if (userMessage.includes('contact') || userMessage.includes('email') || userMessage.includes('phone')) {
            return "You can contact us at contact@aungmyokyaw.com or call +95 9xxxxxxxx. Our team will get back to you as soon as possible.";
        } else if (userMessage.includes('e-commerce') || userMessage.includes('shop') || userMessage.includes('product')) {
            return "Our e-commerce platform allows you to buy and sell products with secure payment methods including KPay and Wave Money. You can also list your own products for sale.";
        } else if (userMessage.includes('member') || userMessage.includes('chat group') || userMessage.includes('community')) {
            return "Our member chat group lets you connect with other community members. You can share ideas, collaborate on projects, and build connections.";
        } else if (userMessage.includes('thank') || userMessage.includes('thanks')) {
            return "You're welcome! Is there anything else I can help you with?";
        } else {
            return "I'm sorry, I don't have an answer for that yet. Please try asking something else or contact us directly for more specific inquiries.";
        }
    }
    
    // Handle sending a message
    function handleSendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Add user message
            addMessage(message, 'user');
            chatInput.value = '';
            
            // Bot response after a short delay
            setTimeout(() => {
                const botResponse = getBotResponse(message);
                addMessage(botResponse, 'bot');
            }, 1000);
        }
    }
    
    // Event listeners
    if (sendButton) {
        sendButton.addEventListener('click', handleSendMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSendMessage();
            }
        });
    }
    
    // Suggestion buttons
    suggestionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            chatInput.value = question;
            handleSendMessage();
        });
    });
});

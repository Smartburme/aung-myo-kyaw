// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');
    
    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
    
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            navMenu.classList.remove('active');
            
            // Remove active class from all links and sections
            navLinks.forEach(link => link.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show the corresponding section
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).classList.add('active');
            
            // Scroll to top
            window.scrollTo(0, 0);
        });
    });
    
    // Simple chat bot functionality
    const chatInput = document.querySelector('.chat-input input');
    const chatSendBtn = document.querySelector('.chat-input button');
    const chatMessages = document.querySelector('.chat-messages');
    
    function handleChatMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Add user message
            addMessage(message, 'user');
            chatInput.value = '';
            
            // Bot response after a short delay
            setTimeout(() => {
                let botResponse = "I'm sorry, I don't have an answer for that yet.";
                
                if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
                    botResponse = "Hello there! How can I assist you today?";
                } else if (message.toLowerCase().includes('service')) {
                    botResponse = "We offer chat bot development, community platforms, and e-commerce solutions.";
                } else if (message.toLowerCase().includes('price')) {
                    botResponse = "Prices vary depending on the service. Please contact us for more details.";
                } else if (message.toLowerCase().includes('payment')) {
                    botResponse = "We accept KPay, Wave Money, and bank transfers.";
                } else if (message.toLowerCase().includes('thank')) {
                    botResponse = "You're welcome! Is there anything else I can help with?";
                }
                
                addMessage(botResponse, 'bot');
            }, 1000);
        }
    }
    
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleChatMessage();
        }
    });
    
    chatSendBtn.addEventListener('click', handleChatMessage);
    
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        
        const messageP = document.createElement('p');
        messageP.textContent = text;
        
        messageContent.appendChild(messageP);
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Product interaction
    const productButtons = document.querySelectorAll('.product-actions .btn');
    productButtons.forEach(button => {
        button.addEventListener('click', function() {
            const product = this.closest('.product-card');
            const productName = product.querySelector('.product-title').textContent;
            
            if (this.classList.contains('btn-success')) {
                alert(`Thank you for your interest in ${productName}! This would redirect to a purchase page in a real application.`);
            } else {
                alert(`More details about ${productName} would be shown here.`);
            }
        });
    });
    
    // Join group button
    const joinGroupBtn = document.querySelector('#page-2 .btn-primary');
    if (joinGroupBtn) {
        joinGroupBtn.addEventListener('click', function() {
            alert('This would open a registration form for the chat group in a real application.');
        });
    }
});

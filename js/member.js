// Member Chat functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('group-chat-input');
    const sendButton = document.getElementById('send-group-message');
    const chatMessages = document.getElementById('group-chat-messages');
    const addMemberButton = document.getElementById('add-member');
    
    // Sample member names for simulation
    const memberNames = ['User One', 'User Two', 'User Three', 'User Four', 'User Five'];
    
    // Function to add a message to the group chat
    function addGroupMessage(text, sender, isCurrentUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', isCurrentUser ? 'sent' : 'received');
        
        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('message-avatar');
        avatarDiv.innerHTML = '<i class="fas fa-user"></i>';
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        
        if (!isCurrentUser) {
            const senderDiv = document.createElement('div');
            senderDiv.classList.add('message-sender');
            senderDiv.textContent = sender;
            contentDiv.appendChild(senderDiv);
        }
        
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
    
    // Handle sending a message
    function handleSendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Add user message (current user)
            addGroupMessage(message, 'You', true);
            chatInput.value = '';
            
            // Simulate random member responses
            if (Math.random() > 0.5) {
                setTimeout(() => {
                    const randomMember = memberNames[Math.floor(Math.random() * memberNames.length)];
                    const responses = [
                        "That's interesting!",
                        "I agree with you.",
                        "Can you tell me more about that?",
                        "I have a different perspective...",
                        "Thanks for sharing!",
                        "What does everyone else think?",
                        "I've been working on something similar.",
                        "Has anyone tried this before?"
                    ];
                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                    addGroupMessage(randomResponse, randomMember);
                }, 2000 + Math.random() * 3000);
            }
        }
    }
    
    // Add member functionality
    function handleAddMember() {
        const newMemberName = prompt("Enter new member's name:");
        if (newMemberName) {
            memberNames.push(newMemberName);
            
            // Add to member list
            const memberList = document.querySelector('.member-list');
            const newMemberItem = document.createElement('div');
            newMemberItem.classList.add('member-item', 'online');
            newMemberItem.innerHTML = `
                <div class="member-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="member-info">
                    <h4>${newMemberName}</h4>
                    <p>Online</p>
                </div>
            `;
            memberList.appendChild(newMemberItem);
            
            // Simulate new member joining message
            setTimeout(() => {
                addGroupMessage(`Hello everyone, I'm ${newMemberName}! Nice to meet you all.`, newMemberName);
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
    
    if (addMemberButton) {
        addMemberButton.addEventListener('click', handleAddMember);
    }
    
    // Simulate initial member activity
    setTimeout(() => {
        addGroupMessage("Has everyone seen the latest project update?", "User Two");
    }, 1500);
    
    setTimeout(() => {
        addGroupMessage("I'm still working on my part, will finish by tomorrow.", "User Three");
    }, 4000);
});

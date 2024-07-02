document.addEventListener('DOMContentLoaded', () => {

    const chatContainer = document.getElementById('chat-container');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    
    sendButton.addEventListener('click', () => {
        const messageText = messageInput.value.trim();
        if (messageText !== '') {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.textContent = messageText;
            chatContainer.appendChild(messageElement);
            messageInput.value = '';
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    });
    
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });

});
document.addEventListener('DOMContentLoaded', (event) => {
    const logoutButton = document.getElementById('logout-button');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('jwtToken');
            console.log('Logged out');
            const chatContainer = document.getElementById('chat-container');
            chatContainer.innerHTML = '';
            showModal();
        });
    }

    function showModal() {
        document.getElementById('loginModal').style.display = 'block';
    }
});

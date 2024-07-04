document.addEventListener('DOMContentLoaded', (event) => {
    var token = localStorage.getItem('jwtToken');
    var selected = null;
    var username;
    var websocket = null;

    if (token) {
        fetch('http://127.0.0.1:8003/validate_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ token: token })
        })
        .then(response => {
            if (response.status === 401) {
                throw new Error('Invalid Token');
            }
            return response.json();
        })
        .then(data => {
            load_contacts(data, token)
        })
        .catch(error => {
            console.error('Error validating the token:', error);
            showModal();
        });
    } else {
        console.log('No token');
        showModal();
    }

    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(loginForm);

        fetch('http://127.0.0.1:8001/login', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.access_token) {
                localStorage.setItem('jwtToken', data.access_token);
                console.log('Logged in succesfully');
                token = data.access_token
 
                document.getElementById('loginModal').style.display = 'none';
                fetch('http://127.0.0.1:8003/validate_token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${data.access_token}`
                    },
                    body: JSON.stringify({ token: data.access_token })
                })
                .then(response => {
                    if (response.status === 401) {
                        throw new Error('Invalid Token');
                    }
                    return response.json();
                })
                .then(info => {
                    load_contacts(info, data.access_token)
                })

            } else {
                console.log('Logged in failed');

            }
        })
        .catch(error => {
            console.error('Logged in failed:', error);
        });
    });

    function showModal() {
        document.getElementById('loginModal').style.display = 'block';
    }





    const chatContainer = document.getElementById('chat-container');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');






    function LoadChat(contact) {
        fetch(`http://127.0.0.1:8002/get_conversation?receiver=${contact}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(conversation => {
            const chatContainer = document.getElementById('chat-container');
            chatContainer.innerHTML = '';
            conversation.conversation.forEach(message => { 
    
                const messageElement = document.createElement('div');
                messageElement.classList.add('message');
    
                // Create a container for the message metadata (author)
                const author = document.createElement('span');
                author.classList.add('message-author');
                author.textContent = message.user; // Default to 'Unknown' if user is not present
                const timestamp = document.createElement('span');
                timestamp.classList.add('message-timestamp');
                timestamp.textContent = new Date(message.timestamp).toLocaleString(); // Convert the timestamp to a readable format
                
                // Create a container for the message content
                const messageContent = document.createElement('div');
                messageContent.classList.add('message-content');
                messageContent.textContent = message.body;
                
                // Append the metadata and content to the message element
                messageElement.appendChild(author);
                messageElement.appendChild(messageContent);
                messageElement.appendChild(timestamp);
    
                chatContainer.appendChild(messageElement);
                chatContainer.scrollTop = chatContainer.scrollHeight;
            });
    
            if (websocket) {
                websocket.close();
                websocket = null;
            }

            // Conexión al WebSocket
            const ws = new WebSocket(`ws://127.0.0.1:8005/ws/${contact}?token=${token}`);
            websocket = ws;
            
            ws.onopen = () => {
                console.log('Conectado al WebSocket');
            };
    
            ws.onmessage = (event) => {
                const messageData = JSON.parse(event.data);
    
                const messageElement = document.createElement('div');
                messageElement.classList.add('message');
    
                const author = document.createElement('span');
                author.classList.add('message-author');
                author.textContent = messageData.user;
    
                const timestamp = document.createElement('span');
                timestamp.classList.add('message-timestamp');
                timestamp.textContent = new Date(messageData.timestamp).toLocaleString();
    
                const messageContent = document.createElement('div');
                messageContent.classList.add('message-content');
                messageContent.textContent = messageData.body;
    
                messageElement.appendChild(author);
                messageElement.appendChild(messageContent);
                messageElement.appendChild(timestamp);
    
                chatContainer.appendChild(messageElement);
                chatContainer.scrollTop = chatContainer.scrollHeight;
            };
    
            ws.onclose = () => {
                console.log('Desconectado del WebSocket');
            };
    
            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
            
            // Enviar mensajes a través del WebSocket
            sendButton.addEventListener('click', () => {
                const messageText = messageInput.value.trim();
                if (messageText !== '') {
                    const messageData = {
                        user: username,
                        body: messageText,
                        timestamp: new Date().toISOString()
                    };
                    websocket.send(JSON.stringify(messageData));
                    messageInput.value = '';

                }
            });
    
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendButton.click();
                }
            });
    
        })
        .catch(error => {
            console.error('Error loading conversation:', error);
        });
    }


    function load_contacts(data, token) { 
        console.log('User:', data.user);
                username = data.user
                fetch('http://127.0.0.1:8004/get_contacts', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => response.json())
                .then(contacts => {
                    // La respuesta parece estar doblemente escapa
                    // Aquí puedes hacer algo con la lista de contactos obtenida
                    const contactsContainer = document.querySelector('.contacts-container');
                    contactsContainer.innerHTML = ''; // Limpiar los contactos actuales
                
                    contacts.contacts.forEach(contact => {
                        const contactElement = document.createElement('div');
                        contactElement.classList.add('contact-placeholder');
                        contactElement.textContent = contact; // Mostrar los usuarios del contacto
                        contactElement.addEventListener('click', () => {
                            LoadChat(contact);
                            selected = contact;
                        });
                        contactsContainer.appendChild(contactElement);
                    });
                })
                .catch(error => {
                    console.error('Error fetching contacts:', error);
                });
            }






        const addContactButton = document.getElementById('add-contact-button');
        const addContactModal = document.getElementById('addContactModal');
        const addContactForm = document.getElementById('addContactForm');
        const cancelAddContactButton = document.getElementById('cancelAddContactButton');
    
        if (addContactButton) {
            addContactButton.addEventListener('click', function() {
                addContactModal.style.display = 'block';
            });
        }
    
        if (cancelAddContactButton) {
            cancelAddContactButton.addEventListener('click', function() {
                addContactModal.style.display = 'none';
            });
        }
    
        if (addContactForm) {
            addContactForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const newContactUsername = document.getElementById('newContactUsername').value;
                fetch(`http://127.0.0.1:8004/add_contact`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ contact: newContactUsername})
                })
                .then(data => load_contacts(username, token));
                addContactModal.style.display = 'none';
            });
        }
});

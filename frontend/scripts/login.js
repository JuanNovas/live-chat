document.addEventListener('DOMContentLoaded', (event) => {
    const token = localStorage.getItem('jwtToken');
    var selected = null;
    var username;

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
                console.log('Message:', message); // Debugging line
    
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
        })
        .catch(error => {
            console.error('Error loading conversation:', error);
        });
    }
    

    const chatContainer = document.getElementById('chat-container');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    
    sendButton.addEventListener('click', () => {
        const messageText = messageInput.value.trim();
        if (messageText !== '' && selected !== null) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
    
            // Obtener el usuario actual (puedes ajustar esto según tu lógica)
            const user = username; // Reemplaza esto con la lógica para obtener el nombre del usuario actual
            const timestamp = new Date().toLocaleString();
    
            // Crear los elementos para el mensaje
            const userElement = document.createElement('div');
            userElement.classList.add('message-user');
            userElement.textContent = user;
    
            const bodyElement = document.createElement('div');
            bodyElement.classList.add('message-body');
            bodyElement.textContent = messageText;
    
            const timestampElement = document.createElement('div');
            timestampElement.classList.add('message-timestamp');
            timestampElement.textContent = timestamp;
    
            // Agregar los elementos al mensaje
            messageElement.appendChild(userElement);
            messageElement.appendChild(bodyElement);
            messageElement.appendChild(timestampElement);
    
            // Agregar el mensaje al contenedor del chat
            chatContainer.appendChild(messageElement);
            messageInput.value = '';
            chatContainer.scrollTop = chatContainer.scrollHeight;
    
            // Enviar el mensaje al servidor
            fetch(`http://127.0.0.1:8002/send`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ body: messageText, receiver: selected })
            });
        }
    });
    
    
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });

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
                    // La respuesta parece estar doblemente escapada
                    console.log('Contacts:', contacts.contacts);
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
});

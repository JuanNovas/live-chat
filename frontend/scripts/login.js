document.addEventListener('DOMContentLoaded', (event) => {
    const token = localStorage.getItem('jwtToken');

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
            console.log('User:', data.user);
            // //
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
});

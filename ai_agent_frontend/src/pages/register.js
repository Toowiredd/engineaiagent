function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function registerUser() {
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Basic validation
    if (username.length < 3) {
        document.getElementById('message').textContent = 'Username must be at least 3 characters long.';
        return;
    }

    if (!validateEmail(email)) {
        document.getElementById('message').textContent = 'Please enter a valid email address.';
        return;
    }

    if (password.length < 8) {
        document.getElementById('message').textContent = 'Password must be at least 8 characters long.';
        return;
    }

    // Create the request body
    const data = {
        username: username,
        email: email,
        password: password
    };

    console.log('Sending registration request:', data);

    // Send the POST request to the backend
    fetch('https://backengine-hgd2mg58.fly.dev/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        return response.text().then(text => {
            try {
                return JSON.parse(text);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                console.log('Raw response:', text);
                throw new Error('Invalid JSON response');
            }
        });
    })
    .then(data => {
        console.log('Registration response:', data);
        if (data.message) {
            document.getElementById('message').textContent = data.message;
        } else {
            document.getElementById('message').textContent = 'User registered successfully!';
            // Optionally, redirect to login page
            // setTimeout(() => { window.location.href = 'login.html'; }, 2000);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        document.getElementById('message').textContent = 'An error occurred. Please check the console for more details.';
    });
}
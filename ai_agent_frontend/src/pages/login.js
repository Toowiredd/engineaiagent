function loginUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const data = {
        username: username,
        password: password
    };

    fetch('https://backengine-hgd2mg58.fly.dev/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
            document.getElementById('message').textContent = 'Login successful!';
            // Redirect to dashboard or home page
            // window.location.href = 'dashboard.html';
        } else {
            document.getElementById('message').textContent = 'Login failed. Please check your credentials.';
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        document.getElementById('message').textContent = 'An error occurred. Please try again.';
    });
}
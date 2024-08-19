document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('access_token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    fetch('https://backengine-hgd2mg58.fly.dev/user', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('username').textContent = data.username;
        document.getElementById('email').textContent = data.email;
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Failed to load user data. Please login again.');
        window.location.href = 'login.html';
    });
});

function logout() {
    localStorage.removeItem('access_token');
    window.location.href = 'login.html';
}
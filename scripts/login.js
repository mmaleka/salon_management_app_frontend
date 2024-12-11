document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    axios.post('http://127.0.0.1:8080/api/token/', { username, password })
        .then(response => {
            // Save tokens in localStorage
            const { access, refresh } = response.data;
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);

            // Redirect to profile page
            window.location.href = 'profile.html';
        })
        .catch(error => {
            alert('Login failed. Please try again.');
            console.error(error);
        });
});


function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken');

    axios.post('http://localhost:8080/api/token/refresh/', { refresh: refreshToken })
        .then(response => {
            const { access } = response.data;
            localStorage.setItem('accessToken', access);  // Update access token
        })
        .catch(error => {
            console.error('Error refreshing token:', error);
            alert('Session expired. Please log in again.');
            window.location.href = 'login.html';
        });
}


axios.interceptors.response.use(
    response => response,  // Pass successful responses through
    error => {
        if (error.response.status === 401) {
            return refreshAccessToken().then(() => {
                // Retry the failed request with the new token
                const token = localStorage.getItem('accessToken');
                error.config.headers['Authorization'] = `Bearer ${token}`;
                return axios(error.config);
            });
        }
        return Promise.reject(error);
    }
);


// Define the endpoint URL
const PROFILE_API_URL = 'http://127.0.0.1:8080/api/user/profile/';

// Function to fetch profile data
async function fetchProfileData() {
  try {
    // Get the JWT token from localStorage (adjust this based on your token storage)
    const token = localStorage.getItem('accessToken');

    if (!token) {
      alert('You are not logged in!');
      window.location.href = 'login.html'; // Redirect to login if no token
      return;
    }

    // Make an Axios GET request
    const response = await axios.get(PROFILE_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in Authorization header
      },
    });

    // Extract data from the response
    const { username, first_name, last_name, email, points_balance, referral_code } = response.data;

    // Update the HTML elements with the fetched data
    document.querySelector('h2').innerHTML = `Welcome, ${username}`;
    document.querySelector('.profile-info p:nth-of-type(1)').innerHTML = `<strong>Full Name:</strong> ${first_name} ${last_name}`;
    document.querySelector('.profile-info p:nth-of-type(2)').innerHTML = `<strong>Email:</strong> ${email}`;
    document.querySelector('.profile-info:nth-of-type(2) p:nth-of-type(1)').innerHTML = `<strong>Points Earned:</strong> ${points_balance}`;
    // Add a referral code dynamically if available (replace with your logic)
    document.querySelector('.profile-info:nth-of-type(2) p:nth-of-type(2)').innerHTML = `<strong>Referral Code:</strong> ${referral_code}`;
  } catch (error) {
    console.error('Error fetching profile data:', error);

    // Handle token expiration or unauthorized errors
    if (error.response && error.response.status === 401) {
      alert('Session expired. Please log in again.');
      window.location.href = 'login.html';
    }
  }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', fetchProfileData);



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
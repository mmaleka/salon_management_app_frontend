// Base URL for the API
const baseUrl = 'https://web-production-dff5.up.railway.app';

// API URL for user profile
const apiUrls = {
  userProfile: `${baseUrl}/api/user/profile/`,
};

document.addEventListener('DOMContentLoaded', () => {
  // Check if the JWT token is present in localStorage
  const token = localStorage.getItem('accessToken');

  if (token) {
    // User is logged in; hide the Sign Up buttons
    const signUpButton = document.getElementById('signup-button');
    const signUpButton2 = document.getElementById('signup2-button');

    if (signUpButton) {
      signUpButton.style.display = 'none';
    }
    if (signUpButton2) {
      signUpButton2.style.display = 'none';
    }
  }

  // Fetch user points from the backend
  axios.get(apiUrls.userProfile, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(response => {
      const points = response.data.points_balance;
      document.getElementById('points').textContent = points;
    })
    .catch(error => {
      console.error('Error fetching points:', error);
    });
});

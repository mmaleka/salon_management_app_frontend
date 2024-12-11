document.addEventListener('DOMContentLoaded', () => {

  // Check if the JWT token is present in localStorage
  const token = localStorage.getItem('accessToken');

  if (token) {
    // User is logged in; hide the Sign Up button
    document.getElementById('signup-button').style.display = 'none';
    document.getElementById('signup2-button').style.display = 'none';
  }


  // Example URL for fetching user points (adjust the URL as necessary)
  const apiUrl = 'http://127.0.0.1:8080/api/user/profile/';

  // Fetch user points from the backend
  axios.get(apiUrl, {
    headers: {
      // Authorization: 'Bearer ' +  localStorage.getItem('accessToken'), // Assuming you store the JWT token in localStorage
      Authorization: `Bearer ${token}`,
    }
  })
  .then(response => {
    const points = response.data.points_balance;
    document.getElementById('points').textContent = points;
  })
  .catch(error => {
    console.error('Error fetching points:', error);
  });
});
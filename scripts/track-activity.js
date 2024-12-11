// Base API URL
const baseUrl = 'https://web-production-dff5.up.railway.app';

// Endpoint URL for fetching user activities
const USER_ACTIVITY_API_URL = `${BASE_API_URL}/api/user/activity/`;

// Fetch and display user activities when the page loads
document.addEventListener('DOMContentLoaded', () => {
  fetchUserActivities();
});

// Function to fetch user activities
async function fetchUserActivities() {
  try {
    // Get the JWT token from localStorage
    const token = localStorage.getItem('accessToken');

    // Check if the token is present
    if (!token) {
      alert('You are not logged in!');
      window.location.href = 'login.html';
      return;
    }

    // Make an Axios GET request to fetch activities
    const response = await axios.get(USER_ACTIVITY_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Get the activities data from the response
    const activities = response.data;
    const activityList = document.getElementById('activity-list');

    // Clear existing content
    activityList.innerHTML = '';

    // Populate activities or display a message if there are none
    if (activities.length > 0) {
      activities.forEach(activity => {
        const activityItem = `
          <div class="activity-item mb-3 p-2 border rounded">
            <h5>${activity.action}</h5>
            <p class="activity-date">Date: ${new Date(activity.date).toLocaleString()}</p>
            <p>Points ${activity.points >= 0 ? 'Earned' : 'Spent'}: ${activity.points} Points</p>
          </div>
        `;
        activityList.innerHTML += activityItem;
      });
    } else {
      activityList.innerHTML = '<p class="text-center">No activity to display.</p>';
    }
  } catch (error) {
    console.error('Error fetching activity data:', error);
    document.getElementById('activity-list').innerHTML = '<p class="text-danger">Failed to load activities.</p>';

    // Handle token expiration or unauthorized errors
    if (error.response && error.response.status === 401) {
      alert('Session expired. Please log in again.');
      window.location.href = 'login.html';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
    // Fetch user activities
    axios.get('http://127.0.0.1:8080/api/user/activity/', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'), // Add token for authentication
      }
    })
    .then(response => {
      const activities = response.data;
      const activityList = document.getElementById('activity-list');
  
      // Clear existing content
      activityList.innerHTML = '';
  
      // Populate activities
      if (activities.length > 0) {
        activities.forEach(activity => {
          const activityItem = `
            <div class="activity-item">
              <h5>${activity.action}</h5>
              <p class="activity-date">Date: ${activity.date}</p>
              <p>Points ${activity.points >= 0 ? 'Earned' : 'Spent'}: ${activity.points} Points</p>
            </div>
          `;
          activityList.innerHTML += activityItem;
        });
      } else {
        activityList.innerHTML = '<p class="text-center">No activity to display.</p>';
      }
    })
    .catch(error => {
      console.error('Error fetching activity data:', error);
      document.getElementById('activity-list').innerHTML = '<p class="text-danger">Failed to load activities.</p>';
    });
  });
  
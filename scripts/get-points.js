// Base URL for the API
const baseUrl = 'https://web-production-dff5.up.railway.app/';

// API URLs
const apiUrls = {
  userProfile: `${baseUrl}/api/user/profile/`,
  confirmVisit: `${baseUrl}/api/confirm-visit/`,
};

// Function to show Bootstrap toast notifications
let toast;

function showToast(title, message, isSuccess = true) {
  const toastElement = document.getElementById('notificationToast');
  const toastTitle = document.getElementById('toast-title');
  const toastBody = document.getElementById('toast-body');

  // Set the title and message
  toastTitle.textContent = title;
  toastBody.textContent = message;

  // Set the title color based on success or error
  toastTitle.classList.remove('text-success', 'text-danger');
  toastTitle.classList.add(isSuccess ? 'text-success' : 'text-danger');

  // Initialize the toast once if not already initialized
  if (!toast) {
    toast = new bootstrap.Toast(toastElement);
  }

  toast.show();
}

document.addEventListener('DOMContentLoaded', () => {
  // Check if the JWT token is present in localStorage
  const token = localStorage.getItem('accessToken');

  if (!token) {
    showToast('Error', 'You are not logged in. Please log in to continue.', false);
    return;
  }

  if (token) {
    const signUpButton = document.getElementById('signup-button');
    const signUpButton3 = document.getElementById('signup-button3');
    // User is logged in; hide the Sign Up button
    if (signUpButton) {
      signUpButton.style.display = 'none';
    }
    if (signUpButton3) {
      signUpButton3.style.display = 'none';
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
      console.log("Points: ", points);

      const pointsDisplay = document.getElementById('points-balance');
      if (pointsDisplay) {
        pointsDisplay.innerText = `Your Points: ${points}`;
      }
    })
    .catch(error => {
      console.error('Error fetching points:', error);
      showToast('Error', 'Failed to fetch points.', false);
    });
});

// Confirm Visit Form Submission
document.getElementById('confirmVisitForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const token = localStorage.getItem('accessToken');
  const adminPassword = document.getElementById('adminPassword').value;

  // Clear previous message
  document.getElementById('message').innerText = '';

  axios.post(apiUrls.confirmVisit, {
    password: adminPassword,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(response => {
      console.log("response: ", response);

      document.getElementById('message').innerText = response.data.message;
      showToast('Success', response.data.message, true);

      // Update the points balance display
      const pointsMatch = response.data.points_balance;
      if (pointsMatch) {
        document.getElementById('points-balance').innerText = `Your Points: ${pointsMatch}`;
      }
    })
    .catch(error => {
      const errorMsg = error.response?.data?.detail || 'Invalid password or request failed.';
      document.getElementById('message').innerText = `Error: ${errorMsg}`;
      showToast('Error', errorMsg, false);
    });
});

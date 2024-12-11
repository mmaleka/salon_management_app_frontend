// Define the base URL for the API
const baseUrl = 'https://web-production-dff5.up.railway.app';

// Define the endpoint URLs using the base URL
const POINTS_API_URL = `${baseUrl}/api/profile/points/`;
const REDEEM_API_URL = `${baseUrl}/api/redeem-reward/`;

// Function to show Bootstrap toast notifications
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

  // Initialize and show the toast
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
}

// Function to fetch and update total points
async function fetchPoints() {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      showToast('Error', 'You are not logged in!', false);
      window.location.href = 'login.html';
      return;
    }

    const response = await axios.get(POINTS_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { points } = response.data;
    document.getElementById('total-points').textContent = points;
  } catch (error) {
    console.error('Error fetching points balance:', error);
    if (error.response && error.response.status === 401) {
      showToast('Error', 'Session expired. Please log in again.', false);
      window.location.href = 'login.html';
    } else {
      showToast('Error', 'Failed to fetch points balance.', false);
    }
  }
}

// Function to show the Bootstrap modal with selected rewards
function showConfirmModal(selectedRewards) {
  const confirmBody = document.getElementById('confirmRedeemBody');
  const confirmButton = document.getElementById('confirmRedeemButton');

  // Populate the modal with selected rewards
  confirmBody.innerHTML = selectedRewards
    .map((reward) => `<p>${reward.reward_name} - <strong>${reward.reward_points} Points</strong></p>`)
    .join('');

  // Show the Bootstrap modal
  const confirmModal = new bootstrap.Modal(document.getElementById('confirmRedeemModal'));
  confirmModal.show();

  // Handle the confirm button click
  confirmButton.onclick = () => {
    redeemSelectedRewards(selectedRewards, confirmModal);
  };
}

// Function to redeem selected rewards
async function redeemSelectedRewards(selectedRewards, modal) {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      showToast('Error', 'You are not logged in!', false);
      window.location.href = 'login.html';
      return;
    }

    // Send the redeem request to the API
    const response = await axios.post(
      REDEEM_API_URL,
      { rewards: selectedRewards },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { message, new_balance } = response.data;
    showToast('Success', message, true);

    // Update the points balance on the page
    document.getElementById('total-points').textContent = new_balance;

    // Uncheck all checkboxes after successful redemption
    document.querySelectorAll('.reward-checkbox').forEach((checkbox) => {
      checkbox.checked = false;
    });

    // Hide the modal after redemption
    modal.hide();
  } catch (error) {
    console.error('Error redeeming rewards:', error);
    if (error.response && error.response.data.message) {
      showToast('Error', error.response.data.message, false);
    } else {
      showToast('Error', 'An error occurred. Please try again.', false);
    }

    if (error.response && error.response.status === 401) {
      showToast('Error', 'Session expired. Please log in again.', false);
      window.location.href = 'login.html';
    }
  }
}

// Function to handle the redeem button click
function redeemRewards() {
  const selectedRewards = [];
  document.querySelectorAll('.reward-checkbox:checked').forEach((checkbox) => {
    selectedRewards.push({
      reward_name: checkbox.getAttribute('data-name'),
      reward_points: parseInt(checkbox.getAttribute('data-points')),
    });
  });

  if (selectedRewards.length === 0) {
    showToast('Error', 'Please select at least one reward to redeem.', false);
    return;
  }

  // Show the confirmation modal with selected rewards
  showConfirmModal(selectedRewards);
}

// Add event listener to the "Redeem Rewards" button
document.querySelector('.btn-redeem').addEventListener('click', redeemRewards);

// Call the function to fetch points when the page loads
document.addEventListener('DOMContentLoaded', fetchPoints);

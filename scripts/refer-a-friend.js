// Define the endpoint URL for fetching rewards data
const REWARDS_API_URL = 'http://127.0.0.1:8080/api/user/profile/';

// Function to fetch and update referral code and total points
async function fetchRewards() {
  try {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      alert('You are not logged in!');
      window.location.href = 'login.html';
      return;
    }

    // Fetch rewards data from the API
    const response = await axios.get(REWARDS_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Extract points balance and referral code from the response
    // const { points_balance, referral_code } = response.data;
    const { username, first_name, last_name, email, points_balance, referral_code } = response.data;
    console.log("referral_code: ", referral_code);
    

    // Update total points
    // document.getElementById('total-points').textContent = points_balance;

    // Update referral code
    document.getElementById('referral-code').textContent = referral_code;
    // document.getElementById('referral-code').innerHTML = `<strong>Your Referral Code:</strong> ${referral_code}` ;
  } catch (error) {
    console.error('Error fetching rewards data:', error);

    if (error.response && error.response.status === 401) {
      alert('Session expired. Please log in again.');
      window.location.href = 'login.html';
    }
  }
}

// Function to copy referral code to clipboard
function copyReferralCode() {
  const referralCode = document.getElementById('referral-code').textContent;

  // Copy the code to the clipboard
  navigator.clipboard.writeText(referralCode)
    .then(() => {
      // Show the Bootstrap modal after successful copy
      const copySuccessModal = new bootstrap.Modal(document.getElementById('copySuccessModal'));
      copySuccessModal.show();
    })
    .catch(err => {
      console.error('Failed to copy referral code:', err);
    });
}

// Event listener for copying referral code
document.getElementById('copy-code-btn').addEventListener('click', copyReferralCode);

// Call fetchRewards when the page loads
document.addEventListener('DOMContentLoaded', fetchRewards);

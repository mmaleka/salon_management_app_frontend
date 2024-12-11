// Add an event listener to the form
document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the default form submission behavior

    // Capture form data
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const firstName = document.getElementById('first_name').value;
    const referral_code = document.getElementById('referral_code').value;

    // Prepare the data object
    const formData = {
        username: username,
        password: password,
        first_name: firstName,
        referral_code: referral_code
    };

    // Send the data to the backend using Axios
    axios.post('http://127.0.0.1:8080/api/signup/', formData)
        .then(response => {
            console.log(response.data);  // Handle success
            alert('Signup successful!');
            window.location.href = `login.html?username=${username}`;
        })
        .catch(error => {
            console.error('There was an error!', error.response.data);
            alert('Signup failed: ' + error.response.data.error);
        });
});
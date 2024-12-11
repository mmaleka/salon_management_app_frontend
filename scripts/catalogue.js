document.addEventListener('DOMContentLoaded', () => {

    // Check if the JWT token is present in localStorage
    const token = localStorage.getItem('accessToken');
  
    if (token) {
      // User is logged in; hide the Sign Up button
      document.getElementById('signup-button').style.display = 'none';
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
      console.log("points: ", points);
      
    })
    .catch(error => {
      console.error('Error fetching points:', error);
    });

});


document.addEventListener('DOMContentLoaded', function () {
// The API endpoint for fetching products
const apiUrl = 'http://127.0.0.1:8080/api/products/';

// Function to fetch products and display them
function fetchProducts() {
    axios.get(apiUrl)
    .then(response => {
        const products = response.data;
        displayProducts(products);
    })
    .catch(error => {
        console.error('Error fetching products:', error);
    });
}

  function displayProducts(products) {
    const productContainer = document.getElementById('productContainer');
    productContainer.innerHTML = ''; // Clear existing content before adding new data

    products.forEach(product => {
      const productCard = `
        <div class="col-md-4 mb-4">
          <div class="card d-flex flex-row">
            <!-- Product Image with enlargeable-img class -->
            <img src="${product.image}" class="card-img-left enlargeable-img" alt="${product.name}" style="width: 30%; height: auto; margin-left: 20px; cursor: pointer;">
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text"><strong>R ${product.price}</strong></p>
            </div>
          </div>
        </div>
      `;
      productContainer.insertAdjacentHTML('beforeend', productCard);
    });

    // Delay attaching the event listener to ensure the images are in the DOM
    setTimeout(() => {
      document.querySelectorAll('.enlargeable-img').forEach(img => {
        img.addEventListener('click', () => {
          console.log("Image clicked!");
          const modalImage = document.getElementById('modalImage');
          modalImage.src = img.src;
          const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
          imageModal.show();
        });
      });
    }, 100); // Delay of 100 milliseconds
  }

  // Call the fetchProducts function when the page loads
  fetchProducts();


});
  

  
// Base URL for the API
const baseUrl = 'https://web-production-dff5.up.railway.app/';

// API URLs
const apiUrls = {
  userProfile: `${baseUrl}/api/user/profile/`,
  products: `${baseUrl}/api/products/`,
};

// Event listener for when the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if the JWT token is present in localStorage
  const token = localStorage.getItem('accessToken');

  if (token) {
    // User is logged in; hide the Sign Up button
    document.getElementById('signup-button').style.display = 'none';
  }

  // Fetch user points from the backend
  axios.get(apiUrls.userProfile, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(response => {
      const points = response.data.points_balance;
      console.log("points: ", points);
    })
    .catch(error => {
      console.error('Error fetching points:', error);
    });
});

// Function to fetch products and display them
document.addEventListener('DOMContentLoaded', function () {
  function fetchProducts() {
    axios.get(apiUrls.products)
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

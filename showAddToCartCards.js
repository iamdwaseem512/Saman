import products from "./api/products.json";
import { fetchQuantityFromCartLS } from "./fetchQuantityFromCartLS";
import { getCartProductFromLS } from "./getCartProducts";
import { incrementDecrement } from "./incrementDecrement";
import { removeProdFromCart } from "./removeProdFromCart";
import { updateCartProductTotal } from "./updateCartProductTotal";

let cartProducts = getCartProductFromLS();

let filterProducts = products.filter((curProd) => {
  return cartProducts.some((curElem) => curElem.id === curProd.id);
});

console.log(filterProducts);

// -----------------------------------------------------
// to update the addToCart page
// --------------------------------------------------------
const cartElement = document.querySelector("#productCartContainer");
const templateContainer = document.querySelector("#productCartTemplate");

const showCartProduct = () => {
  filterProducts.forEach((curProd) => {
    const { category, id, image, name, stock, price } = curProd;

    let productClone = document.importNode(templateContainer.content, true);

    const lSActualData = fetchQuantityFromCartLS(id, price);

    productClone.querySelector("#cardValue").setAttribute("id", `card${id}`);
    productClone.querySelector(".category").textContent = category;
    productClone.querySelector(".productName").textContent = name;
    productClone.querySelector(".productImage").src = image;

    productClone.querySelector(".productQuantity").textContent =
      lSActualData.quantity;
    productClone.querySelector(".productPrice").textContent =
      lSActualData.price;

    // handle increment and decrement button
    productClone
      .querySelector(".stockElement")
      .addEventListener("click", (event) => {
        incrementDecrement(event, id, stock, price);
      });

    productClone
      .querySelector(".remove-to-cart-button")
      .addEventListener("click", () => removeProdFromCart(id));

    cartElement.appendChild(productClone);
  });
};

// -----------------------------------------------------
// Showing the cartProducts
// --------------------------------------------------------
showCartProduct();

// -----------------------------------------------------
// calculating the card total in our cartProducts page
// --------------------------------------------------------
updateCartProductTotal();

// Order Popup Functionality
function showOrderPopup() {
  const popupOverlay = document.getElementById('popupOverlay');
  if (popupOverlay) {
    popupOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Clear cart after successful order
    localStorage.removeItem('cartProductLS');
    
    // Update cart count to 0
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
      cartCountElement.textContent = '0';
    }
  }
}

function hideOrderPopup() {
  const popupOverlay = document.getElementById('popupOverlay');
  if (popupOverlay) {
    popupOverlay.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
    
    // Redirect to home page after closing popup
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 300);
  }
}

// Initialize popup functionality
function initializeOrderPopup() {
  const popupCloseBtn = document.getElementById('popupCloseBtn');
  const popupOverlay = document.getElementById('popupOverlay');
  
  // Close button event
  if (popupCloseBtn) {
    popupCloseBtn.addEventListener('click', hideOrderPopup);
  }
  
  // Close popup when clicking outside content
  if (popupOverlay) {
    popupOverlay.addEventListener('click', function(e) {
      if (e.target === popupOverlay) {
        hideOrderPopup();
      }
    });
  }
  
  // Close popup with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      hideOrderPopup();
    }
  });
}

// Add order button functionality
function addOrderButton() {
  // Create and add order button to the cart page
  const productCartTotalElement = document.querySelector('.productCartTotalElement');
  
  if (productCartTotalElement && !document.querySelector('.order-now-btn')) {
    const orderButton = document.createElement('button');
    orderButton.className = 'order-now-btn';
    orderButton.innerHTML = '<i class="fa-solid fa-bolt"></i> Place Order';
    orderButton.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Check if cart is empty
      if (filterProducts.length === 0) {
        alert('Your cart is empty! Please add some products before placing an order.');
        return;
      }
      
      showOrderPopup();
    });
    
    productCartTotalElement.appendChild(orderButton);
  }
}

// Call this function when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeOrderPopup();
  addOrderButton();
});
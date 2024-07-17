document.getElementById('checkout-btn').addEventListener('click', function() {
    document.getElementById('checkout-modal').style.display = 'block';
});

// Sample product data
const products = [
    { id: 1, name: 'Staircase Bracelet', price: 1.99, minColors: 2, maxColors: 6 },
    { id: 2, name: 'Single Strand Bracelet', price: 1.99, minColors: 2, maxColors: 5 },
    { id: 3, name: 'Zipper Bracelet', price: 1.99, minColors: 2, maxColors: 2 },
    { id: 4, name: 'Chevron Bracelet', price: 2.99, minColors: 3, maxColors: 6 },
    { id: 5, name: 'Candy Stripe Bracelet', price: 1.99, minColors: 3, maxColors: 5 },
    { id: 6, name: 'Custom Pattern Bracelet', price: 3.99, minColors: 4, maxColors: 6 },
    { id: 7, name: 'Rag Rug', price: 1.99, minColors: 0, maxColors: 0 },
    { id: 8, name: 'Hair Wrap', price: 1.99, minColors: 6, maxColors: 6 }
];

// Sample cart data
let cart = [];

// Function to render products
function renderProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach(product => {
        const productItem = document.createElement('li');
        productItem.innerHTML = `
            <div class="product-info">
                <div class="product-details">
                    <span>${product.name}</span>
                    <span>$${product.price.toFixed(2)}</span>
                </div>
                <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
            </div>
        `;
        productList.appendChild(productItem);
    });

    // Add event listeners to "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
}

// Function to render cart items
function renderCartItems() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    cart.forEach((cartItem, index) => {
        const cartItemElement = document.createElement('li');
        const colorsText = cartItem.colors.length > 0 ? `, Colors: ${cartItem.colors.join(', ')}` : '';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <span>${cartItem.name} (Quantity: ${cartItem.quantity}${colorsText})</span>
            </div>
            <div class="cart-item-actions">
                <button class="edit-cart-item-btn" data-cart-index="${index}">Edit</button>
                <button class="remove-cart-item-btn" data-cart-index="${index}">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItemElement);
    });

    // Add event listeners to "Edit" and "Remove" buttons
    const editCartItemButtons = document.querySelectorAll('.edit-cart-item-btn');
    editCartItemButtons.forEach(button => {
        button.addEventListener('click', handleEditCartItem);
    });

    const removeCartItemButtons = document.querySelectorAll('.remove-cart-item-btn');
    removeCartItemButtons.forEach(button => {
        button.addEventListener('click', handleRemoveCartItem);
    });

    // Update cart total
    updateCartTotal();
}

// Function to update cart total
function updateCartTotal() {
    const cartTotalValue = document.getElementById('cart-total-value');
    const total = cart.reduce((sum, cartItem) => sum + cartItem.price * cartItem.quantity, 0);
    cartTotalValue.textContent = total.toFixed(2);
}

// Function to handle adding a product to the cart
function handleAddToCart(event) {
    const productId = parseInt(event.target.getAttribute('data-product-id'));
    const product = products.find(product => product.id === productId);

    if (product) {
        if (product.minColors === 0 && product.maxColors === 0) {
            cart.push({ ...product, quantity: 1, colors: [] });
            renderCartItems();
        } else {
            openCustomizationModal(product);
        }
    }
}

// Function to handle editing a cart item
function handleEditCartItem(event) {
    const cartIndex = parseInt(event.target.getAttribute('data-cart-index'));
    const cartItem = cart[cartIndex];

    if (cartItem) {
        openCustomizationModal(cartItem, cartIndex);
    }
}

function openCustomizationModal(product, cartIndex = -1) {
    const customizationModal = document.getElementById('customization-modal');
    customizationModal.style.display = 'block';

    const quantityInput = document.getElementById('quantity-input');
    quantityInput.value = product.quantity || 1;

    const colorInput = document.getElementById('color-input');
    const colorLabel = document.getElementById('color-label');

    if (product.id === 7) { // Assuming product id 7 is the Rug Rag
        colorInput.style.display = 'none'; // Hide color input
        colorLabel.style.display = 'none'; // Hide color label
    } else {
        colorInput.style.display = 'block'; // Show color input for other products
        colorLabel.style.display = 'block'; // Show color label for other products
        colorInput.value = product.colors ? product.colors.join(', ') : '';
    }

    const saveButton = document.getElementById('save-customization-btn');
    saveButton.onclick = function() {
        const quantity = parseInt(quantityInput.value);
        const colors = colorInput.value ? colorInput.value.split(',').map(color => color.trim()) : [];

        if (quantity > 0 && colors.length >= product.minColors && colors.length <= product.maxColors) {
            if (cartIndex === -1) {
                cart.push({ ...product, quantity, colors });
            } else {
                cart[cartIndex] = { ...cart[cartIndex], quantity, colors };
            }
            renderCartItems();
            customizationModal.style.display = 'none';
        } else {
            alert(`Please select between ${product.minColors} and ${product.maxColors} colors.`);
        }
    };
}


// Function to handle removing a cart item
function handleRemoveCartItem(event) {
    const cartIndex = parseInt(event.target.getAttribute('data-cart-index'));
    cart.splice(cartIndex, 1);
    renderCartItems();
}

// Function to populate hidden input fields before form submission
function populateOrderDetails() {
    const orderDetailsInput = document.getElementById('order-details');
    const orderTotalInput = document.getElementById('order-total');

    const orderDetails = cart.map(item => {
        const colorsText = item.colors.length > 0 ? `, Colors: ${item.colors.join(', ')}` : '';
        return `${item.name} (Quantity: ${item.quantity}${colorsText})`;
    }).join('; ');

    const orderTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

    orderDetailsInput.value = orderDetails;
    orderTotalInput.value = orderTotal;
}

// Add event listener to populate hidden fields before form submission
const checkoutForm = document.getElementById('checkout-form');
checkoutForm.addEventListener('submit', populateOrderDetails);

// Initial render of products
renderProducts();

// Modal open/close functionality
const mainModal = document.getElementById('main-modal');
const openCartBtns = document.querySelectorAll('.open-cart-btn'); // Selecting all elements with class 'open-cart-btn'

// Adding event listener to each open cart button
openCartBtns.forEach(btn => {
    btn.onclick = function() {
        mainModal.style.display = 'block';
    };
});

const closeMainBtn = document.querySelector('.close-main-btn');

closeMainBtn.onclick = function() {
    mainModal.style.display = 'none';
};

const customizationModal = document.getElementById('customization-modal');
const closeBtn = document.querySelector('.close-btn');

closeBtn.onclick = function() {
    customizationModal.style.display = 'none';
};

const checkoutModal = document.getElementById('checkout-modal');
const closeCheckoutBtn = document.querySelector('.close-checkout-btn');

closeCheckoutBtn.onclick = function() {
    checkoutModal.style.display = 'none';
};

window.onclick = function(event) {
    if (event.target == mainModal) {
        mainModal.style.display = 'none';
    } else if (event.target == customizationModal) {
        customizationModal.style.display = 'none';
    } else if (event.target == checkoutModal) {
        checkoutModal.style.display = 'none';
    }
};
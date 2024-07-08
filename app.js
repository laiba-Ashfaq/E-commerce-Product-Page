// Selecting elements from the HTML
let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');

// Arrays to store products and cart items
let products = [];
let cart = [];

// Event listener for clicking on the cart icon to toggle visibility
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

// Event listener for clicking on the close button to close the cart
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

// Function to add product data to the HTML
const addDataToHTML = () => {
    // Remove any existing product data from HTML
    listProductHTML.innerHTML = '';

    // Add new product data
    if (products.length > 0) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML = 
                `<img src="${product.image}" alt="">
                <h2>${product.title}</h2>
                <div class="price">$${product.price}</div>
                <button class="addCart">Add To Cart</button>`;
            listProductHTML.appendChild(newProduct);
        });
    }
};

// Event listener for adding products to the cart
listProductHTML.addEventListener('click', (event) => {
    let clickedElement = event.target;
    if (clickedElement.classList.contains('addCart')) {
        let productId = clickedElement.parentElement.dataset.id;
        addToCart(productId);
    }
});

// Function to add a product to the cart
const addToCart = (productId) => {
    let existingProductIndex = cart.findIndex(item => item.product_id == productId);

    if (cart.length <= 0) {
        cart.push({
            product_id: productId,
            quantity: 1
        });
    } else if (existingProductIndex < 0) {
        cart.push({
            product_id: productId,
            quantity: 1
        });
    } else {
        cart[existingProductIndex].quantity++;
    }

    addCartToHTML(); // Update the cart display
    addCartToMemory(); // Save the cart state to localStorage
};

// Function to save the cart to localStorage
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Function to update the cart display in the HTML
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;

    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity += item.quantity;

            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let productIndex = products.findIndex(prod => prod.id == item.product_id);
            let productInfo = products[productIndex];

            newItem.innerHTML = `
                <div class="image">
                    <img src="${productInfo.image}">
                </div>
                <div class="name">
                    ${productInfo.title}
                </div>
                <div class="totalPrice">$${productInfo.price * item.quantity}</div>
                <div class="quantity">
                    <span class="minus">-</span>
                    <span>${item.quantity}</span>
                    <span class="plus">+</span>
                </div>
            `;

            listCartHTML.appendChild(newItem);
        });
    }

    iconCartSpan.innerText = totalQuantity;
};

// Event listener for changing quantities in the cart
listCartHTML.addEventListener('click', (event) => {
    let clickedElement = event.target;
    if (clickedElement.classList.contains('minus') || clickedElement.classList.contains('plus')) {
        let productId = clickedElement.parentElement.parentElement.dataset.id;
        let actionType = clickedElement.classList.contains('plus') ? 'plus' : 'minus';
        changeQuantityCart(productId, actionType);
    }
});

// Function to change the quantity of a product in the cart
const changeQuantityCart = (productId, actionType) => {
    let productIndex = cart.findIndex(item => item.product_id == productId);

    if (productIndex >= 0) {
        switch (actionType) {
            case 'plus':
                cart[productIndex].quantity++;
                break;
            case 'minus':
                cart[productIndex].quantity = Math.max(0, cart[productIndex].quantity - 1);
                if (cart[productIndex].quantity === 0) {
                    cart.splice(productIndex, 1);
                }
                break;
        }
    }

    addCartToHTML(); // Update the cart display
    addCartToMemory(); // Save the cart state to localStorage
};

// Function to initialize the application
const initApp = () => {
    // Fetch product data from JSON file
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data; // Store fetched products
            addDataToHTML(); // Display products in the HTML

            // Retrieve cart data from localStorage if exists
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML(); // Display cart items in the HTML
            }
        })
        .catch(error => console.error('Error fetching products:', error));
};

// Initialize the application when the page loads
initApp();

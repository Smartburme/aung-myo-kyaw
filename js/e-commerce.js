// E-Commerce functionality
document.addEventListener('DOMContentLoaded', function() {
    const sellProductForm = document.getElementById('sell-product-form');
    const categoryFilter = document.getElementById('category-filter');
    const sortBy = document.getElementById('sort-by');
    const productsGrid = document.querySelector('.products-grid');
    
    // Sample products data
    let products = [
        {
            id: 1,
            name: "Smartphone X3",
            price: 250000,
            category: "electronics",
            description: "Latest smartphone with high-end features"
        },
        {
            id: 2,
            name: "Laptop Pro",
            price: 850000,
            category: "electronics",
            description: "Powerful laptop for work and gaming"
        },
        {
            id: 3,
            name: "Wireless Headphones",
            price: 75000,
            category: "electronics",
            description: "Noise-cancelling wireless headphones"
        },
        {
            id: 4,
            name: "Digital Camera",
            price: 320000,
            category: "electronics",
            description: "Professional camera for photography"
        }
    ];
    
    // Function to render products
    function renderProducts(productsToRender) {
        productsGrid.innerHTML = '';
        
        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            
            productCard.innerHTML = `
                <div class="product-img">
                    <i class="fas fa-${getProductIcon(product.category)}"></i>
                </div>
                <div class="product-info">
                    <div class="product-title">${product.name}</div>
                    <div class="product-price">${product.price.toLocaleString()} MMK</div>
                    <div class="product-description">${product.description}</div>
                    <div class="product-actions">
                        <button class="btn btn-primary view-details" data-id="${product.id}">Details</button>
                        <button class="btn btn-success buy-now" data-id="${product.id}">Buy Now</button>
                    </div>
                </div>
            `;
            
            productsGrid.appendChild(productCard);
        });
        
        // Add event listeners to the new buttons
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                viewProductDetails(productId);
            });
        });
        
        document.querySelectorAll('.buy-now').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                buyProduct(productId);
            });
        });
    }
    
    // Get appropriate icon for product category
    function getProductIcon(category) {
        switch(category) {
            case 'electronics': return 'mobile-alt';
            case 'clothing': return 'tshirt';
            case 'home': return 'home';
            default: return 'box';
        }
    }
    
    // View product details
    function viewProductDetails(productId) {
        const product = products.find(p => p.id == productId);
        if (product) {
            alert(`Product: ${product.name}\nPrice: ${product.price.toLocaleString()} MMK\nCategory: ${product.category}\nDescription: ${product.description}`);
        }
    }
    
    // Buy product
    function buyProduct(productId) {
        const product = products.find(p => p.id == productId);
        if (product) {
            const paymentMethod = prompt(`Buying: ${product.name}\nPrice: ${product.price.toLocaleString()} MMK\nSelect payment method (KPay, Wave Money, Bank Transfer):`);
            if (paymentMethod) {
                alert(`Thank you for your purchase!\nProduct: ${product.name}\nPayment method: ${paymentMethod}\nWe will contact you for delivery details.`);
            }
        }
    }
    
    // Handle selling a product
    function handleSellProduct(e) {
        e.preventDefault();
        
        const productName = document.getElementById('product-name').value;
        const productPrice = parseInt(document.getElementById('product-price').value);
        const productCategory = document.getElementById('product-category').value;
        const productQuantity = parseInt(document.getElementById('product-quantity').value);
        const productDescription = document.getElementById('product-description').value;
        
        if (productName && productPrice && productCategory && productQuantity && productDescription) {
            const newProduct = {
                id: products.length + 1,
                name: productName,
                price: productPrice,
                category: productCategory,
                description: productDescription,
                quantity: productQuantity
            };
            
            products.push(newProduct);
            renderProducts(products);
            
            alert('Your product has been listed successfully!');
            sellProductForm.reset();
        } else {
            alert('Please fill in all fields.');
        }
    }
    
    // Filter and sort products
    function filterAndSortProducts() {
        const category = categoryFilter.value;
        const sortValue = sortBy.value;
        
        let filteredProducts = category === 'all' 
            ? [...products] 
            : products.filter(product => product.category === category);
        
        // Sort products
        switch(sortValue) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
            default:
                // Already in order of addition (newest first)
                break;
        }
        
        renderProducts(filteredProducts);
    }
    
    // Event listeners
    if (sellProductForm) {
        sellProductForm.addEventListener('submit', handleSellProduct);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterAndSortProducts);
    }
    
    if (sortBy) {
        sortBy.addEventListener('change', filterAndSortProducts);
    }
    
    // Initial render
    renderProducts(products);
});

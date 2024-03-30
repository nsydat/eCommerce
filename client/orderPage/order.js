document.addEventListener('DOMContentLoaded', function() {
    displayUserLogin();
    // Xử lý sự kiện click cho tên người dùng
    const userNameSpan = document.getElementById('user-name');
    const popoverContent = `
        <div class="list-group">
            <a href="../userProfilePage/userProfile.html" class="list-group-item list-group-item-action">Thông tin tài khoản</a>
            <a href="../orderPage/order.html" class="list-group-item list-group-item-action">Đơn mua</a>
            <a href="#" class="list-group-item list-group-item-action logout-link">Đăng xuất</a>
        </div>
    `;
    let popover;
    userNameSpan.addEventListener('click', function(event) {
        event.stopPropagation(); 

        if (!popover) {
            popover = new bootstrap.Popover(userNameSpan, {
                content: popoverContent,
                html: true,
                trigger: 'manual', 
                container: 'body'
            });
        }

        popover.show();
    });

    document.addEventListener('click', function() {
        if (popover) {
            popover.hide();
        }
    });

    document.addEventListener('click', function(e) {
        if (e.target && e.target.matches('.logout-link')) {
            e.preventDefault(); // Prevent default action
            logout(); // Call the logout function defined in checkLogin.js
        }
    });

    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIds = cart.map(item => item.productId);
    let totalPrice = 0;
    fetch(`http://localhost:8088/api/v1/products/by-ids?ids=${productIds.join(',')}`)
        .then(response => response.json())
        .then(products => {
            products.forEach(product => {
                const cartItem = cart.find(item => parseInt(item.productId) === product.id);
                const quantity = cartItem ? cartItem.quantity : 0;
                const itemPrice = product.price * quantity;
                totalPrice += itemPrice;
            });
            displayProducts(products, cart, totalPrice);
        })
        .catch(error => console.error('Error:', error));

        const validateField = (fieldId, validationFunction, warningMessage) => {
            const input = document.getElementById(fieldId);
            const warningId = `${fieldId}-warning`;
            let warningElement = document.getElementById(warningId);
    
            input.addEventListener('blur', function() {
                const isValid = validationFunction(input.value);
                if (!isValid) {
                    input.style.borderColor = 'red';
                    if (!warningElement) {
                        warningElement = document.createElement('div');
                        warningElement.id = warningId;
                        warningElement.style.color = 'red';
                        warningElement.textContent = warningMessage;
                        input.parentNode.insertBefore(warningElement, input.nextSibling);
                    }
                } else {
                    input.style.borderColor = '';
                    if (warningElement) {
                        warningElement.remove();
                    }
                }
            });
        };
    
        const isNotEmpty = value => value !== '';
        const isValidEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    
        validateField('name', isNotEmpty, 'Vui lòng nhập họ và tên.');
        validateField('email', isValidEmail, 'Vui lòng nhập email hợp lệ.');
        validateField('phone', isNotEmpty, 'Vui lòng nhập số điện thoại.');
        validateField('address', isNotEmpty, 'Vui lòng nhập địa chỉ.');
    
        const isSelected = value => value !== '';
        validateField('shipping-method', isSelected, 'Vui lòng chọn phương thức vận chuyển.');
        validateField('payment-method', isSelected, 'Vui lòng chọn phương thức thanh toán.');


        document.querySelector('#order').addEventListener('click', function(event) {
            event.preventDefault(); // Prevent form from submitting traditionally
            const userDetails = JSON.parse(localStorage.getItem('userDetails'));

            const orderData = {
                user_id: userDetails.id, 
                fullname: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone_number: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                note: document.getElementById('note').value,
                total_money: totalPrice,
                shipping_method: document.getElementById('shipping-method').value,
                payment_method: document.getElementById('payment-method').value,
                cart_items: JSON.parse(localStorage.getItem('cart')) || []
            };

            const authToken = localStorage.getItem('authToken');
            
            fetch('http://localhost:8088/api/v1/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(orderData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                return response.json();
            })
            .then(data => {
                const orderId = data.id; 
                window.location.href = `../orderConfirmPage/order-confirm.html?orderId=${orderId}`;
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
        });
    });

    function getProductIdFromRow(row) {
        const productIdCell = row.querySelector('.product-id');
        if (productIdCell) {
            return parseInt(productIdCell.textContent, 10);
        }
        return null;
    }
    
    function updateCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    function removeProductFromCart(productId) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const updatedCart = cart.filter(item => parseInt(item.productId) !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
    
    function updateTotalPrice(totalPrice) {
        const totalPriceDisplay = document.querySelector('tbody tr:last-child td:last-child');
        totalPriceDisplay.textContent = `${totalPrice.toLocaleString()} đ`;
    }
    
    function displayProducts(products, cart, totalPrice) {
        const tableBody = document.querySelector('tbody');
        tableBody.innerHTML = '';
    
        products.forEach(product => {
            let cartItem = cart.find(item => parseInt(item.productId) === product.id);
            const quantity = cartItem ? cartItem.quantity : 0;
            const itemPrice = product.price * quantity;
    
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="product-info">
                        <img src="http://localhost:8088/api/v1/products/images/${product.thumbnail}" alt="Product Image" class="product-image">
                        <span class="product-name">${product.name}</span>
                    </div>
                </td>
                <td>
                    <div class="quantity-controls">
                        <button class="btn btn-sm btn-secondary decrease-quantity" onclick="decreaseQuantity(this, ${product.id})">-</button>
                        <input type="number" class="quantity-input" value="${quantity}" min="0" readonly>
                        <button class="btn btn-sm btn-secondary increase-quantity" onclick="increaseQuantity(this, ${product.id})">+</button>
                    </div>
                </td>
                <td>${product.price.toLocaleString()} đ</td>
                <td class="item-total">${itemPrice.toLocaleString()} đ</td>
                <td>
                    <button class="btn btn-danger remove-product">Xóa</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    
        // Hiển thị tổng giá
        const totalPriceRow = document.createElement('tr');
        totalPriceRow.innerHTML = `
            <td colspan="3" class="text-end fw-bold">Tổng giá:</td>
            <td class="fw-bold total-price">${totalPrice.toLocaleString()} đ</td>
        `;
        tableBody.appendChild(totalPriceRow);
    }
    
    function decreaseQuantity(button, productId) {
        const row = button.parentNode.parentNode;
        const quantityInput = row.querySelector('.quantity-input');
        let currentQuantity = parseInt(quantityInput.value, 10);
    
        currentQuantity--;
        quantityInput.value = currentQuantity;
        updateQuantityForProduct(productId, currentQuantity);
        updateTotalAndItemPrices();
    }
    
    function increaseQuantity(button, productId) {
        const row = button.parentNode.parentNode;
        const quantityInput = row.querySelector('.quantity-input');
        let currentQuantity = parseInt(quantityInput.value, 10);
    
        currentQuantity++;
        quantityInput.value = currentQuantity;
        updateQuantityForProduct(productId, currentQuantity);
        updateTotalAndItemPrices();
    }
    
    function updateQuantityForProduct(productId, newQuantity) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartItem = cart.find(item => parseInt(item.productId) === productId);
        if (cartItem) {
            cartItem.quantity = newQuantity;
            updateCart(cart);
        }
    }
    
    function updateTotalAndItemPrices() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const productIds = cart.map(item => item.productId);
    
        fetch(`http://localhost:8088/api/v1/products/by-ids?ids=${productIds.join(',')}`)
            .then(response => response.json())
            .then(products => {
                let totalPrice = 0;
                const tableRows = document.querySelectorAll('tbody tr');
    
                tableRows.forEach(row => {
                    const productNameCell = row.querySelector('.product-name');
                    if (productNameCell) {
                        const productName = productNameCell.textContent;
                        const product = products.find(p => p.name === productName);
                        if (product) {
                            const cartItem = cart.find(item => parseInt(item.productId) === product.id);
                            const quantity = cartItem ? cartItem.quantity : 0;
                            if (quantity === 0) {
                                row.remove();
                                removeProductFromCart(product.id);
                            } else {
                                const itemPrice = product.price * quantity;
                                totalPrice += itemPrice;
    
                                const itemTotalCell = row.querySelector('.item-total');
                                if (itemTotalCell) {
                                    itemTotalCell.textContent = `${itemPrice.toLocaleString()} đ`;
                                }
                            }
                        }
                    }
                });
    
                const totalPriceDisplay = document.querySelector('.total-price');
                if (totalPriceDisplay) {
                    totalPriceDisplay.textContent = `${totalPrice.toLocaleString()} đ`;
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function displayUserLogin() {
        const authToken = localStorage.getItem('authToken');
        const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    
        if (authToken && userDetails) {
            const loginLink = document.getElementById('login-link');
            const userNameSpan = document.getElementById('user-name');

            loginLink.style.display = 'none'; // Ẩn liên kết "Đăng nhập"
            userNameSpan.textContent = userDetails.full_name; // Hiển thị tên người dùng

            // Điền thông tin người dùng
            document.getElementById('name').value = userDetails.full_name;
            document.getElementById('address').value = userDetails.address;
            document.getElementById('phone').value = userDetails.phone_number;
        }
    }

    function logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userDetails');
        localStorage.removeItem('cart');
    
        window.location.replace('../loginPage/loginPage.html');
    }
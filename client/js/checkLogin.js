function checkUserLogin() {
    const authToken = localStorage.getItem('authToken');
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));

    if (authToken && userDetails) {
        const loginLink = document.getElementById('login-link');
        const userNameSpan = document.getElementById('user-name');

        loginLink.style.display = 'none'; // Ẩn liên kết "Đăng nhập"
        userNameSpan.textContent = userDetails.full_name; // Hiển thị tên người dùng
    }
}   

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userDetails');
    localStorage.removeItem('cart');

    window.location.replace('../loginPage/loginPage.html');
}
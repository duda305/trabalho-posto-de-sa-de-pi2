document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    // Se não estiver logado
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const userPic = document.getElementById('userProfilePic');
    const logoutBtn = document.getElementById('logoutBtn');

    if (userPic) {
        userPic.addEventListener('click', () => {
            window.location.href = 'profile.html';
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        });
    }
});

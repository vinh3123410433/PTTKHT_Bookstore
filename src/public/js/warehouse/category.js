// Gán sự kiện tự động cho các cột có class "sortable"
window.addEventListener("DOMContentLoaded", () => {
    // Thông báo xóa danh mục
    const deleteBtns = document.querySelectorAll('.delete-btn');
    const deletePopup = document.querySelector('.delete-popup');
    const closeBtn = document.querySelector('.popup-close-btn');
    const cancelBtn = document.querySelector('.popup-cancel-btn');
    const confirmBtn = document.querySelector('.popup-confirm-btn');

    let selectedProductId = null;

    deleteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedProductId = btn.getAttribute('data-id');
            deletePopup.classList.add('active');
        });
    });

    closeBtn.addEventListener('click', () => {
        deletePopup.classList.remove('active');
    });

    cancelBtn.addEventListener('click', () => {
        deletePopup.classList.remove('active');
    });

    confirmBtn.addEventListener('click', () => {
        if (selectedProductId) {
            // Điều hướng tới URL xóa
            window.location.href = `/admin/warehouse/category/delete/${selectedProductId}`;
        }
    });
});
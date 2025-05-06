// Basic script file for customer management in sales section
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sales Customer Management script loaded');
    
    // Common functionality for customer management pages
    const setupDeleteConfirmation = () => {
        const deleteButtons = document.querySelectorAll('.delete-btn');
        if (deleteButtons.length) {
            deleteButtons.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    if (!confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
                        e.preventDefault();
                    }
                });
            });
        }
    };
    
    setupDeleteConfirmation();
});
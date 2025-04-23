// Gán sự kiện tự động cho các cột có class "sortable"
window.addEventListener("DOMContentLoaded", () => {
    const headers = document.querySelectorAll("#header-row td");
    headers.forEach((td, index) => {
        if (td.classList.contains("sortable")) {
            td.style.cursor = "pointer";
            td.addEventListener("click", () => sortTable(index));
        }
    });

    // --- Giữ lại trạng thái chọn của select-box ---
    const currentPath = window.location.pathname;
    const selectBox = document.getElementById("selection-box");
    const options = selectBox.options;

    for (let i = 0; i < options.length; i++) {
        if (options[i].value === currentPath) {
            options[i].selected = true;
            break;
        }
    }

    // Thông báo xóa sản phẩm
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
            window.location.href = `/product/delete/${selectedProductId}`;
        }
    });
});

// --- Sự kiện thay đổi lựa chọn trong dropdown ---
document.getElementById("selection-box").addEventListener("change", function () {
    const url = this.value;
    window.location.href = url;
});

// Sắp xếp
let sortDirections = {}; // lưu trạng thái sort từng cột

function sortTable(colIndex) {
    const table = document.getElementById("product_table");
    const rows = Array.from(table.tBodies[0].rows);
  
    const isAscending = !sortDirections[colIndex];
    sortDirections[colIndex] = isAscending;
  
    rows.sort((a, b) => {
        const cellA = a.cells[colIndex];
        const cellB = b.cells[colIndex];
      
        const valA = cellA.dataset.value || cellA.innerText.trim();
        const valB = cellB.dataset.value || cellB.innerText.trim();
      
        const isNumber = !isNaN(valA) && !isNaN(valB);
        return isNumber
          ? (isAscending ? valA - valB : valB - valA)
          : (isAscending ? valA.localeCompare(valB) : valB.localeCompare(valA));
    });
  
    const tbody = table.tBodies[0];
    rows.forEach(row => tbody.appendChild(row));
  
    // Reset mũi tên tất cả
    const allArrows = document.querySelectorAll("#header-row .arrow");
    allArrows.forEach(arrow => arrow.textContent = "▲");
  
    // Đặt lại mũi tên cho cột đang sort
    const currentArrow = table.rows[0].cells[colIndex].querySelector(".arrow");
    if (currentArrow) currentArrow.textContent = isAscending ? "▲" : "▼";
}

// tải ảnh trang create product
document.getElementById("imageUpload").addEventListener("change", function(event) {
    let preview = document.getElementById("imagePreview");
    let hiddenInput = document.getElementById("imageBase64"); // Input ẩn
    let clearButton = document.getElementById("clearAllImages");
    let imageArray = hiddenInput.value ? JSON.parse(hiddenInput.value) : []; // Giữ lại ảnh đã có

    for (let file of event.target.files) {
        let reader = new FileReader();
        
        reader.onload = function(e) {
            let imageData = e.target.result; // Base64

            if (imageArray.includes(imageData)) {
                alert("Ảnh này đã được chọn trước đó!");
                return;
            }

            imageArray.push(imageData); // Lưu vào mảng
            
            let frame = document.createElement("div");
            frame.classList.add("image-frame");
            
            let img = document.createElement("img");
            img.src = imageData; // Hiển thị ảnh

            frame.appendChild(img);
            preview.appendChild(frame); 

            hiddenInput.value = JSON.stringify(imageArray); // Gán vào input ẩn

            // Hiện nút "Xóa Tất Cả" khi có ảnh
            clearButton.style.display = "block";
        };
        
        reader.readAsDataURL(file);
    }

    document.getElementById("clearAllImages").addEventListener("click", function () {
        document.getElementById("imagePreview").innerHTML = ""; // Xóa giao diện ảnh
        document.getElementById("imageBase64").value = "[]"; // Reset input ẩn
        document.getElementById("clearAllImages").style.display = "none"; // Ẩn nút sau khi xóa hết ảnh
    });
});

document.getElementById("clearImages").addEventListener("click", function () {
    document.getElementById("imagePreview").innerHTML = ""; // Xóa giao diện ảnh
    document.getElementById("imageBase64").value = "[]"; // Reset input ẩn
});
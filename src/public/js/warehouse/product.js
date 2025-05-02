// Gán sự kiện tự động cho các cột có class "sortable"
window.addEventListener("DOMContentLoaded", () => {
    // --- SẮP XẾP CỘT ---
    const headers = document.querySelectorAll("#header-row td");
    headers.forEach((td, index) => {
        if (td.classList.contains("sortable")) {
            td.style.cursor = "pointer";
            td.addEventListener("click", () => sortTable(index));
        }
    });

    // --- UPLOAD & RENDER ẢNH ---
    const uploadInput = document.getElementById("imageUpload");
    const preview = document.getElementById("imagePreview");
    const hiddenInput = document.getElementById("imageBase64");
    const clearButton = document.getElementById("clearAllImages");
    const clearImages = document.getElementById("clearImages");

    // RENDER ẢNH CŨ KHI LOAD TRANG
    if (preview && hiddenInput) {
        try {
            const imageArray = hiddenInput.value ? JSON.parse(hiddenInput.value) : [];
            if (imageArray.length > 0) {
                preview.innerHTML = "";
                imageArray.forEach((imgData) => {
                    const frame = document.createElement("div");
                    frame.classList.add("image-frame");

                    const img = document.createElement("img");
                    img.src = imgData;

                    frame.appendChild(img);
                    preview.appendChild(frame);
                });
                if (clearButton) clearButton.style.display = "block";
            }
        } catch (e) {
            console.error("Lỗi parse imageBase64:", e);
        }
    }

    // SỰ KIỆN CHỌN ẢNH MỚI
    if (uploadInput && preview && hiddenInput) {
        uploadInput.addEventListener("change", function (event) {
            let imageArray = [];

            try {
                imageArray = hiddenInput.value ? JSON.parse(hiddenInput.value) : [];
            } catch (e) {
                imageArray = [];
            }

            const newFiles = Array.from(event.target.files);
            const readers = [];

            newFiles.forEach((file) => {
                const reader = new FileReader();
                readers.push(new Promise((resolve) => {
                    reader.onload = function (e) {
                        const imageData = e.target.result;
                        if (!imageArray.includes(imageData)) {
                            imageArray.push(imageData);
                        } else {
                            alert("Ảnh này đã được chọn trước đó!");
                        }
                        resolve();
                    };
                    reader.readAsDataURL(file);
                }));
            });

            Promise.all(readers).then(() => {
                hiddenInput.value = JSON.stringify(imageArray);
                preview.innerHTML = "";
                imageArray.forEach((imgData) => {
                    const frame = document.createElement("div");
                    frame.classList.add("image-frame");

                    const img = document.createElement("img");
                    img.src = imgData;

                    frame.appendChild(img);
                    preview.appendChild(frame);
                });
                if (clearButton) clearButton.style.display = "block";
            });
        });
    }

    // NÚT XÓA TẤT CẢ ẢNH
    if (clearButton && preview && hiddenInput) {
        clearButton.addEventListener("click", () => {
            preview.innerHTML = "";
            hiddenInput.value = "[]";
            clearButton.style.display = "none";
        });
    }

    if (clearImages) {
        clearImages.addEventListener("click", function () {
            const preview = document.getElementById("imagePreview");
            const hiddenInput = document.getElementById("imageBase64");
    
            if (preview) preview.innerHTML = ""; // Xóa giao diện ảnh
            if (hiddenInput) hiddenInput.value = "[]"; // Reset input ẩn
        }); 
    }

    // --- GIỮ TRẠNG THÁI SELECT-BOX ---
    const selectBox = document.getElementById("selection-box");
    if (selectBox) {
        const currentPath = window.location.pathname;
        const options = selectBox.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].value === currentPath) {
                options[i].selected = true;
                break;
            }
        }

        selectBox.addEventListener("change", function () {
            const url = this.value;
            window.location.href = url;
        });
    }

    // --- POPUP XÓA SẢN PHẨM ---
    const deleteBtns = document.querySelectorAll(".delete-btn");
    const deletePopup = document.querySelector(".delete-popup");
    const closeBtn = document.querySelector(".popup-close-btn");
    const cancelBtn = document.querySelector(".popup-cancel-btn");
    const confirmBtn = document.querySelector(".popup-confirm-btn");

    let selectedProductId = null;

    if (deleteBtns.length && deletePopup && closeBtn && cancelBtn && confirmBtn) {
        deleteBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                selectedProductId = btn.getAttribute("data-id");
                deletePopup.classList.add("active");
            });
        });

        closeBtn.addEventListener("click", () => {
            deletePopup.classList.remove("active");
        });

        cancelBtn.addEventListener("click", () => {
            deletePopup.classList.remove("active");
        });

        confirmBtn.addEventListener("click", () => {
            if (selectedProductId) {
                window.location.href = `/admin/warehouse/product/delete/${selectedProductId}`;
            }
        });
    }
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
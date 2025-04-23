// Gán sự kiện tự động cho các cột có class "sortable"
window.addEventListener("DOMContentLoaded", () => {
    const headers = document.querySelectorAll("#header-row td");
    headers.forEach((td, index) => {
        if (td.classList.contains("sortable")) {
            td.style.cursor = "pointer";
            td.addEventListener("click", () => sortTable(index));
        }
    });
});

// Sắp xếp
let sortDirections = {}; // lưu trạng thái sort từng cột

function sortTable(colIndex) {
    const table = document.getElementById("receipt_table");
    const rows = Array.from(table.tBodies[0].rows);
  
    const isAscending = !sortDirections[colIndex];
    sortDirections[colIndex] = isAscending;
  
    rows.sort((a, b) => {
        const cellA = a.cells[colIndex];
        const cellB = b.cells[colIndex];
      
        let valA = (cellA.dataset.value || cellA.innerText.trim()).replace('#', '');
        let valB = (cellB.dataset.value || cellB.innerText.trim()).replace('#', '');        
      
        const isNumber = !isNaN(valA) && !isNaN(valB);
        const isDate = !isNaN(Date.parse(valA)) && !isNaN(Date.parse(valB));
        if (isDate) {
            return isAscending 
                ? new Date(valA) - new Date(valB) 
                : new Date(valB) - new Date(valA);
        }
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

// Xử lý gợi ý nhà cung cấp trong form create
const provider = document.getElementById('provider');
const suggestions_provider = document.getElementById('suggestions_provider');

provider.addEventListener('input', async () => {
    const query = provider.value.trim();
    if (query === '') {
        suggestions_provider.innerHTML = '';
        return;
    }

    const response = await fetch(`/receipt/search_provider?q=${encodeURIComponent(query)}`);
    const products = await response.json();

    suggestions_provider.innerHTML = '';
    products.forEach(product => {
        const div = document.createElement('div');
        div.textContent = product.provider_info;
        div.classList.add('suggestion-item');
        div.addEventListener('click', () => {
            provider.value = product.provider_info;
            suggestions_provider.innerHTML = '';
        });
        suggestions_provider.appendChild(div);
    });
});

// Xử lý gợi ý nhân viên trong form create
const employee = document.getElementById('employee');
const suggestions_employee = document.getElementById('suggestions_employee');

employee.addEventListener('input', async () => {
    const query = employee.value.trim();
    if (query === '') {
        suggestions_employee.innerHTML = '';
        return;
    }

    const response = await fetch(`/receipt/search_employee?q=${encodeURIComponent(query)}`);
    const products = await response.json();

    suggestions_employee.innerHTML = '';
    products.forEach(product => {
        const div = document.createElement('div');
        div.textContent = product.employee_info;
        div.classList.add('suggestion-item');
        div.addEventListener('click', () => {
            employee.value = product.employee_info;
            suggestions_employee.innerHTML = '';
        });
        suggestions_employee.appendChild(div);
    });
});

// Xử lý gợi ý sản phẩm trong form create
const productInput = document.getElementById("product");
const product_details = document.getElementById("product_details");
const suggestions_product = document.getElementById("suggestions_product");
const productList = document.getElementById("product-list").querySelector("tbody");
const add_btn = document.querySelector('.add-btn');
let productData = product_details.value ? JSON.parse(product_details.value) : [];

function updateEmptyMessage() {
    const existingMessageRow = productList.querySelector(".empty-row");

    if (productList.children.length === 0) {
        const row = document.createElement("tr");
        row.classList.add("empty-row");
        row.innerHTML = `<td colspan="5" style="text-align:center;">Chưa có sản phẩm nào</td>`;
        productList.appendChild(row);
    } else if (existingMessageRow) {
        existingMessageRow.remove();
    }
}

updateEmptyMessage(); // Cập nhật thông báo

productInput.addEventListener("input", async () => {
    const query = productInput.value.trim();
    if (query === '') {
        suggestions_product.innerHTML = '';
        return;
    }

    const response = await fetch(`/receipt/search_product?q=${encodeURIComponent(query)}`);
    const products = await response.json();

    suggestions_product.innerHTML = '';
    products.forEach(product => {
        const div = document.createElement('div');
        div.textContent = product.product_info;
        div.classList.add('suggestion-item');
        div.addEventListener('click', () => {
            addProductToTable(product);
            productInput.value = "";
        });
        suggestions_product.appendChild(div);
    });
});

function addProductToTable(product) {

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${product.SanPhamID}</td>
        <td>${product.TenSanPham}</td>
        <td><input type="text" class="quantity" value="0"></td>
        <td><input type="text" class="price" value="0"></td>
        <td><button class="remove-btn">X</button></td>
    `;

    row.querySelector(".quantity").addEventListener("input", () => validateNumber(row.querySelector(".quantity")));
    row.querySelector(".price").addEventListener("input", () => validateNumber(row.querySelector(".price")));

    row.querySelector(".remove-btn").addEventListener("click", () => {
        row.remove();
        updateEmptyMessage(); // cập nhật sau khi xóa
    });

    productList.appendChild(row);
    product.value = "";
    suggestions_product.innerHTML = "";
    updateEmptyMessage(); // cập nhật sau khi thêm
}

function validateNumber(input) {
    if (!/^\d*\.?\d*$/.test(input.value)) {
        alert("Vui lòng nhập số hợp lệ!");
        input.value = input.value.replace(/\D/g, "");
    }
}

add_btn.addEventListener('click', () => {
    const rows = productList.querySelectorAll('tr:not(.empty-row)');
    rows.forEach(row => {
        const productID = row.cells[0].textContent;
        const productName = row.cells[1].textContent;
        const quantity = row.querySelector(".quantity").value;
        const price = row.querySelector(".price").value;
        productData.push({ productID, productName, quantity, price });
    });
    product_details.value = JSON.stringify(productData);
});

// Gắn sự kiện cho các dòng sản phẩm đã render sẵn (trong update)
const existingRows = productList.querySelectorAll('tr:not(.empty-row)');
existingRows.forEach(row => {
    const quantityInput = row.querySelector('.quantity');
    const priceInput = row.querySelector('.price');
    const removeBtn = row.querySelector('.remove-btn');

    quantityInput.addEventListener("input", () => validateNumber(quantityInput));
    priceInput.addEventListener("input", () => validateNumber(priceInput));
    removeBtn.addEventListener("click", () => {
        row.remove();
        updateEmptyMessage();
    });
});
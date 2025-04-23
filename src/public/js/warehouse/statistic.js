// Gán sự kiện tự động cho các cột có class "sortable"
window.addEventListener("DOMContentLoaded", () => {
    const headers = document.querySelectorAll("#header-row td");
    headers.forEach((td, index) => {
        if (td.classList.contains("sortable")) {
            td.style.cursor = "pointer";
            td.addEventListener("click", () => sortTable(index));
        }
    });
    const from = document.querySelector('input[name="from"]').value;
    const to = document.querySelector('input[name="to"]').value;

    const excelLink = document.getElementById("excel-link");
    if (from && to) {
        excelLink.href = `/statistic/create_excel?from=${from}&to=${to}`;
    } else {
        excelLink.href = `/statistic/create_excel`; // fallback
    }
});

// Sắp xếp
let sortDirections = {}; // lưu trạng thái sort từng cột

function sortTable(colIndex) {
    const table = document.getElementById("statistic_table");
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
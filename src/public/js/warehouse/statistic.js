// Gán sự kiện tự động cho các cột có class "sortable"
window.addEventListener("DOMContentLoaded", () => {
    const headers = document.querySelectorAll("#header-row td");
    headers.forEach((td, index) => {
        if (td.classList.contains("sortable")) {
            td.style.cursor = "pointer";
            td.addEventListener("click", () => sortTable(index));
        }
    });
    // const from = document.querySelector('input[name="from"]').value;
    // const to = document.querySelector('input[name="to"]').value;

    // const excelLink = document.getElementById("excel-link");
    // if (from && to) {
    //     excelLink.href = `/statistic/create_excel?from=${from}&to=${to}`;
    // } else {
    //     excelLink.href = `/statistic/create_excel`; // fallback
    // }

    const filterType = document.getElementById("filter-type");
    const monthSelect = document.getElementById("month-select");
    const yearSelect = document.getElementById("year-select");
    const excelLink = document.getElementById("excel-link");

    // Hiển thị select đúng theo type ban đầu (nếu cần)
    const updateSelectVisibility = () => {
        const value = filterType.value;
        if (value === "month") {
            monthSelect.style.display = "block";
            yearSelect.style.display = "none";
        } else if (value === "year") {
            yearSelect.style.display = "block";
            monthSelect.style.display = "none";
        } else {
            monthSelect.style.display = "none";
            yearSelect.style.display = "none";
        }
    };

    // Gọi khi filterType thay đổi
    filterType.addEventListener("change", () => {
        updateSelectVisibility();
        updateExcelLink();
    });

    // Gọi lại khi chọn tháng/năm thay đổi
    document.querySelectorAll("select[name='month'], select[name='month_year'], select[name='year']").forEach(select => {
        select.addEventListener("change", updateExcelLink);
    });

    // Hàm cập nhật link Excel theo lựa chọn lọc
    function updateExcelLink() {
        const type = filterType.value;
        const month = document.querySelector('select[name="month"]')?.value;
        const month_year = document.querySelector('select[name="month_year"]')?.value;
        const year = document.querySelector('select[name="year"]')?.value;

        let query = "";
        if (type === "month" && month && month_year) {
            query = `type=month&month=${month}&month_year=${month_year}`;
        } else if (type === "year" && year) {
            query = `type=year&year=${year}`;
        } else {
            query = `type=all`;
        }

        if (excelLink) {
            excelLink.href = `/admin/warehouse/statistic/create_excel?${query}`;
        }
    }

    // Gọi khi trang load
    updateSelectVisibility();
    updateExcelLink();
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
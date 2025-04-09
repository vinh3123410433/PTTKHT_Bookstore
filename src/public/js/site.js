const priceSlider = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");
const categoryInput = document.getElementById("categorySearch");
const categoryList = document.getElementById("categoryList");
const filterBtn = document.getElementById("filterBtn");

// Cập nhật giá khi kéo slider
priceSlider.addEventListener("input", function () {
  priceValue.innerText = Number(this.value).toLocaleString("vi-VN");
});

// Debounce tìm kiếm danh mục
let debounceTimer;
categoryInput.addEventListener("input", function () {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const keyword = this.value.toLowerCase();
    const items = categoryList.querySelectorAll("li");
    let visibleCount = 0;

    items.forEach((item) => {
      const text = item.textContent.toLowerCase();
      const match = text.includes(keyword);
      item.style.display = match ? "block" : "none";
      if (match) visibleCount++;
    });

    if (visibleCount > 5) {
      toggleBtn.style.display = "inline-block";
    } else {
      toggleBtn.style.display = "none";
    }
  }, 400);
});

// Toggle "Xem thêm" danh mục
let expanded = false;
function toggleCategoryItems() {
  const items = categoryList.querySelectorAll("li");
  items.forEach((item, index) => {
    item.style.display = expanded || index < 5 ? "block" : "none";
  });
  toggleBtn.innerText = expanded ? "Thu gọn" : "Xem thêm";
}

// Tạo nút "Xem thêm" và thêm sau danh sách
const toggleBtn = document.createElement("button");
toggleBtn.id = "toggleCategories";
toggleBtn.className = "btn btn-sm btn-outline-primary mt-2";
toggleBtn.innerText = "Xem thêm";
toggleBtn.addEventListener("click", () => {
  expanded = !expanded;
  toggleCategoryItems();
});
categoryList.insertAdjacentElement("afterend", toggleBtn);

// Ẩn danh mục dư khi tải lần đầu
window.addEventListener("DOMContentLoaded", () => {
  const items = categoryList.querySelectorAll("li");
  if (items.length > 5) {
    toggleCategoryItems(); // ẩn nếu dư
  } else {
    toggleBtn.style.display = "none";
  }
});

// Xử lý nút lọc sản phẩm
filterBtn.addEventListener("click", () => {
  const maxPrice = priceSlider.value;
  const selectedCategories = Array.from(
    document.querySelectorAll('#categoryList input[type="checkbox"]:checked')
  ).map((cb) => cb.dataset.id);

  const params = new URLSearchParams(window.location.search);

  // Nếu có từ khóa q trong input ẩn
  const keywordInput = document.querySelector('input[name="q"]');
  if (keywordInput && keywordInput.value.trim()) {
    params.set("q", keywordInput.value.trim());
  }

  // Cập nhật maxPrice và categories
  params.set("maxPrice", maxPrice);
  params.delete("categories");
  selectedCategories.forEach((id) => params.append("categories", id));

  // Reset page về 1 khi lọc
  params.delete("page");

  // Xác định URL gốc
  const path = window.location.pathname;
  let basePath = "/search";

  const categoryMatch = path.match(/^\/category\/(\d+)/);
  if (categoryMatch) {
    basePath = `/category/${categoryMatch[1]}`;
  }

  // Điều hướng với URL đã build
  window.location.href = `${basePath}?${params.toString()}`;
});

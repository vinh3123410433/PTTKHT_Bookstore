// public/js/site.js

document.addEventListener("DOMContentLoaded", function () {
  // Đổi giá đơn chiếc khi kéo slider (nếu có)
  const priceSlider = document.getElementById("priceRange");
  const priceValue = document.getElementById("priceValue");
  if (priceSlider && priceValue) {
    priceSlider.addEventListener("input", function () {
      priceValue.innerText = Number(this.value).toLocaleString("vi-VN");
    });
  }

  // Tìm kiếm danh mục có debounce
  const categoryInput = document.getElementById("categorySearch");
  const categoryList = document.getElementById("categoryList");
  const toggleBtn = document.createElement("button");
  let debounceTimer, expanded = false;

  if (categoryInput && categoryList) {
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
        toggleBtn.style.display = visibleCount > 5 ? "inline-block" : "none";
      }, 400);
    });

    // Nút xem thêm / thu gọn
    toggleBtn.id = "toggleCategories";
    toggleBtn.className = "btn btn-sm btn-outline-primary mt-2";
    toggleBtn.innerText = "Xem thêm";
    toggleBtn.addEventListener("click", () => {
      expanded = !expanded;
      const items = categoryList.querySelectorAll("li");
      items.forEach((item, index) => {
        item.style.display = expanded || index < 5 ? "block" : "none";
      });
      toggleBtn.innerText = expanded ? "Thu gọn" : "Xem thêm";
    });
    categoryList.insertAdjacentElement("afterend", toggleBtn);

    const items = categoryList.querySelectorAll("li");
    if (items.length > 5) {
      items.forEach((item, index) => {
        item.style.display = index < 5 ? "block" : "none";
      });
      toggleBtn.style.display = "inline-block";
    } else {
      toggleBtn.style.display = "none";
    }
  }

  // Sự kiện nút lọc sản phẩm
  const filterBtn = document.getElementById("filterBtn");
  if (filterBtn) {
    filterBtn.addEventListener("click", () => {
      const minPrice = document.getElementById("minPrice").value;
      const maxPrice = document.getElementById("maxPrice").value;
      const selectedCategories = Array.from(
        document.querySelectorAll('#categoryList input[type="checkbox"]:checked')
      ).map((cb) => cb.dataset.id);
  
      const params = new URLSearchParams(window.location.search);
      const keywordInput = document.querySelector('input[name="q"]');
      if (keywordInput && keywordInput.value.trim()) {
        params.set("q", keywordInput.value.trim());
      }
  
      params.set("minPrice", minPrice);
      params.set("maxPrice", maxPrice);
      params.delete("categories");
      selectedCategories.forEach((id) => params.append("categories", id));
      params.delete("page");
  
      // 👉 Cập nhật phần xử lý basePath
      const path = window.location.pathname;
      let basePath = "/search";
      if (path.startsWith("/category")) {
        basePath = path; // Giữ nguyên URL category, kể cả khi không có ID
      }
  
      window.location.href = `${basePath}?${params.toString()}`;
    });
  }
  
});

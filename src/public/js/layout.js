document.getElementById("openMenu").addEventListener("click", function () {
    document.getElementById("sidebar").classList.add("open");
    console.log(document.getElementById("sidebar"));
});


document.getElementById("closeMenu").addEventListener("click", function () {
    document.getElementById("sidebar").classList.remove("open");
});

/* Xử lý mở danh mục con */
document.getElementById("openCategories").addEventListener("click", function () {
    console.log("Hiển thị")
    document.getElementById("sidebar").classList.remove("open");
    console.log(document.getElementById("sidebar"))
    document.getElementById("categorySidebar").classList.add("open");
    console.log(document.getElementById("categorySidebar"))
});

/* Xử lý đóng danh mục con */
document.getElementById("closeCategoryMenu").addEventListener("click", function () {
    console.log("đóng nè")
    document.getElementById("categorySidebar").classList.remove("open");
    document.getElementById("sidebar").classList.add("open");
});

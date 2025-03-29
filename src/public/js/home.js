
var carouselWidth = $(".carousel-inner-pd")[0].scrollWidth;
var cardWidth = $(".carousel-item-pd").width();
var scrollPosition = 0;
$(".carousel-control-next-pd").on("click", function () {
    if (scrollPosition < (carouselWidth - cardWidth * 4)) { //check if you can go any further
        scrollPosition += cardWidth;  //update scroll position
        $(".carousel-inner-pd").animate({ scrollLeft: scrollPosition }, 600); //scroll left
    }
});
$(".carousel-control-prev-pd").on("click", function () {
    console.log("test")
    if (scrollPosition > 0) {
        scrollPosition -= cardWidth;
        $(".carousel-inner-pd").animate(
            { scrollLeft: scrollPosition },
            600
        );
    }
});

document.addEventListener("DOMContentLoaded", function () {
    // Lấy các phần tử cần thiết
    var carouselInner = document.querySelector('.carousel-inner-pd');
    var cards = document.querySelectorAll('.carousel-item-pd');
    var nextBtn = document.querySelector('.carousel-control-next-pd');
    var prevBtn = document.querySelector('.carousel-control-prev-pd');

    // Kiểm tra nếu các phần tử cần thiết tồn tại
    if (!carouselInner || cards.length === 0 || !nextBtn || !prevBtn) {
        console.error("Carousel elements are missing!");
        return;
    }

    // Lấy chiều rộng của một thẻ sản phẩm
    var cardWidth = cards[0].offsetWidth;
    var scrollPosition = 0;

    // Xử lý sự kiện khi nhấn nút "Next"
    nextBtn.addEventListener('click', function () {
        if (scrollPosition + cardWidth < carouselInner.scrollWidth - carouselInner.offsetWidth) {
            scrollPosition += cardWidth;
            carouselInner.scrollTo({ left: scrollPosition, behavior: "smooth" });
        }
    });

    // Xử lý sự kiện khi nhấn nút "Previous"
    prevBtn.addEventListener('click', function () {
        if (scrollPosition - cardWidth >= 0) {
            scrollPosition -= cardWidth;
            carouselInner.scrollTo({ left: scrollPosition, behavior: "smooth" });
        }
    });
});


// Lấy ảnh đầu tiên trong danh sách ảnh
// hbs.registerHelper('firstImage', function(danhSachAnh) {
//     if (!danhSachAnh) return '/img/default.jpg'; // Ảnh mặc định nếu danh sách rỗng
//     return danhSachAnh.split(', ')[0]; // Lấy ảnh đầu tiên từ danh sách
// });

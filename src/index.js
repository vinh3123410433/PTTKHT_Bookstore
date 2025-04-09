const path = require('path');
const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const port = 3000;

const route = require('./routes');

app.use(express.static(path.join(__dirname, 'public')));

// Template engine
app.engine(
    'hbs',
    hbs.engine({
        extname: '.hbs', // Sử dụng phần mở rộng .hbs
        layoutsDir: path.join(__dirname, 'resources/views/layouts'), // Thư mục layouts
        partialsDir: path.join(__dirname, 'resources/views/partials'), // Thư mục partials
        defaultLayout: 'main', // Layout mặc định
        helpers: {
            formatNumber: (number) => {
                const num = Number(number);
                if (isNaN(num)) return '';
                return num.toLocaleString('vi-VN') + '₫';
              },
              
            eq: (a, b) => a === b, // So sánh hai giá trị
            subtract: (a, b) => a - b, // Trừ hai số
            add: (a, b) => a + b, // ✅ Thêm helper cộng hai số
            range: (start, end, options) => { // Tạo danh sách số từ start đến end
                let result = '';
                for (let i = start; i <= end; i++) {
                    result += options.fn ? options.fn(i) : i;
                }
                return result;
            },
            paginationURL: (page, options) => {
                const query = { ...options.data.root.query, page };
                const params = new URLSearchParams(query);
                return `?${params.toString()}`;
            },
            includes: (array, value) => {
                if (!Array.isArray(array)) {
                    array = [array];
                }
                return array.includes(value.toString()) || array.includes(Number(value));
            }
            
        }
    })
);

app.set('view engine', 'hbs'); // Đặt view engine là Handlebars
app.set('views', path.join(__dirname, 'resources/views')); // Đường dẫn đến views

console.log(path.join(__dirname, 'resources/views'));

route(app);

app.listen(port, () => console.log(`App running at http://localhost:${port}`));

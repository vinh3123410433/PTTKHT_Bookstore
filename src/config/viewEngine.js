const path = require('path')
const express = require('express')
const hbs = require('express-handlebars')

let configViewEngine = (app) => {
    app.set('views', path.join(__dirname, '/../resources/views')); // Đường dẫn đến thư mục views
    app.set('view engine', 'hbs'); // Sử dụng .hbs làm view engine
    app.use(express.static(path.join("./src","public")))
    //template engine
    app.engine('hbs', hbs.engine({
        extname: '.hbs', // Đặt phần mở rộng là .hbs
        layoutsDir: path.join(__dirname, '../resources/views/layouts'), // Thư mục chứa layouts
        partialsDir: path.join(__dirname, '../resources/views/partials'), // Thư mục chứa partials
        defaultLayout: 'main', // Layout mặc định
        helpers: {
            formatNumber: (number) => {
                return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
            }
        }

    }));
}
module.exports = configViewEngine
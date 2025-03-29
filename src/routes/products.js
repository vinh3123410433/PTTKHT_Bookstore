let express = require('express');
let router = express.Router();

let pdController = require("../app/controllers/ProductsController");

// Định nghĩa route cho chi tiết sản phẩm
router.get('/productDetail', pdController.showDetail);
router.get('/', pdController.index)
module.exports = router;
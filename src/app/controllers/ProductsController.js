class PdDetailController {
    // [GET] /pd
    index(req, res) {
        res.send('<h1>Trang sản phẩm</h1>');
    }
    showDetail(req, res) {
        res.send('<h1>Trang chi tiết sản phẩm</h1>')
    }
}

module.exports = new PdDetailController();
let express = require('express')
let router = express.Router()

let categoryController = require("../app/controllers/CategoryController")

router.get('/:id?', categoryController.index);
module.exports = router
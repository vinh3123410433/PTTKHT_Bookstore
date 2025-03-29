let express = require('express')
let router = express.Router()

let categoryController = require("../app/controllers/CategoryController")


router.use('/', siteController.index)
module.exports = router
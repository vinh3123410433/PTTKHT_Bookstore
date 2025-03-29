
const siteRouter = require('./site')
const productsRouter = require('./products')
function route(app) {
    console.log("hi")
    app.use('/products', productsRouter)
    app.use('/products', productsRouter)
    app.use('/', siteRouter)

}

module.exports = route
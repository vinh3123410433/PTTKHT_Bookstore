
const siteRouter = require('./site')
const productsRouter = require('./products')
const categoryRouter=require('./category')

function route(app) {
    console.log("hi")
    app.use('/products', productsRouter)
    // app.use('/products', productsRouter)
    app.use('/category',categoryRouter)
    app.use('/', siteRouter)

    

}

module.exports = route
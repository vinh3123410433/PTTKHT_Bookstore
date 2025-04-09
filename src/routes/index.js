
const siteRouter = require('./site')
const productsRouter = require('./products')
const categoryRouter=require('./category')
const homeRouter=require('./homeRouter')
const userRouter=require('./userRouter')
const cartRouter=require('./cartRouter')

function route(app) {
    console.log("hi")
    app.use('/products', productsRouter)
    app.use('/category',categoryRouter)
    app.use('/', siteRouter)
    
    app.use('/',homeRouter)
    app.use('/',userRouter)
    app.use('/',cartRouter)
}

module.exports = route
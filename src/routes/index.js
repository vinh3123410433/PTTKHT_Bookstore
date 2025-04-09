
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
    app.use('/user',userRouter)
    app.use('/', siteRouter)
    
    app.use('/',homeRouter)
    
    app.use('/cart',cartRouter)
}

module.exports = route
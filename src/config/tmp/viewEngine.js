
const handlebars=require('express-handlebars')
const path=require('path')
const configViewEngine=(app)=>{

    app.set('views',path.join("./src",'resources/views'))
    app.set('view engine','hbs')

    app.engine('hbs',handlebars.engine({
        extname:'.hbs'
    }
    
))}

module.exports=configViewEngine

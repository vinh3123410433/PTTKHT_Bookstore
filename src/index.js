const express = require('express')
const app = express()
const port = 3001

const configViewEngine = require('./config/viewEngine')
const configSession = require('./config/session')

const route = require('./routes')


configViewEngine(app)
configSession(app)

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

route(app)

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
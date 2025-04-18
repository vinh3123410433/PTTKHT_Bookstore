// src/config/configViewEngine.js
const expressHandlebars = require('express-handlebars');
const path = require('path');
const helpers= require

const configViewEngine = (app) => {
  const hbs = expressHandlebars.create({
    extname: '.hbs',
    defaultLayout: false,
    helpers: {
      eq: (a, b) => a === b,
      or: (...args) => {
        args.pop();
        return args.some(Boolean);
      }
    }
  });

  app.engine('hbs', hbs.engine);          
  app.set('view engine', 'hbs');          
  app.set('views', path.join(__dirname, '../resources/views'));  // ✅ ĐÚNG đường dẫn
};

module.exports = configViewEngine;

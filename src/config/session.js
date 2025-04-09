// npm install express-session session-file-store

const session = require('express-session');
const FileStore = require('session-file-store')(session);

const configSession = (app) => {
  app.use(session({
    store: new FileStore({}),
    secret: 'yennhicute',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: 'lax'
    }
  }));
};

module.exports = configSession;

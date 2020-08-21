//require defult modules
const express = require('express')
const exphds = require('express-handlebars')
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
require("dotenv").config();
const app = express()
const routes = require("./routes");
const usePassport = require("./config/passport");
const methodOverride = require('method-override');

//require db
require("./config/db");
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));


usePassport(app);
app.use(methodOverride("_method"));


// view engin
app.engine('handlebars', exphds({ 
  defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

/// require body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set up flash message
app.use(flash());
app.use((req, res, next)=>{
  res.locals.user = req.user;
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.success_msg = req.flash('success_msg');
  res.locals.warning_msg = req.flash('warning_msg');
  next();
})
app.use(routes);

// server start
const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`Serve Start on PORT ${PORT}`);
})
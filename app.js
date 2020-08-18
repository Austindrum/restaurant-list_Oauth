//require defult modules
const express = require('express')
const exphds = require('express-handlebars')
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
require("dotenv").config();
const app = express()
const routes = require("./routes");

//require db
require("./config/db");
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));

//view engin
app.engine('handlebars', exphds({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

///require body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//set up flash message
app.use(flash());
app.use((req, res, next)=>{
  res.locals.user = req.user;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.warning_msg = req.flash('warning_msg');
  next();
})

app.use(routes);

// server start
const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`Serve Start on PORT ${PORT}`);
})
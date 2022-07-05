const express = require("express");
const mongoose = require("mongoose");
const path = require("path"); 
const config = require("./config/database");
const homeroutes= require("./routes/houseroutes");
const registerroutes= require("./routes/registerroutes");
const loginroutes = require("./routes/loginroutes");
const purchasesroutes = require("./routes/purchaseroutes");
const salesroutes = require("./routes/saleroutes");
const salelistroutes = require("./routes/saleslistroute");
const purchaselistroute = require("./routes/purchaselistroute");
// instantiating server
const app = express();
const passport = require("passport");
const Signup = require("./models/Signup")

// setting up mongoose
require("dotenv").config();
//connect mongoose
mongoose.connect(config.database,{ useNewUrlParser: true });
const db = mongoose.connection;

// Check connection
db.once('open', function(){

  console.log('Connected to MongoDB');
});
// Check for db errors
db.on('error', function(err){
  console.error(err);
});


//express sesssion
const expressSession = require('express-session')({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
});

// views settings or configurations
app.set('view engine', 'pug');
app.set('views', './views');

// middle ware
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession);

app.use(passport.initialize());
app.use(passport.session());
passport.use(Signup.createStrategy());
passport.serializeUser(Signup.serializeUser());
passport.deserializeUser(Signup.deserializeUser());


// const loginchecker = function(res,req,next){
//   if(req.path != "/login" && req.path!= "/"  && !req.session.user){
//     res.redirect("/");
//   }
// next()
// }
// const loginchecker = function(res, req, next){
//     if(req.path != '/login' && req.path != '/' && !req.session.user){
//       res.redirect ('/')
//     }
//     next()
//   }
  
// app.use(loginchecker)
// // routes

app.use('/', homeroutes)
app.use('/', registerroutes)
app.use('/', loginroutes)
app.use('/', salesroutes)
app.use('/', purchasesroutes)
app.use('/', salelistroutes)
app.use('/', purchaselistroute)
// handling non existing routes
app.get('*', (req, res)=> {
  res.status(404).send('OOPS! WRONG ADDRESS')
})

// server
app.listen(3002, ()=> console.log("Listening on Port 3002"));

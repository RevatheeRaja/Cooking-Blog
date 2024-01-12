//import all modules that are required using require
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
//file upload
const fileUpload = require('express-fileupload');
//success or error flashes for the form
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express();

//port initalization
const port = process.env.PORT || 1000;

//configure dotenv
require('dotenv').config();
//middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(expressLayouts);


app.use(cookieParser('CookingBlogSecure'));
app.use(session({
    secret: 'CookingBlogSecretSecure',
    saveUninitialized: true,
    resave: true
}))
app.use(flash());
app.use(fileUpload());


//this is where the layouts are saved
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

//route

const routes = require('./server/routes/recipeRoutes.js');
app.use('/', routes);

//listen to PORT
app.listen(port, ()=> console.log(`Listening to the port ${port}`));



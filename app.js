const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyPaser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const {mongoDbUrl} = require('./config/database');
const passport = require('passport');

 mongoose.Promise = global.Promise;

//Connecting to the mongodb database
mongoose.connect(mongoDbUrl).then((db)=>{
    console.log('MONGO connected!');
}).catch(error=> console.log(error));

//Accepting static file/pages, in this case, the css and js pages(middleware)
app.use(express.static(path.join(__dirname,'public')));
//Registering the function 'select' and 'GenerateTime' in the handlebars-helpers
const {select, generateDate, commentCounter, paginate} = require('./helpers/handlebars-helpers');

//Setting up and specifying the template engine to be used
//defaultLayout: is a key and it used to set the default home page
//
app.engine('handlebars',exphbs({defaultLayout: 'home', helpers: {select: select, generateDate: generateDate, commentCounter: commentCounter, paginate: paginate}}));
//setting our view engine for the application. Letting the application know the type of engine
app.set('view engine','handlebars');

//Uploading middleware for uploading files
app.use(upload());

//Body Paser
app.use(bodyPaser.urlencoded({extended: true}));
app.use(bodyPaser.json());
//Method Override for put request
app.use(methodOverride('_method'));

//Sessions Middleware
app.use(session({
    secret: 'edem123',
    resave: true,
    saveUninitialized: true
}));

//Middleware for flash
app.use(flash());
//Middleware for passport
app.use(passport.initialize());
app.use(passport.session());
//Local variables using middleware
app.use((req, res, next)=>{
    //User session
    res.locals.user = req.user || null;
    //Success message local variable
   res.locals.success_message = req.flash('success_message');
   //Error message local variable
   res.locals.error_message = req.flash('error_message');
   //Error message for login
   res.locals.error = req.flash('error');
   next();
});

//Loading routes
const home = require('./routes/home/index'); //Including our routes in home/post.handlebars
const admin = require('./routes/admin/index'); //Including our routes in admin/post.handlebars
const posts = require('./routes/admin/posts'); //Including our routes in admin/post.handlebars
const categories = require('./routes/admin/categories'); //Including our routes in admin/categories.handlebars
const comments = require('./routes/admin/comments'); //Including our routes in admin/comments.handlebars

//Using routes
app.use('/',home);  //Using middleware to execute our home/post.handlebars routes whenever a user accesses our root directory.
app.use('/admin',admin);  //Using middleware to execute our admin/post.handlebars routes whenever a user accesses our admin root directory.
app.use('/admin/posts',posts);  //Using middleware to execute our admin/posts.js routes whenever a user accesses our admin root directory.
app.use('/admin/categories',categories);  //Using middleware to execute our admin/categories.js routes whenever a user accesses our admin root directory.
app.use('/admin/comments',comments);  //Using middleware to execute our admin/comments.js routes whenever a user accesses our admin root directory.

app.listen(4500, ()=>{
    console.log(`listen on port 4500`);
});
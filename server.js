require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// EJS setup
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout'); // This line specifies the default layout file

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Flash messages.ejs
app.use(flash());
const methodOverride = require('method-override');

// Add these middleware configurations
app.use(methodOverride('_method'));

// Global variables middleware - add this after flash middleware
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes

app.use('/', require('./routes/authRoutes'));
app.use('/posts', require('./routes/postRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const requireAuth = require('./middleware/authMiddleware');

//App initialised
const app = express();

// middleware
app.use(express.static('public'));
app.use(cookieParser());
//Body parser
app.use(express.json());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb://localhost:27017/userAuth';
mongoose.connect(dbURI, { useNewUrlParser: true})
  .then((result) => {app.listen(5000); console.log("Db connected and Server up and running on port: 5000")})
  .catch((err) => console.log(err));

// routes
app.use(authRoutes);

//cookies
// app.get('/set-cookies', (request, response) => {
//   response.cookie('Cookie', "New-String");
//   response.cookie('isEmployee', false, {httpOnly: true});//maxAge in ms , secure for https
//   //Properties object for cookies can have many options

//   response.send("Created a cookie!");
// });

// app.get('/read-cookies', (request, response) => {
//   const cookies = request.cookies;
//   console.log(cookies.Cookie);

//   response.json(cookies);
// });
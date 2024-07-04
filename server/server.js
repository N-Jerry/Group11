//use .env
require('dotenv').config()

//schuders
require('./schedulers/isSessionCreated')

//port and connnection string fron .env
const PORT = process.env.PORT;

//require modules
const express = require('express')
const cors = require('cors')
const path = require('path')

const bodyParser = require('body-parser')

//require middlwewares
const {logger} = require('./middlewares/logEvents');
const {errorHandler} = require('./middlewares/errorHandler');
const corsOptions = require('./config/corsOptions')

// Import database connection
const dbConnection = require('./config/db');

//creating express app
const app = express();

//app middleware
app.use(cors(corsOptions));
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true, }))
app.use(logger)
app.use(errorHandler)


// Wait for database connection to be established before starting the server
dbConnection.then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

//make Assets folder accessible to the browser 
app.use('/api/assets/images', express.static(path.join(__dirname, 'assets/images')));
app.use('/api/assets/files', express.static(path.join(__dirname, 'assets/files')));

app.get('/api/main', (req, res) => {
  res.json({
    message: 'Welcome to  api'
  })
});

//auth routes
app.use('/api/auth', require('./routes/authRoutes'))

//main routes
app.use('/api/main', require('./routes/courseRoutes'))
app.use('/api/main', require('./routes/sessionRoutes'))
app.use('/api/main', require('./routes/notificationRoute'))


// 404 route
app.get('/404', (req, res) => {
  res.status(404).json({ 
    error: 'Resource Not Found',
    message: 'The endpoint you are trying to access does not exist or is still under development. Please check the URL and try again. If you believe this is an error, kindly report it to the administrator.'
  });
})

// 404 middleware
app.use((req, res, next) => {
  res.redirect('/404');
});

module.exports = app

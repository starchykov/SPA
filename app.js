const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middleware/error_middleware')

// Application instance
const app = express();

// Use CORS to be able to make requests from localhost to remote server
app.use(cors({credentials: true, origin: process.env.PORT}));

// Application middleware for parsing cookies in request
app.use(cookieParser());

// Application middleware for parsing http requests body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

// Define Application routes middleware
const postsRoute = require('./routes/posts_route')
const usersRouter = require('./routes/users_route')
const imageRouter = require('./routes/images_route')
const socketRouter = require('./routes/socket_route')

// Application Route Middleware
app.use('/users', usersRouter)
app.use('/posts', postsRoute)
app.use('/images', imageRouter)
app.use('/uploads', express.static('uploads'))
app.use('/socket', socketRouter)

// Middleware for errors catching
app.use(errorMiddleware)

module.exports = app;
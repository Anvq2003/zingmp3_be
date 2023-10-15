require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const admin = require('firebase-admin');
const config = require('./app/config');
const routes = require('./app/routes');

const app = express();

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(config.serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET,
});

// Connect to DB
config.database.connectDB();

// CORS
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// init routes
routes(app);

module.exports = app;

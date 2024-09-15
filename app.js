const express = require('express');
const mongoose = require('mongoose');
const postRoutes = require('./routes/postRoutes');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware for parsing JSON data
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect('mongodb+srv://Rohitblog:Rohit%408788@blogbackend.wy4gt.mongodb.net/Node-API?retryWrites=true&w=majority&appName=blogBackend')
  .then(() => {
    console.log("Connected to database!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  });
// API Routes
app.use('/api/posts', postRoutes);


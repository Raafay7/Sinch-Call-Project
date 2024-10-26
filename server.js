const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const personRoutes = require('./routes/personRoutes'); // Import person routes
const makeCall = require('./api/makeCall'); // Import your call logic
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests

// Routes
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Authentication routes
app.use('/auth', authRoutes); // Use the auth routes for '/auth'

// Person routes
app.use('/api/person', personRoutes); // Add the person routes for CRUD operations

// Make call route
app.post('/api/makeCall', makeCall); // Make call route

// Serve static files (if your React frontend is built)
app.use(express.static('public'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

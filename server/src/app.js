require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

// Import routes
const formRoutes = require('./routes/formRoutes');
const fieldRoutes = require('./routes/fieldRoutes');
const submissionRoutes = require('./routes/submissionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check & Base API route
app.get(['/api', '/api/health'], (req, res) => {
  res.json({ success: true, message: 'Welcome to Form Management API 🚀' });
});

// Routes
app.use('/api/forms', formRoutes);
app.use('/api/forms/:id/fields', fieldRoutes);
app.use('/api', submissionRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
});

module.exports = app;

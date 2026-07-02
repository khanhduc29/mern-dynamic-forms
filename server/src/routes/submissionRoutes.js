const express = require('express');
const router = express.Router();
const {
  submitForm,
  getSubmissions,
} = require('../controllers/submissionController');

// Submit form
router.post('/forms/:id/submit', submitForm);

// Xem danh sách submissions
router.get('/submissions', getSubmissions);

module.exports = router;

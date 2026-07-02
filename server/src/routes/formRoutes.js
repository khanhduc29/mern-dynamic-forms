const express = require('express');
const router = express.Router();
const {
  getForms,
  getFormById,
  createForm,
  updateForm,
  deleteForm,
  getActiveForms,
} = require('../controllers/formController');

// GET /api/forms/active phải đặt TRƯỚC /api/forms/:id
// để tránh "active" bị match như :id
router.get('/active', getActiveForms);

router.route('/')
  .get(getForms)
  .post(createForm);

router.route('/:id')
  .get(getFormById)
  .put(updateForm)
  .delete(deleteForm);

module.exports = router;

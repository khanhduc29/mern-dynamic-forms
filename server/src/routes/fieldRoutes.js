const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  addField,
  updateField,
  deleteField,
} = require('../controllers/fieldController');

router.route('/')
  .post(addField);

router.route('/:fid')
  .put(updateField)
  .delete(deleteField);

module.exports = router;

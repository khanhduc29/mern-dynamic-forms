const Form = require('../models/Form');
const { ApiError } = require('../middlewares/errorHandler');

/**
 * @desc    Thêm field vào form
 * @route   POST /api/forms/:id/fields
 */
const addField = async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      throw new ApiError(404, 'NOT_FOUND', 'Không tìm thấy form');
    }

    const { label, type, order, required, options, validation } = req.body;

    if (!label || !type) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Label và type là bắt buộc');
    }

    // Validate select type phải có options
    if (type === 'select' && (!options || options.length === 0)) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Select field phải có ít nhất 1 option');
    }

    const newField = {
      label,
      type,
      order: order !== undefined ? order : form.fields.length,
      required: required || false,
      options: type === 'select' ? options : undefined,
      validation: validation || {},
    };

    form.fields.push(newField);
    await form.save();

    // Trả về field vừa thêm
    const addedField = form.fields[form.fields.length - 1];

    res.status(201).json({
      success: true,
      data: addedField,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cập nhật field
 * @route   PUT /api/forms/:id/fields/:fid
 */
const updateField = async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      throw new ApiError(404, 'NOT_FOUND', 'Không tìm thấy form');
    }

    const field = form.fields.id(req.params.fid);

    if (!field) {
      throw new ApiError(404, 'NOT_FOUND', 'Không tìm thấy field');
    }

    const { label, type, order, required, options, validation } = req.body;

    if (label !== undefined) field.label = label;
    if (type !== undefined) {
      field.type = type;
      // Reset options nếu đổi type khác select
      if (type !== 'select') {
        field.options = undefined;
      }
    }
    if (order !== undefined) field.order = order;
    if (required !== undefined) field.required = required;
    if (options !== undefined) field.options = options;
    if (validation !== undefined) field.validation = validation;

    // Validate select type phải có options
    if (field.type === 'select' && (!field.options || field.options.length === 0)) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Select field phải có ít nhất 1 option');
    }

    await form.save();

    res.json({
      success: true,
      data: field,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Xóa field
 * @route   DELETE /api/forms/:id/fields/:fid
 */
const deleteField = async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      throw new ApiError(404, 'NOT_FOUND', 'Không tìm thấy form');
    }

    const field = form.fields.id(req.params.fid);

    if (!field) {
      throw new ApiError(404, 'NOT_FOUND', 'Không tìm thấy field');
    }

    form.fields.pull(req.params.fid);
    await form.save();

    res.json({
      success: true,
      message: 'Đã xóa field thành công',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addField,
  updateField,
  deleteField,
};

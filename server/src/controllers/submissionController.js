const Form = require('../models/Form');
const Submission = require('../models/Submission');
const { validateSubmission } = require('../validators/fieldValidator');
const { ApiError } = require('../middlewares/errorHandler');

/**
 * @desc    Nhân viên submit form
 * @route   POST /api/forms/:id/submit
 */
const submitForm = async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      throw new ApiError(404, 'NOT_FOUND', 'Không tìm thấy form');
    }

    if (form.status !== 'active') {
      throw new ApiError(400, 'FORM_INACTIVE', 'Form này chưa được kích hoạt');
    }

    if (form.fields.length === 0) {
      throw new ApiError(400, 'NO_FIELDS', 'Form chưa có field nào');
    }

    const { data } = req.body;

    if (!data || typeof data !== 'object') {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Dữ liệu submission không hợp lệ');
    }

    // Validate dữ liệu submission bằng validator module
    const validationResult = validateSubmission(data, form.fields);

    if (!validationResult.isValid) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Dữ liệu không hợp lệ', validationResult.errors);
    }

    // Lưu submission
    const submission = await Submission.create({
      formId: form._id,
      formTitle: form.title,
      data,
    });

    res.status(201).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Xem lại danh sách submissions
 * @route   GET /api/submissions
 * @query   formId, page, limit
 */
const getSubmissions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.formId) {
      filter.formId = req.query.formId;
    }

    const [submissions, total] = await Promise.all([
      Submission.find(filter)
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Submission.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: submissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitForm,
  getSubmissions,
};

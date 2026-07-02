const Form = require('../models/Form');
const { ApiError } = require('../middlewares/errorHandler');

/**
 * @desc    Lấy danh sách tất cả form (có pagination)
 * @route   GET /api/forms
 * @query   page, limit, status
 */
const getForms = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const [forms, total] = await Promise.all([
      Form.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Form.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: forms,
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

/**
 * @desc    Lấy chi tiết 1 form (kèm danh sách field)
 * @route   GET /api/forms/:id
 */
const getFormById = async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      throw new ApiError(404, 'NOT_FOUND', 'Không tìm thấy form');
    }

    // Sắp xếp fields theo order
    form.fields.sort((a, b) => a.order - b.order);

    res.json({
      success: true,
      data: form,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Tạo form mới
 * @route   POST /api/forms
 */
const createForm = async (req, res, next) => {
  try {
    const { title, description, order, status } = req.body;

    const form = await Form.create({
      title,
      description,
      order: order || 0,
      status: status || 'draft',
      fields: [],
    });

    res.status(201).json({
      success: true,
      data: form,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cập nhật thông tin form
 * @route   PUT /api/forms/:id
 */
const updateForm = async (req, res, next) => {
  try {
    const { title, description, order, status } = req.body;

    const form = await Form.findById(req.params.id);

    if (!form) {
      throw new ApiError(404, 'NOT_FOUND', 'Không tìm thấy form');
    }

    if (title !== undefined) form.title = title;
    if (description !== undefined) form.description = description;
    if (order !== undefined) form.order = order;
    if (status !== undefined) form.status = status;

    await form.save();

    res.json({
      success: true,
      data: form,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Xóa form
 * @route   DELETE /api/forms/:id
 */
const deleteForm = async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      throw new ApiError(404, 'NOT_FOUND', 'Không tìm thấy form');
    }

    await Form.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Đã xóa form thành công',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy danh sách form active, sắp theo thứ tự
 * @route   GET /api/forms/active
 */
const getActiveForms = async (req, res, next) => {
  try {
    const forms = await Form.find({ status: 'active' })
      .sort({ order: 1 })
      .lean();

    res.json({
      success: true,
      data: forms,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getForms,
  getFormById,
  createForm,
  updateForm,
  deleteForm,
  getActiveForms,
};

/**
 * Error Handler Middleware
 * 
 * Xử lý lỗi thống nhất cho toàn bộ API.
 * Format response lỗi chuẩn.
 */

// Custom API Error class
class ApiError extends Error {
  constructor(statusCode, code, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

// 404 Not Found handler
const notFound = (req, res, next) => {
  const error = new ApiError(404, 'NOT_FOUND', `Không tìm thấy: ${req.originalUrl}`);
  next(error);
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let code = err.code || 'INTERNAL_ERROR';
  let message = err.message || 'Lỗi hệ thống';
  let details = err.details || null;

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Dữ liệu không hợp lệ';
    details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    code = 'INVALID_ID';
    message = `ID không hợp lệ: ${err.value}`;
  }

  // Handle duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    code = 'DUPLICATE_KEY';
    message = 'Dữ liệu đã tồn tại';
    const field = Object.keys(err.keyValue)[0];
    details = [{ field, message: `${field} đã tồn tại` }];
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  });
};

module.exports = { ApiError, notFound, errorHandler };

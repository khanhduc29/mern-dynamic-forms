/**
 * Field Validator Module
 * 
 * Tách logic validate thành module riêng để dễ test và mở rộng.
 * Mỗi loại field có hàm validate riêng.
 */

/**
 * Validate giá trị text
 * - Bắt buộc điền (nếu required)
 * - Tối đa 200 ký tự (hoặc theo maxLength config)
 */
function validateText(value, field) {
  const errors = [];
  const maxLength = field.validation?.maxLength || 200;

  if (field.required && (!value || String(value).trim() === '')) {
    errors.push(`${field.label} là bắt buộc`);
    return errors;
  }

  if (value && String(value).length > maxLength) {
    errors.push(`${field.label} không được quá ${maxLength} ký tự`);
  }

  return errors;
}

/**
 * Validate giá trị number
 * - Bắt buộc điền (nếu required)
 * - Giá trị từ min đến max (mặc định 0-100)
 */
function validateNumber(value, field) {
  const errors = [];
  const min = field.validation?.min ?? 0;
  const max = field.validation?.max ?? 100;

  if (field.required && (value === null || value === undefined || value === '')) {
    errors.push(`${field.label} là bắt buộc`);
    return errors;
  }

  if (value !== null && value !== undefined && value !== '') {
    const num = Number(value);
    if (isNaN(num)) {
      errors.push(`${field.label} phải là số`);
    } else if (num < min || num > max) {
      errors.push(`${field.label} phải có giá trị từ ${min} đến ${max}`);
    }
  }

  return errors;
}

/**
 * Validate giá trị date
 * - Bắt buộc điền (nếu required)
 * - Không được chọn ngày quá khứ
 */
function validateDate(value, field) {
  const errors = [];

  if (field.required && (!value || String(value).trim() === '')) {
    errors.push(`${field.label} là bắt buộc`);
    return errors;
  }

  if (value) {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      errors.push(`${field.label} không phải ngày hợp lệ`);
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        errors.push(`${field.label} không được chọn ngày quá khứ`);
      }
    }
  }

  return errors;
}

/**
 * Validate giá trị color
 * - Bắt buộc điền (nếu required)
 * - Phải là mã HEX hợp lệ (#RRGGBB)
 */
function validateColor(value, field) {
  const errors = [];
  const hexRegex = /^#[0-9A-Fa-f]{6}$/;

  if (field.required && (!value || String(value).trim() === '')) {
    errors.push(`${field.label} là bắt buộc`);
    return errors;
  }

  if (value && !hexRegex.test(value)) {
    errors.push(`${field.label} phải là mã màu HEX hợp lệ (ví dụ: #FF5733)`);
  }

  return errors;
}

/**
 * Validate giá trị select
 * - Bắt buộc điền (nếu required)
 * - Phải chọn 1 trong các option cho sẵn
 */
function validateSelect(value, field) {
  const errors = [];

  if (field.required && (!value || String(value).trim() === '')) {
    errors.push(`${field.label} là bắt buộc`);
    return errors;
  }

  if (value && field.options && !field.options.includes(value)) {
    errors.push(`${field.label} phải chọn 1 trong: ${field.options.join(', ')}`);
  }

  return errors;
}

/**
 * Validate một field dựa trên type
 */
function validateField(value, field) {
  switch (field.type) {
    case 'text':
      return validateText(value, field);
    case 'number':
      return validateNumber(value, field);
    case 'date':
      return validateDate(value, field);
    case 'color':
      return validateColor(value, field);
    case 'select':
      return validateSelect(value, field);
    default:
      return [`Loại field "${field.type}" không được hỗ trợ`];
  }
}

/**
 * Validate toàn bộ submission
 * @param {Object} data - { fieldId: value }
 * @param {Array} fields - danh sách field definitions
 * @returns {{ isValid: boolean, errors: Array }}
 */
function validateSubmission(data, fields) {
  const allErrors = [];

  for (const field of fields) {
    const fieldId = field._id.toString();
    const value = data[fieldId];
    const errors = validateField(value, field);

    if (errors.length > 0) {
      allErrors.push({
        fieldId,
        fieldLabel: field.label,
        messages: errors,
      });
    }
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}

module.exports = {
  validateText,
  validateNumber,
  validateDate,
  validateColor,
  validateSelect,
  validateField,
  validateSubmission,
};

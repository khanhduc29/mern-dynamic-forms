const {
  validateText,
  validateNumber,
  validateDate,
  validateColor,
  validateSelect,
  validateSubmission,
} = require('../src/validators/fieldValidator');

describe('Field Validator', () => {
  // ============ TEXT ============
  describe('validateText', () => {
    const field = { label: 'Họ tên', type: 'text', required: true, validation: { maxLength: 200 } };

    test('should pass with valid text', () => {
      expect(validateText('Nguyễn Văn A', field)).toEqual([]);
    });

    test('should fail when required and empty', () => {
      const errors = validateText('', field);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('bắt buộc');
    });

    test('should fail when text exceeds maxLength', () => {
      const longText = 'a'.repeat(201);
      const errors = validateText(longText, field);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('200');
    });

    test('should pass when not required and empty', () => {
      const optionalField = { ...field, required: false };
      expect(validateText('', optionalField)).toEqual([]);
    });
  });

  // ============ NUMBER ============
  describe('validateNumber', () => {
    const field = { label: 'Điểm', type: 'number', required: true, validation: { min: 0, max: 100 } };

    test('should pass with valid number', () => {
      expect(validateNumber(50, field)).toEqual([]);
    });

    test('should pass with 0 (min boundary)', () => {
      expect(validateNumber(0, field)).toEqual([]);
    });

    test('should pass with 100 (max boundary)', () => {
      expect(validateNumber(100, field)).toEqual([]);
    });

    test('should fail when below min', () => {
      const errors = validateNumber(-1, field);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('0');
    });

    test('should fail when above max', () => {
      const errors = validateNumber(101, field);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('100');
    });

    test('should fail when not a number', () => {
      const errors = validateNumber('abc', field);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('số');
    });

    test('should fail when required and empty', () => {
      const errors = validateNumber('', field);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('bắt buộc');
    });
  });

  // ============ DATE ============
  describe('validateDate', () => {
    const field = { label: 'Ngày bắt đầu', type: 'date', required: true };

    test('should pass with future date', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      expect(validateDate(futureDate.toISOString(), field)).toEqual([]);
    });

    test('should pass with today', () => {
      const today = new Date().toISOString().split('T')[0];
      expect(validateDate(today, field)).toEqual([]);
    });

    test('should fail with past date', () => {
      const errors = validateDate('2020-01-01', field);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('quá khứ');
    });

    test('should fail with invalid date', () => {
      const errors = validateDate('not-a-date', field);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('hợp lệ');
    });

    test('should fail when required and empty', () => {
      const errors = validateDate('', field);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('bắt buộc');
    });
  });

  // ============ COLOR ============
  describe('validateColor', () => {
    const field = { label: 'Màu sắc', type: 'color', required: true };

    test('should pass with valid hex color', () => {
      expect(validateColor('#FF5733', field)).toEqual([]);
    });

    test('should pass with lowercase hex', () => {
      expect(validateColor('#ff5733', field)).toEqual([]);
    });

    test('should fail with invalid hex (no #)', () => {
      const errors = validateColor('FF5733', field);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('HEX');
    });

    test('should fail with short hex (#FFF)', () => {
      const errors = validateColor('#FFF', field);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('HEX');
    });

    test('should fail with invalid characters', () => {
      const errors = validateColor('#GGGGGG', field);
      expect(errors).toHaveLength(1);
    });

    test('should fail when required and empty', () => {
      const errors = validateColor('', field);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('bắt buộc');
    });
  });

  // ============ SELECT ============
  describe('validateSelect', () => {
    const field = {
      label: 'Phòng ban',
      type: 'select',
      required: true,
      options: ['IT', 'HR', 'Marketing'],
    };

    test('should pass with valid option', () => {
      expect(validateSelect('IT', field)).toEqual([]);
    });

    test('should fail with option not in list', () => {
      const errors = validateSelect('Finance', field);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('chọn 1 trong');
    });

    test('should fail when required and empty', () => {
      const errors = validateSelect('', field);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('bắt buộc');
    });
  });

  // ============ SUBMISSION ============
  describe('validateSubmission', () => {
    const fields = [
      { _id: { toString: () => 'f1' }, label: 'Tên', type: 'text', required: true, validation: { maxLength: 200 } },
      { _id: { toString: () => 'f2' }, label: 'Tuổi', type: 'number', required: true, validation: { min: 0, max: 100 } },
      { _id: { toString: () => 'f3' }, label: 'Màu', type: 'color', required: false },
    ];

    test('should pass with all valid data', () => {
      const data = { f1: 'Test Name', f2: 25, f3: '#FF0000' };
      const result = validateSubmission(data, fields);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should fail with missing required fields', () => {
      const data = { f1: '', f2: '', f3: '' };
      const result = validateSubmission(data, fields);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2); // f1 and f2 are required
    });

    test('should pass when optional field is empty', () => {
      const data = { f1: 'Test', f2: 50 };
      const result = validateSubmission(data, fields);
      expect(result.isValid).toBe(true);
    });

    test('should collect errors from multiple fields', () => {
      const data = { f1: 'a'.repeat(201), f2: 200, f3: 'invalid' };
      const result = validateSubmission(data, fields);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });
  });
});

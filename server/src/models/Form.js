const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  label: {
    type: String,
    required: [true, 'Label là bắt buộc'],
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'Type là bắt buộc'],
    enum: {
      values: ['text', 'number', 'date', 'color', 'select'],
      message: 'Type phải là: text, number, date, color, hoặc select',
    },
  },
  order: {
    type: Number,
    default: 0,
  },
  required: {
    type: Boolean,
    default: false,
  },
  options: {
    type: [String],
    default: undefined,
    validate: {
      validator: function (v) {
        // options chỉ bắt buộc khi type = select
        if (this.type === 'select') {
          return v && v.length > 0;
        }
        return true;
      },
      message: 'Select field phải có ít nhất 1 option',
    },
  },
  validation: {
    maxLength: { type: Number, default: 200 },   // cho text
    min: { type: Number, default: 0 },            // cho number
    max: { type: Number, default: 100 },          // cho number
  },
}, { _id: true });

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tên form là bắt buộc'],
    trim: true,
    maxlength: [200, 'Tên form không được quá 200 ký tự'],
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  order: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'draft'],
      message: 'Status phải là active hoặc draft',
    },
    default: 'draft',
  },
  fields: [fieldSchema],
}, {
  timestamps: true,
});

// Index để sắp xếp theo order
formSchema.index({ order: 1 });
formSchema.index({ status: 1, order: 1 });

module.exports = mongoose.model('Form', formSchema);

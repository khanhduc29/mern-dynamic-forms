const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: [true, 'Form ID là bắt buộc'],
  },
  formTitle: {
    type: String,
    required: true,
  },
  data: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: [true, 'Dữ liệu submission là bắt buộc'],
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index để query theo formId
submissionSchema.index({ formId: 1 });
submissionSchema.index({ submittedAt: -1 });

module.exports = mongoose.model('Submission', submissionSchema);

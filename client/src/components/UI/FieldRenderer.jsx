import { useState } from 'react';

export default function FieldRenderer({ field, value, onChange, error }) {
  const handleChange = (val) => {
    onChange(field._id, val);
  };

  switch (field.type) {
    case 'text':
      return (
        <div className="form-group">
          <label className="form-label">
            {field.label}
            {field.required && <span className="required">*</span>}
          </label>
          <input
            type="text"
            className={`form-input ${error ? 'error' : ''}`}
            value={value || ''}
            onChange={e => handleChange(e.target.value)}
            placeholder={`Nhập ${field.label.toLowerCase()}`}
            maxLength={field.validation?.maxLength || 200}
          />
          {error && <div className="form-error">⚠ {error}</div>}
        </div>
      );

    case 'number':
      return (
        <div className="form-group">
          <label className="form-label">
            {field.label}
            {field.required && <span className="required">*</span>}
          </label>
          <input
            type="number"
            className={`form-input ${error ? 'error' : ''}`}
            value={value ?? ''}
            onChange={e => handleChange(e.target.value)}
            min={field.validation?.min ?? 0}
            max={field.validation?.max ?? 100}
            placeholder={`Nhập số (${field.validation?.min ?? 0} - ${field.validation?.max ?? 100})`}
          />
          {error && <div className="form-error">⚠ {error}</div>}
        </div>
      );

    case 'date':
      return (
        <div className="form-group">
          <label className="form-label">
            {field.label}
            {field.required && <span className="required">*</span>}
          </label>
          <input
            type="date"
            className={`form-input ${error ? 'error' : ''}`}
            value={value || ''}
            onChange={e => handleChange(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
          {error && <div className="form-error">⚠ {error}</div>}
        </div>
      );

    case 'color':
      return (
        <div className="form-group">
          <label className="form-label">
            {field.label}
            {field.required && <span className="required">*</span>}
          </label>
          <div className="color-input-wrapper">
            <input
              type="color"
              value={value || '#6c63ff'}
              onChange={e => handleChange(e.target.value)}
            />
            <input
              type="text"
              className={`form-input ${error ? 'error' : ''}`}
              value={value || ''}
              onChange={e => handleChange(e.target.value)}
              placeholder="#RRGGBB"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
          </div>
          {error && <div className="form-error">⚠ {error}</div>}
        </div>
      );

    case 'select':
      return (
        <div className="form-group">
          <label className="form-label">
            {field.label}
            {field.required && <span className="required">*</span>}
          </label>
          <select
            className={`form-select ${error ? 'error' : ''}`}
            value={value || ''}
            onChange={e => handleChange(e.target.value)}
          >
            <option value="">-- Chọn --</option>
            {(field.options || []).map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
          {error && <div className="form-error">⚠ {error}</div>}
        </div>
      );

    default:
      return <div>Loại field không hỗ trợ: {field.type}</div>;
  }
}

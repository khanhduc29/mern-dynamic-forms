import { useState, useEffect } from 'react';
import { formAPI, fieldAPI } from '../../api/api';
import toast from 'react-hot-toast';
import Modal from '../UI/Modal';

const FIELD_TYPES = [
  { value: 'text', label: 'Text', icon: '📝' },
  { value: 'number', label: 'Number', icon: '🔢' },
  { value: 'date', label: 'Date', icon: '📅' },
  { value: 'color', label: 'Color', icon: '🎨' },
  { value: 'select', label: 'Select', icon: '📋' },
];

export default function FieldEditor({ form, onBack }) {
  const [currentForm, setCurrentForm] = useState(form);
  const [showModal, setShowModal] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [fieldData, setFieldData] = useState({
    label: '', type: 'text', order: 0, required: false, options: [], validation: {}
  });
  const [optionInput, setOptionInput] = useState('');

  const reload = async () => {
    try {
      const res = await formAPI.getById(form._id);
      setCurrentForm(res.data.data);
    } catch (err) {
      toast.error('Lỗi tải form');
    }
  };

  useEffect(() => { reload(); }, []);

  const openCreate = () => {
    setEditingField(null);
    setFieldData({
      label: '', type: 'text',
      order: (currentForm.fields?.length || 0),
      required: false, options: [],
      validation: { maxLength: 200, min: 0, max: 100 }
    });
    setOptionInput('');
    setShowModal(true);
  };

  const openEdit = (field) => {
    setEditingField(field);
    setFieldData({
      label: field.label,
      type: field.type,
      order: field.order,
      required: field.required,
      options: field.options || [],
      validation: field.validation || {},
    });
    setOptionInput('');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!fieldData.label.trim()) {
      toast.error('Label là bắt buộc');
      return;
    }
    if (fieldData.type === 'select' && fieldData.options.length === 0) {
      toast.error('Select field cần ít nhất 1 option');
      return;
    }
    try {
      const payload = { ...fieldData };
      if (payload.type !== 'select') delete payload.options;

      if (editingField) {
        await fieldAPI.update(form._id, editingField._id, payload);
        toast.success('Đã cập nhật field');
      } else {
        await fieldAPI.add(form._id, payload);
        toast.success('Đã thêm field');
      }
      setShowModal(false);
      reload();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Lỗi lưu field');
    }
  };

  const handleDelete = async (fieldId) => {
    if (!confirm('Xóa field này?')) return;
    try {
      await fieldAPI.delete(form._id, fieldId);
      toast.success('Đã xóa field');
      reload();
    } catch (err) {
      toast.error('Lỗi xóa field');
    }
  };

  const addOption = () => {
    if (optionInput.trim() && !fieldData.options.includes(optionInput.trim())) {
      setFieldData({ ...fieldData, options: [...fieldData.options, optionInput.trim()] });
      setOptionInput('');
    }
  };

  const removeOption = (opt) => {
    setFieldData({ ...fieldData, options: fieldData.options.filter(o => o !== opt) });
  };

  const fields = (currentForm.fields || []).sort((a, b) => a.order - b.order);

  return (
    <div className="page-container">
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button className="btn btn-secondary btn-sm" onClick={onBack}>← Quay lại</button>
          <h1 className="header-title">Fields: {currentForm.title}</h1>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={openCreate}>✚ Thêm Field</button>
        </div>
      </div>

      <div style={{ padding: '24px 0' }}>
        {fields.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">⚙</div>
              <div className="empty-state-title">Chưa có field nào</div>
              <div className="empty-state-text">Thêm field để form có thể sử dụng</div>
              <button className="btn btn-primary" onClick={openCreate}>✚ Thêm Field</button>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="card-body">
              {fields.map(field => (
                <div key={field._id} className="field-item">
                  <div className="field-item-info">
                    <div className="field-item-order">{field.order}</div>
                    <span style={{ fontSize: 18 }}>{FIELD_TYPES.find(t => t.value === field.type)?.icon || '📝'}</span>
                    <div>
                      <div className="field-item-label">
                        {field.label}
                        {field.required && <span style={{ color: 'var(--danger)', marginLeft: 4, fontSize: 12 }}>bắt buộc</span>}
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                        <span className="field-item-type">{field.type}</span>
                        {field.type === 'select' && field.options && (
                          <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                            {field.options.length} options
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="field-item-actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(field)}>✎ Sửa</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(field._id)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingField ? 'Sửa Field' : 'Thêm Field mới'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
            <button className="btn btn-primary" onClick={handleSave}>{editingField ? 'Cập nhật' : 'Thêm Field'}</button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Label <span className="required">*</span></label>
          <input className="form-input" value={fieldData.label} onChange={e => setFieldData({...fieldData, label: e.target.value})} placeholder="Tên hiển thị" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Loại field</label>
            <select className="form-select" value={fieldData.type} onChange={e => setFieldData({...fieldData, type: e.target.value})}>
              {FIELD_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Thứ tự</label>
            <input type="number" className="form-input" value={fieldData.order} onChange={e => setFieldData({...fieldData, order: Number(e.target.value)})} />
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-wrapper">
            <input type="checkbox" checked={fieldData.required} onChange={e => setFieldData({...fieldData, required: e.target.checked})} />
            <span>Bắt buộc điền</span>
          </label>
        </div>

        {fieldData.type === 'text' && (
          <div className="form-group">
            <label className="form-label">Độ dài tối đa</label>
            <input type="number" className="form-input" value={fieldData.validation.maxLength || 200} onChange={e => setFieldData({...fieldData, validation: {...fieldData.validation, maxLength: Number(e.target.value)}})} />
          </div>
        )}

        {fieldData.type === 'number' && (
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Giá trị tối thiểu</label>
              <input type="number" className="form-input" value={fieldData.validation.min ?? 0} onChange={e => setFieldData({...fieldData, validation: {...fieldData.validation, min: Number(e.target.value)}})} />
            </div>
            <div className="form-group">
              <label className="form-label">Giá trị tối đa</label>
              <input type="number" className="form-input" value={fieldData.validation.max ?? 100} onChange={e => setFieldData({...fieldData, validation: {...fieldData.validation, max: Number(e.target.value)}})} />
            </div>
          </div>
        )}

        {fieldData.type === 'select' && (
          <div className="form-group">
            <label className="form-label">Options <span className="required">*</span></label>
            <div className="tags-input">
              {fieldData.options.map((opt, i) => (
                <span key={i} className="tag">
                  {opt}
                  <button className="tag-remove" onClick={() => removeOption(opt)}>✕</button>
                </span>
              ))}
              <input
                value={optionInput}
                onChange={e => setOptionInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addOption(); }}}
                placeholder="Nhập option, nhấn Enter"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

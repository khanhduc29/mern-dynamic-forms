import { useState, useEffect } from 'react';
import { formAPI } from '../../api/api';
import toast from 'react-hot-toast';
import Modal from '../UI/Modal';
import FieldEditor from './FieldEditor';

export default function FormList() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [managingFields, setManagingFields] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', order: 0, status: 'draft' });

  const fetchForms = async () => {
    try {
      setLoading(true);
      const res = await formAPI.getAll({ limit: 50 });
      setForms(res.data?.data || []);
    } catch (err) {
      toast.error('Lỗi tải danh sách form');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchForms(); }, []);

  const openCreate = () => {
    setEditingForm(null);
    setFormData({ title: '', description: '', order: 0, status: 'draft' });
    setShowModal(true);
  };

  const openEdit = (form) => {
    setEditingForm(form);
    setFormData({ title: form.title, description: form.description, order: form.order, status: form.status });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Tên form là bắt buộc');
      return;
    }
    try {
      if (editingForm) {
        await formAPI.update(editingForm._id, formData);
        toast.success('Đã cập nhật form');
      } else {
        await formAPI.create(formData);
        toast.success('Đã tạo form mới');
      }
      setShowModal(false);
      fetchForms();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Lỗi lưu form');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa form này?')) return;
    try {
      await formAPI.delete(id);
      toast.success('Đã xóa form');
      fetchForms();
    } catch (err) {
      toast.error('Lỗi xóa form');
    }
  };

  const toggleStatus = async (form) => {
    try {
      const newStatus = form.status === 'active' ? 'draft' : 'active';
      await formAPI.update(form._id, { status: newStatus });
      toast.success(`Form đã chuyển sang ${newStatus}`);
      fetchForms();
    } catch (err) {
      toast.error('Lỗi cập nhật trạng thái');
    }
  };

  if (managingFields) {
    return (
      <FieldEditor
        form={managingFields}
        onBack={() => { setManagingFields(null); fetchForms(); }}
      />
    );
  }

  const activeCount = forms.filter(f => f.status === 'active').length;
  const draftCount = forms.filter(f => f.status === 'draft').length;

  return (
    <div className="page-container">
      <div className="header">
        <h1 className="header-title">Quản lý Form</h1>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={openCreate}>
            ✚ Tạo Form mới
          </button>
        </div>
      </div>

      <div style={{ padding: '24px 0' }}>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-label">Tổng form</div>
            <div className="stat-card-value">{forms.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Active</div>
            <div className="stat-card-value" style={{ background: 'linear-gradient(135deg, #00d2a0, #00b894)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>{activeCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Draft</div>
            <div className="stat-card-value" style={{ background: 'linear-gradient(135deg, #ffa726, #ff9800)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>{draftCount}</div>
          </div>
        </div>

        {loading ? (
          <div className="loading-container"><div className="spinner"></div></div>
        ) : forms.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <div className="empty-state-title">Chưa có form nào</div>
              <div className="empty-state-text">Bắt đầu tạo form đầu tiên của bạn</div>
              <button className="btn btn-primary" onClick={openCreate}>✚ Tạo Form mới</button>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Thứ tự</th>
                    <th>Tên form</th>
                    <th>Mô tả</th>
                    <th>Fields</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {forms.map(form => (
                    <tr key={form._id}>
                      <td><span className="field-item-order">{form.order}</span></td>
                      <td style={{ fontWeight: 600 }}>{form.title}</td>
                      <td style={{ color: 'var(--text-secondary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{form.description || '—'}</td>
                      <td>{form.fields?.length || 0} fields</td>
                      <td>
                        <span className={`badge badge-${form.status}`}>
                          <span className="badge-dot"></span>
                          {form.status}
                        </span>
                      </td>
                      <td>
                        <div className="actions-group">
                          <button className="btn btn-secondary btn-sm" onClick={() => setManagingFields(form)}>⚙ Fields</button>
                          <button className="btn btn-secondary btn-sm" onClick={() => openEdit(form)}>✎ Sửa</button>
                          <button className="btn btn-sm" style={{ background: form.status === 'active' ? 'var(--warning-bg)' : 'var(--success-bg)', color: form.status === 'active' ? 'var(--warning)' : 'var(--success)', border: '1px solid transparent' }} onClick={() => toggleStatus(form)}>
                            {form.status === 'active' ? '⏸ Draft' : '▶ Active'}
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(form._id)}>✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingForm ? 'Sửa Form' : 'Tạo Form mới'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
            <button className="btn btn-primary" onClick={handleSave}>
              {editingForm ? 'Cập nhật' : 'Tạo Form'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Tên form <span className="required">*</span></label>
          <input className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Nhập tên form" />
        </div>
        <div className="form-group">
          <label className="form-label">Mô tả</label>
          <textarea className="form-input form-textarea" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Mô tả ngắn về form" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Thứ tự hiển thị</label>
            <input type="number" className="form-input" value={formData.order} onChange={e => setFormData({...formData, order: Number(e.target.value)})} />
          </div>
          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select className="form-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}

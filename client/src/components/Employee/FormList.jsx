import { useState, useEffect } from 'react';
import { formAPI } from '../../api/api';
import toast from 'react-hot-toast';
import FormFill from './FormFill';

export default function EmpFormList() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await formAPI.getActive();
        setForms(res.data?.data || []);
      } catch (err) {
        toast.error('Lỗi tải danh sách form');
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  if (selectedForm) {
    return <FormFill form={selectedForm} onBack={() => setSelectedForm(null)} />;
  }

  return (
    <div className="page-container">
      <div className="header">
        <h1 className="header-title">Điền Form</h1>
      </div>

      <div style={{ padding: '24px 0' }}>
        {loading ? (
          <div className="loading-container"><div className="spinner"></div></div>
        ) : forms.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">📄</div>
              <div className="empty-state-title">Không có form nào</div>
              <div className="empty-state-text">Hiện tại chưa có form active nào để điền</div>
            </div>
          </div>
        ) : (
          <div className="form-cards-grid">
            {forms.map(form => (
              <div key={form._id} className="form-card" onClick={() => setSelectedForm(form)}>
                <div className="form-card-order">{form.order}</div>
                <div className="form-card-title">{form.title}</div>
                <div className="form-card-desc">{form.description || 'Không có mô tả'}</div>
                <div className="form-card-meta">
                  <span>📝 {form.fields?.length || 0} câu hỏi</span>
                  <span className="badge badge-active">
                    <span className="badge-dot"></span>
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

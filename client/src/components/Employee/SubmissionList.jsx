import { useState, useEffect } from 'react';
import { formAPI, submissionAPI } from '../../api/api';
import toast from 'react-hot-toast';
import Modal from '../UI/Modal';

export default function SubmissionList() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forms, setForms] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState('');
  const [viewDetail, setViewDetail] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const [subRes, formRes] = await Promise.all([
          submissionAPI.getAll({ limit: 100 }),
          formAPI.getAll({ limit: 100 })
        ]);
        setSubmissions(subRes.data?.data || []);
        setForms(formRes.data?.data || []);
      } catch (err) {
        toast.error('Lỗi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleFilter = async (formId) => {
    setSelectedFormId(formId);
    setLoading(true);
    try {
      const params = formId ? { formId, limit: 100 } : { limit: 100 };
      const res = await submissionAPI.getAll(params);
      setSubmissions(res.data?.data || []);
    } catch (err) {
      toast.error('Lỗi lọc dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const getFormFields = (formId) => {
    const form = forms.find(f => f._id === formId);
    return form ? form.fields : [];
  };

  return (
    <div className="page-container">
      <div className="header">
        <h1 className="header-title">Lịch sử nộp form</h1>
        <div className="header-actions">
          <select 
            className="form-select" 
            style={{ width: 200 }}
            value={selectedFormId}
            onChange={(e) => handleFilter(e.target.value)}
          >
            <option value="">Tất cả form</option>
            {forms.map(f => (
              <option key={f._id} value={f._id}>{f.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ padding: '24px 0' }}>
        {loading ? (
          <div className="loading-container"><div className="spinner"></div></div>
        ) : submissions.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <div className="empty-state-title">Chưa có lịch sử nộp</div>
              <div className="empty-state-text">Bạn chưa nộp bất kỳ form nào hoặc không có dữ liệu phù hợp bộ lọc</div>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Ngày nộp</th>
                    <th>Tên Form</th>
                    <th>Số lượng trường</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map(sub => (
                    <tr key={sub._id}>
                      <td>{new Date(sub.submittedAt).toLocaleString('vi-VN')}</td>
                      <td style={{ fontWeight: 500 }}>{sub.formTitle}</td>
                      <td>{Object.keys(sub.data || {}).length} trường dữ liệu</td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => setViewDetail(sub)}>
                          Xem chi tiết
                        </button>
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
        isOpen={!!viewDetail}
        onClose={() => setViewDetail(null)}
        title="Chi tiết Submit"
        large
      >
        {viewDetail && (
          <div className="submission-data">
            <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{viewDetail.formTitle}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Nộp lúc: {new Date(viewDetail.submittedAt).toLocaleString('vi-VN')}
              </p>
            </div>
            
            <div style={{ display: 'grid', gap: 12 }}>
              {getFormFields(viewDetail.formId).map(field => {
                const value = viewDetail.data[field._id];
                return (
                  <div key={field._id} className="submission-field">
                    <div className="submission-field-label">{field.label}:</div>
                    <div className="submission-field-value">
                      {field.type === 'color' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className="color-preview" style={{ background: value || 'transparent' }}></span>
                          {value || '—'}
                        </div>
                      ) : (
                        value !== undefined && value !== null && value !== '' ? String(value) : <span style={{color: 'var(--text-muted)'}}>—</span>
                      )}
                    </div>
                  </div>
                )
              })}
              {getFormFields(viewDetail.formId).length === 0 && (
                <div style={{ color: 'var(--warning)', fontSize: 13 }}>Không thể tải chi tiết câu hỏi (form có thể đã bị xóa hoặc đang draft)</div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

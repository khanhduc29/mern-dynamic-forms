import { useState, useEffect } from 'react';
import { formAPI, submissionAPI } from '../../api/api';
import toast from 'react-hot-toast';
import FieldRenderer from '../UI/FieldRenderer';

export default function FormFill({ form, onBack }) {
  const [fullForm, setFullForm] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await formAPI.getById(form._id);
        setFullForm(res.data?.data || null);
      } catch (err) {
        toast.error('Lỗi tải form');
      }
    };
    load();
  }, [form._id]);

  const handleFieldChange = (fieldId, value) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => { const n = {...prev}; delete n[fieldId]; return n; });
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setErrors({});
    try {
      await submissionAPI.submit(form._id, formValues);
      toast.success('🎉 Nộp form thành công!');
      setSubmitted(true);
    } catch (err) {
      const errData = err.response?.data?.error;
      if (errData?.details) {
        const newErrors = {};
        errData.details.forEach(d => {
          newErrors[d.fieldId] = d.messages.join(', ');
        });
        setErrors(newErrors);
        toast.error('Vui lòng kiểm tra lại dữ liệu');
      } else {
        toast.error(errData?.message || 'Lỗi nộp form');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="page-container">
        <div className="card" style={{ maxWidth: 600, margin: '60px auto', textAlign: 'center' }}>
          <div className="card-body" style={{ padding: 60 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Nộp thành công!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
              Cảm ơn bạn đã điền form "{form.title}"
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={onBack}>← Quay lại</button>
              <button className="btn btn-primary" onClick={() => { setSubmitted(false); setFormValues({}); setErrors({}); }}>
                Điền lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!fullForm) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  const fields = (fullForm.fields || []).sort((a, b) => a.order - b.order);

  return (
    <div className="page-container">
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button className="btn btn-secondary btn-sm" onClick={onBack}>← Quay lại</button>
          <h1 className="header-title">{fullForm.title}</h1>
        </div>
      </div>

      <div style={{ padding: '24px 0', maxWidth: 700 }}>
        {fullForm.description && (
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 15 }}>
            {fullForm.description}
          </p>
        )}

        <div className="card">
          <div className="card-body">
            {fields.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-title">Form chưa có câu hỏi</div>
              </div>
            ) : (
              <>
                {fields.map(field => (
                  <FieldRenderer
                    key={field._id}
                    field={field}
                    value={formValues[field._id]}
                    onChange={handleFieldChange}
                    error={errors[field._id]}
                  />
                ))}
                <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                  <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? '⏳ Đang nộp...' : '✓ Nộp Form'}
                  </button>
                  <button className="btn btn-secondary btn-lg" onClick={onBack}>Hủy</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ currentView, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">📋</div>
        <div className="sidebar-logo-text">
          <span>FormHub</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Quản trị</div>
        <button
          className={`sidebar-link ${currentView === 'admin-forms' ? 'active' : ''}`}
          onClick={() => onNavigate('admin-forms')}
        >
          <span className="sidebar-link-icon">📝</span>
          Quản lý Form
        </button>

        <div className="sidebar-section-label">Nhân viên SW</div>
        <button
          className={`sidebar-link ${currentView === 'employee-forms' ? 'active' : ''}`}
          onClick={() => onNavigate('employee-forms')}
        >
          <span className="sidebar-link-icon">📄</span>
          Điền Form
        </button>
        <button
          className={`sidebar-link ${currentView === 'employee-submissions' ? 'active' : ''}`}
          onClick={() => onNavigate('employee-submissions')}
        >
          <span className="sidebar-link-icon">📊</span>
          Lịch sử nộp
        </button>
      </nav>
    </aside>
  );
}

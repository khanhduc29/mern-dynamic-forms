import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Layout/Sidebar';
import FormListAdmin from './components/Admin/FormList';
import FormListEmp from './components/Employee/FormList';
import SubmissionList from './components/Employee/SubmissionList';

function App() {
  const [currentView, setCurrentView] = useState('admin-forms');

  const renderContent = () => {
    switch (currentView) {
      case 'admin-forms':
        return <FormListAdmin />;
      case 'employee-forms':
        return <FormListEmp />;
      case 'employee-submissions':
        return <SubmissionList />;
      default:
        return <FormListAdmin />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <main className="main-content">
        {renderContent()}
      </main>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
          },
          success: {
            iconTheme: {
              primary: 'var(--success)',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--danger)',
              secondary: 'white',
            },
          }
        }}
      />
    </div>
  );
}

export default App;

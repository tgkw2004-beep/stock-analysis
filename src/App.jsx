import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Strategies from './pages/Strategies';
import SupplyStrategy from './pages/SupplyStrategy';
import Settings from './pages/Settings';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'quant':
        return <Strategies />;
      case 'supply':
        return <SupplyStrategy />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const pageTitle = {
    dashboard: '대시보드',
    quant: '퀀트 매수 전략',
    supply: '반등 수급 매매 전략',
    settings: '설정',
  };

  return (
    <div className="app-layout">
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
      <Sidebar
        active={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
      />
      <div className="main-area">
        <Header
          title={pageTitle[activePage]}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="content page-enter" key={activePage}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

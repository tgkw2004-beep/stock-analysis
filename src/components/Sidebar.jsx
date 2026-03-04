import {
    LayoutDashboard,
    TrendingUp,
    Settings,
    BarChart3,
    Activity,
} from 'lucide-react';
import { getQuantSummary, getSupplySummary } from '../services/apiService';

export default function Sidebar({ active, onNavigate, isOpen }) {
    const quantSummary = getQuantSummary();
    const supplySummary = getSupplySummary();

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            {/* Logo */}
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">📊</div>
                <div>
                    <h1>QuantFlow</h1>
                    <span>Stock Analysis Engine</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                <div className="nav-section-title">메인 메뉴</div>

                <div
                    className={`nav-item ${active === 'dashboard' ? 'active' : ''}`}
                    onClick={() => onNavigate('dashboard')}
                >
                    <LayoutDashboard />
                    <span>대시보드</span>
                </div>

                <div className="nav-section-title">전략 카테고리</div>

                <div
                    className={`nav-item ${active === 'quant' ? 'active' : ''}`}
                    onClick={() => onNavigate('quant')}
                >
                    <TrendingUp />
                    <span>퀀트 매수 전략</span>
                    <span className="nav-badge">{quantSummary.total}</span>
                </div>

                <div
                    className={`nav-item ${active === 'supply' ? 'active' : ''}`}
                    onClick={() => onNavigate('supply')}
                >
                    <Activity />
                    <span>반등 수급 매매</span>
                    <span className="nav-badge">{supplySummary.total}</span>
                </div>

                <div className="nav-section-title">시스템</div>

                <div
                    className={`nav-item ${active === 'settings' ? 'active' : ''}`}
                    onClick={() => onNavigate('settings')}
                >
                    <Settings />
                    <span>설정</span>
                </div>
            </nav>
        </aside>
    );
}

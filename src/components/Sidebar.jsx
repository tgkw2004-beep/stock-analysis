import {
    LayoutDashboard,
    TrendingUp,
    Settings,
    BarChart3,
    Zap,
    Target,
    Activity,
} from 'lucide-react';
import { analysisSummary } from '../data/sampleData';

export default function Sidebar({ active, onNavigate, isOpen }) {
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

                <div
                    className={`nav-item ${active === 'strategies' ? 'active' : ''}`}
                    onClick={() => onNavigate('strategies')}
                >
                    <TrendingUp />
                    <span>전략 분석</span>
                    <span className="nav-badge">{analysisSummary.signals_found}</span>
                </div>

                <div className="nav-section-title">전략 카테고리</div>

                <div className="nav-item" onClick={() => onNavigate('strategies')}>
                    <Zap />
                    <span>OMEGA-R</span>
                    <span className="nav-badge">{analysisSummary.by_strategy['OMEGA-R']}</span>
                </div>

                <div className="nav-item" onClick={() => onNavigate('strategies')}>
                    <BarChart3 />
                    <span>ALPHA-S</span>
                    <span className="nav-badge">{analysisSummary.by_strategy['ALPHA-S']}</span>
                </div>

                <div className="nav-item" onClick={() => onNavigate('strategies')}>
                    <Activity />
                    <span>SIGMA-T</span>
                    <span className="nav-badge">{analysisSummary.by_strategy['SIGMA-T']}</span>
                </div>

                <div className="nav-item" onClick={() => onNavigate('strategies')}>
                    <Target />
                    <span>Piercing</span>
                    <span className="nav-badge">{analysisSummary.by_strategy['Piercing']}</span>
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

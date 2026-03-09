import { Search, Bell, Menu } from 'lucide-react';

export default function Header({ title, onMenuClick }) {
    return (
        <header className="header">
            <div className="header-left">
                <button className="mobile-menu-btn" onClick={onMenuClick}>
                    <Menu size={22} />
                </button>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="header-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            background: 'var(--gradient-primary)',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontWeight: 900,
                            fontSize: '0.9rem',
                            letterSpacing: '0.5px'
                        }}>FINEX</div>
                        <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{title}</span>
                    </div>
                </div>
            </div>
            <div className="header-right">
                <div className="header-search">
                    <Search />
                    <input type="text" placeholder="종목 검색 (이름 / 코드)" />
                </div>
                <button className="header-icon-btn">
                    <Bell size={18} />
                    <span className="badge-dot" />
                </button>
                <div className="header-profile">
                    <div className="header-avatar">F</div>
                    <span className="header-profile-name">FINEX</span>
                </div>
            </div>
        </header>
    );
}

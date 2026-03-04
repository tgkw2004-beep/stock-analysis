import { Search, Bell, Menu } from 'lucide-react';

export default function Header({ title, onMenuClick }) {
    return (
        <header className="header">
            <div className="header-left">
                <button className="mobile-menu-btn" onClick={onMenuClick}>
                    <Menu size={22} />
                </button>
                <div>
                    <div className="header-title">{title}</div>
                    <div className="header-subtitle">Bollinger Band 4대 전략 분석</div>
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
                    <div className="header-avatar">Q</div>
                    <span className="header-profile-name">QuantTrader</span>
                </div>
            </div>
        </header>
    );
}

import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    TrendingUp,
    Settings,
    BarChart3,
    Activity,
    Search,
} from 'lucide-react';
import { fetchQuantDates, fetchSupplyDates } from '../services/apiService';

export default function Sidebar({ active, onNavigate, isOpen }) {
    const [hasNewQuant, setHasNewQuant] = useState(false);
    const [hasNewSupply, setHasNewSupply] = useState(false);

    useEffect(() => {
        async function checkNewData() {
            try {
                // Get today's date in KST (YYYY-MM-DD)
                const now = new Date();
                const kstDate = new Date(now.getTime() + (9 * 60 * 60 * 1000));
                const todayStr = kstDate.toISOString().split('T')[0];

                const [qDates, sDates] = await Promise.all([
                    fetchQuantDates().catch(() => []),
                    fetchSupplyDates().catch(() => [])
                ]);

                // Check if today exists in the fetched dates (could be string array or object array)
                const isToday = (dates) => {
                    if (!Array.isArray(dates) || dates.length === 0) return false;
                    return dates.some(d => {
                        const dateStr = typeof d === 'object' && d !== null ? d.date : String(d);
                        return dateStr && dateStr.trim().includes(todayStr);
                    });
                };

                // Fallback: if no today match, but we want to show NEW for the "latest" available date
                // (Optional: User said "today", so we stick to today for now)
                setHasNewQuant(isToday(qDates));
                setHasNewSupply(isToday(sDates));
            } catch (err) {
                console.error('Check new data failed:', err);
            }
        }
        checkNewData();
    }, []);

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            {/* Logo */}
            <div className="sidebar-logo">
                <img src={`${import.meta.env.BASE_URL}hubnet-logo.png`} alt="HUBNET" style={{ width: '100%', maxWidth: '200px', height: 'auto', objectFit: 'contain' }} />
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
                    {hasNewQuant && <span className="nav-badge" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '2px 6px' }}>NEW</span>}
                </div>

                <div
                    className={`nav-item ${active === 'supply' ? 'active' : ''}`}
                    onClick={() => onNavigate('supply')}
                >
                    <Activity />
                    <span>반등 수급 매매</span>
                    {hasNewSupply && <span className="nav-badge" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '2px 6px' }}>NEW</span>}
                </div>

                <div className="nav-section-title">종목 검색</div>

                <div
                    className={`nav-item ${active === 'stock-search' ? 'active' : ''}`}
                    onClick={() => onNavigate('stock-search')}
                >
                    <Search />
                    <span>종목 검색</span>
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


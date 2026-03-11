import { TrendingUp, TrendingDown } from 'lucide-react';
import React from 'react';
import '../index.css';

const RANK_STYLES = [
    { badge: '🥇', gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#fbbf24' },
    { badge: '🥈', gradient: 'linear-gradient(135deg, #cbd5e1, #94a3b8)', color: '#94a3b8' },
    { badge: '🥉', gradient: 'linear-gradient(135deg, #d97706, #b45309)', color: '#d97706' },
    { badge: '4', gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', color: '#38bdf8' },
    { badge: '5', gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', color: '#38bdf8' },
];

function EtfCard({ item, index }) {
    const style = RANK_STYLES[index] || RANK_STYLES[4];
    const changeRateVal = Number(item.change_rate);
    const isUp = changeRateVal > 0;
    const isDown = changeRateVal < 0;
    const changeClass = isUp ? 'up' : isDown ? 'down' : 'neutral';

    const isTopThree = index < 3;

    return (
        <div className={`theme-card ${changeClass}`}>
            <div className="theme-card-rank">
                {isTopThree ? (
                    <span className="theme-rank-medal">{style.badge}</span>
                ) : (
                    <span className="theme-rank-number" style={{ background: style.gradient }}>
                        {style.badge}
                    </span>
                )}
            </div>
            <div className="theme-card-info" style={{ flex: 1 }}>
                <div className="theme-card-name">{item.name}</div>
                <div className="theme-card-date" style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                    {item.code} | {item.date_str}
                </div>
            </div>
            <div className="theme-card-prices" style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)'}}>
                    {Number(item.close).toLocaleString()}원
                </span>
                <div className={`theme-card-yield ${changeClass}`} style={{ fontSize: '0.85rem' }}>
                    {isUp ? <TrendingUp size={12} /> : isDown ? <TrendingDown size={12} /> : null}
                    <span>
                        {isUp ? '+' : ''}{Number(item.price_change).toLocaleString()}원 ({isUp ? '+' : ''}{changeRateVal.toFixed(2)}%)
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function TopEtfs({ etfs, loading }) {
    if (loading) {
        return (
            <div className="top-themes-section">
                <div className="top-themes-header">
                    <span className="top-themes-title">📈 ETF Top 5 (로딩중...)</span>
                </div>
            </div>
        );
    }

    if (!etfs || etfs.length === 0) {
        return null;
    }

    return (
        <div className="top-themes-section fade-in delay-300">
            <div className="top-themes-header" style={{ marginBottom: '15px' }}>
                <span className="top-themes-title">📈 최고가 ETF</span>
                <span className="top-themes-subtitle">가격 상위 TOP 5</span>
            </div>
            <div className="top-themes-grid">
                {etfs.map((item, i) => (
                    <EtfCard key={item.code} item={item} index={i} />
                ))}
            </div>
        </div>
    );
}

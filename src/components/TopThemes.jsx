import { TrendingUp } from 'lucide-react';
import { getTopThemes } from '../services/apiService';

const RANK_STYLES = [
    { badge: '🥇', gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#fbbf24' },
    { badge: '🥈', gradient: 'linear-gradient(135deg, #cbd5e1, #94a3b8)', color: '#94a3b8' },
    { badge: '🥉', gradient: 'linear-gradient(135deg, #d97706, #b45309)', color: '#d97706' },
    { badge: '4', gradient: 'linear-gradient(135deg, #6366f1, #818cf8)', color: '#818cf8' },
    { badge: '5', gradient: 'linear-gradient(135deg, #6366f1, #818cf8)', color: '#818cf8' },
];

function ThemeCard({ item, index }) {
    const style = RANK_STYLES[index] || RANK_STYLES[4];
    const isUp = item.yield > 0;
    const isDown = item.yield < 0;
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
            <div className="theme-card-info">
                <div className="theme-card-name">{item.theme}</div>
                <div className="theme-card-date">{item.date}</div>
            </div>
            <div className={`theme-card-yield ${changeClass}`}>
                <TrendingUp size={14} />
                <span>{isUp ? '+' : ''}{item.yield.toFixed(2)}%</span>
            </div>
        </div>
    );
}

export default function TopThemes() {
    const themes = getTopThemes();

    if (!themes || themes.length === 0) {
        return null;
    }

    return (
        <div className="top-themes-section">
            <div className="top-themes-header">
                <span className="top-themes-title">🏷️ 주요테마</span>
                <span className="top-themes-subtitle">등락률 TOP 5</span>
            </div>
            <div className="top-themes-grid">
                {themes.slice(0, 5).map((item, i) => (
                    <ThemeCard key={item.theme} item={item} index={i} />
                ))}
            </div>
        </div>
    );
}

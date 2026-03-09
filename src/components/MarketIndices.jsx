import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const INDEX_CONFIG = [
    { key: 'kospi', label: 'KOSPI', icon: '🇰🇷', color: '#0ea5e9' },
    { key: 'kosdaq', label: 'KOSDAQ', icon: '🇰🇷', color: '#a855f7' },
    { key: 'sp500', label: 'S&P 500', icon: '🇺🇸', color: '#f59e0b' },
    { key: 'nasdaq', label: 'NASDAQ', icon: '🇺🇸', color: '#06b6d4' },
    { key: 'dow', label: '다우존스', icon: '🇺🇸', color: '#10b981' },
];

function IndexCard({ config, data }) {
    if (!data || data.current === null) {
        return (
            <div className="index-card">
                <div className="index-card-header">
                    <span className="index-card-flag">{config.icon}</span>
                    <span className="index-card-name">{config.label}</span>
                </div>
                <div className="index-card-value">—</div>
                <div className="index-card-change neutral">데이터 없음</div>
            </div>
        );
    }

    const currentVal = Number(data.current);
    const changeVal = Number(data.change);
    const changePctVal = Number(data.changePercent);

    const isUp = changeVal > 0;
    const isDown = changeVal < 0;
    const changeClass = isUp ? 'up' : isDown ? 'down' : 'neutral';
    const arrow = isUp ? '▲' : isDown ? '▼' : '—';
    const TrendIcon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;
    const sparkColor = isUp ? '#22c55e' : isDown ? '#ef4444' : '#64748b';

    return (
        <div className="index-card">
            <div className="index-card-header">
                <div className="index-card-title">
                    <span className="index-card-flag">{config.icon}</span>
                    <span className="index-card-name">{config.label}</span>
                </div>
                <TrendIcon size={14} className={`index-trend-icon ${changeClass}`} />
            </div>

            <div className="index-card-value">
                {currentVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>

            <div className={`index-card-change ${changeClass}`}>
                <span>{arrow} {Math.abs(changeVal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className="index-card-pct">({changePctVal >= 0 ? '+' : ''}{changePctVal.toFixed(2)}%)</span>
            </div>

            {data.sparkline && data.sparkline.length > 2 && (
                <div className="index-card-sparkline">
                    <ResponsiveContainer width="100%" height={40}>
                        <LineChart data={data.sparkline}>
                            <YAxis domain={['dataMin', 'dataMax']} hide />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={sparkColor}
                                strokeWidth={1.5}
                                dot={false}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {data.date && (
                <div className="index-card-date">{data.date}</div>
            )}
        </div>
    );
}

export default function MarketIndices({ data, loading }) {
    const indices = data;

    if (loading) {
        return (
            <div className="market-indices-section">
                <div className="market-indices-header">
                    <span className="market-indices-title">📊 주요지수 (로딩중...)</span>
                </div>
            </div>
        );
    }

    if (!indices || Object.keys(indices).length === 0) {
        return null;
    }

    return (
        <div className="market-indices-section">
            <div className="market-indices-header">
                <span className="market-indices-title">📊 주요지수</span>
            </div>
            <div className="market-indices-grid">
                {INDEX_CONFIG.map(config => (
                    <IndexCard
                        key={config.key}
                        config={config}
                        data={indices[config.key]}
                    />
                ))}
            </div>
        </div>
    );
}

import { useState } from 'react';
import { strategySignals, strategyMeta, analysisSummary } from '../data/sampleData';
import { Filter, ArrowUpDown } from 'lucide-react';

export default function Strategies() {
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [sortField, setSortField] = useState('score');
    const [sortDir, setSortDir] = useState('desc');

    const strategies = ['ALL', 'OMEGA-R', 'ALPHA-S', 'SIGMA-T', 'Piercing'];

    const filtered = activeFilter === 'ALL'
        ? strategySignals
        : strategySignals.filter((s) => s.strategy === activeFilter);

    const sorted = [...filtered].sort((a, b) => {
        const mult = sortDir === 'desc' ? -1 : 1;
        if (sortField === 'score') return (a.score - b.score) * mult;
        if (sortField === 'change') return (a.change - b.change) * mult;
        if (sortField === 'name') return a.name.localeCompare(b.name) * mult;
        return 0;
    });

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
        } else {
            setSortField(field);
            setSortDir('desc');
        }
    };

    return (
        <div className="page-enter">
            {/* 전략 요약 카드 */}
            <div className="stats-grid" style={{ marginBottom: 'var(--space-xl)' }}>
                {Object.entries(strategyMeta).map(([key, meta]) => {
                    const count = analysisSummary.by_strategy[key] || 0;
                    const signals = strategySignals.filter((s) => s.strategy === key);
                    const avgScore = signals.length
                        ? (signals.reduce((sum, s) => sum + s.score, 0) / signals.length).toFixed(2)
                        : '0.00';
                    return (
                        <div
                            className="stat-card"
                            key={key}
                            style={{ cursor: 'pointer', borderColor: activeFilter === key ? meta.color : undefined }}
                            onClick={() => setActiveFilter(activeFilter === key ? 'ALL' : key)}
                        >
                            <div className="stat-card-header">
                                <div
                                    className="stat-card-icon"
                                    style={{ background: `${meta.color}22`, color: meta.color, fontSize: '1.4rem' }}
                                >
                                    {meta.icon}
                                </div>
                                <div className="stat-card-label">{meta.fullName}</div>
                            </div>
                            <div className="stat-card-value" style={{ color: meta.color }}>{count}</div>
                            <div className="stat-card-sub">평균 스코어: {avgScore}</div>
                        </div>
                    );
                })}
            </div>

            {/* 필터 바 */}
            <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
                <div className="card-header">
                    <div className="card-title">
                        <Filter size={16} />
                        전략 필터
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {strategies.map((s) => (
                            <button
                                key={s}
                                className={`btn ${activeFilter === s ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setActiveFilter(s)}
                                style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                            >
                                {s === 'ALL' ? '전체' : s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 전략 신호 테이블 */}
            <div className="card">
                <div className="card-header">
                    <div className="card-title">
                        <span className="card-title-icon">📋</span>
                        {activeFilter === 'ALL' ? '전체' : activeFilter} 전략 신호
                        <span className="tag-chip" style={{ marginLeft: '8px' }}>{sorted.length}건</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-outline" onClick={() => handleSort('score')} style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                            <ArrowUpDown size={14} /> 스코어
                        </button>
                        <button className="btn btn-outline" onClick={() => handleSort('change')} style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                            <ArrowUpDown size={14} /> 등락률
                        </button>
                    </div>
                </div>
                <div className="card-body-np">
                    <table className="signal-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>종목</th>
                                <th>전략</th>
                                <th>스코어</th>
                                <th>현재가</th>
                                <th>등락률</th>
                                <th>거래량</th>
                                <th>판별 근거</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.map((s, i) => (
                                <tr key={`${s.ticker}-${s.strategy}`}>
                                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>{i + 1}</td>
                                    <td>
                                        <div className="signal-name">{s.name}</div>
                                        <div className="signal-ticker">{s.ticker}</div>
                                    </td>
                                    <td>
                                        <span className={`strategy-badge ${s.strategy}`}>
                                            {strategyMeta[s.strategy]?.icon} {s.strategy}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="score-bar-container">
                                            <span className="signal-score" style={{ color: strategyMeta[s.strategy]?.color, minWidth: '50px' }}>
                                                {s.score.toFixed(2)}
                                            </span>
                                            <div className="score-bar" style={{ width: '60px' }}>
                                                <div
                                                    className="score-bar-fill"
                                                    style={{
                                                        width: `${Math.min(s.score, 100)}%`,
                                                        background: strategyMeta[s.strategy]?.gradient,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="signal-price">{s.close.toLocaleString()}원</td>
                                    <td>
                                        <span className={`signal-change ${s.change >= 0 ? 'change-up' : 'change-down'}`}>
                                            {s.change >= 0 ? '▲' : '▼'} {Math.abs(s.change)}%
                                        </span>
                                    </td>
                                    <td className="signal-volume">{(s.volume / 10000).toFixed(0)}만</td>
                                    <td className="signal-reason">{s.reason}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

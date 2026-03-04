import { useState, useEffect, useMemo } from 'react';
import { strategyMeta } from '../data/sampleData';
import { getQuantStrategies, getQuantSummary, getQuantDates } from '../services/apiService';
import { Filter, ArrowUpDown } from 'lucide-react';
import DatePicker from '../components/DatePicker';

export default function Strategies() {
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [selectedDate, setSelectedDate] = useState('');
    const [sortField, setSortField] = useState('close');
    const [sortDir, setSortDir] = useState('desc');

    const strategies = ['ALL', 'OMEGA-R', 'ALPHA-S', 'SIGMA-T'];
    const dates = getQuantDates();
    const dateCounts = useMemo(() => {
        const m = {};
        dates.forEach(d => { m[d.date] = d.count; });
        return m;
    }, []);

    useEffect(() => {
        if (dates.length > 0 && !selectedDate) setSelectedDate(dates[0].date);
    }, []);

    const summary = getQuantSummary(selectedDate);
    const signals = getQuantStrategies({ strategy: activeFilter, date: selectedDate, sort: sortField, order: sortDir });

    const handleSort = (field) => {
        if (sortField === field) setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
        else { setSortField(field); setSortDir('desc'); }
    };

    const calcChange = (s) => (!s.open || s.open === 0) ? 0 : (((s.close - s.open) / s.open) * 100).toFixed(2);

    return (
        <div className="page-enter">
            <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
                <div className="card-header">
                    <div className="card-title">📅 추천 날짜 선택</div>
                    <DatePicker
                        value={selectedDate}
                        onChange={setSelectedDate}
                        availableDates={dates.map(d => d.date)}
                        dateCounts={dateCounts}
                    />
                </div>
            </div>

            <div className="stats-grid" style={{ marginBottom: 'var(--space-xl)' }}>
                {strategies.filter(k => k !== 'ALL').map(key => {
                    const meta = strategyMeta[key];
                    if (!meta) return null;
                    const count = summary.by_strategy[key] || 0;
                    return (
                        <div className="stat-card" key={key}
                            style={{ cursor: 'pointer', borderColor: activeFilter === key ? meta.color : undefined, boxShadow: activeFilter === key ? `0 0 20px ${meta.color}33` : undefined }}
                            onClick={() => setActiveFilter(activeFilter === key ? 'ALL' : key)}>
                            <div className="stat-card-header">
                                <div className="stat-card-icon" style={{ background: `${meta.color}22`, color: meta.color, fontSize: '1.4rem' }}>{meta.icon}</div>
                                <div className="stat-card-label">{meta.fullName}</div>
                            </div>
                            <div className="stat-card-value" style={{ color: meta.color }}>{count}</div>
                            <div className="stat-card-sub">{meta.description}</div>
                        </div>
                    );
                })}
            </div>

            <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
                <div className="card-header">
                    <div className="card-title"><Filter size={16} /> 전략 필터 <span className="tag-chip" style={{ marginLeft: '8px' }}>총 {summary.total}건</span></div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {strategies.map(s => (
                            <button key={s} className={`btn ${activeFilter === s ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setActiveFilter(s)} style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
                                {s === 'ALL' ? '전체' : s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="card-title">
                        <span className="card-title-icon">📋</span>
                        {activeFilter === 'ALL' ? '전체' : activeFilter} 전략 신호
                        <span className="tag-chip" style={{ marginLeft: '8px' }}>{signals.length}건</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-outline" onClick={() => handleSort('close')} style={{ padding: '6px 12px', fontSize: '0.78rem' }}><ArrowUpDown size={14} /> 종가</button>
                        <button className="btn btn-outline" onClick={() => handleSort('stock_name')} style={{ padding: '6px 12px', fontSize: '0.78rem' }}><ArrowUpDown size={14} /> 종목명</button>
                    </div>
                </div>
                <div className="card-body-np">
                    <table className="signal-table">
                        <thead>
                            <tr><th>#</th><th>종목</th><th>업종</th><th>전략</th><th>시가</th><th>고가</th><th>저가</th><th>종가</th><th>등락률</th></tr>
                        </thead>
                        <tbody>
                            {signals.length === 0 ? (
                                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-tertiary)' }}>해당 조건에 맞는 데이터가 없습니다.</td></tr>
                            ) : signals.map((s, i) => {
                                const change = calcChange(s);
                                const meta = strategyMeta[s.strategy];
                                return (
                                    <tr key={`${s.stock_name}-${i}`}>
                                        <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>{i + 1}</td>
                                        <td><div className="signal-name">{s.stock_name}</div></td>
                                        <td><span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{s.wics_name}</span></td>
                                        <td><span className={`strategy-badge ${s.strategy}`}>{meta?.icon} {s.strategy}</span></td>
                                        <td className="signal-price">{s.open?.toLocaleString()}</td>
                                        <td className="signal-price" style={{ color: '#22c55e' }}>{s.high?.toLocaleString()}</td>
                                        <td className="signal-price" style={{ color: '#ef4444' }}>{s.low?.toLocaleString()}</td>
                                        <td className="signal-price" style={{ fontWeight: 600 }}>{s.close?.toLocaleString()}</td>
                                        <td><span className={`signal-change ${change >= 0 ? 'change-up' : 'change-down'}`}>{change >= 0 ? '▲' : '▼'} {Math.abs(change)}%</span></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

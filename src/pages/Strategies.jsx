import { useState, useEffect, useMemo } from 'react';
import { strategyMeta } from '../data/sampleData';
import { fetchQuantStrategies, fetchQuantSummary, fetchQuantDates } from '../services/apiService';
import { Filter, ArrowUpDown } from 'lucide-react';
import DatePicker from '../components/DatePicker';

export default function Strategies() {
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [selectedDate, setSelectedDate] = useState('');
    const [sortField, setSortField] = useState('close');
    const [sortDir, setSortDir] = useState('desc');

    const [dates, setDates] = useState([]);
    const [summary, setSummary] = useState({ total: 0, by_strategy: {} });
    const [signals, setSignals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const strategies = ['ALL', 'OMEGA-R', 'ALPHA-S', 'SIGMA-T'];

    // 1. 초기 날짜 목록 로드
    useEffect(() => {
        const initFetch = async () => {
            const fetchedDates = await fetchQuantDates();
            setDates(fetchedDates);
            if (fetchedDates.length > 0) setSelectedDate(fetchedDates[0].date);
        };
        initFetch();
    }, []);

    // 2. 날짜, 필터, 정렬 변경 시 데이터 비동기 로드
    useEffect(() => {
        if (!selectedDate) return;
        const loadData = async () => {
            setLoading(true);
            const [sumData, sigData] = await Promise.all([
                fetchQuantSummary(selectedDate),
                fetchQuantStrategies({ strategy: activeFilter, date: selectedDate, sort: sortField, order: sortDir })
            ]);
            setSummary(sumData);
            setSignals(sigData);
            setCurrentPage(1); // Reset page on new data
            setLoading(false);
        };
        loadData();
    }, [selectedDate, activeFilter, sortField, sortDir]);

    const dateCounts = useMemo(() => {
        const m = {};
        dates.forEach(d => { m[d.date] = d.count; });
        return m;
    }, [dates]);

    const handleSort = (field) => {
        if (sortField === field) setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
        else { setSortField(field); setSortDir('desc'); }
    };

    const totalPages = Math.ceil(signals.length / itemsPerPage);
    const currentSignals = signals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const calcChange = (s) => {
        const o = Number(s.open);
        const c = Number(s.close);
        if (!o || o === 0) return 0;
        return (((c - o) / o) * 100).toFixed(2);
    };

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
                            {currentSignals.length === 0 ? (
                                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-tertiary)' }}>해당 조건에 맞는 데이터가 없습니다.</td></tr>
                            ) : currentSignals.map((s, i) => {
                                const change = calcChange(s);
                                const meta = strategyMeta[s.strategy];
                                const actualIndex = (currentPage - 1) * itemsPerPage + i + 1;
                                return (
                                    <tr key={`${s.stock_name}-${i}`}>
                                        <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>{actualIndex}</td>
                                        <td><div className="signal-name">{s.stock_name}</div></td>
                                        <td><span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{s.wics_name}</span></td>
                                        <td><span className={`strategy-badge ${s.strategy}`}>{meta?.icon} {s.strategy}</span></td>
                                        <td className="signal-price">{Number(s.open || 0).toLocaleString()}</td>
                                        <td className="signal-price" style={{ color: '#22c55e' }}>{Number(s.high || 0).toLocaleString()}</td>
                                        <td className="signal-price" style={{ color: '#ef4444' }}>{Number(s.low || 0).toLocaleString()}</td>
                                        <td className="signal-price" style={{ fontWeight: 600 }}>{Number(s.close || 0).toLocaleString()}</td>
                                        <td><span className={`signal-change ${change >= 0 ? 'change-up' : 'change-down'}`}>{change >= 0 ? '▲' : '▼'} {Math.abs(change)}%</span></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            className="page-btn"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            이전
                        </button>
                        <span className="page-info">{currentPage} / {totalPages}</span>
                        <button
                            className="page-btn"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            다음
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

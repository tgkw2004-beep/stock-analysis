import { useState, useEffect } from 'react';
import { strategyMeta } from '../data/sampleData';
import { fetchStrategies, fetchSummary, fetchDates } from '../services/apiService';
import { Filter, ArrowUpDown, Calendar, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function Strategies() {
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [selectedDate, setSelectedDate] = useState('');
    const [sortField, setSortField] = useState('close');
    const [sortDir, setSortDir] = useState('desc');

    // 데이터 상태
    const [signals, setSignals] = useState([]);
    const [summary, setSummary] = useState(null);
    const [dates, setDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const strategies = ['ALL', 'OMEGA-R', 'ALPHA-S', 'SIGMA-T'];

    // 날짜 목록 불러오기
    useEffect(() => {
        fetchDates()
            .then((res) => {
                setDates(res.dates || []);
                if (res.dates?.length > 0) {
                    setSelectedDate(res.dates[0].date);
                }
            })
            .catch((e) => console.error('날짜 로드 실패:', e));
    }, []);

    // 데이터 불러오기
    useEffect(() => {
        if (!selectedDate) return;
        loadData();
    }, [activeFilter, selectedDate, sortField, sortDir]);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [strategiesRes, summaryRes] = await Promise.all([
                fetchStrategies({
                    strategy: activeFilter,
                    date: selectedDate,
                    sort: sortField,
                    order: sortDir,
                    limit: 200,
                }),
                fetchSummary(selectedDate),
            ]);
            setSignals(strategiesRes.data || []);
            setSummary(summaryRes);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
        } else {
            setSortField(field);
            setSortDir('desc');
        }
    };

    // 등락률 계산 (시가 대비)
    const calcChange = (s) => {
        if (!s.open || s.open === 0) return 0;
        return (((s.close - s.open) / s.open) * 100).toFixed(2);
    };

    return (
        <div className="page-enter">
            {/* 날짜 선택 바 */}
            <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
                <div className="card-header">
                    <div className="card-title">
                        <Calendar size={16} />
                        분석 날짜 선택
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <select
                            className="date-select"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        >
                            {dates.map((d) => (
                                <option key={d.date} value={d.date}>
                                    {d.date} ({d.count}건)
                                </option>
                            ))}
                        </select>
                        <button className="btn btn-outline" onClick={loadData} style={{ padding: '6px 12px' }}>
                            <RefreshCw size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* 전략 요약 카드 */}
            <div className="stats-grid" style={{ marginBottom: 'var(--space-xl)' }}>
                {strategies.filter(k => k !== 'ALL').map((key) => {
                    const meta = strategyMeta[key];
                    if (!meta) return null;
                    const count = summary?.by_strategy?.[key] || 0;
                    return (
                        <div
                            className="stat-card"
                            key={key}
                            style={{
                                cursor: 'pointer',
                                borderColor: activeFilter === key ? meta.color : undefined,
                                boxShadow: activeFilter === key ? `0 0 20px ${meta.color}33` : undefined,
                            }}
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
                            <div className="stat-card-sub">{meta.description}</div>
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
                        {summary && (
                            <span className="tag-chip" style={{ marginLeft: '8px' }}>
                                총 {summary.total}건
                            </span>
                        )}
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

            {/* 에러 메시지 */}
            {error && (
                <div className="card" style={{ marginBottom: 'var(--space-xl)', borderColor: '#ef4444' }}>
                    <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444' }}>
                        <AlertCircle size={20} />
                        <div>
                            <div style={{ fontWeight: 600 }}>데이터 로드 실패</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{error}</div>
                        </div>
                        <button className="btn btn-outline" onClick={loadData} style={{ marginLeft: 'auto', padding: '6px 14px' }}>
                            재시도
                        </button>
                    </div>
                </div>
            )}

            {/* 전략 신호 테이블 */}
            <div className="card">
                <div className="card-header">
                    <div className="card-title">
                        <span className="card-title-icon">📋</span>
                        {activeFilter === 'ALL' ? '전체' : activeFilter} 전략 신호
                        <span className="tag-chip" style={{ marginLeft: '8px' }}>
                            {loading ? '...' : `${signals.length}건`}
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-outline" onClick={() => handleSort('close')} style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                            <ArrowUpDown size={14} /> 종가
                        </button>
                        <button className="btn btn-outline" onClick={() => handleSort('stock_name')} style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                            <ArrowUpDown size={14} /> 종목명
                        </button>
                    </div>
                </div>
                <div className="card-body-np">
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0', gap: '12px', color: 'var(--text-secondary)' }}>
                            <Loader2 size={24} className="spin-icon" />
                            데이터 로딩 중...
                        </div>
                    ) : (
                        <table className="signal-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>종목</th>
                                    <th>업종</th>
                                    <th>전략</th>
                                    <th>시가</th>
                                    <th>고가</th>
                                    <th>저가</th>
                                    <th>종가</th>
                                    <th>등락률</th>
                                </tr>
                            </thead>
                            <tbody>
                                {signals.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-tertiary)' }}>
                                            해당 조건에 맞는 데이터가 없습니다.
                                        </td>
                                    </tr>
                                ) : (
                                    signals.map((s, i) => {
                                        const change = calcChange(s);
                                        const meta = strategyMeta[s.strategy];
                                        return (
                                            <tr key={`${s.stock_name}-${s.strategy}-${i}`}>
                                                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>
                                                    {i + 1}
                                                </td>
                                                <td>
                                                    <div className="signal-name">{s.stock_name}</div>
                                                </td>
                                                <td>
                                                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                                        {s.wics_name}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`strategy-badge ${s.strategy}`}>
                                                        {meta?.icon} {s.strategy}
                                                    </span>
                                                </td>
                                                <td className="signal-price">{s.open?.toLocaleString()}</td>
                                                <td className="signal-price" style={{ color: '#22c55e' }}>{s.high?.toLocaleString()}</td>
                                                <td className="signal-price" style={{ color: '#ef4444' }}>{s.low?.toLocaleString()}</td>
                                                <td className="signal-price" style={{ fontWeight: 600 }}>{s.close?.toLocaleString()}</td>
                                                <td>
                                                    <span className={`signal-change ${change >= 0 ? 'change-up' : 'change-down'}`}>
                                                        {change >= 0 ? '▲' : '▼'} {Math.abs(change)}%
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

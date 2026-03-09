import { useState, useEffect, useMemo } from 'react';
import { fetchSupplyStrategies, fetchSupplySummary, fetchSupplyDates } from '../services/apiService';
import { ArrowUpDown, TrendingUp, BarChart3, Zap, ShieldCheck } from 'lucide-react';
import DatePicker from '../components/DatePicker';

export default function SupplyStrategy() {
    const [selectedDate, setSelectedDate] = useState('');
    const [sortField, setSortField] = useState('val_rank');
    const [sortDir, setSortDir] = useState('asc');
    const [filterAbc, setFilterAbc] = useState(false);
    const [filterAccum, setFilterAccum] = useState(false);
    const [filterSupply, setFilterSupply] = useState(false);

    const [dates, setDates] = useState([]);
    const [summary, setSummary] = useState({ total: 0, abc_count: 0, accum_count: 0, supply_count: 0 });
    const [signals, setSignals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // 1. 초기 날짜 목록 로드
    useEffect(() => {
        const initFetch = async () => {
            const fetchedDates = await fetchSupplyDates();
            setDates(fetchedDates);
            if (fetchedDates.length > 0) setSelectedDate(fetchedDates[0].date);
        };
        initFetch();
    }, []);

    // 2. 비동기 데이터 로드
    useEffect(() => {
        if (!selectedDate) return;
        const loadData = async () => {
            setLoading(true);
            const [sumData, sigData] = await Promise.all([
                fetchSupplySummary(selectedDate),
                fetchSupplyStrategies({ date: selectedDate, sort: sortField, order: sortDir })
            ]);
            setSummary(sumData);
            setSignals(sigData);
            setCurrentPage(1); // Reset page on new data
            setLoading(false);
        };
        loadData();
    }, [selectedDate, sortField, sortDir]);

    const dateCounts = useMemo(() => {
        const m = {};
        dates.forEach(d => { m[d.date] = d.count; });
        return m;
    }, [dates]);

    // 필터 적용 (프론트에서 로컬 필터링)
    let filteredSignals = signals;
    if (filterAbc) filteredSignals = filteredSignals.filter(s => s.abc_all === 'Y');
    if (filterAccum) filteredSignals = filteredSignals.filter(s => s.accum_signal === 'Y');
    if (filterSupply) filteredSignals = filteredSignals.filter(s => s.supply_buy === 'Y');

    const totalPages = Math.ceil(filteredSignals.length / itemsPerPage);
    const currentSignals = filteredSignals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // 로컬 필터 변경 시 페이지 넘침 방어
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(1);
    }

    const handleSort = (field) => {
        if (sortField === field) setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
        else { setSortField(field); setSortDir(field === 'val_rank' ? 'asc' : 'desc'); }
    };

    const formatMoney = (val) => {
        if (!val) return '-';
        const n = Number(val);
        if (Math.abs(n) >= 1e8) return (n / 1e8).toFixed(1) + '억';
        if (Math.abs(n) >= 1e4) return (n / 1e4).toFixed(0) + '만';
        return n.toLocaleString();
    };

    return (
        <div className="page-enter">
            {/* 날짜 선택 */}
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

            {/* 통계 카드 */}
            <div className="stats-grid" style={{ marginBottom: 'var(--space-xl)' }}>
                <div className="stat-card" style={{ cursor: 'pointer', borderColor: filterAbc ? '#22c55e' : undefined, boxShadow: filterAbc ? '0 0 20px rgba(34,197,94,0.2)' : undefined }}
                    onClick={() => setFilterAbc(!filterAbc)}>
                    <div className="stat-card-header">
                        <div className="stat-card-icon" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}><ShieldCheck size={20} /></div>
                        <div className="stat-card-label">ABC 충족</div>
                    </div>
                    <div className="stat-card-value" style={{ color: '#22c55e' }}>{summary.abc_count}</div>
                    <div className="stat-card-sub">ABC 기준 모두 충족 종목</div>
                </div>

                <div className="stat-card" style={{ cursor: 'pointer', borderColor: filterAccum ? '#f59e0b' : undefined, boxShadow: filterAccum ? '0 0 20px rgba(245,158,11,0.2)' : undefined }}
                    onClick={() => setFilterAccum(!filterAccum)}>
                    <div className="stat-card-header">
                        <div className="stat-card-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}><BarChart3 size={20} /></div>
                        <div className="stat-card-label">매집 신호</div>
                    </div>
                    <div className="stat-card-value" style={{ color: '#f59e0b' }}>{summary.accum_count}</div>
                    <div className="stat-card-sub">프로그램 매집 감지 종목</div>
                </div>

                <div className="stat-card" style={{ cursor: 'pointer', borderColor: filterSupply ? '#0ea5e9' : undefined, boxShadow: filterSupply ? '0 0 20px rgba(14,165,233,0.2)' : undefined }}
                    onClick={() => setFilterSupply(!filterSupply)}>
                    <div className="stat-card-header">
                        <div className="stat-card-icon" style={{ background: 'rgba(14,165,233,0.15)', color: '#38bdf8' }}><Zap size={20} /></div>
                        <div className="stat-card-label">수급 유입</div>
                    </div>
                    <div className="stat-card-value" style={{ color: '#38bdf8' }}>{summary.supply_count}</div>
                    <div className="stat-card-sub">수급 유입 감지 종목</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon" style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}><TrendingUp size={20} /></div>
                        <div className="stat-card-label">총 신호</div>
                    </div>
                    <div className="stat-card-value">{summary.total}</div>
                    <div className="stat-card-sub">{selectedDate} 기준</div>
                </div>
            </div>

            {/* 데이터 테이블 */}
            <div className="card">
                <div className="card-header">
                    <div className="card-title">
                        <span className="card-title-icon">⚡</span>
                        반등 수급 매매 신호
                        <span className="tag-chip" style={{ marginLeft: '8px' }}>{signals.length}건</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-outline" onClick={() => handleSort('val_rank')} style={{ padding: '6px 12px', fontSize: '0.78rem' }}><ArrowUpDown size={14} /> 거래대금순위</button>
                        <button className="btn btn-outline" onClick={() => handleSort('z_score')} style={{ padding: '6px 12px', fontSize: '0.78rem' }}><ArrowUpDown size={14} /> 반등강도</button>
                        <button className="btn btn-outline" onClick={() => handleSort('close')} style={{ padding: '6px 12px', fontSize: '0.78rem' }}><ArrowUpDown size={14} /> 현재가</button>
                    </div>
                </div>
                <div className="card-body-np">
                    <div style={{ overflowX: 'auto' }}>
                        <table className="signal-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>종목</th>
                                    <th>테마</th>
                                    <th>현재가</th>
                                    <th>거래대금</th>
                                    <th>순위</th>
                                    <th>프로그램수급</th>
                                    <th>외인기관</th>
                                    <th>반등강도</th>
                                    <th>ABC</th>
                                    <th>매집</th>
                                    <th>수급</th>
                                    <th>투자전략</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentSignals.length === 0 ? (
                                    <tr><td colSpan={13} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-tertiary)' }}>해당 조건에 맞는 데이터가 없습니다.</td></tr>
                                ) : currentSignals.map((s, i) => {
                                    const zScore = parseFloat(s.z_score || 0);
                                    const progSupply = Number(s.program_supply || 0);
                                    const fiSupply = Number(s.foreign_inst_supply || 0);
                                    const actualIndex = (currentPage - 1) * itemsPerPage + i + 1;
                                    return (
                                        <tr key={`${s.stock_code}-${i}`}>
                                            <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>{actualIndex}</td>
                                            <td>
                                                <div className="signal-name">{s.stock_name}</div>
                                                <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{s.stock_code}</div>
                                            </td>
                                            <td>
                                                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: '280px', wordBreak: 'keep-all', lineHeight: '1.4' }}>
                                                    {s.theme_names ? s.theme_names.split(',').join(', ') : '-'}
                                                </div>
                                            </td>
                                            <td className="signal-price" style={{ fontWeight: 600 }}>{Number(s.close || 0).toLocaleString()}</td>
                                            <td className="signal-price" style={{ fontSize: '0.82rem' }}>{formatMoney(s.trade_value)}</td>
                                            <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: s.val_top300 === 'Y' ? '#22c55e' : 'var(--text-secondary)' }}>
                                                {s.val_rank || '-'}
                                                {s.val_top300 === 'Y' && <span style={{ fontSize: '0.65rem', marginLeft: '4px', color: '#22c55e' }}>TOP</span>}
                                            </td>
                                            <td>
                                                <span className={`signal-change ${progSupply >= 0 ? 'change-up' : 'change-down'}`}>
                                                    {formatMoney(s.program_supply)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`signal-change ${fiSupply >= 0 ? 'change-up' : 'change-down'}`}>
                                                    {s.foreign_inst_supply != null ? formatMoney(s.foreign_inst_supply) : '-'}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{
                                                    fontFamily: 'var(--font-mono)', fontWeight: 700,
                                                    color: zScore <= -2.5 ? '#ef4444' : zScore <= -2 ? '#f59e0b' : '#22c55e'
                                                }}>
                                                    {zScore.toFixed(2)}
                                                </span>
                                            </td>
                                            <td><span className={`signal-badge ${s.abc_all === 'Y' ? 'badge-yes' : 'badge-no'}`}>{s.abc_all}</span></td>
                                            <td><span className={`signal-badge ${s.accum_signal === 'Y' ? 'badge-yes' : 'badge-no'}`}>{s.accum_signal}</span></td>
                                            <td><span className={`signal-badge ${s.supply_buy === 'Y' ? 'badge-yes' : 'badge-no'}`}>{s.supply_buy}</span></td>
                                            <td>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '280px', wordBreak: 'keep-all', lineHeight: '1.4' }}>
                                                    {s.invest_strategy || '-'}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
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

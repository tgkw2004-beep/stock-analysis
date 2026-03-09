import { useState, useEffect, useCallback, useRef } from 'react';
import {
    Search, TrendingUp, BarChart3, DollarSign, Globe, Tag,
    ArrowUpRight, ArrowDownRight, Minus, Loader2, X,
} from 'lucide-react';
import {
    ComposedChart, Line, Bar, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, ReferenceLine, Legend,
    AreaChart, BarChart, LineChart, Cell,
} from 'recharts';

const API_BASE = 'http://localhost:3001';

// ── 디바운스 훅 ──
function useDebounce(value, delay) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

// ── 숫자 포맷 ──
const fmt = (n) => n != null ? Number(n).toLocaleString('ko-KR') : '-';
const fmtBig = (n) => {
    if (n == null) return '-';
    const abs = Math.abs(Number(n));
    if (abs >= 1e12) return (Number(n) / 1e12).toFixed(1) + '조';
    if (abs >= 1e8) return (Number(n) / 1e8).toFixed(0) + '억';
    if (abs >= 1e4) return (Number(n) / 1e4).toFixed(0) + '만';
    return fmt(n);
};

// ── 커스텀 캔들 차트 ──
const CustomCandlestick = (props) => {
    const { x, y, width, height, payload, value } = props;

    // Grab exactly from payload to avoid array mapping issues in Bar dataKey
    const p = payload && payload.payload ? payload.payload : payload;

    if (x == null || y == null || width == null || height == null || Number.isNaN(x) || Number.isNaN(y)) {
        return (
            <g className="candlestick-debug-bad-coords">
                {x != null ? <rect x={x} y={100} width={10} height={10} fill="yellow" /> : null}
            </g>
        );
    }
    if (!p) {
        return <rect x={x} y={200} width={10} height={10} fill="fuchsia" />;
    }

    // Grab exactly from payload to avoid array mapping issues in Bar dataKey
    const o = p.open !== undefined ? p.open : y;
    const c = p.close !== undefined ? p.close : y;
    const h = p.high !== undefined ? p.high : Math.max(o, c);
    const l = p.low !== undefined ? p.low : Math.min(o, c);

    const isGrowing = c >= o;
    const color = isGrowing ? '#ef4444' : '#3b82f6';

    const diff = Math.abs(h - l);
    // Add a minimum Y scale if chart scaling creates 0 diff
    const yMax = y + height;
    const yMin = y;

    // Convert logic to use min(Y) / max(Y) relative coordinates directly if possible.
    // If we rely on the chart's total height, it means `height` is the diff between the max and min of the Y axis? No, for Bar, `height` is usually based on `dataKey`.
    // Wait, if dataKey is `close`, `y` is the pixel for `close`, and `height` is the pixel diff from 0! This is completely wrong for candlestick math.

    // To properly draw a Candlestick without full pixel coordinates of each price point, we must give Recharts all data points.
    // Let's go back to dataKey='range' but ensure the data is parsed as Numbers.
    const openPx = y + height - ((o - l) / diff) * height;
    const oPx = diff === 0 ? y : openPx;

    const closePx = y + height - ((c - l) / diff) * height;
    const cPx = diff === 0 ? y : closePx;

    const bodyTop = Math.min(oPx, cPx);
    const bodyBottom = Math.max(oPx, cPx);
    const bodyHeight = Math.max(bodyBottom - bodyTop, 1);

    const candWidth = Math.max(width * 0.7, 3);
    const offsetX = x + width / 2 - candWidth / 2;
    const centerX = x + width / 2;

    const wickBottom = Math.max(y + height, y + 1);

    return (
        <g stroke={color} fill={color} className="candlestick">
            <line x1={centerX} y1={y} x2={centerX} y2={wickBottom} strokeWidth={1} />
            <rect x={offsetX} y={bodyTop} width={candWidth} height={bodyHeight} stroke="none" />
        </g>
    );
};

const TABS = [
    { key: 'info', label: '종목정보', icon: TrendingUp },
    { key: 'volume', label: '거래량', icon: BarChart3 },
    { key: 'financial', label: '재무정보', icon: DollarSign },
    { key: 'network', label: '네트워크', icon: Globe },
    { key: 'theme', label: '업종/테마', icon: Tag },
];

const PERIODS = [
    { key: 'daily', label: '일' },
    { key: 'weekly', label: '주' },
    { key: 'monthly', label: '월' },
    { key: 'yearly', label: '년' },
];

// ═══════════════════════════════════════════
// 메인 컴포넌트
// ═══════════════════════════════════════════
export default function StockSearch() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selected, setSelected] = useState(null); // { stock_code, stock_name, ... }
    const [activeTab, setActiveTab] = useState('info');
    const [period, setPeriod] = useState('daily');
    const [loading, setLoading] = useState(false);

    // 탭별 데이터
    const [chartData, setChartData] = useState([]);
    const [stockInfo, setStockInfo] = useState(null);
    const [investorData, setInvestorData] = useState([]);
    const [investorDailyData, setInvestorDailyData] = useState([]);
    const [financialData, setFinancialData] = useState(null);
    const [foreignData, setForeignData] = useState(null);
    const [themeData, setThemeData] = useState(null);

    const searchRef = useRef(null);
    const debouncedQuery = useDebounce(query, 300);

    // 자동완성
    useEffect(() => {
        if (!debouncedQuery || debouncedQuery.length < 1) {
            setSuggestions([]);
            return;
        }
        fetch(`${API_BASE}/api/stocks/search?q=${encodeURIComponent(debouncedQuery)}`)
            .then(r => r.json())
            .then(d => { if (d.success) setSuggestions(d.data); })
            .catch(() => setSuggestions([]));
    }, [debouncedQuery]);

    // 외부 클릭 시 닫기
    useEffect(() => {
        const handler = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // 종목 선택 시
    const selectStock = useCallback((stock) => {
        setSelected(stock);
        setQuery(stock.stock_name);
        setShowSuggestions(false);
        setActiveTab('info');
        setPeriod('daily');
    }, []);

    // 탭/기간 변경 시 데이터 로드
    useEffect(() => {
        if (!selected) return;
        const code = selected.stock_code;
        setLoading(true);

        const fetches = [];

        if (activeTab === 'info') {
            fetches.push(
                fetch(`${API_BASE}/api/stocks/${code}/chart?period=${period}`)
                    .then(r => r.json()).then(d => { if (d.success) setChartData(d.data); }),
                fetch(`${API_BASE}/api/stocks/${code}/info`)
                    .then(r => r.json()).then(d => { if (d.success) setStockInfo(d); }),
            );
        } else if (activeTab === 'volume') {
            fetches.push(
                fetch(`${API_BASE}/api/stocks/${code}/chart?period=${period}`)
                    .then(r => r.json()).then(d => { if (d.success) setChartData(d.data); }),
                fetch(`${API_BASE}/api/stocks/${code}/investors`)
                    .then(r => r.json()).then(d => { if (d.success) setInvestorData(d.data); }),
                fetch(`${API_BASE}/api/stocks/${code}/investors/daily`)
                    .then(r => r.json()).then(d => { if (d.success) setInvestorDailyData(d.data); }),
            );
        } else if (activeTab === 'financial') {
            fetches.push(
                fetch(`${API_BASE}/api/stocks/${code}/financial`)
                    .then(r => r.json()).then(d => { if (d.success) setFinancialData(d); }),
            );
        } else if (activeTab === 'network') {
            fetches.push(
                fetch(`${API_BASE}/api/stocks/${code}/foreign`)
                    .then(r => r.json()).then(d => { if (d.success) setForeignData(d); }),
            );
        } else if (activeTab === 'theme') {
            fetches.push(
                fetch(`${API_BASE}/api/stocks/${code}/themes`)
                    .then(r => r.json()).then(d => { if (d.success) setThemeData(d); }),
            );
        }

        Promise.all(fetches).finally(() => setLoading(false));
    }, [selected, activeTab, period]);

    // ── 커스텀 툴팁 ──
    const ChartTooltip = ({ active, payload, label, showOhlc = false }) => {
        if (!active || !payload?.length) return null;
        const data = payload[0].payload;
        return (
            <div className="custom-tooltip" style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '6px' }}>
                <div className="label" style={{ marginBottom: '6px', color: '#94a3b8', fontSize: '0.75rem' }}>{label}</div>
                {showOhlc && data.open != null && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', fontSize: '0.82rem', marginBottom: '6px', paddingBottom: '6px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ color: '#fff' }}>시가: <span style={{ fontWeight: 600 }}>{fmt(data.open)}</span></div>
                        <div style={{ color: '#ef4444' }}>고가: <span style={{ fontWeight: 600 }}>{fmt(data.high)}</span></div>
                        <div style={{ color: '#3b82f6' }}>저가: <span style={{ fontWeight: 600 }}>{fmt(data.low)}</span></div>
                        <div style={{ color: data.close >= data.open ? '#ef4444' : '#3b82f6' }}>종가: <span style={{ fontWeight: 600 }}>{fmt(data.close)}</span></div>
                    </div>
                )}
                {payload.filter(p => p.name !== '캔들' && p.name !== 'Bar' && !Array.isArray(p.value)).map((p, i) => (
                    <div key={i} style={{ color: p.color, fontSize: '0.82rem', fontWeight: 600, marginTop: '2px' }}>
                        {p.name}: {fmt(p.value)}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="page-enter stock-search-page">
            {/* ── 검색바 ── */}
            <div className="stock-search-bar-container" ref={searchRef}>
                <div className="stock-search-input-wrapper">
                    <Search size={20} className="stock-search-icon" />
                    <input
                        type="text"
                        className="stock-search-input"
                        placeholder="기업명 또는 종목코드를 입력하세요 (예: 삼성전자, 005930)"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
                        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    />
                    {query && (
                        <button className="stock-search-clear" onClick={() => { setQuery(''); setSuggestions([]); setSelected(null); }}>
                            <X size={16} />
                        </button>
                    )}
                </div>

                {showSuggestions && suggestions.length > 0 && (
                    <div className="stock-search-dropdown">
                        {suggestions.map(s => (
                            <div
                                key={s.stock_code}
                                className="stock-search-suggestion"
                                onClick={() => selectStock(s)}
                            >
                                <span className="suggestion-name">{s.stock_name}</span>
                                <span className="suggestion-code">{s.stock_code}</span>
                                <span className={`suggestion-market ${s.corp_cls === 'Y' ? 'kospi' : 'kosdaq'}`}>
                                    {s.corp_cls === 'Y' ? 'KOSPI' : s.corp_cls === 'K' ? 'KOSDAQ' : '기타'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── 종목 미선택 시 ── */}
            {!selected && (
                <div className="stock-search-empty">
                    <div className="empty-icon">🔍</div>
                    <h3>종목을 검색하세요</h3>
                    <p>기업명이나 종목코드를 입력하면 상세 정보를 확인할 수 있습니다</p>
                </div>
            )}

            {/* ── 종목 선택 후 ── */}
            {selected && (
                <>
                    {/* 종목 헤더 */}
                    {stockInfo && stockInfo.info && (
                        <div className="stock-header-card">
                            <div className="stock-header-left">
                                <h2 className="stock-header-name">{stockInfo.info.stock_name}</h2>
                                <span className="stock-header-code">{stockInfo.info.stock_code}</span>
                                <span className={`stock-header-market ${stockInfo.info.corp_cls === 'Y' ? 'kospi' : 'kosdaq'}`}>
                                    {stockInfo.info.corp_cls === 'Y' ? 'KOSPI' : 'KOSDAQ'}
                                </span>
                            </div>
                            {stockInfo.price && (
                                <div className="stock-header-right">
                                    <div className="stock-header-price">{fmt(stockInfo.price.close)}</div>
                                    <div className="stock-header-date">기준일: {stockInfo.price.date}</div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 탭 바 */}
                    <div className="stock-tabs">
                        {TABS.map(t => (
                            <button
                                key={t.key}
                                className={`stock-tab ${activeTab === t.key ? 'active' : ''}`}
                                onClick={() => setActiveTab(t.key)}
                            >
                                <t.icon size={16} />
                                <span>{t.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* 로딩 */}
                    {loading && (
                        <div className="stock-loading">
                            <Loader2 size={32} className="spin-icon" />
                            <span>데이터 로딩 중...</span>
                        </div>
                    )}

                    {/* ══════ 탭 컨텐츠 ══════ */}
                    {!loading && (
                        <div className="stock-tab-content">
                            {/* ①  종목정보 탭  */}
                            {activeTab === 'info' && (
                                <div className="tab-info">
                                    {/* 기간 선택 */}
                                    <div className="chart-period-bar">
                                        {PERIODS.map(p => (
                                            <button
                                                key={p.key}
                                                className={`period-btn ${period === p.key ? 'active' : ''}`}
                                                onClick={() => setPeriod(p.key)}
                                            >{p.label}</button>
                                        ))}
                                    </div>

                                    {/* 밸류에이션 카드 */}
                                    {stockInfo?.fundamental && (
                                        <div className="valuation-cards">
                                            {[
                                                { label: 'PER', value: stockInfo.fundamental.per, suffix: '배' },
                                                { label: 'EPS', value: stockInfo.fundamental.eps, suffix: '원' },
                                                { label: 'BPS', value: stockInfo.fundamental.bps, suffix: '원' },
                                                { label: '배당률', value: stockInfo.fundamental.div, suffix: '%' },
                                            ].map(v => (
                                                <div className="val-card" key={v.label}>
                                                    <div className="val-label">{v.label}</div>
                                                    <div className="val-value">{v.value != null ? fmt(v.value) : '-'}<span className="val-suffix">{v.suffix}</span></div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* 주가 차트 */}
                                    <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
                                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                            <div className="card-title">📈 주가 차트</div>
                                            <div className="chart-legend" style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: '#94a3b8', flexWrap: 'wrap' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: '#ef4444', borderRadius: '2px' }}></span>양봉(상승)</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: '#3b82f6', borderRadius: '2px' }}></span>음봉(하락)</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ display: 'inline-block', width: '12px', height: '2px', backgroundColor: '#f59e0b' }}></span>MA5</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ display: 'inline-block', width: '12px', height: '2px', backgroundColor: '#06b6d4' }}></span>MA20</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ display: 'inline-block', width: '12px', height: '2px', backgroundColor: '#a855f7' }}></span>MA60</div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <ResponsiveContainer width="100%" height={350}>
                                                <ComposedChart data={chartData.map(d => ({ ...d, range: [d.low, d.high] }))}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                                    <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
                                                    <YAxis domain={['auto', 'auto']} tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} tickFormatter={v => fmtBig(v)} />
                                                    <Tooltip content={<ChartTooltip showOhlc={true} />} />
                                                    {/* 캔들스틱 (오류방지 방어코드 적용된 커스텀 SVG) */}
                                                    <Bar dataKey="range" name="캔들" fill="transparent" shape={<CustomCandlestick />} isAnimationActive={false} />
                                                    <Line type="monotone" dataKey="ma5" name="MA5" stroke="#f59e0b" dot={false} strokeWidth={1.5} />
                                                    <Line type="monotone" dataKey="ma20" name="MA20" stroke="#06b6d4" dot={false} strokeWidth={1.5} />
                                                    <Line type="monotone" dataKey="ma60" name="MA60" stroke="#a855f7" dot={false} strokeWidth={1.5} />
                                                </ComposedChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* MACD 차트 */}
                                    <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
                                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                            <div className="card-title">📊 MACD</div>
                                            <div className="chart-legend" style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: '#94a3b8', flexWrap: 'wrap' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ display: 'inline-block', width: '12px', height: '2px', backgroundColor: '#0ea5e9' }}></span>MACD(12, 26)</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ display: 'inline-block', width: '12px', height: '2px', borderTop: '2px dashed #f59e0b' }}></span>Signal(9)</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: '#22c55e44' }}></span>히스토그램(+)</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: '#ef444444' }}></span>히스토그램(-)</div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <ResponsiveContainer width="100%" height={200}>
                                                <ComposedChart data={chartData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                                    <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
                                                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
                                                    <Tooltip content={<ChartTooltip />} />
                                                    <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" />
                                                    <Bar dataKey="histogram" name="Histogram">
                                                        {chartData.map((entry, i) => (
                                                            <Cell key={i} fill={entry.histogram >= 0 ? '#22c55e44' : '#ef444444'} />
                                                        ))}
                                                    </Bar>
                                                    <Line type="monotone" dataKey="macd" name="MACD" stroke="#0ea5e9" dot={false} strokeWidth={2} />
                                                    <Line type="monotone" dataKey="signal" name="Signal" stroke="#f59e0b" dot={false} strokeWidth={1.5} strokeDasharray="4 2" />
                                                </ComposedChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* RSI 차트 */}
                                    <div className="card">
                                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                            <div className="card-title">📉 RSI</div>
                                            <div className="chart-legend" style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: '#94a3b8', flexWrap: 'wrap' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ display: 'inline-block', width: '12px', height: '2px', backgroundColor: '#a855f7' }}></span>RSI(14)</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ display: 'inline-block', width: '12px', height: '2px', borderTop: '2px dashed #ef4444' }}></span>과매수(70)</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ display: 'inline-block', width: '12px', height: '2px', borderTop: '2px dashed #22c55e' }}></span>과매도(30)</div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <ResponsiveContainer width="100%" height={180}>
                                                <AreaChart data={chartData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                                    <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
                                                    <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
                                                    <Tooltip content={<ChartTooltip />} />
                                                    <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="4 4" label={{ value: '과매수(70)', fill: '#ef4444', fontSize: 11, position: 'right' }} />
                                                    <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="4 4" label={{ value: '과매도(30)', fill: '#22c55e', fontSize: 11, position: 'right' }} />
                                                    <Area type="monotone" dataKey="rsi" name="RSI" stroke="#a855f7" fill="rgba(168,85,247,0.1)" strokeWidth={2} dot={false} />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ② 거래량 탭 */}
                            {activeTab === 'volume' && (
                                <div className="tab-volume">
                                    <div className="chart-period-bar">
                                        {PERIODS.map(p => (
                                            <button key={p.key} className={`period-btn ${period === p.key ? 'active' : ''}`}
                                                onClick={() => setPeriod(p.key)}>{p.label}</button>
                                        ))}
                                    </div>

                                    {/* 거래량 차트 */}
                                    <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
                                        <div className="card-header"><div className="card-title">📊 거래량 추이</div></div>
                                        <div className="card-body">
                                            <ResponsiveContainer width="100%" height={250}>
                                                <BarChart data={chartData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                                    <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
                                                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} tickFormatter={v => fmtBig(v)} />
                                                    <Tooltip content={<ChartTooltip />} />
                                                    <Bar dataKey="volume" name="거래량" fill="rgba(6,182,212,0.5)" radius={[2, 2, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* 투자자별 매매동향 내역 (테이블) */}
                                    <div className="card">
                                        <div className="card-header">
                                            <div className="card-title">📋 투자자별 순매수 거래량 (최근 20일)</div>
                                        </div>
                                        <div className="card-body-np">
                                            {investorDailyData.length > 0 ? (
                                                <table className="signal-table">
                                                    <thead>
                                                        <tr>
                                                            <th rowSpan="2">일자</th>
                                                            <th rowSpan="2">개인</th>
                                                            <th colSpan="3" style={{ textAlign: 'center', borderBottom: '1px solid var(--border-subtle)', borderLeft: '1px solid var(--border-subtle)' }}>외국인 + 기관</th>
                                                        </tr>
                                                        <tr>
                                                            <th style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>합계</th>
                                                            <th>외국인</th>
                                                            <th>기관합계</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {investorDailyData.map((d, i) => (
                                                            <tr key={i}>
                                                                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{d.date}</td>
                                                                <td className={d.individual > 0 ? 'text-up' : d.individual < 0 ? 'text-down' : ''} style={{ fontWeight: 600 }}>
                                                                    {fmtBig(d.individual)}
                                                                </td>
                                                                <td className={d.total_fi > 0 ? 'text-up' : d.total_fi < 0 ? 'text-down' : ''} style={{ fontWeight: 700, backgroundColor: 'rgba(255,255,255,0.02)' }}>
                                                                    {fmtBig(d.total_fi)}
                                                                </td>
                                                                <td className={d.foreign > 0 ? 'text-up' : d.foreign < 0 ? 'text-down' : ''} style={{ fontWeight: 500, fontSize: '0.9rem', opacity: 0.9 }}>
                                                                    {fmtBig(d.foreign)}
                                                                </td>
                                                                <td className={d.institutional > 0 ? 'text-up' : d.institutional < 0 ? 'text-down' : ''} style={{ fontWeight: 500, fontSize: '0.9rem', opacity: 0.9 }}>
                                                                    {fmtBig(d.institutional)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : <div className="no-data">상세 매매 내역이 없습니다.</div>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ③ 재무정보 탭 */}
                            {activeTab === 'financial' && financialData && (
                                <div className="tab-financial">
                                    {/* F-Score */}
                                    {financialData.fscore?.length > 0 && (
                                        <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
                                            <div className="card-header"><div className="card-title">🏆 Piotroski F-Score</div></div>
                                            <div className="card-body">
                                                <div className="fscore-grid">
                                                    {financialData.fscore.map(f => (
                                                        <div key={f.bsns_year} className="fscore-card">
                                                            <div className="fscore-year">{f.bsns_year}</div>
                                                            <div className={`fscore-value ${f.f_score >= 7 ? 'good' : f.f_score >= 4 ? 'normal' : 'bad'}`}>
                                                                {f.f_score}<span>/9</span>
                                                            </div>
                                                            <div className="fscore-details">
                                                                <span>ROA: {f.roa != null ? Number(f.roa).toFixed(2) + '%' : '-'}</span>
                                                                <span>GPM: {f.gpm != null ? Number(f.gpm).toFixed(2) + '%' : '-'}</span>
                                                            </div>
                                                            <div className="fscore-flags">
                                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                                                                    <span key={n} className={`fscore-flag ${f[`f${n}`] === 1 ? 'pass' : 'fail'}`}>
                                                                        F{n}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 손익계산서 */}
                                    {financialData.income?.length > 0 && (
                                        <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
                                            <div className="card-header"><div className="card-title">📋 손익계산서</div></div>
                                            <div className="card-body-np">
                                                <table className="signal-table">
                                                    <thead>
                                                        <tr><th>항목</th><th>사업연도</th><th>금액</th></tr>
                                                    </thead>
                                                    <tbody>
                                                        {financialData.income.map((r, i) => (
                                                            <tr key={i}>
                                                                <td>{r.account_name || r.account_id}</td>
                                                                <td style={{ fontFamily: 'var(--font-mono)' }}>{r.bsns_year}</td>
                                                                <td className="signal-price">{fmtBig(r.amount)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {/* PER 추이 */}
                                    {financialData.valuation?.length > 0 && (
                                        <div className="card">
                                            <div className="card-header"><div className="card-title">📈 밸류에이션 추이</div></div>
                                            <div className="card-body">
                                                <ResponsiveContainer width="100%" height={250}>
                                                    <LineChart data={[...financialData.valuation].reverse().filter((_, i) => i % 20 === 0)}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                                        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} />
                                                        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
                                                        <Tooltip content={<ChartTooltip />} />
                                                        <Line type="monotone" dataKey="per" name="PER" stroke="#0ea5e9" dot={false} strokeWidth={2} />
                                                        <Legend />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ④ 네트워크 탭 */}
                            {activeTab === 'network' && foreignData && (
                                <div className="tab-network">
                                    {/* 외국인 보유 추이 */}
                                    {foreignData.foreign?.length > 0 && (
                                        <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
                                            <div className="card-header"><div className="card-title">🌍 외국인 보유비율 추이</div></div>
                                            <div className="card-body">
                                                <ResponsiveContainer width="100%" height={250}>
                                                    <AreaChart data={foreignData.foreign}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                                        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} />
                                                        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} unit="%" />
                                                        <Tooltip content={<ChartTooltip />} />
                                                        <Area type="monotone" dataKey="foreign_ratio" name="외국인 비율(%)" stroke="#0ea5e9" fill="rgba(14,165,233,0.15)" strokeWidth={2} dot={false} />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    )}

                                    {/* 공매도 */}
                                    {foreignData.shortSelling?.length > 0 && (
                                        <div className="card">
                                            <div className="card-header"><div className="card-title">📉 공매도 현황</div></div>
                                            <div className="card-body">
                                                <ResponsiveContainer width="100%" height={250}>
                                                    <ComposedChart data={foreignData.shortSelling}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                                        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} />
                                                        <YAxis yAxisId="left" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} tickFormatter={v => fmtBig(v)} />
                                                        <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} tickFormatter={v => fmtBig(v)} />
                                                        <Tooltip content={<ChartTooltip />} />
                                                        <Bar yAxisId="left" dataKey="short_vol" name="공매도량" fill="rgba(239,68,68,0.4)" />
                                                        <Line yAxisId="right" type="monotone" dataKey="balance_amt" name="공매도 잔고" stroke="#f59e0b" dot={false} strokeWidth={2} />
                                                        <Legend />
                                                    </ComposedChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    )}

                                    {foreignData.foreign?.length === 0 && foreignData.shortSelling?.length === 0 && (
                                        <div className="no-data">네트워크 데이터가 없습니다.</div>
                                    )}
                                </div>
                            )}

                            {/* ⑤ 업종/테마 탭 */}
                            {activeTab === 'theme' && themeData && (
                                <div className="tab-theme">
                                    {/* WICS 산업분류 */}
                                    {themeData.wics && (
                                        <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
                                            <div className="card-header"><div className="card-title">🏭 WICS 산업분류</div></div>
                                            <div className="card-body">
                                                <div className="wics-classification">
                                                    <div className="wics-item">
                                                        <span className="wics-label">대분류</span>
                                                        <span className="wics-value">{themeData.wics.wics_name1 || '-'}</span>
                                                    </div>
                                                    <div className="wics-arrow">→</div>
                                                    <div className="wics-item">
                                                        <span className="wics-label">중분류</span>
                                                        <span className="wics-value">{themeData.wics.wics_name2 || '-'}</span>
                                                    </div>
                                                    <div className="wics-arrow">→</div>
                                                    <div className="wics-item">
                                                        <span className="wics-label">소분류</span>
                                                        <span className="wics-value">{themeData.wics.wics_name3 || '-'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 소속 테마 */}
                                    {themeData.themes?.length > 0 && (
                                        <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
                                            <div className="card-header"><div className="card-title">🏷️ 소속 테마 ({themeData.themes.length}개)</div></div>
                                            <div className="card-body">
                                                <div className="theme-tags">
                                                    {themeData.themes.map(t => {
                                                        const yieldInfo = themeData.themeYields?.find(y => y.theme_name === t.theme_name);
                                                        return (
                                                            <div key={t.theme_code} className="theme-tag-item">
                                                                <span className="theme-tag-name">{t.theme_name}</span>
                                                                {yieldInfo && (
                                                                    <span className={`theme-tag-yield ${yieldInfo.yield >= 0 ? 'up' : 'down'}`}>
                                                                        {yieldInfo.yield >= 0 ? '+' : ''}{yieldInfo.yield}%
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 동일 업종 종목 */}
                                    {themeData.sameIndustry?.length > 0 && (
                                        <div className="card">
                                            <div className="card-header"><div className="card-title">🔗 동일 업종 종목</div></div>
                                            <div className="card-body-np">
                                                <table className="signal-table">
                                                    <thead>
                                                        <tr><th>종목코드</th><th>종목명</th><th>중분류</th><th>소분류</th></tr>
                                                    </thead>
                                                    <tbody>
                                                        {themeData.sameIndustry.map(s => (
                                                            <tr key={s.stock_code} style={{ cursor: 'pointer' }}
                                                                onClick={() => selectStock({ stock_code: s.stock_code, stock_name: s.stock_name })}>
                                                                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>{s.stock_code}</td>
                                                                <td><div className="signal-name">{s.stock_name}</div></td>
                                                                <td style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{s.wics_name2}</td>
                                                                <td style={{ color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>{s.wics_name3}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {!themeData.wics && themeData.themes?.length === 0 && (
                                        <div className="no-data">업종/테마 데이터가 없습니다.</div>
                                    )}
                                </div>
                            )}

                            {/* 데이터 없음 */}
                            {activeTab === 'financial' && !financialData && <div className="no-data">재무정보 데이터가 없습니다.</div>}
                            {activeTab === 'network' && !foreignData && <div className="no-data">네트워크 데이터가 없습니다.</div>}
                            {activeTab === 'theme' && !themeData && <div className="no-data">업종/테마 데이터가 없습니다.</div>}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, ComposedChart, Line,
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Scan, Signal, TrendingUp, Clock } from 'lucide-react';
import {
    marketSummary,
    strategySignals,
    analysisSummary,
    priceHistory,
    strategyMeta,
    configParams,
} from '../data/sampleData';

// 커스텀 툴팁
function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="custom-tooltip">
            <div className="label">{label}</div>
            {payload.map((p, i) => (
                <div key={i} className="value" style={{ color: p.color }}>
                    {p.name}: {Number(p.value).toLocaleString()}
                </div>
            ))}
        </div>
    );
}

export default function Dashboard() {
    const topSignals = strategySignals.slice(0, 6);

    return (
        <div className="page-enter">
            {/* 시장 바 */}
            <div className="market-bar">
                <div className="market-bar-item">
                    <span className="market-bar-label">KOSPI</span>
                    <span className="market-bar-value">{marketSummary.kospiIndex.toLocaleString()}</span>
                    <span className={`market-bar-change ${marketSummary.kospiChange >= 0 ? 'change-up' : 'change-down'}`}>
                        {marketSummary.kospiChange >= 0 ? '+' : ''}{marketSummary.kospiChange}%
                    </span>
                </div>
                <div className="market-bar-item">
                    <span className="market-bar-label">KOSDAQ</span>
                    <span className="market-bar-value">{marketSummary.kosdaqIndex.toLocaleString()}</span>
                    <span className={`market-bar-change ${marketSummary.kosdaqChange >= 0 ? 'change-up' : 'change-down'}`}>
                        {marketSummary.kosdaqChange >= 0 ? '+' : ''}{marketSummary.kosdaqChange}%
                    </span>
                </div>
                <div className="market-bar-item">
                    <span className="market-bar-label">거래량</span>
                    <span className="market-bar-value">{marketSummary.totalVolume}</span>
                </div>
                <div className="market-bar-item">
                    <span className="market-bar-label">거래대금</span>
                    <span className="market-bar-value">{marketSummary.totalValue}</span>
                </div>
                <div className="market-bar-item">
                    <span className="market-bar-label">상승</span>
                    <span className="market-bar-value change-up">{marketSummary.advancers}</span>
                </div>
                <div className="market-bar-item">
                    <span className="market-bar-label">하락</span>
                    <span className="market-bar-value change-down">{marketSummary.decliners}</span>
                </div>
            </div>

            {/* 통계 카드 */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon" style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>
                            <Scan size={20} />
                        </div>
                        <div className="stat-card-label">총 스캔 종목</div>
                    </div>
                    <div className="stat-card-value">{analysisSummary.total_scanned.toLocaleString()}</div>
                    <div className="stat-card-sub">
                        <Clock size={12} />
                        {configParams.target_date} 기준
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24' }}>
                            <Signal size={20} />
                        </div>
                        <div className="stat-card-label">감지된 신호</div>
                    </div>
                    <div className="stat-card-value">{analysisSummary.signals_found}</div>
                    <div className="stat-card-sub">
                        <TrendingUp size={12} />
                        전략 매칭 성공률 {((analysisSummary.signals_found / analysisSummary.total_scanned) * 100).toFixed(2)}%
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399' }}>
                            <ArrowUpRight size={20} />
                        </div>
                        <div className="stat-card-label">상승 종목</div>
                    </div>
                    <div className="stat-card-value change-up">{marketSummary.advancers}</div>
                    <div className="stat-card-sub">
                        전체 대비 {((marketSummary.advancers / (marketSummary.advancers + marketSummary.decliners + marketSummary.unchanged)) * 100).toFixed(1)}%
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon" style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>
                            <ArrowDownRight size={20} />
                        </div>
                        <div className="stat-card-label">하락 종목</div>
                    </div>
                    <div className="stat-card-value change-down">{marketSummary.decliners}</div>
                    <div className="stat-card-sub">
                        전체 대비 {((marketSummary.decliners / (marketSummary.advancers + marketSummary.decliners + marketSummary.unchanged)) * 100).toFixed(1)}%
                    </div>
                </div>
            </div>

            {/* 메인 그리드 — 차트 + 전략분포 */}
            <div className="dashboard-grid">
                {/* 볼린저 밴드 차트 */}
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">
                            <span className="card-title-icon">📈</span>
                            삼성전자 — Bollinger Band
                        </div>
                        <div className="live-indicator">
                            <span className="live-dot" />
                            LIVE
                        </div>
                    </div>
                    <div className="card-body">
                        <ResponsiveContainer width="100%" height={300}>
                            <ComposedChart data={priceHistory}>
                                <defs>
                                    <linearGradient id="bbFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} />
                                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fill: '#64748b', fontSize: 11 }}
                                    axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                                    tickLine={false}
                                />
                                <YAxis
                                    domain={['dataMin - 1500', 'dataMax + 1500']}
                                    tick={{ fill: '#64748b', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) => (v / 1000).toFixed(0) + 'K'}
                                />
                                <Tooltip content={<ChartTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="bb_upper"
                                    stroke="#6366f1"
                                    strokeWidth={1}
                                    fill="bbFill"
                                    strokeDasharray="4 4"
                                    fillOpacity={0}
                                    name="BB 상단"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="bb_lower"
                                    stroke="#6366f1"
                                    strokeWidth={1}
                                    fill="url(#bbFill)"
                                    strokeDasharray="4 4"
                                    name="BB 하단"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="bb_middle"
                                    stroke="#f59e0b"
                                    strokeWidth={1.5}
                                    dot={false}
                                    strokeDasharray="6 3"
                                    name="BB 중심(20MA)"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="close"
                                    stroke="#22c55e"
                                    strokeWidth={2.5}
                                    dot={false}
                                    name="종가"
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 전략 분포 */}
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">
                            <span className="card-title-icon">🎯</span>
                            전략별 신호 분포
                        </div>
                        <span className="tag-chip">총 {analysisSummary.signals_found}건</span>
                    </div>
                    <div className="strategy-dist-list">
                        {Object.entries(strategyMeta).map(([key, meta]) => {
                            const count = analysisSummary.by_strategy[key] || 0;
                            const pct = (count / analysisSummary.signals_found) * 100;
                            return (
                                <div className="strategy-dist-item" key={key}>
                                    <div
                                        className="strategy-dist-icon"
                                        style={{ background: `${meta.color}22`, color: meta.color }}
                                    >
                                        {meta.icon}
                                    </div>
                                    <div className="strategy-dist-info">
                                        <div className="strategy-dist-name">
                                            <span>{meta.label} <span style={{ color: 'var(--text-tertiary)', fontWeight: 400, fontSize: '0.78rem' }}>— {meta.fullName}</span></span>
                                            <span className="strategy-dist-count" style={{ color: meta.color }}>{count}건</span>
                                        </div>
                                        <div className="strategy-dist-desc">{meta.description}</div>
                                        <div className="strategy-dist-bar">
                                            <div
                                                className="strategy-dist-fill"
                                                style={{ width: `${pct}%`, background: meta.gradient }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 거래량 차트 */}
                <div className="card dashboard-full">
                    <div className="card-header">
                        <div className="card-title">
                            <span className="card-title-icon">📊</span>
                            거래량 추이
                        </div>
                    </div>
                    <div className="card-body">
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={priceHistory}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fill: '#64748b', fontSize: 11 }}
                                    axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: '#64748b', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) => (v / 1000000).toFixed(0) + 'M'}
                                />
                                <Tooltip content={<ChartTooltip />} />
                                <Bar dataKey="volume" name="거래량" fill="#6366f1" radius={[4, 4, 0, 0]} fillOpacity={0.7} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 신호 테이블 — 최근 감지 */}
            <div className="card">
                <div className="card-header">
                    <div className="card-title">
                        <span className="card-title-icon">⚡</span>
                        최근 감지된 전략 신호
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span className="live-indicator">
                            <span className="live-dot" />
                            실시간
                        </span>
                    </div>
                </div>
                <div className="card-body-np">
                    <table className="signal-table">
                        <thead>
                            <tr>
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
                            {topSignals.map((s, i) => (
                                <tr key={i}>
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
                                            <span className="signal-score" style={{ color: strategyMeta[s.strategy]?.color }}>
                                                {s.score.toFixed(2)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="signal-price">{s.close.toLocaleString()}원</td>
                                    <td>
                                        <span className={`signal-change ${s.change >= 0 ? 'change-up' : 'change-down'}`}>
                                            {s.change >= 0 ? '+' : ''}{s.change}%
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

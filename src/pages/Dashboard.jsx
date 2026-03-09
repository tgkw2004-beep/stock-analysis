import React, { useState, useEffect, useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Scan, Clock } from 'lucide-react';
import { strategyMeta } from '../data/sampleData';
import { fetchQuantSummary, fetchQuantDates, fetchQuantStrategies, fetchSupplySummary, fetchDashboardSummary } from '../services/apiService';
import MarketIndices from '../components/MarketIndices';
import TopThemes from '../components/TopThemes';
import EconomicIndicators from '../components/EconomicIndicators';

function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="custom-tooltip">
            <div className="label">{label}</div>
            {payload.map((p, i) => (
                <div key={i} className="value" style={{ color: p.color }}>{p.name}: {Number(p.value).toLocaleString()}</div>
            ))}
        </div>
    );
}

export default function Dashboard() {
    // API 연동 실시간 데이터 상태 관리
    const [dashData, setDashData] = useState({
        indices: null,
        topThemes: null,
        economicIndicators: null,
        loading: true
    });

    const [qData, setQData] = useState({
        dates: [],
        latestDate: '',
        quantSummary: { total: 0, by_strategy: {} },
        supplySummary: { total: 0 },
        topSignals: [],
        loading: true
    });

    useEffect(() => {
        async function loadDashData() {
            setDashData(prev => ({ ...prev, loading: true }));
            const summary = await fetchDashboardSummary();
            if (summary) {
                setDashData({
                    indices: summary.indices,
                    topThemes: summary.topThemes,
                    economicIndicators: summary.economicIndicators,
                    loading: false
                });
            } else {
                setDashData(prev => ({ ...prev, loading: false }));
            }

            setQData(prev => ({ ...prev, loading: true }));
            const [qDates, sSummary] = await Promise.all([
                fetchQuantDates(),
                fetchSupplySummary()
            ]);

            const latest = qDates.length > 0 ? qDates[0].date : '';
            if (latest) {
                const [qSum, sigs] = await Promise.all([
                    fetchQuantSummary(latest),
                    fetchQuantStrategies({ date: latest, sort: 'close', order: 'desc' })
                ]);
                setQData({
                    dates: qDates,
                    latestDate: latest,
                    quantSummary: qSum,
                    supplySummary: sSummary,
                    topSignals: sigs.slice(0, 8),
                    loading: false
                });
            } else {
                setQData(prev => ({ ...prev, loading: false }));
            }
        }
        loadDashData();
    }, []);

    const chartData = useMemo(() => {
        if (!qData.quantSummary || !qData.quantSummary.by_strategy) return [];
        return Object.entries(qData.quantSummary.by_strategy).map(([key, count]) => ({
            name: key, count, fill: strategyMeta[key]?.color || '#6366f1',
        }));
    }, [qData.quantSummary]);

    const calcChange = (s) => {
        const o = Number(s.open);
        const c = Number(s.close);
        if (!o || o === 0) return 0;
        return (((c - o) / o) * 100).toFixed(2);
    };

    return (
        <div className="page-enter">
            {/* 주요지수 */}
            <MarketIndices data={dashData.indices} loading={dashData.loading} />

            {/* 주요테마 */}
            <TopThemes themes={dashData.topThemes} loading={dashData.loading} />

            {/* 기초경제지표 */}
            <EconomicIndicators indicators={dashData.economicIndicators} loading={dashData.loading} />

            {/* 분석 날짜 바 */}
            {qData.loading ? <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>요약 정보를 불러오는 중...</div> : (
                <div className="market-bar">
                    <div className="market-bar-item">
                        <span className="market-bar-label">분석일</span>
                        <span className="market-bar-value">{qData.latestDate}</span>
                    </div>
                    <div className="market-bar-item">
                        <span className="market-bar-label">퀀트 매수</span>
                        <span className="market-bar-value change-up">{qData.quantSummary.total}건</span>
                    </div>
                    <div className="market-bar-item">
                        <span className="market-bar-label">반등 수급</span>
                        <span className="market-bar-value" style={{ color: '#f59e0b' }}>{qData.supplySummary.total}건</span>
                    </div>
                    <div className="market-bar-item">
                        <span className="market-bar-label">OMEGA-R</span>
                        <span className="market-bar-value" style={{ color: strategyMeta['OMEGA-R']?.color }}>{qData.quantSummary.by_strategy['OMEGA-R'] || 0}</span>
                    </div>
                    <div className="market-bar-item">
                        <span className="market-bar-label">ALPHA-S</span>
                        <span className="market-bar-value" style={{ color: strategyMeta['ALPHA-S']?.color }}>{qData.quantSummary.by_strategy['ALPHA-S'] || 0}</span>
                    </div>
                    <div className="market-bar-item">
                        <span className="market-bar-label">SIGMA-T</span>
                        <span className="market-bar-value" style={{ color: strategyMeta['SIGMA-T']?.color }}>{qData.quantSummary.by_strategy['SIGMA-T'] || 0}</span>
                    </div>
                </div>
            )}

            {/* 통계 카드 */}
            <div className="stats-grid">
                {['OMEGA-R', 'ALPHA-S', 'SIGMA-T'].map((key) => {
                    const meta = strategyMeta[key];
                    if (!meta) return null;
                    return (
                        <div className="stat-card" key={key}>
                            <div className="stat-card-header">
                                <div className="stat-card-icon" style={{ background: `${meta.color}22`, color: meta.color, fontSize: '1.3rem' }}>{meta.icon}</div>
                                <div className="stat-card-label">{meta.fullName}</div>
                            </div>
                            <div className="stat-card-value" style={{ color: meta.color }}>{qData.quantSummary.by_strategy[key] || 0}건</div>
                            <div className="stat-card-sub">{meta.description}</div>
                        </div>
                    );
                })}
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon" style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}><Scan size={20} /></div>
                        <div className="stat-card-label">총 신호</div>
                    </div>
                    <div className="stat-card-value">{qData.quantSummary.total + qData.supplySummary.total}</div>
                    <div className="stat-card-sub"><Clock size={12} />{qData.latestDate} 기준</div>
                </div>
            </div>

            {/* 메인 그리드 */}
            <div className="dashboard-grid">
                <div className="card">
                    <div className="card-header">
                        <div className="card-title"><span className="card-title-icon">📊</span>퀀트 매수 전략별 분포</div>
                        <span className="tag-chip">총 {qData.quantSummary.total}건</span>
                    </div>
                    <div className="card-body">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<ChartTooltip />} />
                                <Bar dataKey="count" name="신호 수" radius={[6, 6, 0, 0]} fillOpacity={0.85}>
                                    {chartData.map((entry, idx) => <rect key={idx} fill={entry.fill} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <div className="card-title"><span className="card-title-icon">🎯</span>전략 상세</div>
                    </div>
                    <div className="strategy-dist-list">
                        {Object.entries(strategyMeta).filter(([key]) => ['OMEGA-R', 'ALPHA-S', 'SIGMA-T'].includes(key)).map(([key, meta]) => {
                            const count = qData.quantSummary.by_strategy[key] || 0;
                            const pct = qData.quantSummary.total > 0 ? (count / qData.quantSummary.total) * 100 : 0;
                            return (
                                <div className="strategy-dist-item" key={key}>
                                    <div className="strategy-dist-icon" style={{ background: `${meta.color}22`, color: meta.color }}>{meta.icon}</div>
                                    <div className="strategy-dist-info">
                                        <div className="strategy-dist-name">
                                            <span>{meta.label} <span style={{ color: 'var(--text-tertiary)', fontWeight: 400, fontSize: '0.78rem' }}>— {meta.fullName}</span></span>
                                            <span className="strategy-dist-count" style={{ color: meta.color }}>{count}건 ({pct.toFixed(1)}%)</span>
                                        </div>
                                        <div className="strategy-dist-desc">{meta.description}</div>
                                        <div className="strategy-dist-bar"><div className="strategy-dist-fill" style={{ width: `${pct}%`, background: meta.gradient }} /></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 날짜별 신호 추이 */}
                <div className="card dashboard-full">
                    <div className="card-header"><div className="card-title"><span className="card-title-icon">📈</span>날짜별 퀀트 신호 추이</div></div>
                    <div className="card-body">
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={[...qData.dates].slice(0, 20).reverse()}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} tickFormatter={v => v.slice(5)} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<ChartTooltip />} />
                                <Bar dataKey="count" name="신호 수" fill="#6366f1" radius={[4, 4, 0, 0]} fillOpacity={0.7} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 신호 테이블 */}
            <div className="card">
                <div className="card-header">
                    <div className="card-title"><span className="card-title-icon">⚡</span>{qData.latestDate} 퀀트 매수 신호</div>
                    <span className="tag-chip">{qData.topSignals.length}건</span>
                </div>
                <div className="card-body-np">
                    <table className="signal-table">
                        <thead><tr><th>종목</th><th>업종</th><th>전략</th><th>시가</th><th>고가</th><th>저가</th><th>종가</th><th>등락률</th></tr></thead>
                        <tbody>
                            {qData.topSignals.map((s, i) => {
                                const change = calcChange(s);
                                const meta = strategyMeta[s.strategy];
                                return (
                                    <tr key={i}>
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
            </div>
        </div>
    );
}

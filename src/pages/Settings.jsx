import { useState } from 'react';
import { Save, RotateCcw, Database, Cpu, Shield, Clock } from 'lucide-react';
import { configParams, strategyMeta } from '../data/sampleData';

export default function Settings() {
    const [params, setParams] = useState({ ...configParams });
    const [saved, setSaved] = useState(false);

    const handleChange = (key, value) => {
        setParams((prev) => ({ ...prev, [key]: value }));
        setSaved(false);
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleReset = () => {
        setParams({ ...configParams });
        setSaved(false);
    };

    return (
        <div className="page-enter">
            {/* 파라미터 설정 */}
            <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
                <div className="card-header">
                    <div className="card-title">
                        <span className="card-title-icon">⚙️</span>
                        전략 파라미터 설정
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-outline" onClick={handleReset}>
                            <RotateCcw size={14} />
                            초기화
                        </button>
                        <button className="btn btn-primary" onClick={handleSave}>
                            <Save size={14} />
                            {saved ? '저장됨 ✓' : '저장'}
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="config-grid">
                        <div className="config-item">
                            <div className="config-label">Squeeze 임계값</div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={params.squeeze_limit}
                                onChange={(e) => handleChange('squeeze_limit', parseFloat(e.target.value))}
                                style={{ width: '100%', accentColor: '#6366f1', marginBottom: '8px' }}
                            />
                            <div className="config-value">{params.squeeze_limit}</div>
                        </div>
                        <div className="config-item">
                            <div className="config-label">ADX 기준값</div>
                            <input
                                type="range"
                                min="10"
                                max="50"
                                step="1"
                                value={params.adx_threshold}
                                onChange={(e) => handleChange('adx_threshold', parseInt(e.target.value))}
                                style={{ width: '100%', accentColor: '#f59e0b', marginBottom: '8px' }}
                            />
                            <div className="config-value">{params.adx_threshold}</div>
                        </div>
                        <div className="config-item">
                            <div className="config-label">MFI 기준값</div>
                            <input
                                type="range"
                                min="50"
                                max="100"
                                step="1"
                                value={params.mfi_threshold}
                                onChange={(e) => handleChange('mfi_threshold', parseInt(e.target.value))}
                                style={{ width: '100%', accentColor: '#10b981', marginBottom: '8px' }}
                            />
                            <div className="config-value">{params.mfi_threshold}</div>
                        </div>
                        <div className="config-item">
                            <div className="config-label">분석 대상일</div>
                            <input
                                type="date"
                                value={params.target_date}
                                onChange={(e) => handleChange('target_date', e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'var(--bg-input)',
                                    border: '1px solid var(--border-default)',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: '8px 12px',
                                    color: 'var(--text-primary)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    marginBottom: '8px',
                                }}
                            />
                            <div className="config-value" style={{ fontSize: '0.85rem' }}>{params.target_date}</div>
                        </div>
                        <div className="config-item">
                            <div className="config-label">대상 시장</div>
                            <select
                                value={params.market}
                                onChange={(e) => handleChange('market', e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'var(--bg-input)',
                                    border: '1px solid var(--border-default)',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: '8px 12px',
                                    color: 'var(--text-primary)',
                                    fontFamily: 'var(--font-sans)',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    marginBottom: '8px',
                                }}
                            >
                                <option value="KOSPI">KOSPI</option>
                                <option value="KOSDAQ">KOSDAQ</option>
                                <option value="ALL">전체</option>
                            </select>
                            <div className="config-value" style={{ fontSize: '0.85rem' }}>{params.market}</div>
                        </div>
                        <div className="config-item">
                            <div className="config-label">회고 기간 (영업일)</div>
                            <input
                                type="range"
                                min="60"
                                max="252"
                                step="1"
                                value={params.lookback_days}
                                onChange={(e) => handleChange('lookback_days', parseInt(e.target.value))}
                                style={{ width: '100%', accentColor: '#a855f7', marginBottom: '8px' }}
                            />
                            <div className="config-value">{params.lookback_days}일</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 전략 설명 */}
            <div className="dashboard-grid">
                {Object.entries(strategyMeta).map(([key, meta]) => (
                    <div className="card" key={key}>
                        <div className="card-header" style={{ borderBottom: `2px solid ${meta.color}33` }}>
                            <div className="card-title">
                                <span style={{ fontSize: '1.3rem' }}>{meta.icon}</span>
                                <span>{meta.label}</span>
                                <span className={`strategy-badge ${key}`}>{meta.fullName}</span>
                            </div>
                        </div>
                        <div className="card-body">
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.88rem' }}>
                                {meta.description}
                            </p>
                            <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {key === 'OMEGA-R' && (
                                    <>
                                        <span className="tag-chip">하단밴드 터치</span>
                                        <span className="tag-chip">MACD Histogram 반등</span>
                                        <span className="tag-chip">과매도 상태</span>
                                    </>
                                )}
                                {key === 'ALPHA-S' && (
                                    <>
                                        <span className="tag-chip">Bandwidth Squeeze</span>
                                        <span className="tag-chip">상방 돌파</span>
                                        <span className="tag-chip">6개월 수축</span>
                                    </>
                                )}
                                {key === 'SIGMA-T' && (
                                    <>
                                        <span className="tag-chip">ADX ≥ {params.adx_threshold}</span>
                                        <span className="tag-chip">MFI ≥ {params.mfi_threshold}</span>
                                        <span className="tag-chip">BB 중심선 상회</span>
                                    </>
                                )}
                                {key === 'Piercing' && (
                                    <>
                                        <span className="tag-chip">MA3 × MA224</span>
                                        <span className="tag-chip">Golden Cross</span>
                                        <span className="tag-chip">추세 대반전</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 시스템 정보 */}
            <div className="card" style={{ marginTop: 'var(--space-xl)' }}>
                <div className="card-header">
                    <div className="card-title">
                        <span className="card-title-icon">🖥️</span>
                        시스템 정보
                    </div>
                </div>
                <div className="card-body">
                    <div className="config-grid">
                        <div className="config-item" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Database size={20} style={{ color: 'var(--accent-indigo)' }} />
                            <div>
                                <div className="config-label">엔진</div>
                                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>strategy_engine.py v1.0</div>
                            </div>
                        </div>
                        <div className="config-item" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Cpu size={20} style={{ color: 'var(--accent-amber)' }} />
                            <div>
                                <div className="config-label">PAC</div>
                                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Bollinger Band 3대 전략</div>
                            </div>
                        </div>
                        <div className="config-item" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Shield size={20} style={{ color: 'var(--accent-emerald)' }} />
                            <div>
                                <div className="config-label">소수점 정밀도</div>
                                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>4자리 (ROUND(x, 4))</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

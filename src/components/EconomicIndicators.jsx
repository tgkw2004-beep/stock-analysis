import React, { useState, useEffect } from 'react';
import { getEconomicIndicators } from '../services/apiService';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import '../index.css';

const EconomicIndicators = () => {
    const [indicators, setIndicators] = useState([]);

    useEffect(() => {
        try {
            const data = getEconomicIndicators();
            setIndicators(data || []);
        } catch (err) {
            console.error('기초경제지표 로드 실패:', err);
        }
    }, []);

    if (!indicators || indicators.length === 0) {
        return null; // 데이터가 없으면 렌더링하지 않음
    }

    // 지표 이름에 따른 아이콘 매핑
    const getIcon = (name) => {
        if (name.includes('달러')) return <DollarSign className="indicator-icon" size={16} />;
        if (name.includes('엔')) return <DollarSign className="indicator-icon" size={16} />;
        if (name.includes('금리')) return <Activity className="indicator-icon" size={16} />;
        return <Activity className="indicator-icon" size={16} />;
    };

    const currentYear = new Date().getFullYear();

    return (
        <div className="economic-indicators-container fade-in delay-200">
            <div className="section-header">
                <h2 className="section-title">기초경제지표 <span>(환율·금리·물가)</span></h2>
            </div>

            <div className="indicators-row">
                {indicators.map((item, idx) => {
                    const isUp = item.change > 0;
                    const isDown = item.change < 0;
                    const isSame = item.change === 0;

                    return (
                        <div key={idx} className="indicator-item glass-panel hover-grow">
                            <div className="indicator-header">
                                {getIcon(item.name)}
                                <span className="indicator-name">{item.name}</span>
                                <span className="indicator-date">{item.date ? item.date.replace(currentYear + '-', '') : ''} 기준</span>
                            </div>
                            <div className="indicator-value-container">
                                <span className="indicator-value">
                                    {item.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    <span className="indicator-suffix">{item.suffix}</span>
                                </span>
                            </div>

                            <div className={`indicator-change ${isUp ? 'text-up' : isDown ? 'text-down' : 'text-neutral'}`}>
                                {isUp ? <TrendingUp size={14} /> : isDown ? <TrendingDown size={14} /> : null}
                                <span className="change-value">
                                    {isUp ? '+' : ''}{item.change.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                                <span className="change-percent">
                                    ({isUp ? '+' : ''}{item.changePercent.toFixed(2)}%)
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EconomicIndicators;

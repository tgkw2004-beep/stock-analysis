// 데이터 서비스 — 빌드타임 DB 데이터 사용
import dbData from '../data/dbData.json';

// ─── 퀀트 매수 전략 ───
export function getQuantStrategies({ strategy, date, sort = 'date', order = 'desc' } = {}) {
    let filtered = [...dbData.quant.data];
    if (strategy && strategy !== 'ALL') filtered = filtered.filter(d => d.strategy === strategy);
    if (date) filtered = filtered.filter(d => d.date === date);

    const mult = order === 'desc' ? -1 : 1;
    filtered.sort((a, b) => {
        if (sort === 'close') return (a.close - b.close) * mult;
        if (sort === 'stock_name') return a.stock_name.localeCompare(b.stock_name) * mult;
        return 0;
    });
    return filtered;
}

export function getQuantSummary(date) {
    const data = date ? dbData.quant.data.filter(d => d.date === date) : dbData.quant.data;
    const byStrategy = {};
    data.forEach(d => { byStrategy[d.strategy] = (byStrategy[d.strategy] || 0) + 1; });
    return { total: data.length, by_strategy: byStrategy, date_range: dbData.quant.date_range };
}

export function getQuantDates() {
    return dbData.quant.dates;
}

// ─── 반등 수급 매매 전략 ───
export function getSupplyStrategies({ date, sort = 'val_rank', order = 'asc' } = {}) {
    let filtered = [...dbData.supply.data];
    if (date) filtered = filtered.filter(d => d.date === date);

    const mult = order === 'desc' ? -1 : 1;
    filtered.sort((a, b) => {
        if (sort === 'val_rank') return ((a.val_rank || 9999) - (b.val_rank || 9999)) * mult;
        if (sort === 'close') return ((a.close || 0) - (b.close || 0)) * mult;
        if (sort === 'z_score') return (parseFloat(a.z_score || 0) - parseFloat(b.z_score || 0)) * mult;
        if (sort === 'stock_name') return (a.stock_name || '').localeCompare(b.stock_name || '') * mult;
        return 0;
    });
    return filtered;
}

export function getSupplySummary(date) {
    const data = date ? dbData.supply.data.filter(d => d.date === date) : dbData.supply.data;
    const abcYes = data.filter(d => d.abc_all === 'Y').length;
    const accumYes = data.filter(d => d.accum_signal === 'Y').length;
    const supplyYes = data.filter(d => d.supply_buy === 'Y').length;
    return { total: data.length, abc_count: abcYes, accum_count: accumYes, supply_count: supplyYes, date_range: dbData.supply.date_range };
}

export function getSupplyDates() {
    return dbData.supply.dates;
}

// ─── 공통 ───
export function getFetchedAt() {
    return dbData.fetchedAt;
}

// ─── 주요지수 ───
export function getMarketIndices() {
    return dbData.indices || {};
}

// ─── 주요테마 ───
export function getTopThemes() {
    return dbData.topThemes || [];
}

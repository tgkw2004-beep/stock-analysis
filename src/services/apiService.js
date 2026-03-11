// 데이터 서비스 — 빌드타임 DB 데이터 사용
import dbData from '../data/dbData.json';

const API_BASE_URL = 'http://localhost:3001';

// ─── 퀀트 매수 전략 비동기 API ───
export const fetchQuantStrategies = async ({ strategy = 'ALL', date, sort = 'date', order = 'desc' } = {}) => {
    try {
        const query = new URLSearchParams({ strategy, sort, order });
        if (date) query.append('date', date);
        const res = await fetch(`${API_BASE_URL}/api/strategies?${query.toString()}`);
        if (!res.ok) throw new Error('API fetch failed');
        const data = await res.json();
        return data.data || [];
    } catch (err) {
        console.error('Failed to fetch quant strategies:', err);
        return [];
    }
};

export const fetchQuantSummary = async (date) => {
    try {
        const query = new URLSearchParams();
        if (date) query.append('date', date);
        const res = await fetch(`${API_BASE_URL}/api/strategies/summary?${query.toString()}`);
        if (!res.ok) throw new Error('API fetch failed');
        const data = await res.json();
        return data;
    } catch (err) {
        console.error('Failed to fetch quant summary:', err);
        return { total: 0, by_strategy: {}, date_range: {} };
    }
};

export const fetchQuantDates = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/api/strategies/dates`);
        if (!res.ok) throw new Error('API fetch failed');
        const data = await res.json();
        return data.dates || [];
    } catch (err) {
        console.error('Failed to fetch quant dates:', err);
        return [];
    }
};

// ─── 반등 수급 매매 비동기 API ───
export const fetchSupplyStrategies = async ({ date, sort = 'val_rank', order = 'asc' } = {}) => {
    try {
        const query = new URLSearchParams({ sort, order });
        if (date) query.append('date', date);
        const res = await fetch(`${API_BASE_URL}/api/strategies/supply?${query.toString()}`);
        if (!res.ok) throw new Error('API fetch failed');
        const data = await res.json();
        return data.data || [];
    } catch (err) {
        console.error('Failed to fetch supply strategies:', err);
        return [];
    }
};

export const fetchSupplySummary = async (date) => {
    try {
        const query = new URLSearchParams();
        if (date) query.append('date', date);
        const res = await fetch(`${API_BASE_URL}/api/strategies/supply/summary?${query.toString()}`);
        if (!res.ok) throw new Error('API fetch failed');
        const data = await res.json();
        return data;
    } catch (err) {
        console.error('Failed to fetch supply summary:', err);
        return { total: 0, abc_count: 0, accum_count: 0, supply_count: 0 };
    }
};

export const fetchSupplyDates = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/api/strategies/supply/dates`);
        if (!res.ok) throw new Error('API fetch failed');
        const data = await res.json();
        return data.dates || [];
    } catch (err) {
        console.error('Failed to fetch supply dates:', err);
        return [];
    }
};

// ─── 퀀트 매수 전략 (기존 호환성) ───
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

// ─── 대시보드 API 연동 ───
export async function fetchDashboardSummary() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/summary`);
        if (!response.ok) throw new Error('네트워크 응답이 올바르지 않습니다.');
        const result = await response.json();
        if (result.success) {
            return result;
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('대시보드 요약 조회 실패:', error);
        // 에러 시 기본값 반환
        return {
            indices: null,
            topThemes: null,
            economicIndicators: null,
            topEtfs: null
        };
    }
}

// ─── 하위 호환성 (리팩토링 과도기 에러 방지용) ───
export function getMarketIndices() {
    return dbData.indices || {};
}

export function getTopThemes() {
    return dbData.topThemes || [];
}

export function getEconomicIndicators() {
    return dbData.economicIndicators || [];
}

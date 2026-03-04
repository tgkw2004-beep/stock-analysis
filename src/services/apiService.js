// API 서비스 — 백엔드 API 호출 모듈

const API_BASE = import.meta.env.PROD
    ? 'https://stock-analysis-api-xxxx.onrender.com'   // Render 배포 후 업데이트
    : 'http://localhost:3001';

/**
 * 전략 데이터 조회
 * @param {Object} params - { strategy, date, sort, order, limit }
 */
export async function fetchStrategies(params = {}) {
    const query = new URLSearchParams();
    if (params.strategy && params.strategy !== 'ALL') query.set('strategy', params.strategy);
    if (params.date) query.set('date', params.date);
    if (params.sort) query.set('sort', params.sort);
    if (params.order) query.set('order', params.order);
    if (params.limit) query.set('limit', params.limit);

    const res = await fetch(`${API_BASE}/api/strategies?${query}`);
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
}

/**
 * 전략별 요약 통계
 * @param {string} date - 특정 날짜 필터 (optional)
 */
export async function fetchSummary(date) {
    const query = date ? `?date=${date}` : '';
    const res = await fetch(`${API_BASE}/api/strategies/summary${query}`);
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
}

/**
 * 사용 가능한 날짜 목록
 */
export async function fetchDates() {
    const res = await fetch(`${API_BASE}/api/strategies/dates`);
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
}

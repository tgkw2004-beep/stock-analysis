require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

// PostgreSQL 연결 풀
const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

// CORS 설정
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:4173',
        'https://tgkw2004-beep.github.io',
    ],
    methods: ['GET'],
}));

app.use(express.json());

// ── 헬스 체크 ──
app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// ── 전략 데이터 조회 ──
app.get('/api/strategies', async (req, res) => {
    try {
        const { strategy, date, sort = 'date', order = 'desc', limit = 100 } = req.query;

        let query = `
      SELECT to_char(date, 'YYYY-MM-DD') as date,
             stock_name,
             wics_name,
             open::int, high::int, low::int, close::int,
             prime_l,
             strategy
        FROM visual.vsl_bollinger_strategy
       WHERE 1=1
    `;
        const params = [];
        let paramIdx = 1;

        if (strategy && strategy !== 'ALL') {
            query += ` AND strategy = $${paramIdx++}`;
            params.push(strategy);
        }

        if (date) {
            query += ` AND to_char(date, 'YYYY-MM-DD') = $${paramIdx++}`;
            params.push(date);
        }

        // 정렬
        const sortMap = {
            date: 'date',
            close: 'close',
            stock_name: 'stock_name',
            strategy: 'strategy',
        };
        const sortCol = sortMap[sort] || 'date';
        const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
        query += ` ORDER BY ${sortCol} ${sortOrder}, close DESC`;

        // LIMIT
        const lim = Math.min(parseInt(limit, 10) || 100, 500);
        query += ` LIMIT $${paramIdx++}`;
        params.push(lim);

        const result = await pool.query(query, params);
        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows,
        });
    } catch (err) {
        console.error('Error in /api/strategies:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── 전략별 요약 통계 ──
app.get('/api/strategies/summary', async (req, res) => {
    try {
        const { date } = req.query;

        let dateFilter = '';
        const params = [];

        if (date) {
            dateFilter = `WHERE to_char(date, 'YYYY-MM-DD') = $1`;
            params.push(date);
        }

        // 전략별 카운트
        const countQuery = `
      SELECT strategy, count(*)::int as count
        FROM visual.vsl_bollinger_strategy
        ${dateFilter}
       GROUP BY strategy
       ORDER BY count DESC
    `;
        const countResult = await pool.query(countQuery, params);

        // 총 개수
        const totalQuery = `
      SELECT count(*)::int as total
        FROM visual.vsl_bollinger_strategy
        ${dateFilter}
    `;
        const totalResult = await pool.query(totalQuery, params);

        // 날짜 범위
        const dateRangeQuery = `
      SELECT to_char(min(date), 'YYYY-MM-DD') as min_date,
             to_char(max(date), 'YYYY-MM-DD') as max_date
        FROM visual.vsl_bollinger_strategy
    `;
        const dateRangeResult = await pool.query(dateRangeQuery);

        const byStrategy = {};
        countResult.rows.forEach(r => { byStrategy[r.strategy] = r.count; });

        res.json({
            success: true,
            total: totalResult.rows[0].total,
            by_strategy: byStrategy,
            date_range: dateRangeResult.rows[0],
        });
    } catch (err) {
        console.error('Error in /api/strategies/summary:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── 사용 가능한 날짜 목록 ──
app.get('/api/strategies/dates', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT to_char(date, 'YYYY-MM-DD') as date, count(*)::int as count
        FROM visual.vsl_bollinger_strategy
       GROUP BY date
       ORDER BY date DESC
    `);
        res.json({ success: true, dates: result.rows });
    } catch (err) {
        console.error('Error in /api/strategies/dates:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`🚀 Stock Analysis API running on port ${PORT}`);
});

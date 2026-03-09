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
        const lim = Math.min(parseInt(limit, 10) || 1000, 2000);
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

// ══════════════════════════════════════════
// ── 수급 매매 전략 API (Supply) ──
// ══════════════════════════════════════════

// 수급 매매 조회
app.get('/api/strategies/supply', async (req, res) => {
    try {
        const { date, sort = 'val_rank', order = 'asc', limit = 100 } = req.query;

        let query = `
      SELECT to_char(date, 'YYYY-MM-DD') as date,
             stock_code,
             stock_name,
             close::int,
             trade_value::bigint,
             val_rank::int,
             val_top300,
             whol_smtn_ntby_tr_pbmn::bigint as program_supply,
             sum_fake_ntby_qty::bigint as foreign_inst_supply,
             z_score::numeric as z_score,
             supply_buy,
             prg_accum_signal as accum_signal,
             abc_all,
             inv_strat as invest_strategy
        FROM visual.vsl_macd_btm_supply
       WHERE 1=1
    `;
        const params = [];
        let paramIdx = 1;

        if (date) {
            query += ` AND to_char(date, 'YYYY-MM-DD') = $${paramIdx++}`;
            params.push(date);
        }

        // 정렬
        const sortMap = {
            val_rank: 'val_rank',
            z_score: 'z_score',
            close: 'close',
        };
        const sortColStr = sortMap[sort] || sortMap['val_rank'];
        const sortOrder = order === 'asc' ? ' ASC' : ' DESC';
        const nullsLast = sortColStr === 'val_rank' ? ' NULLS LAST' : '';
        query += ` ORDER BY ${sortColStr}${sortOrder}${nullsLast}`;

        // LIMIT
        const lim = Math.min(parseInt(limit, 10) || 1000, 2000);
        query += ` LIMIT $${paramIdx++}`;
        params.push(lim);

        const result = await pool.query(query, params);

        // 테마명 실시간 조인 대신, 간단하게 vsl_naver_theme에서 가장 최근 일자의 테마들을 가져와서 맵핑 (또는 서브쿼리 활용 가능)
        // 성능 이슈 가능성이 있으므로 간단한 서브쿼리로 테마명 리스트(쉼표 구분)를 가져옴
        const stockCodes = result.rows.map(r => r.stock_code);
        let themeMap = {};

        if (stockCodes.length > 0) {
            const themeQuery = `
                SELECT stock_code, STRING_AGG(theme_name, ', ') as theme_names
                  FROM visual.vsl_naver_theme
                 WHERE date = (SELECT MAX(date) FROM visual.vsl_naver_theme)
                   AND stock_code = ANY($1)
                 GROUP BY stock_code
            `;
            const themeResult = await pool.query(themeQuery, [stockCodes]);
            themeResult.rows.forEach(r => {
                themeMap[r.stock_code] = r.theme_names;
            });
        }

        const data = result.rows.map(r => ({
            ...r,
            theme_names: themeMap[r.stock_code] || null
        }));

        res.json({
            success: true,
            count: data.length,
            data: data,
        });
    } catch (err) {
        console.error('Error in /api/strategies/supply:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// 수급 매매 요약
app.get('/api/strategies/supply/summary', async (req, res) => {
    try {
        const { date } = req.query;

        let dateFilter = '';
        const params = [];

        if (date) {
            dateFilter = `WHERE to_char(date, 'YYYY-MM-DD') = $1`;
            params.push(date);
        }

        // ABC / 매집 / 수급 Y 개수 산출
        const countQuery = `
      SELECT count(*)::int as total,
             count(nullif(abc_all = 'Y', false))::int as abc_count,
             count(nullif(prg_accum_signal = 'Y', false))::int as accum_count,
             count(nullif(supply_buy = 'Y', false))::int as supply_count
        FROM visual.vsl_macd_btm_supply
        ${dateFilter}
    `;
        const countResult = await pool.query(countQuery, params);

        res.json({
            success: true,
            total: countResult.rows[0].total,
            abc_count: countResult.rows[0].abc_count,
            accum_count: countResult.rows[0].accum_count,
            supply_count: countResult.rows[0].supply_count,
        });
    } catch (err) {
        console.error('Error in /api/strategies/supply/summary:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// 수급 매매 사용 가능한 날짜 목록
app.get('/api/strategies/supply/dates', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT to_char(date, 'YYYY-MM-DD') as date, count(*)::int as count
        FROM visual.vsl_macd_btm_supply
       GROUP BY date
       ORDER BY date DESC
    `);
        res.json({ success: true, dates: result.rows });
    } catch (err) {
        console.error('Error in /api/strategies/supply/dates:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ══════════════════════════════════════════
// ── 대시보드 요약 API ──
// ══════════════════════════════════════════
app.get('/api/dashboard/summary', async (req, res) => {
    try {
        // 1. 주요 지수 (KOSPI, KOSDAQ, SP500, NASDAQ, DOW) 연속 10일치
        const getIndexData = async (table, codeParam = null) => {
            let query = "";
            const isYfin = table.startsWith('market.yfin');
            const isKis = table === 'market.kis_major_market_index';

            // kis 해외지수와 yfin 테이블은 'close', krx 지수는 'closing_price'
            const closeCol = (isKis || isYfin) ? 'close' : 'closing_price';

            if (isKis) {
                query = `
                    SELECT to_char(date, 'MM-DD') as date_str, ${closeCol}::numeric as close
                    FROM ${table}
                `;
            } else {
                query = `
                    SELECT to_char(date, 'MM-DD') as date_str, ${closeCol}::numeric as close, diff_rate as change_pct, diff_price as change
                    FROM ${table}
                `;
            }

            const params = [];
            if (codeParam) {
                // kis_major_market_index 는 code 컬럼을 사용함.
                query += ` WHERE code = $1 `;
                params.push(codeParam);
            }
            query += ` ORDER BY date DESC LIMIT 10`;
            const { rows } = await pool.query(query, params);
            if (rows.length === 0) return null;

            rows.reverse(); // 과거 -> 최신

            // KIS 해외 지수는 diff 정보가 없는 경우 스스로 연속된 데이터를 바탕으로 change 계산
            if (isKis) {
                for (let i = 0; i < rows.length; i++) {
                    if (i === 0) {
                        rows[i].change = 0;
                        rows[i].change_pct = 0;
                    } else {
                        rows[i].change = rows[i].close - rows[i - 1].close;
                        rows[i].change_pct = (rows[i].change / rows[i - 1].close) * 100;
                    }
                }
            }

            const current = rows[rows.length - 1];
            return {
                current: current.close,
                change: current.change,
                changePercent: current.change_pct,
                date: current.date_str,
                sparkline: rows.map(r => ({ date: r.date_str, value: r.close }))
            };
        };

        const [kospi, kosdaq, sp500, nasdaq, dow] = await Promise.all([
            getIndexData('market.krx_stocks_kospi_index'),
            getIndexData('market.krx_stocks_kosdaq_index'),
            getIndexData('market.kis_major_market_index', 'SPX'),
            getIndexData('market.kis_major_market_index', 'COMP'),
            getIndexData('market.kis_major_market_index', '.DJI')
        ]);

        const indices = { kospi, kosdaq, sp500, nasdaq, dow };

        // 2. 주요 테마 (네이버 테마 원천에서 가중수익률 계산)
        const themeQuery = `
            WITH theme_return AS (
                SELECT theme_name, to_char(date, 'MM-DD') as date_str,
                       SUM(cls_chg_rt * cap) / NULLIF(SUM(cap), 0) AS weighted_return
                  FROM visual.vsl_naver_theme
                 WHERE date = (SELECT MAX(date) FROM visual.vsl_naver_theme)
                 GROUP BY theme_name, date_str
            )
            SELECT theme_name as theme,
                   ROUND(weighted_return, 2)::numeric AS yield,
                   date_str as date
              FROM theme_return
             ORDER BY weighted_return DESC
             LIMIT 5;
        `;
        const { rows: topThemes } = await pool.query(themeQuery);

        // 3. 기초경제지표 (환율, 금리, 물가)
        const getEco = async (table, itemName, suffix) => {
            let col = 'date';
            let selDate = `TO_CHAR(date, 'YYYY-MM-DD')`;
            if (table === 'market.ecos_sobi_mulga_all') {
                col = 'yyyymm';
                selDate = `yyyymm`;
            }
            const q = `
                SELECT ${selDate} AS date_str,
                       data_value::numeric AS value
                  FROM ${table}
                 WHERE item_name1 = $1
                 ORDER BY ${col} DESC LIMIT 2
            `;
            const { rows } = await pool.query(q, [itemName]);
            if (rows.length === 0) return null;
            const current = rows[0];
            const prev = rows.length > 1 ? rows[1] : rows[0];
            const change = current.value - prev.value;
            const changePercent = prev.value !== 0 ? (change / prev.value) * 100 : 0;
            return {
                name: itemName.replace(/\(.*?\)/g, '').trim(), // 괄호 제거
                value: current.value,
                change: change,
                changePercent: changePercent,
                date: current.date_str,
                suffix: suffix
            };
        };

        const ecoData = await Promise.all([
            getEco('market.ecos_currency_all', '원/미국달러(매매기준율)', '원'),
            getEco('market.ecos_currency_all', '원/일본엔(100엔)', '원'),
            getEco('market.ecos_market_interest', 'KORIBOR(3개월)', '%'),
            getEco('market.ecos_sobi_mulga_all', '총지수', 'pt')
        ]);

        // 이름 예쁘게 다듬기
        if (ecoData[0]) ecoData[0].name = '달러/원 환율';
        if (ecoData[1]) ecoData[1].name = '엔/원 환율 (100엔)';
        if (ecoData[2]) ecoData[2].name = 'KORIBOR 금리';
        if (ecoData[3]) ecoData[3].name = '소비자물가지수';

        const economicIndicators = ecoData.filter(e => e !== null);

        res.json({
            success: true,
            indices,
            topThemes,
            economicIndicators
        });

    } catch (err) {
        console.error('Error in /api/dashboard/summary:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ══════════════════════════════════════════
// ── 종목 검색 API ──
// ══════════════════════════════════════════

// 1. 종목 검색 (자동완성)
app.get('/api/stocks/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 1) return res.json({ success: true, data: [] });

        const result = await pool.query(`
            SELECT DISTINCT d.stock_code, d.stock_name, d.corp_cls,
                   COALESCE(d.induty_code, '') AS induty_code
              FROM company.dart_company_info d
             WHERE d.stock_code IS NOT NULL
               AND d.stock_code != ''
               AND (d.stock_name ILIKE $1 OR d.stock_code LIKE $2)
             ORDER BY d.stock_name
             LIMIT 20
        `, [`%${q}%`, `${q}%`]);

        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error('Error in /api/stocks/search:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// 2. 종목 기본정보
app.get('/api/stocks/:code/info', async (req, res) => {
    try {
        const { code } = req.params;

        const info = await pool.query(`
            SELECT d.stock_code, d.stock_name, d.corp_name, d.corp_code,
                   d.ceo_nm, d.corp_cls, d.induty_code, d.est_dt,
                   d.ir_url, d.phn_no
              FROM company.dart_company_info d
             WHERE d.stock_code = $1
             LIMIT 1
        `, [code]);

        // 최신 시세
        const price = await pool.query(`
            SELECT to_char(date, 'YYYY-MM-DD') AS date,
                   open::int, high::int, low::int, close::int, volume::bigint
              FROM company.krx_stocks_ohlcv
             WHERE code = $1
             ORDER BY date DESC LIMIT 1
        `, [code]);

        // PER, EPS, BPS, 배당수익률
        const fundamental = await pool.query(`
            SELECT to_char(date, 'YYYY-MM-DD') AS date,
                   bps::numeric, per::numeric, eps::numeric,
                   div::numeric, dps::numeric
              FROM company.krx_stocks_fundamental_info
             WHERE code = $1
             ORDER BY date DESC LIMIT 1
        `, [code]);

        res.json({
            success: true,
            info: info.rows[0] || null,
            price: price.rows[0] || null,
            fundamental: fundamental.rows[0] || null,
        });
    } catch (err) {
        console.error('Error in /api/stocks/:code/info:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// 3. 주가 차트 + MACD/RSI (서버에서 계산)
app.get('/api/stocks/:code/chart', async (req, res) => {
    try {
        const { code } = req.params;
        const { period = 'daily' } = req.query;

        // 기간에 따라 조회 범위 결정 (너무 많으면 캔들이 작아져서 가독성이 떨어지므로 범위 축소)
        // 이동평균선(MA60 등)을 위해 실제 노출할 limit보다 더 과거 데이터를 넉넉히 가져옴
        let fetchInterval, limit;
        switch (period) {
            case 'weekly': fetchInterval = '3 years'; limit = 52; break;    // 주봉: 52주
            case 'monthly': fetchInterval = '10 years'; limit = 60; break;  // 월봉: 60개월
            case 'yearly': fetchInterval = '30 years'; limit = 20; break;  // 연봉: 20년
            default: fetchInterval = '8 months'; limit = 80; break;        // 일봉: 한 화면에 80개 표시 (MA60 계산 위해 8개월치 로드)
        }

        let query, params;

        if (period === 'daily') {
            query = `
                SELECT to_char(date, 'YYYY-MM-DD') AS date,
                       open::int, high::int, low::int, close::int, volume::bigint
                  FROM company.krx_stocks_ohlcv
                 WHERE code = $1
                   AND date >= current_date - interval '${fetchInterval}'
                 ORDER BY date ASC
            `;
            params = [code];
        } else if (period === 'weekly') {
            query = `
                SELECT to_char(date_trunc('week', date), 'YYYY-MM-DD') AS date,
                       (array_agg(open ORDER BY date ASC))[1]::int AS open,
                       MAX(high)::int AS high,
                       MIN(low)::int AS low,
                       (array_agg(close ORDER BY date DESC))[1]::int AS close,
                       SUM(volume)::bigint AS volume
                  FROM company.krx_stocks_ohlcv
                 WHERE code = $1
                   AND date >= current_date - interval '${fetchInterval}'
                 GROUP BY date_trunc('week', date)
                 ORDER BY date ASC
            `;
            params = [code];
        } else if (period === 'monthly') {
            query = `
                SELECT to_char(date_trunc('month', date), 'YYYY-MM') AS date,
                       (array_agg(open ORDER BY date ASC))[1]::int AS open,
                       MAX(high)::int AS high,
                       MIN(low)::int AS low,
                       (array_agg(close ORDER BY date DESC))[1]::int AS close,
                       SUM(volume)::bigint AS volume
                  FROM company.krx_stocks_ohlcv
                 WHERE code = $1
                   AND date >= current_date - interval '${fetchInterval}'
                 GROUP BY date_trunc('month', date)
                 ORDER BY date ASC
            `;
            params = [code];
        } else {
            // yearly
            query = `
                SELECT to_char(date_trunc('year', date), 'YYYY') AS date,
                       (array_agg(open ORDER BY date ASC))[1]::int AS open,
                       MAX(high)::int AS high,
                       MIN(low)::int AS low,
                       (array_agg(close ORDER BY date DESC))[1]::int AS close,
                       SUM(volume)::bigint AS volume
                  FROM company.krx_stocks_ohlcv
                 WHERE code = $1
                   AND date >= current_date - interval '${fetchInterval}'
                 GROUP BY date_trunc('year', date)
                 ORDER BY date ASC
            `;
            params = [code];
        }

        const result = await pool.query(query, params);
        const rows = result.rows;

        // 서버에서 MA, MACD, RSI 계산 (DB결과가 문자열일 수 있으므로 명시적 Number 변환)
        const closes = rows.map(r => Number(r.close));

        // 이동평균 계산
        const calcMA = (data, n) => data.map((_, i) => {
            if (i < n - 1) return null;
            const slice = data.slice(i - n + 1, i + 1);
            return Math.round(slice.reduce((a, b) => a + b, 0) / n);
        });

        // EMA 계산
        const calcEMA = (data, n) => {
            const k = 2 / (n + 1);
            const ema = [data[0]];
            for (let i = 1; i < data.length; i++) {
                ema.push(data[i] * k + ema[i - 1] * (1 - k));
            }
            return ema;
        };

        // MACD 계산
        const ema12 = calcEMA(closes, 12);
        const ema26 = calcEMA(closes, 26);
        const macdLine = ema12.map((v, i) => v - ema26[i]);
        const signalLine = calcEMA(macdLine, 9);
        const histogram = macdLine.map((v, i) => v - signalLine[i]);

        // RSI 계산
        const calcRSI = (data, n = 14) => {
            const rsi = new Array(data.length).fill(null);
            if (data.length < n + 1) return rsi;
            let gains = 0, losses = 0;
            for (let i = 1; i <= n; i++) {
                const diff = data[i] - data[i - 1];
                if (diff > 0) gains += diff; else losses -= diff;
            }
            let avgGain = gains / n;
            let avgLoss = losses / n;
            rsi[n] = avgLoss === 0 ? 100 : 100 - (100 / (1 + avgGain / avgLoss));
            for (let i = n + 1; i < data.length; i++) {
                const diff = data[i] - data[i - 1];
                avgGain = (avgGain * (n - 1) + (diff > 0 ? diff : 0)) / n;
                avgLoss = (avgLoss * (n - 1) + (diff < 0 ? -diff : 0)) / n;
                rsi[i] = avgLoss === 0 ? 100 : 100 - (100 / (1 + avgGain / avgLoss));
            }
            return rsi;
        };

        const ma5 = calcMA(closes, 5);
        const ma20 = calcMA(closes, 20);
        const ma60 = calcMA(closes, 60);
        const rsi = calcRSI(closes);

        const chartData = rows.map((r, i) => ({
            date: r.date,
            open: Number(r.open),
            high: Number(r.high),
            low: Number(r.low),
            close: Number(r.close),
            volume: parseInt(r.volume),
            ma5: ma5[i],
            ma20: ma20[i],
            ma60: ma60[i],
            macd: parseFloat(macdLine[i]?.toFixed(2)) || 0,
            signal: parseFloat(signalLine[i]?.toFixed(2)) || 0,
            histogram: parseFloat(histogram[i]?.toFixed(2)) || 0,
            rsi: rsi[i] !== null ? parseFloat(rsi[i].toFixed(2)) : null,
        }));

        // MA가 계산된 앞쪽 여분 데이터(limit 초과분)를 잘라내어 화면용 데이터 크기로 맞춤
        let finalData = chartData;
        if (chartData.length > limit) {
            finalData = chartData.slice(-limit);
        }

        res.json({ success: true, data: finalData });
    } catch (err) {
        console.error('Error in /api/stocks/:code/chart:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// 4. 투자자별 매매동향
app.get('/api/stocks/:code/investors', async (req, res) => {
    try {
        const { code } = req.params;

        const result = await pool.query(`
            SELECT to_char(date, 'YYYY-MM-DD') AS date,
                   investor,
                   buy_trade_vol::bigint AS buy_vol,
                   sell_trade_vol::bigint AS sell_vol,
                   net_trade_vol::bigint AS net_vol,
                   buy_trade_amt::bigint AS buy_amt,
                   sell_trade_amt::bigint AS sell_amt,
                   net_trade_amt::bigint AS net_amt
              FROM company.krx_stocks_investor_shares_trading_info
             WHERE code = $1
               AND date >= current_date - interval '60 days'
               AND investor IN ('외국인', '기관합계', '개인')
             ORDER BY date DESC, investor
        `, [code]);

        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error('Error in /api/stocks/:code/investors:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// 5. 재무정보
app.get('/api/stocks/:code/financial', async (req, res) => {
    try {
        const { code } = req.params;

        // F-Score
        const fscore = await pool.query(`
            SELECT bsns_year, f_score::int, roa::numeric, gpm::numeric, ltr::numeric,
                   f1::int, f2::int, f3::int, f4::int, f5::int, f6::int, f7::int, f8::int, f9::int
              FROM company.dart_fs_fscore
             WHERE code = $1
               AND reprt_code = '11011'
             ORDER BY bsns_year DESC
             LIMIT 5
        `, [code]);

        // PER, EPS, BPS 추이
        const valuation = await pool.query(`
            SELECT to_char(date, 'YYYY-MM-DD') AS date,
                   bps::numeric, per::numeric, eps::numeric,
                   div::numeric, dps::numeric
              FROM company.krx_stocks_fundamental_info
             WHERE code = $1
               AND date >= current_date - interval '3 years'
             ORDER BY date DESC
        `, [code]);

        // 손익계산서 (매출, 영업이익, 당기순이익)
        const income = await pool.query(`
            SELECT bsns_year, account_id,
                   COALESCE(ifrs_account_nm_kor, '') AS account_name,
                   thstrm_amount::numeric AS amount
              FROM company.dart_fs_is
             WHERE code = $1
               AND reprt_code = '11011'
               AND sj_div = 'IS'
               AND class2 = '총합'
               AND account_id IN (
                   'ifrs-full_Revenue',
                   'ifrs-full_ProfitLossFromOperatingActivities',
                   'ifrs-full_ProfitLoss',
                   'dart_OperatingIncomeLoss'
               )
             ORDER BY bsns_year DESC, account_id
        `, [code]);

        res.json({
            success: true,
            fscore: fscore.rows,
            valuation: valuation.rows,
            income: income.rows,
        });
    } catch (err) {
        console.error('Error in /api/stocks/:code/financial:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// 6. 외국인/공매도 (네트워크)
app.get('/api/stocks/:code/foreign', async (req, res) => {
    try {
        const { code } = req.params;

        // 외국인 보유 추이
        const foreign = await pool.query(`
            SELECT to_char(date, 'YYYY-MM-DD') AS date,
                   shareholding_ratio_foreign::numeric AS foreign_ratio
              FROM company.krx_stocks_foreign_shares_info
             WHERE code = $1
               AND date >= current_date - interval '6 months'
             ORDER BY date ASC
        `, [code]);

        // 공매도
        const shortSelling = await pool.query(`
            SELECT to_char(date, 'YYYY-MM-DD') AS date,
                   short_selling::bigint AS short_vol,
                   balance_amount::bigint AS balance_amt
              FROM company.krx_stocks_short_selling
             WHERE code = $1
               AND date >= current_date - interval '3 months'
             ORDER BY date ASC
        `, [code]);

        res.json({
            success: true,
            foreign: foreign.rows,
            shortSelling: shortSelling.rows,
        });
    } catch (err) {
        console.error('Error in /api/stocks/:code/foreign:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// 7. 업종/테마
app.get('/api/stocks/:code/themes', async (req, res) => {
    try {
        const { code } = req.params;

        // 소속 테마
        const themes = await pool.query(`
            SELECT DISTINCT theme_name, theme_code
              FROM company.naver_theme
             WHERE stock_code = $1
             ORDER BY theme_name
        `, [code]);

        // WICS 산업분류 (master_company_list 테이블 사용)
        const wics = await pool.query(`
            SELECT wics_name1, wics_name2, wics_name3
              FROM company.master_company_list
             WHERE stock_code = $1
             LIMIT 1
        `, [code]);

        // 같은 업종 종목 (wics_name2 기준)
        let sameIndustry = [];
        if (wics.rows.length > 0 && wics.rows[0].wics_name2) {
            const sameResult = await pool.query(`
                SELECT stock_code, stock_name, wics_name2, wics_name3
                  FROM company.master_company_list
                 WHERE wics_name2 = $1
                   AND stock_code != $2
                 ORDER BY stock_name
                 LIMIT 20
            `, [wics.rows[0].wics_name2, code]);
            sameIndustry = sameResult.rows;
        }

        // 테마별 수익률 (vsl_naver_theme가 없으므로 생략, 테마 목록만 표시)
        let themeYields = [];

        res.json({
            success: true,
            themes: themes.rows,
            wics: wics.rows[0] || null,
            sameIndustry,
            themeYields,
        });
    } catch (err) {
        console.error('Error in /api/stocks/:code/themes:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`🚀 Stock Analysis API running on port ${PORT}`);
});

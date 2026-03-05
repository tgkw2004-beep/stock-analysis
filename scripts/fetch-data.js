/**
 * 빌드 전 DB에서 전략 데이터를 가져와 JSON 파일로 저장하는 스크립트
 * - 퀀트 매수 전략 (bollinger_strategy)
 * - 반등 수급 매매 전략 (macd_btm_supply)
 */
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function main() {
  const client = new Client({
    host: process.env.DB_HOST || '118.219.232.158',
    port: parseInt(process.env.DB_PORT || '15432', 10),
    database: process.env.DB_NAME || 'atoz',
    user: process.env.DB_USER || 'azadmin',
    password: process.env.DB_PASSWORD || 'pg1234',
    ssl: false,
    connectionTimeoutMillis: 10000,
  });

  try {
    await client.connect();
    console.log('✅ DB 연결 성공');

    // ─── 1. 퀀트 매수 전략 (bollinger_strategy) ───
    const bollingerData = await client.query(`
      SELECT to_char(date, 'YYYY-MM-DD') as date,
             stock_name, wics_name,
             open::int, high::int, low::int, close::int,
             prime_l, strategy
        FROM visual.vsl_bollinger_strategy
       ORDER BY date DESC, close DESC
    `);
    console.log('📊 퀀트 매수 전략: ' + bollingerData.rows.length + '건');

    const bollingerByStrategy = {};
    bollingerData.rows.forEach(r => {
      bollingerByStrategy[r.strategy] = (bollingerByStrategy[r.strategy] || 0) + 1;
    });

    const bollingerDates = await client.query(`
      SELECT to_char(date, 'YYYY-MM-DD') as date, count(*)::int as count
        FROM visual.vsl_bollinger_strategy GROUP BY date ORDER BY date DESC
    `);

    const bollingerRange = await client.query(`
      SELECT to_char(min(date), 'YYYY-MM-DD') as min_date,
             to_char(max(date), 'YYYY-MM-DD') as max_date
        FROM visual.vsl_bollinger_strategy
    `);

    // ─── 2. 반등 수급 매매 전략 (macd_btm_supply) ───
    const supplyData = await client.query(`
      WITH tmp01 AS (
          SELECT stock_name, stock_code,
                 STRING_AGG(theme_code, ', ') AS theme_codes,
                 STRING_AGG(theme_name, ',') AS theme_names,
                 STRING_AGG(theme_info, '|') AS theme_info,
                 ANY_VALUE(stock_info) AS stock_info
            FROM company.naver_theme
           GROUP BY stock_name, stock_code
      ), tmp02 AS (
          SELECT t1.*, t2.theme_names, t2.theme_info, t2.stock_info
            FROM visual.vsl_macd_btm_supply AS t1
            LEFT JOIN tmp01 AS t2 ON t1.stock_code = t2.stock_code
      )
      SELECT to_char(date, 'yyyy-MM-dd') AS date,
             stock_name, theme_names, stock_info,
             val_top300, whol_smtn_ntby_tr_pbmn AS program_supply,
             (frgn_ntby_qty + orgn_ntby_qty) AS foreign_inst_supply,
             inv_strat_dtl AS invest_strategy,
             abc_all, prg_accum_signal AS accum_signal,
             stock_code, close::int,
             trade_value::bigint, val_rank::int,
             supply_buy, z_score::numeric
        FROM tmp02
       ORDER BY date DESC, abc_all DESC, val_rank ASC
    `);
    console.log('📊 반등 수급 매매 전략: ' + supplyData.rows.length + '건');

    const supplyDates = await client.query(`
      SELECT to_char(date, 'YYYY-MM-DD') as date, count(*)::int as count
        FROM visual.vsl_macd_btm_supply GROUP BY date ORDER BY date DESC
    `);

    const supplyRange = await client.query(`
      SELECT to_char(min(date), 'YYYY-MM-DD') as min_date,
             to_char(max(date), 'YYYY-MM-DD') as max_date
        FROM visual.vsl_macd_btm_supply
    `);

    // ─── 3. 주요지수 ───
    console.log('📈 주요지수 데이터 수집 중...');

    // KOSPI
    const kospiData = await client.query(`
      SELECT to_char(date, 'YYYY-MM-DD') as date,
             closing_price::numeric AS close
        FROM market.krx_stocks_kospi_index
       WHERE date >= current_date - interval '1 year'
       ORDER BY date DESC
    `);
    console.log('   KOSPI: ' + kospiData.rows.length + '건');

    // KOSDAQ
    const kosdaqData = await client.query(`
      SELECT to_char(date, 'YYYY-MM-DD') as date,
             closing_price::numeric AS close
        FROM market.krx_stocks_kosdaq_index
       WHERE date >= current_date - interval '1 year'
       ORDER BY date DESC
    `);
    console.log('   KOSDAQ: ' + kosdaqData.rows.length + '건');

    // S&P 500
    const sp500Data = await client.query(`
      SELECT to_char(date, 'YYYY-MM-DD') as date,
             close AS value
        FROM market.kis_major_market_index
       WHERE date >= current_date - interval '1 year'
         AND code = 'SPX'
       ORDER BY date DESC
    `);
    console.log('   S&P 500: ' + sp500Data.rows.length + '건');

    // NASDAQ
    const nasdaqData = await client.query(`
      SELECT to_char(date, 'YYYY-MM-DD') as date,
             close AS value
        FROM market.kis_major_market_index
       WHERE date >= current_date - interval '1 year'
         AND code = 'COMP'
       ORDER BY date DESC
    `);
    console.log('   NASDAQ: ' + nasdaqData.rows.length + '건');

    // 다우존스
    const dowData = await client.query(`
      SELECT to_char(date, 'YYYY-MM-DD') as date,
             close AS value
        FROM market.kis_major_market_index
       WHERE date >= current_date - interval '1 year'
         AND code = '.DJI'
       ORDER BY date DESC
    `);
    console.log('   다우존스: ' + dowData.rows.length + '건');

    // 주요지수 데이터 가공 함수
    function processIndex(name, rows, valueKey = 'value') {
      if (rows.length === 0) return { name, current: null, prev: null, change: 0, changePercent: 0, sparkline: [] };
      const current = parseFloat(rows[0][valueKey]);
      const prev = rows.length > 1 ? parseFloat(rows[1][valueKey]) : current;
      const change = current - prev;
      const changePercent = prev !== 0 ? ((change / prev) * 100) : 0;
      const sparkline = rows.slice(0, 60).reverse().map(r => ({
        date: r.date,
        value: parseFloat(r[valueKey]),
      }));
      return {
        name,
        date: rows[0].date,
        current: parseFloat(current.toFixed(2)),
        prev: parseFloat(prev.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        sparkline,
      };
    }

    const kospiKey = 'close';
    const kosdaqKey = 'close';

    const indicesOutput = {
      kospi: processIndex('KOSPI', kospiData.rows, kospiKey),
      kosdaq: processIndex('KOSDAQ', kosdaqData.rows, kosdaqKey),
      sp500: processIndex('S&P 500', sp500Data.rows, 'value'),
      nasdaq: processIndex('NASDAQ', nasdaqData.rows, 'value'),
      dow: processIndex('다우존스', dowData.rows, 'value'),
    };
    console.log('✅ 주요지수 데이터 수집 완료');

    // ─── 4. 주요테마 (상위 5개) ───
    console.log('🏷️  주요테마 데이터 수집 중...');
    const topThemesData = await client.query(`
      WITH LATEST_DATE AS (
          SELECT MAX(date) AS max_date
          FROM visual.vsl_naver_theme
      ),
      theme_weighted_return AS (
          SELECT
              theme_name,
              date,
              SUM(cls_chg_rt * cap) / NULLIF(SUM(cap), 0) AS weighted_cls_chg_rt
          FROM visual.vsl_naver_theme, LATEST_DATE
          WHERE date = LATEST_DATE.max_date
          GROUP BY theme_name, date
      ),
      ranked_theme AS (
          SELECT
              theme_name,
              date,
              weighted_cls_chg_rt,
              RANK() OVER (ORDER BY weighted_cls_chg_rt DESC) AS ranking
          FROM theme_weighted_return
      ),
      top_themes AS (
          SELECT theme_name, date, ranking
          FROM ranked_theme
          WHERE ranking <= 5
      )
      SELECT
          t.ranking,
          v.theme_name AS theme,
          to_char(t.date, 'YYYY-MM-DD') AS date,
          ROUND(SUM(v.cls_chg_rt * v.cap) / NULLIF(SUM(v.cap), 0), 2) AS yield
      FROM visual.vsl_naver_theme v
      JOIN top_themes t ON v.theme_name = t.theme_name AND v.date = t.date
      GROUP BY t.ranking, v.theme_name, t.date
      ORDER BY t.ranking ASC
    `);
    const topThemesOutput = topThemesData.rows.map(r => ({
      ranking: parseInt(r.ranking),
      theme: r.theme,
      date: r.date,
      yield: parseFloat(r.yield),
    }));
    console.log('✅ 주요테마 데이터 수집 완료: ' + topThemesOutput.length + '건');

    // ─── JSON 저장 ───
    const output = {
      fetchedAt: new Date().toISOString(),

      // 퀀트 매수 전략
      quant: {
        total: bollingerData.rows.length,
        by_strategy: bollingerByStrategy,
        date_range: bollingerRange.rows[0],
        dates: bollingerDates.rows,
        data: bollingerData.rows,
      },

      // 반등 수급 매매 전략
      supply: {
        total: supplyData.rows.length,
        date_range: supplyRange.rows[0],
        dates: supplyDates.rows,
        data: supplyData.rows,
      },

      // 주요지수
      indices: indicesOutput,

      // 주요테마
      topThemes: topThemesOutput,
    };

    const outDir = path.join(__dirname, '..', 'src', 'data');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const outPath = path.join(outDir, 'dbData.json');
    fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf-8');
    console.log('✅ JSON 저장 완료: src/data/dbData.json');
    console.log('   퀀트 매수: ' + output.quant.total + '건');
    console.log('   반등 수급: ' + output.supply.total + '건');
  } catch (err) {
    console.error('❌ DB 연결/조회 실패:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();

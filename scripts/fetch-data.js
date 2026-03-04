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

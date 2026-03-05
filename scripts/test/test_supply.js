const { Client } = require('pg');

const client = new Client({
    host: '118.219.232.158',
    port: 15432,
    database: 'atoz',
    user: 'azadmin',
    password: 'pg1234',
    ssl: false,
});

async function main() {
    await client.connect();
    console.log('Connected!');

    const result = await client.query(`
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
           stock_code, close,
           trade_value, val_rank,
           supply_buy, z_score
      FROM tmp02
     ORDER BY date DESC, abc_all DESC, val_rank ASC
     LIMIT 15
  `);

    console.log('\n=== SAMPLE DATA (15 rows) ===');
    result.rows.forEach(r => console.log(JSON.stringify(r)));

    console.log('\n=== TOTAL COUNT ===');
    const cnt = await client.query('SELECT count(*)::int as cnt FROM visual.vsl_macd_btm_supply');
    console.log('Total:', cnt.rows[0].cnt);

    const dates = await client.query(`
    SELECT to_char(date, 'yyyy-MM-dd') as date, count(*)::int as cnt
      FROM visual.vsl_macd_btm_supply GROUP BY date ORDER BY date DESC LIMIT 10
  `);
    console.log('\n=== DATES ===');
    dates.rows.forEach(r => console.log(r.date + ': ' + r.cnt));

    await client.end();
}

main().catch(e => { console.error(e); process.exit(1); });

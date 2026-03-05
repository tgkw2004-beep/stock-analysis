const { Client } = require('pg');
(async () => {
    const c = new Client({ host: '118.219.232.158', port: 15432, database: 'atoz', user: 'azadmin', password: 'pg1234', ssl: false, connectionTimeoutMillis: 10000 });
    await c.connect();

    // 소비자물가 - 컬럼 확인
    console.log('=== 소비자물가 컬럼 확인 ===');
    const r2c = await c.query(`SELECT column_name FROM information_schema.columns WHERE table_schema='market' AND table_name='ecos_sobi_mulga_all' ORDER BY ordinal_position`);
    console.log(r2c.rows.map(r => r.column_name));
    const r2s = await c.query(`SELECT * FROM market.ecos_sobi_mulga_all LIMIT 3`);
    console.log('Sample:', JSON.stringify(r2s.rows[0], null, 2));

    // 시장금리 - 컬럼 확인
    console.log('\n=== 시장금리 컬럼 확인 ===');
    const r3c = await c.query(`SELECT column_name FROM information_schema.columns WHERE table_schema='market' AND table_name='ecos_market_interest' ORDER BY ordinal_position`);
    console.log(r3c.rows.map(r => r.column_name));
    const r3s = await c.query(`SELECT * FROM market.ecos_market_interest LIMIT 3`);
    console.log('Sample:', JSON.stringify(r3s.rows[0], null, 2));

    // 환율에서 주요 통화 목록 확인
    console.log('\n=== 주요 환율 통화 ===');
    const r1 = await c.query(`SELECT DISTINCT item_name1 FROM market.ecos_currency_all WHERE item_name1 LIKE '%달러%' OR item_name1 LIKE '%유로%' OR item_name1 LIKE '%엔%' OR item_name1 LIKE '%위안%'`);
    console.log(r1.rows);

    // 환율 최신 데이터
    console.log('\n=== 환율 최신 (원/달러) ===');
    const r1d = await c.query(`SELECT * FROM market.ecos_currency_all WHERE item_name1 LIKE '%미 달러%' OR item_name1='원/달러' ORDER BY date DESC LIMIT 3`);
    if (r1d.rows.length) console.log(JSON.stringify(r1d.rows[0], null, 2));
    else {
        const r1e = await c.query(`SELECT DISTINCT item_name1 FROM market.ecos_currency_all WHERE item_name1 LIKE '%달러%'`);
        console.log('달러 관련:', r1e.rows);
    }

    // 시장금리 종류 확인
    console.log('\n=== 시장금리 종류 ===');
    const r3t = await c.query(`SELECT DISTINCT item_name1 FROM market.ecos_market_interest LIMIT 30`);
    console.log(r3t.rows);

    await c.end();
})();

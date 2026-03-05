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

    const cols = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'visual' AND table_name = 'vsl_bollinger_strategy'
    ORDER BY ordinal_position
  `);
    console.log('\n=== COLUMNS ===');
    cols.rows.forEach(r => console.log(`${r.column_name}: ${r.data_type}`));

    const data = await client.query(`
    SELECT to_char(date, 'yyyy-mm-dd') as "date"
         , stock_name, wics_name
         , open, high, low, close 
         , Prime_L as "prime_l"
         , strategy
    FROM visual.vsl_bollinger_strategy
    ORDER BY date DESC, close DESC
    LIMIT 20
  `);
    console.log('\n=== SAMPLE DATA (20 rows) ===');
    data.rows.forEach(r => console.log(JSON.stringify(r)));

    const strategies = await client.query(`
    SELECT strategy, count(*) as cnt 
    FROM visual.vsl_bollinger_strategy 
    GROUP BY strategy 
    ORDER BY cnt DESC
  `);
    console.log('\n=== STRATEGIES ===');
    strategies.rows.forEach(r => console.log(`${r.strategy}: ${r.cnt}`));

    const dates = await client.query(`
    SELECT to_char(min(date),'yyyy-mm-dd') as min_date, to_char(max(date),'yyyy-mm-dd') as max_date, count(*) as total 
    FROM visual.vsl_bollinger_strategy
  `);
    console.log('\n=== DATE RANGE ===');
    console.log(JSON.stringify(dates.rows[0]));

    await client.end();
}

main().catch(e => { console.error(e); process.exit(1); });

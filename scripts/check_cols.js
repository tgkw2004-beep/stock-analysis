const { Client } = require('pg');
(async () => {
    const c = new Client({
        host: '118.219.232.158', port: 15432,
        database: 'atoz', user: 'azadmin', password: 'pg1234', ssl: false,
        connectionTimeoutMillis: 10000
    });
    await c.connect();

    try {
        const groupRes = await c.query('SELECT corp_group FROM company.master_company_list WHERE stock_code = \'005930\' LIMIT 1');
        const group = groupRes.rows[0].corp_group;

        // 노드(계열사) 목록
        const nodesRes = await c.query('SELECT corp_name, stock_name, corp_code, stock_code, revenue FROM company.master_company_list WHERE corp_group = $1 AND corp_group != \'일반\'', [group]);
        console.log('Nodes count:', nodesRes.rows.length);

        const corpNames = nodesRes.rows.map(r => r.corp_name);
        const stockNames = nodesRes.rows.map(r => r.stock_name);

        // 링크(지분 관계) 목록
        const linksRes = await c.query(`
            SELECT nm as source, corp_name as target, trmend_posesn_stock_qota_rt as value, relate, bsns_year
            FROM company.dart_maxshare_info 
            WHERE corp_code IN (SELECT corp_code FROM company.master_company_list WHERE corp_group = $1)
            AND bsns_year = (SELECT MAX(bsns_year) FROM company.dart_maxshare_info)
        `, [group]);

        console.log('Links count:', linksRes.rows.length);
        const intraGroupLinks = linksRes.rows.filter(l =>
            corpNames.includes(l.source) || stockNames.includes(l.source) ||
            nodesRes.rows.some(n => l.source.includes(n.stock_name) || l.source.includes(n.corp_name.replace('(주)', '').trim()))
        );
        console.log('Intra-group links count:', intraGroupLinks.length);
        console.log('Sample intra-group link:', intraGroupLinks[0]);

    } catch (err) {
        console.error(err);
    }
    await c.end();
})();

const https = require('https');

https.get('https://api.github.com/repos/tgkw2004-beep/stock-analysis/actions/runs?per_page=1', {
    headers: {
        'User-Agent': 'Node.js'
    }
}, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        const json = JSON.parse(data);
        const run = json.workflow_runs[0];
        console.log('Status: ' + run.status);
        console.log('Conclusion: ' + run.conclusion);
        console.log('URL: ' + run.html_url);
        console.log('Created At: ' + run.created_at);
        console.log('Updated At: ' + run.updated_at);
    });
}).on('error', (err) => {
    console.log('Error: ' + err.message);
});

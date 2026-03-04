const https = require('https');

https.get('https://api.github.com/repos/tgkw2004-beep/stock-analysis/actions/runs/22660006969/jobs', {
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
        const jobs = json.jobs || [];
        jobs.forEach(job => {
            console.log(`Job: ${job.name}, Status: ${job.status}, Conclusion: ${job.conclusion}`);
            if (job.status === 'completed' && job.conclusion === 'failure') {
                const failedStep = job.steps.find(s => s.conclusion === 'failure');
                if (failedStep) {
                    console.log(`  -> Failed Step: ${failedStep.name}`);
                }
            }
        });
    });
}).on('error', (err) => {
    console.log('Error: ' + err.message);
});

const fs = require('fs');
const schema = JSON.parse(fs.readFileSync('c:/Users/grunet/Desktop/박건우/project/antigravity/주식/web/docs/db_schema.json', 'utf8'));

console.log("=== vsl_bollinger_strategy ===");
const boll = schema.visual['vsl_bollinger_strategy'];
if (boll) console.log(boll.columns.map(c => c.name).join(', '));

console.log("\n=== vsl_macd_btm_supply ===");
const macd = schema.visual['vsl_macd_btm_supply'];
if (macd) console.log(macd.columns.map(c => c.name).join(', '));

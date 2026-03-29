const fs = require('fs');

const data = fs.readFileSync('lib/data/demo-data.ts', 'utf8');
const updated = data.replace(/\"price\": (\d+),\s*\"currency\":/g, '"price": $1,\n    "original_price": null,\n    "currency":');
fs.writeFileSync('lib/data/demo-data.ts', updated);
console.log('Added original_price: null to all products');

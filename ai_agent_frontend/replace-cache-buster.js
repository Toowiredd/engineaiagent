const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const cacheBuster = crypto.randomBytes(8).toString('hex');
const indexPath = path.join(__dirname, 'dist', 'index.html');

let content = fs.readFileSync(indexPath, 'utf8');
content = content.replace(/CACHE_BUSTER/g, cacheBuster);
fs.writeFileSync(indexPath, content);

console.log('Cache buster applied:', cacheBuster);
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', '(dashboard)', 'inventory', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace hsl(var(--something)) with var(--something)
content = content.replace(/hsl\(var\((--[^)]+)\)\)/g, 'var($1)');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed inventory colors');

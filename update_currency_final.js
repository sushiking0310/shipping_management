const fs = require('fs');
const path = require('path');

function replaceCurrency(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceCurrency(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace JSX text $ followed by { => ₹{
      content = content.replace(/>\$\{/g, '>₹{');
      
      // Replace ""}$ in decisions/page.tsx
      content = content.replace(/""\}\$\{/g, '""}₹{');
      
      // Replace formatting in decisions/page.tsx line 96
      content = content.replace(/^\s*\$\{(stats\.totalSavings)/gm, '                    ₹{$1');

      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

const targetDir = path.join(__dirname, 'app', '(dashboard)');
replaceCurrency(targetDir);
console.log('Final Currency replacements done');

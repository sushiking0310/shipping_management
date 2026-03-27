const fs = require('fs');
const path = require('path');

function replaceCurrency(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceCurrency(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace $ preceeding template literal variable => ₹${
      content = content.replace(/\$\$\{/g, '₹${');
      // Replace \$ followed by a digit => ₹
      content = content.replace(/\$(\d)/g, '₹$1');
      // Replace specific substrings
      content = content.replace(/Cost \(\$100s\)/g, 'Cost (₹100s)');
      content = content.replace(/Avg Rate \(\$\/kg\)/g, 'Avg Rate (₹/kg)');

      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

const targetDir = path.join(__dirname, 'app', '(dashboard)');
replaceCurrency(targetDir);
console.log('Currency replaced successfully');

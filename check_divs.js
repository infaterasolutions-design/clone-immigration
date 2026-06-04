const fs = require('fs');
const code = fs.readFileSync('src/components/ArticleSection.jsx', 'utf-8');

const lines = code.split('\n');
let divCount = 0;
let stack = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Count `<div`
  const opens = (line.match(/<div/g) || []).length;
  // Count `</div`
  const closes = (line.match(/<\/div/g) || []).length;
  
  if (opens > 0) stack.push({ line: i + 1, count: opens, type: 'open' });
  if (closes > 0) stack.push({ line: i + 1, count: closes, type: 'close' });
}

let balance = 0;
for (const item of stack) {
  if (item.type === 'open') balance += item.count;
  if (item.type === 'close') balance -= item.count;
  // console.log(`Line ${item.line}: ${item.type} (${balance})`);
}

console.log('Final DIV balance:', balance);

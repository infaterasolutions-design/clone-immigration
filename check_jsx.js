const fs = require('fs');
const babel = require('@babel/core');

try {
  const code = fs.readFileSync('src/components/ArticleSection.jsx', 'utf-8');
  babel.transformSync(code, {
    presets: ['@babel/preset-react'],
    filename: 'ArticleSection.jsx'
  });
  console.log('No syntax errors.');
} catch (err) {
  console.error(err.message);
}

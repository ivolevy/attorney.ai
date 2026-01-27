const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'index.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Replace main #root padding using regex to handle potential whitespace differences
cssContent = cssContent.replace(/padding-top:\s*5vh;/, 'padding-top: 140px;');

// Replace mobile media query padding
cssContent = cssContent.replace(/padding-top:\s*20px;/, 'padding-top: 100px;');

fs.writeFileSync(cssPath, cssContent);
console.log('CSS updated successfully');

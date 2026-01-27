const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'index.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Replace main #root padding
cssContent = cssContent.replace('padding-top: 5vh;', 'padding-top: 140px;');

// Replace mobile media query padding
// We search for the specific mobile block context to be safe, or just the first occurrence after the main one if unique.
// Only one other padding-top: 20px exists in the provided view, inside the media query.
cssContent = cssContent.replace('padding-top: 20px;', 'padding-top: 100px;');

fs.writeFileSync(cssPath, cssContent);
console.log('CSS updated successfully');

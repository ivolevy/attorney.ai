const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'index.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Revert main #root padding
cssContent = cssContent.replace(/padding-top:\s*140px;/, 'padding-top: 5vh;');

// Revert mobile media query padding
cssContent = cssContent.replace(/padding-top:\s*100px;/, 'padding-top: 20px;');

// Add new class if not exists
if (!cssContent.includes('.auth-content-wrapper')) {
    cssContent += `
.auth-content-wrapper {
    padding-top: 100px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
}
`;
}

fs.writeFileSync(cssPath, cssContent);
console.log('CSS fixed successfully');

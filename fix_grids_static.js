const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/components/RoleDashboards.jsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.split(`{ xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' }`).join(`'repeat(5, 1fr)'`);
content = content.split(`{ xs: '1fr', sm: '1fr', md: 'repeat(3, 1fr)' }`).join(`'repeat(3, 1fr)'`);
content = content.split(`{ xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }`).join(`'repeat(4, 1fr)'`);

fs.writeFileSync(filePath, content, 'utf8');

const dashPath = path.join(__dirname, 'frontend/src/pages/Dashboard.jsx');
let dashContent = fs.readFileSync(dashPath, 'utf8');
dashContent = dashContent.split(`{ xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' }`).join(`'repeat(5, 1fr)'`);
fs.writeFileSync(dashPath, dashContent, 'utf8');

console.log('Successfully enforced static grid columns');

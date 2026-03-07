const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/components/RoleDashboards.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace '{ xs: ... }' with { xs: ... }
content = content.replace(/'\{ xs: /g, '{ xs: ');
content = content.replace(/ \}'/g, ' }');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully fixed JSX quoting in RoleDashboards.jsx');

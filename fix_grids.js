const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/components/RoleDashboards.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace standard Grid items with simple Box wrappers for the StatCards
content = content.replace(/<Grid item[^>]*><StatCard (.*?) \/><\/Grid>/g, '<Box><StatCard $1 /></Box>');

// Sales has 5 cards
content = content.replace(
    /<Grid container spacing=\{3\} columns=\{10\}>/g,
    `<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' }, gap: 3 }}>`
);

// All other containers
content = content.replace(
    /<Grid container spacing=\{3\}>/g,
    `<Box sx={{ display: 'grid', gridTemplateColumns: '__REPLACE_ME__', gap: 3 }}>`
);

// Any remaining </Grid> should become </Box>
content = content.replace(/<\/Grid>/g, '</Box>');

// Now intelligently replace __REPLACE_ME__
const replacements = [
    { name: 'HRDashboard', count: 3 },
    { name: 'ProductionDashboard', count: 4 },
    { name: 'PurchaseDashboard', count: 4 },
    { name: 'LogisticsDashboard', count: 3 },
    { name: 'QualityDashboard', count: 3 },
    { name: 'FinanceDashboard', count: 4 },
    { name: 'StoreDashboard', count: 3 },
    { name: 'MaintenanceDashboard', count: 4 },
    { name: 'AssetDashboard', count: 4 },
    { name: 'ContractorDashboard', count: 3 }
];

replacements.forEach(({ name, count }) => {
    const smCols = count === 3 ? '1fr' : '1fr 1fr';
    const colsStr = `{ xs: '1fr', sm: '${smCols}', md: 'repeat(${count}, 1fr)' }`;
    const regex = new RegExp(`(export const ${name}[\\s\\S]*?)__REPLACE_ME__`, 'm');
    content = content.replace(regex, `$1${colsStr}`);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated RoleDashboards.jsx');

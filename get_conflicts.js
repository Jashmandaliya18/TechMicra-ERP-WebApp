const fs = require('fs');
const cp = require('child_process');
const status = cp.execSync('git diff --name-only --diff-filter=U').toString().trim().split('\n').map(s => s.trim()).filter(Boolean);
fs.writeFileSync('conflicted_files.json', JSON.stringify(status, null, 2));

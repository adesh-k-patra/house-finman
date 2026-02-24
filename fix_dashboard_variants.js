const fs = require('fs');

const filePath = '/Users/apple/Desktop/HouseFin Man/frontend/src/features/dashboard/DashboardPage.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Remove variant from trend objects
content = content.replace(/trend: { ([^}]*?), variant: '[^']*?' as const }/g, 'trend: { $1 }');

fs.writeFileSync(filePath, content);
console.log('Fixed variants in DashboardPage.tsx');

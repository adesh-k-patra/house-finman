const fs = require('fs');
const path = require('path');

const filePath = '/Users/apple/Desktop/HouseFin Man/frontend/src/features/dashboard/DashboardPage.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const variants = ['blue', 'emerald', 'orange', 'purple', 'magenta', 'royal', 'slate', 'violet', 'rose', 'teal', 'amber', 'indigo', 'cyan'];

function addVariants(arrayName) {
    const regex = new RegExp(`const ${arrayName} = \\[([\\s\\S]*?)\\]`, 'g');
    content = content.replace(regex, (match, p1) => {
        let items = p1.split('},').map(item => item.trim());
        let updatedItems = items.map((item, index) => {
            if (item && !item.includes('variant:')) {
                const variant = variants[index % variants.length];
                if (item.endsWith('}')) {
                    return item.slice(0, -1) + `, variant: '${variant}' as const }`;
                } else if (item) {
                    return item + `, variant: '${variant}' as const }`;
                }
            }
            return item;
        });
        return `const ${arrayName} = [\n    ${updatedItems.filter(i => i).join(',\n    ')}\n]`;
    });
}

const arrays = [
    'salesPipelineKPIs',
    'operationalKPIs',
    'financeKPIs',
    'propertyKPIs',
    'partnerVendorKPIs',
    'portfolioRiskKPIs',
    'campaignKPIs',
    'mentorKPIs',
    'supportKPIs'
];

arrays.forEach(addVariants);

fs.writeFileSync(filePath, content);
console.log('Updated DashboardPage.tsx variants');

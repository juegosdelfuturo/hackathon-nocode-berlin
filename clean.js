import fs from 'fs';
const file = 'src/data/articlesData.ts';
let content = fs.readFileSync(file, 'utf8');

// Use regex to empty these arrays
content = content.replace(/statistics:\s*\[[\s\S]*?\n\s*\],/g, 'statistics: [],');
content = content.replace(/citations:\s*\[[\s\S]*?\n\s*\],/g, 'citations: [],');
content = content.replace(/namedSources:\s*\[[\s\S]*?\n\s*\],/g, 'namedSources: [],');
content = content.replace(/firstPersonNote:\s*\{[\s\S]*?\n\s*\},/g, 'firstPersonNote: { author: "", role: "", note: "" },');

fs.writeFileSync(file, content);
console.log('Done');

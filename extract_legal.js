import fs from 'fs';
fetch('https://team-nexio.com/assets/index-ChbFzESM.js')
  .then(res => res.text())
  .then(text => {
    const templates = text.match(/`[^`]+`/g);
    if (templates) {
        fs.writeFileSync('all_templates.json', JSON.stringify(templates, null, 2));
    }
  });

const fs = require('fs');

let content = fs.readFileSync('job.controller.js', 'utf8');

for(let i = 21; i <= 100; i++) {
    const old = `experience: getRandomExperience("${i}")`;
    const postedOn = i <= 31 ? `2024-01-${(i + 14).toString().padStart(2, '0')}` : 
                     i <= 70 ? `2024-03-${(i - 36).toString().padStart(2, '0')}` :
                     `2024-04-${(i - 70).toString().padStart(2, '0')}`;
    const newStr = `experience: getRandomExperience("${i}"), postedOn: "${postedOn}"`;
    content = content.replace(old, newStr);
}

fs.writeFileSync('job.controller.js', content);
console.log('PostedOn dates added successfully!');

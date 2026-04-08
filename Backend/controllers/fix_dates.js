const fs = require('fs');

let content = fs.readFileSync('job.controller.js', 'utf8');

// Add postedOn dates to all jobs that don't have them
const jobPattern = /{ _id: "(\d+)", title: "[^"]+", description: "[^"]+", location: "[^"]+", salary: "[^"]+", jobType: "[^"]+", position: \d+, experience: getRandomExperience\("\1"\), company: {/g;

let match;
while ((match = jobPattern.exec(content)) !== null) {
    const jobId = parseInt(match[1]);
    const postedOn = jobId <= 31 ? `2024-01-${(jobId + 14).toString().padStart(2, '0')}` : 
                     jobId <= 70 ? `2024-03-${(jobId - 36).toString().padStart(2, '0')}` :
                     `2024-04-${(jobId - 70).toString().padStart(2, '0')}`;
    
    const oldText = match[0];
    const newText = oldText.replace(
        `experience: getRandomExperience("${jobId}")`, 
        `experience: getRandomExperience("${jobId}"), postedOn: "${postedOn}"`
    );
    
    content = content.replace(oldText, newText);
}

fs.writeFileSync('job.controller.js', content);
console.log('PostedOn dates added successfully!');

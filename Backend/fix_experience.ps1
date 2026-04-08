# PowerShell script to fix experience values in job controller
$content = Get-Content "controllers\job.controller.js" -Raw

# Replace each job ID with its corresponding experience function call
for ($i = 1; $i -le 100; $i++) {
    $pattern = '_id: "' + $i + '",([^}]*?)experience: getRandomExperience\("\$1"\)'
    $replacement = '_id: "' + $i + '",$1experience: getRandomExperience("' + $i + '")'
    $content = $content -replace $pattern, $replacement
}

# Also handle the getJobById function
for ($i = 1; $i -le 100; $i++) {
    $pattern = '_id: "' + $i + '",([^}]*?)experience: "3-5 years"'
    $replacement = '_id: "' + $i + '",$1experience: getRandomExperience("' + $i + '")'
    $content = $content -replace $pattern, $replacement
}

$content | Out-File -FilePath "controllers\job.controller.js" -Encoding utf8 -Force

Write-Host "Experience values updated successfully!"

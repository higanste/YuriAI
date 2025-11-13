// Script to create extension ZIP file
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const extensionDir = path.join(__dirname, '../extension');
const zipFile = path.join(__dirname, '../public/rtrvr-extension.zip');
const publicDir = path.join(__dirname, '../public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Files to include in the extension
const filesToInclude = [
  'manifest.json',
  'background.js',
  'content.js',
  'popup.html',
  'popup.css',
  'popup.js',
  'README.md',
  'ICON_INSTRUCTIONS.md',
  'icons'
];

console.log('Creating extension ZIP file...');

// Check if extension directory exists
if (!fs.existsSync(extensionDir)) {
  console.error('Extension directory not found!');
  process.exit(1);
}

// Try to create ZIP using native commands
try {
  // Change to extension directory
  process.chdir(extensionDir);
  
  // Try using PowerShell on Windows or zip on Unix
  if (process.platform === 'win32') {
    // Use PowerShell Compress-Archive
    const files = filesToInclude.join(',');
    execSync(
      `powershell -Command "Compress-Archive -Path ${files} -DestinationPath '${zipFile}' -Force"`,
      { stdio: 'inherit' }
    );
  } else {
    // Use zip command on Unix
    execSync(`zip -r "${zipFile}" ${filesToInclude.join(' ')}`, { stdio: 'inherit' });
  }
  
  console.log(`✓ Extension ZIP created: ${zipFile}`);
  const stats = fs.statSync(zipFile);
  console.log(`  Size: ${(stats.size / 1024).toFixed(2)} KB`);
} catch (error) {
  console.error('Failed to create ZIP file:', error.message);
  console.log('\n⚠ Manual steps:');
  console.log('1. Navigate to the extension folder');
  console.log('2. Select all files and folders');
  console.log('3. Right-click and choose "Send to" > "Compressed (zipped) folder"');
  console.log(`4. Rename the ZIP file to "rtrvr-extension.zip"`);
  console.log(`5. Move it to the public folder: ${publicDir}`);
  process.exit(1);
}


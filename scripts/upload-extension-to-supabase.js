// Script to create and upload extension ZIP to Supabase storage
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { createClient } = require('@supabase/supabase-js');

const extensionDir = path.join(__dirname, '../extension');
const zipFile = path.join(__dirname, '../yuriai-extension.zip');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pfhooryqziljvzyorbin.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmaG9vcnlxemlsanZ6eW9yYmluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5ODM3ODcsImV4cCI6MjA3ODU1OTc4N30.psEdD7KsNQ8UDV_4_6EEJGuS0IQQ2eaE9H65De45hDU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createZip() {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipFile);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`✓ ZIP created: ${zipFile} (${archive.pointer()} bytes)`);
      resolve(zipFile);
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);

    // Add all files from extension directory
    function addDirectory(dirPath, basePath = '') {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const relativePath = basePath ? `${basePath}/${item}` : item;
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          if (item !== 'node_modules' && !item.startsWith('.') && item !== 'dist') {
            addDirectory(fullPath, relativePath);
          }
        } else {
          archive.file(fullPath, { name: relativePath });
        }
      }
    }

    addDirectory(extensionDir);
    archive.finalize();
  });
}

async function uploadToSupabase(filePath) {
  try {
    // Read the file
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = 'yuriai-extension.zip';

    // Upload to Supabase storage (bucket: 'extensions')
    const { data, error } = await supabase.storage
      .from('extensions')
      .upload(fileName, fileBuffer, {
        contentType: 'application/zip',
        upsert: true // Overwrite if exists
      });

    if (error) {
      // If bucket doesn't exist, create it first
      if (error.message.includes('Bucket not found')) {
        console.log('Creating extensions bucket...');
        // Note: Bucket creation requires service role key, so we'll handle this differently
        throw new Error('Please create a bucket named "extensions" in Supabase Storage first');
      }
      throw error;
    }

    console.log(`✓ Uploaded to Supabase: ${fileName}`);
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('extensions')
      .getPublicUrl(fileName);

    console.log(`✓ Public URL: ${urlData.publicUrl}`);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('Creating extension ZIP...');
    const zipPath = await createZip();
    
    console.log('Uploading to Supabase...');
    const publicUrl = await uploadToSupabase(zipPath);
    
    console.log('\n✅ Success!');
    console.log(`Extension ZIP is available at: ${publicUrl}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();


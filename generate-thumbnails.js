import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const inputDir = path.join(process.cwd(), 'public', 'apple-emojis');
const outputDir = path.join(process.cwd(), 'public', 'apple-emojis-sm');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function processImages() {
  const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.png'));
  console.log(`Procesez ${files.length} emoji-uri...`);

  let count = 0;
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);

    if (!fs.existsSync(outputPath)) {
      await sharp(inputPath)
        .resize(64, 64)
        .png({ quality: 80, effort: 6 })
        .toFile(outputPath);
    }
    
    count++;
    if (count % 500 === 0) console.log(`Procesate: ${count}/${files.length}`);
  }
  
  console.log('Generare miniaturi finalizată cu succes!');
}

processImages().catch(console.error);
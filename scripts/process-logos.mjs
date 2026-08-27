/**
 * process-logos.mjs
 * 
 * Processes hospital logo images from brandassets/ → public/logos/
 * Removes white/light backgrounds and outputs transparent PNGs.
 * 
 * Run once: node scripts/process-logos.mjs
 * Requires: npm install sharp
 */

import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INPUT_DIR = path.join(__dirname, '..', 'brandassets');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'logos');

// Hospital logo files to process
const LOGOS = [
  { input: 'BNH_Hospital_Logo.svg.webp',                       output: 'bnh.png' },
  { input: 'BPK9 International Hospital.png',                   output: 'bpk9.png' },
  { input: 'MedPark_Hospital_Logo.svg.webp',                    output: 'medpark.png' },
  { input: 'Nakornthon_Hospital_Logo.svg.webp',                 output: 'nakornthon.png' },
  { input: 'Gleneagles Hospital.png',                           output: 'gleneagles.png' },
  { input: 'Jetanin.png',                                       output: 'jetanin.png' },
  { input: 'Chularat 3.jpg',                                    output: 'chularat.png' },
  { input: 'Praram 9.jpg',                                      output: 'praram9.png' },
  { input: 'Memorial Hospital Group.png',                       output: 'memorial.png' },
  { input: 'St. Stamford Modern Cancer Hospital Guangzhou.jpg', output: 'st-stamford.png' },
];

/**
 * Remove near-white background from an image by making pixels
 * above a brightness threshold transparent.
 */
async function removeBackground(inputPath, outputPath) {
  const filename = path.basename(inputPath);
  console.log(`Processing: ${filename}`);

  try {
    // Get raw pixel data as RGBA
    const { data, info } = await sharp(inputPath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    const buf = Buffer.from(data);

    // Threshold: pixels where R, G, B are all above 220 become transparent
    const THRESHOLD = 220;
    for (let i = 0; i < buf.length; i += channels) {
      const r = buf[i];
      const g = buf[i + 1];
      const b = buf[i + 2];
      if (r > THRESHOLD && g > THRESHOLD && b > THRESHOLD) {
        buf[i + 3] = 0; // Set alpha to 0 (transparent)
      }
    }

    await sharp(buf, { raw: { width, height, channels } })
      .png({ compressionLevel: 9 })
      .toFile(outputPath);

    console.log(`  ✓ Saved → ${path.basename(outputPath)}`);
  } catch (err) {
    console.error(`  ✗ Failed (${filename}): ${err.message}`);
  }
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (const logo of LOGOS) {
    const inputPath = path.join(INPUT_DIR, logo.input);
    const outputPath = path.join(OUTPUT_DIR, logo.output);

    if (!fs.existsSync(inputPath)) {
      console.warn(`  ⚠ Skipping (not found): ${logo.input}`);
      continue;
    }

    await removeBackground(inputPath, outputPath);
  }

  console.log('\nDone! Logos saved to public/logos/');
}

main().catch(console.error);

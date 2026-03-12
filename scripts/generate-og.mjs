#!/usr/bin/env node
/**
 * Generate OG image from the /og page.
 * Usage: node scripts/generate-og.mjs
 *
 * Requires: npx playwright install chromium (first time only)
 * The dev server must be running on port 6001.
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, '../public/og-image.png');
const OG_URL = 'http://localhost:6001/og';
const WIDTH = 1200;
const HEIGHT = 630;

async function generate() {
  console.log('Generating OG image...');
  console.log(`  URL: ${OG_URL}`);
  console.log(`  Size: ${WIDTH}x${HEIGHT}`);
  console.log(`  Output: ${OUTPUT_PATH}`);

  // Use Playwright via npx for clean headless screenshot
  try {
    const cmd = [
      'npx --yes playwright',
      'screenshot',
      `--viewport-size="${WIDTH},${HEIGHT}"`,
      '--wait-for-timeout=1000',
      `"${OG_URL}"`,
      `"${OUTPUT_PATH}"`,
    ].join(' ');

    execSync(cmd, { stdio: 'inherit', timeout: 30000 });
    console.log('\nOG image generated successfully!');
    console.log(`File: ${OUTPUT_PATH}`);
  } catch {
    // Fallback: use capture-website-cli
    console.log('Playwright CLI not available, trying capture-website-cli...');
    try {
      const cmd = [
        'npx --yes capture-website-cli@4',
        `"${OG_URL}"`,
        `--output="${OUTPUT_PATH}"`,
        `--width=${WIDTH}`,
        `--height=${HEIGHT}`,
        '--type=png',
        '--overwrite',
        '--no-default-background',
      ].join(' ');

      execSync(cmd, { stdio: 'inherit', timeout: 60000 });
      console.log('\nOG image generated successfully!');
      console.log(`File: ${OUTPUT_PATH}`);
    } catch (e2) {
      console.error('Failed to generate OG image. Install Playwright or capture-website-cli.');
      console.error('Run: npx playwright install chromium');
      process.exit(1);
    }
  }
}

generate();

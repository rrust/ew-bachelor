#!/usr/bin/env node

/**
 * Audio Generation Script
 *
 * Generates MP3 files from .audio.txt scripts using Edge TTS.
 *
 * Usage:
 *   node scripts/generate-audio.js                    # Generate missing audio only
 *   node scripts/generate-audio.js --force            # Regenerate all audio
 *   node scripts/generate-audio.js --lecture 18       # Only lecture 18
 *   node scripts/generate-audio.js --module 02        # Only module 02
 *   node scripts/generate-audio.js --dry-run          # Show what would be generated
 */

const { execSync, spawn } = require('child_process');
const { existsSync, readdirSync, statSync } = require('fs');
const { join } = require('path');

const ROOT_DIR = join(__dirname, '..');
const CONTENT_DIR = join(ROOT_DIR, 'content');

// Configuration
const VOICE = 'de-DE-FlorianMultilingualNeural';
const CONCURRENT_JOBS = 3; // Number of parallel TTS jobs

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  force: args.includes('--force') || args.includes('-f'),
  dryRun: args.includes('--dry-run') || args.includes('-n'),
  verbose: args.includes('--verbose') || args.includes('-v'),
  lecture: null,
  module: null,
  study: null
};

// Parse --lecture, --module, --study arguments
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--lecture' && args[i + 1]) {
    options.lecture = args[i + 1];
  }
  if (args[i] === '--module' && args[i + 1]) {
    options.module = args[i + 1];
  }
  if (args[i] === '--study' && args[i + 1]) {
    options.study = args[i + 1];
  }
}

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Find all .audio.txt files in the content directory
 */
function findAudioScripts() {
  const scripts = [];

  function walkDir(dir) {
    if (!existsSync(dir)) return;

    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.endsWith('.audio.txt')) {
        scripts.push(fullPath);
      }
    }
  }

  walkDir(CONTENT_DIR);
  return scripts;
}

/**
 * Filter scripts based on options
 */
function filterScripts(scripts) {
  return scripts.filter((script) => {
    const relativePath = script.replace(CONTENT_DIR + '/', '');
    const parts = relativePath.split('/');

    // Filter by study
    if (options.study && !parts[0].includes(options.study)) {
      return false;
    }

    // Filter by module (e.g., "02" matches "02-chemie-grundlagen")
    if (options.module) {
      const moduleMatch = parts.find((p) => p.match(/^\d{2}-/));
      if (!moduleMatch || !moduleMatch.startsWith(options.module + '-')) {
        return false;
      }
    }

    // Filter by lecture (e.g., "18" matches "18-saeuren-basen")
    if (options.lecture) {
      const lectureMatch = parts.find((p, i) => i > 1 && p.match(/^\d{2}-/));
      if (!lectureMatch || !lectureMatch.startsWith(options.lecture + '-')) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Check if MP3 needs to be generated
 */
function needsGeneration(scriptPath) {
  if (options.force) return true;

  const mp3Path = scriptPath.replace('.audio.txt', '.mp3');
  if (!existsSync(mp3Path)) return true;

  // Check if script is newer than MP3
  const scriptStat = statSync(scriptPath);
  const mp3Stat = statSync(mp3Path);

  return scriptStat.mtimeMs > mp3Stat.mtimeMs;
}

/**
 * Generate MP3 from audio script using Edge TTS
 */
function generateAudio(scriptPath) {
  return new Promise((resolve, reject) => {
    const mp3Path = scriptPath.replace('.audio.txt', '.mp3');
    const relativePath = scriptPath.replace(ROOT_DIR + '/', '');

    const tts = spawn('python3', [
      '-m',
      'edge_tts',
      '--voice',
      VOICE,
      '-f',
      scriptPath,
      '--write-media',
      mp3Path
    ]);

    let stderr = '';
    tts.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    tts.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, path: relativePath });
      } else {
        resolve({ success: false, path: relativePath, error: stderr });
      }
    });

    tts.on('error', (err) => {
      resolve({ success: false, path: relativePath, error: err.message });
    });
  });
}

/**
 * Process scripts in batches with concurrency limit
 */
async function processInBatches(scripts, batchSize) {
  const results = { success: 0, failed: 0, skipped: 0 };
  const toGenerate = [];

  // Determine which files need generation
  for (const script of scripts) {
    if (needsGeneration(script)) {
      toGenerate.push(script);
    } else {
      results.skipped++;
      if (options.verbose) {
        const relativePath = script.replace(ROOT_DIR + '/', '');
        log(`  ⏭️  ${relativePath} (up to date)`, 'dim');
      }
    }
  }

  if (toGenerate.length === 0) {
    return results;
  }

  log(`\n📢 Generating ${toGenerate.length} audio file(s)...`, 'cyan');

  if (options.dryRun) {
    for (const script of toGenerate) {
      const relativePath = script.replace(ROOT_DIR + '/', '');
      log(`  Would generate: ${relativePath}`, 'yellow');
    }
    return results;
  }

  // Process in batches
  for (let i = 0; i < toGenerate.length; i += batchSize) {
    const batch = toGenerate.slice(i, i + batchSize);
    const promises = batch.map((script) => generateAudio(script));
    const batchResults = await Promise.all(promises);

    for (const result of batchResults) {
      if (result.success) {
        results.success++;
        log(`  ✅ ${result.path}`, 'green');
      } else {
        results.failed++;
        log(`  ❌ ${result.path}: ${result.error}`, 'red');
      }
    }
  }

  return results;
}

/**
 * Main function
 */
async function main() {
  console.log('\n🎙️  Audio Generation Script\n');

  // Check if edge-tts is available
  try {
    execSync('python3 -m edge_tts --version', { stdio: 'pipe' });
  } catch {
    log('❌ edge-tts is not installed. Run: pip3 install edge-tts', 'red');
    process.exit(1);
  }

  // Show options
  if (options.force)
    log('🔄 Force mode: Regenerating all audio files', 'yellow');
  if (options.dryRun)
    log('🔍 Dry run mode: No files will be generated', 'yellow');
  if (options.study) log(`📚 Filtering by study: ${options.study}`, 'cyan');
  if (options.module) log(`📦 Filtering by module: ${options.module}`, 'cyan');
  if (options.lecture)
    log(`📖 Filtering by lecture: ${options.lecture}`, 'cyan');

  // Find and filter scripts
  const allScripts = findAudioScripts();
  const scripts = filterScripts(allScripts);

  log(`\n📝 Found ${scripts.length} audio script(s)`, 'cyan');

  if (scripts.length === 0) {
    log('\nNo audio scripts found matching the criteria.', 'yellow');
    process.exit(0);
  }

  // Process scripts
  const results = await processInBatches(scripts, CONCURRENT_JOBS);

  // Summary
  console.log('\n' + '─'.repeat(50));
  log(`\n📊 Summary:`, 'cyan');
  if (results.success > 0) log(`   ✅ Generated: ${results.success}`, 'green');
  if (results.skipped > 0) log(`   ⏭️  Skipped:   ${results.skipped}`, 'dim');
  if (results.failed > 0) log(`   ❌ Failed:    ${results.failed}`, 'red');

  if (!options.dryRun && results.success > 0) {
    log(`\n💡 Run 'npm run build' to update the bundles.`, 'yellow');
  }

  console.log();
  process.exit(results.failed > 0 ? 1 : 0);
}

main().catch((err) => {
  log(`\n❌ Error: ${err.message}`, 'red');
  process.exit(1);
});

#!/usr/bin/env node

/**
 * YouTube Video Validator
 * Validates all YouTube videos in content files using the oEmbed API.
 *
 * Usage: node scripts/validate-videos.js [studyId]
 * Example: node scripts/validate-videos.js bsc-ernaehrungswissenschaften
 *
 * If no studyId is provided, validates all studies.
 *
 * No external dependencies required! Uses native https module.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const CONTENT_DIR = path.join(__dirname, '..', 'content');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

/**
 * Extract video ID from various YouTube URL formats
 */
function extractVideoId(url) {
  if (!url) return null;

  const patterns = [
    // Standard watch URL
    /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.*&v=)([a-zA-Z0-9_-]{11})/,
    // Short URL
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    // Embed URL
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    // Old embed URL
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

/**
 * Simple YAML frontmatter parser
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const yaml = match[1];
  const result = {};

  // Parse simple key-value pairs
  const lines = yaml.split('\n');
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Remove quotes
    if (
      (value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"'))
    ) {
      value = value.slice(1, -1);
    }

    result[key] = value;
  }

  return result;
}

/**
 * Check if a video is available using YouTube oEmbed API
 * Returns a promise that resolves to { available: boolean, title?: string, error?: string }
 */
function checkVideoAvailability(videoId) {
  return new Promise((resolve) => {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;

    const req = https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            resolve({
              available: true,
              title: json.title,
              author: json.author_name
            });
          } catch {
            resolve({
              available: false,
              error: 'Invalid JSON response'
            });
          }
        } else {
          resolve({
            available: false,
            error: `HTTP ${res.statusCode}`
          });
        }
      });
    });

    req.on('error', (err) => {
      resolve({
        available: false,
        error: err.message
      });
    });

    // Timeout after 10 seconds
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        available: false,
        error: 'Timeout'
      });
    });
  });
}

/**
 * Find all YouTube video files in a directory recursively
 */
function findVideoFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      findVideoFiles(fullPath, files);
    } else if (entry.name.endsWith('.md')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const frontmatter = parseFrontmatter(content);

        if (
          frontmatter &&
          frontmatter.type === 'youtube-video' &&
          frontmatter.url
        ) {
          files.push({
            path: fullPath,
            url: frontmatter.url,
            title: frontmatter.title || 'Untitled'
          });
        }
      } catch {
        // Skip files that can't be read
      }
    }
  }

  return files;
}

/**
 * Get relative path from content directory
 */
function getRelativePath(fullPath) {
  return path.relative(CONTENT_DIR, fullPath);
}

/**
 * Main validation function
 */
async function validateVideos(studyId) {
  console.log('\n' + colors.cyan + '🎬 YouTube Video Validator' + colors.reset);
  console.log(colors.dim + '─'.repeat(50) + colors.reset + '\n');

  // Determine which directories to scan
  let directories = [];

  if (studyId) {
    const studyDir = path.join(CONTENT_DIR, studyId);
    if (!fs.existsSync(studyDir)) {
      console.error(
        `${colors.red}❌ Study directory not found: ${studyId}${colors.reset}`
      );
      process.exit(1);
    }
    directories = [studyDir];
    console.log(`Scanning: ${colors.blue}${studyId}${colors.reset}\n`);
  } else {
    // Scan all study directories
    const entries = fs.readdirSync(CONTENT_DIR, { withFileTypes: true });
    directories = entries
      .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
      .map((e) => path.join(CONTENT_DIR, e.name));
    console.log(`Scanning all studies...\n`);
  }

  // Find all video files
  const videoFiles = [];
  for (const dir of directories) {
    findVideoFiles(dir, videoFiles);
  }

  if (videoFiles.length === 0) {
    console.log(
      `${colors.yellow}⚠️  No YouTube video files found.${colors.reset}\n`
    );
    return;
  }

  console.log(
    `Found ${colors.blue}${videoFiles.length}${colors.reset} video files to validate.\n`
  );

  // Validate each video
  const results = {
    available: [],
    unavailable: [],
    invalid: []
  };

  for (let i = 0; i < videoFiles.length; i++) {
    const video = videoFiles[i];
    const videoId = extractVideoId(video.url);
    const relativePath = getRelativePath(video.path);

    // Progress indicator
    process.stdout.write(
      `\r[${i + 1}/${videoFiles.length}] Checking: ${relativePath
        .slice(0, 50)
        .padEnd(50)}...`
    );

    if (!videoId) {
      results.invalid.push({
        ...video,
        relativePath,
        error: 'Could not extract video ID from URL'
      });
      continue;
    }

    const check = await checkVideoAvailability(videoId);

    if (check.available) {
      results.available.push({
        ...video,
        relativePath,
        videoId,
        oembedTitle: check.title,
        author: check.author
      });
    } else {
      results.unavailable.push({
        ...video,
        relativePath,
        videoId,
        error: check.error
      });
    }

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Clear progress line
  process.stdout.write('\r' + ' '.repeat(80) + '\r');

  // Print results
  console.log('\n' + colors.dim + '─'.repeat(50) + colors.reset);
  console.log(colors.cyan + 'Results:' + colors.reset + '\n');

  // Available videos
  if (results.available.length > 0) {
    console.log(
      `${colors.green}✅ Available: ${results.available.length}${colors.reset}`
    );
  }

  // Invalid URLs
  if (results.invalid.length > 0) {
    console.log(
      `\n${colors.yellow}⚠️  Invalid URLs: ${results.invalid.length}${colors.reset}`
    );
    for (const video of results.invalid) {
      console.log(`   ${colors.dim}${video.relativePath}${colors.reset}`);
      console.log(`      URL: ${video.url}`);
      console.log(`      ${colors.yellow}Error: ${video.error}${colors.reset}`);
    }
  }

  // Unavailable videos
  if (results.unavailable.length > 0) {
    console.log(
      `\n${colors.red}❌ Unavailable: ${results.unavailable.length}${colors.reset}`
    );
    for (const video of results.unavailable) {
      console.log(`   ${colors.dim}${video.relativePath}${colors.reset}`);
      console.log(`      URL: ${video.url}`);
      console.log(`      Video ID: ${video.videoId}`);
      console.log(`      ${colors.red}Error: ${video.error}${colors.reset}`);
    }
  }

  // Summary
  console.log('\n' + colors.dim + '─'.repeat(50) + colors.reset);
  const total = videoFiles.length;
  const okCount = results.available.length;
  const failCount = results.unavailable.length + results.invalid.length;

  if (failCount === 0) {
    console.log(
      `\n${colors.green}✅ All ${total} videos are available!${colors.reset}\n`
    );
    process.exit(0);
  } else {
    console.log(
      `\n${colors.red}❌ ${failCount} of ${total} videos have issues.${colors.reset}`
    );
    console.log(
      `${colors.dim}Replace unavailable videos with alternatives.${colors.reset}\n`
    );
    process.exit(1);
  }
}

// Run the validator
const studyId = process.argv[2];
validateVideos(studyId).catch((err) => {
  console.error(`${colors.red}Error: ${err.message}${colors.reset}`);
  process.exit(1);
});

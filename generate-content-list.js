#!/usr/bin/env node

/**
 * Generates content-list.json by scanning the content directory
 * Run: node generate-content-list.js
 */

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, 'content');
const OUTPUT_FILE = path.join(CONTENT_DIR, 'content-list.json');

function getAllMarkdownFiles(dir, baseDir = CONTENT_DIR, fileList = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip hidden directories and node_modules
      if (!file.startsWith('.') && file !== 'node_modules') {
        getAllMarkdownFiles(filePath, baseDir, fileList);
      }
    } else if (file.endsWith('.md')) {
      // Convert to relative path from content directory
      const relativePath = path.relative(baseDir, filePath).replace(/\\/g, '/');
      fileList.push(`content/${relativePath}`);
    }
  }

  return fileList;
}

function sortContentFiles(files) {
  // Sort files in a logical order:
  // 1. By module number
  // 2. By lecture number
  // 3. lecture.md first, then lecture-items/, then quiz.md, then questions/
  // 4. Within folders, by number prefix

  return files.sort((a, b) => {
    const partsA = a.split('/');
    const partsB = b.split('/');

    // Compare module
    if (partsA[1] !== partsB[1]) {
      return partsA[1].localeCompare(partsB[1]);
    }

    // Compare lecture
    if (partsA[2] !== partsB[2]) {
      return partsA[2].localeCompare(partsB[2]);
    }

    // Prioritize file types
    const getPriority = (parts) => {
      if (parts[3] === 'lecture.md') return 1;
      if (parts[3] === 'lecture-items') return 2;
      if (parts[3] === 'quiz.md') return 4;
      if (parts[3] === 'questions') return 5;
      return 3;
    };

    const prioA = getPriority(partsA);
    const prioB = getPriority(partsB);

    if (prioA !== prioB) {
      return prioA - prioB;
    }

    // Within same folder, sort by filename
    return a.localeCompare(b);
  });
}

// Generate the file list
console.log('Scanning content directory...');
const files = getAllMarkdownFiles(CONTENT_DIR);
const sortedFiles = sortContentFiles(files);

console.log(`Found ${sortedFiles.length} markdown files`);

// Write to content-list.json
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(sortedFiles, null, 2));

console.log(`✓ Generated ${OUTPUT_FILE}`);
console.log(`  ${sortedFiles.length} files registered`);

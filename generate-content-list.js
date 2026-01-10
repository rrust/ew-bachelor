#!/usr/bin/env node

/**
 * Generates content-list.json and modules.json by scanning the content directory.
 * 
 * Content developers only need to:
 * 1. Create a module folder (e.g., 01-module-name/)
 * 2. Add a module.md with YAML frontmatter (id, title, ects, status, order, description)
 * 3. Add lecture folders, achievements, etc.
 * 
 * This script automatically:
 * - Generates content-list.json with all markdown files
 * - Generates modules.json from module.md files
 * - Detects lectures from subdirectories
 * - Detects achievements from achievements/ folders
 * 
 * Run: node generate-content-list.js
 */

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, 'content');
const OUTPUT_FILE = path.join(CONTENT_DIR, 'content-list.json');
const MODULES_FILE = path.join(CONTENT_DIR, 'modules.json');

/**
 * Parses YAML frontmatter from markdown content.
 * Returns an object with the parsed key-value pairs.
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const frontmatter = {};
  const lines = match[1].split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Remove quotes if present
    if ((value.startsWith("'") && value.endsWith("'")) ||
        (value.startsWith('"') && value.endsWith('"'))) {
      value = value.slice(1, -1);
    }

    // Convert numeric values
    if (/^\d+$/.test(value)) {
      value = parseInt(value, 10);
    }

    frontmatter[key] = value;
  }

  return frontmatter;
}

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
      if (parts[3] === 'achievements') return 6;
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

/**
 * Gets lecture folder names from a module directory.
 * Lectures are subdirectories that contain a lecture.md file.
 */
function getLecturesForModule(moduleDir) {
  const lectures = [];

  if (!fs.existsSync(moduleDir)) {
    return lectures;
  }

  const entries = fs.readdirSync(moduleDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === 'achievements') continue;

    const lectureFile = path.join(moduleDir, entry.name, 'lecture.md');
    if (fs.existsSync(lectureFile)) {
      lectures.push(entry.name);
    }
  }

  // Sort by folder name (number prefix ensures correct order)
  return lectures.sort();
}

/**
 * Scans the achievements folder for each module and extracts achievement IDs
 * from the YAML frontmatter of each achievement file.
 */
function getAchievementsForModule(moduleDir) {
  const achievementsDir = path.join(moduleDir, 'achievements');
  const achievements = [];

  if (!fs.existsSync(achievementsDir)) {
    return achievements;
  }

  const files = fs.readdirSync(achievementsDir).sort();

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const filePath = path.join(achievementsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    const frontmatter = parseFrontmatter(content);
    if (frontmatter && frontmatter.id) {
      achievements.push(frontmatter.id);
    }
  }

  return achievements;
}

/**
 * Scans all module folders and generates modules.json from module.md files.
 */
function generateModulesJson() {
  const modules = [];
  const entries = fs.readdirSync(CONTENT_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const moduleDir = path.join(CONTENT_DIR, entry.name);
    const moduleFile = path.join(moduleDir, 'module.md');

    if (!fs.existsSync(moduleFile)) continue;

    const content = fs.readFileSync(moduleFile, 'utf-8');
    const frontmatter = parseFrontmatter(content);

    if (!frontmatter || !frontmatter.id) {
      console.warn(`  Warning: ${entry.name}/module.md missing required 'id' field`);
      continue;
    }

    const moduleData = {
      id: frontmatter.id,
      title: frontmatter.title || entry.name,
      ects: frontmatter.ects || 0,
      status: frontmatter.status || 'gesperrt',
      order: frontmatter.order || 99,
      description: frontmatter.description || ''
    };

    // Auto-detect lectures
    const lectures = getLecturesForModule(moduleDir);
    if (lectures.length > 0) {
      moduleData.lectures = lectures;
    }

    // Auto-detect achievements
    const achievements = getAchievementsForModule(moduleDir);
    if (achievements.length > 0) {
      moduleData.achievements = achievements;
    }

    modules.push(moduleData);
  }

  // Sort modules by order
  modules.sort((a, b) => a.order - b.order);

  // Write modules.json
  fs.writeFileSync(MODULES_FILE, JSON.stringify(modules, null, 2) + '\n');

  return modules;
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

// Generate modules.json from module.md files
const modules = generateModulesJson();
console.log(`✓ Generated ${MODULES_FILE}`);
console.log(`  ${modules.length} modules registered`);
for (const mod of modules) {
  const lectureCount = mod.lectures ? mod.lectures.length : 0;
  const achievementCount = mod.achievements ? mod.achievements.length : 0;
  console.log(`    - ${mod.id}: ${lectureCount} lectures, ${achievementCount} achievements`);
}

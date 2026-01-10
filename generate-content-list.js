#!/usr/bin/env node

/**
 * Generates content-list.json and modules.json by scanning the content directory.
 * Supports Multi-Study architecture: content/{studyId}/modules/...
 *
 * Content developers only need to:
 * 1. Create a study folder (e.g., bsc-ernaehrungswissenschaften/)
 * 2. Create module folders within (e.g., 01-module-name/)
 * 3. Add a module.md with YAML frontmatter (id, title, ects, status, order, description)
 * 4. Add lecture folders, achievements, etc.
 *
 * This script automatically:
 * - Generates content-list.json with all markdown files (per study)
 * - Generates modules.json from module.md files (per study)
 * - Detects lectures from subdirectories
 * - Detects achievements from achievements/ folders
 *
 * Run: node generate-content-list.js
 */

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, 'content');

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
    if (
      (value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"'))
    ) {
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

function getAllMarkdownFiles(
  dir,
  studyId,
  baseDir = CONTENT_DIR,
  fileList = []
) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip hidden directories and node_modules
      if (!file.startsWith('.') && file !== 'node_modules') {
        getAllMarkdownFiles(filePath, studyId, baseDir, fileList);
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
  // 1. By study (for multi-study)
  // 2. By module number
  // 3. By lecture number
  // 4. lecture.md first, then lecture-items/, then quiz.md, then questions/
  // 5. Within folders, by number prefix

  return files.sort((a, b) => {
    const partsA = a.split('/');
    const partsB = b.split('/');

    // Compare study
    if (partsA[1] !== partsB[1]) {
      return partsA[1].localeCompare(partsB[1]);
    }

    // Compare module
    if (partsA[2] !== partsB[2]) {
      return partsA[2].localeCompare(partsB[2]);
    }

    // Compare lecture
    if (partsA[3] !== partsB[3]) {
      return partsA[3].localeCompare(partsB[3]);
    }

    // Prioritize file types
    const getPriority = (parts) => {
      if (parts[4] === 'lecture.md') return 1;
      if (parts[4] === 'lecture-items') return 2;
      if (parts[4] === 'quiz.md') return 4;
      if (parts[4] === 'questions') return 5;
      if (parts[4] === 'achievements') return 6;
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
 * @param {string} studyDir - The study directory to scan
 * @returns {Array} Array of module objects
 */
function generateModulesJson(studyDir) {
  const modules = [];
  const entries = fs.readdirSync(studyDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const moduleDir = path.join(studyDir, entry.name);
    const moduleFile = path.join(moduleDir, 'module.md');

    if (!fs.existsSync(moduleFile)) continue;

    const content = fs.readFileSync(moduleFile, 'utf-8');
    const frontmatter = parseFrontmatter(content);

    if (!frontmatter || !frontmatter.id) {
      console.warn(
        `  Warning: ${entry.name}/module.md missing required 'id' field`
      );
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

  return modules;
}

/**
 * Checks if a directory is a study folder (contains module folders with module.md files)
 */
function isStudyFolder(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const moduleFile = path.join(dir, entry.name, 'module.md');
    if (fs.existsSync(moduleFile)) {
      return true;
    }
  }
  return false;
}

/**
 * Main function - processes all study folders
 */
function main() {
  console.log('Scanning content directory for studies...');

  // Find all study folders in content/
  const studyFolders = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() && isStudyFolder(path.join(CONTENT_DIR, entry.name))
    )
    .map((entry) => entry.name);

  if (studyFolders.length === 0) {
    console.log('No study folders found. Nothing to generate.');
    return;
  }

  console.log(
    `Found ${studyFolders.length} study folder(s): ${studyFolders.join(', ')}`
  );

  for (const studyId of studyFolders) {
    console.log(`\n📚 Processing study: ${studyId}`);
    const studyDir = path.join(CONTENT_DIR, studyId);
    const outputFile = path.join(studyDir, 'content-list.json');
    const modulesFile = path.join(studyDir, 'modules.json');

    // Generate the file list for this study
    const files = getAllMarkdownFiles(studyDir, studyId, CONTENT_DIR);
    const sortedFiles = sortContentFiles(files);

    console.log(`  Found ${sortedFiles.length} markdown files`);

    // Write to content-list.json
    fs.writeFileSync(outputFile, JSON.stringify(sortedFiles, null, 2));
    console.log(`  ✓ Generated ${path.relative(__dirname, outputFile)}`);

    // Generate modules.json from module.md files
    const modules = generateModulesJson(studyDir);
    fs.writeFileSync(modulesFile, JSON.stringify(modules, null, 2) + '\n');
    console.log(`  ✓ Generated ${path.relative(__dirname, modulesFile)}`);
    console.log(`    ${modules.length} modules registered`);

    for (const mod of modules) {
      const lectureCount = mod.lectures ? mod.lectures.length : 0;
      const achievementCount = mod.achievements ? mod.achievements.length : 0;
      console.log(
        `      - ${mod.id}: ${lectureCount} lectures, ${achievementCount} achievements`
      );
    }
  }

  console.log('\n✅ Content generation complete!');
}

// Run main
main();

#!/usr/bin/env node

/**
 * Generate Achievements JSON
 *
 * Creates achievements.json for each study containing all achievement data.
 * This enables lazy loading to have achievement data available without
 * loading all content files.
 *
 * Usage: node generate-achievements.js [studyId]
 *
 * Output per study:
 *   content/{studyId}/achievements.json
 */

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'content');

/**
 * Parse YAML frontmatter with support for nested objects (unlockCondition)
 */
function parseNestedYaml(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { frontmatter: null, body: content };

  const yamlContent = match[1];
  const body = content.slice(match[0].length).trim();

  try {
    const frontmatter = {};
    const lines = yamlContent.split('\n');
    let currentKey = null;
    let currentObject = null;
    let inNestedObject = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Skip empty lines
      if (!line.trim()) continue;

      // Detect indentation level
      const indent = line.search(/\S/);

      // Top-level key with nested object (e.g., "unlockCondition:")
      if (indent === 0 && line.match(/^(\w+):\s*$/)) {
        const key = line.match(/^(\w+):/)[1];
        currentKey = key;
        currentObject = {};
        frontmatter[key] = currentObject;
        inNestedObject = true;
        continue;
      }

      // Top-level simple key-value
      if (indent === 0 && line.match(/^(\w+):\s*.+$/)) {
        const kvMatch = line.match(/^(\w+):\s*(.*)$/);
        const key = kvMatch[1];
        let value = kvMatch[2].trim().replace(/^['"]|['"]$/g, '');

        if (value === 'true') value = true;
        else if (value === 'false') value = false;
        else if (/^\d+$/.test(value)) value = parseInt(value, 10);

        frontmatter[key] = value;
        currentKey = null;
        currentObject = null;
        inNestedObject = false;
        continue;
      }

      // Nested object property (e.g., "  type: 'lecture-quiz-gold'")
      if (inNestedObject && currentObject && line.match(/^\s+\w+:/)) {
        const propMatch = line.match(/^\s+(\w+):\s*(.*)$/);
        if (propMatch) {
          const propKey = propMatch[1];
          let propValue = propMatch[2].trim().replace(/^['"]|['"]$/g, '');

          if (propValue === 'true') propValue = true;
          else if (propValue === 'false') propValue = false;
          else if (/^\d+$/.test(propValue)) propValue = parseInt(propValue, 10);
          else if (propValue === 'null') propValue = null;

          currentObject[propKey] = propValue;
        }
        continue;
      }
    }

    return { frontmatter, body };
  } catch (e) {
    console.error('YAML parse error:', e.message);
    return { frontmatter: null, body: content };
  }
}

/**
 * Get all study IDs from content directory
 */
function getStudyIds() {
  const studies = [];
  const entries = fs.readdirSync(CONTENT_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.startsWith('bsc-')) {
      studies.push(entry.name);
    }
  }

  return studies;
}

/**
 * Get all modules for a study
 */
function getModules(studyDir) {
  const modules = [];
  const entries = fs.readdirSync(studyDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory() && /^\d{2}-/.test(entry.name)) {
      modules.push(entry.name);
    }
  }

  return modules.sort();
}

/**
 * Parse an achievement file and return achievement object
 */
function parseAchievementFile(filePath, moduleId) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { frontmatter, body } = parseNestedYaml(content);

  if (!frontmatter || !frontmatter.id) {
    console.warn(`  Warning: Achievement file has no id: ${filePath}`);
    return null;
  }

  return {
    id: frontmatter.id,
    title: frontmatter.title || '',
    description: frontmatter.description || '',
    icon: frontmatter.icon || 'trophy',
    contentType: frontmatter.contentType || 'markdown',
    unlockCondition: frontmatter.unlockCondition || {},
    defaultDuration: frontmatter.defaultDuration || 30,
    extensionDuration: frontmatter.extensionDuration || 14,
    warningThreshold: frontmatter.warningThreshold || 7,
    moduleId: moduleId,
    // Store markdown content for rendering
    contentMarkdown: body || ''
  };
}

/**
 * Generate achievements.json for a study
 */
function generateAchievements(studyId) {
  const studyDir = path.join(CONTENT_DIR, studyId);
  const achievements = {};
  let count = 0;

  const modules = getModules(studyDir);

  for (const moduleId of modules) {
    const achievementsDir = path.join(studyDir, moduleId, 'achievements');

    if (!fs.existsSync(achievementsDir)) {
      continue;
    }

    const files = fs
      .readdirSync(achievementsDir)
      .filter((f) => f.endsWith('.md'))
      .sort();

    for (const file of files) {
      const filePath = path.join(achievementsDir, file);
      const achievement = parseAchievementFile(filePath, moduleId);

      if (achievement) {
        achievements[achievement.id] = achievement;
        count++;
      }
    }
  }

  // Write achievements.json
  const outputPath = path.join(studyDir, 'achievements.json');
  fs.writeFileSync(outputPath, JSON.stringify(achievements, null, 2), 'utf-8');

  return count;
}

// Main
function main() {
  const args = process.argv.slice(2);
  const targetStudyId = args[0] || null;

  console.log('🏆 Generating Achievements JSON\n');

  const studyIds = targetStudyId ? [targetStudyId] : getStudyIds();

  for (const studyId of studyIds) {
    const studyDir = path.join(CONTENT_DIR, studyId);

    if (!fs.existsSync(studyDir)) {
      console.error(`  Error: Study directory not found: ${studyDir}`);
      continue;
    }

    const count = generateAchievements(studyId);
    console.log(`  ✅ ${studyId}: ${count} achievements`);
  }

  console.log('\n✅ Done!');
}

main();

#!/usr/bin/env node

/**
 * Content Validator for CLI
 * Validates all content files in a study directory.
 *
 * Usage: node validate-content.js [studyId]
 * Example: node validate-content.js bsc-ernaehrungswissenschaften
 *
 * If no studyId is provided, validates all studies.
 *
 * No external dependencies required!
 */

const fs = require('fs');
const path = require('path');

/**
 * Simple YAML parser for frontmatter
 * Handles the subset of YAML used in content files:
 * - Key-value pairs
 * - Simple lists with - prefix
 * - Nested objects (one level)
 * - Quoted strings
 */
const yaml = {
  load(content) {
    if (!content || !content.trim()) return {};

    const result = {};
    const lines = content.split('\n');
    let currentKey = null;
    let currentList = null;
    let inNestedObject = false;
    let nestedKey = null;
    let nestedObject = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) continue;

      // Check for list item (starts with -)
      if (trimmed.startsWith('- ')) {
        const value = parseValue(trimmed.slice(2).trim());
        if (currentList && currentKey) {
          currentList.push(value);
        }
        continue;
      }

      // Check for nested object property (2-space indent)
      if (line.startsWith('  ') && !line.startsWith('    ') && inNestedObject) {
        const colonIdx = trimmed.indexOf(':');
        if (colonIdx > 0) {
          const key = trimmed.slice(0, colonIdx).trim();
          const value = parseValue(trimmed.slice(colonIdx + 1).trim());
          nestedObject[key] = value;
          continue;
        }
      }

      // Check for key-value pair
      const colonIdx = trimmed.indexOf(':');
      if (colonIdx > 0) {
        // Save previous nested object if any
        if (inNestedObject && nestedKey) {
          result[nestedKey] = nestedObject;
          inNestedObject = false;
          nestedKey = null;
          nestedObject = {};
        }

        // Save previous list if any
        if (currentList && currentKey) {
          result[currentKey] = currentList;
          currentList = null;
          currentKey = null;
        }

        const key = trimmed.slice(0, colonIdx).trim();
        const valueStr = trimmed.slice(colonIdx + 1).trim();

        if (valueStr === '' || valueStr === '|' || valueStr === '>') {
          // Could be a list or nested object following
          currentKey = key;
          currentList = [];

          // Check if next non-empty line is indented with nested key
          for (let j = i + 1; j < lines.length; j++) {
            const nextLine = lines[j];
            if (!nextLine.trim()) continue;
            if (nextLine.startsWith('  ') && !nextLine.trim().startsWith('-')) {
              // It's a nested object
              inNestedObject = true;
              nestedKey = key;
              nestedObject = {};
              currentKey = null;
              currentList = null;
            }
            break;
          }
        } else {
          result[key] = parseValue(valueStr);
        }
      }
    }

    // Don't forget the last list or nested object
    if (currentList && currentKey) {
      result[currentKey] = currentList;
    }
    if (inNestedObject && nestedKey) {
      result[nestedKey] = nestedObject;
    }

    return result;
  }
};

/**
 * Parse a YAML value (handles quotes, numbers, booleans)
 */
function parseValue(str) {
  if (!str) return '';

  // Remove quotes
  if (
    (str.startsWith("'") && str.endsWith("'")) ||
    (str.startsWith('"') && str.endsWith('"'))
  ) {
    return str.slice(1, -1);
  }

  // Boolean
  if (str === 'true') return true;
  if (str === 'false') return false;

  // Number
  if (/^-?\d+$/.test(str)) return parseInt(str, 10);
  if (/^-?\d+\.\d+$/.test(str)) return parseFloat(str);

  return str;
}

const CONTENT_DIR = path.join(__dirname, 'content');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
  bold: '\x1b[1m'
};

// Validation rules
const REQUIRED_FIELDS = {
  'multiple-choice': ['type', 'question', 'options', 'correctAnswer'],
  'multiple-choice-multiple': ['type', 'question', 'options', 'correctAnswers'],
  'self-assessment-mc': ['type', 'question', 'options', 'correctAnswer'],
  'learning-content': ['type'],
  'youtube-video': ['type', 'url'],
  'external-video': ['type', 'url'],
  image: ['type', 'url', 'alt'],
  'mermaid-diagram': ['type'],
  'balance-equation': ['type', 'reactants', 'products']
};

/**
 * Parse multi-document markdown format
 */
function parseMultiDocument(content) {
  const documents = [];
  const parts = content.split(/^---$/m);

  if (parts[0] && parts[0].trim()) {
    documents.push({ attributes: {}, body: parts[0], raw: parts[0] });
  }

  for (let i = 1; i < parts.length; i += 2) {
    const frontmatterPart = parts[i];
    const bodyPart = i + 1 < parts.length ? parts[i + 1] : '';

    try {
      const attributes = yaml.load(frontmatterPart) || {};
      documents.push({
        attributes,
        body: bodyPart,
        raw: frontmatterPart
      });
    } catch (e) {
      documents.push({
        attributes: {},
        body: frontmatterPart,
        raw: frontmatterPart,
        parseError: e.message
      });
    }
  }

  return documents.filter(
    (d) =>
      (d.body && d.body.trim()) ||
      (d.attributes && Object.keys(d.attributes).length > 0)
  );
}

/**
 * Validate lecture metadata
 */
function validateLectureMetadata(doc, result) {
  if (doc.parseError) {
    result.errors.push(`YAML Parse-Fehler: ${doc.parseError}`);
    return;
  }

  const attrs = doc.attributes;

  if (!attrs.topic) {
    result.errors.push(`Pflichtfeld 'topic' fehlt`);
  }
  if (!attrs.description) {
    result.errors.push(`Pflichtfeld 'description' fehlt`);
  }
}

/**
 * Validate quiz metadata
 */
function validateQuizMetadata(doc, result) {
  if (doc.parseError) {
    result.errors.push(`YAML Parse-Fehler: ${doc.parseError}`);
    return;
  }

  const attrs = doc.attributes;

  if (!attrs.description) {
    result.errors.push(`Pflichtfeld 'description' fehlt`);
  }
}

/**
 * Validate module metadata
 */
function validateModuleMetadata(doc, result) {
  if (doc.parseError) {
    result.errors.push(`YAML Parse-Fehler: ${doc.parseError}`);
    return;
  }

  const attrs = doc.attributes;

  if (!attrs.id) {
    result.errors.push(`Pflichtfeld 'id' fehlt`);
  }
  if (!attrs.title) {
    result.errors.push(`Pflichtfeld 'title' fehlt`);
  }
}

/**
 * Validate achievement metadata
 */
function validateAchievementMetadata(doc, result) {
  if (doc.parseError) {
    result.errors.push(`YAML Parse-Fehler: ${doc.parseError}`);
    return;
  }

  const attrs = doc.attributes;

  if (!attrs.id) {
    result.errors.push(`Pflichtfeld 'id' fehlt`);
  }
  if (!attrs.title) {
    result.errors.push(`Pflichtfeld 'title' fehlt`);
  }
  if (!attrs.description) {
    result.errors.push(`Pflichtfeld 'description' fehlt`);
  }
}

/**
 * Validate a single document/item
 */
function validateDocument(doc, index, result) {
  const itemNum = index + 1;

  // Check for YAML parse errors
  if (doc.parseError) {
    result.errors.push(`Item ${itemNum}: YAML Parse-Fehler: ${doc.parseError}`);

    // Check for common mistakes
    if (doc.raw.includes("* '") || doc.raw.includes("*'")) {
      result.errors.push(
        `Item ${itemNum}: YAML-Liste verwendet '*' statt '-' (siehe Zeile mit Apostroph)`
      );
    }
    return;
  }

  const attrs = doc.attributes;

  // Skip items without type
  if (!attrs.type) {
    if (Object.keys(attrs).length > 0) {
      result.warnings.push(`Item ${itemNum}: Kein 'type' Feld gefunden`);
    }
    return;
  }

  // Check required fields for this type
  const requiredFields = REQUIRED_FIELDS[attrs.type];
  if (!requiredFields) {
    result.warnings.push(`Item ${itemNum}: Unbekannter Typ '${attrs.type}'`);
    return;
  }

  // Validate required fields
  requiredFields.forEach((field) => {
    if (!attrs[field]) {
      result.errors.push(
        `Item ${itemNum} (${attrs.type}): Pflichtfeld '${field}' fehlt`
      );
    }
  });

  // Validate options format for multiple-choice
  if (
    attrs.type.includes('multiple-choice') ||
    attrs.type.includes('self-assessment-mc')
  ) {
    if (attrs.options) {
      if (!Array.isArray(attrs.options)) {
        result.errors.push(`Item ${itemNum}: 'options' muss eine Liste sein`);
      } else if (attrs.options.length < 2) {
        result.errors.push(
          `Item ${itemNum}: Mindestens 2 Optionen erforderlich`
        );
      }

      // Check if correctAnswer is in options (single choice)
      if (attrs.correctAnswer && Array.isArray(attrs.options)) {
        if (!attrs.options.includes(attrs.correctAnswer)) {
          result.errors.push(
            `Item ${itemNum}: 'correctAnswer' "${attrs.correctAnswer}" ist nicht in 'options' enthalten`
          );
        }
      }

      // Check if correctAnswers are in options (multiple choice)
      if (attrs.correctAnswers && Array.isArray(attrs.options)) {
        if (!Array.isArray(attrs.correctAnswers)) {
          result.errors.push(
            `Item ${itemNum}: 'correctAnswers' muss eine Liste sein`
          );
        } else {
          attrs.correctAnswers.forEach((answer) => {
            if (!attrs.options.includes(answer)) {
              result.errors.push(
                `Item ${itemNum}: correctAnswer '${answer}' ist nicht in 'options' enthalten`
              );
            }
          });
        }
      }
    }
  }

  // Check for asterisks in raw YAML (common mistake)
  if (doc.raw.includes("\n* '") || doc.raw.includes("\n*'")) {
    result.warnings.push(
      `Item ${itemNum}: Möglicherweise '*' statt '-' in YAML-Liste verwendet`
    );
  }
}

/**
 * Validate a single file
 */
function validateFile(filePath) {
  const result = {
    file: filePath,
    errors: [],
    warnings: [],
    itemCount: 0
  };

  try {
    if (!fs.existsSync(filePath)) {
      result.errors.push(`Datei nicht gefunden`);
      return result;
    }

    const content = fs.readFileSync(filePath, 'utf8');

    // Detect file type
    const isLectureMetadata =
      filePath.endsWith('/lecture.md') && !filePath.includes('/lecture-items/');
    const isQuizMetadata =
      filePath.endsWith('/quiz.md') && !filePath.includes('/questions/');
    const isModuleMetadata = filePath.endsWith('/module.md');
    const isAchievement = filePath.includes('/achievements/');
    const isLectureItem = filePath.includes('/lecture-items/');
    const isQuizQuestion = filePath.includes('/questions/');

    // Parse multi-document format
    const documents = parseMultiDocument(content);
    result.itemCount = documents.length;

    // Validate based on file type
    if (isLectureMetadata) {
      validateLectureMetadata(documents[0], result);
    } else if (isQuizMetadata) {
      validateQuizMetadata(documents[0], result);
    } else if (isModuleMetadata) {
      validateModuleMetadata(documents[0], result);
    } else if (isAchievement) {
      validateAchievementMetadata(documents[0], result);
    } else {
      // Validate each document as content item
      documents.forEach((doc, index) => {
        validateDocument(doc, index, result);
      });
    }
  } catch (error) {
    result.errors.push(`Fehler beim Lesen: ${error.message}`);
  }

  return result;
}

/**
 * Get all markdown files for a study
 */
function getAllMarkdownFiles(studyId) {
  const studyDir = path.join(CONTENT_DIR, studyId);
  const files = [];

  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        scanDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }

  scanDir(studyDir);
  return files;
}

/**
 * Get all available studies
 */
function getStudies() {
  const studiesPath = path.join(CONTENT_DIR, 'studies.json');
  if (fs.existsSync(studiesPath)) {
    return JSON.parse(fs.readFileSync(studiesPath, 'utf8'));
  }

  // Fallback: scan directories
  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
    .map((d) => ({ id: d.name, title: d.name }));
}

/**
 * Main validation function
 */
function validateStudy(studyId) {
  console.log(
    `\n${colors.blue}${colors.bold}📚 Validiere: ${studyId}${colors.reset}\n`
  );

  const files = getAllMarkdownFiles(studyId);
  console.log(`   ${files.length} Markdown-Dateien gefunden\n`);

  const results = files.map((file) => validateFile(file));

  let totalErrors = 0;
  let totalWarnings = 0;
  let totalItems = 0;

  // Display results
  for (const result of results) {
    totalErrors += result.errors.length;
    totalWarnings += result.warnings.length;
    totalItems += result.itemCount;

    const relativePath = path.relative(process.cwd(), result.file);

    if (result.errors.length === 0 && result.warnings.length === 0) {
      // Only show valid files if verbose
      if (process.argv.includes('-v') || process.argv.includes('--verbose')) {
        console.log(
          `   ${colors.green}✓${colors.reset} ${relativePath} ${colors.gray}(${result.itemCount} items)${colors.reset}`
        );
      }
    } else {
      // Show files with problems
      const icon =
        result.errors.length > 0 ? `${colors.red}✗` : `${colors.yellow}⚠`;
      console.log(
        `   ${icon}${colors.reset} ${relativePath} ${colors.gray}(${result.itemCount} items)${colors.reset}`
      );

      for (const error of result.errors) {
        console.log(`      ${colors.red}❌ ${error}${colors.reset}`);
      }
      for (const warning of result.warnings) {
        console.log(`      ${colors.yellow}⚠️  ${warning}${colors.reset}`);
      }
    }
  }

  // Summary
  console.log('');
  if (totalErrors === 0 && totalWarnings === 0) {
    console.log(
      `   ${colors.green}${colors.bold}✓ Alle Dateien sind valide!${colors.reset}`
    );
    console.log(
      `   ${colors.gray}${files.length} Dateien, ${totalItems} Items geprüft${colors.reset}`
    );
  } else {
    console.log(
      `   ${colors.yellow}${colors.bold}Validierung abgeschlossen${colors.reset}`
    );
    console.log(
      `   ${colors.gray}${files.length} Dateien, ${totalItems} Items geprüft${colors.reset}`
    );
    if (totalErrors > 0) {
      console.log(
        `   ${colors.red}${colors.bold}${totalErrors} Fehler${colors.reset}`
      );
    }
    if (totalWarnings > 0) {
      console.log(
        `   ${colors.yellow}${totalWarnings} Warnungen${colors.reset}`
      );
    }
  }

  return { totalErrors, totalWarnings, totalItems, fileCount: files.length };
}

// Main
function main() {
  console.log(`\n${colors.bold}Content Validator${colors.reset}`);
  console.log(`${'─'.repeat(50)}`);

  const studyArg = process.argv[2];
  let allErrors = 0;
  let allWarnings = 0;

  if (studyArg && studyArg !== '-v' && studyArg !== '--verbose') {
    // Validate specific study
    const result = validateStudy(studyArg);
    allErrors = result.totalErrors;
    allWarnings = result.totalWarnings;
  } else {
    // Validate all studies
    const studies = getStudies();
    for (const study of studies) {
      const result = validateStudy(study.id);
      allErrors += result.totalErrors;
      allWarnings += result.totalWarnings;
    }
  }

  console.log(`\n${'─'.repeat(50)}`);

  if (allErrors > 0) {
    console.log(
      `${colors.red}${colors.bold}❌ Validierung fehlgeschlagen mit ${allErrors} Fehlern${colors.reset}\n`
    );
    process.exit(1);
  } else if (allWarnings > 0) {
    console.log(
      `${colors.yellow}${colors.bold}⚠️  Validierung mit ${allWarnings} Warnungen abgeschlossen${colors.reset}\n`
    );
    process.exit(0);
  } else {
    console.log(
      `${colors.green}${colors.bold}✅ Alle Inhalte sind valide!${colors.reset}\n`
    );
    process.exit(0);
  }
}

main();

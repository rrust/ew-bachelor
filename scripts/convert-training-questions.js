#!/usr/bin/env node

/**
 * convert-training-questions.js
 *
 * Converts training questions from blabla format to ew-bachelor format
 *
 * Usage: node scripts/convert-training-questions.js
 *
 * Source: blabla/CODING_PLAN/fragen/
 * Target: content/bsc-ernaehrungswissenschaften/02-chemie-grundlagen/module-training/
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SOURCE_DIR = path.join(__dirname, '../../blabla/CODING_PLAN/fragen');
const TARGET_DIR = path.join(
  __dirname,
  '../content/bsc-ernaehrungswissenschaften/02-chemie-grundlagen/module-training'
);

// Topic mapping: folder name -> readable title and id
const TOPIC_MAPPING = {
  '01_Aufbau_Atome_Periodensystem': {
    id: '01-aufbau-atome-periodensystem',
    title: 'Aufbau der Atome & Periodensystem'
  },
  '02_Elemente_Ionen_Mol': {
    id: '02-elemente-ionen-mol',
    title: 'Elemente, Ionen & Mol'
  },
  '03_Gleichungen_Stoechiometrie': {
    id: '03-gleichungen-stoechiometrie',
    title: 'Gleichungen & Stöchiometrie'
  },
  '04_Reaktionen_Empirische_Formeln': {
    id: '04-reaktionen-empirische-formeln',
    title: 'Reaktionen & Empirische Formeln'
  },
  '05_Loesungen_Konzentrationen': {
    id: '05-loesungen-konzentrationen',
    title: 'Lösungen & Konzentrationen'
  },
  '06_Saeuren_Basen_Grundlagen': {
    id: '06-saeuren-basen-grundlagen',
    title: 'Säuren & Basen Grundlagen'
  },
  '07_Bohr_Elektronenkonfiguration': {
    id: '07-bohr-elektronenkonfiguration',
    title: 'Bohr & Elektronenkonfiguration'
  },
  '08_Ionenbindung_Lewis': {
    id: '08-ionenbindung-lewis',
    title: 'Ionenbindung & Lewis'
  },
  '09_Polaritaet_VSEPR': {
    id: '09-polaritaet-vsepr',
    title: 'Polarität & VSEPR'
  },
  '10_Valenzbindung_Hybridisierung_MO': {
    id: '10-valenzbindung-hybridisierung-mo',
    title: 'Valenzbindung, Hybridisierung & MO'
  },
  '11_Thermodynamik_Enthalpie': {
    id: '11-thermodynamik-enthalpie',
    title: 'Thermodynamik & Enthalpie'
  },
  '12_Aggregatzustaende_Phasendiagramme': {
    id: '12-aggregatzustaende-phasendiagramme',
    title: 'Aggregatzustände & Phasendiagramme'
  },
  '13_Kolligative_Eigenschaften': {
    id: '13-kolligative-eigenschaften',
    title: 'Kolligative Eigenschaften'
  },
  '14_Saeuren_Basen_pH_Puffer': {
    id: '14-saeuren-basen-ph-puffer',
    title: 'Säuren, Basen, pH & Puffer'
  },
  '15_Elektrochemie_Redox': {
    id: '15-elektrochemie-redox',
    title: 'Elektrochemie & Redox'
  }
};

/**
 * Parse a single question from markdown
 * @param {string} questionBlock - Raw markdown block for one question
 * @param {number} level - Difficulty level (1-5)
 * @param {string} topicTitle - Human-readable topic title
 * @returns {Object} Parsed question object
 */
function parseQuestion(questionBlock, level, topicTitle) {
  const lines = questionBlock.trim().split('\n');

  let questionText = '';
  const options = [];
  let correctAnswers = [];

  let inQuestion = false;
  let inOptions = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) continue;

    // Question header: ## Frage X
    if (trimmed.startsWith('## Frage')) {
      continue;
    }

    // Question text: **Question text?**
    if (
      trimmed.startsWith('**') &&
      trimmed.endsWith('**') &&
      !trimmed.startsWith('**Richtige')
    ) {
      questionText = trimmed.slice(2, -2).trim();
      inQuestion = false;
      inOptions = true;
      continue;
    }

    // Option line: - [ ] A. Option text
    const optionMatch = trimmed.match(/^-\s*\[\s*\]\s*([A-E])\.\s*(.+)$/);
    if (optionMatch && inOptions) {
      options.push(optionMatch[2].trim());
      continue;
    }

    // Correct answers line: **Richtige Antworten:** A, B, C
    if (trimmed.startsWith('**Richtige Antworten:**')) {
      const answersStr = trimmed.replace('**Richtige Antworten:**', '').trim();
      // Parse "A, B, C" or just "A"
      const answerLetters = answersStr.split(',').map((s) => s.trim());

      // Convert letters to option text
      for (const letter of answerLetters) {
        const index = letter.charCodeAt(0) - 'A'.charCodeAt(0);
        if (index >= 0 && index < options.length) {
          correctAnswers.push(options[index]);
        }
      }
      inOptions = false;
    }
  }

  return {
    type:
      correctAnswers.length > 1
        ? 'multiple-choice-multiple'
        : 'multiple-choice',
    topic: topicTitle,
    level: level,
    question: questionText,
    options: options,
    correctAnswers: correctAnswers
  };
}

/**
 * Parse a level file and extract all questions
 * @param {string} filePath - Path to the level markdown file
 * @param {number} level - Difficulty level (1-5)
 * @param {string} topicTitle - Human-readable topic title
 * @returns {Array} Array of parsed questions
 */
function parseLevelFile(filePath, level, topicTitle) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const questions = [];

  // Split by "## Frage" to get individual question blocks
  const blocks = content.split(/(?=## Frage \d+)/);

  for (const block of blocks) {
    if (!block.trim().startsWith('## Frage')) continue;

    const question = parseQuestion(block, level, topicTitle);
    if (question.question && question.options.length > 0) {
      questions.push(question);
    }
  }

  return questions;
}

/**
 * Convert a question to YAML frontmatter format
 * @param {Object} question - Parsed question object
 * @param {number} index - Question index within the file
 * @returns {string} YAML-formatted question
 */
function questionToYAML(question, index) {
  // Escape single quotes in strings by doubling them
  const escapeYAML = (str) => str.replace(/'/g, "''");

  let yaml = '---\n';
  yaml += `type: '${question.type}'\n`;
  yaml += `topic: '${escapeYAML(question.topic)}'\n`;
  yaml += `level: ${question.level}\n`;
  yaml += `question: '${escapeYAML(question.question)}'\n`;
  yaml += 'options:\n';
  for (const option of question.options) {
    yaml += `  - '${escapeYAML(option)}'\n`;
  }

  // Use correctAnswers for multiple, correctAnswer for single
  if (question.correctAnswers.length === 1) {
    yaml += `correctAnswer: '${escapeYAML(question.correctAnswers[0])}'\n`;
  } else {
    yaml += 'correctAnswers:\n';
    for (const answer of question.correctAnswers) {
      yaml += `  - '${escapeYAML(answer)}'\n`;
    }
  }

  yaml += '---\n';
  return yaml;
}

/**
 * Create a combined level file with all questions
 * @param {Array} questions - Array of parsed questions
 * @param {number} level - Difficulty level
 * @param {string} topicTitle - Topic title
 * @returns {string} Combined YAML file content
 */
function createLevelFile(questions, level, topicTitle) {
  // Use multi-document YAML format (each question separated by ---)
  let content = '';

  for (let i = 0; i < questions.length; i++) {
    if (i > 0) content += '\n';
    content += questionToYAML(questions[i], i + 1);
  }

  return content;
}

/**
 * Create the training.md metadata file
 * @param {Object} stats - Statistics about the training content
 * @returns {string} YAML content for training.md
 */
function createTrainingMeta(stats) {
  return `---
title: 'Modul-Training: Grundlagen der Chemie'
description: 'Level-basiertes Training zur Prüfungsvorbereitung'
totalTopics: ${stats.totalTopics}
totalQuestions: ${stats.totalQuestions}
questionsPerLevel: 10
levels: 5
version: '1.0.0'
---
`;
}

/**
 * Main conversion function
 */
function main() {
  console.log('🔄 Converting training questions from blabla format...\n');

  // Check source directory exists
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`❌ Source directory not found: ${SOURCE_DIR}`);
    console.error('   Make sure the blabla repository is at: ../blabla/');
    process.exit(1);
  }

  // Create target directory
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  // Get all topic folders
  const topicFolders = fs.readdirSync(SOURCE_DIR).filter((f) => {
    const fullPath = path.join(SOURCE_DIR, f);
    return fs.statSync(fullPath).isDirectory() && TOPIC_MAPPING[f];
  });

  let totalQuestions = 0;
  let totalTopics = 0;

  for (const folder of topicFolders) {
    const mapping = TOPIC_MAPPING[folder];
    if (!mapping) {
      console.warn(`⚠️  Unknown topic folder: ${folder}, skipping...`);
      continue;
    }

    console.log(`📁 Processing: ${mapping.title}`);

    const topicSourceDir = path.join(SOURCE_DIR, folder);
    const topicTargetDir = path.join(TARGET_DIR, mapping.id);

    // Create topic target directory
    if (!fs.existsSync(topicTargetDir)) {
      fs.mkdirSync(topicTargetDir, { recursive: true });
    }

    // Process each level file (1-5)
    let topicQuestionCount = 0;
    for (let level = 1; level <= 5; level++) {
      const sourceFile = path.join(topicSourceDir, `chemie-level-${level}.md`);

      if (!fs.existsSync(sourceFile)) {
        console.warn(`   ⚠️  Level ${level} file not found, skipping...`);
        continue;
      }

      const questions = parseLevelFile(sourceFile, level, mapping.title);
      topicQuestionCount += questions.length;

      // Create target level file
      const targetFile = path.join(topicTargetDir, `level-${level}.md`);
      const content = createLevelFile(questions, level, mapping.title);
      fs.writeFileSync(targetFile, content);

      console.log(`   ✅ Level ${level}: ${questions.length} questions`);
    }

    totalQuestions += topicQuestionCount;
    totalTopics++;
    console.log(`   📊 Total for topic: ${topicQuestionCount} questions\n`);
  }

  // Create training.md metadata file
  const trainingMeta = createTrainingMeta({ totalTopics, totalQuestions });
  fs.writeFileSync(path.join(TARGET_DIR, 'training.md'), trainingMeta);

  console.log('─'.repeat(50));
  console.log(`✅ Conversion complete!`);
  console.log(`   📁 Topics: ${totalTopics}`);
  console.log(`   ❓ Total questions: ${totalQuestions}`);
  console.log(`   📍 Output: ${TARGET_DIR}`);
  console.log(
    `\n💡 Next: Run 'npm run build' to generate training-bundle.json`
  );
}

main();

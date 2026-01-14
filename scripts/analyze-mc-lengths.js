#!/usr/bin/env node
/**
 * Analyzes self-assessment-mc questions to find ones where
 * the longest answer option is the correct one (problematic pattern).
 */

const fs = require('fs');
const path = require('path');

function findMdFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      findMdFiles(fullPath, files);
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

function parseYaml(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const yaml = match[1];
  const result = {};

  // Parse type
  const typeMatch = yaml.match(/type:\s*['"]?([^'\n"]+)['"]?/);
  if (typeMatch) result.type = typeMatch[1].trim();

  // Parse question
  const questionMatch = yaml.match(/question:\s*['"]?(.+?)['"]?\s*$/m);
  if (questionMatch) result.question = questionMatch[1];

  // Parse correctAnswer
  const correctMatch = yaml.match(/correctAnswer:\s*['"]?(.+?)['"]?\s*$/m);
  if (correctMatch) result.correctAnswer = correctMatch[1];

  // Parse options
  const optionsMatch = yaml.match(/options:\n((?:\s+-\s+.+\n?)+)/);
  if (optionsMatch) {
    result.options = optionsMatch[1]
      .split('\n')
      .filter((l) => l.trim().startsWith('-'))
      .map((l) => l.replace(/^\s*-\s*['"]?(.+?)['"]?\s*$/, '$1'));
  }

  return result;
}

const contentDir = path.join(__dirname, '..', 'content');
const files = findMdFiles(contentDir);

let problemFiles = [];
let okFiles = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const data = parseYaml(content);

  if (!data || data.type !== 'self-assessment-mc') continue;
  if (!data.options || !data.correctAnswer) continue;

  // Find lengths
  const lengths = data.options.map((o, i) => ({
    text: o,
    len: o.length,
    idx: i
  }));
  const sorted = [...lengths].sort((a, b) => b.len - a.len);
  const longestIdx = sorted[0].idx;
  const correctIdx = data.options.findIndex((o) => o === data.correctAnswer);

  const relativePath = file.replace(contentDir + '/', '');

  if (longestIdx === correctIdx) {
    problemFiles.push({
      file: relativePath,
      fullPath: file,
      question: data.question,
      options: data.options,
      correctAnswer: data.correctAnswer,
      lengths: lengths.map((l) => l.len)
    });
  } else {
    okFiles.push(relativePath);
  }
}

console.log(
  `\n=== PROBLEMATISCH (längste = korrekt): ${problemFiles.length} ===\n`
);
for (const p of problemFiles) {
  console.log(`📁 ${p.file}`);
  console.log(`   Q: ${p.question}`);
  console.log(`   Optionen:`);
  p.options.forEach((opt, i) => {
    const marker = opt === p.correctAnswer ? '✓' : ' ';
    console.log(`     ${marker} [${p.lengths[i]}] ${opt}`);
  });
  console.log('');
}

console.log(`\n=== OK: ${okFiles.length} Dateien ===`);

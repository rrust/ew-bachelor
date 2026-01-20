/**
 * fix-answer-positions.js
 *
 * Korrigiert die Verteilung der korrekten Antwortpositionen.
 * Ziel: ~25% für jede Position (A, B, C, D)
 */

const fs = require('fs');
const path = require('path');

const trainingDir = path.join(
  __dirname,
  '..',
  'content',
  'bsc-ernaehrungswissenschaften',
  '02-chemie-grundlagen',
  'module-training'
);

let totalFixed = 0;
let stats = { 0: 0, 1: 0, 2: 0, 3: 0 };

function shuffleToPosition(options, correctAnswer, targetPosition) {
  const currentIndex = options.indexOf(correctAnswer);
  if (currentIndex === -1 || currentIndex === targetPosition) return options;

  // Swap
  const newOptions = [...options];
  const temp = newOptions[targetPosition];
  newOptions[targetPosition] = newOptions[currentIndex];
  newOptions[currentIndex] = temp;

  return newOptions;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const blocks = content.split(/^---$/m).filter((b) => b.trim());

  const newBlocks = [];

  for (const block of blocks) {
    // Only process single-answer questions
    if (
      !block.includes('correctAnswer:') ||
      block.includes('correctAnswers:')
    ) {
      newBlocks.push(block);
      continue;
    }

    // Parse options
    const optionsMatch = block.match(/options:\s*\n((?:\s+-\s+.+\n?)+)/);
    const correctMatch = block.match(/correctAnswer:\s*['"]?([^'"\n]+)['"]?/);

    if (!optionsMatch || !correctMatch) {
      newBlocks.push(block);
      continue;
    }

    const optionLines = optionsMatch[1].match(/^\s+-\s+['"]?(.+?)['"]?\s*$/gm);
    if (!optionLines || optionLines.length !== 4) {
      newBlocks.push(block);
      continue;
    }

    const options = optionLines.map((line) => {
      const match = line.match(/^\s+-\s+['"]?(.+?)['"]?\s*$/);
      return match ? match[1].replace(/^['"]|['"]$/g, '') : '';
    });

    const correctAnswer = correctMatch[1].trim().replace(/^['"]|['"]$/g, '');
    const currentIndex = options.indexOf(correctAnswer);

    if (currentIndex === -1) {
      newBlocks.push(block);
      continue;
    }

    // Find the least used position
    const minCount = Math.min(...Object.values(stats));
    const targetPositions = Object.entries(stats)
      .filter(([_, count]) => count === minCount)
      .map(([pos, _]) => parseInt(pos));

    // Pick a random target from the least used
    const targetPosition =
      targetPositions[Math.floor(Math.random() * targetPositions.length)];

    if (currentIndex !== targetPosition) {
      const newOptions = shuffleToPosition(
        options,
        correctAnswer,
        targetPosition
      );

      // Rebuild options string
      const newOptionsStr = newOptions
        .map((o) => `  - '${o.replace(/'/g, "''")}'`)
        .join('\n');

      let newBlock = block.replace(
        /options:\s*\n(?:\s+-\s+.+\n?)+/,
        `options:\n${newOptionsStr}\n`
      );

      newBlocks.push(newBlock);
      stats[targetPosition]++;
      totalFixed++;
    } else {
      newBlocks.push(block);
      stats[currentIndex]++;
    }
  }

  const newContent = newBlocks.join('\n---\n');
  fs.writeFileSync(filePath, '---\n' + newContent.replace(/^---\n/, ''));
}

// Main
console.log('Korrigiere Antwort-Positionen...\n');

const chapters = fs.readdirSync(trainingDir).filter((f) => {
  const fullPath = path.join(trainingDir, f);
  return fs.statSync(fullPath).isDirectory();
});

chapters.forEach((chapter) => {
  const chapterPath = path.join(trainingDir, chapter);
  const files = fs
    .readdirSync(chapterPath)
    .filter((f) => f.endsWith('.md') && f.startsWith('level'));

  files.forEach((file) => {
    const filePath = path.join(chapterPath, file);
    processFile(filePath);
  });
});

console.log(`Fertig! ${totalFixed} Positionen angepasst.`);
console.log('\nNeue Verteilung:');
console.log(`  A: ${stats[0]}`);
console.log(`  B: ${stats[1]}`);
console.log(`  C: ${stats[2]}`);
console.log(`  D: ${stats[3]}`);

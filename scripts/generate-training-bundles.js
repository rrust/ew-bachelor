/**
 * Generate Training Bundles
 *
 * Creates pre-compiled JSON bundles for module training content.
 *
 * Usage: node generate-training-bundles.js [studyId]
 *
 * Output per module:
 *   content/{studyId}/{moduleId}/module-training/training-bundle.json
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Parse multi-document YAML file (separated by ---)
function parseMultiDocYaml(content) {
  const documents = [];

  // Split by --- but keep track of document boundaries
  // Each document starts with --- and ends with ---
  const lines = content.split('\n');
  let currentDoc = [];
  let inDocument = false;

  for (const line of lines) {
    if (line.trim() === '---') {
      if (inDocument && currentDoc.length > 0) {
        // End of document
        try {
          const parsed = yaml.load(currentDoc.join('\n'));
          if (parsed && parsed.question) {
            documents.push(parsed);
          }
        } catch (e) {
          console.warn('  ⚠️  YAML parse error:', e.message);
        }
        currentDoc = [];
        inDocument = false;
      } else {
        // Start of document
        inDocument = true;
        currentDoc = [];
      }
    } else if (inDocument) {
      currentDoc.push(line);
    }
  }

  // Handle last document if not closed
  if (currentDoc.length > 0) {
    try {
      const parsed = yaml.load(currentDoc.join('\n'));
      if (parsed && parsed.question) {
        documents.push(parsed);
      }
    } catch (e) {
      console.warn('  ⚠️  YAML parse error:', e.message);
    }
  }

  return documents;
}

// Get all study IDs
function getStudyIds(contentDir) {
  const studies = [];
  const entries = fs.readdirSync(contentDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.startsWith('bsc-')) {
      studies.push(entry.name);
    }
  }

  return studies;
}

// Get all modules for a study
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

// Check if module has training content
function hasTrainingContent(moduleDir) {
  const trainingDir = path.join(moduleDir, 'module-training');
  return (
    fs.existsSync(trainingDir) &&
    fs.existsSync(path.join(trainingDir, 'training.md'))
  );
}

// Get all topic folders in training directory
function getTopicFolders(trainingDir) {
  const topics = [];
  const entries = fs.readdirSync(trainingDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory() && /^\d{2}-/.test(entry.name)) {
      topics.push(entry.name);
    }
  }

  return topics.sort();
}

// Process a single module's training content
function processModuleTraining(studyId, moduleId, moduleDir) {
  const trainingDir = path.join(moduleDir, 'module-training');

  // Read training.md metadata
  const trainingMetaPath = path.join(trainingDir, 'training.md');
  const metaContent = fs.readFileSync(trainingMetaPath, 'utf-8');
  const metaMatch = metaContent.match(/^---\n([\s\S]*?)\n---/);

  let meta = {};
  if (metaMatch) {
    try {
      meta = yaml.load(metaMatch[1]) || {};
    } catch (e) {
      console.warn(`  ⚠️  Error parsing training.md: ${e.message}`);
    }
  }

  // Get all topics
  const topicFolders = getTopicFolders(trainingDir);
  const topics = [];
  let totalQuestions = 0;

  for (const topicId of topicFolders) {
    const topicDir = path.join(trainingDir, topicId);

    // Extract topic title from first question
    let topicTitle = topicId;
    const questions = { 1: [], 2: [], 3: [], 4: [], 5: [] };

    // Process each level (1-5)
    for (let level = 1; level <= 5; level++) {
      const levelFile = path.join(topicDir, `level-${level}.md`);

      if (!fs.existsSync(levelFile)) {
        continue;
      }

      const content = fs.readFileSync(levelFile, 'utf-8');
      const levelQuestions = parseMultiDocYaml(content);

      // Process each question
      for (let i = 0; i < levelQuestions.length; i++) {
        const q = levelQuestions[i];

        // Extract topic title from first question
        if (topicTitle === topicId && q.topic) {
          topicTitle = q.topic;
        }

        // Normalize question format
        const normalized = {
          id: `${topicId}:${level}:${i}`,
          question: q.question,
          options: q.options || [],
          type: q.type || 'multiple-choice'
        };

        // Handle correctAnswer vs correctAnswers
        if (q.correctAnswers) {
          normalized.correctAnswers = q.correctAnswers;
        } else if (q.correctAnswer) {
          normalized.correctAnswers = [q.correctAnswer];
        }

        questions[level].push(normalized);
        totalQuestions++;
      }
    }

    topics.push({
      id: topicId,
      title: topicTitle,
      questions: questions
    });
  }

  // Create training bundle
  const bundle = {
    moduleId: moduleId,
    title: meta.title || `Modul-Training: ${moduleId}`,
    description: meta.description || '',
    totalQuestions: totalQuestions,
    totalTopics: topics.length,
    questionsPerLevel: meta.questionsPerLevel || 10,
    levels: 5,
    version: meta.version || '1.0.0',
    generatedAt: new Date().toISOString(),
    topics: topics
  };

  // Write bundle
  const bundlePath = path.join(trainingDir, 'training-bundle.json');
  fs.writeFileSync(bundlePath, JSON.stringify(bundle, null, 2));

  return bundle;
}

// Main function
function main() {
  const contentDir = path.join(__dirname, '../content');
  const targetStudy = process.argv[2];

  console.log('📚 Generating training bundles...\n');

  // Get study IDs to process
  let studyIds = targetStudy ? [targetStudy] : getStudyIds(contentDir);

  let totalBundles = 0;
  let totalQuestions = 0;

  for (const studyId of studyIds) {
    const studyDir = path.join(contentDir, studyId);

    if (!fs.existsSync(studyDir)) {
      console.warn(`⚠️  Study not found: ${studyId}`);
      continue;
    }

    console.log(`📖 Study: ${studyId}`);

    const modules = getModules(studyDir);

    for (const moduleId of modules) {
      const moduleDir = path.join(studyDir, moduleId);

      if (!hasTrainingContent(moduleDir)) {
        continue;
      }

      console.log(`   📁 Module: ${moduleId}`);

      const bundle = processModuleTraining(studyId, moduleId, moduleDir);

      console.log(
        `      ✅ ${bundle.totalTopics} topics, ${bundle.totalQuestions} questions`
      );

      totalBundles++;
      totalQuestions += bundle.totalQuestions;
    }

    console.log('');
  }

  console.log('─'.repeat(50));
  console.log(`✅ Generated ${totalBundles} training bundle(s)`);
  console.log(`   ❓ Total questions: ${totalQuestions}`);
}

main();

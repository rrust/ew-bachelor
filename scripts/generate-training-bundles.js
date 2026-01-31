/**
 * Generate Training Bundles
 *
 * Creates pre-compiled JSON bundles for module training content.
 * Includes both MC questions and practical exercises.
 *
 * Usage: node generate-training-bundles.js [studyId]
 *
 * Output per module:
 *   content/{studyId}/{moduleId}/module-training/training-bundle.json
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Parse YAML file with questions array (new format)
// Format: { topic: '...', level: N, questions: [...] }
function parseYamlQuestionsFile(content) {
  try {
    const parsed = yaml.load(content);
    if (parsed && Array.isArray(parsed.questions)) {
      return {
        topic: parsed.topic || '',
        level: parsed.level || 1,
        questions: parsed.questions
      };
    }
  } catch (e) {
    console.warn('  ⚠️  YAML parse error:', e.message);
  }
  return { topic: '', level: 1, questions: [] };
}

// Parse exercises.yaml file
// Format: { topic: '...', blueprintType: '...', exercises: [...] }
function parseExercisesFile(content) {
  try {
    const parsed = yaml.load(content);
    if (parsed && Array.isArray(parsed.exercises)) {
      return {
        topic: parsed.topic || '',
        blueprintType: parsed.blueprintType || null,
        exercises: parsed.exercises
      };
    }
  } catch (e) {
    console.warn('  ⚠️  Exercises YAML parse error:', e.message);
  }
  return { topic: '', blueprintType: null, exercises: [] };
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
  let totalExercises = 0;

  for (const topicId of topicFolders) {
    const topicDir = path.join(trainingDir, topicId);

    // Extract topic title from first question
    let topicTitle = topicId;
    let blueprintType = null;
    const questions = { 1: [], 2: [], 3: [], 4: [], 5: [] };
    const exercises = { 1: [], 2: [], 3: [], 4: [], 5: [] };

    // Process each level (1-5) for MC questions
    for (let level = 1; level <= 5; level++) {
      // Support both .yaml and .md extensions (prefer .yaml)
      let levelFile = path.join(topicDir, `level-${level}.yaml`);
      if (!fs.existsSync(levelFile)) {
        levelFile = path.join(topicDir, `level-${level}.md`);
      }

      if (!fs.existsSync(levelFile)) {
        continue;
      }

      const content = fs.readFileSync(levelFile, 'utf-8');
      const parsed = parseYamlQuestionsFile(content);
      const levelQuestions = parsed.questions;

      // Extract topic title from file metadata
      if (topicTitle === topicId && parsed.topic) {
        topicTitle = parsed.topic;
      }

      // Process each question
      for (let i = 0; i < levelQuestions.length; i++) {
        const q = levelQuestions[i];

        // Normalize question format
        const normalized = {
          id: `${topicId}:${level}:${i}`,
          question: q.question,
          options: q.options || [],
          type: q.type || 'multiple-choice'
        };

        // Handle correct (array of indices) or correctAnswer/correctAnswers (text values)
        if (Array.isArray(q.correct)) {
          // New format: correct is array of 0-based indices
          normalized.correctIndices = q.correct;
          normalized.correctAnswers = q.correct.map((idx) => q.options[idx]);
        } else if (q.correctAnswers) {
          normalized.correctAnswers = q.correctAnswers;
        } else if (q.correctAnswer) {
          normalized.correctAnswers = [q.correctAnswer];
        }

        // Add related resources if present
        if (q.relatedCheatsheets) {
          normalized.relatedCheatsheets = q.relatedCheatsheets;
        }
        if (q.relatedBlueprints) {
          normalized.relatedBlueprints = q.relatedBlueprints;
        }

        questions[level].push(normalized);
        totalQuestions++;
      }
    }

    // Process exercises.yaml if present
    const exercisesFile = path.join(topicDir, 'exercises.yaml');
    if (fs.existsSync(exercisesFile)) {
      const exercisesContent = fs.readFileSync(exercisesFile, 'utf-8');
      const parsedExercises = parseExercisesFile(exercisesContent);

      // Get blueprintType for this topic
      if (parsedExercises.blueprintType) {
        blueprintType = parsedExercises.blueprintType;
      }

      // Process each exercise
      for (const ex of parsedExercises.exercises) {
        const level = ex.level || 3; // Default to level 3 if not specified

        const normalizedExercise = {
          id: ex.id,
          title: ex.title,
          level: level,
          task: ex.task,
          hints: ex.hints || {},
          steps: ex.steps || [],
          finalAnswer: ex.finalAnswer
        };

        // Add related resources
        if (ex.relatedCheatsheets) {
          normalizedExercise.relatedCheatsheets = ex.relatedCheatsheets;
        }
        if (ex.relatedBlueprints) {
          normalizedExercise.relatedBlueprints = ex.relatedBlueprints;
        }

        exercises[level].push(normalizedExercise);
        totalExercises++;
      }
    }

    // Count exercises per topic
    const exerciseCount = Object.values(exercises).reduce(
      (sum, arr) => sum + arr.length,
      0
    );

    const topicData = {
      id: topicId,
      title: topicTitle,
      questions: questions
    };

    // Only add exercises if there are any
    if (exerciseCount > 0) {
      topicData.exercises = exercises;
      topicData.blueprintType = blueprintType;
    }

    topics.push(topicData);
  }

  // Create training bundle
  const bundle = {
    moduleId: moduleId,
    title: meta.title || `Modul-Training: ${moduleId}`,
    description: meta.description || '',
    totalQuestions: totalQuestions,
    totalExercises: totalExercises,
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

  return { bundle, totalExercises };
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
  let totalExercises = 0;

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

      const result = processModuleTraining(studyId, moduleId, moduleDir);
      const bundle = result.bundle;
      const exerciseCount = result.totalExercises;

      // Build output string
      let output = `      ✅ ${bundle.totalTopics} topics, ${bundle.totalQuestions} questions`;
      if (exerciseCount > 0) {
        output += `, ${exerciseCount} exercises`;
      }
      console.log(output);

      totalBundles++;
      totalQuestions += bundle.totalQuestions;
      totalExercises += exerciseCount;
    }

    console.log('');
  }

  console.log('─'.repeat(50));
  console.log(`✅ Generated ${totalBundles} training bundle(s)`);
  console.log(`   ❓ Total questions: ${totalQuestions}`);
  if (totalExercises > 0) {
    console.log(`   🧮 Total exercises: ${totalExercises}`);
  }
}

main();

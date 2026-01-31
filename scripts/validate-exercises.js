#!/usr/bin/env node

/**
 * Exercise Validator for Module Training
 * Validates exercises.yaml files in module-training directories.
 *
 * Usage: node validate-exercises.js [studyId]
 * Example: node validate-exercises.js bsc-ernaehrungswissenschaften
 *
 * If no studyId is provided, validates all studies.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// ANSI colors
const colors = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  blue: (s) => `\x1b[34m${s}\x1b[0m`,
  gray: (s) => `\x1b[90m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`
};

/**
 * Parse YAML file using js-yaml
 */
function parseYaml(content) {
  try {
    const parsed = yaml.load(content);
    return parsed || { exercises: [] };
  } catch (e) {
    throw new Error(`YAML parse error: ${e.message}`);
  }
}

/**
 * Validate a single exercise
 */
function validateExercise(exercise, chapterName, errors, warnings) {
  const prefix = `${chapterName}/${exercise.id || 'unknown'}`;

  // Required fields
  if (!exercise.id) {
    errors.push(`${prefix}: Missing 'id' field`);
  }
  if (!exercise.title) {
    errors.push(`${prefix}: Missing 'title' field`);
  }
  if (!exercise.level || exercise.level < 1 || exercise.level > 5) {
    errors.push(`${prefix}: 'level' must be 1-5, got: ${exercise.level}`);
  }
  if (!exercise.task) {
    errors.push(`${prefix}: Missing 'task' field`);
  }
  if (!exercise.finalAnswer) {
    errors.push(`${prefix}: Missing 'finalAnswer' field`);
  }

  // Hints
  if (!exercise.hints) {
    errors.push(`${prefix}: Missing 'hints' object`);
  } else {
    if (!exercise.hints.keyword) {
      errors.push(`${prefix}: Missing 'hints.keyword'`);
    }
    if (!exercise.hints.approach) {
      errors.push(`${prefix}: Missing 'hints.approach'`);
    }
    if (!exercise.hints.overview) {
      errors.push(`${prefix}: Missing 'hints.overview'`);
    }
  }

  // Steps
  if (!exercise.steps || exercise.steps.length === 0) {
    errors.push(`${prefix}: Missing 'steps' array`);
  } else {
    // Check step count vs level
    const stepCount = exercise.steps.length;
    const expectedMin = getExpectedSteps(exercise.level).min;
    const expectedMax = getExpectedSteps(exercise.level).max;

    if (stepCount < expectedMin) {
      warnings.push(
        `${prefix}: Level ${exercise.level} should have at least ${expectedMin} steps, has ${stepCount}`
      );
    }
    if (stepCount > expectedMax) {
      warnings.push(
        `${prefix}: Level ${exercise.level} should have max ${expectedMax} steps, has ${stepCount}`
      );
    }

    // Check each step
    exercise.steps.forEach((step, idx) => {
      if (!step.description) {
        errors.push(`${prefix}: Step ${idx + 1} missing 'description'`);
      }
      if (!step.solution) {
        errors.push(`${prefix}: Step ${idx + 1} missing 'solution'`);
      }
    });
  }
}

/**
 * Get expected step count range for a level
 */
function getExpectedSteps(level) {
  const ranges = {
    1: { min: 2, max: 3 },
    2: { min: 3, max: 4 },
    3: { min: 4, max: 5 },
    4: { min: 5, max: 7 },
    5: { min: 6, max: 10 }
  };
  return ranges[level] || { min: 2, max: 10 };
}

/**
 * Validate exercises.yaml file
 */
function validateExercisesFile(filePath) {
  const errors = [];
  const warnings = [];
  const chapterName = path.basename(path.dirname(filePath));

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = parseYaml(content);

    // Check required top-level fields
    if (!data.topic) {
      warnings.push(`${chapterName}: Missing 'topic' field`);
    }
    if (!data.blueprintType) {
      warnings.push(
        `${chapterName}: Missing 'blueprintType' field (no blueprint linkage)`
      );
    }

    // Check exercises
    if (!data.exercises || data.exercises.length === 0) {
      errors.push(`${chapterName}: No exercises found`);
    } else {
      // Check for 2 exercises per level
      const levelCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      const ids = new Set();

      data.exercises.forEach((exercise) => {
        // Check for duplicate IDs
        if (ids.has(exercise.id)) {
          errors.push(`${chapterName}: Duplicate exercise ID '${exercise.id}'`);
        }
        ids.add(exercise.id);

        // Count per level
        if (exercise.level >= 1 && exercise.level <= 5) {
          levelCounts[exercise.level]++;
        }

        // Validate exercise
        validateExercise(exercise, chapterName, errors, warnings);
      });

      // Check distribution
      const totalExpected = 10; // 2 per level
      const totalFound = data.exercises.length;

      if (totalFound < totalExpected) {
        warnings.push(
          `${chapterName}: Expected ${totalExpected} exercises (2 per level), found ${totalFound}`
        );
      }

      // Check each level has exercises
      for (let level = 1; level <= 5; level++) {
        if (levelCounts[level] === 0) {
          warnings.push(`${chapterName}: No exercises for level ${level}`);
        } else if (levelCounts[level] < 2) {
          warnings.push(
            `${chapterName}: Only ${levelCounts[level]} exercise(s) for level ${level}, expected 2`
          );
        }
      }
    }
  } catch (err) {
    errors.push(`${chapterName}: Failed to parse YAML - ${err.message}`);
  }

  return { errors, warnings };
}

/**
 * Find all exercises.yaml files in a study
 */
function findExercisesFiles(studyPath) {
  const files = [];
  const moduleTrainingPath = path.join(studyPath, 'module-training');

  if (!fs.existsSync(moduleTrainingPath)) {
    return files;
  }

  const chapters = fs.readdirSync(moduleTrainingPath);
  for (const chapter of chapters) {
    if (
      chapter.startsWith('.') ||
      chapter.endsWith('.json') ||
      chapter.endsWith('.md')
    ) {
      continue;
    }

    const chapterPath = path.join(moduleTrainingPath, chapter);
    const stat = fs.statSync(chapterPath);

    if (stat.isDirectory()) {
      const exercisesFile = path.join(chapterPath, 'exercises.yaml');
      if (fs.existsSync(exercisesFile)) {
        files.push(exercisesFile);
      }
    }
  }

  return files;
}

/**
 * Main validation function
 */
function validateStudy(studyId) {
  const contentPath = path.join(process.cwd(), 'content', studyId);

  if (!fs.existsSync(contentPath)) {
    console.log(colors.red(`Study not found: ${studyId}`));
    return { errors: 1, warnings: 0 };
  }

  console.log(colors.bold(`\nValidating exercises for: ${studyId}`));
  console.log(colors.gray('─'.repeat(50)));

  let totalErrors = 0;
  let totalWarnings = 0;
  let totalExercises = 0;
  let chaptersWithExercises = 0;

  // Find all modules
  const modules = fs.readdirSync(contentPath).filter((m) => {
    const modulePath = path.join(contentPath, m);
    return fs.statSync(modulePath).isDirectory() && !m.startsWith('.');
  });

  for (const moduleId of modules) {
    const modulePath = path.join(contentPath, moduleId);
    const exercisesFiles = findExercisesFiles(modulePath);

    if (exercisesFiles.length === 0) {
      continue;
    }

    console.log(colors.blue(`\n📁 ${moduleId}`));

    for (const filePath of exercisesFiles) {
      const chapterName = path.basename(path.dirname(filePath));
      const { errors, warnings } = validateExercisesFile(filePath);

      // Count exercises
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = parseYaml(content);
        totalExercises += data.exercises ? data.exercises.length : 0;
        chaptersWithExercises++;
      } catch (e) {
        // Already handled in validation
      }

      if (errors.length === 0 && warnings.length === 0) {
        console.log(colors.green(`   ✓ ${chapterName}`));
      } else {
        if (errors.length > 0) {
          console.log(colors.red(`   ✗ ${chapterName}`));
          errors.forEach((e) => console.log(colors.red(`     ✗ ${e}`)));
        } else {
          console.log(colors.yellow(`   ⚠ ${chapterName}`));
        }
        warnings.forEach((w) => console.log(colors.yellow(`     ⚠ ${w}`)));
      }

      totalErrors += errors.length;
      totalWarnings += warnings.length;
    }
  }

  // Summary
  console.log(colors.gray('\n' + '─'.repeat(50)));
  console.log(colors.bold('Summary:'));
  console.log(`   Chapters with exercises: ${chaptersWithExercises}`);
  console.log(`   Total exercises: ${totalExercises}`);

  if (totalErrors === 0 && totalWarnings === 0) {
    console.log(colors.green(`   ✓ All exercises valid!`));
  } else {
    if (totalErrors > 0) {
      console.log(colors.red(`   ✗ ${totalErrors} error(s)`));
    }
    if (totalWarnings > 0) {
      console.log(colors.yellow(`   ⚠ ${totalWarnings} warning(s)`));
    }
  }

  return { errors: totalErrors, warnings: totalWarnings };
}

/**
 * Main entry point
 */
function main() {
  const args = process.argv.slice(2);
  const studyId = args[0];

  console.log(colors.bold('🧪 Exercise Validator'));

  if (studyId) {
    // Validate specific study
    const { errors } = validateStudy(studyId);
    process.exit(errors > 0 ? 1 : 0);
  } else {
    // Validate all studies
    const contentPath = path.join(process.cwd(), 'content');
    const studies = fs.readdirSync(contentPath).filter((s) => {
      const studyPath = path.join(contentPath, s);
      return fs.statSync(studyPath).isDirectory() && !s.startsWith('.');
    });

    let totalErrors = 0;
    for (const study of studies) {
      const { errors } = validateStudy(study);
      totalErrors += errors;
    }

    if (totalErrors === 0) {
      console.log(colors.green('\n✓ All studies validated successfully!'));
    } else {
      console.log(
        colors.red(`\n✗ Found ${totalErrors} error(s) across all studies`)
      );
    }

    process.exit(totalErrors > 0 ? 1 : 0);
  }
}

main();

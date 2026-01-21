#!/usr/bin/env node

/**
 * Generate Test Progress Data
 *
 * Creates JSON files with mock progress data that can be imported
 * via the app's built-in Import function (Tools → Import Progress).
 *
 * Usage:
 *   node generate-test-progress.js
 *
 * Output:
 *   test-data/progress-{studyId}-{scenario}.json
 *
 * Scenarios:
 *   - fresh: New user, no progress
 *   - beginner: A few lectures started, low scores
 *   - intermediate: Half completed, mixed scores
 *   - advanced: Most completed, good scores
 *   - complete: All completed with gold badges
 *   - mixed: Realistic mix of all badge types
 */

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'content');
const OUTPUT_DIR = path.join(__dirname, '..', 'test-data');

// Badge thresholds (matching state.js)
const BADGES = {
  gold: { min: 90, max: 100 },
  silver: { min: 70, max: 89 },
  bronze: { min: 50, max: 69 },
  none: { min: 0, max: 49 }
};

/**
 * Load studies from studies.json
 */
function loadStudies() {
  const studiesPath = path.join(CONTENT_DIR, 'studies.json');
  if (fs.existsSync(studiesPath)) {
    return JSON.parse(fs.readFileSync(studiesPath, 'utf8'));
  }
  return [];
}

/**
 * Load modules for a study
 */
function loadModules(studyId) {
  const modulesPath = path.join(CONTENT_DIR, studyId, 'modules.json');
  if (fs.existsSync(modulesPath)) {
    return JSON.parse(fs.readFileSync(modulesPath, 'utf8'));
  }
  return [];
}

/**
 * Get random score within a badge range
 */
function getRandomScore(badge) {
  const range = BADGES[badge];
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

/**
 * Get badge for score
 */
function getBadgeForScore(score) {
  if (score >= 90) return 'gold';
  if (score >= 70) return 'silver';
  if (score >= 50) return 'bronze';
  return 'none';
}

function randomDays(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Create an achievement unlock entry in the app's format
 */
function createAchievementUnlock(daysAgo = 7) {
  const unlockedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  const expiresAt = new Date(unlockedAt.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from unlock

  return {
    status: 'unlocked',
    unlockedAt: unlockedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    extensionCount: 0,
    lastExtensionAt: null
  };
}

/**
 * Generate the full export format (matching app's export)
 */
function generateExportData(studyId, modules, scenario, userName = 'TestUser') {
  const startedAt = new Date(
    Date.now() - randomDays(30, 180) * 24 * 60 * 60 * 1000
  );

  const progress = {
    userName: userName,
    startedAt: startedAt.toISOString(),
    modules: {}
  };

  // Add streak and training data based on scenario
  const scenarioData = getScenarioData(scenario);
  progress.streak = scenarioData.streak;
  progress.training = scenarioData.training;
  progress.moduleTraining = scenarioData.moduleTraining || {};

  // Filter modules that have lectures
  const modulesWithLectures = modules.filter(
    (m) => m.lectures && m.lectures.length > 0
  );

  switch (scenario) {
    case 'fresh':
      // No progress at all
      break;

    case 'beginner':
      generateBeginnerProgress(progress, modulesWithLectures);
      break;

    case 'intermediate':
      generateIntermediateProgress(progress, modulesWithLectures);
      break;

    case 'advanced':
      generateAdvancedProgress(progress, modulesWithLectures);
      break;

    case 'complete':
      generateCompleteProgress(progress, modulesWithLectures);
      break;

    case 'mixed':
      generateMixedProgress(progress, modulesWithLectures);
      break;
  }

  // Return in the app's export format
  return {
    exportedAt: new Date().toISOString(),
    version: '2.0',
    studyId: studyId,
    settings: {
      userName: userName,
      theme: 'light'
    },
    progress: progress
  };
}

// Topic IDs for module training (15 topics)
const TRAINING_TOPICS = [
  '01-aufbau-atome-periodensystem',
  '02-elemente-ionen-mol',
  '03-gleichungen-stoechiometrie',
  '04-reaktionen-empirische-formeln',
  '05-loesungen-konzentrationen',
  '06-saeuren-basen-grundlagen',
  '07-bohr-elektronenkonfiguration',
  '08-ionenbindung-lewis',
  '09-polaritaet-vsepr',
  '10-valenzbindung-hybridisierung-mo',
  '11-thermodynamik-enthalpie',
  '12-aggregatzustaende-phasendiagramme',
  '13-kolligative-eigenschaften',
  '14-saeuren-basen-ph-puffer',
  '15-elektrochemie-redox'
];

/**
 * Generate random correct answer IDs for module training
 * Format: topicId:level:questionIndex
 * @param {number} level - The level (1-5)
 * @param {number} count - Number of correct answers to generate
 * @returns {Array} Array of question IDs
 */
function generateRandomCorrectAnswers(level, count) {
  const answers = [];
  const questionsPerTopic = 10; // 10 questions per level per topic
  const maxPerLevel = TRAINING_TOPICS.length * questionsPerTopic; // 150 per level

  // Distribute across topics
  const answersPerTopic = Math.ceil(count / TRAINING_TOPICS.length);

  for (const topicId of TRAINING_TOPICS) {
    for (let i = 0; i < answersPerTopic && answers.length < count; i++) {
      // Ensure unique questions within each topic
      if (i < questionsPerTopic) {
        answers.push(`${topicId}:${level}:${i}`);
      }
    }
  }

  // Shuffle the array
  return answers.sort(() => Math.random() - 0.5).slice(0, count);
}

/**
 * Get streak and training data for each scenario
 */
function getScenarioData(scenario) {
  const now = new Date();
  const today = now.toISOString().split('T')[0] + 'T10:00:00.000Z';

  switch (scenario) {
    case 'fresh':
      return {
        streak: {
          current: 0,
          lastActivityDate: null,
          totalDays: 0,
          longestStreak: 0,
          rescueMode: false,
          rescueCorrect: 0,
          rescueTotal: 0
        },
        training: {
          tokens: 0,
          totalAnswered: 0,
          totalRounds: 0
        },
        moduleTraining: {}
      };

    case 'beginner':
      return {
        streak: {
          current: 2,
          lastActivityDate: today,
          totalDays: 3,
          longestStreak: 2,
          rescueMode: false,
          rescueCorrect: 0,
          rescueTotal: 0
        },
        training: {
          tokens: 5,
          totalAnswered: 20,
          totalRounds: 2
        },
        moduleTraining: {
          '02-chemie-grundlagen': {
            currentLevel: 1,
            answeredCorrectly: generateRandomCorrectAnswers(1, 25),
            totalCorrect: 25,
            completedAt: null
          }
        }
      };

    case 'intermediate':
      return {
        streak: {
          current: 5,
          lastActivityDate: today,
          totalDays: 12,
          longestStreak: 7,
          rescueMode: false,
          rescueCorrect: 0,
          rescueTotal: 0
        },
        training: {
          tokens: 15,
          totalAnswered: 150,
          totalRounds: 15
        },
        moduleTraining: {
          '02-chemie-grundlagen': {
            currentLevel: 2,
            answeredCorrectly: [
              ...generateRandomCorrectAnswers(1, 150),
              ...generateRandomCorrectAnswers(2, 75)
            ],
            totalCorrect: 225,
            completedAt: null
          }
        }
      };

    case 'advanced':
      return {
        streak: {
          current: 8,
          lastActivityDate: today,
          totalDays: 20,
          longestStreak: 10,
          rescueMode: false,
          rescueCorrect: 0,
          rescueTotal: 0
        },
        training: {
          tokens: 25,
          totalAnswered: 350,
          totalRounds: 35
        },
        moduleTraining: {
          '02-chemie-grundlagen': {
            currentLevel: 4,
            answeredCorrectly: [
              ...generateRandomCorrectAnswers(1, 150),
              ...generateRandomCorrectAnswers(2, 150),
              ...generateRandomCorrectAnswers(3, 150),
              ...generateRandomCorrectAnswers(4, 50)
            ],
            totalCorrect: 500,
            completedAt: null
          }
        }
      };

    case 'complete':
      return {
        streak: {
          current: 10,
          lastActivityDate: today,
          totalDays: 25,
          longestStreak: 10,
          rescueMode: false,
          rescueCorrect: 0,
          rescueTotal: 0
        },
        training: {
          tokens: 30,
          totalAnswered: 450,
          totalRounds: 45
        },
        moduleTraining: {
          '02-chemie-grundlagen': {
            currentLevel: 5,
            answeredCorrectly: [
              ...generateRandomCorrectAnswers(1, 150),
              ...generateRandomCorrectAnswers(2, 150),
              ...generateRandomCorrectAnswers(3, 150),
              ...generateRandomCorrectAnswers(4, 150),
              ...generateRandomCorrectAnswers(5, 150)
            ],
            totalCorrect: 750,
            completedAt: new Date(
              Date.now() - 5 * 24 * 60 * 60 * 1000
            ).toISOString()
          }
        }
      };

    case 'mixed':
      return {
        streak: {
          current: 3,
          lastActivityDate: today,
          totalDays: 8,
          longestStreak: 5,
          rescueMode: false,
          rescueCorrect: 0,
          rescueTotal: 0
        },
        training: {
          tokens: 12,
          totalAnswered: 100,
          totalRounds: 10
        },
        moduleTraining: {
          '02-chemie-grundlagen': {
            currentLevel: 3,
            answeredCorrectly: [
              ...generateRandomCorrectAnswers(1, 150),
              ...generateRandomCorrectAnswers(2, 150),
              ...generateRandomCorrectAnswers(3, 60)
            ],
            totalCorrect: 360,
            completedAt: null
          }
        }
      };

    default:
      return {
        streak: {
          current: 0,
          lastActivityDate: null,
          totalDays: 0,
          longestStreak: 0
        },
        training: { tokens: 0, totalAnswered: 0, totalRounds: 0 },
        moduleTraining: {}
      };
  }
}

function generateBeginnerProgress(progress, modules) {
  const modulesToProcess = modules.slice(0, Math.min(2, modules.length));

  modulesToProcess.forEach((module, mIdx) => {
    const lectures = module.lectures || [];
    const lecturesToProcess = lectures.slice(0, Math.min(2, lectures.length));

    if (lecturesToProcess.length === 0) return;

    progress.modules[module.id] = {
      status: 'in-progress',
      lectures: {},
      achievements: {}
    };

    lecturesToProcess.forEach((lectureId, lIdx) => {
      // First lecture might be bronze, second might not be completed
      if (mIdx === 0 && lIdx === 0) {
        const score = getRandomScore('bronze');
        progress.modules[module.id].lectures[lectureId] = {
          score: score,
          badge: getBadgeForScore(score)
        };
      } else if (Math.random() > 0.5) {
        const score = getRandomScore(Math.random() > 0.5 ? 'bronze' : 'none');
        progress.modules[module.id].lectures[lectureId] = {
          score: score,
          badge: getBadgeForScore(score)
        };
      }
    });
  });
}

function generateIntermediateProgress(progress, modules) {
  const halfModules = Math.ceil(modules.length / 2);
  const modulesToProcess = modules.slice(0, halfModules);

  modulesToProcess.forEach((module) => {
    const lectures = module.lectures || [];
    if (lectures.length === 0) return;

    progress.modules[module.id] = {
      status: 'in-progress',
      lectures: {},
      achievements: {}
    };

    lectures.forEach((lectureId) => {
      // 70% chance of completion
      if (Math.random() < 0.7) {
        const badgeRoll = Math.random();
        let badge;
        if (badgeRoll < 0.2) badge = 'gold';
        else if (badgeRoll < 0.5) badge = 'silver';
        else if (badgeRoll < 0.8) badge = 'bronze';
        else badge = 'none';

        const score = getRandomScore(badge);
        progress.modules[module.id].lectures[lectureId] = {
          score: score,
          badge: getBadgeForScore(score)
        };

        // Unlock achievement if gold
        if (badge === 'gold' && module.achievements) {
          const achievementId = module.achievements.find((a) =>
            a.includes(lectureId.replace(/^\d+-/, ''))
          );
          if (achievementId) {
            progress.modules[module.id].achievements[achievementId] =
              createAchievementUnlock(randomDays(1, 14));
          }
        }
      }
    });
  });
}

function generateAdvancedProgress(progress, modules) {
  modules.forEach((module, mIdx) => {
    const lectures = module.lectures || [];
    if (lectures.length === 0) return;

    // Skip last 1-2 modules to show "not complete"
    if (mIdx >= modules.length - 2 && Math.random() > 0.5) return;

    progress.modules[module.id] = {
      status: mIdx < modules.length - 2 ? 'completed' : 'in-progress',
      lectures: {},
      achievements: {}
    };

    lectures.forEach((lectureId) => {
      // 90% chance of completion, mostly silver/gold
      if (Math.random() < 0.9) {
        const badgeRoll = Math.random();
        let badge;
        if (badgeRoll < 0.5) badge = 'gold';
        else if (badgeRoll < 0.85) badge = 'silver';
        else badge = 'bronze';

        const score = getRandomScore(badge);
        progress.modules[module.id].lectures[lectureId] = {
          score: score,
          badge: getBadgeForScore(score)
        };

        // Unlock achievement if gold
        if (badge === 'gold' && module.achievements) {
          module.achievements.forEach((achievementId) => {
            progress.modules[module.id].achievements[achievementId] =
              createAchievementUnlock(randomDays(1, 30));
          });
        }
      }
    });
  });
}

function generateCompleteProgress(progress, modules) {
  modules.forEach((module) => {
    const lectures = module.lectures || [];
    if (lectures.length === 0) return;

    progress.modules[module.id] = {
      status: 'completed',
      lectures: {},
      achievements: {}
    };

    lectures.forEach((lectureId) => {
      // Perfect score for "complete" scenario
      progress.modules[module.id].lectures[lectureId] = {
        score: 100,
        badge: 'gold'
      };
    });

    // Unlock all achievements
    if (module.achievements) {
      module.achievements.forEach((achievementId) => {
        progress.modules[module.id].achievements[achievementId] =
          createAchievementUnlock(randomDays(1, 30));
      });
    }
  });
}

function generateMixedProgress(progress, modules) {
  modules.forEach((module, mIdx) => {
    const lectures = module.lectures || [];
    if (lectures.length === 0) return;

    // Earlier modules more likely to be complete
    const completionChance = Math.max(0.2, 1 - mIdx / modules.length);

    if (Math.random() > completionChance && mIdx > 0) return;

    progress.modules[module.id] = {
      status: 'in-progress',
      lectures: {},
      achievements: {}
    };

    let completedCount = 0;
    let hasGold = false;

    lectures.forEach((lectureId, idx) => {
      // Earlier lectures more likely to be complete
      const lectureCompletionChance = Math.max(
        0.3,
        1 - (idx / lectures.length) * 0.5
      );

      if (Math.random() < lectureCompletionChance) {
        // Realistic badge distribution
        const badgeRoll = Math.random();
        let badge;
        if (badgeRoll < 0.2) badge = 'gold';
        else if (badgeRoll < 0.5) badge = 'silver';
        else if (badgeRoll < 0.8) badge = 'bronze';
        else badge = 'none';

        const score = getRandomScore(badge);
        progress.modules[module.id].lectures[lectureId] = {
          score: score,
          badge: getBadgeForScore(score)
        };
        completedCount++;

        if (badge === 'gold') hasGold = true;
      }
    });

    // Unlock some achievements if we have gold badges
    if (hasGold && module.achievements && module.achievements.length > 0) {
      // Randomly unlock some achievements
      module.achievements.forEach((achievementId) => {
        if (Math.random() < 0.6) {
          progress.modules[module.id].achievements[achievementId] =
            createAchievementUnlock(randomDays(1, 20));
        }
      });
    }

    // Mark module as completed if all lectures done
    if (completedCount === lectures.length) {
      progress.modules[module.id].status = 'completed';
    }
  });
}

// Main
function main() {
  console.log('🧪 Generating Test Progress Data\n');

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const studies = loadStudies();
  const scenarios = [
    'fresh',
    'beginner',
    'intermediate',
    'advanced',
    'complete',
    'mixed'
  ];

  let totalFiles = 0;

  studies.forEach((study) => {
    console.log(`📚 Study: ${study.title} (${study.id})`);

    const modules = loadModules(study.id);
    const modulesWithLectures = modules.filter(
      (m) => m.lectures && m.lectures.length > 0
    );

    console.log(
      `   ${modules.length} modules, ${modulesWithLectures.length} with content\n`
    );

    scenarios.forEach((scenario) => {
      const exportData = generateExportData(
        study.id,
        modules,
        scenario,
        'TestUser'
      );
      const filename = `progress-${study.id}-${scenario}.json`;
      const filepath = path.join(OUTPUT_DIR, filename);

      fs.writeFileSync(filepath, JSON.stringify(exportData, null, 2));
      console.log(`   ✓ ${filename}`);
      totalFiles++;
    });

    console.log('');
  });

  // Create README
  const readme = `# Test Progress Data

Generated test data for testing the Progress screen with various completion states.

**These files use the app's native export format and can be imported via Tools → Import Progress.**

## Scenarios

| Scenario | Description |
|----------|-------------|
| \`fresh\` | New user, no progress at all |
| \`beginner\` | First 1-2 modules started, mostly low scores |
| \`intermediate\` | About half completed, mixed badges |
| \`advanced\` | Most completed, mostly silver/gold |
| \`complete\` | Everything done with gold badges + all achievements |
| \`mixed\` | Realistic distribution of all states |

## How to Import

1. Open the app in browser
2. Go to **Tools** (menu → Tools)
3. Click **Import Progress**
4. Select a file from this folder (e.g., \`progress-bsc-ernaehrungswissenschaften-complete.json\`)
5. The app will reload with the test data

## Alternative: Console Import

\`\`\`javascript
// In browser console - adjust filename as needed
fetch('test-data/progress-bsc-ernaehrungswissenschaften-complete.json')
  .then(r => r.json())
  .then(data => {
    localStorage.setItem('progress_' + data.studyId, JSON.stringify(data.progress));
    location.reload();
  });
\`\`\`

## Reset Progress

Go to **Tools → Reset Progress** or run in console:
\`\`\`javascript
localStorage.removeItem('progress_bsc-ernaehrungswissenschaften');
location.reload();
\`\`\`

## Regenerate Test Data

\`\`\`bash
node generate-test-progress.js
\`\`\`
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'README.md'), readme);

  console.log(`✅ Generated ${totalFiles} test data files in test-data/`);
  console.log(`\n📖 Import via: Tools → Import Progress`);
}

main();

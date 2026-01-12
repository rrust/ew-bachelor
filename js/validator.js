// js/validator.js
// In-app content validator

/**
 * Validation rules for different content types
 */
const REQUIRED_FIELDS = {
  'multiple-choice': ['type', 'question', 'options', 'correctAnswer'],
  'multiple-choice-multiple': ['type', 'question', 'options', 'correctAnswers'],
  'self-assessment-mc': ['type', 'question', 'options', 'correctAnswer'],
  'self-assessment': ['type', 'question', 'checkpoints'],
  'learning-content': ['type'],
  'youtube-video': ['type', 'url'],
  'external-video': ['type', 'url'],
  image: ['type', 'url', 'alt'],
  'mermaid-diagram': ['type'],
  'balance-equation': ['type', 'reactants', 'products'],
  'fill-in-the-blank': ['type', 'question', 'text', 'blanks'],
  matching: ['type', 'question', 'pairs'],
  ordering: ['type', 'question', 'items'],
  calculation: ['type', 'question', 'correctAnswer'],
  'practice-exercise': ['type', 'title', 'scenario', 'tasks']
};

/**
 * Valid icon names from icons.js
 */
const VALID_ICONS = [
  'search',
  'menuDots',
  'sun',
  'moon',
  'close',
  'modules',
  'chart',
  'cog',
  'map',
  'trophy',
  'achievement',
  'phone',
  'phoneDownload',
  'checkCircle',
  'book',
  'zoomIn',
  'zoomOut',
  'reset',
  'externalLink',
  'lock',
  'unlock',
  'clock',
  'hourglass',
  'document',
  'clipboard',
  'apple',
  'beaker',
  'graduationCap',
  'download',
  'upload',
  'hourglassEmpty',
  'check',
  'rocket',
  'fire',
  'muscle',
  'star',
  'wave'
];

/**
 * Validate the currently loaded APP_CONTENT
 * @param {Object} content - APP_CONTENT object
 * @param {Array} modules - Module metadata array
 * @returns {Object} Validation results
 */
function validateLoadedContent(content, modules) {
  const results = {
    totalFiles: 0,
    totalItems: 0,
    totalErrors: 0,
    totalWarnings: 0,
    validFiles: 0,
    issues: [] // Array of {file, type, errors, warnings}
  };

  if (!content || !modules) {
    results.issues.push({
      file: 'APP_CONTENT',
      type: 'system',
      errors: ['Content nicht geladen'],
      warnings: []
    });
    results.totalErrors = 1;
    return results;
  }

  // Validate each module
  modules.forEach((moduleMeta) => {
    const moduleId = moduleMeta.id;
    const moduleContent = content[moduleId];

    results.totalFiles++;

    // Validate module metadata
    const moduleIssues = {
      file: `Modul: ${moduleMeta.title}`,
      type: 'module',
      errors: [],
      warnings: []
    };

    if (!moduleMeta.id) moduleIssues.errors.push("Pflichtfeld 'id' fehlt");
    if (!moduleMeta.title)
      moduleIssues.errors.push("Pflichtfeld 'title' fehlt");

    if (moduleIssues.errors.length > 0 || moduleIssues.warnings.length > 0) {
      results.issues.push(moduleIssues);
      results.totalErrors += moduleIssues.errors.length;
      results.totalWarnings += moduleIssues.warnings.length;
    } else {
      results.validFiles++;
    }

    if (!moduleContent || !moduleContent.lectures) return;

    // Validate each lecture in the module
    Object.entries(moduleContent.lectures).forEach(([lectureId, lecture]) => {
      results.totalFiles++;
      const lectureIssues = {
        file: `Vorlesung: ${lecture.topic || lectureId}`,
        type: 'lecture',
        errors: [],
        warnings: []
      };

      // Check lecture metadata
      if (!lecture.topic)
        lectureIssues.errors.push("Pflichtfeld 'topic' fehlt");
      if (!lecture.description)
        lectureIssues.warnings.push("Feld 'description' fehlt");

      // Validate lecture items
      if (lecture.items && Array.isArray(lecture.items)) {
        lecture.items.forEach((item, index) => {
          results.totalItems++;
          const itemNum = index + 1;

          if (!item.type) {
            if (Object.keys(item).length > 1) {
              lectureIssues.warnings.push(`Item ${itemNum}: Kein 'type' Feld`);
            }
            return;
          }

          const requiredFields = REQUIRED_FIELDS[item.type];
          if (!requiredFields) {
            lectureIssues.warnings.push(
              `Item ${itemNum}: Unbekannter Typ '${item.type}'`
            );
            return;
          }

          // Check required fields
          requiredFields.forEach((field) => {
            if (!item[field]) {
              lectureIssues.errors.push(
                `Item ${itemNum} (${item.type}): '${field}' fehlt`
              );
            }
          });

          // Validate multiple-choice options
          if (
            item.type.includes('multiple-choice') ||
            item.type.includes('self-assessment-mc')
          ) {
            if (item.options && Array.isArray(item.options)) {
              if (item.options.length < 2) {
                lectureIssues.errors.push(
                  `Item ${itemNum}: Min. 2 Optionen erforderlich`
                );
              }
              if (
                item.correctAnswer &&
                !item.options.includes(item.correctAnswer)
              ) {
                lectureIssues.errors.push(
                  `Item ${itemNum}: 'correctAnswer' nicht in 'options'`
                );
              }
            }
          }
        });
      }

      // Validate quiz questions
      if (lecture.quiz && Array.isArray(lecture.quiz)) {
        lecture.quiz.forEach((question, index) => {
          results.totalItems++;
          const qNum = index + 1;

          if (!question.question) {
            lectureIssues.errors.push(`Quiz ${qNum}: 'question' fehlt`);
          }
          if (!question.options || !Array.isArray(question.options)) {
            lectureIssues.errors.push(
              `Quiz ${qNum}: 'options' fehlt oder ungültig`
            );
          } else {
            if (
              question.correctAnswer &&
              !question.options.includes(question.correctAnswer)
            ) {
              lectureIssues.errors.push(
                `Quiz ${qNum}: 'correctAnswer' "${question.correctAnswer}" nicht in 'options'`
              );
            }
          }
        });
      }

      if (
        lectureIssues.errors.length > 0 ||
        lectureIssues.warnings.length > 0
      ) {
        results.issues.push(lectureIssues);
        results.totalErrors += lectureIssues.errors.length;
        results.totalWarnings += lectureIssues.warnings.length;
      } else {
        results.validFiles++;
      }
    });
  });

  // Validate achievements
  if (content.achievements) {
    Object.entries(content.achievements).forEach(
      ([achievementId, achievement]) => {
        results.totalFiles++;
        results.totalItems++;

        const achIssues = {
          file: `Achievement: ${achievement.title || achievementId}`,
          type: 'achievement',
          errors: [],
          warnings: []
        };

        // Required fields
        if (!achievement.id) achIssues.errors.push("Pflichtfeld 'id' fehlt");
        if (!achievement.title)
          achIssues.errors.push("Pflichtfeld 'title' fehlt");
        if (!achievement.description)
          achIssues.errors.push("Pflichtfeld 'description' fehlt");

        // Check icon
        if (achievement.icon) {
          const hasEmoji =
            /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
              achievement.icon
            );
          if (hasEmoji) {
            achIssues.errors.push(
              `Icon '${achievement.icon}' ist ein Emoji - bitte Icon-Name verwenden`
            );
          } else if (!VALID_ICONS.includes(achievement.icon)) {
            achIssues.warnings.push(
              `Icon '${achievement.icon}' ist kein bekannter Icon-Name`
            );
          }
        } else {
          achIssues.warnings.push("Feld 'icon' fehlt");
        }

        // Check unlock condition
        if (!achievement.unlockCondition) {
          achIssues.errors.push("Pflichtfeld 'unlockCondition' fehlt");
        } else {
          if (!achievement.unlockCondition.type) {
            achIssues.errors.push('unlockCondition.type fehlt');
          }
        }

        if (achIssues.errors.length > 0 || achIssues.warnings.length > 0) {
          results.issues.push(achIssues);
          results.totalErrors += achIssues.errors.length;
          results.totalWarnings += achIssues.warnings.length;
        } else {
          results.validFiles++;
        }
      }
    );
  }

  return results;
}

/**
 * Render validation results in the validator modal
 */
function renderValidatorResults(results) {
  const container = document.getElementById('validator-content');
  if (!container) return;

  let html = '';

  // Summary card
  if (results.totalErrors === 0 && results.totalWarnings === 0) {
    html += `
      <div class="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg mb-4">
        <div class="flex items-center">
          <span class="text-2xl mr-3">✓</span>
          <div>
            <strong class="block">Alle Inhalte sind valide!</strong>
            <span class="text-sm">${results.totalFiles} Dateien, ${results.totalItems} Items geprüft</span>
          </div>
        </div>
      </div>
    `;
  } else {
    html += `
      <div class="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded-lg mb-4">
        <div class="flex items-center">
          <span class="text-2xl mr-3">⚠</span>
          <div>
            <strong class="block">Validierung abgeschlossen</strong>
            <span class="text-sm">
              ${results.validFiles}/${results.totalFiles} valide • 
              <span class="text-red-600 dark:text-red-400 font-bold">${results.totalErrors} Fehler</span> • 
              ${results.totalWarnings} Warnungen
            </span>
          </div>
        </div>
      </div>
    `;
  }

  // Only show files with issues
  if (results.issues.length > 0) {
    html += '<div class="space-y-3">';

    results.issues.forEach((issue) => {
      const hasErrors = issue.errors.length > 0;
      const borderColor = hasErrors
        ? 'border-red-400 dark:border-red-600'
        : 'border-yellow-400 dark:border-yellow-600';
      const icon = hasErrors ? '✗' : '⚠';
      const iconColor = hasErrors ? 'text-red-500' : 'text-yellow-500';

      html += `
        <div class="bg-white dark:bg-gray-800 border ${borderColor} px-4 py-3 rounded-lg">
          <div class="flex items-start gap-2">
            <span class="${iconColor} text-lg">${icon}</span>
            <div class="flex-grow">
              <strong class="block text-sm">${issue.file}</strong>
              <span class="text-xs text-gray-500 dark:text-gray-400">${issue.type}</span>
            </div>
          </div>
      `;

      if (issue.errors.length > 0) {
        html += '<div class="ml-6 mt-2 space-y-1">';
        issue.errors.forEach((error) => {
          html += `<div class="text-red-600 dark:text-red-400 text-sm">❌ ${error}</div>`;
        });
        html += '</div>';
      }

      if (issue.warnings.length > 0) {
        html += '<div class="ml-6 mt-2 space-y-1">';
        issue.warnings.forEach((warning) => {
          html += `<div class="text-yellow-600 dark:text-yellow-400 text-sm">⚠️ ${warning}</div>`;
        });
        html += '</div>';
      }

      html += '</div>';
    });

    html += '</div>';
  }

  container.innerHTML = html;
}

/**
 * Run the validator and show results in modal
 */
function runInAppValidator() {
  const modal = document.getElementById('validator-modal');
  if (!modal) return;

  // Show modal with loading state
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // Run validation after a short delay to allow modal to render
  setTimeout(() => {
    const results = validateLoadedContent(
      window.APP_CONTENT || {},
      window.APP_MODULES || []
    );
    renderValidatorResults(results);
  }, 100);
}

/**
 * Close the validator modal
 */
function closeValidatorModal() {
  const modal = document.getElementById('validator-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

/**
 * Setup validator event listeners
 */
function setupValidatorListeners() {
  const runBtn = document.getElementById('run-validator-button');
  if (runBtn) {
    runBtn.addEventListener('click', runInAppValidator);
  }

  const closeBtn = document.getElementById('close-validator-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeValidatorModal);
  }

  const modal = document.getElementById('validator-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeValidatorModal();
      }
    });
  }
}

// Expose to global scope
window.validateLoadedContent = validateLoadedContent;
window.runInAppValidator = runInAppValidator;
window.closeValidatorModal = closeValidatorModal;
window.setupValidatorListeners = setupValidatorListeners;

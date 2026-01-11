// js/snapshots.js
// Progress Snapshots System - automatic save states

const MAX_UNPINNED_SNAPSHOTS = 20;
const SNAPSHOTS_KEY_PREFIX = 'snapshots_';

/**
 * Get snapshots storage key for current study
 */
function getSnapshotsKey() {
  const settings = window.getAppSettings ? window.getAppSettings() : {};
  const studyId = settings.activeStudyId || 'bsc-ernaehrungswissenschaften';
  return `${SNAPSHOTS_KEY_PREFIX}${studyId}`;
}

/**
 * Get all snapshots for current study
 * @returns {Array} Array of snapshot objects
 */
function getSnapshots() {
  try {
    const key = getSnapshotsKey();
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('[Snapshots] Error loading snapshots:', e);
    return [];
  }
}

/**
 * Save snapshots to localStorage
 * @param {Array} snapshots - Array of snapshot objects
 */
function saveSnapshots(snapshots) {
  try {
    const key = getSnapshotsKey();
    localStorage.setItem(key, JSON.stringify(snapshots));
  } catch (e) {
    console.error('[Snapshots] Error saving snapshots:', e);
  }
}

/**
 * Create a new snapshot
 * @param {string} description - Description of what changed
 * @param {string} type - Type of change: 'quiz', 'exam', 'manual'
 */
function createSnapshot(description, type = 'quiz') {
  const progress = window.getUserProgress ? window.getUserProgress() : null;
  if (!progress) {
    console.warn('[Snapshots] No progress to snapshot');
    return;
  }

  const stats = calculateSnapshotStats(progress);

  const snapshot = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    description: description,
    type: type,
    pinned: false,
    stats: stats,
    progress: JSON.parse(JSON.stringify(progress)) // Deep clone
  };

  const snapshots = getSnapshots();
  snapshots.unshift(snapshot); // Add to beginning (newest first)

  // Cleanup old unpinned snapshots
  cleanupSnapshots(snapshots);

  saveSnapshots(snapshots);
  console.log('[Snapshots] Created snapshot:', description);
}

/**
 * Calculate stats from progress for display
 */
function calculateSnapshotStats(progress) {
  let modulesStarted = 0;
  let quizzesCompleted = 0;
  let totalScore = 0;
  let scoredQuizzes = 0;
  let goldBadges = 0;
  let silverBadges = 0;
  let bronzeBadges = 0;

  if (progress.modules) {
    for (const moduleId in progress.modules) {
      const module = progress.modules[moduleId];
      if (module.lectures && Object.keys(module.lectures).length > 0) {
        modulesStarted++;

        for (const lectureId in module.lectures) {
          const lecture = module.lectures[lectureId];
          if (lecture.score !== undefined) {
            quizzesCompleted++;
            totalScore += lecture.score;
            scoredQuizzes++;

            if (lecture.badge === 'gold') goldBadges++;
            else if (lecture.badge === 'silver') silverBadges++;
            else if (lecture.badge === 'bronze') bronzeBadges++;
          }
        }
      }
    }
  }

  return {
    modulesStarted,
    quizzesCompleted,
    averageScore:
      scoredQuizzes > 0 ? Math.round(totalScore / scoredQuizzes) : 0,
    goldBadges,
    silverBadges,
    bronzeBadges
  };
}

/**
 * Remove old unpinned snapshots, keeping only MAX_UNPINNED_SNAPSHOTS
 */
function cleanupSnapshots(snapshots) {
  const unpinned = snapshots.filter((s) => !s.pinned);
  const pinned = snapshots.filter((s) => s.pinned);

  if (unpinned.length > MAX_UNPINNED_SNAPSHOTS) {
    // Sort by date (newest first) and keep only the first MAX
    unpinned.sort((a, b) => new Date(b.date) - new Date(a.date));
    const toKeep = unpinned.slice(0, MAX_UNPINNED_SNAPSHOTS);
    const removed = unpinned.length - toKeep.length;

    // Rebuild array with pinned + kept unpinned
    snapshots.length = 0;
    snapshots.push(...pinned, ...toKeep);
    snapshots.sort((a, b) => new Date(b.date) - new Date(a.date));

    console.log(`[Snapshots] Cleaned up ${removed} old snapshots`);
  }
}

/**
 * Toggle pin status of a snapshot
 */
function toggleSnapshotPin(snapshotId) {
  const snapshots = getSnapshots();
  const snapshot = snapshots.find((s) => s.id === snapshotId);

  if (snapshot) {
    snapshot.pinned = !snapshot.pinned;
    saveSnapshots(snapshots);
    renderSnapshotsModal();
    console.log(
      `[Snapshots] ${snapshot.pinned ? 'Pinned' : 'Unpinned'} snapshot:`,
      snapshotId
    );
  }
}

/**
 * Load a snapshot (restore progress)
 */
function loadSnapshot(snapshotId) {
  const snapshots = getSnapshots();
  const snapshot = snapshots.find((s) => s.id === snapshotId);

  if (!snapshot) {
    alert('Speicherstand nicht gefunden');
    return;
  }

  if (
    !confirm(
      `Speicherstand vom ${formatSnapshotDate(
        snapshot.date
      )} laden?\n\nDies überschreibt deinen aktuellen Fortschritt!`
    )
  ) {
    return;
  }

  const settings = window.getAppSettings ? window.getAppSettings() : {};
  const studyId = settings.activeStudyId || 'bsc-ernaehrungswissenschaften';

  localStorage.setItem(
    `progress_${studyId}`,
    JSON.stringify(snapshot.progress)
  );
  console.log('[Snapshots] Loaded snapshot:', snapshotId);

  closeSnapshotsModal();
  location.reload();
}

/**
 * Download a single snapshot as JSON file
 */
function downloadSnapshot(snapshotId) {
  const snapshots = getSnapshots();
  const snapshot = snapshots.find((s) => s.id === snapshotId);

  if (!snapshot) return;

  const settings = window.getAppSettings ? window.getAppSettings() : {};
  const studyId = settings.activeStudyId || 'bsc-ernaehrungswissenschaften';

  const exportData = {
    exportedAt: new Date().toISOString(),
    version: '2.0',
    studyId: studyId,
    snapshotDate: snapshot.date,
    snapshotDescription: snapshot.description,
    settings: {
      userName: settings.userName || 'User',
      theme: localStorage.getItem('theme') || 'light'
    },
    progress: snapshot.progress
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date(snapshot.date).toISOString().split('T')[0];
  a.href = url;
  a.download = `${studyId}-snapshot-${dateStr}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Download all snapshots as single JSON file
 */
function downloadAllSnapshots() {
  const snapshots = getSnapshots();
  if (snapshots.length === 0) {
    alert('Keine Speicherstände vorhanden');
    return;
  }

  const settings = window.getAppSettings ? window.getAppSettings() : {};
  const studyId = settings.activeStudyId || 'bsc-ernaehrungswissenschaften';

  const exportData = {
    exportedAt: new Date().toISOString(),
    version: '2.0',
    studyId: studyId,
    snapshotCount: snapshots.length,
    snapshots: snapshots
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${studyId}-all-snapshots-${
    new Date().toISOString().split('T')[0]
  }.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Format date for display
 */
function formatSnapshotDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Get type icon as SVG
 */
function getTypeIcon(type) {
  const iconClass = 'w-4 h-4';
  switch (type) {
    case 'quiz':
      return Icons.get('document', iconClass, 'text-blue-500');
    case 'exam':
      return Icons.get('graduationCap', iconClass, 'text-purple-500');
    case 'manual':
      return Icons.get('save', iconClass, 'text-green-500');
    default:
      return Icons.get('document', iconClass, 'text-gray-500');
  }
}

/**
 * Open snapshots modal
 */
function openSnapshotsModal() {
  const modal = document.getElementById('snapshots-modal');
  if (!modal) return;

  renderSnapshotsModal();
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

/**
 * Close snapshots modal
 */
function closeSnapshotsModal() {
  const modal = document.getElementById('snapshots-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

/**
 * Render snapshots modal content
 */
function renderSnapshotsModal() {
  const container = document.getElementById('snapshots-content');
  if (!container) return;

  const snapshots = getSnapshots();
  const pinnedCount = snapshots.filter((s) => s.pinned).length;
  const unpinnedCount = snapshots.length - pinnedCount;

  const isDevMode = window.isDevMode && window.isDevMode();

  let html = `
    <!-- Info Section -->
    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4 text-sm">
      <p class="text-blue-800 dark:text-blue-200 flex items-start gap-2">
        <span class="flex-shrink-0 mt-0.5">${Icons.get('lightbulb', 'w-4 h-4', 'text-blue-500')}</span>
        <span><strong>So funktioniert's:</strong> Die App speichert automatisch deinen Fortschritt nach jedem Quiz oder Test. 
        Du kannst bis zu ${MAX_UNPINNED_SNAPSHOTS} Speicherstände behalten. Ältere werden automatisch gelöscht, 
        es sei denn du pinnst sie.</span>
      </p>
    </div>
    
    ${
      isDevMode
        ? `
    <!-- Dev Mode Actions -->
    <div class="bg-orange-50 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-700 rounded-lg p-3 mb-4">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-xs font-bold px-2 py-0.5 rounded bg-orange-500 text-white">DEV</span>
        <span class="text-sm font-medium text-orange-800 dark:text-orange-200">Test-Funktionen</span>
      </div>
      <div class="flex gap-2">
        <button
          onclick="generateDemoSnapshots()"
          class="flex items-center gap-1 text-xs px-3 py-1.5 bg-orange-100 dark:bg-orange-800/30 border border-orange-300 dark:border-orange-600 rounded hover:bg-orange-200 dark:hover:bg-orange-700/30 transition-colors"
        >
          ${Icons.get('plus', 'w-3 h-3')} Demo-Snapshots
        </button>
        <button
          onclick="clearAllSnapshots()"
          class="flex items-center gap-1 text-xs px-3 py-1.5 bg-red-100 dark:bg-red-800/30 border border-red-300 dark:border-red-600 rounded hover:bg-red-200 dark:hover:bg-red-700/30 transition-colors text-red-700 dark:text-red-300"
        >
          ${Icons.get('trash', 'w-3 h-3')} Alle löschen
        </button>
      </div>
    </div>
    `
        : ''
    }
    
    <!-- Actions -->
    <div class="flex justify-between items-center mb-4">
      <span class="text-sm text-gray-500 dark:text-gray-400">
        ${snapshots.length} Speicherstände (${pinnedCount} gepinnt)
      </span>
      <button
        onclick="downloadAllSnapshots()"
        class="flex items-center gap-1 text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        ${snapshots.length === 0 ? 'disabled' : ''}
      >
        ${Icons.get('download', 'w-4 h-4')} Alle herunterladen
      </button>
    </div>
  `;

  if (snapshots.length === 0) {
    html += `
      <div class="text-center py-8 text-gray-500 dark:text-gray-400">
        <div class="mb-3">${Icons.get('inbox', 'w-12 h-12 mx-auto', 'text-gray-300 dark:text-gray-600')}</div>
        <p>Noch keine Speicherstände vorhanden.</p>
        <p class="text-sm">Sie werden automatisch nach dem Abschluss eines Quiz erstellt.</p>
      </div>
    `;
  } else {
    html += '<div class="space-y-2 max-h-96 overflow-y-auto">';

    snapshots.forEach((snapshot) => {
      const isPinned = snapshot.pinned;
      const stats = snapshot.stats || {};

      html += `
        <div class="border ${
          isPinned
            ? 'border-yellow-400 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/10'
            : 'border-gray-200 dark:border-gray-700'
        } rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
          <div class="flex items-start justify-between gap-2">
            <div class="flex-grow min-w-0 cursor-pointer" onclick="loadSnapshot('${
              snapshot.id
            }')">
              <div class="flex items-center gap-2 mb-1">
                <span class="flex-shrink-0">${getTypeIcon(snapshot.type)}</span>
                <span class="font-medium text-sm truncate">${
                  snapshot.description
                }</span>
                ${isPinned ? `<span class="flex-shrink-0 text-yellow-500">${Icons.get('pinFilled', 'w-4 h-4')}</span>` : ''}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                ${formatSnapshotDate(snapshot.date)}
              </div>
              <div class="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                <span class="flex items-center gap-1">${Icons.get('modules', 'w-3 h-3')} ${stats.modulesStarted || 0}</span>
                <span class="flex items-center gap-1">${Icons.get('checkCircle', 'w-3 h-3')} ${stats.quizzesCompleted || 0}</span>
                <span class="flex items-center gap-1">${Icons.get('chart', 'w-3 h-3')} ${stats.averageScore || 0}%</span>
                ${stats.goldBadges ? `<span class="flex items-center gap-1">${Icons.get('trophy', 'w-3 h-3', 'text-yellow-500')} ${stats.goldBadges}</span>` : ''}
              </div>
            </div>
            <div class="flex items-center gap-1 flex-shrink-0">
              <button
                onclick="event.stopPropagation(); toggleSnapshotPin('${
                  snapshot.id
                }')"
                class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${isPinned ? 'text-yellow-500' : 'text-gray-400'}"
                title="${isPinned ? 'Nicht mehr pinnen' : 'Pinnen'}"
              >
                ${isPinned ? Icons.get('pinFilled', 'w-4 h-4') : Icons.get('pin', 'w-4 h-4')}
              </button>
              <button
                onclick="event.stopPropagation(); downloadSnapshot('${
                  snapshot.id
                }')"
                class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Herunterladen"
              >
                ${Icons.get('download', 'w-4 h-4')}
              </button>
            </div>
          </div>
        </div>
      `;
    });

    html += '</div>';
  }

  container.innerHTML = html;
}

/**
 * Setup snapshots modal event listeners
 */
function setupSnapshotsListeners() {
  const modal = document.getElementById('snapshots-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeSnapshotsModal();
      }
    });
  }
}

/**
 * [DEV MODE] Generate demo snapshots for testing
 * Creates snapshots with simulated progress over time
 */
function generateDemoSnapshots() {
  if (!window.isDevMode || !window.isDevMode()) {
    console.warn('[Snapshots] Demo generation only available in Dev Mode');
    return;
  }

  const demoData = [
    {
      daysAgo: 0,
      desc: 'Quiz: Zellbiologie Spickzettel',
      type: 'quiz',
      score: 92,
      modules: 3,
      quizzes: 8,
      gold: 4,
      silver: 3,
      bronze: 1
    },
    {
      daysAgo: 1,
      desc: 'Quiz: Makronährstoffe',
      type: 'quiz',
      score: 85,
      modules: 3,
      quizzes: 7,
      gold: 3,
      silver: 3,
      bronze: 1
    },
    {
      daysAgo: 2,
      desc: 'Quiz: Chemie Grundlagen',
      type: 'quiz',
      score: 78,
      modules: 2,
      quizzes: 5,
      gold: 2,
      silver: 2,
      bronze: 1
    },
    {
      daysAgo: 5,
      desc: 'Quiz: Materie und Messen',
      type: 'quiz',
      score: 65,
      modules: 2,
      quizzes: 4,
      gold: 1,
      silver: 2,
      bronze: 1
    },
    {
      daysAgo: 7,
      desc: 'Quiz: Grundlagen Zellbiologie',
      type: 'quiz',
      score: 72,
      modules: 1,
      quizzes: 2,
      gold: 0,
      silver: 2,
      bronze: 0
    },
    {
      daysAgo: 14,
      desc: 'Quiz: Ernährungslehre Basics',
      type: 'quiz',
      score: 55,
      modules: 1,
      quizzes: 1,
      gold: 0,
      silver: 0,
      bronze: 1
    }
  ];

  // Module and lecture IDs for generating realistic progress
  const moduleIds = [
    '01-ernaehrungslehre-grundlagen',
    '02-chemie-grundlagen',
    '03-biostatistik-wissenschaftliches-arbeiten'
  ];
  const lectureIds = {
    '01-ernaehrungslehre-grundlagen': [
      '01-grundlagen-zellbiologie',
      '02-makronaehrstoffe-detail',
      '03-mikronaehrstoffe-detail'
    ],
    '02-chemie-grundlagen': ['01-materie-messen'],
    '03-biostatistik-wissenschaftliches-arbeiten': ['01-einfuehrung']
  };

  // Start with empty array - replace all existing demo snapshots
  const snapshots = [];

  demoData.forEach((demo) => {
    const date = new Date();
    date.setDate(date.getDate() - demo.daysAgo);
    date.setHours(date.getHours() - Math.floor(Math.random() * 12));

    // Create simulated progress object with actual module data
    const simulatedProgress = {
      userName: 'TestUser',
      startedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      modules: {}
    };

    // Generate module progress based on demo stats
    let quizzesAdded = 0;
    let goldAdded = 0;
    let silverAdded = 0;
    let bronzeAdded = 0;

    for (let m = 0; m < demo.modules && m < moduleIds.length; m++) {
      const moduleId = moduleIds[m];
      const lectures = lectureIds[moduleId] || [];

      simulatedProgress.modules[moduleId] = {
        status: 'in-progress',
        lectures: {},
        achievements: {}
      };

      for (const lectureId of lectures) {
        if (quizzesAdded >= demo.quizzes) break;

        // Determine badge based on remaining badges to add
        let badge, score;
        if (goldAdded < demo.gold) {
          badge = 'gold';
          score = 85 + Math.floor(Math.random() * 15);
          goldAdded++;
        } else if (silverAdded < demo.silver) {
          badge = 'silver';
          score = 70 + Math.floor(Math.random() * 14);
          silverAdded++;
        } else if (bronzeAdded < demo.bronze) {
          badge = 'bronze';
          score = 50 + Math.floor(Math.random() * 19);
          bronzeAdded++;
        } else {
          badge = 'none';
          score = 30 + Math.floor(Math.random() * 19);
        }

        simulatedProgress.modules[moduleId].lectures[lectureId] = {
          score: score,
          badge: badge
        };
        quizzesAdded++;
      }

      // Mark module as completed if all lectures done
      if (
        Object.keys(simulatedProgress.modules[moduleId].lectures).length >=
        lectures.length
      ) {
        simulatedProgress.modules[moduleId].status = 'completed';
      }
    }

    const snapshot = {
      id: (
        Date.now() -
        demo.daysAgo * 86400000 +
        Math.random() * 1000
      ).toString(),
      date: date.toISOString(),
      description: `${demo.desc} (${demo.score}%)`,
      type: demo.type,
      pinned: demo.daysAgo === 7, // Pin one for demo
      stats: {
        modulesStarted: demo.modules,
        quizzesCompleted: demo.quizzes,
        averageScore: demo.score,
        goldBadges: demo.gold,
        silverBadges: demo.silver,
        bronzeBadges: demo.bronze
      },
      progress: simulatedProgress
    };

    // Debug log to verify progress data
    console.log('[Snapshots] Created demo snapshot:', {
      desc: demo.desc,
      moduleCount: Object.keys(simulatedProgress.modules).length,
      modules: simulatedProgress.modules
    });

    snapshots.push(snapshot);
  });

  // Sort by date (newest first)
  snapshots.sort((a, b) => new Date(b.date) - new Date(a.date));

  saveSnapshots(snapshots);
  renderSnapshotsModal();

  console.log('[Snapshots] Generated', demoData.length, 'demo snapshots');
  console.log('[Snapshots] First snapshot progress:', snapshots[0]?.progress);
}

/**
 * [DEV MODE] Clear all snapshots
 */
function clearAllSnapshots() {
  if (!window.isDevMode || !window.isDevMode()) {
    console.warn('[Snapshots] Clear only available in Dev Mode');
    return;
  }

  if (!confirm('Alle Speicherstände löschen?')) {
    return;
  }

  saveSnapshots([]);
  renderSnapshotsModal();
  console.log('[Snapshots] Cleared all snapshots');
}

// Expose to global scope
window.createSnapshot = createSnapshot;
window.getSnapshots = getSnapshots;
window.toggleSnapshotPin = toggleSnapshotPin;
window.loadSnapshot = loadSnapshot;
window.downloadSnapshot = downloadSnapshot;
window.downloadAllSnapshots = downloadAllSnapshots;
window.openSnapshotsModal = openSnapshotsModal;
window.closeSnapshotsModal = closeSnapshotsModal;
window.renderSnapshotsModal = renderSnapshotsModal;
window.setupSnapshotsListeners = setupSnapshotsListeners;
window.generateDemoSnapshots = generateDemoSnapshots;
window.clearAllSnapshots = clearAllSnapshots;

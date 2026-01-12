/**
 * Bundle Loader
 *
 * Converts lecture bundles to APP_CONTENT format.
 * Works with both downloaded bundles (from IndexedDB) and
 * freshly fetched bundles (from network).
 */

/**
 * Convert a lecture bundle to APP_CONTENT format
 * @param {Object} bundle - The lecture bundle
 * @returns {Object} Lecture in APP_CONTENT format
 */
function bundleToLecture(bundle) {
  const lecture = {
    topic: bundle.metadata?.topic || bundle.lectureId,
    description: bundle.metadata?.description || '',
    estimatedTime: bundle.metadata?.estimatedTime || 0,
    sources: bundle.metadata?.sources || [],
    items: [],
    quiz: []
  };

  // Convert items - markdown to HTML
  for (const item of bundle.items || []) {
    const convertedItem = {
      ...item
    };

    // Convert markdown content to HTML if present
    if (item.content && item.type === 'learning-content') {
      convertedItem.html = marked.parse(item.content);
      delete convertedItem.content;
    } else if (item.type === 'mermaid-diagram' && item.content) {
      // Extract mermaid code from markdown code block
      const mermaidMatch = item.content.match(/```mermaid\n([\s\S]*?)```/);
      if (mermaidMatch) {
        convertedItem.diagram = mermaidMatch[1].trim();
      } else {
        // If no code block, use content directly
        convertedItem.diagram = item.content;
      }
      // Also parse any text after the mermaid block as HTML
      const textAfterDiagram = item.content
        .replace(/```mermaid[\s\S]*?```/, '')
        .trim();
      if (textAfterDiagram) {
        convertedItem.html = marked.parse(textAfterDiagram);
      }
      delete convertedItem.content;
    } else if (item.content) {
      // For other types, keep content as-is
      convertedItem.html = item.content;
    }

    lecture.items.push(convertedItem);
  }

  // Quiz questions - add explanation HTML
  for (const question of bundle.quiz || []) {
    const convertedQuestion = {
      ...question
    };

    // Convert explanation to HTML if present
    if (question.explanation) {
      convertedQuestion.explanation = marked.parse(question.explanation);
    }

    lecture.quiz.push(convertedQuestion);
  }

  // Calculate quiz estimated time (2 min per question)
  lecture.quizEstimatedTime = lecture.quiz.length * 2;

  return lecture;
}

/**
 * Load a lecture from bundle (either from IndexedDB or network)
 * @param {string} studyId - Study ID
 * @param {string} moduleId - Module ID
 * @param {string} lectureId - Lecture ID
 * @returns {Promise<Object|null>} Lecture in APP_CONTENT format
 */
async function loadLectureFromBundle(studyId, moduleId, lectureId) {
  let indexedDbStatus = 'not-downloaded';

  // First, check if we have a current version in IndexedDB
  if (window.DownloadManager) {
    indexedDbStatus = await window.DownloadManager.getStatus(
      studyId,
      moduleId,
      lectureId
    );

    // Only use IndexedDB data if it's current (not outdated)
    if (indexedDbStatus === 'current') {
      const bundleData = await window.DownloadManager.getLectureData(
        studyId,
        moduleId,
        lectureId
      );
      if (bundleData) {
        console.log(
          `[BundleLoader] Loaded from IndexedDB (current): ${moduleId}/${lectureId}`
        );
        return bundleToLecture(bundleData);
      }
    } else if (indexedDbStatus === 'outdated') {
      console.log(
        `[BundleLoader] IndexedDB data outdated, trying network: ${moduleId}/${lectureId}`
      );
    }
  }

  // Try to fetch from network
  try {
    const basePath = window.getBasePath ? window.getBasePath() : '/';
    const bundlePath = `${basePath}content/${studyId}/${moduleId}/${lectureId}/lecture-bundle.json`;

    const response = await fetch(bundlePath);
    if (response.ok) {
      const bundle = await response.json();
      console.log(
        `[BundleLoader] Loaded from network: ${moduleId}/${lectureId}`
      );

      // Auto-save to IndexedDB for offline access
      if (window.DownloadManager) {
        window.DownloadManager.saveBundle(studyId, moduleId, lectureId, bundle)
          .then(() =>
            console.log(
              `[BundleLoader] Saved to IndexedDB: ${moduleId}/${lectureId}`
            )
          )
          .catch((e) =>
            console.warn('[BundleLoader] Failed to save bundle:', e)
          );
      }

      return bundleToLecture(bundle);
    }
  } catch (e) {
    console.warn(
      `[BundleLoader] Failed to fetch bundle: ${moduleId}/${lectureId}`,
      e
    );
  }

  // OFFLINE FALLBACK: If network failed but we have outdated data in IndexedDB, use it anyway
  if (indexedDbStatus === 'outdated' && window.DownloadManager) {
    const bundleData = await window.DownloadManager.getLectureData(
      studyId,
      moduleId,
      lectureId
    );
    if (bundleData) {
      console.log(
        `[BundleLoader] Offline fallback - using outdated IndexedDB data: ${moduleId}/${lectureId}`
      );
      return bundleToLecture(bundleData);
    }
  }

  return null;
}

/**
 * Check if a lecture bundle exists (either downloaded or on server)
 * @param {string} studyId - Study ID
 * @param {string} moduleId - Module ID
 * @param {string} lectureId - Lecture ID
 * @returns {Promise<boolean>}
 */
async function hasBundleAvailable(studyId, moduleId, lectureId) {
  // Check IndexedDB first
  if (window.DownloadManager) {
    const status = await window.DownloadManager.getStatus(
      studyId,
      moduleId,
      lectureId
    );
    if (status === 'current' || status === 'outdated') {
      return true;
    }
  }

  // Check if manifest has this lecture
  if (window.DownloadManager) {
    const info = await window.DownloadManager.getLectureInfo(
      studyId,
      moduleId,
      lectureId
    );
    return info !== null;
  }

  return false;
}

/**
 * Inject a lecture into APP_CONTENT
 * @param {Object} APP_CONTENT - The content object
 * @param {string} moduleId - Module ID
 * @param {string} lectureId - Lecture ID
 * @param {Object} lecture - The lecture object
 */
function injectLectureIntoContent(APP_CONTENT, moduleId, lectureId, lecture) {
  if (!APP_CONTENT[moduleId]) {
    APP_CONTENT[moduleId] = { lectures: {} };
  }
  if (!APP_CONTENT[moduleId].lectures) {
    APP_CONTENT[moduleId].lectures = {};
  }
  APP_CONTENT[moduleId].lectures[lectureId] = lecture;
  console.log(`[BundleLoader] Injected lecture: ${moduleId}/${lectureId}`);
}

/**
 * Load lecture on-demand if not already in APP_CONTENT
 * @param {Object} APP_CONTENT - The content object
 * @param {string} studyId - Study ID
 * @param {string} moduleId - Module ID
 * @param {string} lectureId - Lecture ID
 * @returns {Promise<Object|null>} The lecture object
 */
async function ensureLectureLoaded(APP_CONTENT, studyId, moduleId, lectureId) {
  // Check if already loaded
  const existing = APP_CONTENT[moduleId]?.lectures?.[lectureId];
  if (existing && existing.items && existing.items.length > 0) {
    return existing;
  }

  // Try to load from bundle
  const lecture = await loadLectureFromBundle(studyId, moduleId, lectureId);
  if (lecture) {
    injectLectureIntoContent(APP_CONTENT, moduleId, lectureId, lecture);
    return lecture;
  }

  return null;
}

// Expose to global scope
window.BundleLoader = {
  bundleToLecture,
  loadLectureFromBundle,
  hasBundleAvailable,
  injectLectureIntoContent,
  ensureLectureLoaded
};

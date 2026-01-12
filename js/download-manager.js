/**
 * Download Manager for Lecture Bundles
 *
 * Manages downloading, caching, and syncing of lecture content.
 * Uses IndexedDB for storing lecture bundles (larger data).
 * Uses localStorage for download status metadata.
 */

// IndexedDB database name and version
const DB_NAME = 'ew-lernapp-bundles';
const DB_VERSION = 1;
const STORE_NAME = 'lectures';

// Storage key for download metadata
const META_STORAGE_KEY = 'downloadedLectures';

/**
 * Initialize IndexedDB
 * @returns {Promise<IDBDatabase>}
 */
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
  });
}

/**
 * Get download metadata from localStorage
 * @returns {Object}
 */
function getDownloadMeta() {
  try {
    const stored = localStorage.getItem(META_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    console.error('[DownloadManager] Error reading meta:', e);
    return {};
  }
}

/**
 * Save download metadata to localStorage
 * @param {Object} meta
 */
function saveDownloadMeta(meta) {
  try {
    localStorage.setItem(META_STORAGE_KEY, JSON.stringify(meta));
  } catch (e) {
    console.error('[DownloadManager] Error saving meta:', e);
  }
}

/**
 * Get the storage key for a lecture
 * @param {string} studyId
 * @param {string} moduleId
 * @param {string} lectureId
 * @returns {string}
 */
function getLectureKey(studyId, moduleId, lectureId) {
  return `${studyId}/${moduleId}/${lectureId}`;
}

/**
 * Get the manifest key for a lecture (as used in content-manifest.json)
 * @param {string} moduleId
 * @param {string} lectureId
 * @returns {string}
 */
function getManifestKey(moduleId, lectureId) {
  return `${moduleId}/${lectureId}`;
}

// Cached manifest
let manifestCache = {};

/**
 * Load content manifest for a study
 * @param {string} studyId
 * @returns {Promise<Object>}
 */
async function loadManifest(studyId) {
  if (manifestCache[studyId]) {
    return manifestCache[studyId];
  }

  try {
    const basePath = window.getBasePath ? window.getBasePath() : '/';
    const manifestPath = `${basePath}content/${studyId}/content-manifest.json`;
    const response = await fetch(manifestPath);

    if (!response.ok) {
      console.warn(`[DownloadManager] No manifest found for ${studyId}`);
      return null;
    }

    manifestCache[studyId] = await response.json();
    return manifestCache[studyId];
  } catch (e) {
    console.error('[DownloadManager] Error loading manifest:', e);
    return null;
  }
}

/**
 * Clear manifest cache (call after content update)
 */
function clearManifestCache() {
  manifestCache = {};
}

/**
 * Get download status for a lecture
 * @param {string} studyId
 * @param {string} moduleId
 * @param {string} lectureId
 * @returns {Promise<'not-downloaded'|'outdated'|'current'>}
 */
async function getStatus(studyId, moduleId, lectureId) {
  const meta = getDownloadMeta();
  const lectureKey = getLectureKey(studyId, moduleId, lectureId);
  const manifestKey = getManifestKey(moduleId, lectureId);

  // Check if we have this lecture in metadata
  const downloadInfo = meta[lectureKey];
  if (!downloadInfo) {
    return 'not-downloaded';
  }

  // Verify data actually exists in IndexedDB
  try {
    const db = await openDatabase();
    const exists = await new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(lectureKey);
      request.onsuccess = () => resolve(!!request.result);
      request.onerror = () => resolve(false);
    });

    if (!exists) {
      // Metadata exists but data doesn't - clean up metadata
      delete meta[lectureKey];
      saveDownloadMeta(meta);
      return 'not-downloaded';
    }
  } catch (e) {
    console.warn('[DownloadManager] Failed to verify IndexedDB data:', e);
    return 'not-downloaded';
  }

  // Check if there's an update available
  const manifest = await loadManifest(studyId);
  if (manifest && manifest.lectures && manifest.lectures[manifestKey]) {
    const serverChecksum = manifest.lectures[manifestKey].checksum;
    if (downloadInfo.checksum !== serverChecksum) {
      return 'outdated';
    }
  }

  return 'current';
}

/**
 * Get download status for all lectures in a module
 * @param {string} studyId
 * @param {string} moduleId
 * @returns {Promise<{downloaded: number, total: number, outdated: number}>}
 */
async function getModuleDownloadStatus(studyId, moduleId) {
  const manifest = await loadManifest(studyId);
  if (!manifest || !manifest.lectures) {
    return { downloaded: 0, total: 0, outdated: 0 };
  }

  let downloaded = 0;
  let outdated = 0;
  let total = 0;

  for (const manifestKey of Object.keys(manifest.lectures)) {
    // Check if this lecture belongs to the module
    if (manifestKey.startsWith(moduleId + '/')) {
      total++;
      const lectureId = manifestKey.split('/')[1];

      // Use getStatus which verifies IndexedDB
      const status = await getStatus(studyId, moduleId, lectureId);

      if (status === 'current') {
        downloaded++;
      } else if (status === 'outdated') {
        downloaded++;
        outdated++;
      }
    }
  }

  return { downloaded, total, outdated };
}

/**
 * Get lecture info from manifest
 * @param {string} studyId
 * @param {string} moduleId
 * @param {string} lectureId
 * @returns {Promise<Object|null>}
 */
async function getLectureInfo(studyId, moduleId, lectureId) {
  const manifest = await loadManifest(studyId);
  if (!manifest || !manifest.lectures) return null;

  const manifestKey = getManifestKey(moduleId, lectureId);
  return manifest.lectures[manifestKey] || null;
}

/**
 * Download a lecture bundle
 * @param {string} studyId
 * @param {string} moduleId
 * @param {string} lectureId
 * @param {Function} onProgress - Callback with progress (0-100)
 * @returns {Promise<boolean>}
 */
async function download(studyId, moduleId, lectureId, onProgress = () => {}) {
  try {
    const lectureKey = getLectureKey(studyId, moduleId, lectureId);
    const manifestKey = getManifestKey(moduleId, lectureId);

    onProgress(10, 'Lade Manifest...');

    // Get manifest info
    const manifest = await loadManifest(studyId);
    const lectureInfo = manifest?.lectures?.[manifestKey];

    if (!lectureInfo) {
      console.error(
        '[DownloadManager] Lecture not found in manifest:',
        manifestKey
      );
      return false;
    }

    onProgress(20, 'Lade Vorlesungsdaten...');

    // Download the bundle
    const basePath = window.getBasePath ? window.getBasePath() : '/';
    const bundlePath = `${basePath}content/${studyId}/${moduleId}/${lectureId}/lecture-bundle.json`;

    const response = await fetch(bundlePath);
    if (!response.ok) {
      console.error(
        '[DownloadManager] Failed to fetch bundle:',
        response.status
      );
      return false;
    }

    onProgress(60, 'Verarbeite Daten...');

    const bundle = await response.json();

    onProgress(80, 'Speichere...');

    // Store in IndexedDB
    const db = await openDatabase();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({ key: lectureKey, bundle });
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });

    // Update metadata
    const meta = getDownloadMeta();
    meta[lectureKey] = {
      checksum: lectureInfo.checksum,
      downloadedAt: new Date().toISOString(),
      sizeKB: lectureInfo.sizeKB
    };
    saveDownloadMeta(meta);

    onProgress(100, 'Fertig!');

    console.log(`[DownloadManager] Downloaded: ${lectureKey}`);
    return true;
  } catch (e) {
    console.error('[DownloadManager] Download failed:', e);
    return false;
  }
}

/**
 * Get lecture data from IndexedDB
 * @param {string} studyId
 * @param {string} moduleId
 * @param {string} lectureId
 * @returns {Promise<Object|null>}
 */
async function getLectureData(studyId, moduleId, lectureId) {
  try {
    const lectureKey = getLectureKey(studyId, moduleId, lectureId);

    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(lectureKey);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.bundle : null);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error('[DownloadManager] Error getting lecture data:', e);
    return null;
  }
}

/**
 * Delete a downloaded lecture
 * @param {string} studyId
 * @param {string} moduleId
 * @param {string} lectureId
 * @returns {Promise<boolean>}
 */
async function deleteLecture(studyId, moduleId, lectureId) {
  try {
    const lectureKey = getLectureKey(studyId, moduleId, lectureId);

    // Remove from IndexedDB
    const db = await openDatabase();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(lectureKey);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });

    // Remove metadata
    const meta = getDownloadMeta();
    delete meta[lectureKey];
    saveDownloadMeta(meta);

    console.log(`[DownloadManager] Deleted: ${lectureKey}`);
    return true;
  } catch (e) {
    console.error('[DownloadManager] Delete failed:', e);
    return false;
  }
}

/**
 * Delete all downloaded lectures for a study
 * @param {string} studyId
 * @returns {Promise<boolean>}
 */
async function deleteStudy(studyId) {
  try {
    const meta = getDownloadMeta();
    const keysToDelete = Object.keys(meta).filter((k) =>
      k.startsWith(studyId + '/')
    );

    const db = await openDatabase();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      for (const key of keysToDelete) {
        store.delete(key);
        delete meta[key];
      }

      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });

    saveDownloadMeta(meta);

    console.log(`[DownloadManager] Deleted all lectures for: ${studyId}`);
    return true;
  } catch (e) {
    console.error('[DownloadManager] Delete study failed:', e);
    return false;
  }
}

/**
 * Get total storage used
 * @returns {number} Size in KB
 */
function getTotalStorageUsed() {
  const meta = getDownloadMeta();
  let totalKB = 0;

  for (const info of Object.values(meta)) {
    totalKB += info.sizeKB || 0;
  }

  return Math.round(totalKB * 10) / 10;
}

/**
 * Check if any lectures need updates
 * @param {string} studyId
 * @returns {Promise<string[]>} Array of lecture keys that need updates
 */
async function getOutdatedLectures(studyId) {
  const manifest = await loadManifest(studyId);
  if (!manifest || !manifest.lectures) return [];

  const meta = getDownloadMeta();
  const outdated = [];

  for (const manifestKey of Object.keys(manifest.lectures)) {
    const [moduleId, lectureId] = manifestKey.split('/');
    const lectureKey = getLectureKey(studyId, moduleId, lectureId);
    const downloadInfo = meta[lectureKey];

    if (downloadInfo) {
      const serverChecksum = manifest.lectures[manifestKey].checksum;
      if (downloadInfo.checksum !== serverChecksum) {
        outdated.push(lectureKey);
      }
    }
  }

  return outdated;
}

/**
 * Save a bundle to IndexedDB (for automatic offline caching)
 * @param {string} studyId
 * @param {string} moduleId
 * @param {string} lectureId
 * @param {Object} bundle - The lecture bundle data
 * @returns {Promise<boolean>}
 */
async function saveBundle(studyId, moduleId, lectureId, bundle) {
  try {
    const lectureKey = getLectureKey(studyId, moduleId, lectureId);
    const manifestKey = getManifestKey(moduleId, lectureId);

    // Get manifest info for checksum
    const manifest = await loadManifest(studyId);
    const lectureInfo = manifest?.lectures?.[manifestKey];

    // Store in IndexedDB
    const db = await openDatabase();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({ key: lectureKey, bundle });
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });

    // Update metadata
    const meta = getDownloadMeta();
    meta[lectureKey] = {
      checksum: lectureInfo?.checksum || 'unknown',
      downloadedAt: new Date().toISOString(),
      sizeKB: lectureInfo?.sizeKB || 0,
      autoSaved: true
    };
    saveDownloadMeta(meta);

    return true;
  } catch (e) {
    console.error('[DownloadManager] saveBundle failed:', e);
    return false;
  }
}

// Expose to global scope
window.DownloadManager = {
  // Status
  getStatus,
  getModuleDownloadStatus,
  getLectureInfo,
  getOutdatedLectures,

  // Download/Delete
  download,
  deleteLecture,
  deleteStudy,
  saveBundle,

  // Data access
  getLectureData,
  loadManifest,
  clearManifestCache,

  // Storage info
  getTotalStorageUsed
};

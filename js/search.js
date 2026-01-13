// js/search.js
// Global search functionality across all content

// Cache for search index
let searchIndexCache = null;

/**
 * Load the search index for the current study
 * @returns {Promise<Object|null>} Search index or null
 */
async function loadSearchIndex() {
  if (searchIndexCache) return searchIndexCache;

  const settings = window.getAppSettings ? window.getAppSettings() : {};
  const studyId = settings.activeStudyId;
  if (!studyId) return null;

  try {
    const basePath = window.getBasePath ? window.getBasePath() : '/';
    const response = await fetch(
      `${basePath}content/${studyId}/search-index.json`
    );
    if (response.ok) {
      searchIndexCache = await response.json();
      console.log(
        `[Search] Index loaded: ${
          searchIndexCache.entries?.length || 0
        } entries`
      );
      return searchIndexCache;
    }
  } catch (e) {
    console.warn('[Search] Failed to load search index:', e);
  }
  return null;
}

/**
 * Search using the pre-built search index (for lazy loading mode)
 * @param {string} query - Search query
 * @param {Array} modules - Module metadata
 * @returns {Promise<Array>} Search results
 */
async function searchWithIndex(query, modules) {
  const index = await loadSearchIndex();
  if (!index || !index.entries) return [];

  const results = [];
  const lowerQuery = query.toLowerCase();

  // Search terms including shorter prefixes for German compound words
  const searchTerms = [lowerQuery];
  if (lowerQuery.length >= 4) {
    searchTerms.push(lowerQuery.slice(0, -1));
  }

  // Type filter keywords mapping
  const typeFilters = {
    video: 'youtube-video',
    youtube: 'youtube-video',
    film: 'youtube-video',
    diagramm: 'mermaid-diagram',
    grafik: 'mermaid-diagram',
    flowchart: 'mermaid-diagram',
    schema: 'mermaid-diagram',
    lückentext: 'fill-in-the-blank',
    zuordnung: 'matching',
    sortierung: 'ordering',
    berechnung: 'calculation',
    übung: [
      'practice-exercise',
      'fill-in-the-blank',
      'matching',
      'ordering',
      'calculation'
    ],
    selbsttest: ['self-assessment', 'self-assessment-mc'],
    checkliste: 'self-assessment',
    quiz: ['multiple-choice', 'multiple-choice-multiple', 'self-assessment-mc']
  };

  // Check if query is a type filter
  const filterType = typeFilters[lowerQuery];
  const isTypeFilter = filterType !== undefined;

  // If type filter, search for items of that type
  if (isTypeFilter) {
    const filterTypes = Array.isArray(filterType) ? filterType : [filterType];

    for (const entry of index.entries) {
      const module = modules.find((m) => m.id === entry.moduleId);
      if (!module) continue;

      // Check items for matching types
      if (entry.items) {
        for (const item of entry.items) {
          if (filterTypes.includes(item.type)) {
            results.push({
              type: 'lecture-item',
              itemType: item.type,
              moduleId: entry.moduleId,
              lectureId: entry.lectureId,
              itemIndex: item.index,
              title: item.title,
              subtitle: `${entry.topic} · ${module.title}`,
              icon: getItemIconForType(item.type),
              url: `#/module/${entry.moduleId}/lecture/${entry.lectureId}/item/${item.index}`,
              score: 10
            });
          }
        }
      }
    }

    // Sort and return
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 50); // Allow more results for filters
  }

  // Regular search
  for (const entry of index.entries) {
    const module = modules.find((m) => m.id === entry.moduleId);
    if (!module) continue;

    let score = 0;

    // Check topic
    if (matchesAny(entry.topic, searchTerms)) {
      score += 10;
    }

    // Check description
    if (entry.description && matchesAny(entry.description, searchTerms)) {
      score += 5;
    }

    // Check topics list
    if (entry.topics) {
      for (const topic of entry.topics) {
        if (matchesAny(topic, searchTerms)) {
          score += 3;
        }
      }
    }

    // Check keywords
    if (entry.keywords) {
      for (const keyword of entry.keywords) {
        if (searchTerms.some((term) => keyword.startsWith(term))) {
          score += 1;
        }
      }
    }

    // Check snippet
    if (entry.snippet && matchesAny(entry.snippet, searchTerms)) {
      score += 2;
    }

    // Also check individual items for title matches
    if (entry.items) {
      for (const item of entry.items) {
        if (matchesAny(item.title, searchTerms)) {
          results.push({
            type: 'lecture-item',
            itemType: item.type,
            moduleId: entry.moduleId,
            lectureId: entry.lectureId,
            itemIndex: item.index,
            title: item.title,
            subtitle: `${entry.topic} · ${module.title}`,
            icon: getItemIconForType(item.type),
            url: `#/module/${entry.moduleId}/lecture/${entry.lectureId}/item/${item.index}`,
            score: 5
          });
        }
      }
    }

    if (score > 0) {
      results.push({
        type: 'lecture',
        moduleId: entry.moduleId,
        lectureId: entry.lectureId,
        title: entry.topic,
        subtitle: `${module.title} · ${entry.itemCount} Inhalte, ${entry.quizCount} Fragen`,
        icon: 'book',
        url: `#/module/${entry.moduleId}/lecture/${entry.lectureId}`,
        score
      });
    }
  }

  // Sort by score and limit
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 30);
}

/**
 * Get icon for item type
 * @param {string} type - Item type
 * @returns {string} Icon name
 */
function getItemIconForType(type) {
  const icons = {
    'youtube-video': '📺',
    'learning-content': 'book',
    'self-assessment': 'clipboard',
    'self-assessment-mc': 'document',
    'mermaid-diagram': '📊',
    'multiple-choice': 'document',
    'multiple-choice-multiple': 'document',
    'fill-in-the-blank': '✏️',
    matching: '🔗',
    ordering: '🔢',
    calculation: '🧮',
    'practice-exercise': '💪'
  };
  return icons[type] || 'document';
}

/**
 * Searches through all content for matches
 * @param {string} query - Search query
 * @param {Object} content - APP_CONTENT object
 * @param {Array} modules - Module metadata
 * @returns {Array} Array of search results
 */
function searchContent(query, content, modules) {
  if (!query || query.length < 2) return [];

  const results = [];
  const lowerQuery = query.toLowerCase();

  // For German compound words, also try shorter prefixes (min 3 chars)
  // This helps find "Zellbiologie" when searching for "Zelle"
  const searchTerms = [lowerQuery];
  if (lowerQuery.length >= 4) {
    searchTerms.push(lowerQuery.slice(0, -1));
  }
  if (lowerQuery.length >= 5) {
    searchTerms.push(lowerQuery.slice(0, -2));
  }

  modules.forEach((module) => {
    const moduleContent = content[module.id];
    if (!moduleContent?.lectures) return;

    // Search in module title/description
    if (
      matchesAny(module.title, searchTerms) ||
      (module.description && matchesAny(module.description, searchTerms))
    ) {
      results.push({
        type: 'module',
        moduleId: module.id,
        title: module.title,
        subtitle: module.description || '',
        icon: '📦',
        url: `#/module/${module.id}`
      });
    }

    // Search in lectures
    Object.entries(moduleContent.lectures).forEach(([lectureId, lecture]) => {
      const lectureTopic = lecture.topic || lectureId.replace(/-/g, ' ');

      // Search in lecture topic
      if (matchesAny(lectureTopic, searchTerms)) {
        results.push({
          type: 'lecture',
          moduleId: module.id,
          lectureId: lectureId,
          title: lectureTopic,
          subtitle: module.title,
          icon: 'book',
          url: `#/module/${module.id}/lecture/${lectureId}`
        });
      }

      // Search in lecture items content (stored as 'items' in the data structure)
      const lectureItems = lecture.items || lecture.lectureItems || [];
      if (Array.isArray(lectureItems)) {
        lectureItems.forEach((item, index) => {
          const itemTitle = item.title || item.topic || `Item ${index + 1}`;
          // Check multiple content fields that might contain text
          const itemContent =
            item.contentMarkdown ||
            item.content ||
            item.html ||
            item.explanation ||
            '';

          if (
            matchesAny(itemTitle, searchTerms) ||
            matchesAny(itemContent, searchTerms)
          ) {
            // Find a snippet around the match
            const snippet = getSnippet(itemContent, lowerQuery);

            results.push({
              type: 'lecture-item',
              itemType: item.type || 'learning-content',
              moduleId: module.id,
              lectureId: lectureId,
              itemIndex: index,
              title: itemTitle,
              subtitle: `${lectureTopic} • ${module.title}`,
              snippet: snippet,
              icon: getItemIcon(item.type),
              url: `#/module/${module.id}/lecture/${lectureId}/item/${index}`
            });
          }
        });
      }

      // Search in quiz questions
      if (lecture.quiz && Array.isArray(lecture.quiz)) {
        lecture.quiz.forEach((question, index) => {
          const questionText = question.question || '';
          const explanation = question.explanation || '';

          if (
            matchesAny(questionText, searchTerms) ||
            matchesAny(explanation, searchTerms)
          ) {
            results.push({
              type: 'quiz',
              moduleId: module.id,
              lectureId: lectureId,
              questionIndex: index,
              title:
                questionText.substring(0, 80) +
                (questionText.length > 80 ? '...' : ''),
              subtitle: `Quiz: ${lectureTopic}`,
              icon: 'document',
              url: `#/module/${module.id}/lecture/${lectureId}/quiz`
            });
          }
        });
      }
    });
  });

  // Search in achievements
  if (content.achievements) {
    Object.entries(content.achievements).forEach(
      ([achievementId, achievement]) => {
        const title = achievement.title || '';
        const description = achievement.description || '';
        // Support both pre-parsed HTML content and markdown source
        const achievementContent =
          achievement.contentMarkdown || achievement.content || '';

        if (
          matchesAny(title, searchTerms) ||
          matchesAny(description, searchTerms) ||
          matchesAny(achievementContent, searchTerms)
        ) {
          results.push({
            type: 'achievement',
            achievementId: achievementId,
            title: title,
            subtitle: description,
            icon: 'achievement',
            url: `#/achievements/${achievementId}`
          });
        }
      }
    );
  }

  // Remove duplicates and limit results
  const uniqueResults = removeDuplicates(results);
  return uniqueResults.slice(0, 20);
}

/**
 * Checks if text matches any of the search terms
 * @param {string} text - Text to search in
 * @param {Array} terms - Search terms to match
 * @returns {boolean} True if any term matches
 */
function matchesAny(text, terms) {
  const lowerText = text.toLowerCase();
  return terms.some((term) => lowerText.includes(term));
}

/**
 * Gets a text snippet around the search match
 * @param {string} text - Full text content
 * @param {string} query - Search query
 * @returns {string} Snippet with context
 */
function getSnippet(text, query) {
  const plainText = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ');
  const lowerText = plainText.toLowerCase();
  const index = lowerText.indexOf(query.toLowerCase());

  if (index === -1) return '';

  const start = Math.max(0, index - 40);
  const end = Math.min(plainText.length, index + query.length + 40);

  let snippet = plainText.substring(start, end);
  if (start > 0) snippet = '...' + snippet;
  if (end < plainText.length) snippet = snippet + '...';

  return snippet;
}

/**
 * Gets icon for lecture item type
 * @param {string} type - Item type
 * @returns {string} Emoji icon
 */
function getItemIcon(type) {
  const icons = {
    text: '📄',
    video: '🎬',
    image: '🖼️',
    diagram: '📊',
    'self-assessment': '✅'
  };
  return icons[type] || '📄';
}

/**
 * Removes duplicate results based on URL
 * @param {Array} results - Search results
 * @returns {Array} Deduplicated results
 */
function removeDuplicates(results) {
  const seen = new Set();
  return results.filter((result) => {
    if (seen.has(result.url)) return false;
    seen.add(result.url);
    return true;
  });
}

/**
 * Renders search results dropdown
 * @param {Array} results - Search results
 * @param {HTMLElement} container - Container element
 * @param {Function} onSelect - Callback when result is selected
 */
function renderSearchResults(results, container, onSelect) {
  if (results.length === 0) {
    container.innerHTML = `
      <div class="p-4 text-gray-500 dark:text-gray-400 text-center">
        Keine Ergebnisse gefunden
      </div>
    `;
    return;
  }

  container.innerHTML = results
    .map(
      (result, index) => `
      <button
        class="search-result w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
        data-index="${index}"
      >
        <div class="flex items-start gap-3">
          <span class="flex-shrink-0">${Icons.get(
            result.icon,
            'w-5 h-5',
            'text-gray-500 dark:text-gray-400'
          )}</span>
          <div class="min-w-0 flex-1">
            <div class="font-medium text-gray-900 dark:text-gray-100 truncate">
              ${escapeHtml(result.title)}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400 truncate">
              ${escapeHtml(result.subtitle)}
            </div>
            ${
              result.snippet
                ? `<div class="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-1">${escapeHtml(
                    result.snippet
                  )}</div>`
                : ''
            }
          </div>
          <span class="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
            ${getTypeLabel(result.type)}
          </span>
        </div>
      </button>
    `
    )
    .join('');

  // Add click handlers
  container.querySelectorAll('.search-result').forEach((btn) => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      onSelect(results[index]);
    });
  });
}

/**
 * Gets human-readable type label
 * @param {string} type - Result type
 * @returns {string} Label
 */
function getTypeLabel(type) {
  const labels = {
    module: 'Modul',
    lecture: 'Vorlesung',
    'lecture-item': 'Inhalt',
    quiz: 'Quiz',
    achievement: 'Achievement'
  };
  return labels[type] || type;
}

/**
 * Escapes HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Initializes global search functionality
 */
function initGlobalSearch() {
  const searchInput = document.getElementById('global-search-input');
  const searchResults = document.getElementById('global-search-results');
  const searchContainer = document.getElementById('global-search-container');

  if (!searchInput || !searchResults || !searchContainer) {
    console.warn('Search elements not found');
    return;
  }

  let debounceTimer = null;

  // Handle input
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();

    clearTimeout(debounceTimer);

    if (query.length < 2) {
      searchResults.classList.add('hidden');
      return;
    }

    debounceTimer = setTimeout(async () => {
      // Use search index in lazy loading mode, fall back to content search
      let results = searchContent(
        query,
        window.APP_CONTENT || {},
        window.APP_MODULES || []
      );

      // If no results from loaded content, try the search index
      if (results.length === 0) {
        results = await searchWithIndex(query, window.APP_MODULES || []);
      }

      searchResults.classList.remove('hidden');
      renderSearchResults(results, searchResults, (result) => {
        // Navigate to result
        window.location.hash = result.url;
        searchInput.value = '';
        searchResults.classList.add('hidden');
      });
    }, 200);
  });

  // Handle focus
  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length >= 2) {
      searchResults.classList.remove('hidden');
    }
  });

  // Handle click outside to close
  document.addEventListener('click', (e) => {
    if (!searchContainer.contains(e.target)) {
      searchResults.classList.add('hidden');
    }
  });

  // Handle escape key
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      searchResults.classList.add('hidden');
      searchInput.blur();
    }
    // Navigate to search page on Enter
    if (e.key === 'Enter' && searchInput.value.trim().length >= 2) {
      e.preventDefault();
      const query = searchInput.value.trim();
      searchResults.classList.add('hidden');
      searchInput.value = '';
      window.location.hash = `#/search/${encodeURIComponent(query)}`;
    }
  });

  // Handle keyboard navigation
  searchInput.addEventListener('keydown', (e) => {
    const buttons = searchResults.querySelectorAll('.search-result');
    if (buttons.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      buttons[0].focus();
    }
  });

  searchResults.addEventListener('keydown', (e) => {
    const buttons = Array.from(
      searchResults.querySelectorAll('.search-result')
    );
    const currentIndex = buttons.indexOf(document.activeElement);

    if (e.key === 'ArrowDown' && currentIndex < buttons.length - 1) {
      e.preventDefault();
      buttons[currentIndex + 1].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentIndex === 0) {
        searchInput.focus();
      } else if (currentIndex > 0) {
        buttons[currentIndex - 1].focus();
      }
    } else if (e.key === 'Escape') {
      searchInput.value = '';
      searchResults.classList.add('hidden');
      searchInput.blur();
    }
  });
}

// Expose to global scope
window.searchContent = searchContent;
window.initGlobalSearch = initGlobalSearch;

/**
 * Gets badge HTML for content type
 * @param {string} type - Result type
 * @returns {Object} {html, color}
 */
function getTypeBadge(type) {
  const badges = {
    module: { label: 'Modul', color: 'purple' },
    lecture: { label: 'Vorlesung', color: 'blue' },
    'lecture-item': { label: 'Inhalt', color: 'green' },
    quiz: { label: 'Quiz', color: 'orange' },
    achievement: { label: 'Achievement', color: 'yellow' }
  };
  const badge = badges[type] || { label: type, color: 'gray' };

  if (window.createBadge) {
    return window.createBadge(badge.label, badge.color);
  }
  return `<span class="text-xs text-gray-500">${badge.label}</span>`;
}

/**
 * Gets badge for item subtype (learning-content, self-assessment, video, etc.)
 * @param {Object} result - Search result
 * @returns {string} Badge HTML
 */
function getSubtypeBadge(result) {
  if (result.type !== 'lecture-item') return '';

  const subtypes = {
    'learning-content': { label: 'Lerninhalt', color: 'blue' },
    'self-assessment': { label: 'Selbsttest', color: 'green' },
    'self-assessment-mc': { label: 'Selbsttest', color: 'green' },
    'youtube-video': { label: 'Video', color: 'red' },
    video: { label: 'Video', color: 'red' },
    image: { label: 'Bild', color: 'purple' },
    'mermaid-diagram': { label: 'Diagramm', color: 'orange' },
    diagram: { label: 'Diagramm', color: 'orange' }
  };

  const subtype = subtypes[result.itemType] || null;
  if (!subtype) return '';

  if (window.createBadge) {
    return window.createBadge(subtype.label, subtype.color);
  }
  return '';
}

/**
 * Renders search results for the search page (full page view)
 * @param {Array} results - Search results
 * @param {string} query - Search query
 */
function renderSearchPage(results, query) {
  const container = document.getElementById('search-results-container');
  const statsEl = document.getElementById('search-stats');
  const emptyState = document.getElementById('search-empty-state');

  if (!container) return;

  // Update stats
  if (statsEl) {
    if (results.length > 0) {
      statsEl.textContent = `${results.length} Ergebnis${
        results.length !== 1 ? 'se' : ''
      } für "${query}"`;
      statsEl.classList.remove('hidden');
    } else {
      statsEl.classList.add('hidden');
    }
  }

  // Show/hide empty state
  if (emptyState) {
    if (results.length === 0 && query.length >= 2) {
      emptyState.innerHTML = `
        <h3 class="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">Keine Ergebnisse</h3>
        <p class="text-gray-500 dark:text-gray-400">Keine Treffer für "${escapeHtml(
          query
        )}"</p>
      `;
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
    }
  }

  if (results.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = results
    .map((result) => {
      // Special rendering for achievements to match achievement card style
      if (result.type === 'achievement') {
        const achievementIcon = Icons.get(
          'document',
          'w-6 h-6',
          'text-gray-600 dark:text-gray-400'
        );
        return `
          <a href="${
            result.url
          }" class="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-100 dark:border-gray-700">
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 mt-0.5">${achievementIcon}</div>
              <div class="flex-grow min-w-0">
                <div class="flex items-start justify-between gap-3 mb-1">
                  <h3 class="font-bold text-sm">${escapeHtml(result.title)}</h3>
                  <span class="bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">Achievement</span>
                </div>
                <p class="text-xs text-gray-600 dark:text-gray-400">${escapeHtml(
                  result.subtitle
                )}</p>
              </div>
            </div>
          </a>
        `;
      }

      // Default rendering for other result types
      return `
      <a href="${
        result.url
      }" class="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100 dark:border-gray-700">
        <div class="flex flex-wrap items-start gap-3 mb-3">
          ${getTypeBadge(result.type)}
          ${getSubtypeBadge(result)}
        </div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
          ${escapeHtml(result.title)}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
          ${escapeHtml(result.subtitle)}
        </p>
        ${
          result.snippet
            ? `<p class="text-sm text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 rounded p-3 mt-3">
                ...${escapeHtml(result.snippet)}...
              </p>`
            : ''
        }
      </a>
    `;
    })
    .join('');
}

/**
 * Initializes search page functionality
 * @param {string} query - Initial search query
 */
function initSearchPage(query = '') {
  const searchInput = document.getElementById('search-page-input');
  if (!searchInput) return;

  // Set initial query
  searchInput.value = query;

  // Perform initial search
  if (query.length >= 2) {
    // Try loaded content first, then fall back to index
    let results = searchContent(
      query,
      window.APP_CONTENT || {},
      window.APP_MODULES || []
    );
    if (results.length === 0) {
      searchWithIndex(query, window.APP_MODULES || []).then((indexResults) => {
        renderSearchPage(indexResults, query);
      });
    } else {
      renderSearchPage(results, query);
    }
  }

  let debounceTimer = null;

  // Handle input
  searchInput.addEventListener('input', (e) => {
    const newQuery = e.target.value.trim();

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
      // Update URL without full navigation
      if (newQuery.length >= 2) {
        history.replaceState(
          null,
          '',
          `#/search/${encodeURIComponent(newQuery)}`
        );
        let results = searchContent(
          newQuery,
          window.APP_CONTENT || {},
          window.APP_MODULES || []
        );
        // If no results from loaded content, try index
        if (results.length === 0) {
          results = await searchWithIndex(newQuery, window.APP_MODULES || []);
        }
        renderSearchPage(results, newQuery);
      } else {
        history.replaceState(null, '', '#/search');
        renderSearchPage([], newQuery);
      }
    }, 200);
  });

  // Focus input
  searchInput.focus();
}

// Expose to global scope
window.initSearchPage = initSearchPage;
window.renderSearchPage = renderSearchPage;
window.loadSearchIndex = loadSearchIndex;
window.searchWithIndex = searchWithIndex;

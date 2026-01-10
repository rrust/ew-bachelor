// Module Map Graph Generator
// Generates a Mermaid diagram showing all modules and their lectures

/**
 * Generates a Mermaid flowchart showing the structure of all modules and lectures
 * @param {Array} modules - Array of module metadata
 * @param {Object} content - APP_CONTENT object with lecture data
 * @returns {string} Mermaid diagram code
 */
function generateModuleMapGraph(modules, content) {
  if (!modules || modules.length === 0) {
    return 'flowchart TD\n    Start([Start Studium])\n    Start --> Empty[Keine Module verfügbar]';
  }

  let mermaidCode = 'flowchart TD\n';
  mermaidCode += '    Start([Start Studium])\n';

  const progress = getUserProgress();

  // Sort modules by order
  const sortedModules = [...modules].sort((a, b) => a.order - b.order);

  // Add all modules
  sortedModules.forEach((module, idx) => {
    const moduleNodeId = sanitizeMermaidId(module.id);
    const moduleTitle = escapeForMermaid(module.title);
    const ects = module.ects ? ` ${module.ects} ECTS` : '';

    // Connect start to first module
    if (idx === 0) {
      mermaidCode += `    Start --> ${moduleNodeId}\n`;
    }

    // Calculate module progress
    const moduleProgress = progress?.modules?.[module.id];
    let totalScore = 0;
    let completedCount = 0;

    if (moduleProgress?.lectures) {
      Object.values(moduleProgress.lectures).forEach((lectureData) => {
        if (lectureData.score !== undefined) {
          totalScore += lectureData.score;
          completedCount++;
        }
      });
    }

    const averageScore = completedCount > 0 ? totalScore / completedCount : 0;
    const badge = getProgressBadge(averageScore);

    mermaidCode += `    ${moduleNodeId}["${badge} ${moduleTitle}<br/>${ects}"]\n`;

    // Add lectures for this module
    const moduleContent = content[module.id];
    if (moduleContent?.lectures) {
      Object.keys(moduleContent.lectures).forEach((lectureId) => {
        const lecture = moduleContent.lectures[lectureId];
        const lectureNodeId = sanitizeMermaidId(`${module.id}-${lectureId}`);
        const lectureTopic = escapeForMermaid(lecture.topic);

        // Get lecture progress badge
        const lectureData = moduleProgress?.lectures?.[lectureId];
        const lectureBadge = lectureData?.badge
          ? getBadgeEmoji(lectureData.badge)
          : '⚪';

        mermaidCode += `    ${moduleNodeId} --> ${lectureNodeId}["${lectureBadge} ${lectureTopic}"]\n`;
      });
    }

    // Connect to next module with dotted line
    if (idx < sortedModules.length - 1) {
      const nextModule = sortedModules[idx + 1];
      const nextNodeId = sanitizeMermaidId(nextModule.id);
      mermaidCode += `    ${moduleNodeId} -.-> ${nextNodeId}\n`;
    }
  });

  // Add styling
  mermaidCode +=
    '\n    classDef moduleNode fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff\n';
  mermaidCode +=
    '    classDef lectureNode fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff\n';
  mermaidCode +=
    '    classDef startNode fill:#8b5cf6,stroke:#6d28d9,stroke-width:3px,color:#fff\n';

  // Apply styles
  mermaidCode += '    class Start startNode\n';
  sortedModules.forEach((module) => {
    const moduleNodeId = sanitizeMermaidId(module.id);
    mermaidCode += `    class ${moduleNodeId} moduleNode\n`;

    const moduleContent = content[module.id];
    if (moduleContent?.lectures) {
      Object.keys(moduleContent.lectures).forEach((lectureId) => {
        const lectureNodeId = sanitizeMermaidId(`${module.id}-${lectureId}`);
        mermaidCode += `    class ${lectureNodeId} lectureNode\n`;
      });
    }
  });

  return mermaidCode;
}

/**
 * Sanitizes an ID to be used in Mermaid diagrams
 * @param {string} id - The ID to sanitize
 * @returns {string} Sanitized ID
 */
function sanitizeMermaidId(id) {
  return id.replace(/[^a-zA-Z0-9]/g, '_');
}

/**
 * Escapes special characters for use in Mermaid text
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeForMermaid(text) {
  return text
    .replace(/"/g, '#quot;')
    .replace(/\[/g, '#91;')
    .replace(/\]/g, '#93;');
}

/**
 * Gets the progress badge emoji based on average score
 * @param {number} average - Average score percentage
 * @returns {string} Badge emoji
 */
function getProgressBadge(average) {
  if (window.getBadgeInfo) {
    return window.getBadgeInfo(average).emoji;
  }
  if (average >= 90) return '★';
  if (average >= 70) return '★';
  if (average >= 50) return '★';
  return '☆';
}

/**
 * Gets badge emoji from badge name
 * @param {string} badge - Badge name ('gold', 'silver', 'bronze')
 * @returns {string} Badge emoji
 */
function getBadgeEmoji(badge) {
  const badges = {
    gold: '★',
    silver: '★',
    bronze: '★'
  };
  return badges[badge] || '☆';
}

/**
 * Renders the module map view with a Mermaid diagram
 * @param {Array} modules - Array of module metadata
 * @param {Object} content - APP_CONTENT object
 */
async function renderModuleMap(modules, content) {
  const mapContainer = document.getElementById('map-diagram-container');
  if (!mapContainer) {
    console.error('Map diagram container not found');
    return;
  }

  // Generate Mermaid code
  const mermaidCode = generateModuleMapGraph(modules, content);

  // Create a unique ID for this diagram
  const diagramId = `mermaid-map-${Date.now()}`;

  // Clear previous content - simple structure
  mapContainer.innerHTML = `
    <div class="w-full h-full overflow-auto p-8 flex items-start justify-center">
      <div class="mermaid" id="${diagramId}">
${mermaidCode}
      </div>
    </div>
  `;

  // Render with Mermaid
  try {
    if (window.mermaid) {
      // Wait for the DOM to be ready and the element to be visible
      const diagramElement = document.getElementById(diagramId);
      if (!diagramElement) {
        console.error('Diagram element not found after creation');
        return;
      }

      // Wait a bit longer to ensure the view is fully visible
      await new Promise((resolve) => setTimeout(resolve, 50));

      await window.mermaid.run({
        nodes: [diagramElement]
      });

      // Initialize pan and zoom after rendering with longer delay
      setTimeout(() => initializeMapPanZoom(), 300);
    } else {
      console.error('Mermaid is not loaded');
      mapContainer.innerHTML =
        '<div class="flex items-center justify-center h-full"><p class="text-red-500 text-xl">Fehler: Mermaid-Bibliothek nicht geladen.</p></div>';
    }
  } catch (error) {
    console.error('Error rendering Mermaid diagram:', error);
    // Only show error if the view is still visible (user didn't navigate away)
    const mapView = document.getElementById('map-view');
    if (mapView && mapView.style.display !== 'none') {
      mapContainer.innerHTML = `<div class="flex items-center justify-center h-full"><p class="text-red-500 text-xl">Fehler beim Rendern: ${error.message}</p></div>`;
    }
  }
}

// State for pan and zoom
let mapZoomLevel = 1;
let mapPanning = false;
let mapPanStart = { x: 0, y: 0 };
let mapScrollStart = { x: 0, y: 0 };

/**
 * Initializes pan and zoom functionality for the map
 */
function initializeMapPanZoom() {
  const mapContainer = document.getElementById('map-diagram-container');
  const wrapper = mapContainer?.querySelector('.overflow-auto');
  const svg = mapContainer?.querySelector('svg');

  if (!wrapper || !svg) {
    console.warn('Map pan/zoom: wrapper or svg not found, retrying...');
    // Retry after a short delay if elements aren't ready
    setTimeout(() => {
      const retryWrapper = mapContainer?.querySelector('.overflow-auto');
      const retrySvg = mapContainer?.querySelector('svg');
      if (retryWrapper && retrySvg) {
        setupMapPanZoom(retryWrapper, retrySvg);
      }
    }, 200);
    return;
  }

  setupMapPanZoom(wrapper, svg);
}

/**
 * Sets up pan and zoom event listeners
 * @param {HTMLElement} wrapper - The wrapper element
 * @param {SVGElement} svg - The SVG element
 */
function setupMapPanZoom(wrapper, svg) {
  // Pan functionality
  wrapper.style.cursor = 'grab';

  wrapper.addEventListener('mousedown', (e) => {
    if (e.button === 0) {
      // Left mouse button
      mapPanning = true;
      mapPanStart = { x: e.clientX, y: e.clientY };
      mapScrollStart = { x: wrapper.scrollLeft, y: wrapper.scrollTop };
      wrapper.style.cursor = 'grabbing';
      e.preventDefault();
    }
  });

  wrapper.addEventListener('mousemove', (e) => {
    if (mapPanning) {
      const dx = mapPanStart.x - e.clientX;
      const dy = mapPanStart.y - e.clientY;
      wrapper.scrollLeft = mapScrollStart.x + dx;
      wrapper.scrollTop = mapScrollStart.y + dy;
    }
  });

  wrapper.addEventListener('mouseup', () => {
    mapPanning = false;
    wrapper.style.cursor = 'grab';
  });

  wrapper.addEventListener('mouseleave', () => {
    mapPanning = false;
    wrapper.style.cursor = 'grab';
  });

  // Zoom buttons
  const zoomInBtn = document.getElementById('map-zoom-in');
  const zoomOutBtn = document.getElementById('map-zoom-out');
  const resetZoomBtn = document.getElementById('map-reset-zoom');

  if (zoomInBtn) {
    zoomInBtn.onclick = () => zoomMap(0.2, svg);
  }

  if (zoomOutBtn) {
    zoomOutBtn.onclick = () => zoomMap(-0.2, svg);
  }

  if (resetZoomBtn) {
    resetZoomBtn.onclick = () => resetMapZoom(svg, wrapper);
  }

  // Mouse wheel zoom
  wrapper.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      zoomMap(delta, svg);
    },
    { passive: false }
  );
}

/**
 * Zooms the map by a given delta
 * @param {number} delta - Zoom delta (positive = zoom in, negative = zoom out)
 * @param {SVGElement} svg - The SVG element
 */
function zoomMap(delta, svg) {
  if (!svg) return;

  mapZoomLevel = Math.max(0.3, Math.min(3, mapZoomLevel + delta));
  svg.style.transform = `scale(${mapZoomLevel})`;
  svg.style.transformOrigin = 'top left';
}

/**
 * Resets the map zoom to default
 * @param {SVGElement} svg - The SVG element
 * @param {HTMLElement} wrapper - The wrapper element
 */
function resetMapZoom(svg, wrapper) {
  if (!svg || !wrapper) return;

  mapZoomLevel = 1;
  svg.style.transform = 'scale(1)';
  wrapper.scrollLeft = 0;
  wrapper.scrollTop = 0;
}

// Lecture module - Handles lecture player and content rendering

/**
 * Renders source reference footnotes for a lecture item
 * @param {Object} item - Lecture item with optional sourceRefs
 * @param {Array} sources - Array of source objects from lecture.md
 * @returns {string} HTML string for footnote, or empty string if no refs
 */
function renderSourceFootnotes(item, sources) {
  if (
    !item.sourceRefs ||
    !Array.isArray(item.sourceRefs) ||
    item.sourceRefs.length === 0
  ) {
    return '';
  }

  if (!sources || !Array.isArray(sources) || sources.length === 0) {
    return '';
  }

  // Build source lookup map
  const sourceMap = {};
  sources.forEach((s) => {
    if (s.id) sourceMap[s.id] = s;
  });

  // Generate footnote entries
  const footnotes = item.sourceRefs
    .map((ref) => {
      const source = sourceMap[ref.sourceId];
      if (!source) return null;

      const pages = ref.pages ? `, S. ${ref.pages}` : '';
      const title = source.title || ref.sourceId;

      if (source.url) {
        return `<a href="${source.url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">${title}</a>${pages}`;
      } else {
        return `${title}${pages}`;
      }
    })
    .filter((f) => f !== null);

  if (footnotes.length === 0) return '';

  return `
    <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <p class="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-2">
        <span class="flex-shrink-0">📖</span>
        <span><strong>Quelle:</strong> ${footnotes.join(' | ')}</span>
      </p>
    </div>
  `;
}

/**
 * Starts a lecture and shows the player
 * @param {string} moduleId - Module ID
 * @param {string} lectureId - Lecture ID
 * @param {Object} APP_CONTENT - Content object
 * @param {Array} MODULES - Module metadata array
 * @param {Object} lectureState - State object { currentItems, currentIndex }
 * @param {Object} elements - DOM elements { lectureJumpTo, lectureListContainer, lecturePlayer }
 * @param {Function} updateURL - URL update function
 * @param {Function} renderCurrentLectureItem - Render function
 * @param {Function} showView - View switching function
 */
function startLecture(
  moduleId,
  lectureId,
  APP_CONTENT,
  MODULES,
  lectureState,
  elements,
  updateURL,
  renderCurrentLectureItem,
  showView,
  startIndex = 0
) {
  const lecture = APP_CONTENT[moduleId]?.lectures[lectureId];

  if (!lecture || !lecture.items || lecture.items.length === 0) {
    alert('Diese Vorlesung hat keinen Inhalt.');
    return;
  }

  lectureState.currentItems = lecture.items;
  // Use startIndex if valid, otherwise default to 0
  lectureState.currentIndex =
    startIndex >= 0 && startIndex < lecture.items.length ? startIndex : 0;

  // Show/hide header quiz button based on quiz availability
  const lectureQuizButton = document.getElementById('lecture-quiz-button');
  if (lectureQuizButton) {
    const shouldShow = lecture.quiz && lecture.quiz.length > 0;
    lectureQuizButton.style.display = shouldShow ? 'block' : 'none';
  }

  // Update URL
  const moduleData = MODULES.find((m) => m.id === moduleId);
  const lectureTopic = lecture.topic || lectureId;
  updateURL(
    `/module/${moduleId}/lecture/${lectureId}/item/${lectureState.currentIndex}`,
    `${lectureTopic} - ${moduleData?.title || 'Module'}`
  );

  // Populate jump-to dropdown (if exists)
  if (elements.lectureJumpTo) {
    elements.lectureJumpTo.innerHTML = '';
    lectureState.currentItems.forEach((item, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `Schritt ${index + 1}`;
      elements.lectureJumpTo.appendChild(option);
    });
  }

  // Show player, hide lecture list
  elements.lectureListContainer.style.display = 'none';
  elements.lecturePlayer.style.display = 'flex';
  renderCurrentLectureItem();
  showView('lecture');
}

/**
 * Renders the current lecture item based on its type
 * @param {Object} lectureState - State object { currentItems, currentIndex }
 * @param {Function} updateLectureNav - Navigation update function
 * @param {Function} renderSelfAssessment - Self-assessment render function
 * @param {Function} renderYouTubeVideo - YouTube video render function
 * @param {Function} renderImage - Image render function
 * @param {Function} renderMermaidDiagram - Mermaid diagram render function
 * @param {Array} sources - Array of source objects from lecture.md
 */
function renderCurrentLectureItem(
  lectureState,
  updateLectureNav,
  renderSelfAssessment,
  renderYouTubeVideo,
  renderImage,
  renderMermaidDiagram,
  sources = []
) {
  const item = lectureState.currentItems[lectureState.currentIndex];
  const lectureItemDisplay = document.getElementById('lecture-item-display');
  lectureItemDisplay.innerHTML = ''; // Clear previous item

  // Get source footnote HTML (only for content types that support it)
  const footnoteHtml = renderSourceFootnotes(item, sources);

  switch (item.type) {
    case 'learning-content':
      lectureItemDisplay.innerHTML = item.html + footnoteHtml;
      renderMath(lectureItemDisplay);
      renderMermaidInContent(lectureItemDisplay);
      break;
    case 'self-assessment-mc':
      renderSelfAssessment(item, lectureItemDisplay);
      renderMath(lectureItemDisplay);
      // Add footnotes after self-assessment if present
      if (footnoteHtml) {
        lectureItemDisplay.insertAdjacentHTML('beforeend', footnoteHtml);
      }
      break;
    case 'youtube-video':
      renderYouTubeVideo(item, lectureItemDisplay);
      break;
    case 'image':
      renderImage(item, lectureItemDisplay);
      break;
    case 'mermaid-diagram':
      renderMermaidDiagram(item, lectureItemDisplay);
      break;
    case 'external-video':
      renderExternalVideo(item, lectureItemDisplay);
      break;
    case 'balance-equation':
      renderBalanceEquation(item, lectureItemDisplay);
      break;
    default:
      lectureItemDisplay.innerHTML = `<p class="text-red-500">Unbekannter Inhaltstyp: ${item.type}</p>`;
  }

  updateLectureNav();
}

/**
 * Renders math formulas using KaTeX if available
 * @param {HTMLElement} container - Container element to process
 */
function renderMath(container) {
  if (window.renderMathInElement) {
    renderMathInElement(container, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false }
      ],
      throwOnError: false
    });
  }
}

/**
 * Renders an external video link
 * @param {Object} item - Video item with url, title, description, duration
 * @param {HTMLElement} container - Container element
 */
function renderExternalVideo(item, container) {
  const title = item.title || 'Externes Video';
  const description = item.description || 'Öffnet in neuem Tab';
  const duration = item.duration
    ? `<span class="text-sm text-gray-500 dark:text-gray-400">(${item.duration})</span>`
    : '';

  container.innerHTML = `
    <div class="external-video-container p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
      <div class="text-4xl mb-4">🎬</div>
      <h3 class="text-xl font-bold mb-2">${title} ${duration}</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">${description}</p>
      <a href="${item.url}" 
         target="_blank" 
         rel="noopener noreferrer"
         class="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
        <span>Video öffnen</span>
        ${Icons.get('externalLink', 'w-4 h-4')}
      </a>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">
        Nach dem Ansehen hierher zurückkehren und fortfahren.
      </p>
    </div>
  `;
}

/**
 * Renders a balance equation exercise for chemistry
 * @param {Object} item - Equation item with reactants, products, hints, explanation
 * @param {HTMLElement} container - Container element
 */
function renderBalanceEquation(item, container) {
  const title = item.title
    ? `<h3 class="text-xl font-bold mb-4">${item.title}</h3>`
    : '';

  // Build equation display with input fields
  // Wrap formulas in \ce{} for KaTeX/mhchem rendering
  let equationHtml =
    '<div class="equation-container flex flex-wrap items-center justify-center gap-2 text-xl md:text-2xl my-6">';

  // Reactants
  item.reactants.forEach((r, i) => {
    if (i > 0) equationHtml += '<span class="mx-1 md:mx-2">+</span>';
    equationHtml += `
      <div class="flex items-center">
        <input type="number" 
               min="1" max="20" 
               class="coefficient-input w-10 h-10 md:w-12 md:h-12 text-center text-lg md:text-xl border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:border-blue-500 focus:outline-none"
               data-correct="${r.coefficient}"
               data-index="r${i}"
               aria-label="Koeffizient für ${r.formula}">
        <span class="ml-1 formula">$\\ce{${r.formula}}$</span>
      </div>`;
  });

  // Arrow
  equationHtml += '<span class="mx-2 md:mx-4">→</span>';

  // Products
  item.products.forEach((p, i) => {
    if (i > 0) equationHtml += '<span class="mx-1 md:mx-2">+</span>';
    equationHtml += `
      <div class="flex items-center">
        <input type="number" 
               min="1" max="20" 
               class="coefficient-input w-10 h-10 md:w-12 md:h-12 text-center text-lg md:text-xl border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:border-blue-500 focus:outline-none"
               data-correct="${p.coefficient}"
               data-index="p${i}"
               aria-label="Koeffizient für ${p.formula}">
        <span class="ml-1 formula">$\\ce{${p.formula}}$</span>
      </div>`;
  });

  equationHtml += '</div>';

  // Hints section (collapsible)
  let hintsHtml = '';
  if (item.hints && item.hints.length > 0) {
    hintsHtml = `
      <details class="mb-4">
        <summary class="cursor-pointer text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
          💡 Hinweise anzeigen (${item.hints.length})
        </summary>
        <ol class="mt-2 ml-6 list-decimal text-gray-600 dark:text-gray-400 space-y-1">
          ${item.hints.map((h) => `<li>${h}</li>`).join('')}
        </ol>
      </details>`;
  }

  container.innerHTML = `
    <div class="balance-equation-container p-4 md:p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
      ${title}
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Gib die Koeffizienten ein, um die Gleichung auszugleichen:
      </p>
      ${equationHtml}
      ${hintsHtml}
      <div class="flex justify-center gap-4 mt-6">
        <button class="check-equation-btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
          Prüfen
        </button>
        <button class="reset-equation-btn bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Zurücksetzen
        </button>
      </div>
      <div class="equation-feedback mt-4 p-4 rounded-lg hidden"></div>
    </div>
  `;

  // Add event listeners
  const checkBtn = container.querySelector('.check-equation-btn');
  const resetBtn = container.querySelector('.reset-equation-btn');
  const feedbackDiv = container.querySelector('.equation-feedback');
  const inputs = container.querySelectorAll('.coefficient-input');

  checkBtn.addEventListener('click', () => {
    let allCorrect = true;
    let allFilled = true;

    inputs.forEach((input) => {
      const userValue = parseInt(input.value);
      const correctValue = parseInt(input.dataset.correct);

      if (!input.value || isNaN(userValue)) {
        allFilled = false;
        input.classList.remove('border-green-500', 'border-red-500');
        input.classList.add('border-yellow-500');
      } else if (userValue === correctValue) {
        input.classList.remove(
          'border-gray-300',
          'dark:border-gray-600',
          'border-red-500',
          'border-yellow-500'
        );
        input.classList.add('border-green-500');
      } else {
        allCorrect = false;
        input.classList.remove(
          'border-gray-300',
          'dark:border-gray-600',
          'border-green-500',
          'border-yellow-500'
        );
        input.classList.add('border-red-500');
      }
    });

    feedbackDiv.classList.remove(
      'hidden',
      'bg-green-100',
      'bg-red-100',
      'bg-yellow-100',
      'dark:bg-green-900',
      'dark:bg-red-900',
      'dark:bg-yellow-900'
    );

    if (!allFilled) {
      feedbackDiv.classList.add('bg-yellow-100', 'dark:bg-yellow-900');
      feedbackDiv.innerHTML =
        '<p class="text-yellow-700 dark:text-yellow-200">⚠️ Bitte fülle alle Felder aus.</p>';
    } else if (allCorrect) {
      feedbackDiv.classList.add('bg-green-100', 'dark:bg-green-900');
      feedbackDiv.innerHTML = `
        <p class="text-green-700 dark:text-green-200 font-bold">✅ Richtig! Die Gleichung ist ausgeglichen.</p>
        ${
          item.explanation
            ? `<p class="text-green-600 dark:text-green-300 mt-2">${item.explanation}</p>`
            : ''
        }
      `;
      checkBtn.disabled = true;
      checkBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
      feedbackDiv.classList.add('bg-red-100', 'dark:bg-red-900');
      feedbackDiv.innerHTML =
        '<p class="text-red-700 dark:text-red-200">❌ Noch nicht richtig. Überprüfe die rot markierten Koeffizienten.</p>';
    }
  });

  resetBtn.addEventListener('click', () => {
    inputs.forEach((input) => {
      input.value = '';
      input.classList.remove(
        'border-green-500',
        'border-red-500',
        'border-yellow-500'
      );
      input.classList.add('border-gray-300', 'dark:border-gray-600');
    });
    feedbackDiv.classList.add('hidden');
    checkBtn.disabled = false;
    checkBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  });

  // Render formulas with KaTeX/mhchem
  renderMath(container);
}

/**
 * Renders a YouTube video
 * @param {Object} item - Video item with url and optional title
 * @param {HTMLElement} container - Container element
 */
function renderYouTubeVideo(item, container) {
  // Extract video ID from URL
  let videoId = '';
  if (item.url) {
    const urlParams = new URLSearchParams(new URL(item.url).search);
    videoId = urlParams.get('v') || item.url.split('/').pop();
  }

  const title = item.title
    ? `<h3 class="text-xl font-bold mb-4">${item.title}</h3>`
    : '';

  container.innerHTML = `
    <div class="video-container">
      ${title}
      <div class="relative" style="padding-bottom: 56.25%; height: 0;">
        <iframe 
          src="https://www.youtube.com/embed/${videoId}" 
          class="absolute top-0 left-0 w-full h-full rounded-lg"
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      </div>
    </div>
  `;
}

/**
 * Renders an image
 * @param {Object} item - Image item with url, optional title, caption, alt
 * @param {HTMLElement} container - Container element
 */
function renderImage(item, container) {
  const title = item.title
    ? `<h3 class="text-xl font-bold mb-4">${item.title}</h3>`
    : '';
  const caption = item.caption
    ? `<p class="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">${item.caption}</p>`
    : '';
  const alt = item.alt || item.title || 'Bild';

  container.innerHTML = `
    <div class="image-container">
      ${title}
      <div class="flex justify-center">
        <img 
          src="${item.url}" 
          alt="${alt}"
          class="max-w-full h-auto rounded-lg shadow-lg"
        />
      </div>
      ${caption}
    </div>
  `;
}

/**
 * Finds and renders Mermaid code blocks within already-rendered HTML
 * @param {HTMLElement} container - Container to search for mermaid blocks
 */
async function renderMermaidInContent(container) {
  if (!window.mermaid) return;

  // Find all code blocks with class 'language-mermaid'
  const mermaidBlocks = container.querySelectorAll('code.language-mermaid');

  for (const codeBlock of mermaidBlocks) {
    const diagramCode = codeBlock.textContent;
    const preElement = codeBlock.parentElement;

    if (!preElement || preElement.tagName !== 'PRE') continue;

    // Create a container for the rendered diagram
    const diagramId = `mermaid-inline-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const diagramContainer = document.createElement('div');
    diagramContainer.className =
      'flex justify-center p-4 bg-white dark:bg-gray-800 rounded-lg my-4';
    diagramContainer.id = diagramId;

    try {
      const { svg } = await window.mermaid.render(
        `render-${diagramId}`,
        diagramCode
      );
      diagramContainer.innerHTML = svg;
      preElement.replaceWith(diagramContainer);
    } catch (error) {
      console.error('Error rendering inline Mermaid diagram:', error);
      // Keep the code block visible if rendering fails
    }
  }
}

/**
 * Renders a Mermaid diagram
 * @param {Object} item - Diagram item with diagram code and optional title
 * @param {HTMLElement} container - Container element
 */
async function renderMermaidDiagram(item, container) {
  const title = item.title
    ? `<h3 class="text-xl font-bold mb-4">${item.title}</h3>`
    : '';
  const diagramId = `mermaid-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  container.innerHTML = `
    <div class="mermaid-container">
      ${title}
      <button class="expand-btn hidden lg:block" title="Vergrößern" aria-label="Diagramm vergrößern">
        ${Icons.get('expand', 'w-5 h-5')}
      </button>
      <div class="flex justify-center p-4 bg-white dark:bg-gray-800 rounded-lg overflow-x-auto">
        <div id="${diagramId}" class="mermaid-diagram"></div>
      </div>
    </div>
  `;

  // Render mermaid diagram
  try {
    const diagramDiv = document.getElementById(diagramId);
    const { svg } = await window.mermaid.render(
      `diagram-${diagramId}`,
      item.diagram
    );
    diagramDiv.innerHTML = svg;

    // Add expand functionality
    const expandBtn = container.querySelector('.expand-btn');
    if (expandBtn) {
      expandBtn.addEventListener('click', () => {
        openExpandedDiagram(item.title || 'Diagramm', svg);
      });
    }
  } catch (error) {
    console.error('Error rendering Mermaid diagram:', error);
    container.innerHTML = `<p class="text-red-500">Fehler beim Rendern des Diagramms: ${error.message}</p>`;
  }
}

/**
 * Opens a diagram in fullscreen/expanded mode
 * @param {string} title - Diagram title
 * @param {string} svg - SVG content
 */
function openExpandedDiagram(title, svg) {
  const overlay = document.createElement('div');
  overlay.className = 'expanded-overlay';
  overlay.innerHTML = `
    <div class="expanded-content">
      <button class="close-expanded-btn">✕ Schließen</button>
      <h2 class="text-2xl font-bold mb-4 pr-24">${title}</h2>
      <div class="mermaid-diagram flex-1 flex items-center justify-center">${svg}</div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Scale SVG to fit the container
  const svgEl = overlay.querySelector('.mermaid-diagram svg');
  if (svgEl) {
    svgEl.removeAttribute('width');
    svgEl.removeAttribute('height');
    svgEl.style.width = 'auto';
    svgEl.style.height = 'auto';
    svgEl.style.maxWidth = '100%';
    svgEl.style.maxHeight = 'calc(95vh - 8rem)';
  }

  // Close handlers
  const closeBtn = overlay.querySelector('.close-expanded-btn');
  closeBtn.addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      overlay.remove();
      document.removeEventListener('keydown', escHandler);
    }
  });
}

/**
 * Renders a self-assessment multiple choice question
 * @param {Object} item - Question item with question, options, correctAnswer, explanation
 * @param {HTMLElement} container - Container element
 */
function renderSelfAssessment(item, container) {
  let content = `<div class="p-4 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
          <p class="font-semibold mb-4">${item.question}</p>
          <div class="space-y-2">`;

  item.options.forEach((option, index) => {
    content += `<label class="block p-3 border dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
              <input type="radio" name="self-assessment-option" value="${option}" class="mr-2">
              ${option}
          </label>`;
  });

  content += `</div>
          <button class="check-answer-btn mt-4 bg-blue-200 dark:bg-blue-700 hover:bg-blue-300 dark:hover:bg-blue-600 text-blue-800 dark:text-blue-100 font-bold py-2 px-4 rounded-md">Antwort prüfen</button>
          <div class="explanation mt-3 p-3 border-l-4 border-yellow-400 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/30" style="display:none;"></div>
      </div>`;

  container.innerHTML = content;

  const checkBtn = container.querySelector('.check-answer-btn');
  checkBtn.addEventListener('click', () => {
    const selected = container.querySelector(
      'input[name="self-assessment-option"]:checked'
    );
    if (!selected) {
      alert('Bitte wähle eine Antwort.');
      return;
    }
    const isCorrect = selected.value === item.correctAnswer;
    const explanationDiv = container.querySelector('.explanation');
    explanationDiv.innerHTML =
      (isCorrect
        ? '<p class="font-bold text-green-700">Richtig!</p>'
        : '<p class="font-bold text-red-700">Leider falsch.</p>') +
      item.explanation;
    explanationDiv.style.display = 'block';
    checkBtn.disabled = true; // Prevent re-checking
  });
}

/**
 * Updates lecture navigation (progress, buttons, URL)
 * @param {Object} lectureState - State object
 * @param {string} currentModuleId - Module ID
 * @param {string} currentLectureId - Lecture ID
 * @param {Object} APP_CONTENT - Content object
 * @param {Object} displays - Display elements
 * @param {Object} elements - DOM elements
 * @param {Object} buttons - Button elements
 * @param {Function} updateURL - URL update function
 */
function updateLectureNav(
  lectureState,
  currentModuleId,
  currentLectureId,
  APP_CONTENT,
  displays,
  elements,
  buttons,
  updateURL
) {
  const totalItems = lectureState.currentItems.length;
  displays.lectureProgress.textContent = `${
    lectureState.currentIndex + 1
  } / ${totalItems}`;
  if (elements.lectureJumpTo) {
    elements.lectureJumpTo.value = lectureState.currentIndex;
  }

  // Update URL for current item
  updateURL(
    `/module/${currentModuleId}/lecture/${currentLectureId}/item/${lectureState.currentIndex}`,
    document.title.split(' - ')[0]
  );

  buttons.prevItem.style.display =
    lectureState.currentIndex > 0 ? 'block' : 'none';
  buttons.nextItem.style.display =
    lectureState.currentIndex < totalItems - 1 ? 'block' : 'none';

  const lecture = APP_CONTENT[currentModuleId]?.lectures[currentLectureId];
  buttons.startQuiz.style.display =
    lectureState.currentIndex === totalItems - 1 && lecture.quiz.length > 0
      ? 'block'
      : 'none';
}

/**
 * Shows lecture overview with all items
 * @param {string} currentModuleId - Module ID
 * @param {string} currentLectureId - Lecture ID
 * @param {Object} APP_CONTENT - Content object
 * @param {Array} MODULES - Module metadata
 * @param {Object} lectureState - Lecture state
 * @param {Object} elements - DOM elements
 * @param {Function} updateURL - URL update function
 * @param {Function} startLectureAtIndex - Function to start at specific index
 */
function showLectureOverview(
  currentModuleId,
  currentLectureId,
  APP_CONTENT,
  MODULES,
  lectureState,
  elements,
  updateURL,
  startLectureAtIndex
) {
  const overviewContent = document.getElementById('lecture-overview-content');
  const overviewTitle = document.getElementById('lecture-overview-title');
  const overviewDescription = document.getElementById(
    'lecture-overview-description'
  );

  overviewContent.innerHTML = '';

  // Clear any existing description container and sources container
  const existingDesc = overviewDescription.parentNode.querySelector('.prose');
  if (existingDesc && existingDesc !== overviewDescription) {
    existingDesc.remove();
  }
  const existingSources = document.getElementById('lecture-overview-sources');
  if (existingSources) {
    existingSources.remove();
  }

  // Set title and description
  const lecture = APP_CONTENT[currentModuleId]?.lectures[currentLectureId];
  const moduleData = MODULES.find((m) => m.id === currentModuleId);
  overviewTitle.textContent = lecture?.topic || 'Vorlesungsübersicht';

  // Show lecture description if available
  if (lecture?.descriptionHtml) {
    const descContainer = document.createElement('div');
    descContainer.className = 'prose dark:prose-invert mb-6 text-base';
    descContainer.innerHTML = lecture.descriptionHtml;
    overviewDescription.parentNode.insertBefore(
      descContainer,
      overviewDescription.nextSibling
    );
  }

  // Show source links if available
  if (lecture?.sources && lecture.sources.length > 0) {
    const sourcesContainer = document.createElement('div');
    sourcesContainer.id = 'lecture-overview-sources';
    sourcesContainer.className =
      'mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700';

    const sourceLinks = lecture.sources
      .filter((s) => s.url)
      .map((s) => {
        const icon = s.type === 'pdf' ? '📄' : s.type === 'video' ? '🎬' : '🔗';
        return `<a href="${
          s.url
        }" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm">
          <span>${icon}</span>
          <span class="font-medium">${s.title}</span>
          <span class="text-gray-400">${Icons.get(
            'externalLink',
            'w-3 h-3'
          )}</span>
        </a>`;
      })
      .join('');

    if (sourceLinks) {
      sourcesContainer.innerHTML = `
        <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">📚 Vorlesungsunterlagen</p>
        <div class="flex flex-wrap gap-2">
          ${sourceLinks}
        </div>
      `;

      // Insert after description
      const descContainer =
        overviewDescription.parentNode.querySelector('.prose');
      if (descContainer) {
        descContainer.parentNode.insertBefore(
          sourcesContainer,
          descContainer.nextSibling
        );
      } else {
        overviewDescription.parentNode.insertBefore(
          sourcesContainer,
          overviewDescription.nextSibling
        );
      }
    }
  }

  // Generate description based on content
  const totalItems = lectureState.currentItems.length;
  const contentCount = lectureState.currentItems.filter(
    (i) => i.type === 'learning-content'
  ).length;
  const questionCount = lectureState.currentItems.filter(
    (i) => i.type === 'self-assessment-mc'
  ).length;
  const videoCount = lectureState.currentItems.filter(
    (i) => i.type === 'youtube-video'
  ).length;
  const imageCount = lectureState.currentItems.filter(
    (i) => i.type === 'image'
  ).length;
  const diagramCount = lectureState.currentItems.filter(
    (i) => i.type === 'mermaid-diagram'
  ).length;
  const externalVideoCount = lectureState.currentItems.filter(
    (i) => i.type === 'external-video'
  ).length;

  const descParts = [];
  if (contentCount > 0)
    descParts.push(`${contentCount} Lerninhalt${contentCount > 1 ? 'e' : ''}`);
  if (questionCount > 0)
    descParts.push(
      `${questionCount} Selbsttest${questionCount > 1 ? 's' : ''}`
    );
  if (videoCount > 0)
    descParts.push(`${videoCount} Video${videoCount > 1 ? 's' : ''}`);
  if (imageCount > 0)
    descParts.push(`${imageCount} Bild${imageCount > 1 ? 'er' : ''}`);
  if (diagramCount > 0)
    descParts.push(`${diagramCount} Diagramm${diagramCount > 1 ? 'e' : ''}`);
  if (externalVideoCount > 0)
    descParts.push(
      `${externalVideoCount} Ext. Video${externalVideoCount > 1 ? 's' : ''}`
    );

  // Build description with estimated time if available
  let descriptionText = `${totalItems} Schritte insgesamt • ${descParts.join(
    ' • '
  )}`;
  if (lecture?.estimatedTime && lecture.estimatedTime > 0) {
    descriptionText = `⏱️ ca. ${lecture.estimatedTime} Min. • ${descriptionText}`;
  }
  overviewDescription.textContent = descriptionText;

  lectureState.currentItems.forEach((item, index) => {
    const card = document.createElement('div');
    card.className =
      'bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer';

    let typeLabel = '';
    let badgeClass = '';
    let preview = '';
    let description = '';

    switch (item.type) {
      case 'learning-content':
        typeLabel = 'Lerninhalt';
        badgeClass =
          'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
        // Extract first heading or paragraph as preview
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = item.html;
        const firstHeading = tempDiv.querySelector('h1, h2, h3, h4');
        const firstPara = tempDiv.querySelector('p');
        preview =
          firstHeading?.textContent || firstPara?.textContent || 'Textinhalt';
        break;
      case 'self-assessment-mc':
        typeLabel = 'Selbsttest';
        badgeClass =
          'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
        preview = item.question || 'Multiple-Choice Frage';
        break;
      case 'youtube-video':
        typeLabel = 'Video';
        badgeClass =
          'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
        preview = item.title || 'YouTube Video';
        break;
      case 'image':
        typeLabel = 'Bild';
        badgeClass =
          'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
        preview = item.title || item.alt || 'Bild';
        break;
      case 'mermaid-diagram':
        typeLabel = 'Diagramm';
        badgeClass =
          'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
        preview = item.title || 'Interaktives Diagramm';
        break;
      case 'external-video':
        typeLabel = 'Ext. Video';
        badgeClass =
          'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200';
        preview = item.title || 'Externes Video';
        break;
      case 'balance-equation':
        typeLabel = 'Chemie';
        badgeClass =
          'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200';
        preview = item.title || 'Gleichung ausgleichen';
        break;
      default:
        typeLabel = 'Unbekannt';
        badgeClass =
          'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
        preview = 'Unbekannter Inhaltstyp';
    }

    card.innerHTML = `
      <div class="flex items-start justify-between mb-3">
        <span class="text-xs font-semibold px-2 py-1 rounded-full ${badgeClass}">${typeLabel}</span>
        <span class="text-sm text-gray-500 dark:text-gray-400">Schritt ${
          index + 1
        }</span>
      </div>
      <h3 class="text-lg font-semibold mb-2">${preview}</h3>
      ${
        description
          ? `<p class="text-sm text-gray-600 dark:text-gray-400">${description}</p>`
          : ''
      }
    `;

    card.addEventListener('click', () => {
      startLectureAtIndex(index);
    });

    overviewContent.appendChild(card);
  });

  // Show overview, hide player
  elements.lectureListContainer.style.display = 'none';
  elements.lecturePlayer.style.display = 'none';
  document.getElementById('lecture-overview').style.display = 'flex';

  // Update URL for overview
  updateURL(
    `/module/${currentModuleId}/lecture/${currentLectureId}/overview`,
    lecture?.topic || 'Vorlesungsübersicht'
  );
}

// Expose functions to global scope
window.LectureModule = {
  startLecture,
  renderCurrentLectureItem,
  renderYouTubeVideo,
  renderImage,
  renderMermaidDiagram,
  renderSelfAssessment,
  renderExternalVideo,
  renderMath,
  updateLectureNav,
  showLectureOverview
};

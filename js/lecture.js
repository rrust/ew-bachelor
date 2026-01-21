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
 * @param {Function} renderSelfAssessmentMC - Self-assessment MC render function
 * @param {Function} renderYouTubeVideo - YouTube video render function
 * @param {Function} renderImage - Image render function
 * @param {Function} renderMermaidDiagram - Mermaid diagram render function
 * @param {Array} sources - Array of source objects from lecture.md
 * @param {string|null} itemAudioUrl - URL to audio file for current item
 */
function renderCurrentLectureItem(
  lectureState,
  updateLectureNav,
  renderSelfAssessmentMC,
  renderYouTubeVideo,
  renderImage,
  renderMermaidDiagram,
  sources = [],
  itemAudioUrl = null
) {
  const item = lectureState.currentItems[lectureState.currentIndex];
  const lectureItemDisplay = document.getElementById('lecture-item-display');
  lectureItemDisplay.innerHTML = ''; // Clear previous item

  // Add audio player if available for this item
  if (itemAudioUrl) {
    const audioPlayerHtml = renderItemAudioPlayer(itemAudioUrl);
    lectureItemDisplay.insertAdjacentHTML('beforeend', audioPlayerHtml);
  }

  // Get source footnote HTML (only for content types that support it)
  const footnoteHtml = renderSourceFootnotes(item, sources);

  switch (item.type) {
    case 'learning-content':
      lectureItemDisplay.insertAdjacentHTML(
        'beforeend',
        item.html + footnoteHtml
      );
      renderMath(lectureItemDisplay);
      renderMermaidInContent(lectureItemDisplay);
      break;
    case 'self-assessment-mc':
      renderSelfAssessmentMC(item, lectureItemDisplay);
      renderMath(lectureItemDisplay);
      // Add footnotes after self-assessment if present
      if (footnoteHtml) {
        lectureItemDisplay.insertAdjacentHTML('beforeend', footnoteHtml);
      }
      break;
    case 'self-assessment':
      renderSelfAssessmentChecklist(item, lectureItemDisplay);
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
    case 'fill-in-the-blank':
      renderFillInTheBlank(item, lectureItemDisplay);
      renderMath(lectureItemDisplay);
      if (footnoteHtml) {
        lectureItemDisplay.insertAdjacentHTML('beforeend', footnoteHtml);
      }
      break;
    case 'matching':
      renderMatching(item, lectureItemDisplay);
      renderMath(lectureItemDisplay);
      if (footnoteHtml) {
        lectureItemDisplay.insertAdjacentHTML('beforeend', footnoteHtml);
      }
      break;
    case 'ordering':
      renderOrdering(item, lectureItemDisplay);
      renderMath(lectureItemDisplay);
      if (footnoteHtml) {
        lectureItemDisplay.insertAdjacentHTML('beforeend', footnoteHtml);
      }
      break;
    case 'calculation':
      renderCalculation(item, lectureItemDisplay);
      renderMath(lectureItemDisplay);
      if (footnoteHtml) {
        lectureItemDisplay.insertAdjacentHTML('beforeend', footnoteHtml);
      }
      break;
    case 'practice-exercise':
      renderPracticeExercise(item, lectureItemDisplay);
      renderMath(lectureItemDisplay);
      if (footnoteHtml) {
        lectureItemDisplay.insertAdjacentHTML('beforeend', footnoteHtml);
      }
      break;
    default:
      lectureItemDisplay.innerHTML = `<p class="text-red-500">Unbekannter Inhaltstyp: ${item.type}</p>`;
  }

  updateLectureNav();
}

/**
 * Renders math formulas using KaTeX if available
 * Adds expand buttons for formulas that overflow their container
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

    // After rendering, check for overflow and add expand buttons
    // Use double RAF to ensure layout is complete
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        addFormulaExpandButtons(container);
      });
    });
  }
}

/**
 * Checks display formulas for overflow and adds expand buttons
 * @param {HTMLElement} container - Container with rendered KaTeX
 */
function addFormulaExpandButtons(container) {
  const displayFormulas = container.querySelectorAll('.katex-display');

  displayFormulas.forEach((formulaContainer) => {
    // Skip if already processed
    if (formulaContainer.dataset.expandProcessed) return;
    formulaContainer.dataset.expandProcessed = 'true';

    const katexEl = formulaContainer.querySelector('.katex');
    if (!katexEl) return;

    // Measure the natural width of the formula (scrollWidth gives full content width)
    const containerWidth = formulaContainer.clientWidth;
    const formulaWidth = katexEl.scrollWidth;

    // Formula overflows if its width exceeds container width
    const isOverflowing = formulaWidth > containerWidth + 5;

    if (isOverflowing) {
      // First add the class to clip the overflow
      formulaContainer.classList.add('formula-overflow');

      // Create expand button (icon only)
      const expandBtn = document.createElement('button');
      expandBtn.className = 'formula-expand-btn';
      expandBtn.innerHTML = '⤢';
      expandBtn.title = 'Formel vergrößern';

      // Store the original unclipped HTML for fullscreen
      const originalHtml = formulaContainer.innerHTML;

      expandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openExpandedFormula(originalHtml);
      });

      formulaContainer.appendChild(expandBtn);
    }
  });
}

/**
 * Opens a formula in fullscreen/expanded mode
 * @param {string} renderedHtml - Already rendered KaTeX HTML
 */
function openExpandedFormula(renderedHtml) {
  const overlay = document.createElement('div');
  overlay.className = 'expanded-overlay';
  overlay.innerHTML = `
    <div class="expanded-content formula-expanded">
      <button class="close-expanded-btn">✕ Schließen</button>
      <div class="formula-fullscreen-container">
        ${renderedHtml}
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Remove overflow class in fullscreen
  const formulaDisplay = overlay.querySelector('.katex-display');
  if (formulaDisplay) {
    formulaDisplay.classList.remove('formula-overflow');
    // Remove the expand button in fullscreen view
    const expandBtn = formulaDisplay.querySelector('.formula-expand-btn');
    if (expandBtn) expandBtn.remove();
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

  // Additional content is already parsed to HTML by bundle-loader
  let additionalContent = '';
  if (item.html && item.html.trim()) {
    additionalContent = `<div class="prose dark:prose-invert max-w-none mt-4">${item.html}</div>`;
  }

  container.innerHTML = `
    <div class="mermaid-container">
      ${title}
      <button class="expand-btn" title="Vergrößern" aria-label="Diagramm vergrößern">
        ${Icons.get('expand', 'w-5 h-5')}
      </button>
      <div class="flex justify-center p-4 bg-white dark:bg-gray-800 rounded-lg overflow-x-auto">
        <div id="${diagramId}" class="mermaid-diagram"></div>
      </div>
      ${additionalContent}
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

    // Render math in additional content
    if (additionalContent) {
      renderMath(container);
    }

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
 * Renders a self-assessment checklist (non-quiz)
 * @param {Object} item - Item with question, checkpoints, successMessage, reviewHint
 * @param {HTMLElement} container - Container element
 */
function renderSelfAssessmentChecklist(item, container) {
  const checkpoints = item.checkpoints || [];
  const question = item.question || 'Selbsteinschätzung';
  const successMessage =
    item.successMessage || 'Sehr gut! Du hast alle Punkte abgehakt.';
  const reviewHint =
    item.reviewHint ||
    'Falls du unsicher bist, geh den Inhalt noch einmal durch.';

  let content = `<div class="p-4 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
          <p class="font-semibold mb-4">${question}</p>
          <div class="space-y-2">`;

  checkpoints.forEach((checkpoint, index) => {
    content += `<label class="flex items-start gap-3 p-3 border dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
              <input type="checkbox" class="self-assessment-checkbox mt-1" data-index="${index}">
              <span>${checkpoint}</span>
          </label>`;
  });

  content += `</div>
          <div class="feedback mt-4 p-3 rounded-md" style="display:none;"></div>
      </div>`;

  container.innerHTML = content;

  // Update feedback when checkboxes change
  const checkboxes = container.querySelectorAll('.self-assessment-checkbox');
  const feedbackDiv = container.querySelector('.feedback');

  const updateFeedback = () => {
    const checked = container.querySelectorAll(
      '.self-assessment-checkbox:checked'
    ).length;
    const total = checkpoints.length;

    if (checked === total) {
      feedbackDiv.className =
        'feedback mt-4 p-3 rounded-md bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500';
      feedbackDiv.innerHTML = `<p class="text-green-700 dark:text-green-300">${successMessage}</p>`;
      feedbackDiv.style.display = 'block';
    } else if (checked > 0) {
      feedbackDiv.className =
        'feedback mt-4 p-3 rounded-md bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500';
      feedbackDiv.innerHTML = `<p class="text-yellow-700 dark:text-yellow-300">${checked} von ${total} Punkten abgehakt. ${reviewHint}</p>`;
      feedbackDiv.style.display = 'block';
    } else {
      feedbackDiv.style.display = 'none';
    }
  };

  checkboxes.forEach((cb) => cb.addEventListener('change', updateFeedback));
}

/**
 * Simple inline markdown for bold/italic (avoids full marked.parse for short strings)
 * @param {string} text - Text with potential markdown
 * @returns {string} HTML with basic formatting
 */
function parseInlineMarkdown(text) {
  if (!text) return '';
  // Bold: **text** or __text__
  let result = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/__(.+?)__/g, '<strong>$1</strong>');
  // Italic: *text* or _text_
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');
  result = result.replace(/_(.+?)_/g, '<em>$1</em>');
  // Code: `text`
  result = result.replace(
    /`(.+?)`/g,
    '<code class="bg-gray-200 dark:bg-gray-600 px-1 rounded">$1</code>'
  );
  return result;
}

/**
 * Renders a self-assessment multiple choice question
 * @param {Object} item - Question item with question, options, correctAnswer, explanation
 * @param {HTMLElement} container - Container element
 */
function renderSelfAssessmentMC(item, container) {
  // Parse question for inline markdown
  const parsedQuestion = parseInlineMarkdown(item.question);

  let content = `<div class="p-4 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
          <p class="font-semibold mb-4 self-assessment-question">${parsedQuestion}</p>
          <div class="space-y-2 self-assessment-options">`;

  item.options.forEach((option, index) => {
    const parsedOption = parseInlineMarkdown(option);
    content += `<label class="block p-3 border dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
              <input type="radio" name="self-assessment-option" value="${option}" class="mr-2">
              <span>${parsedOption}</span>
          </label>`;
  });

  content += `</div>
          <div class="mt-4 flex gap-2">
            <button class="check-answer-btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors">Antwort prüfen</button>
            <button class="reset-answer-btn bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-md transition-colors" style="display:none;">Nochmal versuchen</button>
          </div>
          <div class="explanation mt-3 p-3 border-l-4 border-yellow-400 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/30" style="display:none;"></div>
      </div>`;

  container.innerHTML = content;

  const checkBtn = container.querySelector('.check-answer-btn');
  const resetBtn = container.querySelector('.reset-answer-btn');
  const explanationDiv = container.querySelector('.explanation');
  const optionsDiv = container.querySelector('.self-assessment-options');

  checkBtn.addEventListener('click', () => {
    const selected = container.querySelector(
      'input[name="self-assessment-option"]:checked'
    );
    if (!selected) {
      alert('Bitte wähle eine Antwort.');
      return;
    }
    const isCorrect = selected.value === item.correctAnswer;

    // Parse explanation with marked if available, otherwise use inline parser
    let explanationHtml = '';
    if (item.explanation) {
      explanationHtml =
        typeof marked !== 'undefined' && marked.parse
          ? marked.parse(item.explanation)
          : parseInlineMarkdown(item.explanation);
    }

    explanationDiv.innerHTML =
      (isCorrect
        ? '<p class="font-bold text-green-700 dark:text-green-400">Richtig!</p>'
        : '<p class="font-bold text-red-700 dark:text-red-400">Leider falsch.</p>') +
      `<div class="explanation-content mt-2">${explanationHtml}</div>`;
    explanationDiv.style.display = 'block';

    // Show reset button, hide check button
    checkBtn.style.display = 'none';
    resetBtn.style.display = 'inline-block';

    // Disable all radio buttons
    optionsDiv.querySelectorAll('input[type="radio"]').forEach((radio) => {
      radio.disabled = true;
    });

    // Highlight correct/incorrect
    optionsDiv.querySelectorAll('label').forEach((label) => {
      const radio = label.querySelector('input');
      if (radio.value === item.correctAnswer) {
        label.classList.add(
          'bg-green-100',
          'dark:bg-green-900',
          'border-green-500'
        );
      } else if (radio.checked) {
        label.classList.add('bg-red-100', 'dark:bg-red-900', 'border-red-500');
      }
    });
  });

  resetBtn.addEventListener('click', () => {
    // Reset all radio buttons
    optionsDiv.querySelectorAll('input[type="radio"]').forEach((radio) => {
      radio.checked = false;
      radio.disabled = false;
    });

    // Remove highlight classes
    optionsDiv.querySelectorAll('label').forEach((label) => {
      label.classList.remove(
        'bg-green-100',
        'dark:bg-green-900',
        'border-green-500',
        'bg-red-100',
        'dark:bg-red-900',
        'border-red-500'
      );
    });

    // Hide explanation, show check button
    explanationDiv.style.display = 'none';
    checkBtn.style.display = 'inline-block';
    resetBtn.style.display = 'none';
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
  const checklistCount = lectureState.currentItems.filter(
    (i) => i.type === 'self-assessment'
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
  const interactiveCount = lectureState.currentItems.filter((i) =>
    [
      'fill-in-the-blank',
      'matching',
      'ordering',
      'calculation',
      'practice-exercise'
    ].includes(i.type)
  ).length;

  const descParts = [];
  if (contentCount > 0)
    descParts.push(`${contentCount} Lerninhalt${contentCount > 1 ? 'e' : ''}`);
  if (questionCount > 0)
    descParts.push(
      `${questionCount} Selbsttest${questionCount > 1 ? 's' : ''}`
    );
  if (checklistCount > 0)
    descParts.push(
      `${checklistCount} Checkliste${checklistCount > 1 ? 'n' : ''}`
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
  if (interactiveCount > 0)
    descParts.push(
      `${interactiveCount} Übung${interactiveCount > 1 ? 'en' : ''}`
    );

  // Build description with estimated time and version if available
  let descriptionText = `${totalItems} Schritte insgesamt • ${descParts.join(
    ' • '
  )}`;
  if (lecture?.estimatedTime && lecture.estimatedTime > 0) {
    descriptionText = `⏱️ ca. ${lecture.estimatedTime} Min. • ${descriptionText}`;
  }
  if (lecture?.version) {
    descriptionText = `${descriptionText} • v${lecture.version}`;
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
      case 'self-assessment':
        typeLabel = 'Selbsteinschätzung';
        badgeClass =
          'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200';
        preview = item.question || 'Checkliste';
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
      case 'fill-in-the-blank':
        typeLabel = 'Lückentext';
        badgeClass =
          'bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200';
        preview = item.question || 'Lückentext ausfüllen';
        break;
      case 'matching':
        typeLabel = 'Zuordnung';
        badgeClass =
          'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200';
        preview = item.question || 'Zuordnungsaufgabe';
        break;
      case 'ordering':
        typeLabel = 'Sortierung';
        badgeClass =
          'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200';
        preview = item.question || 'Reihenfolge ordnen';
        break;
      case 'calculation':
        typeLabel = 'Berechnung';
        badgeClass =
          'bg-lime-100 dark:bg-lime-900 text-lime-800 dark:text-lime-200';
        preview = item.question || 'Berechnungsaufgabe';
        break;
      case 'practice-exercise':
        typeLabel = 'Praxis';
        badgeClass =
          'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200';
        preview = item.title || 'Praxis-Übung';
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

/**
 * Renders an audio player for a lecture item
 * @param {string} audioUrl - URL to the audio file
 * @returns {string} HTML string for the audio player
 */
function renderItemAudioPlayer(audioUrl) {
  return `
    <div class="item-audio-player mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 rounded-xl border border-blue-100 dark:border-gray-700">
      <div class="flex items-center gap-3 mb-3">
        <span class="text-2xl">🎧</span>
        <span class="font-medium text-gray-700 dark:text-gray-300">Anhören</span>
      </div>
      <audio controls class="w-full" preload="metadata">
        <source src="${audioUrl}" type="audio/mpeg">
        Dein Browser unterstützt kein Audio-Element.
      </audio>
    </div>
  `;
}

// Expose functions to global scope
window.LectureModule = {
  startLecture,
  renderCurrentLectureItem,
  renderYouTubeVideo,
  renderImage,
  renderMermaidDiagram,
  renderSelfAssessmentMC,
  renderSelfAssessmentChecklist,
  renderExternalVideo,
  renderFillInTheBlank,
  renderMatching,
  renderOrdering,
  renderCalculation,
  renderPracticeExercise,
  renderMath,
  updateLectureNav,
  showLectureOverview
};

/**
 * Renders a fill-in-the-blank exercise
 * @param {Object} item - Item with question, text, blanks array
 * @param {HTMLElement} container - Container element
 */
function renderFillInTheBlank(item, container) {
  const question = item.question || 'Fülle die Lücken aus:';

  // Replace {{blankId}} placeholders with input fields
  let textHtml = item.text || '';
  const blanks = item.blanks || [];

  blanks.forEach((blank, index) => {
    // Use blank.id if available, otherwise fall back to using answer as the placeholder
    const blankId = blank.id || blank.answer;
    const placeholder = `{{${blankId}}}`;
    const inputHtml = `<input type="text" 
      class="fill-blank-input inline-block w-24 md:w-32 px-2 py-1 mx-1 border-b-2 border-gray-400 dark:border-gray-500 bg-transparent text-center focus:border-blue-500 focus:outline-none"
      data-blank-id="${blankId}"
      data-correct="${blank.answer}"
      data-alternatives='${JSON.stringify(blank.alternatives || [])}'
      placeholder="..."
      autocomplete="off">`;
    textHtml = textHtml.replace(placeholder, inputHtml);
  });

  // Build hints HTML
  let hintsHtml = '';
  const hintsWithContent = blanks.filter((b) => b.hint);
  if (hintsWithContent.length > 0) {
    hintsHtml = `
      <details class="mt-4">
        <summary class="cursor-pointer text-blue-500 hover:text-blue-600 dark:text-blue-400 font-medium">
          💡 Hinweise anzeigen
        </summary>
        <ul class="mt-2 ml-4 list-disc text-gray-600 dark:text-gray-400 space-y-1">
          ${hintsWithContent
            .map(
              (b) =>
                `<li><strong>Lücke ${blanks.indexOf(b) + 1}:</strong> ${
                  b.hint
                }</li>`
            )
            .join('')}
        </ul>
      </details>`;
  }

  container.innerHTML = `
    <div class="fill-blank-container p-4 md:p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h3 class="text-xl font-bold mb-4">${question}</h3>
      <p class="text-lg leading-relaxed mb-4">${textHtml}</p>
      ${hintsHtml}
      <div class="flex justify-center gap-4 mt-6">
        <button class="check-blanks-btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
          Prüfen
        </button>
        <button class="reset-blanks-btn bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Zurücksetzen
        </button>
      </div>
      <div class="blanks-feedback mt-4 p-4 rounded-lg hidden"></div>
    </div>
  `;

  // Add event listeners
  const checkBtn = container.querySelector('.check-blanks-btn');
  const resetBtn = container.querySelector('.reset-blanks-btn');
  const feedbackDiv = container.querySelector('.blanks-feedback');
  const inputs = container.querySelectorAll('.fill-blank-input');

  checkBtn.addEventListener('click', () => {
    let allCorrect = true;
    let allFilled = true;

    inputs.forEach((input) => {
      const userValue = input.value.trim().toLowerCase();
      const correctValue = input.dataset.correct.toLowerCase();
      const alternatives = JSON.parse(input.dataset.alternatives || '[]').map(
        (a) => a.toLowerCase()
      );

      if (!userValue) {
        allFilled = false;
        input.classList.remove('border-green-500', 'border-red-500');
        input.classList.add('border-yellow-500');
      } else if (
        userValue === correctValue ||
        alternatives.includes(userValue)
      ) {
        input.classList.remove(
          'border-gray-400',
          'dark:border-gray-500',
          'border-red-500',
          'border-yellow-500'
        );
        input.classList.add('border-green-500');
      } else {
        allCorrect = false;
        input.classList.remove(
          'border-gray-400',
          'dark:border-gray-500',
          'border-green-500',
          'border-yellow-500'
        );
        input.classList.add('border-red-500');
      }
    });

    feedbackDiv.classList.remove('hidden');
    if (!allFilled) {
      feedbackDiv.className =
        'blanks-feedback mt-4 p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      feedbackDiv.innerHTML = '⚠️ Bitte fülle alle Lücken aus.';
    } else if (allCorrect) {
      feedbackDiv.className =
        'blanks-feedback mt-4 p-4 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      feedbackDiv.innerHTML =
        '✅ Perfekt! Alle Lücken sind korrekt ausgefüllt.';
    } else {
      feedbackDiv.className =
        'blanks-feedback mt-4 p-4 rounded-lg bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      feedbackDiv.innerHTML =
        '❌ Einige Antworten sind noch nicht richtig. Versuche es nochmal!';
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
      input.classList.add('border-gray-400', 'dark:border-gray-500');
    });
    feedbackDiv.classList.add('hidden');
  });
}

/**
 * Renders a matching exercise (drag & drop or click-to-match)
 * @param {Object} item - Item with question, pairs array [{term, match}] or [{left, right}]
 * @param {HTMLElement} container - Container element
 */
function renderMatching(item, container) {
  const question = item.question || 'Ordne die Begriffe richtig zu:';
  const rawPairs = item.pairs || [];

  // Normalize pairs to support both {term, match} and {left, right} formats
  const pairs = rawPairs.map((p) => ({
    term: p.term || p.left || '',
    match: p.match || p.right || ''
  }));

  // Shuffle the matches for display
  const shuffledMatches = [...pairs].sort(() => Math.random() - 0.5);

  container.innerHTML = `
    <div class="matching-container p-4 md:p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h3 class="text-xl font-bold mb-4">${question}</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Klicke auf einen Begriff links und dann auf die passende Definition rechts.</p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Terms (left) -->
        <div class="terms-column space-y-2">
          <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">Begriffe</h4>
          ${pairs
            .map(
              (p, i) => `
            <button class="term-btn w-full text-left p-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-500 transition-colors"
                    data-term-index="${i}"
                    data-correct-match="${i}">
              ${p.term}
            </button>
          `
            )
            .join('')}
        </div>
        
        <!-- Matches (right) -->
        <div class="matches-column space-y-2">
          <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">Definitionen</h4>
          ${shuffledMatches
            .map(
              (p, i) => `
            <button class="match-btn w-full text-left p-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-500 transition-colors"
                    data-match-index="${pairs.indexOf(p)}">
              ${p.match}
            </button>
          `
            )
            .join('')}
        </div>
      </div>
      
      <div class="flex justify-center gap-4 mt-6">
        <button class="check-matching-btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
          Prüfen
        </button>
        <button class="reset-matching-btn bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Zurücksetzen
        </button>
      </div>
      <div class="matching-feedback mt-4 p-4 rounded-lg hidden"></div>
    </div>
  `;

  // State for matching
  let selectedTerm = null;
  const userMatches = {}; // termIndex -> matchIndex

  const termBtns = container.querySelectorAll('.term-btn');
  const matchBtns = container.querySelectorAll('.match-btn');
  const checkBtn = container.querySelector('.check-matching-btn');
  const resetBtn = container.querySelector('.reset-matching-btn');
  const feedbackDiv = container.querySelector('.matching-feedback');

  termBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Deselect previous
      termBtns.forEach((b) => b.classList.remove('ring-2', 'ring-blue-500'));
      // Select this term
      btn.classList.add('ring-2', 'ring-blue-500');
      selectedTerm = parseInt(btn.dataset.termIndex);
    });
  });

  matchBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (selectedTerm === null) return;

      // Store the match
      userMatches[selectedTerm] = parseInt(btn.dataset.matchIndex);

      // Visual feedback - connect them
      const termBtn = container.querySelector(
        `[data-term-index="${selectedTerm}"]`
      );
      termBtn.classList.remove('ring-2', 'ring-blue-500');
      termBtn.classList.add('bg-blue-100', 'dark:bg-blue-900');
      btn.classList.add('bg-blue-100', 'dark:bg-blue-900');

      selectedTerm = null;
    });
  });

  checkBtn.addEventListener('click', () => {
    let correct = 0;
    const total = pairs.length;

    termBtns.forEach((btn) => {
      const termIndex = parseInt(btn.dataset.termIndex);
      const correctMatch = parseInt(btn.dataset.correctMatch);
      const userMatch = userMatches[termIndex];

      btn.classList.remove(
        'bg-blue-100',
        'dark:bg-blue-900',
        'bg-green-100',
        'dark:bg-green-900',
        'bg-red-100',
        'dark:bg-red-900'
      );

      if (userMatch === correctMatch) {
        btn.classList.add(
          'bg-green-100',
          'dark:bg-green-900',
          'border-green-500'
        );
        correct++;
      } else if (userMatch !== undefined) {
        btn.classList.add('bg-red-100', 'dark:bg-red-900', 'border-red-500');
      }
    });

    matchBtns.forEach((btn) => {
      btn.classList.remove('bg-blue-100', 'dark:bg-blue-900');
    });

    feedbackDiv.classList.remove('hidden');
    if (correct === total) {
      feedbackDiv.className =
        'matching-feedback mt-4 p-4 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      feedbackDiv.innerHTML = `✅ Perfekt! Alle ${total} Zuordnungen sind korrekt!`;
    } else {
      feedbackDiv.className =
        'matching-feedback mt-4 p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      feedbackDiv.innerHTML = `${correct}/${total} richtig. Versuche es nochmal!`;
    }
  });

  resetBtn.addEventListener('click', () => {
    Object.keys(userMatches).forEach((k) => delete userMatches[k]);
    selectedTerm = null;

    termBtns.forEach((btn) => {
      btn.classList.remove(
        'ring-2',
        'ring-blue-500',
        'bg-blue-100',
        'dark:bg-blue-900',
        'bg-green-100',
        'dark:bg-green-900',
        'bg-red-100',
        'dark:bg-red-900',
        'border-green-500',
        'border-red-500'
      );
    });
    matchBtns.forEach((btn) => {
      btn.classList.remove('bg-blue-100', 'dark:bg-blue-900');
    });
    feedbackDiv.classList.add('hidden');
  });
}

/**
 * Renders an ordering exercise (drag to reorder)
 * @param {Object} item - Item with question, items array (in correct order)
 * @param {HTMLElement} container - Container element
 */
function renderOrdering(item, container) {
  const question =
    item.question || 'Bringe die Elemente in die richtige Reihenfolge:';
  const items = item.items || [];
  const explanation = item.explanation || '';

  // Shuffle items for initial display
  const shuffledItems = items.map((text, correctIndex) => ({
    text,
    correctIndex
  }));
  shuffledItems.sort(() => Math.random() - 0.5);

  container.innerHTML = `
    <div class="ordering-container p-4 md:p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h3 class="text-xl font-bold mb-4">${question}</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Klicke auf die Pfeile, um die Reihenfolge zu ändern.</p>
      
      <div class="ordering-list space-y-2" id="ordering-list-${Date.now()}">
        ${shuffledItems
          .map(
            (item, i) => `
          <div class="ordering-item flex items-center gap-2 p-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
               data-correct-index="${item.correctIndex}"
               data-current-index="${i}">
            <div class="flex flex-col gap-1">
              <button class="move-up-btn text-gray-500 hover:text-blue-500 disabled:opacity-30" ${
                i === 0 ? 'disabled' : ''
              }>▲</button>
              <button class="move-down-btn text-gray-500 hover:text-blue-500 disabled:opacity-30" ${
                i === shuffledItems.length - 1 ? 'disabled' : ''
              }>▼</button>
            </div>
            <span class="ordering-number w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-full font-bold">${
              i + 1
            }</span>
            <span class="flex-1">${item.text}</span>
          </div>
        `
          )
          .join('')}
      </div>
      
      <div class="flex justify-center gap-4 mt-6">
        <button class="check-ordering-btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
          Prüfen
        </button>
        <button class="shuffle-ordering-btn bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Neu mischen
        </button>
      </div>
      <div class="ordering-feedback mt-4 p-4 rounded-lg hidden"></div>
    </div>
  `;

  const listContainer = container.querySelector('.ordering-list');
  const checkBtn = container.querySelector('.check-ordering-btn');
  const shuffleBtn = container.querySelector('.shuffle-ordering-btn');
  const feedbackDiv = container.querySelector('.ordering-feedback');

  function updateOrderingUI() {
    const orderItems = listContainer.querySelectorAll('.ordering-item');
    orderItems.forEach((el, i) => {
      el.dataset.currentIndex = i;
      el.querySelector('.ordering-number').textContent = i + 1;
      el.querySelector('.move-up-btn').disabled = i === 0;
      el.querySelector('.move-down-btn').disabled = i === orderItems.length - 1;
    });
  }

  listContainer.addEventListener('click', (e) => {
    const moveUp = e.target.closest('.move-up-btn');
    const moveDown = e.target.closest('.move-down-btn');

    if (moveUp && !moveUp.disabled) {
      const item = moveUp.closest('.ordering-item');
      const prev = item.previousElementSibling;
      if (prev) {
        listContainer.insertBefore(item, prev);
        updateOrderingUI();
      }
    }

    if (moveDown && !moveDown.disabled) {
      const item = moveDown.closest('.ordering-item');
      const next = item.nextElementSibling;
      if (next) {
        listContainer.insertBefore(next, item);
        updateOrderingUI();
      }
    }
  });

  checkBtn.addEventListener('click', () => {
    const orderItems = listContainer.querySelectorAll('.ordering-item');
    let allCorrect = true;

    orderItems.forEach((el, currentPosition) => {
      const correctPosition = parseInt(el.dataset.correctIndex);
      el.classList.remove('border-green-500', 'border-red-500');

      if (currentPosition === correctPosition) {
        el.classList.add('border-green-500');
      } else {
        el.classList.add('border-red-500');
        allCorrect = false;
      }
    });

    feedbackDiv.classList.remove('hidden');
    if (allCorrect) {
      feedbackDiv.className =
        'ordering-feedback mt-4 p-4 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      let feedbackHtml = '✅ Perfekt! Die Reihenfolge ist korrekt!';
      if (explanation) {
        feedbackHtml += `<p class="mt-2 text-sm">${explanation}</p>`;
      }
      feedbackDiv.innerHTML = feedbackHtml;
    } else {
      feedbackDiv.className =
        'ordering-feedback mt-4 p-4 rounded-lg bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      feedbackDiv.innerHTML =
        '❌ Die Reihenfolge ist noch nicht richtig. Versuche es nochmal!';
    }
  });

  shuffleBtn.addEventListener('click', () => {
    const orderItems = Array.from(
      listContainer.querySelectorAll('.ordering-item')
    );
    orderItems.sort(() => Math.random() - 0.5);
    orderItems.forEach((el) => {
      el.classList.remove('border-green-500', 'border-red-500');
      listContainer.appendChild(el);
    });
    updateOrderingUI();
    feedbackDiv.classList.add('hidden');
  });
}

/**
 * Renders a calculation exercise with input field
 * @param {Object} item - Item with question, formula, variables, correctAnswer, unit, tolerance, hints
 * @param {HTMLElement} container - Container element
 */
function renderCalculation(item, container) {
  const question = item.question || 'Berechne:';
  const formula = item.formula
    ? `<p class="text-lg font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded mb-4">$${item.formula}$</p>`
    : '';
  const unit = item.unit || '';
  const tolerance = item.tolerance || 0;
  const hints = item.hints || [];
  const explanation = item.explanation || '';

  // Build variables display
  let variablesHtml = '';
  if (item.variables && Object.keys(item.variables).length > 0) {
    variablesHtml = `
      <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
        <h4 class="font-semibold mb-2">Gegeben:</h4>
        <ul class="list-disc list-inside">
          ${Object.entries(item.variables)
            .map(([key, val]) => `<li><strong>${key}</strong> = ${val}</li>`)
            .join('')}
        </ul>
      </div>`;
  }

  // Build hints
  let hintsHtml = '';
  if (hints.length > 0) {
    hintsHtml = `
      <details class="mb-4">
        <summary class="cursor-pointer text-blue-500 hover:text-blue-600 dark:text-blue-400 font-medium">
          💡 Hinweise anzeigen (${hints.length})
        </summary>
        <ol class="mt-2 ml-6 list-decimal text-gray-600 dark:text-gray-400 space-y-1">
          ${hints.map((h) => `<li>${h}</li>`).join('')}
        </ol>
      </details>`;
  }

  container.innerHTML = `
    <div class="calculation-container p-4 md:p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h3 class="text-xl font-bold mb-4">${question}</h3>
      ${variablesHtml}
      ${formula}
      ${hintsHtml}
      
      <div class="flex items-center gap-2 mb-4">
        <label class="font-semibold">Antwort:</label>
        <input type="text" inputmode="decimal" pattern="[0-9]*[.,]?[0-9]*"
               class="calc-answer-input w-32 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none"
               placeholder="...">
        <span class="text-gray-600 dark:text-gray-400">${unit}</span>
      </div>
      
      <div class="flex justify-center gap-4">
        <button class="check-calc-btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
          Prüfen
        </button>
        <button class="show-solution-btn bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Lösung zeigen
        </button>
      </div>
      <div class="calc-feedback mt-4 p-4 rounded-lg hidden"></div>
    </div>
  `;

  const input = container.querySelector('.calc-answer-input');
  const checkBtn = container.querySelector('.check-calc-btn');
  const showSolutionBtn = container.querySelector('.show-solution-btn');
  const feedbackDiv = container.querySelector('.calc-feedback');

  checkBtn.addEventListener('click', () => {
    // Support both comma and dot as decimal separator
    const inputValue = input.value.replace(',', '.');
    const userValue = parseFloat(inputValue);
    const correctValue = item.correctAnswer;

    feedbackDiv.classList.remove('hidden');

    if (isNaN(userValue)) {
      feedbackDiv.className =
        'calc-feedback mt-4 p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      feedbackDiv.innerHTML = '⚠️ Bitte gib eine Zahl ein.';
      return;
    }

    const isCorrect = Math.abs(userValue - correctValue) <= tolerance;

    if (isCorrect) {
      input.classList.remove(
        'border-gray-300',
        'dark:border-gray-600',
        'border-red-500'
      );
      input.classList.add('border-green-500');
      feedbackDiv.className =
        'calc-feedback mt-4 p-4 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      let feedbackHtml = `✅ Richtig! Die Antwort ist ${correctValue} ${unit}.`;
      if (explanation) {
        feedbackHtml += `<p class="mt-2 text-sm">${explanation}</p>`;
      }
      feedbackDiv.innerHTML = feedbackHtml;
    } else {
      input.classList.remove(
        'border-gray-300',
        'dark:border-gray-600',
        'border-green-500'
      );
      input.classList.add('border-red-500');
      feedbackDiv.className =
        'calc-feedback mt-4 p-4 rounded-lg bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      feedbackDiv.innerHTML = `❌ Leider falsch. Deine Antwort: ${userValue} ${unit}. Versuche es nochmal!`;
    }
  });

  showSolutionBtn.addEventListener('click', () => {
    feedbackDiv.classList.remove('hidden');
    feedbackDiv.className =
      'calc-feedback mt-4 p-4 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
    let solutionHtml = `<strong>Lösung:</strong> ${item.correctAnswer} ${unit}`;
    if (explanation) {
      solutionHtml += `<p class="mt-2">${explanation}</p>`;
    }
    feedbackDiv.innerHTML = solutionHtml;
  });
}

/**
 * Renders a practice exercise with multiple tasks
 * @param {Object} item - Item with title, scenario, tasks array, realWorldConnection
 * @param {HTMLElement} container - Container element
 */
function renderPracticeExercise(item, container) {
  const title = item.title || 'Praxis-Übung';
  const scenario = item.scenario || '';
  const tasks = item.tasks || [];
  const realWorldConnection = item.realWorldConnection || '';
  const hint = item.hint || '';

  let tasksHtml = tasks
    .map((task, i) => {
      // Support both typed tasks (calculation, multiple-choice) and simple description/solution format
      if (task.type === 'calculation') {
        return `
        <div class="task-item p-4 bg-white dark:bg-gray-700 rounded-lg mb-3" data-task-index="${i}" data-task-type="calculation">
          <p class="font-medium mb-2">${i + 1}. ${task.question}</p>
          <div class="flex items-center gap-2">
            <input type="text" inputmode="decimal" pattern="[0-9]*[.,]?[0-9]*"
                   class="task-calc-input w-28 px-2 py-1 border-2 border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800 focus:border-blue-500 focus:outline-none"
                   data-correct="${task.correctAnswer}"
                   data-tolerance="${task.tolerance || 0}"
                   placeholder="...">
            <span class="text-gray-600 dark:text-gray-400">${
              task.unit || ''
            }</span>
            <span class="task-result ml-2"></span>
          </div>
        </div>`;
      } else if (task.type === 'multiple-choice') {
        return `
        <div class="task-item p-4 bg-white dark:bg-gray-700 rounded-lg mb-3" data-task-index="${i}" data-task-type="multiple-choice">
          <p class="font-medium mb-2">${i + 1}. ${task.question}</p>
          <div class="space-y-2">
            ${task.options
              .map(
                (opt, j) => `
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="task-${i}" value="${opt}" 
                       class="task-mc-input" data-correct="${task.correctAnswer}">
                <span>${opt}</span>
              </label>
            `
              )
              .join('')}
          </div>
          <span class="task-result mt-2 block"></span>
        </div>`;
      } else if (task.description && task.solution) {
        // Simple description/solution format - show as open-ended task with textarea
        return `
        <div class="task-item p-4 bg-white dark:bg-gray-700 rounded-lg mb-3" data-task-index="${i}" data-task-type="open-ended">
          <p class="font-medium mb-2">${i + 1}. ${task.description}</p>
          <textarea class="task-open-input w-full p-2 border-2 border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800 focus:border-blue-500 focus:outline-none resize-y min-h-[60px]" 
                    placeholder="Deine Antwort hier eingeben..."></textarea>
          <button class="show-single-solution-btn mt-2 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 underline">
            Lösung anzeigen
          </button>
          <div class="task-solution hidden mt-2 p-2 bg-green-50 dark:bg-green-900/30 rounded text-green-800 dark:text-green-200">
            <strong>Lösung:</strong> ${task.solution}
          </div>
        </div>`;
      }
      return '';
    })
    .join('');

  container.innerHTML = `
    <div class="practice-exercise-container p-4 md:p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h3 class="text-xl font-bold mb-2">💡 ${title}</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg italic">${scenario}</p>
      
      <div class="tasks-container">
        ${tasksHtml}
      </div>
      
      <div class="flex justify-center gap-4 mt-4">
        <button class="check-practice-btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
          Alle prüfen
        </button>
        <button class="show-practice-solutions-btn bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Lösungen zeigen
        </button>
      </div>
      
      <div class="practice-feedback mt-4 p-4 rounded-lg hidden"></div>
      ${
        realWorldConnection
          ? `<div class="real-world-connection mt-4 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-800 dark:text-green-200 hidden"><strong>🌍 Alltagsbezug:</strong> ${realWorldConnection}</div>`
          : ''
      }
    </div>
  `;

  const checkBtn = container.querySelector('.check-practice-btn');
  const showSolutionsBtn = container.querySelector(
    '.show-practice-solutions-btn'
  );
  const feedbackDiv = container.querySelector('.practice-feedback');
  const realWorldDiv = container.querySelector('.real-world-connection');

  checkBtn.addEventListener('click', () => {
    let correct = 0;
    let answered = 0;
    // Count only typed tasks (calculation, multiple-choice), not open-ended
    const typedTasks = tasks.filter(
      (t) => t.type === 'calculation' || t.type === 'multiple-choice'
    );
    const total = typedTasks.length;

    tasks.forEach((task, i) => {
      const taskEl = container.querySelector(`[data-task-index="${i}"]`);
      if (!taskEl) return;

      const taskType = taskEl.dataset.taskType;
      const resultSpan = taskEl.querySelector('.task-result');

      if (taskType === 'calculation') {
        const input = taskEl.querySelector('.task-calc-input');
        // Support comma as decimal separator
        const inputValue = input.value.replace(',', '.');
        const userValue = parseFloat(inputValue);
        const correctValue = parseFloat(input.dataset.correct);
        const tolerance = parseFloat(input.dataset.tolerance) || 0;

        if (!isNaN(userValue) && input.value.trim() !== '') {
          answered++;
          if (Math.abs(userValue - correctValue) <= tolerance) {
            if (resultSpan) resultSpan.innerHTML = '✅';
            input.classList.add('border-green-500');
            input.classList.remove('border-red-500');
            correct++;
          } else {
            if (resultSpan) resultSpan.innerHTML = '❌';
            input.classList.add('border-red-500');
            input.classList.remove('border-green-500');
          }
        }
      } else if (taskType === 'multiple-choice') {
        const selected = taskEl.querySelector('input[type="radio"]:checked');
        if (selected) {
          answered++;
          if (selected.value === selected.dataset.correct) {
            if (resultSpan) resultSpan.innerHTML = '✅';
            correct++;
          } else {
            if (resultSpan) resultSpan.innerHTML = '❌';
          }
        }
      }
      // open-ended tasks are handled by showSolutions only
    });

    feedbackDiv.classList.remove('hidden');

    // If all tasks are open-ended, show a different message
    if (total === 0) {
      feedbackDiv.className =
        'practice-feedback mt-4 p-4 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      feedbackDiv.innerHTML = `💡 Diese Übung enthält offene Aufgaben. Klicke auf "Lösungen zeigen" um deine Antworten zu überprüfen.`;
      return;
    }

    if (answered === 0) {
      feedbackDiv.className =
        'practice-feedback mt-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
      feedbackDiv.innerHTML = `⚠️ Bitte beantworte mindestens eine Aufgabe, bevor du prüfst.`;
    } else if (correct === total && answered === total) {
      feedbackDiv.className =
        'practice-feedback mt-4 p-4 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      feedbackDiv.innerHTML = `✅ Ausgezeichnet! Alle ${total} Aufgaben richtig!`;
      if (realWorldDiv) realWorldDiv.classList.remove('hidden');
    } else if (answered < total) {
      feedbackDiv.className =
        'practice-feedback mt-4 p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      feedbackDiv.innerHTML = `${correct}/${answered} beantwortet richtig. Noch ${
        total - answered
      } Aufgabe${total - answered > 1 ? 'n' : ''} offen.`;
    } else {
      feedbackDiv.className =
        'practice-feedback mt-4 p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      feedbackDiv.innerHTML = `${correct}/${total} richtig. Versuch's nochmal!`;
    }
  });

  showSolutionsBtn.addEventListener('click', () => {
    tasks.forEach((task, i) => {
      const taskEl = container.querySelector(`[data-task-index="${i}"]`);
      if (!taskEl) return;

      const taskType = taskEl.dataset.taskType;
      const resultSpan = taskEl.querySelector('.task-result');
      const solutionDiv = taskEl.querySelector('.task-solution');

      if (taskType === 'calculation' && resultSpan) {
        resultSpan.innerHTML = `<span class="text-blue-600 dark:text-blue-400 font-medium">${
          task.correctAnswer
        } ${task.unit || ''}</span>`;
      } else if (taskType === 'multiple-choice' && resultSpan) {
        resultSpan.innerHTML = `<span class="text-blue-600 dark:text-blue-400 font-medium">${task.correctAnswer}</span>`;
      } else if (taskType === 'open-ended' && solutionDiv) {
        // Show the solution for open-ended tasks
        solutionDiv.classList.remove('hidden');
        // Hide the individual show solution button
        const singleBtn = taskEl.querySelector('.show-single-solution-btn');
        if (singleBtn) singleBtn.classList.add('hidden');
      }
    });

    if (realWorldDiv) realWorldDiv.classList.remove('hidden');
  });

  // Add event listeners for individual "show solution" buttons
  container.querySelectorAll('.show-single-solution-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const taskItem = btn.closest('.task-item');
      const solutionDiv = taskItem.querySelector('.task-solution');
      if (solutionDiv) {
        solutionDiv.classList.remove('hidden');
        btn.classList.add('hidden');
      }
    });
  });
}

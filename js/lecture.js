// Lecture module - Handles lecture player and content rendering

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
  showView
) {
  const lecture = APP_CONTENT[moduleId]?.lectures[lectureId];

  if (!lecture || !lecture.items || lecture.items.length === 0) {
    alert('Diese Vorlesung hat keinen Inhalt.');
    return;
  }

  lectureState.currentItems = lecture.items;
  lectureState.currentIndex = 0;

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
    `/module/${moduleId}/lecture/${lectureId}/item/0`,
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
 */
function renderCurrentLectureItem(
  lectureState,
  updateLectureNav,
  renderSelfAssessment,
  renderYouTubeVideo,
  renderImage,
  renderMermaidDiagram
) {
  const item = lectureState.currentItems[lectureState.currentIndex];
  const lectureItemDisplay = document.getElementById('lecture-item-display');
  lectureItemDisplay.innerHTML = ''; // Clear previous item

  switch (item.type) {
    case 'learning-content':
      lectureItemDisplay.innerHTML = item.html;
      renderMath(lectureItemDisplay);
      break;
    case 'self-assessment-mc':
      renderSelfAssessment(item, lectureItemDisplay);
      renderMath(lectureItemDisplay);
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
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
        </svg>
      </a>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">
        Nach dem Ansehen hierher zurückkehren und fortfahren.
      </p>
    </div>
  `;
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
      <div class="flex justify-center p-4 bg-white dark:bg-gray-800 rounded-lg">
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
  } catch (error) {
    console.error('Error rendering Mermaid diagram:', error);
    container.innerHTML = `<p class="text-red-500">Fehler beim Rendern des Diagramms: ${error.message}</p>`;
  }
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

  // Clear any existing description container
  const existingDesc = overviewDescription.parentNode.querySelector('.prose');
  if (existingDesc && existingDesc !== overviewDescription) {
    existingDesc.remove();
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

  overviewDescription.textContent = `${totalItems} Schritte insgesamt • ${descParts.join(
    ' • '
  )}`;

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

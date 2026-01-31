// js/parser.js

/**
 * Splits a file content string that contains multiple YAML frontmatter-prefixed
 * documents (separated by `---`) into an array of individual documents.
 * @param {string} content The raw file content.
 * @returns {Array<{attributes: object, body: string}>} An array of parsed documents.
 */
function parseMultiDocument(content) {
  const documents = [];
  // The separator is a line that contains only '---'
  const parts = content.split(/^---$/m);

  // The first part is anything before the first '---'. It should be empty or whitespace.
  // If it has content, treat it as a document with no frontmatter.
  if (parts[0] && parts[0].trim()) {
    documents.push({ attributes: {}, body: parts[0] });
  }

  // Process the rest of the parts in pairs: a frontmatter part and a body part.
  for (let i = 1; i < parts.length; i += 2) {
    const frontmatterPart = parts[i];
    const bodyPart = i + 1 < parts.length ? parts[i + 1] : '';

    try {
      const attributes = jsyaml.load(frontmatterPart) || {};
      documents.push({ attributes, body: bodyPart });
    } catch (e) {
      console.error('Error parsing YAML frontmatter:', e);
      console.error('Problematic YAML content (first 500 chars):');
      console.error(frontmatterPart.substring(0, 500));
      console.error('---');
      console.error('Full YAML content:');
      console.error(frontmatterPart);
      // If YAML fails, the pairing is likely off. Treat the raw parts as bodies.
      documents.push({ attributes: {}, body: frontmatterPart });
      if (bodyPart) {
        documents.push({ attributes: {}, body: bodyPart });
      }
    }
  }
  // Filter out any completely empty documents that might result from trailing separators.
  return documents.filter(
    (d) =>
      (d.body && d.body.trim()) ||
      (d.attributes && Object.keys(d.attributes).length > 0)
  );
}

/**
 * Gets the content path for a specific study
 * @param {string} studyId - Study ID
 * @returns {string} Content base path
 */
function getStudyContentPath(studyId) {
  const basePath = getBasePath();
  return basePath === '/'
    ? `content/${studyId}/`
    : `${basePath}content/${studyId}/`;
}

/**
 * Loads studies metadata from studies.json
 * @returns {Promise<Array>} Array of study objects
 */
async function loadStudies() {
  try {
    const basePath = getBasePath();
    const studiesPath =
      basePath === '/'
        ? 'content/studies.json'
        : `${basePath}content/studies.json`;
    const response = await fetch(studiesPath);

    if (!response.ok) {
      throw new Error(
        `Failed to load studies: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error loading studies:', error);
    return [];
  }
}

/**
 * Loads module metadata from modules.json for a specific study
 * @param {string|null} studyId - Study ID (uses active study if not provided)
 * @returns {Promise<Array>} Array of module objects
 */
async function loadModules(studyId = null) {
  try {
    const basePath = getBasePath();
    const settings = window.getAppSettings ? window.getAppSettings() : {};
    const activeStudy = studyId || settings.activeStudyId;

    let modulesPath;
    if (activeStudy) {
      modulesPath =
        basePath === '/'
          ? `content/${activeStudy}/modules.json`
          : `${basePath}content/${activeStudy}/modules.json`;
    } else {
      // Fallback to legacy path for backward compatibility
      modulesPath =
        basePath === '/'
          ? 'content/modules.json'
          : `${basePath}content/modules.json`;
    }

    const response = await fetch(modulesPath);

    if (!response.ok) {
      throw new Error(
        `Failed to load modules: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error loading modules:', error);
    alert('Fehler beim Laden der Module. Bitte aktualisiere die Seite.');
    return [];
  }
}

/**
 * Parses achievement content from markdown with frontmatter
 * @param {string} content The raw achievement file content
 * @param {string} filePath The file path for debugging
 * @returns {object|null} Parsed achievement object or null
 */
function parseAchievement(content, filePath) {
  try {
    const documents = parseMultiDocument(content);
    if (documents.length === 0) return null;

    const doc = documents[0];
    const achievement = {
      id: doc.attributes.id,
      title: doc.attributes.title,
      description: doc.attributes.description,
      icon: doc.attributes.icon || '🏆',
      achievementType: doc.attributes.achievementType || 'cheatsheet', // 'cheatsheet' or 'blueprint'
      contentType: doc.attributes.contentType || 'markdown',
      unlockCondition: doc.attributes.unlockCondition || {},
      defaultDuration: doc.attributes.defaultDuration || 30,
      extensionDuration: doc.attributes.extensionDuration || 14,
      warningThreshold: doc.attributes.warningThreshold || 7,
      content: doc.body ? marked.parse(doc.body) : '',
      contentMarkdown: doc.body || ''
    };

    // Validate required fields
    if (
      !achievement.id ||
      !achievement.title ||
      !achievement.unlockCondition.type
    ) {
      console.error('Achievement missing required fields:', filePath);
      return null;
    }

    return achievement;
  } catch (error) {
    console.error('Error parsing achievement:', filePath, error);
    return null;
  }
}

/**
 * Gets the base path for the application, accounting for GitHub Pages subdirectory.
 * @returns {string} The base path (e.g., '' for root, '/ew-bachelor/' for GitHub Pages)
 */
function getBasePath() {
  // Get the path name and extract the base directory if present
  const path = window.location.pathname;
  const match = path.match(/^\/([^\/]+)\//);
  // If running on GitHub Pages (e.g., /ew-bachelor/), return that path
  // Otherwise return empty string for local/root deployment
  return match ? `/${match[1]}/` : '/';
}

/**
 * Fetches the list of content files and parses them into a structured object.
 * @param {string|null} studyId - Study ID (uses active study if not provided)
 * @returns {object} The structured content of the entire application.
 */
async function parseContent(studyId = null) {
  const content = {};

  try {
    const basePath = getBasePath();
    const settings = window.getAppSettings ? window.getAppSettings() : {};
    const activeStudy = studyId || settings.activeStudyId;
    const content = {};
    const achievements = {}; // New: Store achievements separately

    let contentListPath;
    if (activeStudy) {
      contentListPath =
        basePath === '/'
          ? `content/${activeStudy}/content-list.json`
          : `${basePath}content/${activeStudy}/content-list.json`;
    } else {
      // Fallback to legacy path for backward compatibility
      contentListPath =
        basePath === '/'
          ? 'content/content-list.json'
          : `${basePath}content/content-list.json`;
    }

    const response = await fetch(contentListPath);
    if (!response.ok) {
      throw new Error(
        `Failed to load content list: ${response.status} ${response.statusText}`
      );
    }

    const fileList = await response.json();
    const totalFiles = fileList.length;
    let loadedFiles = 0;

    for (const filePath of fileList) {
      try {
        // Update loading progress
        loadedFiles++;
        if (window.updateLoadingStatus) {
          const progress = 35 + Math.floor((loadedFiles / totalFiles) * 55);
          // Extract module name from path for status
          const pathParts = filePath.split('/');
          const modulePart = pathParts[2] || '';
          const moduleName = modulePart.replace(/^\d+-/, '').replace(/-/g, ' ');
          window.updateLoadingStatus(
            `Lade ${moduleName}... (${loadedFiles}/${totalFiles})`,
            progress
          );
        }

        const fullPath = basePath === '/' ? filePath : `${basePath}${filePath}`;
        const fileResponse = await fetch(fullPath);
        const fileContent = await fileResponse.text();

        // Extract module and lecture ID from file path
        // Support:
        // - lecture.md: Lecture metadata/description
        // - lecture-items/XX-name.md: Individual items (new format)
        // - achievements/XX-name.md: Achievement files (new)
        // - Old: lecture.md with multi-document items (legacy support)
        // Path structure: content/{studyId}/{moduleId}/{lectureId}/...
        const pathParts = filePath.split('/');

        // New structure: content/studyId/moduleId/lectureId/...
        // pathParts[0] = 'content', pathParts[1] = studyId, pathParts[2] = moduleId, etc.
        // We need at least 4 parts for the new structure
        if (pathParts.length < 4) continue;

        const moduleId = pathParts[2];
        const thirdPart = pathParts[3];

        // Check if this is an achievement file (content/studyId/module/achievements/file.md)
        const isAchievement =
          thirdPart === 'achievements' && pathParts.length >= 5;

        // For lecture content, we need at least 5 parts
        if (!isAchievement && pathParts.length < 5) continue;

        const lectureId = isAchievement ? null : pathParts[3];
        const fileName = isAchievement ? pathParts[4] : pathParts[4];
        const isLectureItems =
          !isAchievement &&
          fileName === 'lecture-items' &&
          pathParts.length >= 6;
        const isLectureMetadata =
          !isAchievement && fileName === 'lecture.md' && !isLectureItems;
        const isQuizMetadata =
          !isAchievement && fileName === 'quiz.md' && pathParts.length === 5;
        const isQuizQuestion =
          !isAchievement && fileName === 'questions' && pathParts.length >= 6;

        // Determine if this is a quiz file (legacy format - deprecated)
        const isQuiz =
          !isAchievement && fileName === 'quiz.md' && pathParts.length === 5;

        // Handle achievement files
        if (isAchievement) {
          const achievement = parseAchievement(fileContent, filePath);
          if (achievement) {
            // Store achievement with module association
            achievement.moduleId = moduleId;
            achievements[achievement.id] = achievement;
          }
          continue;
        }

        if (!content[moduleId]) {
          content[moduleId] = { lectures: {} };
        }
        if (!content[moduleId].lectures[lectureId]) {
          content[moduleId].lectures[lectureId] = {
            topic: '',
            description: '',
            descriptionHtml: '',
            estimatedTime: 0,
            quizDescription: '',
            quizDescriptionHtml: '',
            quizEstimatedTime: 0,
            items: [],
            quiz: []
          };
        }

        const documents = parseMultiDocument(fileContent);

        if (isQuizMetadata) {
          // This is quiz.md containing metadata/description for the quiz
          const doc = documents[0];
          if (doc && doc.attributes) {
            content[moduleId].lectures[lectureId].quizDescription =
              doc.attributes.description || '';
            content[moduleId].lectures[lectureId].quizDescriptionHtml = doc.body
              ? marked.parse(doc.body)
              : '';
            content[moduleId].lectures[lectureId].quizEstimatedTime =
              doc.attributes.estimatedTime || 0;
          }
        } else if (isQuizQuestion) {
          // This is a single quiz question file
          const questionFileName = pathParts[5];
          const doc = documents[0];

          if (doc) {
            const question = {
              ...doc.attributes,
              explanation: doc.body ? marked.parse(doc.body) : '',
              _order: parseInt(questionFileName.split('-')[0], 10) || 0
            };
            content[moduleId].lectures[lectureId].quiz.push(question);
          }
        } else if (isQuiz) {
          // Legacy format: quiz.md with multiple questions (deprecated but still supported)
          const quizQuestions = documents.map((doc) => ({
            ...doc.attributes,
            explanation: doc.body ? marked.parse(doc.body) : ''
          }));
          content[moduleId].lectures[lectureId].quiz.push(...quizQuestions);
        } else if (isLectureMetadata) {
          // This is lecture.md containing metadata/description
          // Check if it's actually metadata (no 'type' attribute) or old format (has 'type')
          const doc = documents[0];
          if (doc && doc.attributes && !doc.attributes.type) {
            // New format: metadata at top, possibly followed by items
            content[moduleId].lectures[lectureId].topic =
              doc.attributes.topic || '';
            content[moduleId].lectures[lectureId].description =
              doc.attributes.description || '';
            content[moduleId].lectures[lectureId].descriptionHtml = doc.body
              ? marked.parse(doc.body)
              : '';
            content[moduleId].lectures[lectureId].estimatedTime =
              doc.attributes.estimatedTime || 0;
            // Store sources for reference footnotes
            content[moduleId].lectures[lectureId].sources =
              doc.attributes.sources || [];

            // Process remaining documents as items (if any)
            const remainingDocs = documents.slice(1);
            if (remainingDocs.length > 0) {
              const lectureItems = remainingDocs.map((itemDoc) => {
                const item = {
                  type: itemDoc.attributes.type || 'learning-content',
                  ...itemDoc.attributes
                };

                // Parse body content based on type
                if (item.type === 'learning-content') {
                  item.html = marked.parse(itemDoc.body);
                } else if (item.type === 'self-assessment-mc') {
                  item.explanation = itemDoc.body
                    ? marked.parse(itemDoc.body)
                    : '';
                } else if (item.type === 'youtube-video') {
                  // URL and title are already in attributes
                } else if (item.type === 'image') {
                  // URL, alt, caption, and title are already in attributes
                } else if (item.type === 'mermaid-diagram') {
                  // Extract mermaid code from body
                  const mermaidMatch = itemDoc.body.match(
                    /```mermaid\n([\s\S]*?)\n```/
                  );
                  if (mermaidMatch) {
                    item.diagram = mermaidMatch[1].trim();
                  } else {
                    item.diagram = itemDoc.body.trim();
                  }
                }

                return item;
              });
              content[moduleId].lectures[lectureId].items.push(...lectureItems);
            }
          } else {
            // Old format: lecture.md with multiple items
            const lectureItems = documents.map((doc) => {
              const item = {
                type: doc.attributes.type || 'learning-content',
                ...doc.attributes
              };

              // Parse body content based on type
              if (item.type === 'learning-content') {
                item.html = marked.parse(doc.body);
              } else if (item.type === 'self-assessment-mc') {
                item.explanation = doc.body ? marked.parse(doc.body) : '';
              } else if (item.type === 'youtube-video') {
                // URL and title are already in attributes
              } else if (item.type === 'image') {
                // URL, alt, caption, and title are already in attributes
              } else if (item.type === 'mermaid-diagram') {
                // Extract mermaid code from body
                const mermaidMatch = doc.body.match(
                  /```mermaid\n([\s\S]*?)\n```/
                );
                if (mermaidMatch) {
                  item.diagram = mermaidMatch[1].trim();
                } else {
                  item.diagram = doc.body.trim();
                }
              }

              return item;
            });

            // Promote the topic from the first item to the lecture level
            if (lectureItems.length > 0 && lectureItems[0].topic) {
              content[moduleId].lectures[lectureId].topic =
                lectureItems[0].topic;
            }

            content[moduleId].lectures[lectureId].items.push(...lectureItems);
          }
        } else if (isLectureItems) {
          // This is a single lecture item file
          // File path: content/STUDY_ID/MODULE_ID/LECTURE_ID/lecture-items/XX-name.md
          const itemFileName = pathParts[5];
          const doc = documents[0]; // Should only be one document per file

          if (doc) {
            const item = {
              type: doc.attributes.type || 'learning-content',
              ...doc.attributes,
              _order: parseInt(itemFileName.split('-')[0], 10) || 0 // Extract order from filename
            };

            // Parse body content based on type
            if (item.type === 'learning-content') {
              item.html = marked.parse(doc.body);
            } else if (item.type === 'self-assessment-mc') {
              item.explanation = doc.body ? marked.parse(doc.body) : '';
            } else if (item.type === 'youtube-video') {
              // URL and title are already in attributes
            } else if (item.type === 'image') {
              // URL, alt, caption, and title are already in attributes
            } else if (item.type === 'mermaid-diagram') {
              // Extract mermaid code from body
              const mermaidMatch = doc.body.match(
                /```mermaid\n([\s\S]*?)\n```/
              );
              if (mermaidMatch) {
                item.diagram = mermaidMatch[1].trim();
              } else {
                item.diagram = doc.body.trim();
              }
            }

            content[moduleId].lectures[lectureId].items.push(item);
          }
        }
      } catch (error) {
        console.error('Error parsing file:', filePath, error);
      }
    }

    // Sort lecture items by _order field (for files from lecture-items/ folder)
    // Sort quiz questions by _order field (for files from questions/ folder)
    for (const moduleId in content) {
      for (const lectureId in content[moduleId].lectures) {
        const lecture = content[moduleId].lectures[lectureId];
        if (lecture.items.length > 0 && lecture.items[0]._order !== undefined) {
          lecture.items.sort((a, b) => (a._order || 0) - (b._order || 0));
        }
        // Sort quiz questions
        if (lecture.quiz.length > 0 && lecture.quiz[0]._order !== undefined) {
          lecture.quiz.sort((a, b) => (a._order || 0) - (b._order || 0));
        }
        // Promote topic from first item if not set
        if (
          !lecture.topic &&
          lecture.items.length > 0 &&
          lecture.items[0].topic
        ) {
          lecture.topic = lecture.items[0].topic;
        }
      }
    }

    console.log('Parsed Content:', content);
    console.log('Parsed Achievements:', achievements);
    return { content, achievements };
  } catch (error) {
    console.error('Critical error parsing content:', error);
    alert('Fehler beim Laden der Lerninhalte. Bitte aktualisiere die Seite.');
    return { content: {}, achievements: {} };
  }
}

// Expose functions to global scope for use in app.js
window.loadStudies = loadStudies;
window.loadModules = loadModules;
window.parseContent = parseContent;
window.getStudyContentPath = getStudyContentPath;
window.getBasePath = getBasePath;

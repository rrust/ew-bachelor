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
 * Loads module metadata from modules.json
 * @returns {Promise<Array>} Array of module objects
 */
async function loadModules() {
  const basePath = getBasePath();
  const modulesPath =
    basePath === '/'
      ? 'content/modules.json'
      : `${basePath}content/modules.json`;
  const response = await fetch(modulesPath);
  return await response.json();
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
 * @returns {object} The structured content of the entire application.
 */
async function parseContent() {
  const content = {};
  const basePath = getBasePath();
  const contentListPath =
    basePath === '/'
      ? 'content/content-list.json'
      : `${basePath}content/content-list.json`;
  const response = await fetch(contentListPath);
  const fileList = await response.json();

  for (const filePath of fileList) {
    try {
      const fullPath = basePath === '/' ? filePath : `${basePath}${filePath}`;
      const fileResponse = await fetch(fullPath);
      const fileContent = await fileResponse.text();

      // Extract module and lecture ID from file path
      // Support both:
      // - Old: content/MODULE_ID/LECTURE_ID/lecture.md (multi-document)
      // - New: content/MODULE_ID/LECTURE_ID/lecture-items/01-item.md (single document per file)
      const pathParts = filePath.split('/');
      if (pathParts.length < 4) continue;

      const moduleId = pathParts[1];
      const lectureId = pathParts[2];
      const fileName = pathParts[3];
      const isLectureItems =
        fileName === 'lecture-items' && pathParts.length >= 5;

      // Determine if this is a quiz file
      const isQuiz = fileName === 'quiz.md';

      if (!content[moduleId]) {
        content[moduleId] = { lectures: {} };
      }
      if (!content[moduleId].lectures[lectureId]) {
        content[moduleId].lectures[lectureId] = {
          topic: '',
          items: [],
          quiz: []
        };
      }

      const documents = parseMultiDocument(fileContent);

      if (isQuiz) {
        // This is a quiz file, parse questions for the final quiz
        const quizQuestions = documents.map((doc) => ({
          ...doc.attributes,
          explanation: doc.body ? marked.parse(doc.body) : ''
        }));
        content[moduleId].lectures[lectureId].quiz.push(...quizQuestions);
      } else if (isLectureItems) {
        // This is a single lecture item file
        // File path: content/MODULE_ID/LECTURE_ID/lecture-items/XX-name.md
        const itemFileName = pathParts[4];
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
            const mermaidMatch = doc.body.match(/```mermaid\n([\s\S]*?)\n```/);
            if (mermaidMatch) {
              item.diagram = mermaidMatch[1].trim();
            } else {
              item.diagram = doc.body.trim();
            }
          }

          content[moduleId].lectures[lectureId].items.push(item);
        }
      } else {
        // This is a lecture.md file with multiple items (old format)
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
            // No additional parsing needed
          } else if (item.type === 'image') {
            // URL, alt, caption, and title are already in attributes
            // No additional parsing needed
          } else if (item.type === 'mermaid-diagram') {
            // Extract mermaid code from body (between ```mermaid and ```)
            const mermaidMatch = doc.body.match(/```mermaid\n([\s\S]*?)\n```/);
            if (mermaidMatch) {
              item.diagram = mermaidMatch[1].trim();
            } else {
              // If no code block, use entire body
              item.diagram = doc.body.trim();
            }
          }

          return item;
        });

        // Promote the topic from the first item to the lecture level
        if (lectureItems.length > 0 && lectureItems[0].topic) {
          content[moduleId].lectures[lectureId].topic = lectureItems[0].topic;
        }

        content[moduleId].lectures[lectureId].items.push(...lectureItems);
      }
    } catch (error) {
      console.error('Error parsing file:', filePath, error);
    }
  }

  // Sort lecture items by _order field (for files from lecture-items/ folder)
  for (const moduleId in content) {
    for (const lectureId in content[moduleId].lectures) {
      const lecture = content[moduleId].lectures[lectureId];
      if (lecture.items.length > 0 && lecture.items[0]._order !== undefined) {
        lecture.items.sort((a, b) => (a._order || 0) - (b._order || 0));
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
  return content;
}

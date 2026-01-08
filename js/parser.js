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
        const bodyPart = (i + 1 < parts.length) ? parts[i + 1] : '';
        
        try {
            const attributes = jsyaml.load(frontmatterPart) || {};
            documents.push({ attributes, body: bodyPart });
        } catch (e) {
            console.error('Error parsing YAML frontmatter:', e);
            // If YAML fails, the pairing is likely off. Treat the raw parts as bodies.
            documents.push({ attributes: {}, body: frontmatterPart });
            if (bodyPart) {
                 documents.push({ attributes: {}, body: bodyPart });
            }
        }
    }
    // Filter out any completely empty documents that might result from trailing separators.
    return documents.filter(d => (d.body && d.body.trim()) || (d.attributes && Object.keys(d.attributes).length > 0));
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
    const contentListPath = basePath === '/' ? 'content/content-list.json' : `${basePath}content/content-list.json`;
    const response = await fetch(contentListPath);
    const fileList = await response.json();

    for (const filePath of fileList) {
        try {
            const fullPath = basePath === '/' ? filePath : `${basePath}${filePath}`;
            const fileResponse = await fetch(fullPath);
            const fileContent = await fileResponse.text();
            
            // Extract module and lecture ID from file path
            const pathParts = filePath.split('/'); // e.g., ["content", "modul-1", "lecture-1.md"]
            if (pathParts.length < 3) continue;

            const module = pathParts[1];
            const fileName = pathParts[2];
            // Assumes lecture file is named like 'lecture-X.md' and quiz is 'lecture-X-quiz.md'
            const lectureId = fileName.includes('quiz') 
                ? fileName.replace('-quiz.md', '')
                : fileName.replace('.md', '');

            if (!content[module]) {
                content[module] = { lectures: {} };
            }
            if (!content[module].lectures[lectureId]) {
                content[module].lectures[lectureId] = { topic: '', items: [], quiz: [] };
            }

            const documents = parseMultiDocument(fileContent);

            if (fileName.includes('quiz')) {
                // This is a quiz file, parse questions for the final quiz
                const quizQuestions = documents.map(doc => ({
                    ...doc.attributes,
                    explanation: doc.body ? marked.parse(doc.body) : ''
                }));
                content[module].lectures[lectureId].quiz.push(...quizQuestions);
            } else {
                // This is a lecture file with a series of items
                const lectureItems = documents.map(doc => {
                    const item = {
                        type: doc.attributes.type || 'learning-content',
                        ...doc.attributes,
                    };
                    if (item.type === 'learning-content') {
                        item.html = marked.parse(doc.body);
                    } else if (item.type === 'self-assessment-mc') {
                        item.explanation = doc.body ? marked.parse(doc.body) : '';
                    }
                    return item;
                });
                
                // Promote the topic from the first item to the lecture level
                if (lectureItems.length > 0 && lectureItems[0].topic) {
                    content[module].lectures[lectureId].topic = lectureItems[0].topic;
                }

                content[module].lectures[lectureId].items.push(...lectureItems);
            }

        } catch (error) {
            console.error('Error parsing file:', filePath, error);
        }
    }
    console.log("Parsed Content:", content);
    return content;
}
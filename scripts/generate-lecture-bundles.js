/**
 * Generate Lecture Bundles
 *
 * Creates pre-compiled JSON bundles for each lecture, enabling lazy loading.
 * Also generates content-manifest.json with checksums for sync detection.
 *
 * Usage: node generate-lecture-bundles.js [studyId]
 *
 * Output per lecture:
 *   content/{studyId}/{moduleId}/{lectureId}/lecture-bundle.json
 *
 * Output per study:
 *   content/{studyId}/content-manifest.json
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Simple YAML parser for frontmatter (same approach as validate-content.js)
function parseYamlFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { frontmatter: null, body: content };

  const yamlContent = match[1];
  const body = content.slice(match[0].length).trim();

  // Parse YAML manually (simple key-value and arrays)
  const frontmatter = {};
  const lines = yamlContent.split('\n');
  let currentKey = null;
  let currentArray = null;

  for (const line of lines) {
    // Skip empty lines and comments
    if (!line.trim() || line.trim().startsWith('#')) continue;

    // Array item
    if (line.match(/^\s+-\s/)) {
      const value = line.replace(/^\s+-\s/, '').trim();
      if (currentArray && currentKey) {
        // Clean up quotes
        const cleanValue = value.replace(/^['"]|['"]$/g, '');
        currentArray.push(cleanValue);
      }
      continue;
    }

    // Key-value pair
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      const key = kvMatch[1];
      let value = kvMatch[2].trim();

      // Check if this starts an array
      if (value === '' || value === '[]') {
        currentKey = key;
        currentArray = [];
        frontmatter[key] = currentArray;
      } else {
        // Regular value - clean up quotes
        value = value.replace(/^['"]|['"]$/g, '');

        // Parse booleans and numbers
        if (value === 'true') value = true;
        else if (value === 'false') value = false;
        else if (/^\d+$/.test(value)) value = parseInt(value, 10);
        else if (/^\d+\.\d+$/.test(value)) value = parseFloat(value);

        frontmatter[key] = value;
        currentKey = null;
        currentArray = null;
      }
    }
  }

  return { frontmatter, body };
}

// Parse nested YAML for sources and sourceRefs
function parseNestedYaml(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { frontmatter: null, body: content };

  const yamlContent = match[1];
  const body = content.slice(match[0].length).trim();

  try {
    // Use a simple state machine for nested structures
    const frontmatter = {};
    const lines = yamlContent.split('\n');
    let currentKey = null;
    let currentArray = null;
    let currentObject = null;
    let inNestedArray = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Skip empty lines
      if (!line.trim()) continue;

      // Detect indentation level
      const indent = line.search(/\S/);

      // Top-level key with nested array (e.g., "sources:")
      if (indent === 0 && line.match(/^(\w+):\s*$/)) {
        const key = line.match(/^(\w+):/)[1];
        currentKey = key;
        currentArray = [];
        frontmatter[key] = currentArray;
        currentObject = null;
        inNestedArray = true;
        continue;
      }

      // Top-level simple key-value
      if (indent === 0 && line.match(/^(\w+):\s*.+$/)) {
        const kvMatch = line.match(/^(\w+):\s*(.*)$/);
        const key = kvMatch[1];
        let value = kvMatch[2].trim().replace(/^['"]|['"]$/g, '');

        if (value === 'true') value = true;
        else if (value === 'false') value = false;
        else if (/^\d+$/.test(value)) value = parseInt(value, 10);

        frontmatter[key] = value;
        currentKey = null;
        currentArray = null;
        inNestedArray = false;
        continue;
      }

      // Array item start (e.g., "  - id: 'vorlesung-k3'")
      if (inNestedArray && line.match(/^\s+-\s+\w+:/)) {
        // Start new object
        currentObject = {};
        currentArray.push(currentObject);

        // Parse the first property
        const propMatch = line.match(/^\s+-\s+(\w+):\s*(.*)$/);
        if (propMatch) {
          const propKey = propMatch[1];
          let propValue = propMatch[2].trim().replace(/^['"]|['"]$/g, '');
          if (propValue === 'null') propValue = null;
          currentObject[propKey] = propValue;
        }
        continue;
      }

      // Nested object property (e.g., "    title: 'Vorlesungsfolien'")
      if (inNestedArray && currentObject && line.match(/^\s+\w+:/)) {
        const propMatch = line.match(/^\s+(\w+):\s*(.*)$/);
        if (propMatch) {
          const propKey = propMatch[1];
          let propValue = propMatch[2].trim().replace(/^['"]|['"]$/g, '');
          if (propValue === 'null') propValue = null;
          currentObject[propKey] = propValue;
        }
        continue;
      }

      // Simple array item (e.g., "  - 'item'")
      if (line.match(/^\s+-\s+[^:]+$/)) {
        const value = line
          .replace(/^\s+-\s+/, '')
          .trim()
          .replace(/^['"]|['"]$/g, '');
        if (currentArray) {
          currentArray.push(value);
        }
        continue;
      }
    }

    return { frontmatter, body };
  } catch (e) {
    console.error('YAML parse error:', e.message);
    return { frontmatter: null, body: content };
  }
}

// Convert Markdown to HTML (simplified - main parsing happens in browser)
function markdownToHtml(markdown) {
  // Basic conversion - the browser will use marked.js for full parsing
  // We just do minimal processing here
  return markdown
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, (match) => {
      if (match.startsWith('<')) return match;
      return match;
    });
}

// Calculate SHA-256 checksum (first 8 chars)
function calculateChecksum(content) {
  return crypto
    .createHash('sha256')
    .update(typeof content === 'string' ? content : JSON.stringify(content))
    .digest('hex')
    .substring(0, 8);
}

// Get all study IDs
function getStudyIds(contentDir) {
  const studies = [];
  const entries = fs.readdirSync(contentDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.startsWith('bsc-')) {
      studies.push(entry.name);
    }
  }

  return studies;
}

// Get all modules for a study
function getModules(studyDir) {
  const modules = [];
  const entries = fs.readdirSync(studyDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory() && /^\d{2}-/.test(entry.name)) {
      modules.push(entry.name);
    }
  }

  return modules.sort();
}

// Get all lectures for a module
function getLectures(moduleDir) {
  const lectures = [];
  const entries = fs.readdirSync(moduleDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory() && /^\d{2}-/.test(entry.name)) {
      // Check if it has lecture.md
      const lecturePath = path.join(moduleDir, entry.name, 'lecture.md');
      if (fs.existsSync(lecturePath)) {
        lectures.push(entry.name);
      }
    }
  }

  return lectures.sort();
}

// Parse a lecture and create bundle
function createLectureBundle(lectureDir, moduleId, lectureId) {
  const bundle = {
    moduleId,
    lectureId,
    metadata: {},
    items: [],
    quiz: [],
    generatedAt: new Date().toISOString()
  };

  // Parse lecture.md for metadata
  const lectureMdPath = path.join(lectureDir, 'lecture.md');
  if (fs.existsSync(lectureMdPath)) {
    const content = fs.readFileSync(lectureMdPath, 'utf-8');
    const { frontmatter, body } = parseNestedYaml(content);

    bundle.metadata = {
      topic: frontmatter?.topic || lectureId,
      description: frontmatter?.description || '',
      estimatedTime: frontmatter?.estimatedTime || 0,
      sources: frontmatter?.sources || []
    };

    // Add lecture intro as first item if there's content
    if (body && body.trim()) {
      bundle.items.push({
        type: 'learning-content',
        topic: bundle.metadata.topic,
        content: body,
        sourceRefs: []
      });
    }
  }

  // Parse lecture-items
  const itemsDir = path.join(lectureDir, 'lecture-items');
  if (fs.existsSync(itemsDir)) {
    const itemFiles = fs
      .readdirSync(itemsDir)
      .filter((f) => f.endsWith('.md'))
      .sort();

    for (const itemFile of itemFiles) {
      const itemPath = path.join(itemsDir, itemFile);
      const content = fs.readFileSync(itemPath, 'utf-8');
      const { frontmatter, body } = parseNestedYaml(content);

      if (!frontmatter?.type) {
        console.warn(`  Warning: ${itemFile} has no type`);
        continue;
      }

      const item = {
        ...frontmatter,
        content: body || ''
      };

      // Parse sourceRefs if present
      if (frontmatter.sourceRefs) {
        item.sourceRefs = frontmatter.sourceRefs;
      }

      bundle.items.push(item);
    }
  }

  // Parse questions
  const questionsDir = path.join(lectureDir, 'questions');
  if (fs.existsSync(questionsDir)) {
    const questionFiles = fs
      .readdirSync(questionsDir)
      .filter((f) => f.endsWith('.md'))
      .sort();

    for (const questionFile of questionFiles) {
      const questionPath = path.join(questionsDir, questionFile);
      const content = fs.readFileSync(questionPath, 'utf-8');
      const { frontmatter, body } = parseNestedYaml(content);

      if (!frontmatter?.type) {
        console.warn(`  Warning: ${questionFile} has no type`);
        continue;
      }

      const question = {
        ...frontmatter,
        explanation: body || frontmatter.explanation || ''
      };

      bundle.quiz.push(question);
    }
  }

  return bundle;
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const targetStudyId = args[0] || null;

  const contentDir = path.join(__dirname, '..', 'content');

  if (!fs.existsSync(contentDir)) {
    console.error('Error: content directory not found');
    process.exit(1);
  }

  const studyIds = targetStudyId ? [targetStudyId] : getStudyIds(contentDir);

  console.log('📦 Generating Lecture Bundles\n');

  for (const studyId of studyIds) {
    console.log(`\n📚 Study: ${studyId}`);

    const studyDir = path.join(contentDir, studyId);
    if (!fs.existsSync(studyDir)) {
      console.error(`  Error: Study directory not found: ${studyDir}`);
      continue;
    }

    const manifest = {
      studyId,
      generatedAt: new Date().toISOString(),
      lectures: {}
    };

    const modules = getModules(studyDir);
    let totalLectures = 0;
    let totalItems = 0;
    let totalQuestions = 0;

    for (const moduleId of modules) {
      const moduleDir = path.join(studyDir, moduleId);
      const lectures = getLectures(moduleDir);

      console.log(`  📁 ${moduleId} (${lectures.length} lectures)`);

      for (const lectureId of lectures) {
        const lectureDir = path.join(moduleDir, lectureId);
        const bundle = createLectureBundle(lectureDir, moduleId, lectureId);

        // Calculate checksum from content (not including generatedAt)
        const contentForChecksum = {
          metadata: bundle.metadata,
          items: bundle.items,
          quiz: bundle.quiz
        };
        const checksum = calculateChecksum(contentForChecksum);

        // Write bundle
        const bundlePath = path.join(lectureDir, 'lecture-bundle.json');
        const bundleContent = JSON.stringify(bundle, null, 2);
        fs.writeFileSync(bundlePath, bundleContent);

        // Calculate size
        const sizeKB = Math.round((bundleContent.length / 1024) * 10) / 10;

        // Add to manifest
        const lectureKey = `${moduleId}/${lectureId}`;
        manifest.lectures[lectureKey] = {
          checksum,
          sizeKB,
          itemCount: bundle.items.length,
          quizCount: bundle.quiz.length,
          topic: bundle.metadata.topic,
          description: bundle.metadata.description || '',
          estimatedTime: bundle.metadata.estimatedTime
        };

        console.log(
          `    ✅ ${lectureId} (${bundle.items.length} items, ${bundle.quiz.length} questions, ${sizeKB}KB)`
        );

        totalLectures++;
        totalItems += bundle.items.length;
        totalQuestions += bundle.quiz.length;
      }
    }

    // Write manifest
    const manifestPath = path.join(studyDir, 'content-manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    console.log(`\n  📋 Manifest: ${manifestPath}`);
    console.log(
      `  📊 Total: ${totalLectures} lectures, ${totalItems} items, ${totalQuestions} questions`
    );
  }

  console.log('\n✅ Done!\n');
}

main().catch(console.error);

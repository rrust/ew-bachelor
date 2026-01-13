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
const yaml = require('js-yaml');

// Parse YAML frontmatter using js-yaml for proper nested structure support
function parseYamlFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { frontmatter: null, body: content };

  const yamlContent = match[1];
  const body = content.slice(match[0].length).trim();

  try {
    const frontmatter = yaml.load(yamlContent) || {};
    return { frontmatter, body };
  } catch (e) {
    console.error('YAML parse error:', e.message);
    return { frontmatter: {}, body };
  }
}

// Alias for backwards compatibility - now uses the same robust parser
function parseNestedYaml(content) {
  return parseYamlFrontmatter(content);
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
      version: frontmatter?.version || null,
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

      // Extract mermaid diagram code if present
      if (frontmatter.type === 'mermaid-diagram' && body) {
        const mermaidMatch = body.match(/```mermaid\n([\s\S]*?)\n```/);
        if (mermaidMatch) {
          item.diagram = mermaidMatch[1].trim();
          // Keep content without the mermaid block for additional text
          item.content = body.replace(/```mermaid\n[\s\S]*?\n```/, '').trim();
        }
      }

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
          estimatedTime: bundle.metadata.estimatedTime,
          version: bundle.metadata.version || null
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

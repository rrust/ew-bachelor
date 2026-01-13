#!/usr/bin/env node
/**
 * Generate Search Index
 *
 * Creates a lightweight search index from lecture bundles.
 * The index contains searchable text snippets without full content.
 *
 * Output: content/{studyId}/search-index.json
 */

const fs = require('fs');
const path = require('path');

/**
 * Extract plain text from markdown content
 * @param {string} markdown - Markdown content
 * @returns {string} Plain text
 */
function markdownToPlainText(markdown) {
  if (!markdown) return '';

  return (
    markdown
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, '')
      // Remove inline code
      .replace(/`[^`]+`/g, '')
      // Remove images
      .replace(/!\[.*?\]\(.*?\)/g, '')
      // Remove links but keep text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove HTML tags
      .replace(/<[^>]+>/g, '')
      // Remove headers markers
      .replace(/^#{1,6}\s+/gm, '')
      // Remove bold/italic
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      // Remove blockquotes
      .replace(/^>\s+/gm, '')
      // Remove horizontal rules
      .replace(/^[-*_]{3,}$/gm, '')
      // Remove list markers
      .replace(/^[\s]*[-*+]\s+/gm, '')
      .replace(/^[\s]*\d+\.\s+/gm, '')
      // Remove LaTeX
      .replace(/\$[^$]+\$/g, '')
      .replace(/\$\$[\s\S]*?\$\$/g, '')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim()
  );
}

/**
 * Extract keywords from text
 * @param {string} text - Plain text
 * @returns {string[]} Array of unique keywords (min 3 chars)
 */
function extractKeywords(text) {
  const words = text.toLowerCase().split(/\s+/);
  const keywords = new Set();

  // German stopwords
  const stopwords = new Set([
    'der',
    'die',
    'das',
    'den',
    'dem',
    'des',
    'ein',
    'eine',
    'einer',
    'eines',
    'einem',
    'einen',
    'und',
    'oder',
    'aber',
    'wenn',
    'weil',
    'dass',
    'als',
    'auch',
    'nur',
    'noch',
    'schon',
    'sehr',
    'kann',
    'wird',
    'sind',
    'sein',
    'haben',
    'hat',
    'ist',
    'war',
    'wurden',
    'wird',
    'werden',
    'bei',
    'mit',
    'von',
    'für',
    'auf',
    'aus',
    'nach',
    'zum',
    'zur',
    'bis',
    'über',
    'unter',
    'durch',
    'sich',
    'sie',
    'wir',
    'ihr',
    'ich',
    'man',
    'diese',
    'dieser',
    'dieses',
    'jede',
    'jeder',
    'jedes',
    'alle',
    'mehr',
    'viel',
    'wie',
    'was',
    'wer',
    'wo',
    'hier',
    'dort',
    'dann',
    'also',
    'nicht',
    'kein',
    'keine',
    'keiner',
    'einem',
    'einen',
    'etwa'
  ]);

  for (const word of words) {
    // Clean word
    const cleaned = word.replace(/[^a-zäöüß]/g, '');

    // Skip short words and stopwords
    if (cleaned.length >= 3 && !stopwords.has(cleaned)) {
      keywords.add(cleaned);
    }
  }

  return Array.from(keywords);
}

/**
 * Create a search snippet from content
 * @param {string} text - Plain text
 * @param {number} maxLength - Maximum snippet length
 * @returns {string} Snippet
 */
function createSnippet(text, maxLength = 200) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Process a lecture bundle and extract search data
 * @param {Object} bundle - Lecture bundle
 * @param {string} moduleId - Module ID
 * @param {string} lectureId - Lecture ID
 * @returns {Object} Search entry with items
 */
function processBundle(bundle, moduleId, lectureId) {
  const allText = [];
  const topics = new Set();
  const items = []; // Individual searchable items

  // Type keyword mapping for search
  const typeKeywords = {
    'youtube-video': ['video', 'youtube', 'film', 'clip'],
    'learning-content': ['lerninhalt', 'inhalt', 'text'],
    'self-assessment': ['selbsttest', 'checkliste', 'assessment'],
    'self-assessment-mc': ['selbsttest', 'quiz', 'frage'],
    'mermaid-diagram': ['diagramm', 'grafik', 'flowchart', 'schema'],
    'multiple-choice': ['quiz', 'frage', 'test', 'multiple-choice'],
    'multiple-choice-multiple': ['quiz', 'frage', 'test', 'multiple-choice'],
    'fill-in-the-blank': ['lückentext', 'übung', 'ausfüllen'],
    matching: ['zuordnung', 'matching', 'übung'],
    ordering: ['sortierung', 'reihenfolge', 'übung'],
    calculation: ['berechnung', 'rechnung', 'formel'],
    'practice-exercise': ['übung', 'praxis', 'aufgabe']
  };

  // Add metadata
  if (bundle.metadata?.topic) {
    allText.push(bundle.metadata.topic);
    topics.add(bundle.metadata.topic);
  }
  if (bundle.metadata?.description) {
    allText.push(bundle.metadata.description);
  }

  // Process items - also create individual item entries
  for (let i = 0; i < (bundle.items || []).length; i++) {
    const item = bundle.items[i];
    if (item.topic) {
      topics.add(item.topic);
    }
    if (item.content) {
      allText.push(markdownToPlainText(item.content));
    }
    if (item.question) {
      allText.push(item.question);
    }
    if (item.checkpoints) {
      allText.push(item.checkpoints.join(' '));
    }

    // Create individual item entry for type-based search
    const itemType = item.type || 'learning-content';
    const itemKeywords = typeKeywords[itemType] || [];
    const itemTitle =
      item.topic || item.title || item.question || `Item ${i + 1}`;

    items.push({
      index: i,
      type: itemType,
      title: itemTitle,
      typeKeywords: itemKeywords
    });
  }

  // Process quiz questions
  for (const question of bundle.quiz || []) {
    if (question.question) {
      allText.push(question.question);
    }
    if (question.options) {
      allText.push(question.options.join(' '));
    }
    if (question.explanation) {
      allText.push(markdownToPlainText(question.explanation));
    }
  }

  const fullText = allText.join(' ');
  const keywords = extractKeywords(fullText);

  return {
    moduleId,
    lectureId,
    topic: bundle.metadata?.topic || lectureId,
    description: bundle.metadata?.description || '',
    topics: Array.from(topics),
    keywords: keywords.slice(0, 100), // Limit keywords
    snippet: createSnippet(markdownToPlainText(allText.slice(0, 3).join(' '))),
    itemCount: bundle.items?.length || 0,
    quizCount: bundle.quiz?.length || 0,
    items: items // Individual items for type-based filtering
  };
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const targetStudyId = args[0] || null;

  const contentDir = path.join(__dirname, '..', 'content');

  if (!fs.existsSync(contentDir)) {
    console.error('Error: content directory not found');
    process.exit(1);
  }

  console.log('🔍 Generating Search Index\n');

  // Get all study directories
  const studies = fs
    .readdirSync(contentDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
    .map((d) => d.name);

  for (const studyId of studies) {
    // Skip if target specified and doesn't match
    if (targetStudyId && studyId !== targetStudyId) continue;

    const studyDir = path.join(contentDir, studyId);
    const manifestPath = path.join(studyDir, 'content-manifest.json');

    // Check if manifest exists
    if (!fs.existsSync(manifestPath)) {
      console.log(`⚠️  ${studyId}: No manifest found, skipping`);
      continue;
    }

    console.log(`📚 Study: ${studyId}`);

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    const searchIndex = {
      studyId,
      generatedAt: new Date().toISOString(),
      entries: []
    };

    let processedCount = 0;

    for (const lectureKey of Object.keys(manifest.lectures)) {
      const [moduleId, lectureId] = lectureKey.split('/');
      const bundlePath = path.join(
        studyDir,
        moduleId,
        lectureId,
        'lecture-bundle.json'
      );

      if (!fs.existsSync(bundlePath)) {
        console.log(`  ⚠️  ${lectureKey}: Bundle not found`);
        continue;
      }

      const bundle = JSON.parse(fs.readFileSync(bundlePath, 'utf-8'));
      const entry = processBundle(bundle, moduleId, lectureId);
      searchIndex.entries.push(entry);
      processedCount++;
    }

    // Write search index
    const indexPath = path.join(studyDir, 'search-index.json');
    fs.writeFileSync(indexPath, JSON.stringify(searchIndex, null, 2));

    // Calculate size
    const sizeKB = Math.round((fs.statSync(indexPath).size / 1024) * 10) / 10;

    console.log(`  ✅ Generated: ${indexPath}`);
    console.log(`  📊 ${processedCount} lectures indexed (${sizeKB} KB)\n`);
  }

  console.log('✅ Done!\n');
}

main().catch(console.error);

/**
 * analyze-training-quality.js
 *
 * Qualitätsprüfung für Modul-Trainings-Fragen (Multiple Choice)
 * Angepasst für das YAML-Frontmatter-Format im ew-bachelor Repo
 *
 * Prüft auf:
 * - Längen-Balance: Korrekte Antworten sollten nicht systematisch länger sein
 * - Antwort-in-Frage: Frage darf Antwort nicht verraten
 * - Plausibilität: Falsche Antworten müssen plausibel sein
 * - Formulierungshinweise: Keine verräterischen Wörter
 * - Negativ-Fragen: Keine "nicht" oder "NICHT" Fragen
 */

const fs = require('fs');
const path = require('path');

const trainingDir = path.join(
  __dirname,
  '..',
  'content',
  'bsc-ernaehrungswissenschaften',
  '02-chemie-grundlagen',
  'module-training'
);

// Problemkategorien
const problems = {
  // KRITISCH
  answerInQuestion: [],
  questionInAnswer: [],
  negativeQuestion: [],

  // HOCH
  lengthImbalance: [],
  specificityImbalance: [],
  obviousDistractors: [],
  longestIsCorrect: [],
  grammarInconsistency: [],

  // MITTEL
  absoluteTerms: [],
  grammarHints: [],
  questionWordInAnswer: []
};

// Statistiken
const stats = {
  totalQuestions: 0,
  correctAnswerLengths: [],
  incorrectAnswerLengths: [],
  correctPositions: { 0: 0, 1: 0, 2: 0, 3: 0 },
  chaptersAnalyzed: 0
};

function parseYamlFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const questions = [];

  // Split by --- to get individual question blocks
  const blocks = content.split(/^---$/m).filter((b) => b.trim());

  for (const block of blocks) {
    const question = {
      type: '',
      question: '',
      options: [],
      correctAnswer: null,
      correctAnswers: []
    };

    // Parse type
    const typeMatch = block.match(/type:\s*['"]?([^'"\n]+)['"]?/);
    if (typeMatch) question.type = typeMatch[1].trim();

    // Parse question
    const questionMatch = block.match(
      /question:\s*['"]([^'"]+)['"]|question:\s*['"]((?:[^'\\]|\\.)*)['"]|question:\s*(.+)$/m
    );
    if (questionMatch) {
      question.question = (
        questionMatch[1] ||
        questionMatch[2] ||
        questionMatch[3] ||
        ''
      )
        .trim()
        .replace(/^['"]|['"]$/g, '');
    }

    // Parse options (array format)
    const optionsMatch = block.match(/options:\s*\n((?:\s+-\s+.+\n?)+)/);
    if (optionsMatch) {
      const optionLines = optionsMatch[1].match(
        /^\s+-\s+['"]?(.+?)['"]?\s*$/gm
      );
      if (optionLines) {
        question.options = optionLines.map((line) => {
          const match = line.match(/^\s+-\s+['"]?(.+?)['"]?\s*$/);
          return match ? match[1].replace(/^['"]|['"]$/g, '') : '';
        });
      }
    }

    // Parse correctAnswer (single)
    const correctMatch = block.match(/correctAnswer:\s*['"]?([^'"\n]+)['"]?/);
    if (correctMatch) {
      question.correctAnswer = correctMatch[1]
        .trim()
        .replace(/^['"]|['"]$/g, '');
    }

    // Parse correctAnswers (multiple)
    const correctMultiMatch = block.match(
      /correctAnswers:\s*\n((?:\s+-\s+.+\n?)+)/
    );
    if (correctMultiMatch) {
      const answerLines = correctMultiMatch[1].match(
        /^\s+-\s+['"]?(.+?)['"]?\s*$/gm
      );
      if (answerLines) {
        question.correctAnswers = answerLines.map((line) => {
          const match = line.match(/^\s+-\s+['"]?(.+?)['"]?\s*$/);
          return match ? match[1].replace(/^['"]|['"]$/g, '') : '';
        });
      }
    }

    if (question.question && question.options.length > 0) {
      questions.push(question);
    }
  }

  return questions;
}

function extractKeywords(text) {
  const stopwords = new Set([
    'und',
    'oder',
    'der',
    'die',
    'das',
    'ein',
    'eine',
    'ist',
    'sind',
    'wird',
    'werden',
    'hat',
    'haben',
    'bei',
    'mit',
    'von',
    'für',
    'auf',
    'aus',
    'als',
    'nach',
    'auch',
    'sich',
    'dem',
    'den',
    'des',
    'einer',
    'einem',
    'eines',
    'wenn',
    'dann',
    'kann',
    'können',
    'diese',
    'dieser',
    'dieses',
    'welche',
    'welcher',
    'welches',
    'sind',
    'sein',
    'seine',
    'seiner',
    'gibt',
    'mehr',
    'sehr',
    'durch',
    'über',
    'unter',
    'zwischen',
    'noch',
    'nicht',
    'korrekt',
    'richtig',
    'falsch',
    'aussage',
    'aussagen',
    'folgenden',
    'welchen',
    'welchem',
    'wurde',
    'wurden',
    // Konzepte die zwangsläufig in Frage und Antwort vorkommen
    'polar',
    'unpolar',
    'energie',
    'elektron',
    'elektronen',
    'konzentriert',
    'verdünnt',
    'kreisprozess',
    'berechnung',
    'paare',
    'nichtbindende',
    'bindende',
    'äquatoriale',
    'axiale',
    'positionen',
    // Formel-bezogene Begriffe
    'summenformel',
    'verhältnisformel',
    'molekülformel',
    'empirische',
    'formel',
    'verhältnis',
    // Chemische Verbindungen (oft in Frage UND Antwort)
    'ethan',
    'ethen',
    'ethin',
    'methan',
    'propan',
    'benzol',
    'diamant',
    'graphit',
    // Bindungsarten
    'einfachbindung',
    'doppelbindung',
    'dreifachbindung',
    // Thermodynamik
    'thermodynamisch',
    'exotherm',
    'endotherm',
    'kj/mol',
    // Weitere notwendige Konzepte
    'drittes',
    'element',
    'paart',
    'ungepaarte',
    'tröpfchen',
    'dampfdruck',
    'gelöste',
    'stoff',
    'kleine'
  ]);

  // Filter out chemical formulas (contain subscripts, superscripts, or look like formulas)
  const chemicalPattern = /^[a-z]{1,2}[₀-₉²³⁺⁻]+|^[a-z]+\d|^\d+$/i;

  return text
    .toLowerCase()
    .replace(/[.,;:!?()[\]{}""„]/g, ' ')
    .split(/\s+/)
    .filter(
      (w) => w.length >= 4 && !stopwords.has(w) && !chemicalPattern.test(w)
    )
    .filter((w) => !w.match(/[₀₁₂₃₄₅₆₇₈₉⁺⁻²³]/)); // Remove words with subscripts/superscripts
}

function checkQuestion(question, filePath, questionIndex) {
  const relPath = path.relative(trainingDir, filePath);
  const location = `${relPath} - Frage ${questionIndex + 1}`;

  const questionText = question.question.toLowerCase();
  const questionKeywords = extractKeywords(question.question);

  // Determine correct and incorrect options
  const correctTexts = [];
  const incorrectTexts = [];

  if (question.correctAnswer) {
    correctTexts.push(question.correctAnswer);
    incorrectTexts.push(
      ...question.options.filter((o) => o !== question.correctAnswer)
    );
  } else if (question.correctAnswers.length > 0) {
    correctTexts.push(...question.correctAnswers);
    incorrectTexts.push(
      ...question.options.filter((o) => !question.correctAnswers.includes(o))
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // 1. NEGATIV-FRAGEN CHECK
  // ═══════════════════════════════════════════════════════════════════
  const negativePatterns = [
    /\bnicht\b/i,
    /\bNICHT\b/,
    /\bkein[e]?\b/i,
    /\bnie\b/i,
    /\bniemals\b/i,
    /\bfalsch\b/i,
    /\binkorrekt\b/i,
    /\bunzutreffend\b/i
  ];

  for (const pattern of negativePatterns) {
    if (pattern.test(question.question)) {
      // Ausnahmen
      if (
        pattern.source === '\\bfalsch\\b' &&
        /richtig.{1,10}falsch/i.test(question.question)
      ) {
        continue;
      }
      // "nicht-flüchtig" ist keine Negativ-Frage
      if (/nicht-flüchtig/i.test(question.question)) {
        continue;
      }
      problems.negativeQuestion.push({
        location,
        detail: `Frage enthält Negation: "${question.question.substring(0, 80)}..."`
      });
      break;
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // 2. ANTWORT IN FRAGE CHECK
  // ═══════════════════════════════════════════════════════════════════
  correctTexts.forEach((correctText) => {
    const correctKeywords = extractKeywords(correctText);
    const sharedKeywords = correctKeywords.filter(
      (kw) => questionText.includes(kw) && kw.length >= 5
    );

    if (sharedKeywords.length >= 2) {
      problems.answerInQuestion.push({
        location,
        detail: `Keywords [${sharedKeywords.join(', ')}] in "${correctText.substring(0, 50)}"`
      });
    }
  });

  // ═══════════════════════════════════════════════════════════════════
  // 3. FRAGE-SCHLÜSSELWORT IN ANTWORT CHECK
  // ═══════════════════════════════════════════════════════════════════
  const questionSubject =
    questionText.match(/was ist (?:ein[e]? )?(\w+)/i)?.[1] ||
    questionText.match(
      /wie (?:lautet|nennt man) (?:die |der |das )?(\w+)/i
    )?.[1];

  if (questionSubject && questionSubject.length >= 4) {
    correctTexts.forEach((correctText) => {
      if (correctText.toLowerCase().includes(questionSubject.toLowerCase())) {
        problems.questionInAnswer.push({
          location,
          detail: `Frage-Begriff "${questionSubject}" in Antwort: "${correctText.substring(0, 50)}"`
        });
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  // 4. LÄNGEN-IMBALANCE CHECK
  // ═══════════════════════════════════════════════════════════════════
  if (correctTexts.length > 0 && incorrectTexts.length > 0) {
    const avgCorrectLen =
      correctTexts.reduce((a, b) => a + b.length, 0) / correctTexts.length;
    const avgIncorrectLen =
      incorrectTexts.reduce((a, b) => a + b.length, 0) / incorrectTexts.length;

    stats.correctAnswerLengths.push(avgCorrectLen);
    stats.incorrectAnswerLengths.push(avgIncorrectLen);

    // Skip calculation questions (all answers are short numeric values)
    const allAnswersShort = [...correctTexts, ...incorrectTexts].every(
      (t) => t.length < 25
    );
    const looksLikeCalculation =
      allAnswersShort &&
      [...correctTexts, ...incorrectTexts].every(
        (t) =>
          /^[~≈<>]?\s*[\d,.\-+×÷\/]+\s*(kJ|mol|g|L|M|%|mmHg|Pa|°C|K|u)?/.test(
            t
          ) || t.length < 20
      );

    // Only flag if correct answers are 75%+ longer than incorrect (was 50%)
    if (
      avgCorrectLen > avgIncorrectLen * 1.75 &&
      avgCorrectLen > 35 &&
      !looksLikeCalculation
    ) {
      problems.lengthImbalance.push({
        location,
        detail: `Korrekt: ø${Math.round(avgCorrectLen)} vs. Falsch: ø${Math.round(avgIncorrectLen)} Zeichen`
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // 5. SPEZIFITÄTS-CHECK
  // ═══════════════════════════════════════════════════════════════════
  const correctHasNumbers = correctTexts.some((t) => /\d+/.test(t));
  const incorrectHasNumbers = incorrectTexts.some((t) => /\d+/.test(t));

  // Skip if this looks like a calculation question (most answers are numeric/short)
  const allAnswers = [...correctTexts, ...incorrectTexts];
  const numericAnswerCount = allAnswers.filter(
    (t) => /^[~≈<>]?\s*[\d,.\-+×÷\/]+/.test(t) || t.length < 15
  ).length;
  const isCalculationQuestion = numericAnswerCount >= allAnswers.length * 0.5;

  if (
    correctHasNumbers &&
    !incorrectHasNumbers &&
    incorrectTexts.length >= 2 &&
    !isCalculationQuestion
  ) {
    problems.specificityImbalance.push({
      location,
      detail: `Nur korrekte Antworten enthalten Zahlen/Werte`
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  // 6. OFFENSICHTLICHE DISTRAKTOREN
  // ═══════════════════════════════════════════════════════════════════
  // Skip calculation questions where short numeric answers are expected
  const avgAllLen =
    allAnswers.reduce((a, b) => a + b.length, 0) / allAnswers.length;
  const isShortAnswerQuestion = avgAllLen < 20;

  incorrectTexts.forEach((text) => {
    if (
      text.length < 10 &&
      correctTexts.every((c) => c.length > 30) &&
      !isShortAnswerQuestion
    ) {
      problems.obviousDistractors.push({
        location,
        detail: `Sehr kurze falsche Antwort: "${text}"`
      });
    }
  });

  // ═══════════════════════════════════════════════════════════════════
  // 7. ABSOLUTE BEGRIFFE IN FALSCHEN ANTWORTEN
  // ═══════════════════════════════════════════════════════════════════
  incorrectTexts.forEach((text) => {
    if (/\b(immer|stets|niemals|ausschließlich|alle|keine)\b/i.test(text)) {
      const correctHasAbsolute = correctTexts.some((c) =>
        /\b(immer|stets|niemals|ausschließlich|alle|keine)\b/i.test(c)
      );
      if (!correctHasAbsolute) {
        problems.absoluteTerms.push({
          location,
          detail: `Falsche Antwort mit absolutem Begriff: "${text.substring(0, 50)}"`
        });
      }
    }
  });

  // ═══════════════════════════════════════════════════════════════════
  // 8. LÄNGSTE ANTWORT = KORREKT CHECK
  // ═══════════════════════════════════════════════════════════════════
  if (
    correctTexts.length > 0 &&
    incorrectTexts.length > 0 &&
    !isCalculationQuestion
  ) {
    const longestCorrect = Math.max(...correctTexts.map((t) => t.length));
    const longestIncorrect = Math.max(...incorrectTexts.map((t) => t.length));
    const longestOverall = Math.max(longestCorrect, longestIncorrect);

    // Warnung wenn korrekte Antwort die eindeutig längste ist
    if (
      longestCorrect === longestOverall &&
      longestCorrect > longestIncorrect * 1.2 &&
      longestCorrect > 30
    ) {
      problems.longestIsCorrect.push({
        location,
        detail: `Korrekte Antwort ist längste: ${longestCorrect} vs. max. falsch: ${longestIncorrect} Zeichen`
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // 9. GRAMMATISCHE KONSISTENZ CHECK
  // ═══════════════════════════════════════════════════════════════════
  if (question.options.length >= 4 && !isCalculationQuestion) {
    // Prüfe Satzanfänge
    const startsWithVerb = question.options.filter((o) =>
      /^(ist|sind|hat|haben|wird|werden|kann|können|zeigt|liegt|enthält|besteht|führt|bewirkt)/i.test(
        o
      )
    ).length;
    const startsWithNoun = question.options.filter((o) =>
      /^(der|die|das|ein|eine|einer)/i.test(o)
    ).length;
    const startsWithAdjective = question.options.filter((o) =>
      /^[A-ZÄÖÜ][a-zäöüß]+e[rns]?\s/i.test(o)
    ).length;

    // Wenn manche mit Artikel/Verb anfangen und andere nicht
    const patterns = [startsWithVerb, startsWithNoun].filter(
      (n) => n > 0 && n < question.options.length
    );
    if (patterns.length > 0 && question.options.length === 4) {
      const dominant = Math.max(
        startsWithVerb,
        startsWithNoun,
        startsWithAdjective
      );
      const outliers = question.options.length - dominant;
      if (outliers >= 2 && dominant >= 2) {
        problems.grammarInconsistency.push({
          location,
          detail: `Uneinheitliche Satzstruktur: ${startsWithVerb}× Verb, ${startsWithNoun}× Artikel`
        });
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // 10. FRAGE-WÖRTER IN ANTWORT (erweiterte Synonyme-Regel)
  // ═══════════════════════════════════════════════════════════════════
  const significantQuestionWords = questionKeywords.filter(
    (w) => w.length >= 5
  );

  correctTexts.forEach((correctText) => {
    const correctLower = correctText.toLowerCase();
    const foundWords = significantQuestionWords.filter((qw) => {
      // Escape Regex-Sonderzeichen für sichere Suche
      const escapedQw = qw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Exakte Wort-Grenze prüfen
      const regex = new RegExp(`\\b${escapedQw}\\b`, 'i');
      return regex.test(correctLower);
    });

    if (foundWords.length >= 1) {
      // Nur warnen wenn es keine chemische Formel oder Fachbegriff ist
      const nonTechnical = foundWords.filter(
        (w) =>
          !/^(atom|molekül|elektron|proton|neutron|orbital|bindung|reaktion|lösung|säure|base)/.test(
            w
          )
      );
      if (nonTechnical.length >= 1) {
        problems.questionWordInAnswer.push({
          location,
          detail: `Frage-Wort "${nonTechnical[0]}" in korrekter Antwort: "${correctText.substring(0, 50)}..."`
        });
      }
    }
  });

  // ═══════════════════════════════════════════════════════════════════
  // 11. POSITIONS-STATISTIK
  // ═══════════════════════════════════════════════════════════════════
  if (question.correctAnswer) {
    const idx = question.options.indexOf(question.correctAnswer);
    if (idx >= 0 && idx < 4) {
      stats.correctPositions[idx]++;
    }
  }

  stats.totalQuestions++;
}

// MAIN EXECUTION
console.log('═══════════════════════════════════════════════════════════════');
console.log('     QUALITÄTSPRÜFUNG FÜR MODUL-TRAININGS-FRAGEN');
console.log('     (ew-bachelor Repository)');
console.log('═══════════════════════════════════════════════════════════════');
console.log('\nStarte Analyse...\n');

// Check if directory exists
if (!fs.existsSync(trainingDir)) {
  console.error(`❌ Verzeichnis nicht gefunden: ${trainingDir}`);
  process.exit(1);
}

const chapters = fs.readdirSync(trainingDir).filter((f) => {
  const fullPath = path.join(trainingDir, f);
  return fs.statSync(fullPath).isDirectory();
});

console.log(`Gefundene Kapitel: ${chapters.length}`);

chapters.forEach((chapter) => {
  const chapterPath = path.join(trainingDir, chapter);
  const files = fs
    .readdirSync(chapterPath)
    .filter((f) => f.endsWith('.md') && f.startsWith('level'));

  files.forEach((file) => {
    const filePath = path.join(chapterPath, file);
    try {
      const questions = parseYamlFile(filePath);
      questions.forEach((q, idx) => {
        checkQuestion(q, filePath, idx);
      });
    } catch (e) {
      console.error(`Fehler beim Parsen von ${filePath}: ${e.message}`);
    }
  });
  stats.chaptersAnalyzed++;
});

console.log(`Analysierte Fragen: ${stats.totalQuestions}\n`);

// ═══════════════════════════════════════════════════════════════════
// ERGEBNISSE AUSGEBEN
// ═══════════════════════════════════════════════════════════════════

const categories = [
  {
    key: 'negativeQuestion',
    name: '🔴 Negativ-Fragen (NICHT, kein)',
    severity: 'KRITISCH'
  },
  {
    key: 'answerInQuestion',
    name: '🔴 Antwort in Frage enthalten',
    severity: 'KRITISCH'
  },
  {
    key: 'questionInAnswer',
    name: '🔴 Frage-Begriff in Antwort',
    severity: 'KRITISCH'
  },

  {
    key: 'lengthImbalance',
    name: '🟠 Längen-Ungleichgewicht',
    severity: 'HOCH'
  },
  {
    key: 'specificityImbalance',
    name: '🟠 Spezifitäts-Ungleichgewicht',
    severity: 'HOCH'
  },
  {
    key: 'obviousDistractors',
    name: '🟠 Offensichtlich falsche Distraktoren',
    severity: 'HOCH'
  },
  {
    key: 'longestIsCorrect',
    name: '🟠 Längste Antwort ist korrekt',
    severity: 'HOCH'
  },
  {
    key: 'grammarInconsistency',
    name: '🟠 Uneinheitliche Grammatik-Struktur',
    severity: 'HOCH'
  },

  {
    key: 'absoluteTerms',
    name: '🟡 Absolute Begriffe in falschen Antworten',
    severity: 'MITTEL'
  },
  {
    key: 'grammarHints',
    name: '🟡 Grammatik verrät Antwort',
    severity: 'MITTEL'
  },
  {
    key: 'questionWordInAnswer',
    name: '🟡 Frage-Wort in Antwort (Synonyme nutzen!)',
    severity: 'MITTEL'
  }
];

let totalProblems = 0;
let criticalCount = 0;
let highCount = 0;

categories.forEach((cat) => {
  const items = problems[cat.key];
  if (items.length > 0) {
    console.log(`\n${cat.name} (${cat.severity}): ${items.length}`);
    console.log('─'.repeat(70));
    items.slice(0, 15).forEach((item) => {
      console.log(`  • ${item.location}`);
      console.log(`    → ${item.detail}`);
    });
    if (items.length > 15) {
      console.log(`  ... und ${items.length - 15} weitere`);
    }
    totalProblems += items.length;

    if (cat.severity === 'KRITISCH') criticalCount += items.length;
    if (cat.severity === 'HOCH') highCount += items.length;
  }
});

// ═══════════════════════════════════════════════════════════════════
// STATISTIKEN
// ═══════════════════════════════════════════════════════════════════

console.log(
  '\n═══════════════════════════════════════════════════════════════'
);
console.log('                         STATISTIKEN');
console.log('═══════════════════════════════════════════════════════════════');

if (stats.correctAnswerLengths.length > 0) {
  const avgCorrect =
    stats.correctAnswerLengths.reduce((a, b) => a + b, 0) /
    stats.correctAnswerLengths.length;
  const avgIncorrect =
    stats.incorrectAnswerLengths.reduce((a, b) => a + b, 0) /
    stats.incorrectAnswerLengths.length;

  console.log('\n📊 Durchschnittliche Antwortlängen:');
  console.log(`   Korrekte Antworten:  ${avgCorrect.toFixed(1)} Zeichen`);
  console.log(`   Falsche Antworten:   ${avgIncorrect.toFixed(1)} Zeichen`);
  console.log(
    `   Verhältnis:          ${(avgCorrect / avgIncorrect).toFixed(2)}x`
  );

  if (avgCorrect > avgIncorrect * 1.3) {
    console.log('   ⚠️  WARNUNG: Korrekte Antworten sind systematisch länger!');
  } else {
    console.log('   ✅ Längen-Balance akzeptabel');
  }
}

console.log('\n📊 Verteilung korrekter Antworten (Position):');
const totalPositions = Object.values(stats.correctPositions).reduce(
  (a, b) => a + b,
  0
);
const expectedPct = 25;
let positionWarning = false;

if (totalPositions > 0) {
  const posLabels = ['A', 'B', 'C', 'D'];
  Object.entries(stats.correctPositions).forEach(([idx, count]) => {
    const pct = ((count / totalPositions) * 100).toFixed(1);
    const bar = '█'.repeat(Math.round((count / totalPositions) * 40));
    const deviation = Math.abs(parseFloat(pct) - expectedPct);
    const flag = deviation > 10 ? ' ⚠️' : '';
    if (deviation > 10) positionWarning = true;
    console.log(`   ${posLabels[idx]}: ${bar} ${pct}%${flag}`);
  });

  if (positionWarning) {
    console.log(
      '   ⚠️  WARNUNG: Ungleiche Verteilung der korrekten Positionen!'
    );
  } else {
    console.log('   ✅ Positions-Verteilung akzeptabel');
  }
}

// ═══════════════════════════════════════════════════════════════════
// ZUSAMMENFASSUNG
// ═══════════════════════════════════════════════════════════════════

console.log(
  '\n═══════════════════════════════════════════════════════════════'
);
console.log('                       ZUSAMMENFASSUNG');
console.log('═══════════════════════════════════════════════════════════════');

console.log(
  `\n📋 Analysiert: ${stats.totalQuestions} Fragen in ${stats.chaptersAnalyzed} Kapiteln`
);
console.log(`📋 Gefunden: ${totalProblems} potentielle Qualitätsprobleme`);

if (criticalCount > 0) {
  console.log(`\n🔴 KRITISCHE PROBLEME: ${criticalCount}`);
  console.log('   Diese müssen behoben werden!');
}

if (highCount > 0) {
  console.log(`\n🟠 HOHE PRIORITÄT: ${highCount}`);
  console.log('   Diese sollten geprüft werden.');
}

if (criticalCount === 0 && highCount === 0) {
  console.log('\n✅ Keine kritischen oder hohen Qualitätsprobleme gefunden!');
}

console.log(
  '\n═══════════════════════════════════════════════════════════════\n'
);

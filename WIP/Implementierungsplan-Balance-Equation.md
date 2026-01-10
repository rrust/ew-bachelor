# Implementierungsplan: Balance-Equation Content Type

> **Status:** ⏳ Geplant
>
> **Erstellt:** 2026-01-10
>
> **Priorität:** Mittel (für Chemie-Modul)

---

## Übersicht

Interaktiver Content-Typ zum Üben und Prüfen von chemischen Gleichungen. User muss Koeffizienten eingeben, um Gleichungen auszugleichen.

| Phase   | Feature                  | Aufwand  | Status    |
| ------- | ------------------------ | -------- | --------- |
| Phase 1 | Basis-Implementierung    | 2-3 Std. | ⏳ Geplant |
| Phase 2 | Auto-Validierung         | 1-2 Std. | 📋 Backlog |
| Phase 3 | Erweiterte Aufgabentypen | 1-2 Wo.  | 📋 Backlog |

---

## Empfohlene Bibliotheken (CDN)

### 1. Logik: @akikowo/chemical-balancer

Automatisches Lösen und Prüfen von chemischen Gleichungen.

```html
<script src="https://cdn.jsdelivr.net/npm/@akikowo/chemical-balancer/dist/index.min.js"></script>
```

```javascript
// Globale Variable 'balancer' verfügbar
const problem = "H2 + O2 = H2O";
const solution = balancer.balance(problem);
// Ergebnis: "2H2 + O2 = 2H2O"
```

**Vorteile:**

- Dynamische Aufgabengenerierung (nur Edukte/Produkte vorgeben)
- Automatische Validierung von Schülereingaben
- Kein eigener Parser nötig

### 2. Darstellung: KaTeX + mhchem (bereits integriert)

Die App nutzt bereits KaTeX für mathematische Formeln. Für chemische Formeln wird
lediglich die mhchem-Extension hinzugefügt.

```html
<!-- Bereits vorhanden in index.html -->
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>

<!-- NEU: mhchem-Extension hinzufügen -->
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/mhchem.min.js"></script>
```

```html
<!-- Verwendung mit \ce{...} im Markdown -->
<p>Gleiche diese Gleichung aus: $\ce{Fe + Cl2 -> FeCl3}$</p>
```

**Vorteile:**

- Nutzt bestehende KaTeX-Integration (kein zusätzliches Framework)
- Automatische Subscripts (H₂O statt H2O)
- Ionenladungen (Na⁺, Cl⁻)
- Professionelle Reaktionspfeile (→, ⇌)
- Schneller als MathJax (~3x)
- Bereits im Service Worker gecached

### 3. Alternative für Zukunft: OpenChemLib

Für fortgeschrittene Features wie Molekülstrukturen oder Molmassen.

```html
<script src="https://cdn.jsdelivr.net/npm/openchemlib/dist/openchemlib-full.js"></script>
```

> **Hinweis:** Erst relevant, wenn App über Textaufgaben hinausgeht.

---

## Phase 1: Basis-Implementierung (MVP)

### Konzept

User füllt Koeffizienten in vorgegebene Lücken aus. Validierung gegen vordefinierte korrekte Werte.

```text
┌─────────────────────────────────────────────────────────────┐
│  Gleiche die folgende Gleichung aus:                        │
│                                                             │
│  [ 2 ] H₂  +  [ 1 ] O₂  →  [ 2 ] H₂O                       │
│    ↑           ↑            ↑                               │
│  Input       Input        Input                             │
│                                                             │
│  [Prüfen]                                                   │
│                                                             │
│  ✅ Richtig! Die Gleichung ist ausgeglichen.                │
│  Erklärung: 4 H-Atome und 2 O-Atome auf beiden Seiten.      │
└─────────────────────────────────────────────────────────────┘
```

### Content-Format

```yaml
---
type: 'balance-equation'
title: 'Wassersynthese'
reactants:
  - formula: 'H₂'
    coefficient: 2
  - formula: 'O₂'
    coefficient: 1
products:
  - formula: 'H₂O'
    coefficient: 2
hints:
  - 'Zähle die Wasserstoff-Atome auf beiden Seiten'
  - 'Beginne mit dem komplexesten Molekül (H₂O)'
  - 'Bei H₂O brauchst du 2, also brauchst du 4 H-Atome links'
explanation: '4 H-Atome und 2 O-Atome auf beiden Seiten der Gleichung.'
---
```

### Implementierung

#### 1. js/lecture.js - Render-Funktion

```javascript
/**
 * Renders a balance equation exercise
 * @param {Object} item - Equation item with reactants, products, hints
 * @param {HTMLElement} container - Container element
 */
function renderBalanceEquation(item, container) {
  const title = item.title ? `<h3 class="text-xl font-bold mb-4">${item.title}</h3>` : '';
  
  // Build equation display with input fields
  // Wrap formulas in \ce{} for KaTeX/mhchem rendering
  let equationHtml = '<div class="equation-container flex flex-wrap items-center justify-center gap-2 text-2xl my-6">';
  
  // Reactants
  item.reactants.forEach((r, i) => {
    if (i > 0) equationHtml += '<span class="mx-2">+</span>';
    equationHtml += `
      <div class="flex items-center">
        <input type="number" 
               min="1" max="10" 
               class="coefficient-input w-12 h-12 text-center text-xl border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:border-blue-500 focus:outline-none"
               data-correct="${r.coefficient}"
               data-index="r${i}">
        <span class="ml-1 formula">\\(\\ce{${r.formula}}\\)</span>
      </div>`;
  });
  
  // Arrow
  equationHtml += '<span class="mx-4">→</span>';
  
  // Products
  item.products.forEach((p, i) => {
    if (i > 0) equationHtml += '<span class="mx-2">+</span>';
    equationHtml += `
      <div class="flex items-center">
        <input type="number" 
               min="1" max="10" 
               class="coefficient-input w-12 h-12 text-center text-xl border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:border-blue-500 focus:outline-none"
               data-correct="${p.coefficient}"
               data-index="p${i}">
        <span class="ml-1 formula">\\(\\ce{${p.formula}}\\)</span>
      </div>`;
  });
  
  equationHtml += '</div>';
  
  // Hints section (collapsible)
  let hintsHtml = '';
  if (item.hints && item.hints.length > 0) {
    hintsHtml = `
      <details class="mb-4">
        <summary class="cursor-pointer text-blue-500 hover:text-blue-600 font-medium">
          💡 Hinweise anzeigen (${item.hints.length})
        </summary>
        <ol class="mt-2 ml-6 list-decimal text-gray-600 dark:text-gray-400 space-y-1">
          ${item.hints.map(h => `<li>${h}</li>`).join('')}
        </ol>
      </details>`;
  }
  
  container.innerHTML = `
    <div class="balance-equation-container p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
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
    
    inputs.forEach(input => {
      const userValue = parseInt(input.value);
      const correctValue = parseInt(input.dataset.correct);
      
      if (!input.value || isNaN(userValue)) {
        allFilled = false;
        input.classList.remove('border-green-500', 'border-red-500');
        input.classList.add('border-yellow-500');
      } else if (userValue === correctValue) {
        input.classList.remove('border-gray-300', 'border-red-500', 'border-yellow-500');
        input.classList.add('border-green-500');
      } else {
        allCorrect = false;
        input.classList.remove('border-gray-300', 'border-green-500', 'border-yellow-500');
        input.classList.add('border-red-500');
      }
    });
    
    feedbackDiv.classList.remove('hidden', 'bg-green-100', 'bg-red-100', 'bg-yellow-100',
                                  'dark:bg-green-900', 'dark:bg-red-900', 'dark:bg-yellow-900');
    
    if (!allFilled) {
      feedbackDiv.classList.add('bg-yellow-100', 'dark:bg-yellow-900');
      feedbackDiv.innerHTML = '<p class="text-yellow-700 dark:text-yellow-200">⚠️ Bitte fülle alle Felder aus.</p>';
    } else if (allCorrect) {
      feedbackDiv.classList.add('bg-green-100', 'dark:bg-green-900');
      feedbackDiv.innerHTML = `
        <p class="text-green-700 dark:text-green-200 font-bold">✅ Richtig! Die Gleichung ist ausgeglichen.</p>
        ${item.explanation ? `<p class="text-green-600 dark:text-green-300 mt-2">${item.explanation}</p>` : ''}
      `;
      checkBtn.disabled = true;
      checkBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
      feedbackDiv.classList.add('bg-red-100', 'dark:bg-red-900');
      feedbackDiv.innerHTML = '<p class="text-red-700 dark:text-red-200">❌ Noch nicht richtig. Überprüfe die rot markierten Koeffizienten.</p>';
    }
  });
  
  resetBtn.addEventListener('click', () => {
    inputs.forEach(input => {
      input.value = '';
      input.classList.remove('border-green-500', 'border-red-500', 'border-yellow-500');
      input.classList.add('border-gray-300', 'dark:border-gray-600');
    });
    feedbackDiv.classList.add('hidden');
    checkBtn.disabled = false;
    checkBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  });
  
  // Render formulas with KaTeX/mhchem (using existing renderMath function)
  if (typeof renderMath === 'function') {
    renderMath(container);
  }
}
```

#### 2. js/lecture.js - Switch-Case erweitern

```javascript
case 'balance-equation':
  renderBalanceEquation(item, lectureItemDisplay);
  break;
```

#### 3. validate-content.html - Validation Rules

```javascript
'balance-equation': ['type', 'reactants', 'products']
```

#### 4. docs/CONTENT_TEMPLATES.md - Dokumentation

Template für neuen Type hinzufügen.

### Testfälle Phase 1

- [ ] Koeffizienten-Eingabe funktioniert (1-10)
- [ ] Prüfen-Button validiert alle Felder
- [ ] Richtige Antworten werden grün markiert
- [ ] Falsche Antworten werden rot markiert
- [ ] Leere Felder werden gelb markiert
- [ ] Zurücksetzen-Button leert alle Felder
- [ ] Hinweise sind ausklappbar
- [ ] Erklärung erscheint bei richtiger Lösung
- [ ] Dark Mode funktioniert
- [ ] Mobile-Darstellung funktioniert
- [ ] KaTeX rendert Formeln (H₂, O₂, etc.)

---

## Phase 2: Auto-Validierung mit chemical-balancer

### Konzept

Mit `@akikowo/chemical-balancer` wird die Auto-Validierung erheblich vereinfacht.
Kein eigener Parser nötig – die Bibliothek übernimmt alles.

```yaml
---
type: 'balance-equation'
validation: 'auto'
equation: 'Fe + O2 = Fe2O3'
# Keine Koeffizienten nötig - werden automatisch berechnet
---
```

### Implementierung

```javascript
/**
 * Validiert eine User-Eingabe gegen die korrekte Lösung
 * @param {string} unbalanced - Unausgeglichene Gleichung z.B. "H2 + O2 = H2O"
 * @param {number[]} userCoefficients - User-Eingaben [2, 1, 2]
 * @returns {boolean} true wenn korrekt ausgeglichen
 */
function validateWithBalancer(unbalanced, userCoefficients) {
  // Korrekte Lösung berechnen
  const solution = balancer.balance(unbalanced);
  // z.B. "2H2 + O2 = 2H2O"
  
  // Koeffizienten aus Lösung extrahieren
  const correctCoefficients = extractCoefficients(solution);
  
  // Vergleichen (auch Vielfache akzeptieren)
  return areEquivalent(userCoefficients, correctCoefficients);
}

/**
 * Prüft ob zwei Koeffizientensets äquivalent sind (Vielfache erlaubt)
 * 2,1,2 ist äquivalent zu 4,2,4
 */
function areEquivalent(user, correct) {
  if (user.length !== correct.length) return false;
  
  // Finde den Faktor
  const factor = user[0] / correct[0];
  
  // Prüfe ob alle Koeffizienten das gleiche Verhältnis haben
  return correct.every((c, i) => user[i] === c * factor);
}
```

### Praxis-Tipp: Prüfen-Funktion

```javascript
// User gibt ein: "2 H2 + O2 = 2 H2O"
function checkUserAnswer(userInput, originalEquation) {
  // Normalisiere Leerzeichen
  const normalized = userInput.replace(/\s+/g, ' ').trim();
  const solution = balancer.balance(originalEquation);
  
  // Direkter Vergleich (nach Normalisierung)
  return normalizeEquation(normalized) === normalizeEquation(solution);
}
```

**Vorteile gegenüber eigenem Parser:**

- Keine Edge-Cases (Klammern, Ionen, etc.)
- Battle-tested Bibliothek
- Weniger Code, weniger Bugs
- Zeitersparnis: 1 Tag → 1-2 Stunden

---

## Phase 3: Erweiterte Aufgabentypen (Future)

### 3.1 Produkt ergänzen

```yaml
---
type: 'complete-equation'
reactants:
  - formula: 'CH4'
    coefficient: 1
  - formula: 'O2'
    coefficient: 2
products:
  - formula: '?'      # User muss CO2 eingeben
    coefficient: 1
  - formula: 'H2O'
    coefficient: 2
---
```

### 3.2 Reaktionstyp identifizieren

```yaml
---
type: 'identify-reaction'
equation: '2H2 + O2 → 2H2O'
options:
  - 'Synthese'
  - 'Analyse'
  - 'Austausch'
  - 'Verbrennung'
correctAnswers:
  - 'Synthese'
  - 'Verbrennung'
---
```

### 3.3 Redox-Gleichungen

```yaml
---
type: 'balance-redox'
equation: 'Fe + CuSO4 → FeSO4 + Cu'
method: 'oxidation-numbers'  # oder 'half-reactions'
---
```

---

## Für Quiz/Prüfungen

### Quiz-Integration

Der gleiche Content-Typ kann auch in Quiz verwendet werden:

```yaml
# In questions/XX-gleichung.md
---
type: 'balance-equation-quiz'
question: 'Gleiche die folgende Verbrennungsreaktion aus:'
reactants:
  - formula: 'C₃H₈'
    coefficient: 1
  - formula: 'O₂'
    coefficient: 5
products:
  - formula: 'CO₂'
    coefficient: 3
  - formula: 'H₂O'
    coefficient: 4
points: 2
partialCredit: true  # Teilpunkte für teilweise richtig
---
```

### Bewertungslogik

```javascript
function scoreBalanceEquation(userAnswers, correctAnswers) {
  const total = correctAnswers.length;
  let correct = 0;
  
  userAnswers.forEach((answer, i) => {
    if (answer === correctAnswers[i]) correct++;
  });
  
  if (partialCredit) {
    return (correct / total) * points;
  } else {
    return correct === total ? points : 0;
  }
}
```

---

## Implementierungs-Reihenfolge

### Phase 1 (MVP)

1. [ ] KaTeX mhchem-Extension in index.html + sw.js einbinden
2. [ ] `renderBalanceEquation()` in lecture.js
3. [ ] Switch-Case für 'balance-equation'
4. [ ] Validation Rules in validate-content.html
5. [ ] Test-Datei erstellen
6. [ ] Dokumentation in CONTENT_TEMPLATES.md
7. [ ] Styling für Dark Mode
8. [ ] Mobile-Responsive prüfen

### Phase 2 (Auto-Validierung)

1. [ ] chemical-balancer in index.html einbinden
2. [ ] Validierung gegen berechnete Lösung
3. [ ] Äquivalenz-Prüfung (Vielfache akzeptieren)

### Phase 3 (nach Phase 2)

1. [ ] Weitere Aufgabentypen
2. [ ] Quiz-Integration
3. [ ] Punkte-System

---

## Zeitschätzung

| Phase       | Task                          | Zeit          |
| ----------- | ----------------------------- | ------------- |
| Phase 1     | Render-Funktion + KaTeX       | 1.5 Std.      |
| Phase 1     | Event-Handling                | 30 min        |
| Phase 1     | Validation + Docs             | 30 min        |
| Phase 1     | Testing                       | 30 min        |
| **Phase 1** | **Gesamt**                    | **~3 Std.**   |
| Phase 2     | chemical-balancer Integration | 1 Std.        |
| Phase 2     | Äquivalenz-Prüfung            | 30 min        |
| **Phase 2** | **Gesamt**                    | **~1.5 Std.** |

> **Zeitersparnis durch Bibliotheken:** Phase 2 von ~1 Tag auf ~1.5 Stunden reduziert!

---

## Risiken & Offene Fragen

### Risiken

- **CDN-Verfügbarkeit:** Fallback einplanen falls jsdelivr nicht erreichbar
- **Mobile UX:** Kleine Input-Felder auf Smartphones

### Gelöste Probleme (durch Bibliotheken)

- ~~Formel-Darstellung~~ → KaTeX + mhchem (bereits integriert)
- ~~Komplexe Formeln (Klammern, Ionen)~~ → chemical-balancer parsed alles
- ~~Subscripts/Superscripts~~ → \ce{H2O} rendert automatisch
- ~~Ladezeit~~ → KaTeX ist ~3x schneller als MathJax

### Offene Fragen

1. ~~Sollen Koeffizienten von 1 angezeigt werden?~~ → Nein, wie in echter Chemie
2. Teilpunkte bei Quiz oder alles-oder-nichts? → Empfehlung: Teilpunkte
3. Soll Vielfache der Lösung akzeptiert werden? (4H2 + 2O2 = 4H2O) → Ja

---

## Beispiel-Content für Tests

```yaml
# Einfach: Wassersynthese
---
type: 'balance-equation'
title: 'Wassersynthese'
reactants:
  - formula: 'H2'
    coefficient: 2
  - formula: 'O2'
    coefficient: 1
products:
  - formula: 'H2O'
    coefficient: 2
hints:
  - 'Zähle zuerst die Sauerstoff-Atome'
explanation: 'Die Gleichung ist ausgeglichen: 4 H-Atome und 2 O-Atome auf jeder Seite.'
---

# Mittel: Verbrennung von Methan
---
type: 'balance-equation'
title: 'Methanverbrennung'
reactants:
  - formula: 'CH4'
    coefficient: 1
  - formula: 'O2'
    coefficient: 2
products:
  - formula: 'CO2'
    coefficient: 1
  - formula: 'H2O'
    coefficient: 2
---

# Schwer: Eisenoxid
---
type: 'balance-equation'
title: 'Rostbildung'
reactants:
  - formula: 'Fe'
    coefficient: 4
  - formula: 'O2'
    coefficient: 3
products:
  - formula: 'Fe2O3'
    coefficient: 2
---
```

**Hinweis zur Formel-Notation:**

- Im YAML: Einfache ASCII-Notation verwenden (`H2`, `O2`, `Fe2O3`)
- MathJax/mhchem rendert automatisch mit `\ce{H2}` → H₂
- Die Render-Funktion konvertiert `H2` → `\ce{H2}` für die Darstellung

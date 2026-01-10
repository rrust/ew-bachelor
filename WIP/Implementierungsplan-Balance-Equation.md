# Implementierungsplan: Balance-Equation Content Type

> **Status:** ⏳ Geplant
>
> **Erstellt:** 2026-01-10
>
> **Priorität:** Mittel (für Chemie-Modul)

---

## Übersicht

Interaktiver Content-Typ zum Üben und Prüfen von chemischen Gleichungen. User muss Koeffizienten eingeben, um Gleichungen auszugleichen.

| Phase   | Feature                      | Aufwand  | Status    |
| ------- | ---------------------------- | -------- | --------- |
| Phase 1 | Basis-Implementierung        | 2-3 Std. | ⏳ Geplant |
| Phase 2 | Auto-Validierung             | 1 Tag    | 📋 Backlog |
| Phase 3 | Erweiterte Aufgabentypen     | 1-2 Wo.  | 📋 Backlog |

---

## Phase 1: Basis-Implementierung (MVP)

### Konzept

User füllt Koeffizienten in vorgegebene Lücken aus. Validierung gegen vordefinierte korrekte Werte.

```
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
        <span class="ml-1 formula">${r.formula}</span>
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
        <span class="ml-1 formula">${p.formula}</span>
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
  
  // Render math in formulas
  if (window.renderMathInElement) {
    container.querySelectorAll('.formula').forEach(el => {
      renderMathInElement(el, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    });
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

## Phase 2: Auto-Validierung (Future)

### Konzept

Automatische Prüfung auf Massenerhaltung ohne vordefinierte Koeffizienten.

```yaml
---
type: 'balance-equation'
validation: 'auto'
reactants:
  - formula: 'Fe'
  - formula: 'O2'
products:
  - formula: 'Fe2O3'
# Keine Koeffizienten nötig - werden automatisch validiert
---
```

### Technische Anforderungen

1. **Formel-Parser:** `Fe2O3` → `{Fe: 2, O: 3}`
2. **Atom-Bilanzierer:** Prüft Σ Atome links = Σ Atome rechts
3. **Mehrfach-Lösungen:** 4Fe + 3O₂ → 2Fe₂O₃ ist genauso gültig wie 8Fe + 6O₂ → 4Fe₂O₃

### Formel-Parser Algorithmus

```javascript
function parseFormula(formula) {
  // Fe2O3 → {Fe: 2, O: 3}
  // Ca(OH)2 → {Ca: 1, O: 2, H: 2}
  const atoms = {};
  // ... Regex-basierter Parser
  return atoms;
}

function validateBalance(reactants, products, userCoefficients) {
  const leftAtoms = {};
  const rightAtoms = {};
  
  // Summiere Atome mit Koeffizienten
  reactants.forEach((r, i) => {
    const coef = userCoefficients.reactants[i];
    const atoms = parseFormula(r.formula);
    for (const [atom, count] of Object.entries(atoms)) {
      leftAtoms[atom] = (leftAtoms[atom] || 0) + count * coef;
    }
  });
  
  // Vergleiche beide Seiten
  return JSON.stringify(leftAtoms) === JSON.stringify(rightAtoms);
}
```

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

1. [ ] `renderBalanceEquation()` in lecture.js
2. [ ] Switch-Case für 'balance-equation'
3. [ ] Validation Rules in validate-content.html
4. [ ] Test-Datei erstellen
5. [ ] Dokumentation in CONTENT_TEMPLATES.md
6. [ ] Styling für Dark Mode
7. [ ] Mobile-Responsive prüfen

### Phase 2 (nach Phase 1)

1. [ ] Formel-Parser entwickeln
2. [ ] Auto-Validierung implementieren
3. [ ] Edge-Cases behandeln (Klammern, Ionen, etc.)

### Phase 3 (nach Phase 2)

1. [ ] Weitere Aufgabentypen
2. [ ] Quiz-Integration
3. [ ] Punkte-System

---

## Zeitschätzung

| Phase   | Task                         | Zeit       |
| ------- | ---------------------------- | ---------- |
| Phase 1 | Render-Funktion              | 1.5 Std.   |
| Phase 1 | Event-Handling               | 30 min     |
| Phase 1 | Validation + Docs            | 30 min     |
| Phase 1 | Testing                      | 30 min     |
| **Phase 1** | **Gesamt**               | **~3 Std.**|
| Phase 2 | Formel-Parser                | 2-3 Std.   |
| Phase 2 | Auto-Validierung             | 2-3 Std.   |
| **Phase 2** | **Gesamt**               | **~1 Tag** |

---

## Risiken & Offene Fragen

### Risiken

- **Formel-Darstellung:** Subscripts (H₂) vs LaTeX ($H_2$) - KaTeX verwenden
- **Mobile UX:** Kleine Input-Felder auf Smartphones
- **Komplexe Formeln:** Ca(OH)₂, Fe₂(SO₄)₃ brauchen guten Parser

### Offene Fragen

1. Sollen Koeffizienten von 1 angezeigt werden oder leer bleiben?
2. Wie mit Ionen umgehen? (Na⁺, Cl⁻)
3. Aggregatzustände anzeigen? (g), (l), (s), (aq)
4. Teilpunkte bei Quiz oder alles-oder-nichts?

---

## Beispiel-Content für Tests

```yaml
# Einfach: Wassersynthese
---
type: 'balance-equation'
title: 'Wassersynthese'
reactants:
  - formula: '$H_2$'
    coefficient: 2
  - formula: '$O_2$'
    coefficient: 1
products:
  - formula: '$H_2O$'
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
  - formula: '$CH_4$'
    coefficient: 1
  - formula: '$O_2$'
    coefficient: 2
products:
  - formula: '$CO_2$'
    coefficient: 1
  - formula: '$H_2O$'
    coefficient: 2
---

# Schwer: Eisenoxid
---
type: 'balance-equation'
title: 'Rostbildung'
reactants:
  - formula: '$Fe$'
    coefficient: 4
  - formula: '$O_2$'
    coefficient: 3
products:
  - formula: '$Fe_2O_3$'
    coefficient: 2
---
```

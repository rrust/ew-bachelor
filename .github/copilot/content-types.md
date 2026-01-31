# Content Types Reference

YAML-Referenz für alle Content-Typen in der Lern-App.

## Übersicht

| Typ                        | Frontmatter | Body           | Verwendung             |
| -------------------------- | ----------- | -------------- | ---------------------- |
| `learning-content`         | minimal     | ✅ Markdown     | Theorie, Konzepte      |
| `youtube-video`            | minimal     | ✅ Beschreibung | Eingebettete Videos    |
| `self-assessment-mc`       | **ALLE**    | ❌              | Quiz-Selbstcheck       |
| `self-assessment`          | **ALLE**    | ❌              | Checkliste             |
| `fill-in-the-blank`        | **ALLE**    | ❌              | Lückentexte            |
| `matching`                 | **ALLE**    | ❌              | Zuordnung              |
| `ordering`                 | **ALLE**    | ❌              | Sortierung             |
| `calculation`              | **ALLE**    | ❌              | Berechnungen           |
| `practice-exercise`        | **ALLE**    | ❌              | Praxis-Übung           |
| `multiple-choice`          | **ALLE**    | ❌              | Quiz (1 richtig)       |
| `multiple-choice-multiple` | **ALLE**    | ❌              | Quiz (mehrere richtig) |
| `achievement`              | **ALLE**    | ✅ Cheat-Sheet  | Belohnung              |
| `achievement` (blueprint)  | **ALLE**    | ✅ Lösungsweg   | Übungs-Blueprint       |
| `training-exercise`        | YAML-Datei  | ❌              | Modul-Training-Übung   |

## Content-Types im Detail

### learning-content

Hauptinhalt für Theorie und Erklärungen.

```yaml
---
type: 'learning-content'
sourceRefs:           # Optional
  - sourceId: 'vorlesung-k1'
    pages: '23-25'
---

# Überschrift

Markdown-Inhalt hier...

## Unterabschnitt

- Listen
- Formeln: $E = mc^2$
- Tabellen
```

### youtube-video

Eingebettetes YouTube-Video.

```yaml
---
type: 'youtube-video'
url: 'https://www.youtube.com/watch?v=VIDEO_ID'
sourceRefs:           # Optional
  - sourceId: 'video-1'
---

Optionale Beschreibung des Videos.
```

⚠️ **WICHTIG:** Video-URL muss mit oEmbed verifiziert sein!

### self-assessment-mc

Einfache MC-Frage zur Selbstüberprüfung (1 richtige Antwort).

```yaml
---
type: 'self-assessment-mc'
question: 'Was ist die Ordnungszahl von Kohlenstoff?'
options:
  - '4'
  - '6'
  - '12'
  - '14'
correctAnswer: '6'
explanation: 'Die Ordnungszahl gibt die Anzahl der Protonen an. Kohlenstoff hat 6 Protonen.'
---
```

### self-assessment

Checkliste zur Selbsteinschätzung (keine Quiz-Frage).

```yaml
---
type: 'self-assessment'
question: 'Bist du bereit für den Test?'
checkpoints:
  - 'Ich kann die Ordnungszahl erklären'
  - 'Ich kann Isotope unterscheiden'
  - 'Ich kann die Elektronenkonfiguration aufstellen'
---
```

### fill-in-the-blank

Lückentext mit Platzhaltern.

```yaml
---
type: 'fill-in-the-blank'
question: 'Ergänze die Lücken zur Gitterenergie:'
text: 'Die Lösungsenthalpie setzt sich aus der {{Gitter}}energie und der {{Hydratation}}senthalpie zusammen.'
blanks:
  - answer: 'Gitter'
    alternatives:
      - 'Gitterenergie'
  - answer: 'Hydratation'
    alternatives:
      - 'Hydratations'
explanation: 'ΔH_Lösung = ΔH_Gitter + ΔH_Hydratation'
---
```

### matching

Zuordnungsaufgabe (Begriff → Definition).

```yaml
---
type: 'matching'
question: 'Ordne die Begriffe den Definitionen zu:'
pairs:
  - left: 'Kation'
    right: 'Positiv geladenes Ion'
  - left: 'Anion'
    right: 'Negativ geladenes Ion'
  - left: 'Isotop'
    right: 'Atome mit gleicher Protonenzahl, unterschiedlicher Neutronenzahl'
explanation: 'Ionen entstehen durch Elektronenaufnahme oder -abgabe.'
---
```

Alternative Feldnamen (`term`/`match`) werden auch unterstützt.

### ordering

Sortieraufgabe (richtige Reihenfolge).

```yaml
---
type: 'ordering'
question: 'Sortiere die Schritte der Zellatmung:'
items:
  - 'Glykolyse'
  - 'Oxidative Decarboxylierung'
  - 'Citratzyklus'
  - 'Atmungskette'
explanation: 'Die Zellatmung verläuft in dieser Reihenfolge.'
---
```

Die `items`-Liste zeigt die **korrekte** Reihenfolge. Die App mischt sie automatisch.

### calculation

Berechnungsaufgabe mit numerischer Antwort.

```yaml
---
type: 'calculation'
question: 'Berechne die molare Masse von H₂O.'
correctAnswer: 18
unit: 'g/mol'
tolerance: 0.5         # Optional: erlaubte Abweichung
hint: 'H: 1 g/mol, O: 16 g/mol'  # Optional
explanation: 'M(H₂O) = 2 × 1 + 16 = 18 g/mol'
---
```

### practice-exercise

Praxis-Übung mit Alltagsszenario.

```yaml
---
type: 'practice-exercise'
title: 'Nährwertberechnung'
scenario: 'Du planst ein Frühstück und möchtest den Kaloriengehalt berechnen.'
tasks:
  - description: 'Berechne den Energiegehalt von 50g Haferflocken (370 kcal/100g).'
    solution: '185 kcal'
  - type: 'calculation'
    question: 'Wie viel Protein enthalten 200ml Milch (3.4g/100ml)?'
    correctAnswer: 6.8
    unit: 'g'
explanation: 'Dreisatzrechnung ist die Basis für Nährwertberechnungen.'
---
```

### multiple-choice (Quiz)

Quiz-Frage mit **einer** richtigen Antwort.

```yaml
---
type: 'multiple-choice'
question: 'Was ist die Einheit der Stoffmenge?'
options:
  - 'Gramm'
  - 'Mol'
  - 'Liter'
  - 'Kelvin'
correctAnswer: 'Mol'
explanation: 'Die SI-Einheit der Stoffmenge ist das Mol.'
---
```

### multiple-choice-multiple (Quiz)

Quiz-Frage mit **mehreren** richtigen Antworten.

```yaml
---
type: 'multiple-choice-multiple'
question: 'Welche sind Alkalimetalle?'
options:
  - 'Natrium'
  - 'Calcium'
  - 'Kalium'
  - 'Magnesium'
correctAnswers:        # PLURAL!
  - 'Natrium'
  - 'Kalium'
explanation: 'Natrium und Kalium sind in Gruppe 1 (Alkalimetalle).'
---
```

⚠️ **ACHTUNG:** `correctAnswers` (Plural!), nicht `correctAnswer`!

### achievement

Cheat-Sheet als Belohnung für bestandene Quiz.

```yaml
---
type: 'achievement'
id: 'periodensystem-cheatsheet'
title: 'Periodensystem Cheat-Sheet'
description: 'Kompakte Übersicht zum Periodensystem'
icon: 'clipboard'
contentType: 'markdown'
unlockCondition:
  type: 'lecture-quiz-gold'
  lectureId: '01-periodensystem'
  moduleId: '01-chemie-grundlagen'
defaultDuration: 30
extensionDuration: 14
warningThreshold: 7
---

# Periodensystem – Cheat-Sheet

## Gruppen und Perioden

Inhalt hier...
```

### achievement (Blueprint)

Blueprint als Belohnung für gelöste praktische Übungen im Modul-Training.

```yaml
---
type: 'achievement'
achievementType: 'blueprint'
id: 'stoichiometry-calculation-blueprint'
title: 'Stöchiometrie Blueprint'
description: 'Systematischer Lösungsweg für stöchiometrische Berechnungen'
icon: 'beaker'
contentType: 'markdown'
unlockCondition:
  type: 'first-exercise-solved'
  exerciseType: 'stoichiometry-calculation'
  moduleId: '02-chemie-grundlagen'
defaultDuration: 30
extensionDuration: 14
warningThreshold: 7
---

# Stöchiometrie Blueprint

## Allgemeiner Lösungsweg

### Schritt 1: Reaktionsgleichung aufstellen
...
```

**Blueprint vs. Cheatsheet:**

| Eigenschaft       | Cheatsheet                | Blueprint                      |
| ----------------- | ------------------------- | ------------------------------ |
| `achievementType` | (nicht gesetzt)           | `'blueprint'`                  |
| Unlock            | Quiz Gold-Badge           | Erste Übung eines Typs gelöst  |
| Inhalt            | Kompakte Zusammenfassung  | Lösungsweg mit Musterbeispiel  |
| Verlängerung      | Tokens oder Quick-Renewal | Tokens oder Übung erneut lösen |

---

## Modul-Training Content-Types

### training-exercise (Praktische Übung)

Praktische Übung für Modul-Training mit schrittweisem Lösungsweg.

**Datei:** `exercises.yaml` im Kapitel-Ordner

```yaml
# exercises.yaml
topic: 'Chemische Gleichungen & Stöchiometrie'
blueprintType: 'stoichiometry-calculation'  # Verknüpfung zum Blueprint
exercises:
  - id: 'ex-03-01'
    title: 'Verbrennung von Kohlenstoff'
    level: 3  # 1-5 Schwierigkeitsstufe
    
    task: |
      Bei der vollständigen Verbrennung von 12,0 g Kohlenstoff
      mit Sauerstoff entsteht Kohlendioxid.
      
      Berechne:
      a) Die Stoffmenge an Kohlenstoff
      b) Die benötigte Masse an Sauerstoff
      c) Die entstehende Masse an CO₂
    
    hints:
      keyword: 'Stoffmengenverhältnis aus Reaktionsgleichung'
      approach: |
        1. Reaktionsgleichung aufstellen
        2. Stoffmengen über n = m/M berechnen
        3. Stöchiometrische Verhältnisse anwenden
      overview: |
        - Reaktionsgleichung: C + O₂ → CO₂
        - n(C) = 1,0 mol
        - n(O₂) = 1,0 mol → m(O₂) = 32,0 g
        - n(CO₂) = 1,0 mol → m(CO₂) = 44,0 g
    
    steps:
      - description: 'Reaktionsgleichung aufstellen'
        solution: 'C + O₂ → CO₂'
      - description: 'Stoffmenge von Kohlenstoff berechnen (n = m/M)'
        solution: 'n(C) = 12,0 g / 12,0 g/mol = 1,0 mol'
      - description: 'Stoffmenge O₂ aus stöchiometrischem Verhältnis (1:1)'
        solution: 'n(O₂) = 1,0 mol'
      - description: 'Masse des Sauerstoffs berechnen (m = n × M)'
        solution: 'm(O₂) = 1,0 mol × 32,0 g/mol = 32,0 g'
      - description: 'Stoffmenge CO₂ aus Verhältnis (1:1)'
        solution: 'n(CO₂) = 1,0 mol'
      - description: 'Masse des Kohlendioxids berechnen'
        solution: 'm(CO₂) = 1,0 mol × 44,0 g/mol = 44,0 g'
    
    finalAnswer: |
      a) n(C) = 1,0 mol
      b) m(O₂) = 32,0 g
      c) m(CO₂) = 44,0 g
    
    relatedCheatsheets:
      - 'stoechiometrie-cheatsheet'
    relatedBlueprints:
      - 'stoichiometry-calculation-blueprint'
```

**Pflichtfelder:**

| Feld                  | Typ    | Beschreibung                    |
| --------------------- | ------ | ------------------------------- |
| `id`                  | string | Eindeutige ID (z.B. `ex-03-01`) |
| `title`               | string | Kurzer Titel der Übung          |
| `level`               | number | Schwierigkeitsstufe 1-5         |
| `task`                | string | Aufgabenstellung (Markdown)     |
| `hints.keyword`       | string | Stichwort-Hinweis               |
| `hints.approach`      | string | Lösungsansatz                   |
| `hints.overview`      | string | Lösungsweg-Übersicht            |
| `steps`               | array  | Liste der Lösungsschritte       |
| `steps[].description` | string | Beschreibung des Schritts       |
| `steps[].solution`    | string | Lösung des Schritts             |
| `finalAnswer`         | string | Endergebnis (Markdown)          |

**Optionale Felder:**

| Feld                 | Typ   | Beschreibung              |
| -------------------- | ----- | ------------------------- |
| `relatedCheatsheets` | array | Verknüpfte Cheatsheet-IDs |
| `relatedBlueprints`  | array | Verknüpfte Blueprint-IDs  |

**Level-Definitionen für Übungen:**

| Level | Komplexität   | Schritte | Beispiel                             |
| ----- | ------------- | -------- | ------------------------------------ |
| 1     | Grundlegend   | 2-3      | Einfache n=m/M Berechnung            |
| 2     | Einfach       | 3-4      | Mol-Berechnung mit Umrechnung        |
| 3     | Mittel        | 4-5      | Stöchiometrie mit Reaktionsgleichung |
| 4     | Komplex       | 5-7      | Mehrstufige Reaktion, Ausbeute       |
| 5     | Anspruchsvoll | 6-8+     | Transfer, unbekannte Kontexte        |

## Häufige Fehler

| Fehler                      | Problem                 | Lösung                     |
| --------------------------- | ----------------------- | -------------------------- |
| `correctAnswer` bei MCM     | Falsche Feldname        | `correctAnswers` (Plural!) |
| Body bei self-assessment-mc | Wird ignoriert          | Alles ins Frontmatter      |
| `---` im Markdown           | YAML-Separator          | `***` für Linien           |
| `*` in YAML-Listen          | Parser-Fehler           | Immer `-` verwenden        |
| Antwort ≠ Option            | Validierung fehlschlägt | Exakt gleicher Text        |

## Gültige Icons

Für `achievement`-Typ:
`search`, `menuDots`, `sun`, `moon`, `close`, `modules`, `chart`, `cog`, `map`, `trophy`, `achievement`, `phone`, `phoneDownload`, `checkCircle`, `book`, `zoomIn`, `zoomOut`, `reset`, `externalLink`, `lock`, `unlock`, `clock`, `hourglass`, `document`, `clipboard`, `apple`, `beaker`, `graduationCap`, `download`, `upload`, `hourglassEmpty`, `check`, `rocket`, `fire`, `muscle`, `star`, `wave`

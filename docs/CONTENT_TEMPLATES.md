# Content Templates

Diese Templates helfen beim Erstellen neuer Lerninhalte mit korrekter Struktur.

## TL;DR - Quick Reference

**Für Menschen:** Passende Vorlage kopieren, anpassen, validieren.
**Für AI-Agents:** Nutze exakt diese Strukturen für Content-Generierung.

### Template-Übersicht

| Typ                 | Verwendung                  | Link                                                           |
| ------------------- | --------------------------- | -------------------------------------------------------------- |
| Modul-Metadaten     | `module.md` im Modul-Ordner | [→ Vorlage](#modul-metadaten-modulemd)                         |
| Achievement         | `achievements/NN-name.md`   | [→ Vorlage](#achievement-cheat-sheet)                          |
| Quiz-Frage (single) | `questions/NN-name.md`      | [→ Vorlage](#einfache-multiple-choice-eine-richtige-antwort)   |
| Quiz-Frage (multi)  | `questions/NN-name.md`      | [→ Vorlage](#multiple-choice-mit-mehreren-richtigen-antworten) |
| Self-Assessment     | `lecture-items/NN-name.md`  | [→ Vorlage](#self-assessment-in-lecturemd)                     |
| Lerninhalt (Text)   | `lecture-items/NN-name.md`  | [→ Vorlage](#learning-content-in-lecturemd)                    |
| YouTube Video       | `lecture-items/NN-name.md`  | [→ Vorlage](#youtube-video-in-lecturemd)                       |
| External Video      | `lecture-items/NN-name.md`  | [→ Vorlage](#external-video-in-lecturemd)                      |
| Bild                | `lecture-items/NN-name.md`  | [→ Vorlage](#image-in-lecturemd)                               |
| Mermaid Diagramm    | `lecture-items/NN-name.md`  | [→ Vorlage](#mermaid-diagram-in-lecturemd)                     |
| Balance Equation    | `lecture-items/NN-name.md`  | [→ Vorlage](#balance-equation-in-lecturemd)                    |

### Kritische YAML-Regeln

```yaml
# ✅ RICHTIG - Bindestrich mit 2 Leerzeichen Einrückung
options:
  - 'Option 1'
  - 'Option 2'

# ❌ FALSCH - Asterisk oder keine Einrückung
options:
* 'Option 1'      # Falsch: Asterisk
- 'Option 2'      # Falsch: Keine Einrückung
```

**Goldene Regeln:**
- `correctAnswer` muss EXAKT mit einer Option übereinstimmen!
- ⚠️ **NIEMALS `---` im Markdown-Content verwenden!** Der Parser interpretiert `---` als YAML-Dokumententrenner. Für horizontale Linien stattdessen `***` oder einfach Leerzeilen nutzen.

→ [Häufige Fehler](#häufige-fehler) | [Validierung](#validierung)

---

## Modul-Metadaten (module.md)

Jeder Modul-Ordner muss eine `module.md` enthalten:

```markdown
---
id: '01-ernaehrungslehre-grundlagen'
title: 'Grundlagen der Ernährungslehre'
ects: 6
status: 'freigeschaltet'
order: 1
description: 'Einführung in die Grundlagen der Ernährungswissenschaft'
---

# Grundlagen der Ernährungslehre

Dieses Modul vermittelt die Grundlagen...

## Lernziele

- Lernziel 1
- Lernziel 2

## Voraussetzungen

Keine - dies ist ein Einstiegsmodul.
```

**Pflichtfelder:**

| Feld          | Typ    | Beschreibung                                       |
| ------------- | ------ | -------------------------------------------------- |
| `id`          | String | Eindeutige ID (sollte dem Ordnernamen entsprechen) |
| `title`       | String | Anzeigename des Moduls                             |
| `ects`        | Number | ECTS-Punkte                                        |
| `status`      | String | `'freigeschaltet'` oder `'gesperrt'`               |
| `order`       | Number | Reihenfolge in der Modulübersicht (1, 2, 3...)     |
| `description` | String | Kurzbeschreibung für die Modulübersicht            |

**Automatisch erkannt (nicht manuell pflegen!):**

- `lectures`: Alle Unterordner mit `lecture.md`
- `achievements`: Alle Dateien im `achievements/` Ordner

## Achievement (Cheat-Sheet)

Achievements werden freigeschaltet, wenn der Benutzer ein Quiz mit Gold-Status (≥90%) besteht. Sie enthalten nützliche Zusammenfassungen.

**Speicherort:** `content/{studyId}/NN-modul/achievements/NN-name.md`

```markdown
---
type: 'achievement'
id: 'thema-cheatsheet'
title: 'Thema Cheat-Sheet'
description: 'Kompakte Zusammenfassung aller wichtigen Konzepte'
icon: 'clipboard'
contentType: 'markdown'
unlockCondition:
  type: 'lecture-quiz-gold'
  lectureId: '01-thema'
  moduleId: '01-modul-name'
defaultDuration: 30
extensionDuration: 14
warningThreshold: 7
---

# Thema – Cheat-Sheet 📋

## Abschnitt 1

Inhalt hier...

## Abschnitt 2

Weiterer Inhalt...
```

**Pflichtfelder im Frontmatter:**

| Feld                | Typ    | Beschreibung                                      |
| ------------------- | ------ | ------------------------------------------------- |
| `type`              | String | Immer `'achievement'`                             |
| `id`                | String | Eindeutige ID (z.B. `'zellbiologie-cheatsheet'`)  |
| `title`             | String | Anzeigename                                       |
| `description`       | String | Kurzbeschreibung                                  |
| `icon`              | String | Icon-Name (z.B. `'clipboard'`, `'atom'`)          |
| `contentType`       | String | Immer `'markdown'`                                |
| `unlockCondition`   | Object | Bedingung zum Freischalten (siehe unten)          |
| `defaultDuration`   | Number | Gültigkeitsdauer in Tagen (Standard: 30)          |
| `extensionDuration` | Number | Verlängerung bei korrekter Antwort (Standard: 14) |
| `warningThreshold`  | Number | Tage vor Ablauf für Warnung (Standard: 7)         |

**unlockCondition-Objekt:**

```yaml
unlockCondition:
  type: 'lecture-quiz-gold'
  lectureId: '01-thema'        # ID der Vorlesung
  moduleId: '01-modul-name'    # ID des Moduls
```

⚠️ **WICHTIG für den Markdown-Content:**

- **NIEMALS `---` als horizontale Linie verwenden!** Der Parser interpretiert `---` als YAML-Dokumententrenner.
- Für visuelle Trennung: `***` verwenden oder einfach Leerzeilen und `##` Überschriften.

## Vorlesungs-Metadaten (lecture.md)

```markdown
---
topic: 'Materie und Messen'
description: 'Einführung in Chemie, Atome und Messgrößen'
estimatedTime: 45
sources:
  - id: 'vorlesung-k1'
    title: 'Vorlesungsfolien Kapitel 1 (WS2025)'
    url: 'https://moodle.univie.ac.at/path/to/Kapitel1.pdf'
    type: 'pdf'
  - id: 'mortimer'
    title: 'Mortimer & Müller: Chemie - Das Basiswissen (10. Aufl.)'
    url: null
    type: 'book'
---

# Materie und Messen

Kurze Einleitung oder Lernziele.
```

**Pflichtfelder:**

| Feld          | Typ    | Beschreibung                             |
| ------------- | ------ | ---------------------------------------- |
| `topic`       | String | Titel der Vorlesung                      |
| `description` | String | Kurzbeschreibung für die Vorlesungsliste |

**Optionale Felder:**

| Feld            | Typ    | Beschreibung                    |
| --------------- | ------ | ------------------------------- |
| `estimatedTime` | Number | Geschätzte Lernzeit in Minuten  |
| `sources`       | Array  | Quellenreferenzen (siehe unten) |

**Source-Objekte:**

| Feld    | Typ    | Beschreibung                              |
| ------- | ------ | ----------------------------------------- |
| `id`    | String | Eindeutige ID für Referenzierung in Items |
| `title` | String | Anzeigename der Quelle                    |
| `url`   | String | Link zur Quelle (oder `null` bei Büchern) |
| `type`  | String | `'pdf'`, `'book'`, `'video'`, `'website'` |

## Quiz-Frage (quiz.md)

### Einfache Multiple-Choice (eine richtige Antwort)

```markdown
---
type: 'multiple-choice'
question: 'Was ist ...?'
options:
  - 'Falsche Antwort 1'
  - 'Richtige Antwort'
  - 'Falsche Antwort 2'
  - 'Falsche Antwort 3'
correctAnswer: 'Richtige Antwort'
---
```

### Multiple-Choice mit mehreren richtigen Antworten

```markdown
---
type: 'multiple-choice-multiple'
question: 'Welche der folgenden Aussagen sind korrekt? (Mehrfachauswahl möglich)'
options:
  - 'Richtige Aussage 1'
  - 'Falsche Aussage'
  - 'Richtige Aussage 2'
  - 'Richtige Aussage 3'
correctAnswers:
  - 'Richtige Aussage 1'
  - 'Richtige Aussage 2'
  - 'Richtige Aussage 3'
---

**Erklärung:** Detaillierte Erklärung, warum diese Antworten richtig sind.
```

**Wichtig:**

- `options:` muss eine Liste mit `-` (Bindestrich) und 2 Leerzeichen Einrückung sein
- Niemals `*` (Stern) für Listen verwenden!
- Einfache MC: `correctAnswer` (Singular) - genau eine richtige Antwort
- Multiple MC: `correctAnswers` (Plural) - eine oder mehrere richtige Antworten
- Alle `correctAnswers` müssen exakt mit Optionen übereinstimmen
- Mindestens 2 Optionen erforderlich
- Bei Multiple MC können auch alle Optionen richtig sein

## Self-Assessment (in lecture.md)

```markdown
---
type: 'self-assessment-mc'
topic: 'Thema der Vorlesung'
question: 'Testfrage zum Verständnis?'
options:
  - 'Antwort A'
  - 'Antwort B'
  - 'Antwort C'
  - 'Antwort D'
correctAnswer: 'Antwort B'
---

**Erklärung:** Detaillierte Erklärung, warum diese Antwort richtig ist.
```

## Learning Content (in lecture.md)

### Einfacher Lerninhalt

```markdown
---
type: 'learning-content'
topic: 'Themenbereich'
---

## Überschrift

Normaler Markdown-Inhalt mit Text, Listen, etc.

- Listenpunkt 1
- Listenpunkt 2

**Fett** und *kursiv* formatierter Text.
```

### Lerninhalt mit Quellenreferenz

```markdown
---
type: 'learning-content'
topic: 'Einführung in die Chemie'
sourceRefs:
  - sourceId: 'vorlesung-k1'
    pages: '23-25'
---

## Was ist Chemie?

Inhalt basierend auf der Originalquelle...
```

### Lerninhalt mit mehreren Quellen

```markdown
---
type: 'learning-content'
topic: 'Periodensystem'
sourceRefs:
  - sourceId: 'vorlesung-k1'
    pages: '71, 73, 76'
  - sourceId: 'mortimer'
    pages: '45-48'
---

## Das Periodensystem der Elemente

Inhalt mit Referenzen zu verschiedenen Quellen...
```

**SourceRef-Felder:**

| Feld       | Typ    | Beschreibung                                        |
| ---------- | ------ | --------------------------------------------------- |
| `sourceId` | String | ID einer Quelle aus `sources` in `lecture.md`       |
| `pages`    | String | Seitenangabe(n), z.B. `'23-25'` oder `'71, 73, 76'` |

## YouTube Video (in lecture.md)

```markdown
---
type: 'youtube-video'
url: 'https://www.youtube.com/watch?v=VIDEO_ID'
title: 'Video-Titel (optional)'
---
```

**Wichtig:**

- URL muss vollständige YouTube-URL sein (mit `watch?v=`)
- Kurz-URLs (youtu.be) werden auch unterstützt
- Video wird responsive eingebettet (16:9 Seitenverhältnis)

## External Video (in lecture.md)

Für externe Videos, die Login erfordern (z.B. Moodle, LMS):

```markdown
---
type: 'external-video'
url: 'https://moodle.univie.ac.at/mod/page/view.php?id=12345'
title: 'Vorlesung 1: Materie und Messen'
description: 'Öffnet die Uni-Wien Moodle-Seite (Login erforderlich)'
duration: '45 min'
---
```

**Felder:**

| Feld          | Pflicht | Beschreibung                                           |
| ------------- | ------- | ------------------------------------------------------ |
| `type`        | Ja      | Muss `'external-video'` sein                           |
| `url`         | Ja      | Vollständige URL zum externen Video                    |
| `title`       | Nein    | Titel des Videos (Standard: "Externes Video")          |
| `description` | Nein    | Beschreibung/Hinweis (Standard: "Öffnet in neuem Tab") |
| `duration`    | Nein    | Geschätzte Dauer (z.B. "45 min")                       |

**Wichtig:**

- Link öffnet in neuem Tab
- Benutzer wird aufgefordert, nach dem Ansehen zurückzukehren
- Ideal für Uni-Videos, die Authentifizierung erfordern

## Image (in lecture.md)

```markdown
---
type: 'image'
url: 'https://example.com/path/to/image.png'
alt: 'Beschreibung des Bildes für Screenreader'
caption: 'Optionale Bildunterschrift (optional)'
title: 'Bildtitel (optional)'
---
```

**Wichtig:**

- `url` kann remote URL oder lokaler Pfad sein
- `alt` ist Pflichtfeld für Barrierefreiheit
- Bild wird zentriert und responsive dargestellt
- Unterstützte Formate: PNG, JPG, GIF, SVG, WebP

## Mermaid Diagram (in lecture.md)

```markdown
---
type: 'mermaid-diagram'
title: 'Diagramm-Titel (optional)'
---
```mermaid
graph TD
    A[Start] --> B[Prozess]
    B --> C{Entscheidung}
    C -->|Ja| D[Ergebnis 1]
    C -->|Nein| E[Ergebnis 2]
```

**Wichtig:**

- Mermaid-Code muss in \`\`\`mermaid Code-Block eingeschlossen sein
- Unterstützt: Flowcharts, Sequence Diagrams, Class Diagrams, etc.
- Siehe [Mermaid Dokumentation](https://mermaid.js.org/) für Syntax
- Diagramme werden automatisch gerendert

**Beispiel Flowchart:**

```markdown
---
type: 'mermaid-diagram'
title: 'Zellatmung Übersicht'
---
```mermaid
graph LR
    A[Glukose] --> B[Glykolyse]
    B --> C[Citratzyklus]
    C --> D[Atmungskette]
    D --> E[ATP]
```

## Balance Equation (in lecture.md)

Interaktive Übung zum Ausgleichen chemischer Gleichungen:

```markdown
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
  - 'Zähle zuerst die Sauerstoff-Atome auf beiden Seiten'
  - 'Ein O2-Molekül hat 2 Sauerstoff-Atome'
explanation: 'Die Gleichung ist ausgeglichen: 4 H-Atome und 2 O-Atome auf jeder Seite.'
---
```

**Felder:**

| Feld          | Pflicht | Beschreibung                                       |
| ------------- | ------- | -------------------------------------------------- |
| `type`        | Ja      | Muss `'balance-equation'` sein                     |
| `reactants`   | Ja      | Liste der Edukte mit `formula` und `coefficient`   |
| `products`    | Ja      | Liste der Produkte mit `formula` und `coefficient` |
| `title`       | Nein    | Überschrift der Übung                              |
| `hints`       | Nein    | Liste von Hinweisen (ausklappbar)                  |
| `explanation` | Nein    | Erklärung bei richtiger Lösung                     |

**Formel-Notation:**

- Im YAML: ASCII-Notation verwenden (`H2`, `O2`, `Fe2O3`, `CH4`)
- KaTeX/mhchem rendert automatisch: H2 → H₂, Fe2O3 → Fe₂O₃
- Unterstützt: Subscripts, Ionenladungen (Na+, Cl-), Reaktionspfeile

**Beispiel: Methanverbrennung (schwieriger):**

```markdown
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
```

## Vollständige Vorlesung (lecture.md)

```markdown
---
type: 'learning-content'
---

## Hauptthema

Einführungstext zum Thema.

### Unterthema 1

Detaillierter Inhalt...

---
type: 'self-assessment-mc'
topic: 'Hauptthema'
question: 'Verständnisfrage?'
options:
  - 'Option 1'
  - 'Option 2'
  - 'Option 3'
  - 'Option 4'
correctAnswer: 'Option 2'
---

**Erklärung:** Warum Option 2 korrekt ist.

---
type: 'learning-content'
---

### Unterthema 2

Weiterer Inhalt...
```

## Häufige Fehler

### ❌ FALSCH - Sterne statt Bindestriche

```yaml
options:

* 'Option 1'
* 'Option 2'
```

### ✅ RICHTIG - Bindestriche mit Einrückung

```yaml
options:
  - 'Option 1'
  - 'Option 2'
```

### ❌ FALSCH - Fehlende Einrückung

```yaml
options:
- 'Option 1'
- 'Option 2'
```

### ✅ RICHTIG - 2 Leerzeichen Einrückung

```yaml
options:
  - 'Option 1'
  - 'Option 2'
```

### ❌ FALSCH - correctAnswer stimmt nicht überein

```yaml
options:
  - 'Die Antwort'
  - 'Andere Antwort'
correctAnswer: 'Die richtige Antwort'  # Nicht in der Liste!
```

### ✅ RICHTIG - Exakte Übereinstimmung

```yaml
options:
  - 'Die Antwort'
  - 'Andere Antwort'
correctAnswer: 'Die Antwort'
```

## Validierung

Vor dem Commit immer validieren:

```bash
node validate-content.js
```

Oder in VS Code: `Cmd+Shift+P` → "Run Task" → "Validate Content"

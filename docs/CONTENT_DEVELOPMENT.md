# Content Development Guide

Dieser Leitfaden richtet sich an Content-Ersteller, die Lernmaterialien für die Ernährungswissenschaft Lern-App entwickeln.

## TL;DR - Quick Start

**In 3 Schritten Content erstellen:**

1. **Template kopieren** aus [CONTENT_TEMPLATES.md](CONTENT_TEMPLATES.md)
2. **Datei erstellen** in `content/{studyId}/XX-modul/XX-vorlesung/lecture-items/` oder `questions/`
3. **Validieren** mit `validate-content.html` im Browser (unter "Tools")

**Wichtigste Regeln:**
- ✅ YAML-Listen mit `-` (dash), NIEMALS `*` (asterisk)
- ✅ `correctAnswer` muss EXAKT mit Option übereinstimmen
- ✅ Dateien mit `NN-` prefix nummerieren (01-, 02-, etc.)
- ✅ `content-list.json` wird automatisch generiert (GitHub Action)

**Bei Problemen:**
- Validator zeigt Fehler mit Zeilennummer → Im Editor fixen
- YAML-Syntax prüfen (Einrückung, Anführungszeichen)
- Markdown linten: `npx markdownlint-cli2 "**/*.md"`

---

## Überblick

Die App lädt Inhalte aus Markdown-Dateien mit YAML-Frontmatter. Alle Inhalte befinden sich im `content/{studyId}/` Ordner (z.B. `content/bsc-ernaehrungswissenschaften/`) und werden über `content-list.json` pro Studiengang registriert.

### Unterschied zu App-Entwicklung

- **App-Entwicklung:** Änderungen an HTML, CSS, JavaScript, UI/UX
- **Content-Entwicklung:** Erstellung und Pflege von Lernmaterialien (Markdown-Dateien)

Die meiste laufende Arbeit an diesem Repository wird Content-Entwicklung sein.

## Content-Struktur

### Modulare Struktur (Standard)

Alle Inhalte sind modular aufgebaut für maximale Wartbarkeit und Übersichtlichkeit:

```text
content/
└── {studyId}/                            # z.B. bsc-ernaehrungswissenschaften
    ├── modules.json                      # Auto-generiert (nicht manuell bearbeiten!)
    ├── content-list.json                 # Auto-generiert (nicht manuell bearbeiten!)
    └── 01-modul-name/                    # Modul-Ordner (nummeriert)
    ├── module.md                         # Modul-Metadaten (Pflicht!)
    ├── achievements/                     # Achievements für dieses Modul (optional)
    │   └── 01-cheatsheet.md
    └── 01-vorlesung-thema/              # Vorlesungs-Ordner (nummeriert)
        ├── lecture.md                    # Vorlesungs-Metadaten
        ├── lecture-items/                # Einzelne Lern-Items
        │   ├── 01-einleitung.md         # Nummeriert für Reihenfolge
        │   ├── 02-konzept-test.md       # Self-Assessment
        │   ├── 03-video.md              # YouTube Video
        │   ├── 04-diagramm.md           # Mermaid Diagramm
        │   └── 05-zusammenfassung.md
        ├── quiz.md                       # Quiz-Metadaten
        └── questions/                    # Einzelne Quiz-Fragen
            ├── 01-frage-thema-a.md      # Nummeriert für Reihenfolge
            ├── 02-frage-thema-b.md
            └── 03-frage-thema-c.md
```

**✅ Vollautomatisch:** Sowohl `content-list.json` als auch `modules.json` werden automatisch generiert, wenn du auf `main` pushst (GitHub Action). Lokal kannst du `node generate-content-list.js` ausführen.

### Struktur-Prinzipien

**Warum modular?**

- ✅ **Kleine Dateien:** Einfacher zu bearbeiten und zu reviewen
- ✅ **Klare Verantwortung:** Jede Datei = ein Konzept/Frage
- ✅ **Git-freundlich:** Bessere Diffs, weniger Merge-Konflikte
- ✅ **Flexible Reihenfolge:** Einfach umnummerieren zum Umordnen
- ✅ **Einfaches Hinzufügen/Entfernen:** Neue Datei = neuer Inhalt

**Nummerierung:**

- Format: `NN-beschreibender-name.md` (z.B. `01-einleitung.md`, `02-test.md`)
- Nummern bestimmen die Reihenfolge der Anzeige
- Lücken sind erlaubt (01, 02, 05, 10...) - nützlich für spätere Einfügungen
- Beschreibender Name hilft bei der Navigation

### Modul-Ordner

Benennungskonvention: `NN-kurzbeschreibung/`

- `NN`: Zweistellige Nummer (01, 02, 03...)
- `kurzbeschreibung`: Kurzer, aussagekräftiger Name (Kleinbuchstaben, Bindestriche)

Beispiel: `01-ernaehrungslehre-grundlagen/`

**Jeder Modul-Ordner muss eine `module.md` enthalten!** (siehe unten)

### Vorlesungs-Ordner

Innerhalb eines Modul-Ordners: `NN-thema/`

- `NN`: Zweistellige Nummer der Vorlesung
- `thema`: Thema der Vorlesung

Beispiel: `01-grundlagen-zellbiologie/`

### Erforderliche Dateien

**Jeder Modul-Ordner muss enthalten:**

1. **`module.md`** - Modul-Metadaten (id, title, ects, status, order, description)

**Jeder Vorlesungs-Ordner muss enthalten:**

1. **`lecture.md`** - Metadaten (Titel, Beschreibung)
2. **`lecture-items/`** - Ordner mit einzelnen Lern-Items
3. **`quiz.md`** - Metadaten für das Quiz
4. **`questions/`** - Ordner mit einzelnen Quiz-Fragen

## Content-Formate

### 0. Modul-Metadaten (module.md)

Jeder Modul-Ordner **muss** eine `module.md` Datei enthalten. Diese definiert die Modul-Metadaten.

```yaml
---
id: '01-ernaehrungslehre-grundlagen'
title: 'Grundlagen der Ernährungslehre'
ects: 6
status: 'freigeschaltet'
order: 1
description: 'Einführung in die Grundlagen der Ernährungswissenschaft'
---

# Grundlagen der Ernährungslehre

Optionale Beschreibung des Moduls mit Lernzielen, Voraussetzungen, etc.
```

**Pflichtfelder im Frontmatter:**

| Feld          | Typ    | Beschreibung                                       |
| ------------- | ------ | -------------------------------------------------- |
| `id`          | String | Eindeutige ID (sollte dem Ordnernamen entsprechen) |
| `title`       | String | Anzeigename des Moduls                             |
| `ects`        | Number | ECTS-Punkte                                        |
| `status`      | String | `'freigeschaltet'` oder `'gesperrt'`               |
| `order`       | Number | Reihenfolge in der Modulübersicht                  |
| `description` | String | Kurzbeschreibung für die Modulübersicht            |

**Automatisch erkannt:**

- **Lectures**: Alle Unterordner mit einer `lecture.md` Datei
- **Achievements**: Alle Dateien im `achievements/` Ordner mit einer `id` im Frontmatter

### 1. Vorlesungs-Metadaten (lecture.md)

Die `lecture.md` Datei enthält **nur Metadaten** - keine Lern-Inhalte!

```yaml
---
topic: 'Grundlagen der Zellbiologie'
description: 'Einführung in den Aufbau und die Funktion von Zellen'
estimatedTime: 45
sources:
  - id: 'hauptquelle'
    title: 'Vorlesungsfolien Kapitel 1'
    url: 'https://moodle.univie.ac.at/path/to/slides.pdf'
    type: 'pdf'
  - id: 'lehrbuch'
    title: 'Mortimer & Müller: Chemie - Das Basiswissen'
    url: null
    type: 'book'
---

# Grundlagen der Zellbiologie

Kurze Einleitung oder Lernziele (optional).
```

**Pflichtfelder:**

- `topic`: Titel der Vorlesung
- `description`: Kurzbeschreibung (wird in der Vorlesungsliste angezeigt)

**Optionale Felder:**

- `estimatedTime`: Geschätzte Lernzeit in Minuten
- `sources`: Array der Quellenreferenzen (siehe [Quellenreferenz-System](#quellenreferenz-system))

### 2. Vorlesungs-Items (lecture-items/)

Jede Datei in `lecture-items/` ist ein einzelnes Lern-Element.

#### Learning Content (Text)

```yaml
---
type: 'learning-content'
topic: 'Themenbereich'
sourceRefs:
  - sourceId: 'hauptquelle'
    pages: '23-25'
---

# Überschrift

Markdown-Inhalt mit **Formatierung**, Listen, etc.
```

**Optionale Felder für Quellenreferenzen:**

- `sourceRefs`: Array mit Verweisen auf die in `lecture.md` definierten Quellen
  - `sourceId`: ID der Quelle (muss in `lecture.md` unter `sources` definiert sein)
  - `pages`: Seitenangabe(n) als String, z.B. `'23-25'` oder `'47, 53'`

Die App zeigt Quellenreferenzen als Fußnote am Ende des Content-Items an.

#### Self-Assessment Multiple Choice

```yaml
---
type: 'self-assessment-mc'
topic: 'Themenbereich'
question: 'Was ist die Hauptfunktion der Mitochondrien?'
options:
  - 'Proteinsynthese'
  - 'Energiegewinnung (ATP-Produktion)'
  - 'Speicherung von Erbinformation'
  - 'Abbau von Abfallprodukten'
correctAnswer: 'Energiegewinnung (ATP-Produktion)'
---

**Erklärung:** Hier kommt die Erklärung der richtigen Antwort.
```

**Weitere Content-Typen:**

- `youtube-video` - Eingebettete YouTube Videos
- `image` - Bilder (lokal oder remote)
- `mermaid-diagram` - Interaktive Diagramme

Siehe [CONTENT_TEMPLATES.md](CONTENT_TEMPLATES.md) für detaillierte Vorlagen.

### 3. Quiz-Metadaten (quiz.md)

Die `quiz.md` Datei enthält **nur Metadaten** - keine Fragen!

```yaml
---
description: 'Teste dein Wissen über Zellbiologie und Organellen'
---

# Quiz: Grundlagen der Zellbiologie

Überprüfe dein Verständnis der wichtigsten Konzepte aus dieser Vorlesung.
```

**Pflichtfelder:**

- `description`: Kurzbeschreibung des Quiz

### 4. Quiz-Fragen (questions/)

Jede Datei in `questions/` ist eine einzelne Multiple-Choice-Frage.

```yaml
---
type: 'multiple-choice'
question: 'Was ist die Hauptfunktion der Mitochondrien?'
options:
  - 'Proteinsynthese'
  - 'Energiegewinnung (ATP-Produktion)'
  - 'Speicherung von Erbinformation'
  - 'Abbau von Abfallprodukten'
correctAnswer: 'Energiegewinnung (ATP-Produktion)'
---

**Erklärung:** Mitochondrien sind die "Kraftwerke" der Zelle und produzieren ATP durch Zellatmung.
```

**Pflichtfelder:**

- `type`: `'multiple-choice'`
- `question`: Die Fragestellung
- `options`: Array mit mindestens 2 Antwortmöglichkeiten
- `correctAnswer`: Muss exakt einer Option entsprechen (case-sensitive!)

## YAML-Syntax: Wichtige Regeln

### ✅ RICHTIG: Listen mit Bindestrich und Einrückung

```yaml
options:
  - 'Option 1'
  - 'Option 2'
  - 'Option 3'
```

### ❌ FALSCH: Asterisk statt Bindestrich

```yaml
options:
* 'Option 1'
* 'Option 2'
```

### ❌ FALSCH: Keine Einrückung

```yaml
options:
- 'Option 1'
- 'Option 2'
```

### ❌ FALSCH: Leerzeile nach options

```yaml
options:

  - 'Option 1'
  - 'Option 2'
```

### Pflichtfelder

**Für Vorlesungs-Items:**

- `learning-content`: type
- `self-assessment-mc`: type, question, options, correctAnswer
- `youtube-video`: type, url
- `image`: type, url, alt
- `mermaid-diagram`: type

**Für Quiz-Fragen:**

- `multiple-choice`: type, question, options (min. 2), correctAnswer

**multiple-choice / self-assessment-mc:**

- `type`
- `question`
- `options` (Array mit mindestens 2 Einträgen)
- `correctAnswer` (muss in `options` enthalten sein)

**learning-content:**

- `type`

## Content-Vorlagen

Detaillierte Vorlagen mit Copy-Paste-Beispielen findest du in:
→ **[docs/CONTENT_TEMPLATES.md](CONTENT_TEMPLATES.md)**

## Neue Inhalte hinzufügen

### Schritt-für-Schritt: Neues Modul erstellen

#### 1. Modul-Ordner anlegen

```bash
mkdir content/NN-neues-modul
```

#### 2. module.md erstellen

```yaml
---
id: 'NN-neues-modul'
title: 'Titel des Moduls'
ects: 10
status: 'gesperrt'
order: 15
description: 'Kurzbeschreibung des Moduls'
---

# Titel des Moduls

Beschreibung, Lernziele, Voraussetzungen, etc.
```

#### 3. Vorlesungen hinzufügen (siehe unten)

Das wars! Die `modules.json` wird automatisch aktualisiert, wenn du auf `main` pushst.

### Schritt-für-Schritt: Neue Vorlesung erstellen

#### 1. Ordnerstruktur anlegen

```bash
cd content/01-modul-name/
mkdir -p NN-neues-thema/lecture-items
mkdir -p NN-neues-thema/questions
```

#### 2. Metadaten-Dateien erstellen

**lecture.md:**

```yaml
---
topic: 'Titel der Vorlesung'
description: 'Kurzbeschreibung für die Vorlesungsliste'
---

# Titel der Vorlesung

Einleitung oder Lernziele (optional).
```

**quiz.md:**

```yaml
---
description: 'Kurzbeschreibung des Quiz'
---

# Quiz: Titel der Vorlesung

Überprüfe dein Verständnis der wichtigsten Konzepte.
```

#### 3. Lern-Items hinzufügen

Erstelle Dateien in `lecture-items/`:

- `01-einleitung.md` - Text-Inhalt
- `02-konzept-test.md` - Self-Assessment
- `03-video.md` - YouTube Video
- Etc.

Siehe [CONTENT_TEMPLATES.md](CONTENT_TEMPLATES.md) für Vorlagen.

#### 4. Quiz-Fragen hinzufügen

Erstelle Dateien in `questions/`:

- `01-frage-grundlagen.md`
- `02-frage-vertiefung.md`
- `03-frage-anwendung.md`
- Etc.

Siehe [CONTENT_TEMPLATES.md](CONTENT_TEMPLATES.md) für Vorlagen.

#### 5. Commit & Push

```bash
git add .
git commit -m "content: add new lecture"
git push
```

Die GitHub Action generiert automatisch `content-list.json` und `modules.json`.

**Lokal testen:** Vor dem Push kannst du `node generate-content-list.js` ausführen.

#### 6. Validieren

Öffne `validate-content.html` und überprüfe alle Dateien auf Fehler.

### Schritt-für-Schritt: Neues Lern-Item hinzufügen

1. **Nächste Nummer finden:** Schau dir die vorhandenen Dateien in `lecture-items/` an
2. **Neue Datei erstellen:** z.B. `07-neues-konzept.md`
3. **Inhalt hinzufügen:** Verwende passende Vorlage aus CONTENT_TEMPLATES.md
4. **Validieren:** Überprüfe mit `validate-content.html`
5. **Commit & Push:** Die Action aktualisiert automatisch die JSON-Dateien

### Schritt-für-Schritt: Neue Quiz-Frage hinzufügen

1. **Nächste Nummer finden:** Schau dir die vorhandenen Dateien in `questions/` an
2. **Neue Datei erstellen:** z.B. `08-neue-frage.md`
3. **Frage schreiben:** Verwende die Multiple-Choice-Vorlage
4. **Validieren:** Überprüfe mit `validate-content.html`
5. **Commit & Push:** Die Action aktualisiert automatisch die JSON-Dateien

### Inhalte umordnen

Um die Reihenfolge zu ändern, benenne die Dateien um:

```bash
# Beispiel: Item 03 wird zu Item 02
mv lecture-items/03-altes-item.md lecture-items/02-altes-item.md

# Item 02 wird zu Item 03
mv lecture-items/02-anderes-item.md lecture-items/03-anderes-item.md
```

Nach dem Umbenennen: **Manifest neu generieren!**

```bash
npm run generate-manifest
```

### Neues Modul erstellen

1. **Modul-Ordner erstellen:**

   Module werden automatisch aus `module.md` Dateien erkannt. Erstelle einfach den Ordner:

   ```bash
   mkdir -p content/bsc-ernaehrungswissenschaften/02-neues-modul/01-erste-vorlesung/lecture-items
   mkdir -p content/bsc-ernaehrungswissenschaften/02-neues-modul/01-erste-vorlesung/questions
   ```

2. **`module.md` erstellen:**

   ```markdown
   ---
   id: 02-neues-modul
   title: "Modul 2: Titel"
   description: "Beschreibung"
   ects: 6
   status: "freigeschaltet"
   order: 2
   ---

   # Modul 2: Titel

   Beschreibung des Moduls...
   ```

3. **Vorlesungsdateien erstellen** (siehe Schritt-für-Schritt-Anleitung oben)

4. **Manifest generieren:**

   ```bash
   node generate-content-list.js
   ```

5. **Validieren** mit `validate-content.html`

---

## Quellenreferenz-System

Das Quellenreferenz-System ermöglicht die saubere Zuordnung von Lerninhalten zu ihren Original-Quellen (Vorlesungsfolien, Lehrbücher, etc.).

### Überblick

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  studies-material/.../01-lecture.md                                     │
│  - Enthält [cite_start]...[cite: 23-25] Markierungen                   │
│  - Hat Titel + Link zur Originalquelle am Datei-Anfang                  │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ Content-Generierung
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  content/.../lecture.md                                                 │
│  - sources: Array mit id, title, url, type                              │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ Referenziert durch
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  content/.../lecture-items/01-topic.md                                  │
│  - sourceRefs: Array mit sourceId, pages                                │
│  → App zeigt Fußnote: "Quelle: [Titel], S. 23-25"                       │
└─────────────────────────────────────────────────────────────────────────┘
```

### Schritt 1: Material-Datei vorbereiten

In `studies-material/{studyId}/NN-modul/lecture-name.md`:

```markdown
# Kapitel 1: Materie und Messen

Titel: "Materie und Messen"
Link: https://moodle.univie.ac.at/path/to/slides.pdf

## Inhalt

[cite_start]Die Chemie untersucht Materie und Energie[cite: 23-25].

Ein wichtiges Konzept ist [cite_start]die wissenschaftliche Methode, 
die aus Beobachtung, Hypothese und Experiment besteht[cite: 47-53].
```

**Format der Zitationsmarkierungen:**
- `[cite_start]` markiert den Beginn des zitierten Bereichs
- `[cite: X-Y]` gibt die Seitenangabe(n) an
- Kann auch mehrere Seiten sein: `[cite: 71, 73, 76]`

### Schritt 2: Quellen in lecture.md definieren

In `content/{studyId}/NN-modul/NN-lecture/lecture.md`:

```yaml
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
```

**Source-Felder:**

| Feld    | Typ    | Beschreibung                              |
| ------- | ------ | ----------------------------------------- |
| `id`    | String | Eindeutige ID für Referenzierung          |
| `title` | String | Anzeigename der Quelle                    |
| `url`   | String | Link zur Quelle (oder `null` bei Büchern) |
| `type`  | String | `'pdf'`, `'book'`, `'video'`, `'website'` |

### Schritt 3: Quellenreferenzen in Lecture-Items

In `content/.../lecture-items/01-was-ist-chemie.md`:

```yaml
---
type: 'learning-content'
topic: 'Einführung in die Chemie'
sourceRefs:
  - sourceId: 'vorlesung-k1'
    pages: '23-25'
---

## Was ist Chemie?

Chemie ist die Wissenschaft, die sich mit der Charakterisierung...
```

**Mehrere Quellen pro Item:**

```yaml
sourceRefs:
  - sourceId: 'vorlesung-k1'
    pages: '23-25'
  - sourceId: 'mortimer'
    pages: '15-18'
```

### Darstellung in der App

Die App rendert Quellenreferenzen als Fußnote am Ende jedes Lecture-Items:

```text
┌─────────────────────────────────────────────────────────────────┐
│  ## Was ist Chemie?                                             │
│                                                                 │
│  Chemie ist die Wissenschaft...                                 │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  📖 Quelle: Vorlesungsfolien Kapitel 1 (WS2025), S. 23-25      │
└─────────────────────────────────────────────────────────────────┘
```

Bei verlinkten Quellen wird der Titel klickbar angezeigt.

---

## Content Validation

**Vor jedem Commit** müssen alle Content-Dateien validiert werden!

### Validierungs-Workflow

1. **Validator öffnen:**
   - Option A: Über die App → Header → "Tools" → "Content Validator"
   - Option B: `validate-content.html` direkt mit Live Server öffnen

2. **Validierung starten:**
   - Button "Alle Content-Dateien validieren" klicken

3. **Ergebnisse prüfen:**
   - ✅ **Grün:** Alle Dateien sind valide
   - ⚠️ **Gelb:** Warnungen (sollten behoben werden)
   - ❌ **Rot:** Fehler (MÜSSEN behoben werden)

4. **Fehler beheben:**
   - Fehler sind nach Datei und Item-Nummer gruppiert
   - Häufige Fehler werden erkannt und erklärt
   - Nach Behebung erneut validieren

### Was wird geprüft?

- ✓ **YAML-Syntax:** Valides YAML-Format
- ✓ **Pflichtfelder:** Alle erforderlichen Felder vorhanden
- ✓ **Listen-Syntax:** Korrekte Verwendung von `-` statt `*`
- ✓ **Antwort-Validierung:** `correctAnswer` ist in `options` enthalten
- ✓ **Mindestanzahl:** Mindestens 2 Optionen bei Multiple-Choice
- ✓ **Typ-Prüfung:** Bekannte `type`-Werte

### Häufige Fehler

#### 1. YAML Parse-Fehler: "name of an alias node must contain at least one character"

**Problem:** Asterisk (`*`) statt Bindestrich (`-`) in Listen

**Falsch:**

```yaml
options:
* 'Option 1'
```

**Richtig:**

```yaml
options:
  - 'Option 1'
```

#### 2. "Pflichtfeld 'options' fehlt"

**Problem:** Feld nicht definiert oder falsch geschrieben

**Lösung:** Alle Pflichtfelder müssen vorhanden sein

#### 3. "'correctAnswer' ist nicht in 'options' enthalten"

**Problem:** Tippfehler oder Text stimmt nicht genau überein

**Lösung:** Genau denselben Text verwenden (inklusive Groß-/Kleinschreibung)

#### 4. "Möglicherweise '*' statt '-' in YAML-Liste verwendet"

**Warnung:** Potentieller Syntaxfehler erkannt

**Lösung:** Prüfen und `*` durch `-` ersetzen (mit 2 Leerzeichen Einrückung)

## Best Practices

### Inhaltliche Qualität

1. **Klare Fragen:** Fragen sollten eindeutig und verständlich sein
2. **Realistische Optionen:** Falsche Antworten sollten plausibel sein
3. **Hilfreiche Erklärungen:** Jede Antwort sollte eine Erklärung haben
4. **Konsistente Terminologie:** Fachbegriffe einheitlich verwenden

### Technische Qualität

1. **Immer validieren:** Vor jedem Commit
2. **Vorlagen nutzen:** Copy-Paste aus CONTENT_TEMPLATES.md
3. **Klein anfangen:** Erst eine Vorlesung, dann validieren, dann mehr
4. **Markdown testen:** Vorschau in VS Code oder in der App prüfen

### Markdown-Formatierung

- Überschriften: `#`, `##`, `###`
- **Fett:** `**Text**`
- *Kursiv:* `*Text*`
- Listen:

  ```markdown
  - Punkt 1
  - Punkt 2
  ```

- Nummerierte Listen:

  ```markdown
  1. Erster
  2. Zweiter
  ```

## Entwicklungs-Workflow

### Typischer Content-Erstellungs-Zyklus

1. **Planung:**
   - Referenz in `content/{studyId}/study.md` prüfen
   - Lernziele definieren
   - Themen festlegen

2. **Erstellung:**
   - Ordnerstruktur anlegen
   - Vorlagen kopieren
   - Inhalt verfassen
   - In content-list.json registrieren

3. **Validierung:**
   - Content Validator ausführen
   - Fehler beheben
   - Erneut validieren

4. **Test:**
   - In der App testen
   - Alle Vorlesungen durchgehen
   - Quiz absolvieren
   - Darstellung prüfen

5. **Commit:**
   - Git add, commit, push
   - Deployment beobachten (1-2 Minuten)
   - Live-Version testen

### Mit AI-Unterstützung arbeiten

Wenn du AI-Tools (GitHub Copilot, Gemini) verwendest:

1. **Referenz auf GEMINI.md:** AI kennt die Content-Konventionen
2. **Vorlagen verwenden:** AI soll sich an CONTENT_TEMPLATES.md orientieren
3. **Immer validieren:** AI kann Fehler machen, besonders bei YAML
4. **Schritt für Schritt:** Erst eine Vorlesung generieren, validieren, dann weiter

Siehe [docs/AI_CODING.md](AI_CODING.md) für Details zur AI-Entwicklung.

## Troubleshooting

### Content wird nicht geladen

**Check:**

1. Ist die Datei in `content-list.json` registriert?
2. Ist der Pfad korrekt? (relativ zu Repository-Root)
3. Browser-Console auf Fehler prüfen

### Quiz zeigt keine Fragen

**Check:**

1. Quiz-Datei validiert?
2. YAML-Frontmatter korrekt?
3. Mindestens eine Frage vorhanden?

### Markdown wird nicht richtig dargestellt

**Check:**

1. Ist es Teil des `body` (nach `---`) und nicht im YAML?
2. Markdown-Syntax korrekt?
3. In VS Code Markdown-Preview prüfen

### Validator zeigt viele Fehler

**Schritte:**

1. Einen Fehler nach dem anderen beheben
2. Mit erstem Fehler starten (oft Folgefehler)
3. Nach jedem Fix neu validieren
4. Bei Unsicherheit: Vorlage aus CONTENT_TEMPLATES.md kopieren

## Weiterführende Dokumentation

- **[CONTENT_TEMPLATES.md](CONTENT_TEMPLATES.md)** - Copy-Paste-Vorlagen für alle Content-Typen
- **[GEMINI.md](../GEMINI.md)** - AI-Agent-Instruktionen für Content-Generierung
- **[AI_CODING.md](AI_CODING.md)** - Arbeiten mit AI-Assistenten
- **[Learning_Flow_Concept.md](../WIP/Learning_Flow_Concept.md)** - Lernflow und Feature-Konzepte

## Support

Bei Fragen oder Problemen:

1. Validator-Output genau lesen
2. CONTENT_TEMPLATES.md konsultieren
3. Existierende Vorlesungen als Beispiel anschauen
4. GitHub Issues erstellen für technische Probleme

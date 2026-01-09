# Content Development Guide

Dieser Leitfaden richtet sich an Content-Ersteller, die Lernmaterialien für die Ernährungswissenschaft Lern-App entwickeln. Er beschreibt die Struktur, Formate und Prozesse für die Erstellung von Vorlesungen, Quizzes und anderen Lernmaterialien.

## Überblick

Die App lädt Inhalte aus Markdown-Dateien mit YAML-Frontmatter. Alle Inhalte befinden sich im `content/` Ordner und werden über `content-list.json` registriert.

### Unterschied zu App-Entwicklung

- **App-Entwicklung:** Änderungen an HTML, CSS, JavaScript, UI/UX
- **Content-Entwicklung:** Erstellung und Pflege von Lernmaterialien (Markdown-Dateien)

Die meiste laufende Arbeit an diesem Repository wird Content-Entwicklung sein.

## Content-Struktur

### Modulare Struktur (Standard)

Alle Inhalte sind modular aufgebaut für maximale Wartbarkeit und Übersichtlichkeit:

```text
content/
├── modules.json                          # Modul-Metadaten
├── content-list.json                     # Auto-generiertes Manifest (nicht manuell bearbeiten!)
└── 01-modul-name/                       # Modul-Ordner (nummeriert)
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

**⚠️ Wichtig:** `content-list.json` wird automatisch generiert. Bearbeite diese Datei **nicht** manuell! Verwende stattdessen `npm run generate-manifest` nach Änderungen.

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

### Vorlesungs-Ordner

Innerhalb eines Modul-Ordners: `NN-thema/`

- `NN`: Zweistellige Nummer der Vorlesung
- `thema`: Thema der Vorlesung

Beispiel: `01-grundlagen-zellbiologie/`

### Erforderliche Dateien

Jeder Vorlesungs-Ordner muss enthalten:

1. **`lecture.md`** - Metadaten (Titel, Beschreibung)
2. **`lecture-items/`** - Ordner mit einzelnen Lern-Items
3. **`quiz.md`** - Metadaten für das Quiz
4. **`questions/`** - Ordner mit einzelnen Quiz-Fragen

## Content-Formate

### 1. Vorlesungs-Metadaten (lecture.md)

Die `lecture.md` Datei enthält **nur Metadaten** - keine Lern-Inhalte!

```yaml
---
topic: 'Grundlagen der Zellbiologie'
description: 'Einführung in den Aufbau und die Funktion von Zellen'
---

# Grundlagen der Zellbiologie

Kurze Einleitung oder Lernziele (optional).
```

**Pflichtfelder:**

- `topic`: Titel der Vorlesung
- `description`: Kurzbeschreibung (wird in der Vorlesungsliste angezeigt)

### 2. Vorlesungs-Items (lecture-items/)

Jede Datei in `lecture-items/` ist ein einzelnes Lern-Element.

#### Learning Content (Text)

```yaml
---
type: 'learning-content'
---

# Überschrift

Markdown-Inhalt mit **Formatierung**, Listen, etc.
```

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

#### 5. Manifest generieren

Nach dem Hinzufügen neuer Dateien, generiere das Content-Manifest:

```bash
npm run generate-manifest
```

Dieser Befehl scannt automatisch alle Markdown-Dateien im `content/` Verzeichnis und aktualisiert `content-list.json`.

**Wichtig:** Führe diesen Befehl immer aus, nachdem du:
- Neue lecture-items oder questions hinzugefügt hast
- Dateien umbenannt hast
- Dateien gelöscht hast

#### 6. Validieren

Öffne `validate-content.html` und überprüfe alle Dateien auf Fehler.

### Schritt-für-Schritt: Neues Lern-Item hinzufügen

1. **Nächste Nummer finden:** Schau dir die vorhandenen Dateien in `lecture-items/` an
2. **Neue Datei erstellen:** z.B. `07-neues-konzept.md`
3. **Inhalt hinzufügen:** Verwende passende Vorlage aus CONTENT_TEMPLATES.md
4. **Manifest generieren:** `npm run generate-manifest`
5. **Validieren:** Überprüfe mit `validate-content.html`

### Schritt-für-Schritt: Neue Quiz-Frage hinzufügen

1. **Nächste Nummer finden:** Schau dir die vorhandenen Dateien in `questions/` an
2. **Neue Datei erstellen:** z.B. `08-neue-frage.md`
3. **Frage schreiben:** Verwende die Multiple-Choice-Vorlage
4. **Manifest generieren:** `npm run generate-manifest`
5. **Validieren:** Überprüfe mit `validate-content.html`

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

1. **Modul in `content/modules.json` definieren:**

   ```json
   {
     "id": "02-neues-modul",
     "title": "Modul 2: Titel",
     "description": "Beschreibung",
     "ects": 6,
     "status": "unlocked"
   }
   ```

2. **Ordnerstruktur erstellen:**

   ```bash
   mkdir -p content/02-neues-modul/01-erste-vorlesung/lecture-items
   mkdir -p content/02-neues-modul/01-erste-vorlesung/questions
   ```

3. **Vorlesungsdateien erstellen** (siehe Schritt-für-Schritt-Anleitung oben)

4. **Manifest generieren:**

   ```bash
   npm run generate-manifest
   ```

5. **Validieren** mit `validate-content.html`

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
   - Referenz in `studium/Module_BSc_Ernaehrungswissenschaften.md` prüfen
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

# Content Development Guide

Dieser Leitfaden richtet sich an Content-Ersteller, die Lernmaterialien für die Ernährungswissenschaft Lern-App entwickeln. Er beschreibt die Struktur, Formate und Prozesse für die Erstellung von Vorlesungen, Quizzes und anderen Lernmaterialien.

## Überblick

Die App lädt Inhalte aus Markdown-Dateien mit YAML-Frontmatter. Alle Inhalte befinden sich im `content/` Ordner und werden über `content-list.json` registriert.

### Unterschied zu App-Entwicklung

- **App-Entwicklung:** Änderungen an HTML, CSS, JavaScript, UI/UX
- **Content-Entwicklung:** Erstellung und Pflege von Lernmaterialien (Markdown-Dateien)

Die meiste laufende Arbeit an diesem Repository wird Content-Entwicklung sein.

## Content-Struktur

```text
content/
├── modules.json                          # Modul-Metadaten
├── content-list.json                     # Registrierung aller Content-Dateien
└── 01-ernaehrungslehre-grundlagen/      # Modul-Ordner
    ├── 01-grundlagen-zellbiologie/      # Vorlesungs-Ordner
    │   ├── lecture.md                   # Vorlesungsinhalt
    │   └── quiz.md                      # Quiz-Fragen
    ├── 02-makronaehrstoffe-detail/
    │   ├── lecture.md
    │   └── quiz.md
    └── ...
```

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

- **`lecture.md`** - Vorlesungsinhalt mit Lernmaterial
- **`quiz.md`** - Quiz-Fragen zur Vorlesung

## Content-Formate

### 1. Vorlesungen (lecture.md)

Vorlesungen bestehen aus mehreren Dokumenten, getrennt durch `---`. Jedes Dokument kann sein:

#### Learning Content

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

### 2. Quizzes (quiz.md)

Quiz-Dateien enthalten Multiple-Choice-Fragen:

```yaml
---
type: 'multiple-choice'
question: 'Was bedeutet "selektive Permeabilität" der Zellmembran?'
options:
  - 'Die Membran lässt absolut keine Stoffe durch.'
  - 'Die Membran lässt alle Stoffe ungehindert passieren.'
  - 'Die Membran lässt nur bestimmte Stoffe durch und blockiert andere.'
  - 'Die Membran ist nur für Wasser durchlässig.'
correctAnswer: 'Die Membran lässt nur bestimmte Stoffe durch und blockiert andere.'
---

**Erklärung:** "Selektive Permeabilität" bedeutet, dass die Membran wählerisch ist...
```

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

Jeder Content-Typ hat Pflichtfelder:

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

### 1. Neue Vorlesung zu bestehendem Modul

1. **Ordner erstellen:**

   ```bash
   mkdir -p content/01-modul-name/NN-thema
   ```

2. **Dateien erstellen:**
   - `lecture.md` - Kopiere Vorlage aus CONTENT_TEMPLATES.md
   - `quiz.md` - Kopiere Quiz-Vorlage

3. **Inhalte registrieren** in `content/content-list.json`:

   ```json
   [
     "content/01-modul-name/01-thema-1/lecture.md",
     "content/01-modul-name/01-thema-1/quiz.md",
     "content/01-modul-name/NN-thema/lecture.md",
     "content/01-modul-name/NN-thema/quiz.md"
   ]
   ```

4. **Validieren** (siehe unten)

### 2. Neues Modul erstellen

1. **Modul in `content/modules.json` definieren:**

   ```json
   {
     "id": "02-neues-modul",
     "title": "Modul 2: Titel",
     "description": "Beschreibung",
     "ects": 6,
     "status": "verfügbar"
   }
   ```

2. **Ordnerstruktur erstellen:**

   ```bash
   mkdir -p content/02-neues-modul/01-erste-vorlesung
   ```

3. **Vorlesungsdateien erstellen** (siehe oben)

4. **In content-list.json registrieren**

5. **Validieren**

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

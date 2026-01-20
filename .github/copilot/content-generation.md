# Content Generation

Inhalte aus CONTENT_PLAN generieren.

## 3-Phasen-Workflow

```text
Phase 1: Rohmaterial       → studies-material/{studyId}/NN-modul/NN-vorlesung/
Phase 2: CONTENT_PLAN.md   → Struktur definieren und verifizieren
Phase 3: Content generieren → content/{studyId}/NN-modul/NN-vorlesung/
```

⚠️ **CONTENT_PLAN.md ist VERBINDLICH** – keine eigene Struktur erfinden!

## Schritt-für-Schritt Workflow

### Schritt 0: Zielordner ermitteln

⚠️ **KRITISCH:** Ordnernamen können unterschiedlich sein!

```bash
# ZUERST content-Ordner prüfen:
list_dir content/{studyId}/

# Beispiel:
# studies-material/.../02-grundlagen-chemie/ 
# → content/.../02-chemie-grundlagen/  (ANDERER NAME!)
```

### Schritt 1: CONTENT_PLAN.md lesen

```bash
# Im Material-Ordner:
studies-material/{studyId}/NN-modul/NN-vorlesung/CONTENT_PLAN.md
```

Der Plan definiert:
- Exakte Dateinamen (`01-einleitung.md`, `02-mc-test.md`, ...)
- Content-Types pro Datei
- Didaktische Reihenfolge

### Schritt 2: Zusätzliche Ressourcen prüfen

**Im Modul-Ordner:**
- `overview.md` – Modulziele, Prüfungsmodalitäten
- `mortimer-questions.md` – Fachliteratur-Fragen
- Prüfungsfragen (*.md) – Alte Klausuren

**Im Vorlesungs-Ordner:**
- `Vorlesung.md` – Hauptinhalt mit Zitationen
- `Videos.md` – Verifizierte YouTube-Videos

### Schritt 3: lecture.md erstellen

```yaml
---
title: 'Periodensystem der Elemente'
description: 'Aufbau und Struktur des Periodensystems'
version: '1.0.0'
sources:
  - id: 'vorlesung-folien'
    title: 'Vorlesungsfolien Kapitel 1'
    url: 'https://moodle.univie.ac.at/...'
    type: 'pdf'
  - id: 'mortimer-kap1'
    title: 'Mortimer: Chemie (Kap. 1)'
    type: 'book'
---
```

### Schritt 4: lecture-items/ erstellen

Für jeden Eintrag im CONTENT_PLAN:

1. Datei mit exaktem Namen erstellen
2. Korrekten Content-Type verwenden
3. `sourceRefs` hinzufügen wenn Zitationen vorhanden

```yaml
# Beispiel: 05-learning-ionenbindung.md
---
type: 'learning-content'
sourceRefs:
  - sourceId: 'vorlesung-folien'
    pages: '12-15'
---

# Ionenbindung

Inhalt aus Vorlesung.md, Zitationsmarker entfernt...
```

### Schritt 5: questions/ erstellen

Nur `multiple-choice-multiple` für Vorlesungs-Tests!

```yaml
---
type: 'multiple-choice-multiple'
question: 'Welche Aussagen zur Ionenbindung sind korrekt?'
options:
  - 'Ionenbindungen entstehen durch Elektronenübertragung'
  - 'Ionenbindungen sind gerichtet'
  - 'Ionenverbindungen leiten als Schmelze Strom'
  - 'Ionenbindungen entstehen nur zwischen Metallen'
correctAnswers:
  - 'Ionenbindungen entstehen durch Elektronenübertragung'
  - 'Ionenverbindungen leiten als Schmelze Strom'
explanation: 'Ionenbindungen sind ungerichtet und entstehen zwischen Metallen und Nichtmetallen.'
---
```

### Schritt 6: Validierung

```bash
npm run build                              # JSON regenerieren
npm run validate:content                   # Fehler prüfen
npx markdownlint-cli2 "content/**/*.md"    # Markdown linten
node scripts/generate-test-progress.js    # Testdaten
```

Browser: Tools → "Inhalte validieren"

## Zitationen verarbeiten

### Eingabe (Vorlesung.md)

```markdown
Die Ionenbindung entsteht durch Elektronenübertragung [cite_start]zwischen 
Metall und Nichtmetall[cite: 12-15].
```

### Ausgabe (lecture-item)

```yaml
---
type: 'learning-content'
sourceRefs:
  - sourceId: 'vorlesung-folien'
    pages: '12-15'
---

Die Ionenbindung entsteht durch Elektronenübertragung zwischen 
Metall und Nichtmetall.
```

- `[cite_start]` und `[cite: X-Y]` entfernen
- Seitenzahlen in `sourceRefs` übertragen

## Lecture Versioning

```text
PATCH  1.0.0 → 1.0.1   Typos, Formatierung
MINOR  1.0.0 → 1.1.0   Inhalt substantiell geändert
MAJOR  1.0.0 → 2.0.0   Komplett neu generiert
```

## YouTube-Videos verifizieren

```bash
curl -s "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=VIDEO_ID&format=json"
```

- HTTP 200 + JSON → ✅ Verwenden
- HTTP 401/403/404 → ❌ NICHT verwenden

## Content-Struktur V4

Jeder Abschnitt folgt: **Lernen → Überprüfen → Anwenden**

```text
ABSCHNITT
├── 📚 learning-content      (Theorie)
├── ✅ self-assessment-mc    (Verständnis-Check)
├── ✅ fill-in-the-blank     (Lückentext)
├── ✅ matching              (Zuordnung)
├── 🧮 calculation           (Berechnung)
├── 🧮 practice-exercise     (Praxis)
└── 📺 youtube-video         (an passender Stelle!)

VORLESUNGS-ENDE
├── 📋 self-assessment       (Bereitschafts-Checkliste)
├── 📝 questions/            (12 schwere MC-Multiple)
└── 🎓 module-exam/          (2 Transferfragen)
```

⚠️ Videos NICHT am Ende sammeln – an thematisch passender Stelle!

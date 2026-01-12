# AI-gestützte Content-Erstellung: Studentengerechtes Setup

## Übersicht

Dieses Setup nutzt zwei kostenlose AI-Tools zur Erstellung von Lerninhalten:

| Aufgabe                          | Tool                           | Kosten                   |
| -------------------------------- | ------------------------------ | ------------------------ |
| **Deep Research & Quellinhalte** | Google AI Studio (Gemini Pro)  | Kostenlos (Free Tier)    |
| **Content-Erstellung für App**   | GitHub Copilot + Claude Opus 4 | Kostenlos (Student Pack) |
| **Video-Transkription**          | OpenAI Whisper (lokal)         | Kostenlos                |

> **Geschätzte Gesamtkosten: €0/Monat**

---

## Content-Struktur V4 (NEU)

Jeder Abschnitt einer Vorlesung folgt dem Muster **Lernen → Überprüfen → Anwenden**:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  ABSCHNITT                                                               │
│  ├── 📚 Lerninhalte (learning-content)                                   │
│  │       Theorie, Konzepte, Formeln                                     │
│  │                                                                       │
│  ├── ✅ Verständnis-Checks (direkt nach dem Lerninhalt)                  │
│  │       • self-assessment-mc (einfache MC-Fragen)                      │
│  │       • fill-in-the-blank (Lückentexte)                              │
│  │       • matching (Zuordnungsaufgaben)                                │
│  │       • ordering (Sortieraufgaben)                                   │
│  │                                                                       │
│  ├── 🧮 Praxis-Übung (practice-exercise, calculation)                   │
│  │       Alltagsbezogene Anwendung des Gelernten                        │
│  │                                                                       │
│  └── 📺 Video (youtube-video)                                           │
│          An thematisch passender Stelle                                 │
└─────────────────────────────────────────────────────────────────────────┘

Am Ende der Vorlesung:
┌─────────────────────────────────────────────────────────────────────────┐
│  📋 Selbsttest (self-assessment)                                         │
│      Checkliste: Bin ich bereit für den Vorlesungs-Test?                │
│                                                                         │
│  📝 Vorlesungs-Test (questions/)                                         │
│      12 schwierige multiple-choice-multiple Fragen                      │
│      Nur Mehrfachauswahl! Universitäts-Prüfungsniveau                   │
│                                                                         │
│  🎓 Modul-Prüfungsfragen (module-exam/)                                  │
│      2 sehr schwierige Transferfragen pro Vorlesung                     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Der Workflow

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 1: Quellinhalte erstellen                                        │
│  Tool: Google AI Studio (Gemini Pro)                                    │
│  - Deep Research mit Web-Grounding                                      │
│  - Vorlesungsinhalte aufbereiten                                        │
│  - Videos transkribieren (Whisper)                                      │
│  → Speichern in: studies-material/{studyId}/NN-modul/NN-vorlesung/      │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 2: App-Inhalte generieren                                        │
│  Tool: GitHub Copilot (Agent Mode) + Claude Opus 4                      │
│  - lecture-items/ erstellen                                             │
│  - questions/ für Quizzes                                               │
│  - Self-Assessments nach Konzepten                                      │
│  - Achievements (Cheat Sheets)                                          │
│  → Speichern in: content/{studyId}/NN-modul/NN-vorlesung/               │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 3: Commit & Push                                                 │
│  - git add + commit + push                                              │
│  - GitHub Action generiert automatisch alle JSON-Dateien                │
│  - Validieren: Tools → "Inhalte validieren" in der App                  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Tool 1: Google AI Studio (Gemini Pro)

**Zweck:** Deep Research, Quellinhalte aufbereiten, Web-Recherche

**Zugang:** <https://aistudio.google.com> (kostenlos)

### Leistungsumfang (Free Tier)

- **Gemini 2.5 Pro:** Kostenlos (mit Rate Limits)
- **Gemini 2.5 Flash:** Kostenlos (höhere Limits)
- **Kontext-Window:** 1 Million Tokens
- **Web-Grounding:** 500 Anfragen/Tag kostenlos

### Wann Gemini nutzen

- Lange Vorlesungsmitschriften aufbereiten
- YouTube-Videos und Bilder recherchieren
- Fakten verifizieren mit Web-Grounding
- Inhalte für `studies-material/{studyId}/` Ordner erstellen

### Beispiel-Prompt für Quellinhalte

```text
Du bist ein Experte für Ernährungswissenschaft.

Aufgabe: Erstelle eine ausführliche Zusammenfassung zum Thema 
"Periodensystem der Elemente" für das erste Semester Ernährungswissenschaft.

Anforderungen:
- Ausführlich und didaktisch strukturiert
- Formeln in LaTeX ($E=mc^2$)
- Abschnitte mit ## Überschriften
- Quellenangaben wo sinnvoll

Zusätzliche Recherche (Web-Grounding aktivieren):
- Finde 2-3 passende YouTube-Videos auf Deutsch
- Suche nach Creative Commons Bildern
```

---

## Tool 2: GitHub Copilot + Claude Opus 4

**Zweck:** Strukturierte Lerninhalte für die App erstellen

**Zugang:** Kostenlos mit GitHub Student Developer Pack

### Setup

1. **GitHub Student Developer Pack aktivieren:**
   <https://education.github.com/pack>

2. **VS Code mit Copilot Extension installieren**

3. **Agent Mode aktivieren:**
   - Copilot Chat öffnen
   - Modell auf "Claude Opus 4" oder "Claude Sonnet 4" setzen
   - Agent Mode nutzen für autonome Dateierstellung

### Wann Copilot nutzen

- Quellinhalte aus `studies-material/{studyId}/` in App-Format transformieren
- lecture-items, questions, self-assessments erstellen
- Achievements (Cheat Sheets) generieren
- YAML-Strukturen korrekt formatieren

### Beispiel-Prompt für Content-Erstellung

```text
Lies die Datei studies-material/bsc-ernaehrungswissenschaften/02-grundlagen-chemie/01-materie-messen.md 
und erstelle daraus strukturierte Lerninhalte für die App.

Verwende die Templates aus docs/CONTENT_TEMPLATES.md.
Erstelle die Dateien in content/bsc-ernaehrungswissenschaften/02-chemie-grundlagen/01-materie-messen/

Struktur:
1. lecture-items/ mit 01-XX.md, 02-XX.md, etc.
2. questions/ für Quiz-Fragen
3. Nach jedem Konzept einen self-assessment-mc Test

Beachte:
- YAML-Listen mit - (dash), nie * (asterisk)
- correctAnswer muss EXAKT mit Option übereinstimmen
- Deutsche UI-Texte
- Quellenreferenzen aus [cite: X-Y] Markierungen extrahieren (siehe unten)
```

### Quellenreferenzen verarbeiten

Die Material-Dateien in `studies-material/` enthalten Zitationsmarkierungen, die bei der Content-Generierung verarbeitet werden müssen.

**Material-Datei Format (studies-material/):**

```markdown
# Kapitel 1: Materie und Messen

Titel: "Materie und Messen"
Link: https://moodle.univie.ac.at/path/to/slides.pdf

## Inhalt

[cite_start]Die Chemie untersucht Materie und Energie[cite: 23-25].
```

**Prompt für Quellenextraktion:**

```text
1. QUELLEN EXTRAHIEREN:
   - Lies Titel und Link am Anfang der Material-Datei
   - Füge sie als `sources` Array in lecture.md ein:
   
   sources:
     - id: 'vorlesung-k1'
       title: '[Titel aus der Datei]'
       url: '[Link aus der Datei]'
       type: 'pdf'

2. ZITATIONEN VERARBEITEN:
   - Finde alle [cite_start]...[cite: X-Y] Markierungen
   - Füge entsprechende sourceRefs in die lecture-items ein:
   
   sourceRefs:
     - sourceId: 'vorlesung-k1'
       pages: 'X-Y'

3. TEXT BEREINIGEN:
   - Entferne [cite_start] und [cite: X-Y] aus dem finalen Content
   - Der Inhalt bleibt, nur die Markierungen werden entfernt
```

**Beispiel-Transformation:**

Material-Datei:

```markdown
[cite_start]Die Chemie ist die Wissenschaft der Stoffumwandlung[cite: 23-25].
```

→ Generiertes Lecture-Item:

```yaml
---
type: 'learning-content'
topic: 'Einführung'
sourceRefs:
  - sourceId: 'vorlesung-k1'
    pages: '23-25'
---

Die Chemie ist die Wissenschaft der Stoffumwandlung.
```

### Modell-Empfehlung

| Aufgabe              | Modell          | Warum                    |
| -------------------- | --------------- | ------------------------ |
| Komplexe Didaktik    | Claude Opus 4   | Beste Textqualität       |
| Schnelle Generierung | Claude Sonnet 4 | Schneller, gute Qualität |
| YAML-Strukturierung  | Beide           | Präzise bei Syntax       |
| Mermaid-Diagramme    | Claude Opus 4   | Bestes Verständnis       |
| Quellenextraktion    | Beide           | Pattern-Erkennung        |

### Vollständiger Prompt für Content-Generierung V4 (Copy-Paste)

Diesen Prompt im Copilot Agent Mode (VS Code) verwenden:

````text
Generiere Lerninhalte aus der Material-Datei:
studies-material/bsc-ernaehrungswissenschaften/[MODUL]/[VORLESUNG]/Vorlesung.md

Zielordner:
content/bsc-ernaehrungswissenschaften/[MODUL]/[VORLESUNG]/

## NEUE STRUKTUR V4: Lernen → Überprüfen → Anwenden

Jeder Abschnitt besteht aus:
1. Lerninhalte (learning-content)
2. Verständnis-Checks (direkt danach!)
3. Praxis-Übung
4. Video (an thematisch passender Stelle)

SCHRITT 1 - CONTENT_PLAN.md analysieren:
- Lies den CONTENT_PLAN.md im Material-Ordner
- Folge der dort definierten Struktur mit Abschnitten

SCHRITT 2 - lecture.md erstellen:
- Extrahiere Quellen aus dem Material-Header
- Erstelle sources Array mit id, title, url, type
- Füge topic, description, estimatedTime hinzu

SCHRITT 3 - lecture-items/ erstellen (neue Typen!):
Für jeden Abschnitt:

a) Lerninhalte (01-XX.md):
   - type: 'learning-content'
   - Quellenreferenzen aus [cite: X-Y] extrahieren
   - Formeln in LaTeX

b) Verständnis-Checks (02-check-XX.md) - DIREKT nach Lerninhalt:
   - type: 'self-assessment-mc' (einfache MC)
   - type: 'fill-in-the-blank' (Lückentext) - NEU
   - type: 'matching' (Zuordnung) - NEU
   - type: 'ordering' (Sortierung) - NEU

c) Praxis-Übungen (03-uebung-XX.md):
   - type: 'practice-exercise' - NEU
   - type: 'calculation' - NEU
   - Alltagsbezogene Szenarien

d) Videos (04-video-XX.md):
   - type: 'youtube-video'
   - An thematisch passender Stelle, NICHT am Ende gesammelt

SCHRITT 4 - Selbsttest erstellen (am Ende der lecture-items/):
- type: 'self-assessment'
- Checkliste zur Bereitschaftsprüfung vor dem Test
- Verweise auf Abschnitte bei Unsicherheit

SCHRITT 5 - questions/ erstellen (NUR schwer!):
- 12 Fragen auf Universitäts-Prüfungsniveau
- type: 'multiple-choice-multiple' (AUSSCHLIESSLICH!)
- Mehrere richtige Antworten pro Frage
- Keine einfachen single-choice Fragen!

SCHRITT 6 - Modul-Prüfungsfragen:
- 2 sehr schwierige Transferfragen pro Vorlesung
- Speicherort: module-exam/ Ordner im Modul
- Kombinieren Wissen aus mehreren Abschnitten

SCHRITT 7 - Validieren:
- npm run build ausführen
- In Browser testen mit Live Server
- Tools → "Inhalte validieren" in der App
````

### Neue Content-Typen (YAML-Struktur)

#### fill-in-the-blank (Lückentext)

```yaml
---
type: 'fill-in-the-blank'
question: 'Vervollständige die Formel zur Wärmeberechnung'
text: 'Die Formel lautet: q = {{blank1}} · {{blank2}} · {{blank3}}'
blanks:
  - id: 'blank1'
    answer: 'm'
    alternatives:
      - 'Masse'
    hint: 'Die Stoffmenge in Gramm'
  - id: 'blank2'
    answer: 'c'
    alternatives:
      - 'spezifische Wärmekapazität'
    hint: 'Die stoffspezifische Konstante'
  - id: 'blank3'
    answer: 'ΔT'
    alternatives:
      - 'Delta T'
      - 'Temperaturdifferenz'
    hint: 'Die Änderung einer Zustandsgröße'
---
```

#### matching (Zuordnung)

```yaml
---
type: 'matching'
question: 'Ordne die Begriffe den richtigen Definitionen zu'
pairs:
  - term: 'Exotherm'
    match: 'Wärme wird an die Umgebung abgegeben'
  - term: 'Endotherm'
    match: 'Wärme wird aus der Umgebung aufgenommen'
  - term: 'Enthalpie'
    match: 'Wärmeinhalt bei konstantem Druck'
---
```

#### ordering (Sortierung)

```yaml
---
type: 'ordering'
question: 'Bringe die Schritte der Heizkurve in die richtige Reihenfolge'
items:
  - 'Eis erwärmen (-20°C bis 0°C)'
  - 'Eis schmelzen (bei 0°C)'
  - 'Wasser erwärmen (0°C bis 100°C)'
  - 'Wasser verdampfen (bei 100°C)'
  - 'Dampf erwärmen (über 100°C)'
---
```

#### calculation (Berechnung)

```yaml
---
type: 'calculation'
question: 'Berechne die benötigte Wärme'
variables:
  m: '50 g'
  c: '4,184 J/(g·K)'
  ΔT: '60 K'
formula: 'q = m · c · ΔT'
correctAnswer: 12552
unit: 'J'
tolerance: 10
hints:
  - 'Setze die Werte in die Formel ein'
  - 'q = 50 · 4,184 · 60'
---
```

#### practice-exercise (Praxis-Übung)

```yaml
---
type: 'practice-exercise'
title: 'Energieberechnung am Beispiel Kaffee'
scenario: 'Du erhitzt 250 ml Wasser für einen Kaffee von 20°C auf 95°C.'
tasks:
  - question: 'Wie viel Energie wird benötigt?'
    type: 'calculation'
    correctAnswer: 78450
    unit: 'J'
  - question: 'Ist dieser Vorgang exotherm oder endotherm?'
    type: 'multiple-choice'
    options:
      - 'Exotherm'
      - 'Endotherm'
    correctAnswer: 'Endotherm'
realWorldConnection: 'Diese Energie entspricht etwa 19 kcal!'
---
```

---

## Video-Transkription mit Whisper

**Kosten:** Komplett kostenlos (läuft lokal)

### Installation (macOS)

```bash
# FFmpeg installieren
brew install ffmpeg

# Whisper installieren
pip install openai-whisper
```

### Verwendung

```bash
# Video transkribieren (Deutsch)
whisper vorlesung.mp4 --language German --model medium

# Audio transkribieren
whisper audio.mp3 --language German --model turbo
```

### Modell-Empfehlungen

| Modell   | RAM   | Qualität  | Für deutsche Vorlesungen |
| -------- | ----- | --------- | ------------------------ |
| `medium` | ~5 GB | Excellent | ✅ Empfohlen              |
| `turbo`  | ~6 GB | Excellent | ✅ Empfohlen (schneller)  |
| `small`  | ~2 GB | Sehr gut  | Akzeptabel               |

### Workflow: Video → Lerninhalte

1. **Transkribieren** mit Whisper
2. **Aufbereiten** → in `studies-material/{studyId}/NN-modul/` speichern
3. **Transformieren** mit Copilot → lecture-items + questions
4. **Video einbinden** als `youtube-video` Type
5. **Self-Assessments** zu Video-Inhalten erstellen

---

## Achievement-Erstellung

Achievements motivieren durch nützliche Belohnungen (Cheat Sheets, Diagramme).

### Achievement-Typen

| Typ                 | Beispiel                 | Unlock-Bedingung            |
| ------------------- | ------------------------ | --------------------------- |
| Lecture Cheat Sheet | Zellbiologie Cheat-Sheet | Gold Badge im Lecture Quiz  |
| Visual Aid          | Proteinsynthese-Diagramm | Während Lecture bei Item X  |
| Module Summary      | Modul-1-Zusammenfassung  | Gold Badge in Modul-Prüfung |

### Prompt für Achievement-Erstellung

```text
Erstelle ein Achievement (Cheat Sheet) für die Vorlesung "[Thema]".

Format:
---
id: 'XX-name-cheatsheet'
type: 'cheat-sheet'
title: 'Titel des Cheat Sheets'
description: 'Kurzbeschreibung'
unlockCondition:
  type: 'lecture-quiz-gold'
  lectureId: 'XX-vorlesung-id'
validityDays: 30
---

# [Titel]

## Kernkonzepte
- Konzept 1: Erklärung
- Konzept 2: Erklärung

## Wichtige Formeln
$Formel = Wert$

## Merkhilfen
- Eselsbrücke 1
- Eselsbrücke 2

Basierend auf diesem Lerninhalt:
[Lecture-Items einfügen]
```

---

## Qualitätssicherung

### Häufige AI-Fehler vermeiden

1. **YAML-Syntax:** AI verwendet manchmal `*` statt `-`
   → Explizit in Prompt erwähnen + Validator nutzen

2. **correctAnswer-Mismatch:** Text unterscheidet sich leicht
   → "correctAnswer MUSS EXAKT mit einer Option übereinstimmen"

3. **Halluzinierte Links:** AI erfindet URLs
   → Links manuell prüfen, Gemini mit Web-Grounding nutzen

### Checkliste nach AI-Generierung

- [ ] Commit & Push (GitHub Action generiert JSON-Dateien automatisch)
- [ ] Tools → "Inhalte validieren" in der App zeigt keine Fehler
- [ ] `npx markdownlint-cli2 "content/**/*.md"` erfolgreich
- [ ] Videos/Links manuell geprüft
- [ ] Inhaltliche Korrektheit geprüft
- [ ] Self-Assessments nach Konzepten platziert
- [ ] Nummerierung der Dateien logisch (01-, 02-, ...)

---

## Nächste Schritte

1. [ ] GitHub Student Pack aktivieren
2. [ ] VS Code + Copilot Extension installieren
3. [ ] Google AI Studio Account erstellen
4. [ ] Whisper installieren (optional, für Videos)
5. [ ] Erste Testgenerierung mit Modul 2, Lecture 1
6. [ ] Workflow basierend auf Erfahrungen anpassen

---

## Weiterführende Ressourcen

- [GitHub Student Developer Pack](https://education.github.com/pack)
- [Google AI Studio](https://aistudio.google.com)
- [Google AI Pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [OpenAI Whisper](https://github.com/openai/whisper)

---

## Falls das Setup nicht ausreicht

Optionale Erweiterungen bei Bedarf:

| Tool       | Wann sinnvoll                       | Kosten      |
| ---------- | ----------------------------------- | ----------- |
| Claude.ai  | Sehr lange Dokumente (>128k Tokens) | Kostenlos   |
| Perplexity | Intensive Web-Recherche             | Kostenlos   |
| OpenRouter | Batch-Verarbeitung vieler Dateien   | ~€2-5/Monat |

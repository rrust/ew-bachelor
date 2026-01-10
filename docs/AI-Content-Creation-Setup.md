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

## Der Workflow

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 1: Quellinhalte erstellen                                        │
│  Tool: Google AI Studio (Gemini Pro)                                    │
│  - Deep Research mit Web-Grounding                                      │
│  - Vorlesungsinhalte aufbereiten                                        │
│  - Videos transkribieren (Whisper)                                      │
│  → Speichern in: studies-material/{studyId}/NN-modul/lecture-Y.md          │
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
│  → Speichern in: content/XX-modul/XX-vorlesung/                         │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 3: Validierung                                                   │
│  - validate-content.html ausführen                                      │
│  - npx markdownlint-cli2 "content/**/*.md"                              │
│  - Links/Videos manuell prüfen                                          │
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
Erstelle die Dateien in content/02-chemie-grundlagen/01-materie-messen/

Struktur:
1. lecture-items/ mit 01-XX.md, 02-XX.md, etc.
2. questions/ für Quiz-Fragen
3. Nach jedem Konzept einen self-assessment-mc Test

Beachte:
- YAML-Listen mit - (dash), nie * (asterisk)
- correctAnswer muss EXAKT mit Option übereinstimmen
- Deutsche UI-Texte
```

### Modell-Empfehlung

| Aufgabe              | Modell          | Warum                    |
| -------------------- | --------------- | ------------------------ |
| Komplexe Didaktik    | Claude Opus 4   | Beste Textqualität       |
| Schnelle Generierung | Claude Sonnet 4 | Schneller, gute Qualität |
| YAML-Strukturierung  | Beide           | Präzise bei Syntax       |
| Mermaid-Diagramme    | Claude Opus 4   | Bestes Verständnis       |

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
| Lecture Cheat Sheet | Zellbiologie-Spickzettel | Gold Badge im Lecture Quiz  |
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

- [ ] `validate-content.html` zeigt keine Fehler
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

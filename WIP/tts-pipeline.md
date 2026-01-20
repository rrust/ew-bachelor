# TTS Rendering Pipeline (Audio-Script → MP3)

**Ziel:** Aus Audio-Script-Dateien (`.txt`) werden MP3-Dateien generiert, die direkt neben den Content-Dateien liegen und automatisch im Audio-Player angezeigt werden.

## Kontext: ew-bachelor Projekt

### Bestehende Audio-Integration

Die App erkennt automatisch MP3-Dateien neben Content-Dateien:

1. `generate-lecture-bundles.js` prüft beim Build, ob eine `.mp3`-Datei existiert
2. Wenn ja, wird `audioFile` im Bundle gesetzt
3. `app.js` baut die Audio-URL und übergibt sie an `LectureModule`
4. `lecture.js` rendert einen Audio-Player

**Konvention:** MP3-Datei = gleicher Name wie MD-Datei

```text
01-learning-xyz.md  →  01-learning-xyz.mp3  ✅ Audio-Player erscheint
```

### Dateistruktur mit Audio-Scripts

```text
content/{studyId}/NN-modul/NN-vorlesung/
├── lecture.md
├── lecture.audio.txt        ← Audio-Script (Plain Text!)
├── lecture.mp3              ← Generierte MP3
└── lecture-items/
    ├── 01-learning-xyz.md
    ├── 01-learning-xyz.audio.txt  ← Audio-Script
    ├── 01-learning-xyz.mp3        ← Generierte MP3
    ├── 02-mc-test.md              ← Kein Audio (interaktiv)
    └── ...
```

**Konvention:**

- Audio-Script: `{name}.audio.txt` (Plain Text, kein Markdown!)
- Generierte MP3: `{name}.mp3`
- Content: `{name}.md`

## 1) Workflow-Übersicht

```text
Phase 1: Content erstellen       → 01-learning-xyz.md
Phase 2: Audio-Script schreiben  → 01-learning-xyz.audio.txt
Phase 3: TTS rendern             → 01-learning-xyz.mp3
Phase 4: npm run build           → audioFile im Bundle
Phase 5: App                     → Audio-Player wird angezeigt
```

### Audio nur für bestimmte Types

Audio-Scripts werden nur erstellt für:

- `learning-content`
- `youtube-video` (Beschreibungstext)

**Kein Audio für interaktive Types:**

- `self-assessment-mc`, `fill-in-the-blank`, `matching`, `calculation`, etc.

## 2) Audio-Script Format

⚠️ **WICHTIG:** Audio-Scripts sind **Plain Text** (`.txt`), kein Markdown!

Edge TTS liest Markdown-Syntax wie `#`, `**`, `-` wörtlich vor. Daher:

- Kein Markdown-Formatting
- Keine Überschriften mit `#`
- Keine Listen mit `-` oder `*`
- Keine Code-Blöcke

### Beispiel Audio-Script

```text
Willkommen zur Vorlesung über Ionenbindung.

Die Ionenbindung ist eine der wichtigsten chemischen Bindungsarten.

...

Sie entsteht, wenn ein Metallatom Elektronen an ein Nichtmetallatom abgibt.

Das Metallatom wird dabei zum positiv geladenen Kation.
Das Nichtmetallatom wird zum negativ geladenen Anion.
```

### Pausen und Dramaturgie

Edge TTS unterstützt **kein SSML** (Microsoft hat es deaktiviert). Pausen werden durch **Interpunktion** erzeugt:

| Technik                    | Wirkung               | Beispiel                              |
| -------------------------- | --------------------- | ------------------------------------- |
| Punkt `.`                  | Kurze Pause (~0.5s)   | `Erster Satz. Zweiter Satz.`          |
| Ellipse `...`              | Längere Pause (~1-2s) | `Denkt darüber nach... Fertig?`       |
| Doppelte Ellipse `... ...` | Noch länger (~2-3s)   | `Wichtig... ... Weiter geht es.`      |
| Leerzeile                  | Absatz-Pause          | Text durch Leerzeile trennen          |
| Fragezeichen `?`           | Steigende Intonation  | `Versteht ihr das?`                   |
| Ausrufezeichen `!`         | Betonung              | `Das ist wichtig!`                    |
| Komma `,`                  | Minimale Pause        | `Erstens, zweitens, drittens.`        |
| Gedankenstrich `–`         | Einschub-Pause        | `Die Antwort – und das ist wichtig –` |

### Dramaturgie-Tipps

1. **Kurze Sätze** – Max. 20 Wörter pro Satz
2. **Absätze für Themenwechsel** – Leerzeile = natürliche Pause
3. **Fragen einstreuen** – Aktiviert Zuhörer
4. **Ellipsen vor wichtigen Punkten** – Erzeugt Spannung
5. **Tempo variieren** – Nicht alles gleich wichtig

### Unterschied Content vs. Audio-Script

| Aspekt     | Content (`.md`)      | Audio-Script (`.audio.txt`) |
| ---------- | -------------------- | --------------------------- |
| Format     | Markdown             | **Plain Text**              |
| Zweck      | Visuelle Darstellung | Gesprochener Text           |
| Formeln    | `$H_2O$` (KaTeX)     | "H zwei O"                  |
| Listen     | Bullet Points        | Fließtext (Erstens, ...)    |
| Links      | Klickbar             | Weggelassen                 |
| Codeblöcke | Syntax-Highlighting  | Weggelassen                 |
| Pausen     | Nicht nötig          | `...` Ellipsen              |
| Länge      | Beliebig             | Max. 5 Min. empfohlen       |

## 3) Warum Chunking?

Auch Edge TTS profitiert von Chunking:

- Lange Texte können zu Timeouts führen
- Kleinere Chunks = bessere Fehlerbehandlung
- Cache ermöglicht inkrementelles Rendering

Lange Audio-Scripts werden in Chunks aufgeteilt, gerendert und zusammengefügt.

**Strategie:**

- ✅ In kurze Stücke splitten (max. 4.000 Zeichen)
- ✅ Chunks einzeln rendern mit Retry
- ✅ Cache-Hash für Idempotenz → nur Änderungen rendern
- ✅ Am Ende zu einer MP3 pro Audio-Script zusammenfügen

## 4) Output-Struktur

### Temporäre Chunks (während Rendering)

```text
.tts-cache/
├── hashes.json              ← Content-Hashes für Cache
└── chunks/
    ├── 01-learning-xyz/
    │   ├── 0001.mp3
    │   ├── 0002.mp3
    │   └── ...
    └── ...
```

### Finale Ausgabe

```text
content/.../lecture-items/
├── 01-learning-xyz.md           ← Content
├── 01-learning-xyz.audio.md     ← Audio-Script (Input)
└── 01-learning-xyz.mp3          ← Generierte MP3 (Output)
```

## 5) Prerequisites

### System-Tools

```bash
# ffmpeg für MP3-Zusammenfügung
brew install ffmpeg

# edge-tts (Python-basiert)
pip3 install edge-tts
```

### PATH konfigurieren (falls nötig)

Falls `edge-tts` nicht gefunden wird:

```bash
echo 'export PATH="$HOME/Library/Python/3.9/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Node Dependencies

```bash
npm i --save-dev slugify
```

**Bereits vorhanden:**

- `js-yaml` – YAML Frontmatter parsing

## 6) Edge TTS Setup

### Kein API-Key nötig! 🎉

Edge TTS nutzt die Microsoft Edge Speech Services – kostenlos und ohne Account.

### Deutsche Stimmen

| Voice                               | Beschreibung                      |
| ----------------------------------- | --------------------------------- |
| `de-DE-FlorianMultilingualNeural`   | **Default** – Männlich, natürlich |
| `de-DE-SeraphinaMultilingualNeural` | Weiblich, natürlich               |
| `de-DE-ConradNeural`                | Männlich, sachlich                |
| `de-DE-KatjaNeural`                 | Weiblich, freundlich              |
| `de-AT-JonasNeural`                 | Männlich, österreichisch          |
| `de-AT-IngridNeural`                | Weiblich, österreichisch          |
| `de-CH-JanNeural`                   | Männlich, Schweiz                 |

### Alle Stimmen auflisten

```bash
edge-tts --list-voices | grep de-
```

## 7) Chunking-Strategie

### Reihenfolge

1. Nach Pausen-Markern splitten (`[Pause]`, `[Längere Pause]`)
2. Nach Absätzen splitten (doppelte Newline)
3. Nach Satzgrenzen splitten (`.`, `?`, `!`)
4. Hard-Split bei >4.000 Zeichen (Notfall)

### Pausen-Marker

| Marker            | Bedeutung            | TTS-Umsetzung         |
| ----------------- | -------------------- | --------------------- |
| `[Pause]`         | Kurze Pause (1-2s)   | Chunk-Grenze          |
| `[Längere Pause]` | Längere Pause (3-4s) | Chunk-Grenze + Stille |

## 8) Verarbeitungspipeline

### Step 1: Audio-Script-Dateien finden

Script durchsucht den angegebenen Ordner nach `*.audio.md` Dateien.

### Step 2: Audio-Script lesen

Audio-Script (`.audio.md`) wird eingelesen. Kein Frontmatter nötig – nur Sprechtext.

### Step 3: Pausen-Marker verarbeiten

- `[Pause]` → Kurze Stille (1s)
- `[Längere Pause]` → Längere Stille (3s)

### Step 4: Chunking

Deterministisch in Stücke ≤4.000 Zeichen splitten.

### Step 5: Caching

Hash berechnen:

```text
sha256(voice + text)
```

Cache-Hit → Chunk überspringen.

### Step 6: Rendering (Edge TTS)

Jeder Chunk wird gerendert:

- Retries: 3 Versuche mit Backoff
- Concurrency: 3 parallel (keine Rate Limits!)

### Step 7: Zusammenfügen

Mit `ffmpeg` werden die Chunks zu einer MP3 zusammengefügt:

```bash
ffmpeg -f concat -i chunks.txt -c copy output.mp3
```

Die finale MP3 wird neben dem Audio-Script abgelegt:

```text
01-learning-xyz.audio.md  →  01-learning-xyz.mp3
```

## 9) npm Scripts

Ergänzung in `package.json`:

```json
{
  "scripts": {
    "tts:dry": "node scripts/render-tts.js --dry",
    "tts:render": "node scripts/render-tts.js",
    "tts:lecture": "node scripts/render-tts.js --path"
  }
}
```

## 10) CLI Design

### Verwendung

```bash
# Dry-Run: Zeigt was gerendert würde
node scripts/render-tts.js --dry content/bsc-ew/01-chemie/01-vorlesung/

# Render: Generiert MP3s aus allen *.audio.md im Ordner
node scripts/render-tts.js content/bsc-ew/01-chemie/01-vorlesung/

# Einzelnes Audio-Script
node scripts/render-tts.js content/.../01-learning-xyz.audio.md
```

### Flags

| Flag      | Beschreibung                                               |
| --------- | ---------------------------------------------------------- |
| `--dry`   | Nur anzeigen, nicht rendern                                |
| `--force` | Cache ignorieren, alles neu rendern                        |
| `--voice` | Stimme wählen (default: `de-DE-FlorianMultilingualNeural`) |

## 11) VS Code Tasks

Ergänzung in `.vscode/tasks.json`:

```json
{
  "label": "TTS: Dry Run",
  "type": "shell",
  "command": "node",
  "args": ["scripts/render-tts.js", "--dry", "${input:lecturePath}"],
  "problemMatcher": []
},
{
  "label": "TTS: Render Lecture",
  "type": "shell",
  "command": "node",
  "args": ["scripts/render-tts.js", "${input:lecturePath}"],
  "problemMatcher": []
}
```

## 12) Best Practices

### Audio-Scripts schreiben

- Kurze, klare Sätze (max. 20 Wörter)
- Pausen für Betonung und Verständnis
- Formeln ausschreiben
- Max. 5 Minuten pro Audio

### Chunks nicht zu groß

- Ziel: 3.000–4.000 Zeichen
- Kürzere Chunks = weniger Timeout-Risiko

### Formel-Aussprache

Siehe [audio-scripts.md](../.github/copilot/audio-scripts.md):

| Formel       | Aussprache                 |
| ------------ | -------------------------- |
| `$H_2O$`     | "H zwei O"                 |
| `$E=mc^2$`   | "E gleich m mal c Quadrat" |
| `$\Delta H$` | "Delta H"                  |

## 13) Script-Struktur

```text
scripts/
├── render-tts.js           ← Haupt-CLI
└── lib/
    ├── tts-chunker.js      ← Audio-Script → Chunks
    ├── tts-cache.js        ← Hash-basierter Cache
    └── tts-edge.js         ← Edge TTS Wrapper
```

## 14) Definition of Done

- [ ] Audio-Script-Konvention dokumentiert (`*.audio.md`)
- [ ] `npm run tts:dry` zeigt zu rendernde Audio-Scripts
- [ ] `npm run tts:render` erzeugt MP3s aus `*.audio.md`
- [ ] MP3-Dateiname = Audio-Script-Name ohne `.audio`
- [ ] Re-Run ohne Änderungen rendert **0 neue** Chunks (Cache)
- [ ] `npm run build` erkennt MP3s → `audioFile` im Bundle
- [ ] Audio-Player erscheint in der App

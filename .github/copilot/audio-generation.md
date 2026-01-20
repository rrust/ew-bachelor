# Audio Generation

Audio-Dateien aus Scripts generieren.

## Prerequisites

Bevor Audio generiert werden kann:

```bash
# 1. ffmpeg für MP3-Verarbeitung
brew install ffmpeg

# 2. edge-tts (Python-basiert, kostenlos!)
pip3 install edge-tts

# 3. Falls edge-tts nicht gefunden wird, PATH erweitern:
echo 'export PATH="$HOME/Library/Python/3.9/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# 4. Test
edge-tts --list-voices | grep de-
```

## TTS-Tool: Edge TTS (empfohlen)

| Eigenschaft | Wert                              |
| ----------- | --------------------------------- |
| Kosten      | **Kostenlos**                     |
| Qualität    | Sehr gut (Neural Voices)          |
| API-Key     | Nicht nötig                       |
| Default     | `de-DE-FlorianMultilingualNeural` |

### Deutsche Stimmen

| Voice                               | Beschreibung                      |
| ----------------------------------- | --------------------------------- |
| `de-DE-FlorianMultilingualNeural`   | **Default** – Männlich, natürlich |
| `de-DE-SeraphinaMultilingualNeural` | Weiblich, natürlich               |
| `de-DE-ConradNeural`                | Männlich, sachlich                |
| `de-DE-KatjaNeural`                 | Weiblich, freundlich              |
| `de-AT-JonasNeural`                 | Männlich, österreichisch          |
| `de-AT-IngridNeural`                | Weiblich, österreichisch          |

## Workflow

### 1. Audio-Script erstellen

⚠️ **WICHTIG:** Audio-Scripts sind **Plain Text** (`.txt`), kein Markdown!

Edge TTS liest Markdown-Syntax wie `#`, `**`, `-` wörtlich vor.

```text
01-learning-xyz.md         ← Content (Markdown)
01-learning-xyz.audio.txt  ← Audio-Script (Plain Text!)
```

Siehe [audio-scripts.md](audio-scripts.md) für Format-Details.

### 2. TTS generieren

**Mit Edge TTS:**

```bash
edge-tts --voice de-DE-FlorianMultilingualNeural \
  -f 01-learning-xyz.audio.txt \
  --write-media 01-learning-xyz.mp3
```

### 3. Qualitätsprüfung

- [ ] Audio anhören (komplett!)
- [ ] Aussprache korrekt?
- [ ] Tempo angemessen?
- [ ] Keine Artefakte/Störgeräusche?
- [ ] Länge entspricht Erwartung?

### 4. Datei platzieren

```text
content/{studyId}/NN-modul/NN-vorlesung/lecture-items/
├── 04-learning-ionenbindung.md
├── 04-learning-ionenbindung.audio.txt  # Audio-Script (Plain Text)
└── 04-learning-ionenbindung.mp3        # Generierte MP3
```

## Dateinamen-Konvention

```text
{name}.md          ← Content (Markdown)
{name}.audio.txt   ← Audio-Script (Plain Text!)
{name}.mp3         ← Generierte MP3

Beispiele:
01-learning-einleitung.md / .audio.txt / .mp3
lecture.md / .audio.txt / .mp3
```

## Batch-Generierung

Für mehrere Audio-Scripts in einem Ordner:

```bash
#!/bin/bash
# generate-audio.sh

LECTURE_DIR="content/bsc-ew/01-chemie/05-ionenbindung/lecture-items/"
VOICE="de-DE-FlorianMultilingualNeural"

for script in "$LECTURE_DIR"/*.audio.txt; do
  # 01-learning-xyz.audio.txt → 01-learning-xyz.mp3
  output="${script%.audio.txt}.mp3"
  
  echo "Generating: $(basename "$output")"
  edge-tts --voice "$VOICE" -f "$script" --write-media "$output"
done
```

## Tipps

### Bessere Aussprache

- Lange Wörter trennen: "Elektronenkonfiguration" → "Elektronen-Konfiguration"
- Abkürzungen ausschreiben: "z.B." → "zum Beispiel"
- Zahlen ausschreiben: "3" → "drei"

### Pausen erzwingen (kein SSML!)

Edge TTS unterstützt **kein SSML**. Pausen werden durch Interpunktion erzeugt:

| Technik                    | Wirkung               | Beispiel                        |
| -------------------------- | --------------------- | ------------------------------- |
| Punkt `.`                  | Kurze Pause (~0.5s)   | `Erster Satz. Zweiter Satz.`    |
| Ellipse `...`              | Längere Pause (~1-2s) | `Denkt darüber nach... Fertig?` |
| Doppelte Ellipse `... ...` | Noch länger (~2-3s)   | `Wichtig... ... Weiter.`        |
| Fragezeichen `?`           | Steigende Intonation  | `Versteht ihr das?`             |
| Ausrufezeichen `!`         | Betonung              | `Das ist wichtig!`              |
| Leerzeile                  | Absatz-Pause          | Text durch Leerzeile trennen    |

### Formel-Aussprache

| Formel     | Aussprache                   |
| ---------- | ---------------------------- |
| $H_2O$     | "H zwei O"                   |
| $CO_2$     | "C O zwei"                   |
| $E = mc^2$ | "E gleich m mal c Quadrat"   |
| $\Delta H$ | "Delta H"                    |
| $n = m/M$  | "n gleich m geteilt durch M" |

## Checkliste vor Commit

- [ ] Alle .mp3 Dateien vorhanden
- [ ] Dateinamen = .md Dateinamen (ohne `.audio`)
- [ ] Audio-Qualität geprüft
- [ ] Länge angemessen
- [ ] Im Browser getestet (Audio-Player funktioniert?)

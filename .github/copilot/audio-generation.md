# Audio Generation

Audio-Dateien aus Scripts generieren.

## TTS-Tools

| Tool        | Kosten              | Qualität  | Empfehlung            |
| ----------- | ------------------- | --------- | --------------------- |
| OpenAI TTS  | ~$0.015/1K chars    | Sehr gut  | Für finale Produktion |
| ElevenLabs  | Free Tier limitiert | Exzellent | Für wichtige Inhalte  |
| Edge TTS    | Kostenlos           | Gut       | Für Prototypen        |
| macOS `say` | Kostenlos           | Basic     | Nur zum Testen        |

## Workflow

### 1. Script erstellen

Siehe [audio-scripts.md](audio-scripts.md)

### 2. TTS generieren

**Mit OpenAI API:**

```bash
# Beispiel mit curl
curl https://api.openai.com/v1/audio/speech \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "tts-1-hd",
    "input": "Der Sprechtext hier...",
    "voice": "onyx",
    "response_format": "mp3"
  }' \
  --output 04-learning-ionenbindung.mp3
```

**Empfohlene Stimmen:**
- `onyx` – Männlich, klar, professionell
- `nova` – Weiblich, warm, freundlich
- `alloy` – Neutral, sachlich

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
└── 04-learning-ionenbindung.mp3   # ← Hier
```

## Dateinamen-Konvention

```text
[NN]-[content-type]-[thema].mp3

Beispiele:
01-learning-einleitung.mp3
05-video-beschreibung.mp3
10-self-assessment-check.mp3
lecture.mp3  (für Vorlesungs-Intro)
```

## Batch-Generierung

Für mehrere Dateien ein Script erstellen:

```bash
#!/bin/bash
# generate-audio.sh

SCRIPTS_DIR="audio-scripts/"
OUTPUT_DIR="content/bsc-ew/01-chemie/05-ionenbindung/lecture-items/"

for script in "$SCRIPTS_DIR"/*.txt; do
  filename=$(basename "$script" .txt)
  echo "Generating: $filename.mp3"
  
  # OpenAI TTS aufrufen
  curl -s https://api.openai.com/v1/audio/speech \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"model\": \"tts-1-hd\",
      \"input\": \"$(cat "$script")\",
      \"voice\": \"onyx\"
    }" \
    --output "$OUTPUT_DIR/$filename.mp3"
done
```

## Tipps

### Bessere Aussprache

- Lange Wörter trennen: "Elektronenkonfiguration" → "Elektronen-Konfiguration"
- Abkürzungen ausschreiben: "z.B." → "zum Beispiel"
- Zahlen ausschreiben: "3" → "drei"

### Pausen erzwingen

Bei OpenAI TTS:
- Komma = kurze Pause
- Punkt = längere Pause
- `...` = noch längere Pause

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
- [ ] Dateinamen = .md Dateinamen
- [ ] Audio-Qualität geprüft
- [ ] Länge angemessen
- [ ] Im Browser getestet (Audio-Player funktioniert?)

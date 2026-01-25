# Audio Content Workflow

Kompletter Workflow: Audio-Dateien für Lerninhalte erstellen.

## Quick Reference

**Befehl:** "Erstelle Audio-Dateien für Vorlesung X" oder "Audio-Content für Vorlesung X generieren"

**Was Copilot automatisch macht:**

1. Learning-Content Items im Kapitel identifizieren
2. Für jedes Item ein Audio-Script erstellen (`.audio.txt`)
3. **Batch-Script ausführen:** `npm run generate:audio -- --lecture XX --force`
4. **Build ausführen:** `npm run build`
5. Fertig – Audio-Player erscheint in der App

⚠️ **WICHTIG:** Bei Audio-Anfragen IMMER den kompletten Workflow durchführen!
Nicht nur Scripts erstellen, sondern auch MP3-Generierung und Build anstoßen.

## Batch-Script Verwendung

```bash
# Nur fehlende Audio-Dateien generieren
npm run generate:audio

# Alle Audio-Dateien neu generieren (--force)
npm run generate:audio -- --force

# Nur bestimmte Vorlesung
npm run generate:audio -- --lecture 18

# Nur bestimmtes Modul
npm run generate:audio -- --module 02

# Kombiniert mit Force
npm run generate:audio -- --lecture 18 --force

# Dry-Run (zeigt was generiert würde)
npm run generate:audio -- --dry-run
```

## Voraussetzungen

```bash
# Einmalig installieren:
brew install ffmpeg
pip3 install edge-tts

# Test:
edge-tts --list-voices | grep de-
```

## Schritt-für-Schritt Workflow

### Schritt 1: Zielordner identifizieren

```bash
# Struktur:
content/{studyId}/NN-modul/NN-vorlesung/lecture-items/
```

**Beispiel:** "Modul 2, Kapitel 2" = `02-chemie-grundlagen/02-atome-formeln`

```bash
ls content/bsc-ernaehrungswissenschaften/02-chemie-grundlagen/02-atome-formeln/lecture-items/
```

### Schritt 2: Learning-Content Items finden

Nur `learning-content` Items bekommen Audio:

```bash
grep -l "type: 'learning-content'" content/.../lecture-items/*.md
```

**Kein Audio für:**

- `self-assessment-mc`, `fill-in-the-blank`, `matching`, `ordering`
- `calculation`, `practice-exercise`
- `youtube-video` (hat eigenes Video)
- `self-assessment` (Checkliste)

### Schritt 3: Content lesen und Audio-Script schreiben

Für jedes Learning-Content Item:

1. **Content lesen** – Verstehe den Inhalt
2. **Audio-Script erstellen** – Eigenständig, nicht copy-paste!

**Dateiname:** `{name}.audio.txt` (Plain Text, kein Markdown!)

### Schritt 4: Audio-Scripts erstellen

#### Format-Regeln

⚠️ **KRITISCH:** Plain Text, kein Markdown!

| ❌ NICHT verwenden | ✅ Stattdessen  |
| ----------------- | -------------- |
| `# Überschrift`   | Direkt Text    |
| `**fett**`        | Normaler Text  |
| `- Liste`         | "Erstens, ..." |
| `$H_2O$`          | "H zwei O"     |
| `[Link](url)`     | Weglassen      |

#### Stil-Regeln

- **Eigenständig** – Nicht die Vorlesungs-Audio wiederholen
- **Engaging** – Fragen, Beispiele, Vergleiche
- **Wissenschaftlich korrekt** – Nichts verfälschen!
- **Kurz** – Max. 1-2 Minuten pro Item
- **Abwechslungsreich** – Verschiedene Einstiege, kein YouTube-Stil

#### Einstiegs-Varianten (NICHT "Heute lernen wir...")

| Typ          | Beispiel                                            |
| ------------ | --------------------------------------------------- |
| Frage        | "Warum explodiert Natrium in Wasser?"               |
| Fakt         | "Ein Atom ist zu 99,9% leerer Raum."                |
| Kontrast     | "Phosphor brennt spontan. Stickstoff ist träge."    |
| Alltagsbezug | "Jeder Kaffee enthält Milliarden Koffein-Moleküle." |

#### Pausen (kein SSML!)

| Technik   | Wirkung       | Beispiel                 |
| --------- | ------------- | ------------------------ |
| `...`     | Pause (~1-2s) | "Denk darüber nach..."   |
| `... ...` | Längere Pause | "Wichtig... ... Weiter." |
| Leerzeile | Absatz-Pause  | Text trennen             |

#### Formel-Aussprache

| Formel     | Aussprache                 |
| ---------- | -------------------------- |
| $H_2O$     | "H zwei O"                 |
| $CO_2$     | "C O zwei"                 |
| $E = mc^2$ | "E gleich m mal c Quadrat" |
| g/mol      | "Gramm pro Mol"            |

### Schritt 5: MP3s generieren (Batch-Script)

Nach Erstellung aller Audio-Scripts das Batch-Script ausführen:

```bash
# Für eine bestimmte Vorlesung (z.B. Vorlesung 18)
npm run generate:audio -- --lecture 18 --force

# Für ein ganzes Modul
npm run generate:audio -- --module 02 --force
```

Das Script:
- Findet alle `.audio.txt` Dateien
- Generiert MP3s parallel (3 gleichzeitig)
- Überspringt bereits aktuelle Dateien (ohne `--force`)
- Zeigt Fortschritt und Zusammenfassung

### Schritt 6: Build ausführen

```bash
npm run build  # Registriert audioFile in Bundles
```

Im Browser prüfen: Audio-Player erscheint bei Learning-Content Items.

## Beispiel: Kompletter Durchlauf

**Anfrage:** "Bitte den Audio-Content für Vorlesung 18 generieren"

**Copilot macht automatisch:**

```bash
# 1. Ordner identifizieren
content/bsc-ernaehrungswissenschaften/02-chemie-grundlagen/18-saeuren-basen-gleichgewicht/

# 2. Learning-Content Items lesen und Audio-Scripts erstellen
# → 01-learning-common-ion.audio.txt
# → 05-learning-puffer.audio.txt
# → ...

# 3. MP3s mit Batch-Script generieren
npm run generate:audio -- --lecture 18 --force

# 4. Build ausführen
npm run build

# 5. Fertig!
```

## Dateistruktur (Ergebnis)

```text
content/.../01-materie-messen/
├── lecture.md
├── lecture.audio.txt        # Optional
├── lecture.mp3              # Optional
└── lecture-items/
    ├── 01-einfuehrung-chemie.md
    ├── 01-einfuehrung-chemie.audio.txt
    ├── 01-einfuehrung-chemie.mp3
    ├── 02-wissenschaftliche-methode.md
    ├── 02-wissenschaftliche-methode.audio.txt
    ├── 02-wissenschaftliche-methode.mp3
    └── ...
```

## Stimmen-Auswahl

| Voice                               | Beschreibung                      |
| ----------------------------------- | --------------------------------- |
| `de-DE-FlorianMultilingualNeural`   | **Default** – Männlich, natürlich |
| `de-DE-SeraphinaMultilingualNeural` | Weiblich, natürlich               |
| `de-AT-JonasNeural`                 | Männlich, österreichisch          |
| `de-AT-IngridNeural`                | Weiblich, österreichisch          |

## Checkliste

- [ ] Nur `learning-content` Items haben Audio
- [ ] Audio-Scripts sind Plain Text (`.audio.txt`)
- [ ] Keine Markdown-Syntax im Script
- [ ] Formeln ausgeschrieben
- [ ] Eigenständiger, engaging Inhalt
- [ ] Wissenschaftlich korrekt
- [ ] `npm run generate:audio -- --lecture XX --force` ausgeführt
- [ ] `npm run build` ausgeführt
- [ ] Im Browser getestet

## Troubleshooting

| Problem                       | Lösung                                  |
| ----------------------------- | --------------------------------------- |
| `edge-tts: command not found` | `pip3 install edge-tts` und PATH prüfen |
| Markdown wird vorgelesen      | `.audio.txt` muss Plain Text sein!      |
| Audio-Player fehlt            | `npm run build` ausführen               |
| Falsche Aussprache            | Wörter trennen, Zahlen ausschreiben     |

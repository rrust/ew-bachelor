# Audio Scripts

Erstellung von Audio-Scripts für TTS-Generierung.

## Zweck

Audio-Dateien ergänzen Lerninhalte für:

- Barrierefreiheit
- Lernen unterwegs
- Auditive Lerntypen

## Dateistruktur

```text
content/{studyId}/NN-modul/NN-vorlesung/
├── lecture.md              # Vorlesungs-Metadaten
├── lecture.audio.txt       # Audio-Script (Plain Text!)
├── lecture.mp3             # Generierte MP3
└── lecture-items/
    ├── 01-einleitung.md
    ├── 01-einleitung.audio.txt  # Audio-Script
    ├── 01-einleitung.mp3        # Generierte MP3
    └── ...
```

**Konvention:**

- Audio-Script: `{name}.audio.txt` (Plain Text!)
- Generierte MP3: `{name}.mp3`
- Content: `{name}.md`

## Script-Format

⚠️ **WICHTIG:** Audio-Scripts sind **Plain Text** (`.txt`), kein Markdown!

Edge TTS liest Markdown-Syntax wie `#`, `**`, `-` wörtlich vor.

### Beispiel Audio-Script

```text
Willkommen zur Vorlesung über Ionenbindung.

Die Ionenbindung ist eine der wichtigsten chemischen Bindungsarten.

...

Sie entsteht, wenn ein Metallatom Elektronen an ein Nichtmetallatom abgibt.

Das Metallatom wird dabei zum positiv geladenen Kation.
Das Nichtmetallatom wird zum negativ geladenen Anion.

...

Diese entgegengesetzt geladenen Ionen ziehen sich elektrostatisch an
und bilden ein stabiles Ionengitter.
```

## Sprachstil-Richtlinien

### Allgemein

- Natürlich und klar sprechen
- Kurze Sätze (max. 20 Wörter)
- Aktiv statt Passiv
- Fachbegriffe erklären

### Struktur

1. **Einleitung** – Thema benennen
2. **Hauptteil** – Konzepte erklären
3. **Zusammenfassung** – Kernpunkte wiederholen

### Pausen (kein SSML!)

Edge TTS unterstützt **kein SSML**. Pausen werden durch Interpunktion erzeugt:

| Technik                    | Wirkung               | Beispiel                        |
| -------------------------- | --------------------- | ------------------------------- |
| Punkt `.`                  | Kurze Pause (~0.5s)   | `Erster Satz. Zweiter Satz.`    |
| Ellipse `...`              | Längere Pause (~1-2s) | `Denkt darüber nach... Fertig?` |
| Doppelte Ellipse `... ...` | Noch länger (~2-3s)   | `Wichtig... ... Weiter.`        |
| Fragezeichen `?`           | Steigende Intonation  | `Versteht ihr das?`             |
| Ausrufezeichen `!`         | Betonung              | `Das ist wichtig!`              |
| Leerzeile                  | Absatz-Pause          | Text durch Leerzeile trennen    |

### Formeln

- Ausschreiben: "$E = mc^2$" → "E gleich m mal c Quadrat"
- Einheiten: "g/mol" → "Gramm pro Mol"
- Subscripts: "H₂O" → "H zwei O"

## Längen-Empfehlungen

| Content-Typ                | Audio-Länge |
| -------------------------- | ----------- |
| Kurze Einleitung           | 30-60 Sek.  |
| Learning-Content (einfach) | 1-2 Min.    |
| Learning-Content (komplex) | 3-5 Min.    |
| Zusammenfassung            | 1-2 Min.    |

**Maximum:** 5 Minuten pro Item

## Beispiel-Templates

### Einführung

```text
Willkommen zur Vorlesung über Ionenbindung.

In dieser Einheit lernst du, was Ionenbindung ist,
wie sie entsteht, und warum sie so wichtig ist.

...

Lass uns beginnen.
```

### Konzept-Erklärung

```text
Die Gitterenergie ist ein wichtiges Konzept in der Chemie.

...

Sie beschreibt die Energie, die frei wird, wenn sich Ionen
zu einem Kristallgitter zusammenlagern.

Ein Beispiel... Kochsalz, also Natriumchlorid, hat eine
sehr hohe Gitterenergie von 786 Kilojoule pro Mol.

...

Zusammengefasst... Je höher die Gitterenergie, desto stabiler
ist das Ionengitter.
```

### Zusammenfassung

```text
Fassen wir zusammen, was wir gelernt haben.

...

Erstens... Die Ionenbindung entsteht durch Elektronenübertragung.

Zweitens... Ionenverbindungen bilden Kristallgitter.

Drittens... Die Gitterenergie bestimmt die Stabilität.

... ...

Im nächsten Abschnitt beschäftigen wir uns mit kovalenten Bindungen.
```

## Checkliste

- [ ] Kurze, klare Sätze
- [ ] Fachbegriffe erklärt
- [ ] Formeln ausgeschrieben
- [ ] Pausen markiert
- [ ] Länge angemessen (max. 5 Min.)
- [ ] Dateiname = MD-Dateiname + .mp3

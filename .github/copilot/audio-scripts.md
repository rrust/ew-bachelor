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
├── lecture.md           # Vorlesungs-Metadaten
├── lecture.mp3          # Audio für Einführung (optional)
└── lecture-items/
    ├── 01-einleitung.md
    ├── 01-einleitung.mp3   # Audio für dieses Item
    ├── 02-konzept.md
    └── 02-konzept.mp3
```

Audio-Datei = gleicher Name wie .md, aber `.mp3`

## Script-Format

Audio-Scripts werden als Markdown geschrieben und dann per TTS konvertiert.

```markdown
# Audio-Script: Ionenbindung

## Sprechtext

Die Ionenbindung ist eine der wichtigsten chemischen Bindungsarten.

Sie entsteht, wenn ein Metallatom Elektronen an ein Nichtmetallatom abgibt.

[Pause]

Das Metallatom wird dabei zum positiv geladenen Kation.
Das Nichtmetallatom wird zum negativ geladenen Anion.

[Pause]

Diese entgegengesetzt geladenen Ionen ziehen sich elektrostatisch an 
und bilden ein stabiles Ionengitter.

---

**Länge:** ca. 45 Sekunden
**Datei:** 04-learning-ionenbindung.mp3
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

### Pausen

- `[Pause]` – Kurze Pause (1-2 Sek.)
- `[Längere Pause]` – Zwischen Abschnitten (3-4 Sek.)

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

```markdown
# Audio: Einführung [Thema]

Willkommen zur Vorlesung über [Thema].

In dieser Einheit lernst du:
- [Lernziel 1]
- [Lernziel 2]
- [Lernziel 3]

[Pause]

Lass uns beginnen.
```

### Konzept-Erklärung

```markdown
# Audio: [Konzeptname]

[Konzeptname] ist ein wichtiges Prinzip in der [Fachgebiet].

[Pause]

Es bedeutet, dass [einfache Erklärung].

[Pause]

Ein Beispiel: [Alltagsbeispiel]

[Pause]

Zusammengefasst: [Kernaussage in einem Satz].
```

### Zusammenfassung

```markdown
# Audio: Zusammenfassung

Fassen wir zusammen, was wir gelernt haben.

[Pause]

Erstens: [Hauptpunkt 1]

Zweitens: [Hauptpunkt 2]

Drittens: [Hauptpunkt 3]

[Längere Pause]

Im nächsten Abschnitt beschäftigen wir uns mit [Vorschau].
```

## Checkliste

- [ ] Kurze, klare Sätze
- [ ] Fachbegriffe erklärt
- [ ] Formeln ausgeschrieben
- [ ] Pausen markiert
- [ ] Länge angemessen (max. 5 Min.)
- [ ] Dateiname = MD-Dateiname + .mp3

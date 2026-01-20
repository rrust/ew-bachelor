# Modul-Lern-Modus

## Übersicht

Ein neuer, zusätzlicher Lernmodus der parallel zu den Vorlesungen und dem bestehenden Vorlesungs-Trainings-Modus genutzt werden kann.

## Architektur-Analyse (bestehende App)

### Content-Struktur

```text
content/{studyId}/{moduleId}/
├── module.md                    # Modul-Metadaten
├── {lectureId}/
│   ├── lecture.md               # Vorlesungs-Metadaten
│   ├── lecture-items/           # Markdown-Dateien für Lerninhalt
│   │   └── NN-name.md
│   ├── questions/               # Markdown-Dateien für Test-Fragen
│   │   └── NN-name.md
│   └── lecture-bundle.json      # GENERIERT durch npm run build
└── module-exam/                 # Modul-Prüfungsfragen (noch leer)
```

### Build-Prozess

`npm run build` führt aus:
1. `generate-content-list.js` → modules.json, content-list.json
2. `generate-lecture-bundles.js` → lecture-bundle.json pro Vorlesung
3. `generate-search-index.js` → search-index.json
4. `generate-achievements.js` → achievements.json

**Wichtig:** Markdown-Dateien werden zur Build-Zeit in JSON konvertiert!

### Fragenformat (questions/*.md)

```yaml
---
type: 'multiple-choice-multiple'
topic: 'Thema'
question: 'Fragetext'
options:
  - 'Option A'
  - 'Option B'
correctAnswers:
  - 'Option A'    # Volltext, nicht Index!
---

**Erklärung:** Ausführliche Erklärung nach der Antwort.
```

### Progress-Tracking (localStorage)

```javascript
// Struktur: progress_{studyId}
{
  userName: "...",
  modules: {
    "02-chemie-grundlagen": {
      lectures: {
        "01-materie-messen": {
          score: 85,
          badge: "gold",
          completedAt: "2026-01-20T..."
        }
      }
    }
  },
  training: {           // Vorlesungs-Training
    tokens: 5,
    totalAnswered: 120,
    totalRounds: 12
  }
}
```

### Bestehender Trainings-Modus (training.js)

- Zieht Fragen aus **abgeschlossenen Tests** (lecture.quiz)
- 10 Fragen pro Runde (zufällig gemischt)
- Token-System: 8-10 richtig = 3 Tokens, 5-7 = 1 Token
- Tokens können für Achievement-Verlängerungen verwendet werden

### Modul-Karte (modules.js)

Aktuell zwei Buttons im Footer:
- **Vorlesung** (book icon) → Öffnet Vorlesungsliste
- **Prüfung** (exam icon) → Noch nicht implementiert

## Prototyp-Analyse (blabla Repository)

### Struktur

```
CODING_PLAN/fragen/
├── 01_Aufbau_Atome_Periodensystem/
│   ├── chemie-level-1.md  (10 Fragen)
│   ├── chemie-level-2.md  (10 Fragen)
│   ├── chemie-level-3.md  (10 Fragen)
│   ├── chemie-level-4.md  (10 Fragen)
│   └── chemie-level-5.md  (10 Fragen)
├── 02_Elemente_Ionen_Mol/
│   └── ... (5 Level-Dateien)
├── ... (13 weitere Kapitel)
└── 15_Elektrochemie_Redox/
    └── ... (5 Level-Dateien)
```

**Statistik:**
- **15 Kapitel** (Themengebiete)
- **5 Levels** pro Kapitel (Schwierigkeitsstufen)
- **10 Fragen** pro Level-Datei
- **75 Dateien** insgesamt
- **750 Fragen** insgesamt

### Themengebiete (unabhängig von Vorlesungen)

Die 15 Kapitel sind **eigenständige Themengebiete** und werden NICHT den Vorlesungen zugeordnet.
Wenn man bei einem Thema nicht weiterkommt, muss man die entsprechenden Vorlesungen durcharbeiten.

| #   | Themengebiet                      |
| --- | --------------------------------- |
| 01  | Aufbau_Atome_Periodensystem       |
| 02  | Elemente_Ionen_Mol                |
| 03  | Gleichungen_Stoechiometrie        |
| 04  | Reaktionen_Empirische_Formeln     |
| 05  | Loesungen_Konzentrationen         |
| 06  | Saeuren_Basen_Grundlagen          |
| 07  | Bohr_Elektronenkonfiguration      |
| 08  | Ionenbindung_Lewis                |
| 09  | Polaritaet_VSEPR                  |
| 10  | Valenzbindung_Hybridisierung_MO   |
| 11  | Thermodynamik_Enthalpie           |
| 12  | Aggregatzustaende_Phasendiagramme |
| 13  | Kolligative_Eigenschaften         |
| 14  | Saeuren_Basen_pH_Puffer           |
| 15  | Elektrochemie_Redox               |

### Fragenformat (Markdown)

```markdown
## Frage 1
**Aus welchen Teilchen besteht ein Atom?**

- [ ] A. Protonen, Neutronen und Elektronen
- [ ] B. Nur aus Protonen und Elektronen
- [ ] C. Nur aus Neutronen und Elektronen
- [ ] D. Aus Molekülen und Ionen

**Richtige Antworten:** A
```

**Eigenschaften:**
- Immer Multiple-Choice (A/B/C/D, manchmal auch E)
- Kann eine ODER mehrere richtige Antworten haben
- Einfache Markdown-Syntax
- Keine Erklärungen (im Gegensatz zu ew-bachelor Fragen)

### Fragenformat (JavaScript - questionsData.js)

```javascript
{
  id: 1,
  text: "Welche Aussagen zum Atomaufbau sind korrekt?",
  options: [
    "Protonen befinden sich im Atomkern",
    "Elektronen haben eine positive Ladung",
    "Neutronen sind elektrisch neutral",
    "Die Elektronenhülle ist viel größer als der Atomkern"
  ],
  correctAnswers: [0, 2, 3],  // Indizes der korrekten Antworten
  difficulty: 1               // Level 1-5
}
```

## Konzept

### Unterschied zum bestehenden Trainingsmodus

| Aspekt       | Vorlesungs-Trainings-Modus                    | Modul-Lern-Modus (NEU)          |
| ------------ | --------------------------------------------- | ------------------------------- |
| Fragenquelle | Zufällig aus abgeschlossenen Vorlesungs-Tests | Eigener Pool von Modul-Fragen   |
| Umfang       | Abhängig von erledigten Vorlesungen           | 750+ Fragen pro Modul           |
| Progression  | Zufällige Wiederholung                        | Level-basiert (1 → 2 → 3 → ...) |
| Ziel         | Wiederholung                                  | Prüfungsvorbereitung            |
| Erklärungen  | Ja, nach jeder Frage                          | Nein (Richtig/Falsch)           |

### Level-System

1. **Level-Progression**: Man muss zuerst ALLE Level-1-Fragen korrekt beantworten, bevor Level-2-Fragen freigeschaltet werden
2. **Wiedervorlage**: Falsch beantwortete Fragen werden erneut vorgelegt (random aus dem aktuellen Level)
3. **Abschluss**: Richtig beantwortete Fragen verschwinden aus dem Pool
4. **Goldene Karte**: Wenn ALLE Modul-Fragen (alle 5 Levels) korrekt beantwortet wurden, wird die Modul-Karte "golden"
5. **Keine Kapitel-Auswahl**: Man kann Themengebiete NICHT einzeln auswählen - alle Fragen eines Levels kommen gemischt (random)
6. **Lernstrategie**: Wenn man bei einem Thema nicht weiterkommt → Vorlesungen durcharbeiten, dort gibt es den kontextuellen Vorlesungs-Trainings-Modus

### Schwierigkeitsgrade

| Level | Beschreibung                 | Beispiel                                                     |
| ----- | ---------------------------- | ------------------------------------------------------------ |
| 1     | Definitionen & Grundbegriffe | "Wo befinden sich die Protonen?"                             |
| 2     | Verständnis & Zusammenhänge  | "Welche Faktoren beeinflussen die Reaktionsgeschwindigkeit?" |
| 3     | Anwendung                    | "Welche Aussagen zu Pufferlösungen sind korrekt?"            |
| 4     | Analyse                      | "Welche Aussagen zur Stereochemie sind korrekt?"             |
| 5     | Prüfungsniveau               | Komplexe Fragen wie in echter Uni-Prüfung                    |

### UI-Integration

#### Modul-Karte: Zwei Fortschrittsbalken

In der Modul-Karte werden **zwei Fortschrittsbalken** angezeigt:

```
┌─────────────────────────────────────┐
│ Modul 2: Grundlagen der Chemie      │
│                                     │
│ Vorlesungs-Tests:  ████████░░ 80%   │
│ Modul-Training:    ██████░░░░ 60%   │
│                                     │
│ [Training] [Vorlesung] [Test]       │
└─────────────────────────────────────┘
```

#### Modul-Karte: Action-Buttons (3 statt 2)

Aktuell gibt es: `[Vorlesung] [Test]`

Neu: `[Training] [Vorlesung] [Test]`

- **Training**: Startet den Modul-Trainings-Modus (Level-basiert)
- **Vorlesung**: Öffnet Vorlesungsübersicht (wie bisher)
- **Test**: Startet Modul-Prüfung (noch nicht implementiert)

**Ziel für Studierende:** Beide Balken vollständig füllen → optimale Prüfungsvorbereitung

## Implementierungsplan (konsistent mit bestehender Architektur)

### Phase 1: Content-Struktur anlegen

Markdown-Dateien **direkt übertragen** (nicht als JSON). Build-Script generiert JSON.

```
content/bsc-ernaehrungswissenschaften/02-chemie-grundlagen/
└── module-training/
    ├── training.md                           # Metadaten (analog zu lecture.md)
    ├── 01-aufbau-atome-periodensystem/
    │   ├── level-1.md                        # 10 Fragen
    │   ├── level-2.md                        # 10 Fragen
    │   ├── level-3.md                        # 10 Fragen
    │   ├── level-4.md                        # 10 Fragen
    │   └── level-5.md                        # 10 Fragen
    ├── 02-elemente-ionen-mol/
    │   └── ... (5 Level-Dateien)
    └── 15-elektrochemie-redox/
        └── ... (5 Level-Dateien)
```

### Phase 2: Fragenformat anpassen

Das blabla-Format in ew-bachelor-Format konvertieren:

**Vorher (blabla):**
```markdown
## Frage 1
**Aus welchen Teilchen besteht ein Atom?**

- [ ] A. Protonen, Neutronen und Elektronen
- [ ] B. Nur aus Protonen und Elektronen

**Richtige Antworten:** A
```

**Nachher (ew-bachelor):**
```yaml
---
type: 'module-training-question'
topic: 'Aufbau Atome & Periodensystem'
level: 1
question: 'Aus welchen Teilchen besteht ein Atom?'
options:
  - 'Protonen, Neutronen und Elektronen'
  - 'Nur aus Protonen und Elektronen'
correctAnswers:
  - 'Protonen, Neutronen und Elektronen'
---
```

**Hinweis:** Kein Markdown-Body (keine Erklärung)!

### Phase 3: Build-Script erweitern

Neues Script: `scripts/generate-training-bundles.js`

```javascript
// Output:
// content/{studyId}/{moduleId}/module-training/training-bundle.json
{
  moduleId: "02-chemie-grundlagen",
  totalQuestions: 750,
  levels: 5,
  topics: [
    {
      id: "01-aufbau-atome-periodensystem",
      title: "Aufbau Atome & Periodensystem",
      questions: {
        1: [...],  // 10 Fragen Level 1
        2: [...],  // 10 Fragen Level 2
        ...
      }
    },
    ...
  ]
}
```

In `npm run build` integrieren.

### Phase 4: Progress-Tracking erweitern

localStorage-Struktur erweitern:

```javascript
{
  modules: { ... },
  training: { ... },       // Bestehendes Vorlesungs-Training
  moduleTraining: {        // NEU: Modul-Training
    "02-chemie-grundlagen": {
      currentLevel: 2,     // Aktuelles Level
      answeredCorrectly: [
        "01-aufbau-atome-periodensystem:1:3",  // topic:level:questionIndex
        "01-aufbau-atome-periodensystem:1:5",
        ...
      ],
      totalCorrect: 150,   // Für Fortschrittsbalken
      completedAt: null    // Oder Timestamp wenn alle 750 korrekt
    }
  }
}
```

### Phase 5: UI-Komponenten

1. **modules.js erweitern**:
   - Zweiter Fortschrittsbalken (Modul-Training)
   - Training-Button (links von Vorlesung)
   - 5 Sterne für Level-Anzeige (★★★☆☆)

2. **Neues Module: module-training.js**:
   - Training-Session starten
   - Frage anzeigen (mit Themengebiet)
   - Antwort prüfen (einfaches Richtig/Falsch)
   - Level-Fortschritt tracken

3. **Neuer View in index.html**:
   - `<div id="module-training-view">`
   
4. **Router erweitern**:
   - `/module/{moduleId}/training` Route

### Phase 6: blabla Repository löschen

Nach erfolgreichem Import und Test das blabla Repository archivieren/löschen.

## Entscheidungen

- ✅ **Keine Vorlesungs-Zuordnung**: Themengebiete sind eigenständig
- ✅ **Modul-Training-Start**: Neuer Button "Training" auf der Modul-Karte (links von Vorlesung/Test)
- ✅ **Keine Kapitel-Auswahl**: Alle Fragen eines Levels kommen random gemischt
- ✅ **Keine Prüfungssimulation**: Dafür gibt es später die Modul-Prüfung
- ✅ **Keine Erklärungen**: Einfaches Richtig/Falsch Feedback
- ✅ **Level-Fortschritt**: Mit 5 kleinen Sternen dargestellt (★★★☆☆ = Level 3 erreicht)
- ✅ **Themengebiet anzeigen**: Bei jeder Frage wird das Themengebiet mit angezeigt

## Offene Fragen

(keine mehr)

## Nächste Schritte

1. ✅ **Analyse**: blabla-Prototyp analysiert - 750 Fragen in 15 Kapiteln × 5 Levels
2. **Parser**: Script schreiben um Markdown → JSON zu konvertieren
3. **Import**: 750 Fragen in ew-bachelor importieren
4. **Backend**: Progress-Tracking implementieren
5. **UI**: Views und Komponenten erstellen
6. **Testing**: Mit echten Fragen testen

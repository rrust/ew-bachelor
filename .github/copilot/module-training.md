# Module Training

Erstellung von Modul-Trainings-Fragen (Casual Training Mode).

## Übersicht

Training-Fragen sind **unabhängig** von Vorlesungs-Nummern und nach **Themengebieten** organisiert.

### Struktur pro Modul

```text
15 Kapitel × 5 Level × 10 Fragen = 750 Fragen
```

### Antwort-Schema

| Level | Antwortmöglichkeiten | Korrekte Antworten |
| ----- | -------------------- | ------------------ |
| 1     | 5 (A-E)              | Immer 1            |
| 2-3   | 5 (A-E)              | 1-3                |
| 4-5   | 5 (A-E)              | 1-5                |

## Generierungs-Workflow

Wenn du aufgefordert wirst, Modul-Training-Fragen zu generieren:

### 1. Kapitel-Definition lesen

Lies die Kapitel-Definitionen aus:
```
studies-material/{studyId}/{moduleId}/module-training.md
```

Beispiel für Chemie:
```
studies-material/bsc-ernaehrungswissenschaften/02-grundlagen-chemie/module-training.md
```

### 2. Relevante Vorlesungen lesen (optional)

Für inhaltliche Tiefe können die zugehörigen Vorlesungen gelesen werden:
```
content/{studyId}/{moduleId}/{lectureId}/lecture-items/
```

### 3. Fragen generieren

Generiere 10 Fragen für das angeforderte Kapitel und Level im YAML-Format.

### 4. Output speichern

Speichere in:
```
content/{studyId}/{moduleId}/module-training/{kapitelNr}-{kapitelName}/level-{X}.yaml
```

## Output-Format

```yaml
# level-1.yaml
topic: 'Aufbau der Atome & Periodensystem'
level: 1
questions:
  - question: 'Aus welchen Teilchen besteht ein Atom?'
    options:
      - 'Nur aus Protonen und Elektronen im Kern'
      - 'Ausschließlich aus Neutronen und Elektronen'
      - 'Aus Protonen, Neutronen und Elektronen'
      - 'Nur aus positiv geladenen Teilchen'
      - 'Aus Molekülen und verschiedenen Ionen'
    correct: [2]  # 0-basiert, C ist korrekt
    
  - question: 'Wo befinden sich Protonen und Neutronen?'
    options:
      - 'In der äußeren Elektronenschale des Atoms'
      - 'Gleichmäßig im gesamten Atom verteilt'
      - 'Im zentralen Kern des Atoms'
      - 'Zwischen Atomkern und Elektronenhülle'
      - 'Außerhalb der Elektronenwolke'
    correct: [2]
```

### Für Multiple Correct (Level 2-5)

```yaml
  - question: 'Welche Aussagen über Isotope sind korrekt?'
    options:
      - 'Isotope haben die gleiche Anzahl an Protonen'
      - 'Isotope haben unterschiedliche Neutronenzahlen'
      - 'Isotope haben verschiedene Ordnungszahlen'
      - 'Isotope zeigen identische chemische Eigenschaften'
      - 'Isotope besitzen unterschiedliche Massenzahlen'
    correct: [0, 1, 4]  # A, B, E sind korrekt
```

## Qualitätsregeln

### ❌ VERBOTEN

1. **Meta-Optionen**
   - "Alle genannten sind korrekt"
   - "Keine der genannten"
   - "A und B sind beide richtig"

2. **Negativ-Fragen**
   - "Was ist NICHT korrekt?"
   - "Welche Aussage trifft NICHT zu?"

3. **Frage-Keywords in korrekter Antwort**
   - ❌ Frage: "Wie viele **Perioden** hat das **Periodensystem**?"
   - ❌ Antwort: "Das **Periodensystem** hat sieben **Perioden**"
   - ✅ Antwort: "Es sind insgesamt sieben waagerechte Reihen"
   - **Regel:** Verwende SYNONYME oder Umschreibungen für Schlüsselbegriffe!

4. **Absolute Begriffe als Muster**
   - Wörter wie "immer", "niemals", "alle", "keine", "ausschließlich", "nur"
   - ❌ NICHT nur in falschen Antworten verwenden (verrät die Lösung!)
   - ✅ Entweder in ALLEN Optionen vermeiden ODER gleichmäßig verteilen

5. **Längen-Muster**
   - ❌ Korrekte Antwort ist die längste
   - ❌ Korrekte Antwort ist deutlich kürzer als alle anderen
   - ✅ Alle 5 Optionen haben ähnliche Länge (±10 Zeichen)

### ✅ ERFORDERLICH

1. **5 Antwortmöglichkeiten** (A-E)

2. **Längen-Balance (KRITISCH!)**
   - Ziel: Alle Optionen 35-55 Zeichen
   - Maximum: 65 Zeichen pro Option
   - Varianz: Max. 15 Zeichen zwischen kürzester und längster
   - **VOR dem Speichern prüfen:** Ist die korrekte Antwort die längste? → Kürzen!

3. **Positions-Verteilung (KRITISCH!)**
   - Bei 10 Fragen: Korrekte Antwort auf jeder Position (A-E) genau 2×
   - Verteilung pro Level: A=2, B=2, C=2, D=2, E=2
   - **NIEMALS** alle korrekten Antworten auf Position B oder C!

4. **Synonym-Nutzung für Frage-Keywords**
   - Jedes Hauptwort aus der Frage muss in der korrekten Antwort umschrieben werden
   - Beispiele:
     - "Atom" → "kleinste Einheit", "Teilchen"
     - "Periodensystem" → "Elementtafel", "Anordnung der Elemente"
     - "Protonen" → "positiv geladene Kernteilchen"
     - "Elektronen" → "negativ geladene Hüllteilchen"

5. **Grammatische Konsistenz**
   - Alle 5 Optionen beginnen gleich (z.B. alle mit Artikel, alle mit Verb)
   - Alle 5 Optionen enden gleich (z.B. alle mit Substantiv)

6. **Plausible Distraktoren**
   - Mind. 2 Distraktoren für Laien kaum unterscheidbar von Lösung
   - Basierend auf typischen Fehlvorstellungen
   - Falsche Antworten müssen inhaltlich sinnvoll klingen

### 📋 CHECKLISTE VOR SPEICHERN

Für jede der 10 Fragen prüfen:

- [ ] Keine Keywords aus der Frage in der korrekten Antwort?
- [ ] Korrekte Antwort ist NICHT die längste Option?
- [ ] Alle Optionen zwischen 35-55 Zeichen?
- [ ] Keine absoluten Begriffe NUR in falschen Antworten?
- [ ] Position der korrekten Antwort variiert (2× pro Position A-E)?

## Level-Anforderungen

### Level 1: Grundlagen
- Reine Wissensabfrage
- Keine Berechnungen
- Distraktoren: ähnlich klingende Begriffe

**Beispiel:**
```yaml
question: 'Was gibt die Ordnungszahl eines Elements an?'
options:
  - 'Die Anzahl der Neutronen im Atomkern'
  - 'Die Anzahl der Protonen im Atomkern'
  - 'Die Gesamtmasse des Atoms in Dalton'
  - 'Die Anzahl der Valenzelektronen'
  - 'Die Summe aus Protonen und Neutronen'
correct: [1]
```

### Level 2: Verständnis
- Konzeptionelles Verständnis
- Ursache-Wirkung erkennen
- Höchstens Überschlagsrechnungen

**Beispiel:**
```yaml
question: 'Warum leiten Metalle elektrischen Strom?'
options:
  - 'Ihre Atome sind positiv geladen'
  - 'Sie besitzen frei bewegliche Elektronen'
  - 'Ihre Kristallstruktur ist kubisch'
  - 'Sie haben eine hohe Dichte'
  - 'Ihre Bindungen sind rein ionisch'
correct: [1]
```

### Level 3: Anwendung
- Mehrere Konzepte verknüpfen
- Einfache Berechnungen (1-2 Schritte)

**Beispiel:**
```yaml
question: 'Wie viel Mol sind 44 g CO₂ (M = 44 g/mol)?'
options:
  - '0,5 mol aufgrund der Verdopplung'
  - '1,0 mol nach der Formel n = m/M'
  - '2,0 mol wegen zwei Sauerstoffatomen'
  - '22,4 mol entsprechend dem Molvolumen'
  - '44 mol da Masse gleich Molmasse'
correct: [1]
```

### Level 4: Analyse
- Komplexe Problemstellungen
- Mehrstufige Berechnungen (3-5 Schritte)

**Beispiel:**
```yaml
question: 'Bei der Verbrennung von 12 g Kohlenstoff mit 32 g O₂ entstehen wie viel g CO₂?'
options:
  - '22 g da Summe der Atommassen'
  - '44 g entsprechend der Stöchiometrie'
  - '88 g wegen doppelter Sauerstoffmenge'
  - '24 g durch Halbierung der Masse'
  - '66 g als Mittelwert der Massen'
correct: [1]
```

### Level 5: Synthese/Transfer
- Integration verschiedener Themen
- Unbekannte Kontexte
- Komplexe Szenarien

**Beispiel:**
```yaml
question: 'Ein unbekanntes Gas hat bei 0°C und 1 atm die Dichte 1,96 g/L. Welche Aussagen sind korrekt?'
options:
  - 'Die molare Masse beträgt etwa 44 g/mol'
  - 'Es könnte sich um Kohlendioxid handeln'
  - 'Das Gas ist leichter als Luft'
  - 'Die Stoffmenge pro Liter ist 0,045 mol'
  - 'Es handelt sich um ein zweiatomiges Gas'
correct: [0, 1, 3]
```

## Post-Processing

Nach der Generierung wird das Qualitäts-Script ausgeführt:

```bash
node scripts/analyze-training-quality.js
```

Das Script prüft:
- Längen-Balance
- Positions-Verteilung (korrigiert automatisch)
- Negativ-Fragen
- Meta-Optionen
- Grammatik-Konsistenz

Bei zu vielen Problemen: Kapitel neu generieren.

## Beispiel-Aufruf

**User:** "Generiere Modul-Training-Fragen für Modul 2 (Chemie), Kapitel 1, Level 1"

**Copilot:**
1. Liest `studies-material/.../02-grundlagen-chemie/module-training.md`
2. Identifiziert Kapitel 1: "Aufbau der Atome & Periodensystem"
3. Generiert 10 Fragen im YAML-Format
4. Speichert in `content/.../module-training/01-aufbau-atome-periodensystem/level-1.yaml`

## Dateistruktur

```text
content/{studyId}/{moduleId}/module-training/
├── training.md                              # Metadaten
├── training-bundle.json                     # Generiert durch Build
├── 01-aufbau-atome-periodensystem/
│   ├── level-1.yaml
│   ├── level-2.yaml
│   ├── level-3.yaml
│   ├── level-4.yaml
│   └── level-5.yaml
├── 02-elemente-ionen-mol/
│   ├── level-1.yaml
│   └── ...
└── ...
```

## Checkliste vor Commit

- [ ] 10 Fragen pro Level
- [ ] 5 Antwortmöglichkeiten pro Frage
- [ ] Korrekte Anzahl korrekter Antworten (Level-abhängig)
- [ ] Keine Meta-Optionen
- [ ] Keine Negativ-Fragen
- [ ] Ähnliche Antwortlängen
- [ ] Grammatisch konsistent
- [ ] `analyze-training-quality.js` ohne kritische Fehler

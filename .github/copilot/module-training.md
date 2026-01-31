# Module Training

Erstellung von Modul-Trainings-Fragen und praktischen Übungen (Casual Training Mode).

## Übersicht

Training-Inhalte sind **unabhängig** von Vorlesungs-Nummern und nach **Themengebieten** organisiert.

### Struktur pro Modul

```text
Multiple-Choice:  15 Kapitel × 5 Level × 10 Fragen = 750 Fragen
Praktische Übungen: ~10 Kapitel × 5 Level × 2 Übungen = ~100 Übungen
```

### Inhalts-Typen

| Typ                    | Beschreibung                   | Bewertung       |
| ---------------------- | ------------------------------ | --------------- |
| **Multiple-Choice**    | Wissens- und Verständnisfragen | Automatisch     |
| **Praktische Übungen** | Berechnungen auf Papier        | Selbstkontrolle |

### Antwort-Schema (MC)

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
- [ ] `generate-training-bundles.js` ausgeführt
- [ ] `generate-test-progress.js` ausgeführt (Testdaten aktualisiert)

## Befehle nach Generierung

Nach dem Erstellen/Ändern von Training-Fragen:

```bash
# 1. Qualität prüfen
node scripts/analyze-training-quality.js

# 2. Training-Bundle generieren
node scripts/generate-training-bundles.js [studyId]

# 3. Testdaten aktualisieren (WICHTIG!)
node scripts/generate-test-progress.js

# 4. Optional: Im Browser testen
# → Modul-Training öffnen, Dev-Mode aktivieren
```

---

## Praktische Übungen

### Übersicht

Praktische Übungen sind Berechnungsaufgaben, die auf Papier gelöst und selbst kontrolliert werden.

**Kapitel mit Übungen:**

| Kapitel                        | Übungen | Begründung              |
| ------------------------------ | ------- | ----------------------- |
| 01 Atome & PSE                 | ❌       | Faktenwissen            |
| 02 Elemente, Ionen & Mol       | ✅ 10    | Mol-Berechnungen        |
| 03 Gleichungen & Stöchiometrie | ✅ 10    | Kernthema               |
| 04 Reaktionen & Formeln        | ✅ 10    | Empirische Formeln      |
| 05 Lösungen & Konzentrationen  | ✅ 10    | Verdünnungsrechnungen   |
| 06 Säuren & Basen (Grundl.)    | ⚠️ 5     | Einfache Neutralisation |
| 07 Bohr & Elektronenkonf.      | ⚠️ 5     | Konfigurationen         |
| 08 Ionenbindung & Lewis        | ⚠️ 5     | Lewis-Strukturen        |
| 09 Polarität & VSEPR           | ⚠️ 5     | Geometrie               |
| 10 Hybridisierung & MO         | ⚠️ 5     | Bindungsordnung         |
| 11 Thermodynamik               | ✅ 10    | Hess, Enthalpie         |
| 12 Aggregatzustände            | ⚠️ 5     | Clausius-Clapeyron      |
| 13 Kolligative Eig.            | ✅ 10    | ΔT, Osmose              |
| 14 Säuren & Basen (Fortg.)     | ✅ 10    | pH, pKs, Puffer         |
| 15 Elektrochemie               | ✅ 10    | Nernst, Faraday         |

### Generierungs-Workflow für Übungen

#### 1. Kapitel-Definition lesen

Wie bei MC-Fragen aus `module-training.md` im Material-Ordner.

#### 2. Übungen generieren

Generiere 2 Übungen pro Level (= 10 Übungen pro Kapitel) im YAML-Format.

#### 3. Output speichern

Speichere in:
```text
content/{studyId}/{moduleId}/module-training/{kapitelNr}-{kapitelName}/exercises.yaml
```

### Übungs-Format

```yaml
# exercises.yaml
topic: 'Chemische Gleichungen & Stöchiometrie'
blueprintType: 'stoichiometry-calculation'
exercises:
  # Level 1: Grundlegend (2-3 Schritte)
  - id: 'ex-03-01'
    title: 'Stoffmenge berechnen'
    level: 1
    
    task: |
      Berechne die Stoffmenge von 36 g Wasser (H₂O).
      Molare Masse: M(H₂O) = 18 g/mol
    
    hints:
      keyword: 'Formel n = m/M anwenden'
      approach: |
        1. Gegebene Werte identifizieren
        2. Formel n = m/M einsetzen
      overview: |
        - m = 36 g
        - M = 18 g/mol
        - n = 36/18 = 2 mol
    
    steps:
      - description: 'Gegebene Werte notieren'
        solution: 'm(H₂O) = 36 g, M(H₂O) = 18 g/mol'
      - description: 'Formel für Stoffmenge anwenden'
        solution: 'n = m/M = 36 g / 18 g/mol = 2 mol'
    
    finalAnswer: 'n(H₂O) = 2 mol'
    
    relatedCheatsheets:
      - 'mol-konzept-cheatsheet'

  # Level 3: Mittel (4-5 Schritte)
  - id: 'ex-03-02'
    title: 'Verbrennung von Kohlenstoff'
    level: 3
    
    task: |
      Bei der vollständigen Verbrennung von 12,0 g Kohlenstoff
      mit Sauerstoff entsteht Kohlendioxid.
      
      Berechne:
      a) Die Stoffmenge an Kohlenstoff
      b) Die benötigte Masse an Sauerstoff
      c) Die entstehende Masse an CO₂
    
    hints:
      keyword: 'Stoffmengenverhältnis aus Reaktionsgleichung'
      approach: |
        1. Reaktionsgleichung aufstellen
        2. Stoffmengen über n = m/M berechnen
        3. Stöchiometrische Verhältnisse anwenden
      overview: |
        - Reaktionsgleichung: C + O₂ → CO₂
        - n(C) = 1,0 mol
        - n(O₂) = 1,0 mol → m(O₂) = 32,0 g
        - n(CO₂) = 1,0 mol → m(CO₂) = 44,0 g
    
    steps:
      - description: 'Reaktionsgleichung aufstellen'
        solution: 'C + O₂ → CO₂'
      - description: 'Stoffmenge von Kohlenstoff berechnen'
        solution: 'n(C) = 12,0 g / 12,0 g/mol = 1,0 mol'
      - description: 'Stoffmenge O₂ aus Verhältnis (1:1)'
        solution: 'n(O₂) = 1,0 mol'
      - description: 'Masse O₂ berechnen'
        solution: 'm(O₂) = 1,0 mol × 32,0 g/mol = 32,0 g'
      - description: 'Masse CO₂ berechnen (Verhältnis 1:1)'
        solution: 'm(CO₂) = 1,0 mol × 44,0 g/mol = 44,0 g'
    
    finalAnswer: |
      a) n(C) = 1,0 mol
      b) m(O₂) = 32,0 g
      c) m(CO₂) = 44,0 g
    
    relatedBlueprints:
      - 'stoichiometry-calculation-blueprint'
```

### Level-Definitionen für Übungen

| Level | Komplexität   | Schritte | Beispiel                             |
| ----- | ------------- | -------- | ------------------------------------ |
| 1     | Grundlegend   | 2-3      | Einfache n=m/M Berechnung            |
| 2     | Einfach       | 3-4      | Mol-Berechnung mit Umrechnung        |
| 3     | Mittel        | 4-5      | Stöchiometrie mit Reaktionsgleichung |
| 4     | Komplex       | 5-7      | Mehrstufige Reaktion, Ausbeute       |
| 5     | Anspruchsvoll | 6-8+     | Transfer, unbekannte Kontexte        |

### Qualitätsregeln für Übungen

#### ✅ ERFORDERLICH

1. **Eindeutige Aufgabenstellung**
   - Alle benötigten Werte angegeben
   - Klare Fragestellung (was ist gesucht?)
   - Keine mehrdeutigen Formulierungen

2. **Schrittweise Lösung**
   - Jeder Schritt ist ein logischer Teilschritt
   - Beschreibung erklärt WAS gemacht wird
   - Lösung zeigt WIE es gemacht wird

3. **Hint-Struktur**
   - `keyword`: Ein Begriff, der den Lösungsansatz verrät
   - `approach`: 2-4 Schritte als Übersicht
   - `overview`: Zusammenfassung mit Zahlen

4. **Realistische Werte**
   - Keine zu komplexen Zahlen (außer Level 5)
   - Plausible chemische Größenordnungen
   - Einheiten immer angegeben

#### ❌ VERBOTEN

1. **Unlösbare Aufgaben**
   - Fehlende Angaben
   - Widersprüchliche Werte

2. **Triviale Übungen**
   - Nur Einsetzen eines Wertes (außer Level 1)
   - Keine echte Berechnung

3. **Zu lange Lösungswege**
   - Mehr als 8 Schritte (wird unübersichtlich)

### Beispiel-Aufruf für Übungen

**User:** "Generiere Übungen für Modul 2 (Chemie), Kapitel 3 (Stöchiometrie)"

**Copilot:**
1. Liest `studies-material/.../02-grundlagen-chemie/module-training.md`
2. Identifiziert Kapitel 3: "Chemische Gleichungen & Stöchiometrie"
3. Generiert 2 Übungen pro Level (10 total) im YAML-Format
4. Speichert in `content/.../module-training/03-gleichungen-stoechiometrie/exercises.yaml`

### Checkliste für Übungen

- [ ] 2 Übungen pro Level (10 total, wenn Kapitel Übungen hat)
- [ ] Alle Pflichtfelder vorhanden (id, title, level, task, hints, steps, finalAnswer)
- [ ] Schritte sind logisch aufgebaut
- [ ] Hints bauen aufeinander auf (keyword → approach → overview)
- [ ] Realistische Werte und Größenordnungen
- [ ] blueprintType verknüpft passenden Blueprint

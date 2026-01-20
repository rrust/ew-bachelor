# Module Training

Erstellung von Modul-Trainings-Fragen (Casual Training Mode).

## Fragen-Struktur

Training-Fragen sind **unabhängig** von Vorlesungs-Content und dienen dem wiederholenden Üben.

### Aufbau: 15 Kapitel × 5 Level × 10 Fragen = 750 Fragen

```text
Level 1: Definitionen & Grundbegriffe     (IDs 1-150)
Level 2: Einfache Anwendung               (IDs 151-300)
Level 3: Mittlere Komplexität             (IDs 301-450)
Level 4: Fortgeschritten                  (IDs 451-600)
Level 5: Experte, Berechnungen            (IDs 601-750)
```

## Fragen-Format

```markdown
## Frage 1
**Was ist die Ordnungszahl eines Elements?**

- [ ] A. Die Anzahl der Neutronen im Kern
- [ ] B. Die Anzahl der Protonen im Kern
- [ ] C. Die Summe aus Protonen und Neutronen
- [ ] D. Die Anzahl der Elektronen in der äußeren Schale

**Richtige Antworten:** B

---
```

### Format-Regeln

| Element      | Format                      | Häufiger Fehler            |
| ------------ | --------------------------- | -------------------------- |
| Frage-Header | `## Frage X`                | `### Frage X`              |
| Fragetext    | `**Text?**`                 | Ohne Sternchen             |
| Optionen     | `- [ ] A. Text`             | `- A) Text`                |
| Antworten    | `**Richtige Antworten:** A` | `**Korrekte Antwort:** A`  |
| Mehrere      | `A, B, C`                   | `A,B,C` (ohne Leerzeichen) |
| Trenner      | `---`                       | Fehlend                    |

### Gültige Antwort-Kombinationen

```text
Einzeln:  A, B, C, D
Zweier:   A, B | A, C | A, D | B, C | B, D | C, D
Dreier:   A, B, C | A, B, D | A, C, D | B, C, D
Alle:     A, B, C, D
```

## Kritische Regeln

### ❌ VERBOTEN: Meta-Optionen

```markdown
# FALSCH - niemals verwenden!
- [ ] D. Alle genannten sind korrekt
- [ ] D. Keine der genannten
- [ ] D. A und B sind beide richtig
- [ ] D. Sowohl A als auch C
```

**Lösung:** Echte falsche Option einfügen, Antwort auf `A, B, C` ändern.

### ❌ VERBOTEN: Doppelte Optionen

```markdown
# FALSCH - Case-Sensitivity bei Formeln!
- [ ] A. N = m × Nₐ
- [ ] D. N = M × Nₐ   # M ≠ m in Chemie!
```

### ❌ VERBOTEN: Alle 4 korrekt

Wenn alle 4 Optionen korrekt sind:
- Benutzer muss ALLE auswählen
- Sehr verwirrend
- **Besser:** 3 korrekte + 1 falsche

### ⚠️ PRÜFEN: Singular vs. Plural

```markdown
# Inkonsistent:
**Welche Aussagen sind korrekt?**   # Plural
**Richtige Antworten:** B           # Nur eine!

# Lösung: Fragetext anpassen
**Welche Aussage ist korrekt?**
```

## Schwierigkeitsgrade

### Level 1: Grundbegriffe

- Definitionen abfragen
- Einfache Fakten
- Ja/Nein-Charakter

### Level 2: Anwendung

- Einfache Berechnungen
- Konzepte anwenden
- Beispiele erkennen

### Level 3: Mittelschwer

- Zusammenhänge verstehen
- Mehrere Konzepte verbinden
- Transfer auf neue Situationen

### Level 4: Fortgeschritten

- Komplexe Berechnungen
- Analyse von Szenarien
- Kritische Bewertung

### Level 5: Experte

- Prüfungsniveau
- Mehrstufige Probleme
- Grenzfälle und Ausnahmen

## Qualitätsprüfung

### Scripts ausführen

```bash
# Probleme finden
node scripts/analyzeQuestions.js

# Bei 0 kritischen Problemen:
node scripts/convertQuestions.js
```

### analyzeQuestions.js prüft

| Kategorie         | Schwere  | Beschreibung            |
| ----------------- | -------- | ----------------------- |
| Doppelte Optionen | KRITISCH | Gleiche Option mehrfach |
| Leere Optionen    | KRITISCH | Option A/B/C/D fehlt    |
| Ungültige Antwort | KRITISCH | z.B. "E" oder "A,B"     |
| Fehlende Optionen | KRITISCH | Weniger als 4 Optionen  |
| "Alle genannten"  | HOCH     | Meta-Optionen           |
| Alle 4 korrekt    | MITTEL   | A, B, C, D              |
| Duplikate         | MITTEL   | Gleiche Fragen          |

## Best Practices

### DO ✅

1. **Eindeutige Fragen**
2. **Klare, unterscheidbare Optionen**
3. **Echte falsche Optionen** (plausibel aber falsch)
4. **Konsistente Notation** (H₂O oder H2O, nicht mischen)
5. **Schwierigkeit dem Level anpassen**

### DON'T ❌

1. Keine Meta-Optionen
2. Keine mehrdeutigen Formulierungen
3. Keine Trick-Fragen
4. Korrekte Antwort NICHT systematisch die längste
5. Keine doppelten Fragen zwischen Kapiteln

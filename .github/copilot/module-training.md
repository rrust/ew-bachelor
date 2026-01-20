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

### ❌ VERBOTEN: Negativ-Fragen

```markdown
# FALSCH - niemals verwenden!
**Welche Aussage ist NICHT korrekt?**
**Was trifft NICHT zu?**
**Welche Option ist falsch?**
```

**Warum?** Negativ-Fragen sind kognitiv belastender und führen zu Verwirrung.
**Lösung:** Positiv formulieren: "Welche Aussage ist korrekt?"

### ❌ VERBOTEN: Antwort in Frage verraten

```markdown
# FALSCH - Antwort wird verraten!
**Was beschreibt die Ionisierungsenergie?**
- [ ] A. Die Ionisierungsenergie ist die Energie zur Entfernung eines Elektrons
#         ^^^^^^^^^^^^^^^^ Begriff aus der Frage wiederholt!

# BESSER:
- [ ] A. Energie zur Entfernung eines Elektrons aus einem Atom
```

### ❌ VERBOTEN: Frage-Begriff in Antwort

```markdown
# FALSCH - triviale Antwort!
**Was ist eine Doppelbindung?**
- [ ] A. Doppelte Umsetzung zwischen Ionen
#         ^^^^^^^ Begriff aus Frage!

# BESSER:
- [ ] A. Ionentausch zwischen zwei Verbindungen
```

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

## Qualitätskriterien für Antworten

### 📏 Längen-Balance

Alle Antwortoptionen sollten **ähnlich lang** sein!

```markdown
# FALSCH - korrekte Antwort viel länger!
- [ ] A. Wärme
- [ ] B. Licht
- [ ] C. Schall
- [ ] D. Die Freisetzung von Energie in Form von elektromagnetischer Strahlung ✓

# BESSER - alle ähnlich lang:
- [ ] A. Freisetzung von Wärmeenergie
- [ ] B. Emission von sichtbarem Licht
- [ ] C. Abstrahlung von Schallwellen
- [ ] D. Elektromagnetische Strahlung ✓
```

**Regel:** Korrekte Antworten dürfen maximal 50% länger sein als falsche.

### 🎯 Spezifitäts-Balance

Korrekte Antworten dürfen NICHT spezifischer sein als falsche!

```markdown
# FALSCH - nur korrekte Antwort hat Zahlen!
- [ ] A. Enthält Protonen
- [ ] B. Enthält Neutronen
- [ ] C. Hat 6 Protonen und 6 Neutronen ✓  # Zu spezifisch!
- [ ] D. Ist ein Atom

# BESSER - alle gleich spezifisch:
- [ ] A. Hat 6 Protonen und 8 Neutronen
- [ ] B. Hat 8 Protonen und 6 Neutronen
- [ ] C. Hat 6 Protonen und 6 Neutronen ✓
- [ ] D. Hat 12 Protonen und 6 Neutronen
```

### 🎭 Plausible Distraktoren

Falsche Antworten müssen **plausibel** sein – nicht offensichtlich falsch!

```markdown
# FALSCH - D ist offensichtlich falsch!
**Welches Element ist ein Edelgas?**
- [ ] A. Helium ✓
- [ ] B. Sauerstoff
- [ ] C. Stickstoff
- [ ] D. Banane    # Offensichtlich falsch!

# BESSER - alle sind Elemente:
- [ ] A. Helium ✓
- [ ] B. Sauerstoff
- [ ] C. Stickstoff
- [ ] D. Wasserstoff
```

**Technik für Distraktoren:**

- Häufige Missverständnisse nutzen
- Ähnliche Konzepte verwenden
- Typische Rechenfehler als Option anbieten

### 🚫 Keine Formulierungshinweise

Vermeide Wörter, die Hinweise geben:

| In falschen Antworten   | Warum problematisch?              |
| ----------------------- | --------------------------------- |
| "immer", "niemals"      | Absolute Aussagen sind oft falsch |
| "alle", "keine"         | Extremaussagen vermeiden          |
| "nur", "ausschließlich" | Zu einschränkend                  |

| In korrekten Antworten   | Warum problematisch?                    |
| ------------------------ | --------------------------------------- |
| "häufig", "meistens"     | Qualifizierte Aussagen sind oft richtig |
| "kann", "typischerweise" | Zu vorsichtig formuliert                |
| "in der Regel"           | Verräterisch vorsichtig                 |

```markdown
# FALSCH - "immer" verrät, dass B falsch ist!
- [ ] A. Wasser löst polare Stoffe ✓
- [ ] B. Wasser löst immer alle Stoffe  # "immer" = oft falsch!

# BESSER - neutral formuliert:
- [ ] A. Wasser löst polare Stoffe ✓
- [ ] B. Wasser löst unpolare Stoffe
```

### 📊 Positions-Verteilung

Korrekte Antworten sollten **gleichmäßig verteilt** sein:

| Position | Ziel | Problem wenn abweichend        |
| -------- | ---- | ------------------------------ |
| A        | ~25% | Zu oft A → Muster erkennbar    |
| B        | ~25% | Zu oft B → Muster erkennbar    |
| C        | ~25% | Zu selten C → Muster erkennbar |
| D        | ~25% | Zu selten D → Muster erkennbar |

**Tipp:** Bei 10 Fragen pro Level: 2-3× A, 2-3× B, 2-3× C, 2-3× D

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
# Technische Probleme finden (Format, doppelte Optionen, etc.)
node scripts/analyzeQuestions.js

# Qualitätsprobleme finden (Längen, Hinweise, Negativ-Fragen, etc.)
node scripts/analyzeQuestionQuality.js

# Bei 0 kritischen Problemen:
node scripts/convertQuestions.js
```

### analyzeQuestions.js prüft (technisch)

| Kategorie         | Schwere  | Beschreibung            |
| ----------------- | -------- | ----------------------- |
| Doppelte Optionen | KRITISCH | Gleiche Option mehrfach |
| Leere Optionen    | KRITISCH | Option A/B/C/D fehlt    |
| Ungültige Antwort | KRITISCH | z.B. "E" oder "A,B"     |
| Fehlende Optionen | KRITISCH | Weniger als 4 Optionen  |
| "Alle genannten"  | HOCH     | Meta-Optionen           |
| Alle 4 korrekt    | MITTEL   | A, B, C, D              |
| Duplikate         | MITTEL   | Gleiche Fragen          |

### analyzeQuestionQuality.js prüft (inhaltlich)

| Kategorie                 | Schwere  | Beschreibung                          |
| ------------------------- | -------- | ------------------------------------- |
| Negativ-Fragen            | KRITISCH | NICHT, kein, nie in Frage             |
| Antwort in Frage          | KRITISCH | Antwort-Keywords in Frage enthalten   |
| Frage-Begriff             | KRITISCH | Frage-Begriff erscheint in Antwort    |
| Längen-Ungleichgewicht    | HOCH     | Korrekte Antwort >50% länger          |
| Spezifitäts-Imbalance     | HOCH     | Nur korrekte Antworten haben Details  |
| Offensichtl. Distraktoren | HOCH     | Falsche Antworten zu leicht erkennbar |
| Absolute Begriffe         | MITTEL   | "immer/nie" in falschen Antworten     |
| Grammatik-Hinweise        | MITTEL   | Genus/Kasus verrät Antwort            |

### Statistiken beachten

Das Script zeigt auch:

- **Durchschnittliche Antwortlängen** – Sollten ~gleich sein
- **Positions-Verteilung** – A/B/C/D sollten je ~25% haben

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

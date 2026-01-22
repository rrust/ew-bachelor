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
**Was ist KEINE Eigenschaft von...?**
```

**Warum?** Negativ-Fragen sind kognitiv belastender und führen zu Verwirrung.
**Lösung:** Positiv formulieren: "Welche Aussage ist korrekt?"

**Auch verboten:**
- "kein", "keine", "keines"
- "nie", "niemals"
- "inkorrekt", "unzutreffend"

```markdown
# FALSCH:
**Welches Element bildet KEINE Ionen?**

# BESSER:
**Welches Element bildet bevorzugt kovalente Bindungen?**
```

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

**Regeln:**

- Korrekte Antworten dürfen maximal 50% länger sein als falsche
- Jede Antwort idealerweise 40–100 Zeichen
- Maximale Varianz zwischen kürzester und längster Antwort: ~20 Zeichen
- Die richtige Antwort darf NICHT die längste sein

### 📝 Grammatische Konsistenz

Alle 4 Antworten müssen **identische grammatische Struktur** haben!

```markdown
# FALSCH - uneinheitliche Struktur:
- [ ] A. Die Protonen im Kern
- [ ] B. Neutronen bestimmen die Masse
- [ ] C. Elektronen
- [ ] D. Weil Atome neutral sind

# BESSER - alle beginnen gleich:
- [ ] A. Die Anzahl der Protonen im Kern
- [ ] B. Die Anzahl der Neutronen im Kern
- [ ] C. Die Summe aus Protonen und Neutronen
- [ ] D. Die Anzahl der Valenzelektronen
```

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
- **Mind. 2 Distraktoren sollten für Laien kaum von der Lösung unterscheidbar sein**

### 🔤 Synonyme statt Wiederholung

**Wörter aus dem Fragetext dürfen in Antworten NICHT erscheinen** – nutze Synonyme!

```markdown
# FALSCH - "Ordnungszahl" wiederholt!
**Was gibt die Ordnungszahl an?**
- [ ] A. Die Ordnungszahl gibt die Protonenzahl an ✓

# BESSER - Synonym verwenden:
**Was gibt die Ordnungszahl an?**
- [ ] A. Diese Kennzahl entspricht der Protonenzahl ✓
```

**Ausnahmen:**

- Chemische Formeln (H₂O, NaCl) dürfen wiederholt werden
- Fachbegriffe ohne gutes Synonym dürfen wiederholt werden

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

Korrekte Antworten **MÜSSEN gleichmäßig verteilt** sein:

| Position | Ziel | Problem wenn abweichend        |
| -------- | ---- | ------------------------------ |
| A        | ~25% | Zu oft A → Muster erkennbar    |
| B        | ~25% | Zu oft B → Muster erkennbar    |
| C        | ~25% | Zu selten C → Muster erkennbar |
| D        | ~25% | Zu selten D → Muster erkennbar |

**Bei 10 Fragen pro Level:**
- 2-3× A, 2-3× B, 2-3× C, 2-3× D
- **NIEMALS** alle korrekten Antworten auf Position A!
- Das Script `fix-answer-positions.js` kann die Verteilung automatisch korrigieren

```bash
# Positions-Verteilung automatisch korrigieren
node scripts/fix-answer-positions.js
```

### ✅ Chemische Formeln sind OKAY

Wenn die Frage nach einer spezifischen Verbindung fragt, ist es **unvermeidlich und erlaubt**, 
dass die Antwort diese Formel enthält:

```markdown
# ERLAUBT - Formeln müssen in Frage und Antwort vorkommen
**Klassifiziere H₂SO₄, HNO₃, CH₃COOH nach Säurestärke:**
- [ ] A. H₂SO₄ und HNO₃ dissoziieren vollständig ✓  # Formeln hier sind OKAY!

# AUCH ERLAUBT - Konzeptbegriffe die zum Thema gehören
**Was zeigt das Pourbaix-Diagramm für Fe?**
- [ ] A. Zeigt wo Fe, Fe²⁺, Fe³⁺ vorliegen ✓  # Fe muss hier vorkommen!
```

**Faustregel:** Wenn die Frage NACH X fragt, muss die Antwort X enthalten dürfen.

## Schwierigkeitsgrade

### Level 1: Grundbegriffe

- Definitionen abfragen
- Einfache Fakten
- Ja/Nein-Charakter
- **Distraktoren:** Ähnlich klingende Begriffe, verwechselbare Fakten
- Keine Berechnungen

### Level 2: Anwendung

- Konzeptionelles Verständnis gefordert
- Einfache Berechnungen (Überschlagsrechnungen)
- Konzepte anwenden, Beispiele erkennen
- **Distraktoren:** Typische Fehlvorstellungen, Verwechslung von Ursache/Wirkung

### Level 3: Mittelschwer

- Mehrere Konzepte müssen verknüpft werden
- Transfer auf neue Situationen
- Einfache Berechnungen (1-2 Schritte)
- **Distraktoren:** Teilschritte als Lösung, falsche Verknüpfungen

### Level 4: Fortgeschritten

- Komplexe Problemstellungen mit mehreren Variablen
- Mehrstufige Berechnungen (3-5 Schritte)
- Analyse von Szenarien
- **Distraktoren:** Häufige Rechenfehler, falsche Formeln, Einheitenfehler

### Level 5: Experte

- Integration von Wissen aus verschiedenen Kapiteln/Themen
- Prüfungsniveau, mehrstufige Probleme
- Komplexe Berechnungen und/oder Transfer auf neue Situationen
- **Distraktoren:** Plausible aber unvollständige Lösungsansätze

## Qualitätsprüfung

### Workflow: Fragen-Qualität sicherstellen

```bash
# 1. Qualitätsprüfung ausführen
node scripts/analyze-training-quality.js

# 2. Probleme nach Priorität beheben:
#    🔴 KRITISCH → MUSS behoben werden (Negativ-Fragen, Antwort in Frage)
#    🟠 HOCH     → SOLLTE behoben werden (Längen, Spezifität)
#    🟡 MITTEL   → KANN behoben werden (absolute Begriffe)

# 3. Positions-Verteilung automatisch korrigieren (falls nötig)
node scripts/fix-answer-positions.js

# 4. Nach Korrekturen erneut prüfen
node scripts/analyze-training-quality.js
```

### Qualitätsziele

| Kategorie                   | Ziel   | Akzeptabel          |
| --------------------------- | ------ | ------------------- |
| Kritische Probleme          | 0      | 0                   |
| Absolute Begriffe           | 0      | < 10                |
| Spezifitäts-Ungleichgewicht | 0      | < 5                 |
| Längen-Ungleichgewicht      | 0      | < 100               |
| Positions-Verteilung        | je 25% | 20-30% pro Position |

### Scripts ausführen

```bash
# Qualitätsprüfung für fertige Trainings-Fragen (YAML-Format)
node scripts/analyze-training-quality.js

# Technische Probleme finden (Format, doppelte Optionen, etc.)
node scripts/analyzeQuestions.js

# Bei 0 kritischen Problemen:
node scripts/convertQuestions.js
```

### analyze-training-quality.js prüft

Das Hauptscript für Qualitätsprüfung. Zeigt:

| Kategorie                 | Schwere  | Beschreibung                          |
| ------------------------- | -------- | ------------------------------------- |
| Negativ-Fragen            | KRITISCH | NICHT, kein, nie in Frage             |
| Antwort in Frage          | KRITISCH | Antwort-Keywords in Frage enthalten   |
| Frage-Begriff in Antwort  | KRITISCH | Frage-Begriff erscheint in Antwort    |
| Längen-Ungleichgewicht    | HOCH     | Korrekte Antwort >50% länger          |
| Spezifitäts-Imbalance     | HOCH     | Nur korrekte Antworten haben Details  |
| Offensichtl. Distraktoren | HOCH     | Falsche Antworten zu leicht erkennbar |
| Absolute Begriffe         | MITTEL   | "immer/nie" in falschen Antworten     |

**Statistiken:**
- **Längen-Balance** – Verhältnis korrekt/falsch sollte < 1.3x sein
- **Positions-Verteilung** – A/B/C/D sollten je ~25% haben

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
6. **Alle Optionen ähnlich lang** (max. 50% Unterschied)
7. **Zahlen/Details in ALLEN Optionen** (nicht nur in korrekten)

### DON'T ❌

1. Keine Meta-Optionen ("Alle genannten", "Keine der genannten")
2. Keine mehrdeutigen Formulierungen
3. Keine Trick-Fragen
4. Korrekte Antwort NICHT systematisch die längste
5. Keine doppelten Fragen zwischen Kapiteln
6. Keine absoluten Begriffe in falschen Antworten ("immer", "niemals", "alle", "keine")
7. Keine Negativ-Fragen ("Was ist NICHT korrekt?")

## Häufige Probleme beheben

### Problem: Absolute Begriffe

```markdown
# VORHER (Problem):
- [ ] A. Alle Reaktionen sind exotherm     # "Alle" = absoluter Begriff!
- [ ] B. Die Reaktion ist endotherm ✓

# NACHHER (Korrigiert):
- [ ] A. Die meisten Reaktionen sind exotherm
- [ ] B. Die Reaktion ist endotherm ✓
```

**Ersetze:**
- "alle" → "die meisten", "viele"
- "immer" → "typischerweise", "in der Regel"
- "niemals" → "selten", "kaum"
- "keine" → "wenige", "kaum"

### Problem: Längen-Ungleichgewicht

```markdown
# VORHER (Problem - korrekte Antwort 3x länger):
- [ ] A. Wärme
- [ ] B. Licht  
- [ ] C. Schall
- [ ] D. Die vollständige Umwandlung chemischer Energie in Wärme ✓

# NACHHER (Korrigiert - alle ähnlich lang):
- [ ] A. Freisetzung von Wärmeenergie
- [ ] B. Emission von sichtbarem Licht
- [ ] C. Abstrahlung von Schallwellen
- [ ] D. Umwandlung in thermische Energie ✓
```

### Problem: Spezifitäts-Ungleichgewicht

```markdown
# VORHER (Problem - nur korrekte Antwort hat Zahlen):
- [ ] A. Das Molekül ist polar
- [ ] B. Es hat freie Elektronenpaare
- [ ] C. Die Bindungsordnung beträgt 2,5 ✓
- [ ] D. Es ist stabil

# NACHHER (Korrigiert - alle haben Zahlen):
- [ ] A. Die Bindungsordnung beträgt 1,5
- [ ] B. Die Bindungsordnung beträgt 2,0
- [ ] C. Die Bindungsordnung beträgt 2,5 ✓
- [ ] D. Die Bindungsordnung beträgt 3,0
```

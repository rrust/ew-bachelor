---
type: 'achievement'
achievementType: 'blueprint'
id: 'lewis-structure-blueprint'
title: 'Lewis-Strukturen Blueprint'
description: 'Systematischer Lösungsweg für das Zeichnen von Lewis-Strukturen'
icon: 'beaker'
contentType: 'markdown'
unlockCondition:
  type: 'first-exercise-solved'
  exerciseType: 'lewis-structure'
  moduleId: '02-chemie-grundlagen'
defaultDuration: 30
extensionDuration: 14
warningThreshold: 7
---

# Lewis-Strukturen Blueprint

## Allgemeiner Lösungsweg

### Schritt 1: Gesamtzahl der Valenzelektronen bestimmen

- **Hauptgruppenelemente:** Gruppennummer = Valenzelektronen
  - C (Gruppe 14): 4 e⁻
  - N (Gruppe 15): 5 e⁻
  - O (Gruppe 16): 6 e⁻
  - F, Cl (Gruppe 17): 7 e⁻

- **Bei Ionen:** Elektronen addieren/subtrahieren
  - Anionen (z.B. Cl⁻): +1 e⁻
  - Kationen (z.B. NH₄⁺): -1 e⁻

### Schritt 2: Zentralatom bestimmen

- Das **am wenigsten elektronegative** Atom ist meist zentral
- **Ausnahme:** H ist nie zentral
- Reihenfolge: C < S < N < P < O < F

### Schritt 3: Gerüst zeichnen

- Zentralatom in die Mitte
- Alle anderen Atome drumherum anordnen
- Jede Bindung = 2 Elektronen verbraucht

### Schritt 4: Freie Elektronenpaare verteilen

- Äußere Atome zuerst: **Oktett erfüllen**
- Dann Zentralatom: verbleibende Elektronen
- **H braucht nur 2 e⁻!**

### Schritt 5: Formale Ladungen prüfen

$$\text{Formale Ladung} = \text{VE} - \text{freie e}^- - \frac{1}{2} \times \text{Bindungs-e}^-$$

- Ziel: Alle formalen Ladungen = 0 (oder minimal)
- Negative Ladung beim elektronegativeren Atom

### Schritt 6: Mehrfachbindungen (falls nötig)

- Wenn Zentralatom **kein Oktett** hat:
- Freies Elektronenpaar eines Nachbarn zur Bindung machen
- → Doppel- oder Dreifachbindung

***

## Musterbeispiel: CO₂

**Aufgabe:** Zeichne die Lewis-Struktur von Kohlendioxid.

### Schritt 1: Valenzelektronen zählen

| Atom       | Anzahl | VE/Atom | Summe  |
| ---------- | ------ | ------- | ------ |
| C          | 1      | 4       | 4      |
| O          | 2      | 6       | 12     |
| **Gesamt** |        |         | **16** |

### Schritt 2: Zentralatom

C ist weniger elektronegativ → **C ist zentral**

### Schritt 3: Gerüst

```text
O - C - O
```
2 Bindungen = 4 e⁻ verbraucht, 12 e⁻ übrig

### Schritt 4: Freie Elektronenpaare

```text
:O - C - O:
```
Jedes O bekommt 6 e⁻ (3 Paare): 12 e⁻ verbraucht, 0 übrig

### Schritt 5: Oktett prüfen

- O links: 8 e⁻ ✓
- O rechts: 8 e⁻ ✓
- **C: nur 4 e⁻** ✗ (braucht 8!)

### Schritt 6: Doppelbindungen

Jeweils 1 freies Paar von O zur Bindung → Doppelbindungen

```text
O = C = O
```

**Endergebnis:**

```text
  ::       ::
   O = C = O
```

Jedes Atom hat jetzt 8 Elektronen. ✓

***

## Häufige Fehler

| Fehler                  | Richtig                        |
| ----------------------- | ------------------------------ |
| H als Zentralatom       | H ist immer außen!             |
| Oktett bei H            | H braucht nur 2 e⁻             |
| Vergessene freie Paare  | Alle VE müssen verteilt werden |
| Falsche Summe bei Ionen | ±1 e⁻ pro Ladung beachten!     |

## Spezialfälle

- **Erweiterte Oktette:** S, P, Cl können >8 e⁻ haben (3. Periode+)
- **Unvollständige Oktette:** B, Be, Al mit <8 e⁻ möglich
- **Radikale:** Ungerade Elektronenzahl → 1 ungepaartes e⁻

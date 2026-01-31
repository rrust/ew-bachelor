---
type: 'achievement'
achievementType: 'blueprint'
id: 'electrochemistry-calculation-blueprint'
title: 'Elektrochemie Blueprint'
description: 'Systematischer Lösungsweg für elektrochemische Berechnungen'
icon: 'beaker'
contentType: 'markdown'
unlockCondition:
  type: 'first-exercise-solved'
  exerciseType: 'electrochemistry-calculation'
  moduleId: '02-chemie-grundlagen'
defaultDuration: 30
extensionDuration: 14
warningThreshold: 7
---

# Elektrochemie – Blueprint

Du hast deine erste Elektrochemie-Übung gelöst!

***

## Grundgleichungen

| Berechnung        | Formel                                    |
| ----------------- | ----------------------------------------- |
| Zellspannung      | $E°_{\text{Zelle}} = E°_{\text{Kathode}} - E°_{\text{Anode}}$ |
| Gibbs-Energie     | $\Delta G° = -z \cdot F \cdot E°$         |
| Nernst-Gleichung  | $E = E° + \frac{0{,}059}{z} \cdot \lg\frac{[\text{Ox}]}{[\text{Red}]}$ |
| Faraday-Gesetz    | $n = \frac{Q}{z \cdot F} = \frac{I \cdot t}{z \cdot F}$ |

**Konstanten:**
- F = 96.485 C/mol (Faraday-Konstante)
- z = Anzahl übertragener Elektronen

***

## Galvanische Zelle

### Schritt 1: Anode und Kathode bestimmen

- **Anode:** Niedrigeres E° (Oxidation, Elektronen werden abgegeben)
- **Kathode:** Höheres E° (Reduktion, Elektronen werden aufgenommen)

### Schritt 2: Zellspannung berechnen

$$E°_{\text{Zelle}} = E°_{\text{Kathode}} - E°_{\text{Anode}}$$

### Schritt 3: Spontanität prüfen

- E° > 0 → spontan (ΔG < 0)
- E° < 0 → nicht spontan

***

## Musterbeispiel: Daniell-Element

**Aufgabe:** Berechne E° für Zn/Cu-Zelle.
E°(Zn²⁺/Zn) = -0,76 V, E°(Cu²⁺/Cu) = +0,34 V

**Lösung:**

1. **Anode:** Zn (niedrigeres E°) → Zn wird oxidiert
2. **Kathode:** Cu (höheres E°) → Cu²⁺ wird reduziert
3. **Zellspannung:**
   $E° = 0{,}34 - (-0{,}76) = 1{,}10$ V

***

## Nernst-Gleichung

Bei 25°C vereinfacht:

$$E = E° + \frac{0{,}059}{z} \cdot \lg\frac{[\text{Ox}]}{[\text{Red}]}$$

**Für Metall-Elektroden (M^n+/M):**

$$E = E° + \frac{0{,}059}{z} \cdot \lg[\text{M}^{n+}]$$

(Metall als Feststoff: Aktivität = 1)

***

## Elektrolyse (Faraday)

$$n = \frac{I \cdot t}{z \cdot F}$$

| Symbol | Bedeutung           | Einheit |
| ------ | ------------------- | ------- |
| n      | Stoffmenge          | mol     |
| I      | Stromstärke         | A       |
| t      | Zeit                | s       |
| z      | Elektronenzahl      | -       |
| F      | 96.485              | C/mol   |

**Masse berechnen:** $m = n \cdot M$

***

## Musterbeispiel: Elektrolyse

**Aufgabe:** 2 A fließen 30 min durch CuSO₄-Lösung. Wie viel Cu wird abgeschieden?

**Lösung:**

1. **Zeit:** t = 30 × 60 = 1800 s

2. **Ladung:** Q = I × t = 2 × 1800 = 3600 C

3. **Stoffmenge:** (z = 2 für Cu²⁺)
   $n = \frac{3600}{2 \times 96485} = 0{,}0187$ mol

4. **Masse:**
   $m = 0{,}0187 \times 63{,}5 = 1{,}18$ g

***

## Gleichgewichtskonstante aus E°

$$\lg K = \frac{z \cdot E°}{0{,}059}$$

Im Gleichgewicht: E = 0, daher gilt:
$E° = \frac{0{,}059}{z} \cdot \lg K$

***

## Oxidationszahlen

**Regeln:**
1. Elemente: 0
2. H: meist +1 (außer Hydride: -1)
3. O: meist -2 (außer Peroxide: -1)
4. Summe = Ladung des Teilchens

***

## Häufige Fehler

❌ Anode/Kathode verwechselt

❌ Vorzeichen bei E° vergessen

❌ z falsch bestimmt

❌ Zeit nicht in Sekunden umgerechnet

***

## Tipps

💡 Kathode = Reduktion (beide haben "K")

💡 Anode = niedrigeres E° = wird oxidiert

💡 E° > 0 → Reaktion läuft spontan ab

💡 Bei Elektrolyse: Zeit in Sekunden!

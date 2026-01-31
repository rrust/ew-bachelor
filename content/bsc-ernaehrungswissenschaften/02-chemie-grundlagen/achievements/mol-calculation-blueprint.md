---
type: 'achievement'
achievementType: 'blueprint'
id: 'mol-calculation-blueprint'
title: 'Mol-Berechnungen Blueprint'
description: 'Systematischer Lösungsweg für Berechnungen mit Stoffmengen'
icon: 'beaker'
contentType: 'markdown'
unlockCondition:
  type: 'first-exercise-solved'
  exerciseType: 'mol-calculation'
  moduleId: '02-chemie-grundlagen'
defaultDuration: 30
extensionDuration: 14
warningThreshold: 7
---

# Mol-Berechnungen – Blueprint

Du hast deine erste Mol-Übung gelöst! Hier ist dein Lösungsweg-Template.

***

## Die drei Grundformeln

| Berechnung       | Formel                  | Umgestellt nach                                     |
| ---------------- | ----------------------- | --------------------------------------------------- |
| **Stoffmenge**   | $n = \frac{m}{M}$       | $m = n \cdot M$ oder $M = \frac{m}{n}$              |
| **Teilchenzahl** | $N = n \cdot N_A$       | $n = \frac{N}{N_A}$                                 |
| **Molare Masse** | $M = \sum A_r$ (g/mol)  | Summe der Atommassen                                |

**Avogadro-Konstante:** $N_A = 6{,}022 \times 10^{23}$ mol⁻¹

***

## Allgemeiner Lösungsweg

### Schritt 1: Gegebene Werte identifizieren

- Masse m in Gramm?
- Stoffmenge n in Mol?
- Teilchenzahl N?
- Molare Masse M bekannt oder zu berechnen?

### Schritt 2: Molare Masse berechnen (falls nötig)

$$M = \sum (\text{Anzahl} \times A_r)$$

**Beispiel H₂O:**
$M = 2 \times 1{,}0 + 1 \times 16{,}0 = 18{,}0$ g/mol

### Schritt 3: Passende Formel wählen

| Gesucht | Gegeben     | Formel                |
| ------- | ----------- | --------------------- |
| n       | m, M        | $n = m/M$             |
| m       | n, M        | $m = n \cdot M$       |
| N       | n           | $N = n \cdot N_A$     |
| n       | N           | $n = N/N_A$           |

### Schritt 4: Einsetzen und berechnen

- Einheiten mitführen zur Kontrolle
- Ergebnis auf sinnvolle Stellen runden

***

## Musterbeispiel

**Aufgabe:** Wie viele Moleküle sind in 9 g Wasser enthalten?

**Lösung:**

1. **Gegeben:** m = 9 g, M(H₂O) = 18 g/mol
2. **Stoffmenge:** $n = \frac{9 \text{ g}}{18 \text{ g/mol}} = 0{,}5$ mol
3. **Teilchenzahl:** $N = 0{,}5 \text{ mol} \times 6{,}022 \times 10^{23} \text{ mol}^{-1}$
4. **Ergebnis:** $N = 3{,}011 \times 10^{23}$ Moleküle

***

## Häufige Fehler

❌ Subscripts bei molarer Masse vergessen (H₂O hat 2 H!)

❌ Einheiten nicht konsistent (g vs. kg)

❌ Avogadro-Konstante falsch eingegeben

❌ Bei Ionen die Anzahl pro Formeleinheit vergessen

***

## Tipps

💡 Immer zuerst die molare Masse berechnen/nachschlagen

💡 Einheiten mitführen – sie müssen sich richtig kürzen

💡 Plausibilitätscheck: Ist das Ergebnis realistisch?

💡 Bei Salzen: Anzahl der Ionen pro Formeleinheit beachten (z.B. CaCl₂ → 3 Ionen)

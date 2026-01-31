---
type: 'achievement'
achievementType: 'blueprint'
id: 'acid-base-calculation-blueprint'
title: 'Säure-Base Blueprint'
description: 'Systematischer Lösungsweg für pH-Wert und Puffer-Berechnungen'
icon: 'beaker'
contentType: 'markdown'
unlockCondition:
  type: 'first-exercise-solved'
  exerciseType: 'acid-base-calculation'
  moduleId: '02-chemie-grundlagen'
defaultDuration: 30
extensionDuration: 14
warningThreshold: 7
---

# Säure-Base-Berechnungen – Blueprint

Du hast deine erste Säure-Base-Übung gelöst!

***

## Grundgleichungen

| Berechnung         | Formel                                      |
| ------------------ | ------------------------------------------- |
| pH-Definition      | $\text{pH} = -\lg[\text{H}^+]$              |
| pOH-Definition     | $\text{pOH} = -\lg[\text{OH}^-]$            |
| Wassergleichgewicht | $\text{pH} + \text{pOH} = 14$ (bei 25°C)   |
| Säurekonstante     | $K_s = \frac{[\text{H}^+][\text{A}^-]}{[\text{HA}]}$ |

***

## pH-Wert-Berechnungen

### Starke Säure (vollständige Dissoziation)

$$\text{pH} = -\lg(c_0)$$

**Beispiel:** 0,01 M HCl → pH = -lg(0,01) = 2

### Starke Base

$$\text{pOH} = -\lg(c_0), \quad \text{pH} = 14 - \text{pOH}$$

### Schwache Säure (Näherung)

$$\text{pH} = \frac{1}{2}(\text{p}K_s - \lg c_0)$$

**Gültig wenn:** $[\text{H}^+] << c_0$

***

## Henderson-Hasselbalch

Für Pufferlösungen:

$$\text{pH} = \text{p}K_s + \lg\frac{[\text{A}^-]}{[\text{HA}]}$$

**Merke:**
- [A⁻]/[HA] = 1 → pH = pKs
- [A⁻]/[HA] = 10 → pH = pKs + 1
- [A⁻]/[HA] = 0,1 → pH = pKs - 1

***

## Musterbeispiel: Puffer

**Aufgabe:** Acetatpuffer mit 0,2 M Essigsäure und 0,3 M Natriumacetat. pKs = 4,76

**Lösung:**

1. **Identifizieren:**
   - HA = CH₃COOH (Säure)
   - A⁻ = CH₃COO⁻ (konjugierte Base)

2. **Verhältnis:**
   $\frac{[\text{A}^-]}{[\text{HA}]} = \frac{0{,}3}{0{,}2} = 1{,}5$

3. **Henderson-Hasselbalch:**
   $\text{pH} = 4{,}76 + \lg(1{,}5) = 4{,}76 + 0{,}18 = 4{,}94$

***

## Puffer-Herstellung

Gegeben: Ziel-pH, Gesamt-c, pKs

1. Verhältnis berechnen:
   $\frac{[\text{A}^-]}{[\text{HA}]} = 10^{(\text{pH} - \text{p}K_s)}$

2. Mit c(gesamt) = [HA] + [A⁻] kombinieren

3. Einzelkonzentrationen lösen

***

## Pufferkapazität

Bei Säurezugabe: A⁻ + H⁺ → HA

1. Stoffmengen berechnen
2. A⁻ nimmt ab, HA nimmt zu
3. Neues Verhältnis in HH einsetzen

***

## Titration

| Punkt                | Charakteristik                        |
| -------------------- | ------------------------------------- |
| Anfang               | Nur HA → pH aus schwacher Säure       |
| Halbäquivalenzpunkt  | [HA] = [A⁻] → **pH = pKs**            |
| Äquivalenzpunkt      | Nur A⁻ → Base-Hydrolyse, pH > 7       |
| Nach ÄP              | Überschuss-OH⁻ bestimmt pH            |

***

## Häufige Fehler

❌ Starke und schwache Säuren verwechselt

❌ Bei schwachen Säuren die Näherungsformel falsch angewendet

❌ Henderson-Hasselbalch für starke Säuren verwendet

❌ Bei Puffer: Stoffmengen statt Konzentrationen verwendet (geht auch, aber aufpassen bei Volumenänderung)

***

## Tipps

💡 Starke Säure: pH = -lg(c) direkt

💡 Schwache Säure: Näherung pH = ½(pKs - lg c)

💡 Puffer: Henderson-Hasselbalch

💡 Am Halbäquivalenzpunkt: pH = pKs (wichtig für Titration!)

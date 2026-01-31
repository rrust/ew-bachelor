---
type: 'achievement'
achievementType: 'blueprint'
id: 'colligative-calculation-blueprint'
title: 'Kolligative Eigenschaften Blueprint'
description: 'Systematischer Lösungsweg für Berechnungen kolligativer Eigenschaften'
icon: 'beaker'
contentType: 'markdown'
unlockCondition:
  type: 'first-exercise-solved'
  exerciseType: 'colligative-calculation'
  moduleId: '02-chemie-grundlagen'
defaultDuration: 30
extensionDuration: 14
warningThreshold: 7
---

# Kolligative Eigenschaften – Blueprint

Du hast deine erste Übung zu kolligativen Eigenschaften gelöst!

***

## Die vier kolligativen Eigenschaften

| Eigenschaft               | Formel                              |
| ------------------------- | ----------------------------------- |
| Dampfdruckerniedrigung    | $\Delta p = x_{\text{Stoff}} \cdot p°$ (Raoult) |
| Siedepunktserhöhung       | $\Delta T_{eb} = K_{eb} \cdot m$    |
| Gefrierpunktserniedrigung | $\Delta T_f = K_f \cdot m$          |
| Osmotischer Druck         | $\pi = c \cdot R \cdot T$           |

**Wichtig:** Kolligativ = hängt nur von der **Teilchenzahl** ab, nicht von der Art!

***

## Konstanten für Wasser

| Konstante | Wert                  |
| --------- | --------------------- |
| $K_{eb}$  | 0,512 K·kg/mol        |
| $K_f$     | 1,86 K·kg/mol         |
| $R$       | 8,314 J/(mol·K)       |

***

## Van't-Hoff-Faktor i

Für Elektrolyte: **Teilchenzahl erhöht sich durch Dissoziation!**

$$\Delta T = i \cdot K \cdot m$$

| Stoff     | Dissoziation                | i (ideal) |
| --------- | --------------------------- | --------- |
| Glucose   | keine                       | 1         |
| NaCl      | Na⁺ + Cl⁻                   | 2         |
| CaCl₂     | Ca²⁺ + 2 Cl⁻                | 3         |
| Al₂(SO₄)₃ | 2 Al³⁺ + 3 SO₄²⁻            | 5         |

***

## Allgemeiner Lösungsweg

### Schritt 1: Molalität berechnen

$$m = \frac{n_{\text{Stoff}}}{m_{\text{Lösungsmittel (kg)}}}$$

### Schritt 2: Van't-Hoff-Faktor bestimmen

- Nicht-Elektrolyt: i = 1
- Elektrolyt: i = Anzahl der Ionen

### Schritt 3: Formel anwenden

$$\Delta T = i \cdot K \cdot m$$

***

## Musterbeispiel

**Aufgabe:** 18,0 g Glucose (M = 180 g/mol) in 500 g Wasser. Berechne ΔTf.

**Lösung:**

1. **Stoffmenge:** $n = \frac{18{,}0}{180} = 0{,}1$ mol

2. **Molalität:** $m = \frac{0{,}1 \text{ mol}}{0{,}5 \text{ kg}} = 0{,}2$ mol/kg

3. **Van't-Hoff-Faktor:** i = 1 (Glucose ist Nicht-Elektrolyt)

4. **Gefrierpunktserniedrigung:**
   $\Delta T_f = 1 \times 1{,}86 \times 0{,}2 = 0{,}372$ K

5. **Neuer Gefrierpunkt:** 0°C - 0,37°C = **-0,37°C**

***

## Osmotischer Druck

$$\pi = i \cdot c \cdot R \cdot T$$

**Einheiten beachten:**
- c in mol/L
- R = 8,314 J/(mol·K)
- T in Kelvin
- π in Pa (oder kPa, bar)

**Umrechnung:** 1 bar ≈ 100 kPa

***

## Molare Masse bestimmen

Aus ΔTf kann man M berechnen:

$$M = \frac{K_f \cdot m_{\text{Stoff}}}{\Delta T_f \cdot m_{\text{Lösungsmittel}}}$$

***

## Häufige Fehler

❌ Molalität (mol/kg) mit Molarität (mol/L) verwechselt

❌ Van't-Hoff-Faktor vergessen

❌ Masse des Lösungsmittels statt der Lösung verwendet

❌ Temperatur nicht in Kelvin (bei π)

***

## Tipps

💡 Molalität verwendet kg Lösungsmittel, nicht Lösung!

💡 Bei Elektrolyten: i = Anzahl aller Ionen

💡 Kolligativ heißt: Nur Teilchenzahl zählt

💡 Für Umkehrosmose: Druck muss > π sein

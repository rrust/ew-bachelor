---
type: 'achievement'
achievementType: 'blueprint'
id: 'concentration-calculation-blueprint'
title: 'Konzentrationen Blueprint'
description: 'Systematischer Lösungsweg für Konzentrationsberechnungen'
icon: 'beaker'
contentType: 'markdown'
unlockCondition:
  type: 'first-exercise-solved'
  exerciseType: 'concentration-calculation'
  moduleId: '02-chemie-grundlagen'
defaultDuration: 30
extensionDuration: 14
warningThreshold: 7
---

# Konzentrationen – Blueprint

Du hast deine erste Konzentrations-Übung gelöst! Hier ist dein Lösungsweg-Template.

***

## Konzentrationsmaße

| Maß           | Formel                                   | Einheit       |
| ------------- | ---------------------------------------- | ------------- |
| Molarität     | $c = \frac{n}{V}$                        | mol/L (M)     |
| Molalität     | $m = \frac{n}{m_{\text{Lösungsmittel}}}$ | mol/kg        |
| Massenanteil  | $w = \frac{m_{\text{Stoff}}}{m_{\text{Lösung}}}$ | (oder %)      |
| Stoffmengenbruch | $x = \frac{n_A}{\sum n}$             | dimensionslos |

***

## Allgemeiner Lösungsweg

### Schritt 1: Gegebene Werte identifizieren

- Masse oder Stoffmenge des gelösten Stoffes?
- Volumen der Lösung oder Masse des Lösungsmittels?
- Dichte gegeben?

### Schritt 2: Stoffmenge berechnen (falls nötig)

$$n = \frac{m}{M}$$

### Schritt 3: Passende Formel wählen

| Gesucht     | Formel                    |
| ----------- | ------------------------- |
| Molarität c | $c = n/V$                 |
| Masse m     | $m = c \cdot V \cdot M$   |
| Volumen V   | $V = n/c$                 |

### Schritt 4: Einheiten beachten

- V in **Litern** für Molarität
- m in **kg** für Molalität

***

## Verdünnungsformel

$$c_1 \cdot V_1 = c_2 \cdot V_2$$

**Anwendung:** Wie viel mL einer Stammlösung brauche ich?

$$V_1 = \frac{c_2 \cdot V_2}{c_1}$$

***

## Musterbeispiel

**Aufgabe:** 200 mL einer 0,5 M NaCl-Lösung werden mit 300 mL einer 0,2 M NaCl-Lösung gemischt. Berechne die Konzentration der Mischung.

**Lösung:**

1. **Stoffmenge Lösung 1:**
   $n_1 = c_1 \cdot V_1 = 0{,}5 \cdot 0{,}2 = 0{,}1$ mol

2. **Stoffmenge Lösung 2:**
   $n_2 = c_2 \cdot V_2 = 0{,}2 \cdot 0{,}3 = 0{,}06$ mol

3. **Gesamtstoffmenge:**
   $n_{\text{ges}} = 0{,}1 + 0{,}06 = 0{,}16$ mol

4. **Gesamtvolumen:**
   $V_{\text{ges}} = 0{,}2 + 0{,}3 = 0{,}5$ L

5. **Mischungskonzentration:**
   $c = \frac{0{,}16}{0{,}5} = 0{,}32$ M

***

## Ionenkonzentrationen

Bei Elektrolyten die Dissoziation beachten!

**Beispiel CaCl₂:**
$\text{CaCl}_2 \rightarrow \text{Ca}^{2+} + 2\text{Cl}^-$

- $c(\text{Ca}^{2+}) = c(\text{CaCl}_2)$
- $c(\text{Cl}^-) = 2 \cdot c(\text{CaCl}_2)$

***

## Häufige Fehler

❌ Volumen in mL statt L verwendet

❌ Bei Mischungen: Volumina nicht addiert

❌ Bei Elektrolyten: Dissoziation vergessen

❌ Massenanteil mit Molarität verwechselt

***

## Tipps

💡 Einheiten immer umrechnen (mL → L, g → kg)

💡 Bei Verdünnung: Stoffmenge bleibt konstant!

💡 Bei Elektrolyten: Stöchiometrie der Dissoziation beachten

💡 Bei Hydratformen: 1 mol Hydrat = 1 mol Salz

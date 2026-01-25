---
type: 'learning-content'
sourceRefs:
  - sourceId: 'vorlesung-k18'
  - sourceId: 'kotz-k18'
---

# Pufferkapazität und Berechnungen

## Die 2-Schritt-Methode

Wenn eine starke Säure oder Base zu einem Puffer gegeben wird, erfolgt die Berechnung des neuen pH-Werts in zwei Schritten:

### Schritt 1: Stöchiometrie (vollständige Reaktion)

Die starke Säure oder Base reagiert **vollständig** mit dem entsprechenden Pufferpartner.

| Zugabe            | Reaktion                 |
| ----------------- | ------------------------ |
| Starke Säure (H⁺) | H⁺ + Base → Säure        |
| Starke Base (OH⁻) | OH⁻ + Säure → Base + H₂O |

### Schritt 2: Gleichgewicht (Henderson-Hasselbalch)

Mit den **neuen Stoffmengen** berechnen wir den pH-Wert:

$$\text{pH} = \text{p}K_s + \log\left(\frac{n(\text{Base})}{n(\text{Säure})}\right)$$

> **Wichtig:** Da das Volumen bei Säure und Base gleich ist, kürzt es sich im Bruch. Wir können direkt mit Stoffmengen (mol) rechnen!

## Beispielrechnung

**Gegeben:** 1,0 L Puffer mit 0,100 mol NH₃ und 0,200 mol NH₄⁺ (pKs = 9,26)

**Zugabe:** 0,020 mol NaOH (fest)

### Schritt 1: Stöchiometrie

NaOH reagiert mit der Säure-Komponente (NH₄⁺):

$$\text{NH}_4^+ + \text{OH}^- \rightarrow \text{NH}_3 + \text{H}_2\text{O}$$

| Substanz | Vorher (mol) | Änderung | Nachher (mol) |
| -------- | ------------ | -------- | ------------- |
| NH₄⁺     | 0,200        | −0,020   | **0,180**     |
| NH₃      | 0,100        | +0,020   | **0,120**     |
| OH⁻      | 0,020        | −0,020   | 0             |

### Schritt 2: Henderson-Hasselbalch

$$\text{pH} = 9{,}26 + \log\left(\frac{0{,}120}{0{,}180}\right) = 9{,}26 + (-0{,}18) = 9{,}08$$

Die pH-Änderung beträgt nur Δ = +0,13, obwohl eine starke Base zugegeben wurde!

## Pufferwirkung: Wasser vs. Puffer

Bei Zugabe von 1 mL 1,0 M HCl:

| Medium              | pH vorher | pH nachher | Änderung |
| ------------------- | --------- | ---------- | -------- |
| 1,0 L reines Wasser | 7,00      | 3,00       | −4,00    |
| 1,0 L Acetat-Puffer | 4,68      | 4,67       | −0,01    |

## Pufferkapazität

Die **Pufferkapazität** beschreibt, wie viel Säure oder Base ein Puffer neutralisieren kann, bevor der pH-Wert stark abweicht.

### Einflussfaktoren

1. **Gesamtkonzentration:** Je höher die Konzentrationen von Säure und Base, desto größer die Kapazität
2. **Verhältnis Base/Säure:** Die Kapazität ist am höchsten, wenn das Verhältnis nahe 1:1 liegt (pH ≈ pKs)

### Faustregel

Ein Puffer funktioniert effektiv im Bereich:

$$\text{p}K_s - 1 < \text{pH} < \text{p}K_s + 1$$

## Verdünnung eines Puffers

**Wichtige Erkenntnis:** Das Verdünnen eines Puffers ändert den pH-Wert **nicht**!

Grund: In der Henderson-Hasselbalch-Gleichung steht das Verhältnis der Konzentrationen. Beim Verdünnen werden beide Konzentrationen um denselben Faktor reduziert – das Verhältnis bleibt gleich.

> **Aber:** Die Pufferkapazität sinkt durch Verdünnung, da weniger Säure und Base zur Verfügung stehen.

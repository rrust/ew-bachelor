---
type: 'achievement'
id: 'saeuren-basen-gleichgewicht-cheatsheet'
title: 'Puffer & Titration Cheat-Sheet'
description: 'Kompakte Übersicht zu Pufferlösungen, Henderson-Hasselbalch und Titrationen'
icon: 'beaker'
contentType: 'markdown'
unlockCondition:
  type: 'lecture-quiz-gold'
  lectureId: '18-saeuren-basen-gleichgewicht'
  moduleId: '02-chemie-grundlagen'
defaultDuration: 30
extensionDuration: 14
warningThreshold: 7
---

# Puffer & Titration: Cheat-Sheet

Herzlichen Glückwunsch! Du hast das Quiz mit Gold-Status bestanden.

***

## Common Ion Effect

Zugabe eines **gemeinsamen Ions** verschiebt das Gleichgewicht (Le Chatelier):

| Ausgangslösung | Zugabe von | Gleichgewicht |
| -------------- | ---------- | ------------- |
| NH₃ in Wasser  | NH₄Cl      | ← nach links  |
| CH₃COOH        | CH₃COONa   | ← nach links  |

**Effekt:** Geringerer Dissoziationsgrad, pH-Wert ändert sich!

***

## Puffer-Zusammensetzung

| Puffer          | Schwache Säure | Konjugierte Base |
| --------------- | -------------- | ---------------- |
| Acetat-Puffer   | CH₃COOH        | CH₃COO⁻          |
| Phosphat-Puffer | H₂PO₄⁻         | HPO₄²⁻           |
| Ammonium-Puffer | NH₄⁺           | NH₃              |
| Carbonat-Puffer | H₂CO₃/CO₂      | HCO₃⁻            |

***

## Henderson-Hasselbalch-Gleichung

$$\text{pH} = \text{p}K_s + \log\left(\frac{[\text{Base}]}{[\text{Säure}]}\right)$$

**Wichtige Sonderfälle:**

| Verhältnis Base/Säure | pH-Wert      |
| --------------------- | ------------ |
| 1:1                   | pH = pKs     |
| 10:1                  | pH = pKs + 1 |
| 1:10                  | pH = pKs − 1 |

***

## 2-Schritt-Methode (Pufferberechnung)

**Schritt 1:** Stöchiometrie (vollständige Reaktion)

| Zugabe | Reaktion                 |
| ------ | ------------------------ |
| H⁺     | H⁺ + Base → Säure        |
| OH⁻    | OH⁻ + Säure → Base + H₂O |

**Schritt 2:** Henderson-Hasselbalch mit neuen Stoffmengen

***

## Pufferkapazität

Optimaler Bereich: **pKs ± 1**

| Faktor           | Wirkung                                |
| ---------------- | -------------------------------------- |
| Höhere Konz.     | → Größere Kapazität                    |
| Verhältnis ≈ 1:1 | → Maximale Pufferwirkung               |
| Verdünnung       | → pH bleibt gleich (Verhältnis const.) |

***

## Puffer-Design

1. Wähle Säure mit **pKs ≈ gewünschter pH**
2. Berechne Verhältnis: $\frac{[\text{Base}]}{[\text{Säure}]} = 10^{(\text{pH} - \text{p}K_s)}$

***

## Titrationskurven

| Titration             | pH am Start | pH am ÄP |
| --------------------- | ----------- | -------- |
| Stark + Stark         | ~1          | **7,00** |
| Schwach + Stark Base  | ~3          | **> 7**  |
| Schwach + Stark Säure | ~11         | **< 7**  |

***

## Halbäquivalenzpunkt

Bei 50% Neutralisation: **pH = pKs**

→ Einfachste Methode zur pKs-Bestimmung!

***

## Äquivalenzpunkt berechnen

**Schwache Säure + starke Base:**

1. $K_b = K_w / K_s$
2. $[\text{OH}^-] = \sqrt{K_b \cdot c_{\text{Salz}}}$
3. pOH → pH = 14 − pOH

**Merke:** Produkt ist konjugierte Base → hydrolysiert basisch!

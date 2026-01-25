---
type: 'achievement'
id: 'loesungen-cheatsheet'
title: 'Lösungen Cheat-Sheet'
description: 'Kompakte Übersicht zu Lösungseigenschaften und kolligativen Effekten'
icon: 'beaker'
contentType: 'markdown'
unlockCondition:
  type: 'lecture-quiz-gold'
  lectureId: '13-loesungen'
  moduleId: '02-chemie-grundlagen'
defaultDuration: 30
extensionDuration: 14
warningThreshold: 7
---

# Lösungen – Cheat-Sheet

Herzlichen Glückwunsch! Du hast das Quiz mit Gold-Status bestanden.

***

## Sättigungszustände

| Zustand     | Definition                                   |
| ----------- | -------------------------------------------- |
| Ungesättigt | Weniger gelöst als maximal möglich           |
| Gesättigt   | Maximum erreicht, dynamisches Gleichgewicht  |
| Übersättigt | Mehr gelöst als stabil möglich, **instabil** |

**Merke:** "Like dissolves like" – Polar löst polar, unpolar löst unpolar.

***

## Lösungsenthalpie

$$\Delta H_{\text{Lösung}} = \Delta H_{\text{Gitter}} + \Delta H_{\text{Hydratation}}$$

| Schritt       | Vorzeichen | Beschreibung                 |
| ------------- | ---------- | ---------------------------- |
| Gitterenergie | + (endo)   | Energie zum Aufbrechen nötig |
| Hydratation   | − (exo)    | Wasser lagert sich an Ionen  |

- **Exotherm:** Lösung wird warm (Hydratation > Gitter)
- **Endotherm:** Lösung wird kalt (Gitter > Hydratation)

***

## Konzentrationseinheiten

| Einheit           | Formel                        | Temperaturabhängig? |
| ----------------- | ----------------------------- | ------------------- |
| Molarität (M)     | mol / L Lösung                | Ja                  |
| Molalität (m)     | mol / kg Lösungsmittel        | **Nein**            |
| Stoffmengenanteil | mol A / (mol A + mol B + ...) | Nein                |
| Massenanteil      | g Stoff / g Lösung × 100%     | Nein                |

***

## Henry-Gesetz (Gaslöslichkeit)

$$C_{\text{Gas}} = k_H \cdot P_{\text{Gas}}$$

- Löslichkeit proportional zum Partialdruck
- Druck sinkt → Gas entweicht (Sekt perlt!)
- Wichtig für Taucher: Dekompressionskrankheit

***

## Kolligative Eigenschaften

**Abhängig nur von der Teilchenzahl, nicht von der Art!**

| Eigenschaft               | Formel                                   |
| ------------------------- | ---------------------------------------- |
| Dampfdruckerniedrigung    | $\Delta P = X_B \cdot P^0$               |
| Siedepunktserhöhung       | $\Delta T_{SP} = K_{SP} \cdot m \cdot i$ |
| Gefrierpunktserniedrigung | $\Delta T_{GP} = K_{GP} \cdot m \cdot i$ |
| Osmotischer Druck         | $\Pi = c \cdot R \cdot T$                |

**Konstanten für Wasser:**
- $K_{GP} = 1.86$ °C/m
- $K_{SP} = 0.512$ °C/m

***

## Van't Hoff Faktor (i)

| Stoff   | Dissoziation | i (theoretisch) |
| ------- | ------------ | --------------- |
| Glucose | Keine        | 1               |
| NaCl    | Na⁺ + Cl⁻    | 2               |
| CaCl₂   | Ca²⁺ + 2Cl⁻  | 3               |
| MgSO₄   | Mg²⁺ + SO₄²⁻ | 2               |

**Reale Werte** oft kleiner wegen Ionenpaarbildung!

***

## Osmose

- Wasser wandert durch semipermeable Membran
- Von **niedrig** konzentriert → **hoch** konzentriert

| Umgebung     | Wirkung auf Zelle     |
| ------------ | --------------------- |
| Isotonisch   | Keine Änderung        |
| Hypotonisch  | Zelle schwillt/platzt |
| Hypertonisch | Zelle schrumpft       |

**Umkehrosmose:** Druck > Π → Wasser wird aus konzentrierter Lösung gepresst

---
type: 'achievement'
id: 'thermodynamik-cheatsheet'
title: 'Thermodynamik Cheat-Sheet'
description: 'Kompakte Übersicht zu Thermodynamik, Enthalpie und Kalorimetrie'
icon: 'beaker'
contentType: 'markdown'
unlockCondition:
  type: 'lecture-quiz-gold'
  lectureId: '05-thermodynamik-enthalpie-kalorimetrie'
  moduleId: '02-chemie-grundlagen'
defaultDuration: 30
extensionDuration: 14
warningThreshold: 7
---

# Thermodynamik Cheat-Sheet

## Energieformen

| Form                         | Definition                                         |
| ---------------------------- | -------------------------------------------------- |
| **Kinetische Energie (KE)**  | Bewegungsenergie: Translation, Rotation, Vibration |
| **Potentielle Energie (PE)** | Lageenergie, in Bindungen gespeichert              |
| **Innere Energie (U)**       | $U = PE + KE$ auf Teilchenebene                    |

## Exotherm vs. Endotherm

|                     | Exotherm                    | Endotherm                  |
| ------------------- | --------------------------- | -------------------------- |
| Energiefluss        | System → Umgebung           | Umgebung → System          |
| $\Delta H$          | < 0 (negativ)               | > 0 (positiv)              |
| Gefäß fühlt sich... | warm an                     | kalt an                    |
| Beispiele           | Verbrennung, Neutralisation | Verdampfung, Photosynthese |

## Wichtige Formeln

| Formel                                                                            | Anwendung                                |
| --------------------------------------------------------------------------------- | ---------------------------------------- |
| $q = m \cdot c \cdot \Delta T$                                                    | Temperaturänderung (ohne Phasenübergang) |
| $q = m \cdot L$                                                                   | Phasenübergang (bei konstanter T)        |
| $\Delta U = q + w$                                                                | Erster Hauptsatz                         |
| $\Delta H = q_p$                                                                  | Bei konstantem Druck                     |
| $\Delta_r H° = \Sigma \Delta_f H°(\text{Prod.}) - \Sigma \Delta_f H°(\text{Ed.})$ | Satz von Hess                            |

## Energieeinheiten

$$1 \text{ cal} = 4,184 \text{ J}$$
$$1 \text{ kcal} = 4,184 \text{ kJ}$$

## Wasser: Wichtige Konstanten

| Größe               | Wert          |
| ------------------- | ------------- |
| $c_{\text{Eis}}$    | 2,03 J/(g·K)  |
| $c_{\text{Wasser}}$ | 4,184 J/(g·K) |
| $c_{\text{Dampf}}$  | 1,99 J/(g·K)  |
| Schmelzwärme        | 333 J/g       |
| Verdampfungswärme   | 2260 J/g      |

## Vorzeichenkonventionen

| Größe      | + (positiv)      | - (negativ)       |
| ---------- | ---------------- | ----------------- |
| $q$        | Wärme INS System | Wärme AUS System  |
| $w$        | Arbeit AM System | Arbeit VOM System |
| $\Delta H$ | Endotherm        | Exotherm          |

## Bildungsenthalpie

> **Goldene Regel:** $\Delta_f H° = 0$ für alle Elemente im Standardzustand

**Standardbedingungen:** 1 atm, 25°C (298 K), 1 mol/L

## Brennwerte (physiologisch)

| Nährstoff     | kcal/g | kJ/g |
| ------------- | ------ | ---- |
| Kohlenhydrate | 4      | 17   |
| Proteine      | 4      | 17   |
| Fette         | 9      | 37   |
| Ethanol       | 7      | 29   |

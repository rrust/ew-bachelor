---
type: 'achievement'
id: 'elektronenstruktur-cheatsheet'
title: 'Elektronenstruktur Cheat-Sheet'
description: 'Kompakte Übersicht zu elektromagnetischer Strahlung, Quantenzahlen und Elektronenkonfiguration'
icon: 'beaker'
contentType: 'markdown'
unlockCondition:
  type: 'lecture-quiz-gold'
  lectureId: '06-elektronenstruktur-atome'
  moduleId: '02-chemie-grundlagen'
defaultDuration: 30
extensionDuration: 14
warningThreshold: 7
---

# ⚛️ Elektronenstruktur Cheat-Sheet

## Elektromagnetische Strahlung

### Grundformeln

| Formel                          | Bedeutung                                     |
| ------------------------------- | --------------------------------------------- |
| $c = \lambda \cdot \nu$         | Lichtgeschwindigkeit = Wellenlänge × Frequenz |
| $E = h \cdot \nu$               | Energie = Planck-Konstante × Frequenz         |
| $E = \frac{h \cdot c}{\lambda}$ | Energie aus Wellenlänge berechnen             |
| $\lambda = \frac{h}{m \cdot v}$ | de-Broglie-Wellenlänge                        |

### Wichtige Konstanten

| Konstante                | Wert               |
| ------------------------ | ------------------ |
| Lichtgeschwindigkeit $c$ | 3,00 × 10⁸ m/s     |
| Planck-Konstante $h$     | 6,626 × 10⁻³⁴ J·s  |
| Rydberg-Konstante $R_H$  | 2,18 × 10⁻¹⁸ J     |
| Avogadro-Konstante $N_A$ | 6,022 × 10²³ mol⁻¹ |

### EM-Spektrum (nach steigender Energie)

> Radio < Mikro < IR < **sichtbar** < UV < Röntgen < Gamma

**Sichtbares Licht:** 400 nm (violett) bis 700 nm (rot)

**Merksatz:** Kurze λ → hohe ν → hohe Energie

## Bohr-Modell

### Kernaussagen

1. Elektronen auf festen Energieniveaus (n = 1, 2, 3...)
2. Energie nur bei Sprüngen zwischen Niveaus
3. Emission: höher → niedriger (Licht wird abgegeben)
4. Absorption: niedriger → höher (Energie wird aufgenommen)

### Energieänderung

$$\Delta E = E_{end} - E_{init}$$

| $\Delta E$ | Vorgang    | Spektrum     |
| ---------- | ---------- | ------------ |
| negativ    | Emission   | Linie        |
| positiv    | Absorption | dunkle Linie |

## Quantenzahlen

| Symbol | Name              | Werte        | Bestimmt...                |
| ------ | ----------------- | ------------ | -------------------------- |
| $n$    | Hauptquantenzahl  | 1, 2, 3, ... | Schale, Energie, Größe     |
| $l$    | Nebenquantenzahl  | 0 bis (n-1)  | Form des Orbitals          |
| $m_l$  | Magnetquantenzahl | -l bis +l    | Orientierung im Raum       |
| $m_s$  | Spinquantenzahl   | +½ oder -½   | Spinrichtung des Elektrons |

### Unterschalen-Bezeichnungen

| l = 0 | l = 1 | l = 2 | l = 3 |
| ----- | ----- | ----- | ----- |
| s     | p     | d     | f     |

### Orbitale pro Unterschale

| Unterschale | Anzahl Orbitale | Max. Elektronen |
| ----------- | --------------- | --------------- |
| s           | 1               | 2               |
| p           | 3               | 6               |
| d           | 5               | 10              |
| f           | 7               | 14              |

## Orbitalformen

| Typ | Form                    | Anzahl |
| --- | ----------------------- | ------ |
| s   | Kugelförmig             | 1      |
| p   | Hantelförmig (px,py,pz) | 3      |
| d   | Kleeblattförmig         | 5      |
| f   | Komplex                 | 7      |

## Elektronenkonfiguration

### Die drei Regeln

| Regel             | Aussage                                        |
| ----------------- | ---------------------------------------------- |
| **Aufbauprinzip** | Niedrigste Energie zuerst füllen               |
| **Pauli-Prinzip** | Max. 2 e⁻ pro Orbital (entgegengesetzter Spin) |
| **Hund-Regel**    | Erst einfach besetzen (gleicher Spin)          |

### Auffüllreihenfolge

$$1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p → 5s → 4d → 5p...$$

> ⚠️ **Wichtig:** 4s wird VOR 3d gefüllt!

### Kurzschreibweise (Edelgaskern)

| Element | Z   | Langschreibweise             | Kurzschreibweise |
| ------- | --- | ---------------------------- | ---------------- |
| Na      | 11  | 1s² 2s² 2p⁶ 3s¹              | [Ne] 3s¹         |
| Fe      | 26  | 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶  | [Ar] 4s² 3d⁶     |
| Cu      | 29  | 1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹ 3d¹⁰ | [Ar] 4s¹ 3d¹⁰    |

### Bekannte Ausnahmen

| Element | Erwartet     | Tatsächlich   | Grund              |
| ------- | ------------ | ------------- | ------------------ |
| Cr      | [Ar] 4s² 3d⁴ | [Ar] 4s¹ 3d⁵  | Halbvolle d-Schale |
| Cu      | [Ar] 4s² 3d⁹ | [Ar] 4s¹ 3d¹⁰ | Volle d-Schale     |

## Ionenbildung bei Übergangsmetallen

> **Goldene Regel:** Beim Ionisieren werden zuerst die **s-Elektronen** der äußersten Schale entfernt!

| Spezies | Konfiguration |
| ------- | ------------- |
| Fe      | [Ar] 4s² 3d⁶  |
| Fe²⁺    | [Ar] 3d⁶      |
| Fe³⁺    | [Ar] 3d⁵      |

## Magnetismus

| Eigenschaft    | Ursache                 | Verhalten im Magnetfeld |
| -------------- | ----------------------- | ----------------------- |
| Paramagnetisch | Ungepaarte Elektronen   | Wird angezogen          |
| Diamagnetisch  | Alle Elektronen gepaart | Wird leicht abgestoßen  |

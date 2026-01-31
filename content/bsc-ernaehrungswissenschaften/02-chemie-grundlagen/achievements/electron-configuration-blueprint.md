---
type: 'achievement'
achievementType: 'blueprint'
id: 'electron-configuration-blueprint'
title: 'Elektronenkonfiguration Blueprint'
description: 'Systematischer Lösungsweg für das Aufstellen von Elektronenkonfigurationen'
icon: 'beaker'
contentType: 'markdown'
unlockCondition:
  type: 'first-exercise-solved'
  exerciseType: 'electron-configuration'
  moduleId: '02-chemie-grundlagen'
defaultDuration: 30
extensionDuration: 14
warningThreshold: 7
---

# Elektronenkonfiguration Blueprint

## Allgemeiner Lösungsweg

### Schritt 1: Elektronenzahl bestimmen

- **Neutrale Atome:** Elektronenzahl = Ordnungszahl (Z)
- **Kationen:** Elektronen = Z - Ladung
- **Anionen:** Elektronen = Z + Ladung

**Beispiele:**
- Fe (Z=26): 26 Elektronen
- Fe²⁺: 26 - 2 = 24 Elektronen
- Cl⁻ (Z=17): 17 + 1 = 18 Elektronen

### Schritt 2: Aufbauprinzip anwenden

Orbitale werden nach **steigender Energie** besetzt:

$$1s < 2s < 2p < 3s < 3p < 4s < 3d < 4p < 5s < 4d < ...$$

**Merkregel (Diagonalregel):**

```text
1s
2s  2p
3s  3p  3d
4s  4p  4d  4f
5s  5p  5d  5f
↘ diagonal lesen!
```

### Schritt 3: Maximale Besetzung beachten

| Orbital | Max. Elektronen |
| ------- | --------------- |
| s       | 2               |
| p       | 6               |
| d       | 10              |
| f       | 14              |

### Schritt 4: Hund'sche Regel beachten

Bei **entarteten Orbitalen** (gleiche Energie):
- Erst alle einfach besetzen (Spin ↑)
- Dann doppelt besetzen (↑↓)

**Beispiel: Stickstoff (7 e⁻)**

```text
2p: ↑  ↑  ↑   (nicht: ↑↓ ↑  _)
```

### Schritt 5: Kurzschreibweise mit Edelgaskern

- Edelgaskern in eckigen Klammern
- Nur Valenzelektronen ausschreiben

**Beispiel: Eisen**
- Vollständig: 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶
- Mit Edelgaskern: [Ar] 4s² 3d⁶

***

## Musterbeispiel: Kupfer (Cu, Z=29)

### Schritt 1: 29 Elektronen

### Schritt 2: Aufbauprinzip

```text
1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁹
```

**Aber Achtung:** Cu ist eine Ausnahme!

### Schritt 3: Ausnahmeregel prüfen

**Halbvolle und volle d-Orbitale sind besonders stabil!**

→ Ein Elektron "wandert" von 4s nach 3d

### Tatsächliche Konfiguration

$$\text{Cu: [Ar]} \, 4s^1 \, 3d^{10}$$

Nicht: [Ar] 4s² 3d⁹

***

## Wichtige Ausnahmen

### Chrom und Kupfer

| Element   | Erwartet     | Tatsächlich   | Grund        |
| --------- | ------------ | ------------- | ------------ |
| Cr (Z=24) | [Ar] 4s² 3d⁴ | [Ar] 4s¹ 3d⁵  | Halbvolles d |
| Cu (Z=29) | [Ar] 4s² 3d⁹ | [Ar] 4s¹ 3d¹⁰ | Volles d     |

### Ionen der Übergangsmetalle

**Bei Ionisierung:** Erst 4s-Elektronen entfernen, dann 3d!

- Fe: [Ar] 4s² 3d⁶
- Fe²⁺: [Ar] 3d⁶ (nicht [Ar] 4s² 3d⁴!)
- Fe³⁺: [Ar] 3d⁵

***

## Häufige Fehler

| Fehler                        | Richtig                    |
| ----------------------------- | -------------------------- |
| 3d vor 4s füllen              | 4s wird zuerst gefüllt     |
| 4s vor 3d entfernen bei Ionen | 4s wird zuerst entfernt!   |
| Cr/Cu Ausnahmen vergessen     | Halbvolle/volle d prüfen   |
| Hund'sche Regel ignorieren    | Erst einfach, dann doppelt |

## Schnellcheck: Valenzelektronen

| Gruppe          | Konfiguration | Valenzelektronen |
| --------------- | ------------- | ---------------- |
| 1 (Alkali)      | ns¹           | 1                |
| 2 (Erdalkali)   | ns²           | 2                |
| 13-18           | ns² np^x      | Gruppe - 10      |
| 3-12 (Übergang) | (n-1)d^x ns²  | variabel         |

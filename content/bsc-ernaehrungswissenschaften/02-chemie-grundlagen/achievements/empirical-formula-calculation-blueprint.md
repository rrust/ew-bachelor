---
type: 'achievement'
achievementType: 'blueprint'
id: 'empirical-formula-calculation-blueprint'
title: 'Empirische Formeln Blueprint'
description: 'Systematischer Lösungsweg für Verbrennungsanalysen und empirische Formeln'
icon: 'beaker'
contentType: 'markdown'
unlockCondition:
  type: 'first-exercise-solved'
  exerciseType: 'empirical-formula-calculation'
  moduleId: '02-chemie-grundlagen'
defaultDuration: 30
extensionDuration: 14
warningThreshold: 7
---

# Empirische Formeln Blueprint

## Allgemeiner Lösungsweg

### Schritt 1: Massen der Elemente bestimmen

**Bei Massenanteilen (%):**
- Annahme: 100 g Probe
- Massen = Prozentangaben

**Bei Verbrennungsanalyse:**

| Produkt | Enthält | Formel                              |
| ------- | ------- | ----------------------------------- |
| CO₂     | C       | m(C) = m(CO₂) × 12/44               |
| H₂O     | H       | m(H) = m(H₂O) × 2/18                |
| N₂      | N       | m(N) = m(N₂) × 28/28                |
| O       | (Rest)  | m(O) = m(Probe) - m(C) - m(H) - ... |

### Schritt 2: Stoffmengen berechnen

$$n = \frac{m}{M}$$

### Schritt 3: Durch kleinste Stoffmenge teilen

→ Ergibt das **molare Verhältnis**

### Schritt 4: Auf ganze Zahlen bringen

- Bei Dezimalzahlen nahe 0,5: × 2
- Bei 0,33 oder 0,67: × 3
- Bei 0,25 oder 0,75: × 4

### Schritt 5: Empirische Formel aufschreiben

Die Indices = gerundete Verhältniszahlen

***

## Musterbeispiel: Verbrennungsanalyse

**Aufgabe:** 2,50 g einer Verbindung (C, H, O) liefern bei Verbrennung:
- 3,67 g CO₂
- 1,50 g H₂O

Bestimme die empirische Formel.

### Schritt 1: Massen aus Produkten

**Kohlenstoff aus CO₂:**
$$m(\text{C}) = \frac{12}{44} \times 3{,}67\,\text{g} = 1{,}00\,\text{g}$$

**Wasserstoff aus H₂O:**
$$m(\text{H}) = \frac{2}{18} \times 1{,}50\,\text{g} = 0{,}167\,\text{g}$$

**Sauerstoff durch Differenz:**
$$m(\text{O}) = 2{,}50 - 1{,}00 - 0{,}167 = 1{,}33\,\text{g}$$

### Schritt 2: Stoffmengen

| Element | m (g) | M (g/mol) | n (mol) |
| ------- | ----- | --------- | ------- |
| C       | 1,00  | 12        | 0,0833  |
| H       | 0,167 | 1         | 0,167   |
| O       | 1,33  | 16        | 0,0833  |

### Schritt 3: Durch kleinste teilen

$$\text{C} : \text{H} : \text{O} = \frac{0{,}0833}{0{,}0833} : \frac{0{,}167}{0{,}0833} : \frac{0{,}0833}{0{,}0833}$$

$$= 1 : 2 : 1$$

### Schritt 4: Empirische Formel

$$\boxed{\text{CH}_2\text{O}}$$

***

## Von empirisch zu Molekülformel

Wenn die **Molmasse bekannt** ist:

1. Molmasse der empirischen Formel berechnen
2. Faktor = M(Molekül) / M(empirisch)
3. Indices multiplizieren

**Beispiel:** CH₂O (M = 30 g/mol), gemessene M = 180 g/mol

$$\text{Faktor} = \frac{180}{30} = 6$$

$$\text{Molekülformel: } \text{C}_6\text{H}_{12}\text{O}_6 \text{ (Glucose)}$$

***

## Häufige Fehler

| Fehler                              | Richtig                          |
| ----------------------------------- | -------------------------------- |
| O-Masse nicht berechnen             | O = Probe - C - H - N            |
| H × 1 statt H × 2 aus H₂O           | 1 mol H₂O enthält 2 mol H!       |
| Nicht auf ganze Zahlen runden       | ×2, ×3 oder ×4 versuchen         |
| Empirische = Molekülformel annehmen | Nur gleich, wenn Molmasse passt! |

## Schnellformeln

$$m(\text{C}) = m(\text{CO}_2) \times 0{,}273$$

$$m(\text{H}) = m(\text{H}_2\text{O}) \times 0{,}111$$

$$n = \frac{m}{M}$$

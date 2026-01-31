---
type: 'achievement'
achievementType: 'blueprint'
id: 'thermodynamics-calculation-blueprint'
title: 'Thermodynamik Blueprint'
description: 'Systematischer Lösungsweg für thermodynamische Berechnungen'
icon: 'beaker'
contentType: 'markdown'
unlockCondition:
  type: 'first-exercise-solved'
  exerciseType: 'thermodynamics-calculation'
  moduleId: '02-chemie-grundlagen'
defaultDuration: 30
extensionDuration: 14
warningThreshold: 7
---

# Thermodynamik – Blueprint

Du hast deine erste Thermodynamik-Übung gelöst! Hier ist dein Lösungsweg-Template.

***

## Grundgleichungen

| Größe            | Formel                                         | Einheit  |
| ---------------- | ---------------------------------------------- | -------- |
| Wärme            | $Q = m \cdot c \cdot \Delta T$                 | J oder kJ |
| Reaktionsenthalpie | $\Delta_r H° = \sum \Delta_f H°(\text{Prod.}) - \sum \Delta_f H°(\text{Ed.})$ | kJ/mol |
| Gibbs-Energie    | $\Delta G = \Delta H - T \cdot \Delta S$       | kJ/mol   |

***

## Vorzeichen-Konvention

| Vorzeichen | Bedeutung                          |
| ---------- | ---------------------------------- |
| ΔH < 0     | **Exotherm** (Wärme wird frei)     |
| ΔH > 0     | **Endotherm** (Wärme wird benötigt) |
| ΔG < 0     | **Spontan** (exergonisch)          |
| ΔG > 0     | **Nicht spontan** (endergonisch)   |

***

## Hess'scher Satz

Die Reaktionsenthalpie ist **unabhängig vom Reaktionsweg**.

**Anwendung:**
1. Zielreaktion aufschreiben
2. Gegebene Reaktionen so kombinieren, dass Zielreaktion entsteht
3. Enthalpien entsprechend addieren

**Regeln:**
- Reaktion umkehren → Vorzeichen von ΔH umkehren
- Reaktion mit Faktor multiplizieren → ΔH auch multiplizieren

***

## Musterbeispiel: Gibbs-Energie

**Aufgabe:** Berechne ΔG° bei 25°C für eine Reaktion mit ΔH° = -100 kJ/mol und ΔS° = -200 J/(mol·K)

**Lösung:**

1. **Temperatur:** T = 25 + 273 = 298 K

2. **Einheiten angleichen:** ΔS° = -0,2 kJ/(mol·K)

3. **Gibbs-Gleichung:**
   $\Delta G° = \Delta H° - T \cdot \Delta S°$
   $\Delta G° = -100 - 298 \times (-0{,}2)$
   $\Delta G° = -100 + 59{,}6 = -40{,}4$ kJ/mol

4. **Interpretation:** ΔG° < 0 → Reaktion ist spontan

***

## Gleichgewichtstemperatur

Wann wird ΔG = 0?

$$T = \frac{\Delta H°}{\Delta S°}$$

| ΔH | ΔS | Spontanität                    |
| -- | -- | ------------------------------ |
| −  | +  | Immer spontan                  |
| +  | −  | Nie spontan                    |
| −  | −  | Bei **niedrigen** T spontan    |
| +  | +  | Bei **hohen** T spontan        |

***

## Kalorimetrie

$$Q = C_{\text{Kalorimeter}} \cdot \Delta T$$

oder

$$Q = m \cdot c \cdot \Delta T$$

**Reaktionsenthalpie pro Mol:**
$$\Delta H = \frac{Q}{n}$$

(Vorzeichen beachten: exotherm → ΔH negativ)

***

## Häufige Fehler

❌ Einheiten nicht konsistent (J vs. kJ, K vs. °C)

❌ Vorzeichen bei Hess-Umkehrung vergessen

❌ ΔS in J, aber ΔH in kJ

❌ Temperatur nicht in Kelvin umgerechnet

***

## Tipps

💡 Immer Einheiten angleichen (kJ und kJ/(mol·K))

💡 Temperatur immer in Kelvin für Gibbs-Gleichung

💡 Bei Kalorimetrie: Vorzeichen richtig zuordnen

💡 Hess: Skizze der Reaktionswege hilft!

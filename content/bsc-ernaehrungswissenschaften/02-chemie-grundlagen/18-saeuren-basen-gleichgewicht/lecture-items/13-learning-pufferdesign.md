---
type: 'learning-content'
sourceRefs:
  - sourceId: 'vorlesung-k18'
  - sourceId: 'kotz-k18'
---

# Puffer-Design

Die Herstellung eines Puffers mit einem bestimmten pH-Wert erfordert eine systematische Vorgehensweise.

## Schritt 1: Wahl der Säure

Wähle eine schwache Säure, deren **pKs-Wert nahe am gewünschten pH** liegt.

### Beispiel

Gewünschter pH = 4,30

Verfügbare Säuren:

| Säure   | pKs  |
| ------- | ---- |
| HSO₄⁻   | 1,92 |
| CH₃COOH | 4,74 |
| HCN     | 9,40 |

**Beste Wahl:** Essigsäure (pKs = 4,74), da dieser Wert am nächsten bei 4,30 liegt.

## Schritt 2: Berechnung des Verhältnisses

Mit der Henderson-Hasselbalch-Gleichung berechnen wir das erforderliche Verhältnis:

$$4{,}30 = 4{,}74 + \log\left(\frac{[\text{Base}]}{[\text{Säure}]}\right)$$

$$-0{,}44 = \log\left(\frac{[\text{Base}]}{[\text{Säure}]}\right)$$

$$\frac{[\text{Base}]}{[\text{Säure}]} = 10^{-0{,}44} = 0{,}36$$

Für pH 4,30 benötigen wir also etwa **1 Teil Acetat zu 2,8 Teilen Essigsäure**.

## Optimaler Pufferbereich

Ein Puffer funktioniert am besten im Bereich:

$$\text{p}K_s \pm 1$$

Außerhalb dieses Bereichs wird das Verhältnis Base/Säure zu extrem (< 0,1 oder > 10), und die Pufferwirkung lässt stark nach.

## Praktische Tipps

1. **pKs-Wert beachten:** Wähle eine Säure mit pKs ≈ gewünschter pH
2. **Ausreichende Konzentration:** Höhere Konzentrationen = bessere Pufferkapazität
3. **Verhältnis 1:1 optimal:** Die beste Pufferwirkung liegt bei pH = pKs

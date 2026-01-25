---
type: 'learning-content'
sourceRefs:
  - sourceId: 'vorlesung-k16'
  - sourceId: 'kotz-k16'
---

# Die ICE-Tabelle

Die ICE-Methode ist ein systematischer Ansatz zur Berechnung von Gleichgewichtskonzentrationen.

## Was bedeutet ICE?

| Buchstabe | Bedeutung   | Erklärung                     |
| --------- | ----------- | ----------------------------- |
| **I**     | Initial     | Anfangskonzentrationen        |
| **C**     | Change      | Änderung während der Reaktion |
| **E**     | Equilibrium | Gleichgewichtskonzentrationen |

## Die Methode Schritt für Schritt

### Beispiel: H₂ + I₂ ⇌ 2HI mit Kc = 55,3

Start: je 1,00 M H₂ und I₂, kein HI

**Schritt 1: ICE-Tabelle aufstellen**

|       | [H₂]   | [I₂]   | [HI] |
| ----- | ------ | ------ | ---- |
| **I** | 1,00   | 1,00   | 0    |
| **C** | −x     | −x     | +2x  |
| **E** | 1,00−x | 1,00−x | 2x   |

**Schritt 2: In Kc einsetzen**

$$K_c = \frac{[\text{HI}]^2}{[\text{H}_2] \cdot [\text{I}_2]} = \frac{(2x)^2}{(1{,}00-x)(1{,}00-x)} = 55{,}3$$

**Schritt 3: Vereinfachen**

$$\frac{4x^2}{(1{,}00-x)^2} = 55{,}3$$

Da beide Seiten Quadrate sind, können wir die Wurzel ziehen:

$$\frac{2x}{1{,}00-x} = 7{,}44$$

**Schritt 4: Nach x auflösen**

$$2x = 7{,}44 \cdot (1{,}00-x)$$
$$2x = 7{,}44 - 7{,}44x$$
$$9{,}44x = 7{,}44$$
$$x = 0{,}79$$

**Schritt 5: Gleichgewichtskonzentrationen berechnen**

- [H₂] = [I₂] = 1,00 − 0,79 = **0,21 M**
- [HI] = 2 · 0,79 = **1,58 M**

## Wichtige Tipps

1. **Vorzeichen beachten:** Edukte nehmen ab (−), Produkte nehmen zu (+)
2. **Stöchiometrie beachten:** Die Änderungen müssen im richtigen Verhältnis stehen
3. **Negative Konzentrationen prüfen:** x darf nicht größer sein als die Anfangskonzentration!

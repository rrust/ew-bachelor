---
type: 'learning-content'
sourceRefs:
  - sourceId: 'vorlesung-k16'
  - sourceId: 'kotz-k16'
---

# Gasgleichgewichte: Kp vs. Kc

Bei Reaktionen mit Gasen kann man die Gleichgewichtskonstante entweder mit Konzentrationen (Kc) oder mit Partialdrücken (Kp) ausdrücken.

## Kp – Die Druckform

Für Gasreaktionen verwendet man oft Partialdrücke statt Konzentrationen:

$$K_p = \frac{(P_C)^c \cdot (P_D)^d}{(P_A)^a \cdot (P_B)^b}$$

P steht für den Partialdruck in atm oder bar.

## Der Zusammenhang zwischen Kp und Kc

$$K_p = K_c \cdot (RT)^{\Delta n}$$

| Symbol | Bedeutung                           |
| ------ | ----------------------------------- |
| R      | Gaskonstante = 0,0821 L·atm/(mol·K) |
| T      | Temperatur in Kelvin                |
| Δn     | Änderung der Molzahl an Gas         |

## Berechnung von Δn

$$\Delta n = (\text{Mol Gas Produkte}) - (\text{Mol Gas Edukte})$$

### Beispiele

| Reaktion          | Δn               |
| ----------------- | ---------------- |
| H₂ + I₂ ⇌ 2HI     | (2) − (1+1) = 0  |
| N₂ + 3H₂ ⇌ 2NH₃   | (2) − (1+3) = −2 |
| PCl₅ ⇌ PCl₃ + Cl₂ | (1+1) − (1) = +1 |

## Sonderfall: Δn = 0

Wenn die Anzahl der Gasmoleküle auf beiden Seiten gleich ist:

$$K_p = K_c \cdot (RT)^0 = K_c \cdot 1 = K_c$$

**Beispiel:** H₂ + I₂ ⇌ 2HI → Kp = Kc

## Praktische Berechnung

**Gegeben:** N₂ + 3H₂ ⇌ 2NH₃ bei 500 K, Kc = 6,0 × 10⁻²

**Gesucht:** Kp

$$\Delta n = 2 - (1+3) = -2$$
$$K_p = K_c \cdot (RT)^{\Delta n} = 6{,}0 \times 10^{-2} \cdot (0{,}0821 \cdot 500)^{-2}$$
$$K_p = 6{,}0 \times 10^{-2} \cdot (41{,}05)^{-2} = 6{,}0 \times 10^{-2} \cdot 5{,}9 \times 10^{-4}$$
$$K_p = 3{,}6 \times 10^{-5}$$

> **Merksatz:** Nur bei Gasreaktionen gibt es Kp. Δn bestimmt, ob Kp größer oder kleiner als Kc ist.

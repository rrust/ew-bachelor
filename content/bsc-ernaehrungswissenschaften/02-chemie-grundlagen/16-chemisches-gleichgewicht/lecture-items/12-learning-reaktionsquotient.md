---
type: 'learning-content'
sourceRefs:
  - sourceId: 'vorlesung-k16'
  - sourceId: 'kotz-k16'
---

# Der Reaktionsquotient Q

Der Reaktionsquotient Q beantwortet die Frage: **In welche Richtung wird die Reaktion laufen?**

## Definition

Q hat dieselbe Formel wie K, aber verwendet die **aktuellen** Konzentrationen zu einem beliebigen Zeitpunkt – nicht zwingend im Gleichgewicht.

Für $a\text{A} + b\text{B} \rightleftharpoons c\text{C} + d\text{D}$:

$$Q = \frac{[\text{C}]^c \cdot [\text{D}]^d}{[\text{A}]^a \cdot [\text{B}]^b}$$

## Q vs. K: Die Vorhersage

| Vergleich | Bedeutung         | Reaktionsrichtung               |
| --------- | ----------------- | ------------------------------- |
| $Q < K$   | Zu viele Edukte   | → nach rechts (Produkte bilden) |
| $Q > K$   | Zu viele Produkte | ← nach links (Edukte bilden)    |
| $Q = K$   | Gleichgewicht     | keine Nettoreaktion             |

## Beispiel: Butan-Isobutan-Isomerisierung

$$\text{Butan} \rightleftharpoons \text{Isobutan}$$

Gegeben: $K = 2{,}5$

Aktuelle Konzentrationen: [Isobutan] = 0,35 M, [Butan] = 0,15 M

$$Q = \frac{[\text{Isobutan}]}{[\text{Butan}]} = \frac{0{,}35}{0{,}15} = 2{,}33$$

Da $Q = 2{,}33 < K = 2{,}5$:
- Es gibt noch zu viel Butan (Edukt)
- Reaktion läuft nach **rechts**
- Es wird mehr Isobutan gebildet

## Visualisierung

<!-- SVG: Q vs K Reaktionsrichtung -->
<svg viewBox="0 0 360 100" style="max-width: 400px; width: 100%;" aria-label="Q kleiner K: Reaktion nach rechts, Q gleich K: Gleichgewicht, Q größer K: Reaktion nach links"><rect width="360" height="100" fill="#fafafa"/><text x="60" y="25" font-size="14" fill="#333" font-weight="bold" text-anchor="middle">Q &lt; K</text><text x="180" y="25" font-size="14" fill="#333" font-weight="bold" text-anchor="middle">Q = K</text><text x="300" y="25" font-size="14" fill="#333" font-weight="bold" text-anchor="middle">Q &gt; K</text><polygon points="30,50 90,50 90,45 100,55 90,65 90,60 30,60" fill="#2563eb"/><rect x="155" y="45" width="50" height="20" fill="#22c55e" rx="3"/><text x="180" y="59" font-size="10" fill="white" text-anchor="middle">GG</text><polygon points="330,50 270,50 270,45 260,55 270,65 270,60 330,60" fill="#dc2626"/><text x="60" y="85" font-size="11" fill="#2563eb" text-anchor="middle">→ rechts</text><text x="180" y="85" font-size="11" fill="#22c55e" text-anchor="middle">Gleichgewicht</text><text x="300" y="85" font-size="11" fill="#dc2626" text-anchor="middle">← links</text></svg>

> **Merksatz:** Das System strebt immer zu K. Ist Q kleiner, muss der Zähler (Produkte) wachsen. Ist Q größer, muss der Nenner (Edukte) wachsen.

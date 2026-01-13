---
type: 'learning-content'
topic: 'Wärmekapazität und spezifische Wärme'
sourceRefs:
  - sourceId: 'vorlesung-k5'
    pages: 'Kap 3.3'
---

# Energietransfer zwischen zwei Stoffen

Wenn zwei Stoffe mit unterschiedlicher Temperatur in Kontakt kommen, fließt Wärme vom wärmeren zum kälteren - bis zum thermischen Gleichgewicht.

## Das Prinzip der Energieerhaltung

Bei einem idealen (isolierten) System gilt:

$$\boxed{q_{\text{warm}} = -q_{\text{kalt}}}$$

Oder anders formuliert:
$$q_{\text{warm}} + q_{\text{kalt}} = 0$$

> **In Worten:** Die Energie, die der warme Stoff abgibt, nimmt der kalte Stoff auf. Nichts geht verloren!

## Typisches Beispiel: Heißes Metall in kaltem Wasser

Wenn wir ein heißes Metallstück in kaltes Wasser tauchen:

$$q_{\text{Metall}} = -q_{\text{Wasser}}$$

Eingesetzt mit der Grundformel:
$$m_{\text{M}} \cdot c_{\text{M}} \cdot \Delta T_{\text{M}} = -m_{\text{W}} \cdot c_{\text{W}} \cdot \Delta T_{\text{W}}$$

## Berechnung der Mischtemperatur

Wenn beide Stoffe schließlich die gleiche Endtemperatur $T_{\text{mix}}$ haben:

$$m_1 \cdot c_1 \cdot (T_{\text{mix}} - T_1) = -m_2 \cdot c_2 \cdot (T_{\text{mix}} - T_2)$$

Dies lässt sich nach $T_{\text{mix}}$ auflösen:

$$T_{\text{mix}} = \frac{m_1 \cdot c_1 \cdot T_1 + m_2 \cdot c_2 \cdot T_2}{m_1 \cdot c_1 + m_2 \cdot c_2}$$

## Praktische Anwendungen

Diese Berechnungen nutzt man für:
- Bestimmung unbekannter spezifischer Wärmekapazitäten
- Dimensionierung von Kühlsystemen
- Kalorimetrische Messungen

---
type: 'learning-content'
topic: 'Kalorimetrie (Experimentelle Messung)'
sourceRefs:
  - sourceId: 'vorlesung-k5'
    pages: 'Kap 7.2'
---

# Kalorimetrie-Berechnungen

Die Auswertung von Kalorimetrie-Experimenten folgt dem Prinzip der Energieerhaltung.

## Das Grundprinzip

Die gesamte bei der Reaktion freigesetzte Wärme ($q_{\text{Reaktion}}$) wird von zwei Komponenten aufgenommen:

$$\boxed{q_{\text{Gesamt}} = q_{\text{Wasser}} + q_{\text{Bombe}}}$$

## Die Teilberechnungen

### 1. Wärme des Wassers

$$q_{\text{Wasser}} = m_{\text{Wasser}} \cdot c_{\text{Wasser}} \cdot \Delta T$$

Mit $c_{\text{Wasser}} = 4,184 \frac{\text{J}}{\text{g} \cdot \text{K}}$

### 2. Wärme der Bomben-Apparatur

$$q_{\text{Bombe}} = C_{\text{Bombe}} \cdot \Delta T$$

Hier ist $C_{\text{Bombe}}$ die **Wärmekapazität des Geräts** (nicht die spezifische!), Einheit: J/K.

Diese Größe beinhaltet die Wärmeaufnahme von:
- Stahlbehälter
- Rührer
- Thermometer
- Weitere Metallteile

## Die Reaktionsenergie

Die Energie der Reaktion ist:

$$\Delta U = -q_{\text{Gesamt}}$$

Das negative Vorzeichen, weil die Reaktion exotherm ist (Energie wird abgegeben).

## Umrechnung auf molare Größen

Für die molare Verbrennungsenergie teilt man durch die Stoffmenge:

$$\Delta_c U_m = \frac{\Delta U}{n} = \frac{-q_{\text{Gesamt}}}{n}$$

wobei $n = \frac{m}{M}$ (Masse der Probe geteilt durch Molmasse).

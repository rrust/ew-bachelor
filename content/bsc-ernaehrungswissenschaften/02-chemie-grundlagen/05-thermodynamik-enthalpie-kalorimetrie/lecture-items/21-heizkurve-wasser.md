---
type: 'learning-content'
topic: 'Die Heizkurve von Wasser'
sourceRefs:
  - sourceId: 'vorlesung-k5'
    pages: '22-24'
---

## Berechnung über mehrere Stufen: Die Heizkurve

Wenn wir Eis zu Dampf umwandeln wollen, müssen wir mehrere Prozesse berücksichtigen – jeder mit seiner eigenen Formel.

### Beispielaufgabe

**Frage:** Wie viel Energie braucht man, um **500 g Eis bei 0 °C** in **Dampf bei 100 °C** umzuwandeln?

### Die drei Schritte

**Schritt 1: Eis schmelzen (bei 0 °C)**

Temperatur bleibt konstant! Wir nutzen die Schmelzwärme:
$$q_1 = m \cdot \Delta H_{\text{fus}} = 500 \text{ g} \times 333 \frac{J}{g} = 166.500 \text{ J}$$

**Schritt 2: Wasser erwärmen (0 °C → 100 °C)**

Jetzt nutzen wir $q = mc\Delta T$:
$$q_2 = 500 \text{ g} \times 4,184 \frac{J}{g \cdot K} \times 100 \text{ K} = 209.200 \text{ J}$$

**Schritt 3: Wasser verdampfen (bei 100 °C)**

Wieder konstante Temperatur! Verdampfungswärme:
$$q_3 = m \cdot \Delta H_{\text{vap}} = 500 \text{ g} \times 2260 \frac{J}{g} = 1.130.000 \text{ J}$$

### Gesamtenergie

$$q_{\text{ges}} = q_1 + q_2 + q_3 = 166.500 + 209.200 + 1.130.000 \text{ J}$$
$$\boxed{q_{\text{ges}} = 1.505.700 \text{ J} \approx 1.506 \text{ kJ}}$$

### Anteil am Gesamtprozess

| Schritt    | Energie (kJ) | Anteil  |
| ---------- | ------------ | ------- |
| Schmelzen  | 166,5        | 11%     |
| Erwärmen   | 209,2        | 14%     |
| Verdampfen | 1130         | **75%** |

> 💡 **Erkenntnis:** Das Verdampfen braucht mit Abstand am meisten Energie – etwa 3/4 der Gesamtenergie!

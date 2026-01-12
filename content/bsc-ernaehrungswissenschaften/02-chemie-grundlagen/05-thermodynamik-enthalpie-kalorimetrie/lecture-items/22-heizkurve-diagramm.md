---
type: 'mermaid-diagram'
topic: 'Phasenübergänge'
title: 'Heizkurve von Wasser'
---

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'fontSize': '14px'}}}%%
xychart-beta
    title "Heizkurve: Temperatur vs. zugeführte Energie"
    x-axis "Zugeführte Energie (kJ)" [0, 50, 100, 150, 200, 250, 300, 350]
    y-axis "Temperatur (°C)" -20 --> 120
    line [0, 0, 0, 0, 20, 60, 100, 100]
```

## Die fünf Phasen der Heizkurve

| Phase | Prozess           | Formel                              | Temperatur          |
| ----- | ----------------- | ----------------------------------- | ------------------- |
| **A** | Eis erwärmen      | $q = mc_{\text{Eis}}\Delta T$       | steigt              |
| **B** | Eis schmelzen     | $q = m \cdot \Delta H_{\text{fus}}$ | **konstant 0 °C**   |
| **C** | Wasser erwärmen   | $q = mc_{\text{Wasser}}\Delta T$    | steigt              |
| **D** | Wasser verdampfen | $q = m \cdot \Delta H_{\text{vap}}$ | **konstant 100 °C** |
| **E** | Dampf erwärmen    | $q = mc_{\text{Dampf}}\Delta T$     | steigt              |

## Wichtige Beobachtungen

1. **Plateaus** bei 0 °C und 100 °C: Hier findet Phasenumwandlung statt
2. **Steigung** der Kurve hängt von der spezifischen Wärmekapazität ab
3. Das **Verdampfungsplateau** ist am längsten (meiste Energie nötig)

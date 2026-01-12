---
type: 'mermaid-diagram'
topic: 'Phasenübergänge'
title: 'Heizkurve von Wasser'
---

```mermaid
flowchart LR
    subgraph A["Phase A"]
        A1["Eis erwärmen<br/>−20 → 0 °C"]
    end
    subgraph B["Phase B"]
        B1["Eis schmelzen<br/>0 °C (konstant)"]
    end
    subgraph C["Phase C"]
        C1["Wasser erwärmen<br/>0 → 100 °C"]
    end
    subgraph D["Phase D"]
        D1["Wasser verdampfen<br/>100 °C (konstant)"]
    end
    subgraph E["Phase E"]
        E1["Dampf erwärmen<br/>100 → 120 °C"]
    end
    
    A --> B --> C --> D --> E
    
    style A fill:#dbeafe
    style B fill:#bfdbfe
    style C fill:#93c5fd
    style D fill:#fef3c7
    style E fill:#fecaca
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

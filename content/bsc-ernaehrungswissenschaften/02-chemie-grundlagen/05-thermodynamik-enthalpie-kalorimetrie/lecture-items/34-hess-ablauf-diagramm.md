---
type: 'mermaid-diagram'
topic: 'Satz von Hess'
title: 'Wegunabhängigkeit der Enthalpie'
---

```mermaid
flowchart TD
    A["H₂(g) + ½O₂(g)<br/>Edukte"] --> |"Weg A<br/>ΔH = -286 kJ"| B["H₂O(l)<br/>Produkt"]
    
    A --> |"Schritt 1<br/>ΔH₁ = -242 kJ"| C["H₂O(g)<br/>Zwischenprodukt"]
    C --> |"Schritt 2<br/>ΔH₂ = -44 kJ"| B
    
    style A fill:#fee2e2
    style B fill:#dcfce7
    style C fill:#dbeafe
```

## Die Wegunabhängigkeit

Beide Wege führen zum gleichen Ergebnis:

| Weg                | Berechnung                               | Ergebnis |
| ------------------ | ---------------------------------------- | -------- |
| **A** (direkt)     | $\Delta H_A$                             | −286 kJ  |
| **B** (über Dampf) | $\Delta H_1 + \Delta H_2 = -242 + (-44)$ | −286 kJ  |

## Anwendung: Reaktionen kombinieren

Mit dem Satz von Hess können wir:

1. **Gleichungen addieren** → $\Delta H$-Werte addieren
2. **Gleichungen umkehren** → $\Delta H$ Vorzeichen wechseln
3. **Gleichungen multiplizieren** → $\Delta H$ mit gleichem Faktor multiplizieren

---
type: 'mermaid-diagram'
topic: 'Satz von Hess und Standard-Bildungsenthalpien'
---

# Der Satz von Hess visualisiert

Dieses Diagramm zeigt, wie verschiedene Reaktionswege zur gleichen Gesamtenthalpie führen.

```mermaid
flowchart TB
    subgraph START["Ausgangsstoffe"]
        A["H₂(g) + ½O₂(g)<br/>ΔH = 0 (Elemente)"]
    end
    
    subgraph WEGA["Weg A: Direkt"]
        direction TB
        B["→ H₂O(l)<br/>ΔH = -286 kJ"]
    end
    
    subgraph WEGB["Weg B: Über Dampf"]
        direction TB
        C["→ H₂O(g)<br/>ΔH₁ = -242 kJ"]
        D["→ H₂O(l)<br/>ΔH₂ = -44 kJ"]
        C --> D
    end
    
    A --> B
    A --> C
    
    subgraph ERGEBNIS["Ergebnis"]
        E["Gesamt: ΔH = -286 kJ<br/>Beide Wege = gleich!"]
    end
    
    B --> E
    D --> E
```

## Das Prinzip

| Weg   | Schritte                                         | Gesamt-ΔH              |
| ----- | ------------------------------------------------ | ---------------------- |
| **A** | Direkt zu flüssigem Wasser                       | -286 kJ                |
| **B** | Erst Dampf (-242 kJ), dann Kondensation (-44 kJ) | -242 + (-44) = -286 kJ |

> **Kernaussage des Satzes von Hess:**
> Der Weg spielt keine Rolle - nur Anfangs- und Endzustand bestimmen $\Delta H$.

## Warum ist das nützlich?

Manche Reaktionen lassen sich nicht direkt im Labor durchführen. Mit dem Satz von Hess können wir ihre Enthalpie trotzdem berechnen, indem wir einen alternativen Weg über bekannte Reaktionen nehmen.

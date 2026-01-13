---
type: 'mermaid-diagram'
topic: 'Visualisierung der Verdünnung'
---

# Verdünnung visualisiert

Das folgende Diagramm zeigt, was bei einer Verdünnung passiert.

```mermaid
flowchart LR
    subgraph "STAMMLÖSUNG"
        A["V₁ = klein<br/>c₁ = hoch<br/>●●●●●"]
    end
    
    subgraph "WASSER ZUGEBEN"
        B["+ H₂O"]
    end
    
    subgraph "VERDÜNNTE LÖSUNG"
        C["V₂ = groß<br/>c₂ = niedrig<br/>● ● ● ● ●"]
    end
    
    A --> B --> C
    
    style A fill:#ff9999
    style B fill:#99ccff
    style C fill:#ffcccc
```

## Was bleibt konstant?

| Größe            | Verändert sich?      |
| ---------------- | -------------------- |
| Volumen V        | ↑ Wird größer        |
| Konzentration c  | ↓ Wird kleiner       |
| **Stoffmenge n** | **= Bleibt gleich!** |

## Die goldene Regel

$$\boxed{c_1 \times V_1 = c_2 \times V_2}$$

> Die Anzahl der gelösten Teilchen ändert sich nicht – sie werden nur auf ein größeres Volumen verteilt!

---
type: 'mermaid-diagram'
topic: 'Visualisierung des 4-Schritte-Plans'
---

# Der 4-Schritte-Plan im Überblick

Das folgende Diagramm zeigt den systematischen Weg für stöchiometrische Berechnungen.

```mermaid
flowchart LR
    subgraph "EDUKT"
        A["Masse<br/>Reaktant (g)"]
        B["Mol<br/>Reaktant"]
    end
    
    subgraph "PRODUKT"
        C["Mol<br/>Produkt"]
        D["Masse<br/>Produkt (g)"]
    end
    
    A -->|"÷ Molmasse<br/>(g/mol)"| B
    B -->|"× Stöchio-<br/>metrischer<br/>Faktor"| C
    C -->|"× Molmasse<br/>(g/mol)"| D
    
    style A fill:#ffcccc
    style B fill:#ffffcc
    style C fill:#ffffcc
    style D fill:#ccffcc
```

## Zusammenfassung der Umrechnungen

| Schritt | Umrechnung                 | Formel                                     |
| ------- | -------------------------- | ------------------------------------------ |
| **1**   | Masse → Mol (Reaktant)     | $n = \frac{m}{M}$                          |
| **2**   | Mol Reaktant → Mol Produkt | $n_P = n_R \times \frac{Koeff_P}{Koeff_R}$ |
| **3**   | Mol → Masse (Produkt)      | $m = n \times M$                           |

## Merkhilfe

> 🎯 **Gramm rein, Mol hin, Faktor drauf, Gramm raus!**

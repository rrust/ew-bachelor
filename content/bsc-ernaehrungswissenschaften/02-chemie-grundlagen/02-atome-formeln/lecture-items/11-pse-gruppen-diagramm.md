---
type: 'mermaid-diagram'
topic: 'Periodensystem der Elemente'
---

## Übersicht der wichtigen Hauptgruppen

```mermaid
flowchart TB
    subgraph PSE["Periodensystem der Elemente"]
        direction TB
        
        subgraph Gr1["Gruppe 1"]
            A1["Alkalimetalle<br/>Li, Na, K, Rb, Cs"]
            A1Props["→ +1 Ionen<br/>→ Hochreaktiv<br/>→ Weiche Metalle"]
        end
        
        subgraph Gr2["Gruppe 2"]
            A2["Erdalkalimetalle<br/>Be, Mg, Ca, Sr, Ba"]
            A2Props["→ +2 Ionen<br/>→ Reaktiv<br/>→ Härtere Metalle"]
        end
        
        subgraph Gr17["Gruppe 17"]
            H["Halogene<br/>F, Cl, Br, I"]
            HProps["→ -1 Ionen<br/>→ Salzbildner<br/>→ Zweiatomig"]
        end
        
        subgraph Gr18["Gruppe 18"]
            E["Edelgase<br/>He, Ne, Ar, Kr, Xe"]
            EProps["→ Keine Ionen<br/>→ Reaktionsträge<br/>→ Volle Schale"]
        end
    end
    
    A1 --> A1Props
    A2 --> A2Props
    H --> HProps
    E --> EProps
    
    style Gr1 fill:#ffcccc
    style Gr2 fill:#ffe6cc
    style Gr17 fill:#ccffcc
    style Gr18 fill:#cce6ff
```

### Merkhilfe für typische Ionenladungen

| Hauptgruppe | Valenzelektronen | Typische Ladung | Beispiel  |
| ----------- | ---------------- | --------------- | --------- |
| 1           | 1                | +1              | $Na^+$    |
| 2           | 2                | +2              | $Ca^{2+}$ |
| 16          | 6                | -2              | $O^{2-}$  |
| 17          | 7                | -1              | $Cl^-$    |
| 18          | 8                | 0 (keine Ionen) | Ar        |

---
type: 'mermaid-diagram'
topic: 'Moleküle und Ionen'
---

## Vergleich: Kovalente vs. Ionische Bindung

```mermaid
flowchart TB
    subgraph Frage["Welcher Bindungstyp?"]
        Start["Chemische Verbindung"] --> Check{"Welche Elemente?"}
    end
    
    Check -->|"Nichtmetall + Nichtmetall"| Kovalent
    Check -->|"Metall + Nichtmetall"| Ionisch
    
    subgraph Kovalent["Kovalente Bindung"]
        K1["Elektronenpaare werden GETEILT"]
        K2["→ Diskrete Moleküle"]
        K3["→ Niedrigere Schmelzpunkte"]
        K4["Beispiele: H₂O, CH₄, CO₂"]
    end
    
    subgraph Ionisch["Ionische Bindung"]
        I1["Elektronen werden ÜBERTRAGEN"]
        I2["→ Kristallgitter"]
        I3["→ Hohe Schmelzpunkte"]
        I4["Beispiele: NaCl, CaO, MgF₂"]
    end
    
    K1 --> K2 --> K3 --> K4
    I1 --> I2 --> I3 --> I4
    
    style Kovalent fill:#e6f3ff
    style Ionisch fill:#fff0e6
```

### Kurzübersicht

| Kriterium              | Kovalent       | Ionisch                      |
| ---------------------- | -------------- | ---------------------------- |
| Elektronenverhalten    | Teilen         | Übertragen                   |
| Beteiligte Elemente    | Nichtmetalle   | Metall + Nichtmetall         |
| Struktur               | Moleküle       | Ionengitter                  |
| Leitfähigkeit          | Nicht leitend  | Leitend (geschmolzen/gelöst) |
| Typische Eigenschaften | Niedriger Smp. | Hoher Smp., spröde           |

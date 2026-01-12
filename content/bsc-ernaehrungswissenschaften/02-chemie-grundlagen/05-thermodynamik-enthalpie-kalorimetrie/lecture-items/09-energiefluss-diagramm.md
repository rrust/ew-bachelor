---
type: 'mermaid-diagram'
topic: 'System und Energiefluss'
title: 'Exotherme und endotherme Prozesse'
---

```mermaid
flowchart LR
    subgraph EXOTHERM["🔥 EXOTHERM"]
        direction LR
        S1[System<br/>Energie ↓] -->|"Wärme q"| U1[Umgebung<br/>Energie ↑]
        S1 -.->|"wird kühler"| S1
        U1 -.->|"wird wärmer"| U1
    end
    
    subgraph ENDOTHERM["❄️ ENDOTHERM"]
        direction LR
        U2[Umgebung<br/>Energie ↓] -->|"Wärme q"| S2[System<br/>Energie ↑]
        U2 -.->|"wird kühler"| U2
        S2 -.->|"wird wärmer"| S2
    end
    
    style S1 fill:#fee2e2
    style U1 fill:#fef3c7
    style S2 fill:#dbeafe
    style U2 fill:#e0e7ff
```

## Zusammenfassung der Energieflüsse

| Aspekt                  | Exotherm           | Endotherm          |
| ----------------------- | ------------------ | ------------------ |
| **Energierichtung**     | System → Umgebung  | Umgebung → System  |
| **Systemenergie**       | nimmt ab           | nimmt zu           |
| **Umgebungstemperatur** | steigt             | sinkt              |
| **Gefäß anfassen**      | fühlt sich warm an | fühlt sich kalt an |
| **Vorzeichen q**        | negativ (−)        | positiv (+)        |
| **Beispiel**            | Verbrennung        | Verdunstung        |

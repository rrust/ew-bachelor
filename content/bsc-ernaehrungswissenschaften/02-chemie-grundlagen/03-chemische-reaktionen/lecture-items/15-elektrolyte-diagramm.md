---
type: 'mermaid-diagram'
topic: 'Lösungen und Elektrolyte'
title: 'Klassifikation von Elektrolyten'
---

```mermaid
flowchart TD
    A[Stoff in Wasser gelöst] --> B{Entstehen Ionen?}
    
    B -->|Nein| C[Nichtelektrolyt]
    C --> C1[Keine Leitfähigkeit]
    C --> C2["Beispiele: Zucker, Ethanol"]
    
    B -->|Ja| D{Wie viel dissoziiert?}
    
    D -->|"~100%"| E[Starker Elektrolyt]
    E --> E1[Hohe Leitfähigkeit]
    E --> E2["Beispiele: NaCl, HCl, NaOH"]
    
    D -->|"< 5%"| F[Schwacher Elektrolyt]
    F --> F1[Geringe Leitfähigkeit]
    F --> F2["Beispiele: CH₃COOH, NH₃"]
    
    style C fill:#f3f4f6
    style E fill:#dcfce7
    style F fill:#fef3c7
```

## Zusammenfassung

| Typ         | Dissoziation | Leitfähigkeit | Pfeil                | Beispiele                  |
| ----------- | ------------ | ------------- | -------------------- | -------------------------- |
| **Stark**   | ~100%        | Hoch          | $\rightarrow$        | Salze, starke Säuren/Basen |
| **Schwach** | < 5%         | Gering        | $\rightleftharpoons$ | Essigsäure, Ammoniak       |
| **Nicht**   | 0%           | Keine         | —                    | Zucker, Alkohole           |

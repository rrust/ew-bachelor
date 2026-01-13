---
type: 'mermaid-diagram'
topic: 'Titrationsaufbau'
---

# Aufbau einer Titration

Das folgende Diagramm zeigt den typischen Aufbau einer Säure-Base-Titration.

```mermaid
flowchart TB
    subgraph "BÜRETTE"
        A["Titratorlösung<br/>(bekannte Konz.)"]
        B["↓ tropfenweise<br/>zugeben"]
    end
    
    subgraph "ERLENMEYERKOLBEN"
        C["Analyt + Indikator<br/>(unbekannte Konz.)"]
    end
    
    subgraph "ABLAUF"
        D["Start:<br/>Indikatorfarbe A"]
        E["Titration:<br/>Zugabe"]
        F["Äquivalenzpunkt:<br/>Farbumschlag!"]
        G["Ablesen:<br/>Verbrauchtes Volumen"]
    end
    
    A --> B --> C
    D --> E --> F --> G
    
    style F fill:#ffcccc
```

## Ablauf in Kurzform

| Schritt | Aktion                                         |
| ------- | ---------------------------------------------- |
| **1**   | Analyt + Indikator in Kolben                   |
| **2**   | Bürette mit Titrator füllen, Nullpunkt ablesen |
| **3**   | Langsam zutropfen lassen                       |
| **4**   | Bei Farbumschlag stoppen                       |
| **5**   | Volumen ablesen                                |
| **6**   | Berechnung durchführen                         |

## Wichtig

> ⚠️ **Präzision ist entscheidend!**
> - Tropfenweise zugeben nahe dem Äquivalenzpunkt
> - Volumen auf 0,05 mL genau ablesen
> - Kolben regelmäßig schwenken

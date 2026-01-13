---
type: 'mermaid-diagram'
topic: 'Mol-Umrechnungsdreieck'
---

# Das Mol-Umrechnungsdreieck

Das folgende Diagramm zeigt die Beziehungen zwischen Masse, Stoffmenge und Teilchenzahl:

```mermaid
flowchart TB
    A["**Masse m**<br/>(in Gramm)"]
    B["**Stoffmenge n**<br/>(in Mol)"]
    C["**Teilchenzahl N**<br/>(Anzahl Teilchen)"]
    
    A -->|"÷ M<br/>(÷ molare Masse)"| B
    B -->|"× M<br/>(× molare Masse)"| A
    B -->|"× Nₐ<br/>(× 6,022×10²³)"| C
    C -->|"÷ Nₐ<br/>(÷ 6,022×10²³)"| B
```

## Zusammenfassung der Formeln

| Von                   | Nach  | Rechnung         |
| --------------------- | ----- | ---------------- |
| Masse → Stoffmenge    | m → n | n = m ÷ M        |
| Stoffmenge → Masse    | n → m | m = n × M        |
| Stoffmenge → Teilchen | n → N | N = n × Nₐ       |
| Teilchen → Stoffmenge | N → n | n = N ÷ Nₐ       |
| Masse → Teilchen      | m → N | N = (m ÷ M) × Nₐ |

## Merkhilfe

> 🔺 Das Mol steht in der Mitte!
>
> - Nach **oben** (Masse): **mal M**
> - Nach **unten** (Teilchen): **mal Nₐ**
> - Von Masse/Teilchen zum Mol: **teilen**

---
type: 'mermaid-diagram'
topic: 'Konzentrationsverlauf bis zum Gleichgewicht'
---

# Entwicklung zum Gleichgewicht

Das folgende Diagramm zeigt, wie sich die Konzentrationen von Edukten und Produkten mit der Zeit entwickeln, bis das Gleichgewicht erreicht ist.

```mermaid
graph LR
    subgraph "Zeitverlauf"
        A["Start:<br/>Nur Edukte"] --> B["Reaktion:<br/>Edukte ↓<br/>Produkte ↑"]
        B --> C["Gleichgewicht:<br/>Konstante<br/>Konzentrationen"]
    end
    
    subgraph "Reaktionsgeschwindigkeiten"
        D["v(hin) > v(rück)"] --> E["v(hin) = v(rück)"]
    end
```

## Was passiert zeitlich?

| Phase             | Edukte   | Produkte | Hinreaktion    | Rückreaktion  |
| ----------------- | -------- | -------- | -------------- | ------------- |
| **Start**         | Hoch     | Null     | Schnell        | Keine         |
| **Reaktion**      | Sinkt    | Steigt   | Langsamer      | Schneller     |
| **Gleichgewicht** | Konstant | Konstant | = Rückreaktion | = Hinreaktion |

## Wichtige Erkenntnis

Im Gleichgewicht sind Edukt- und Produktkonzentrationen **nicht unbedingt gleich**! Sie sind nur **konstant**. Das Verhältnis hängt von der Gleichgewichtskonstante ab.

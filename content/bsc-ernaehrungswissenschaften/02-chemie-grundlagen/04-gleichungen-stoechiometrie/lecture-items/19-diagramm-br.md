---
type: 'mermaid-diagram'
topic: 'Visualisierung des begrenzenden Reaktanten'
---

# Begrenzender Reaktant im Überblick

Das folgende Diagramm zeigt den Entscheidungsprozess zur Identifikation des begrenzenden Reaktanten.

```mermaid
flowchart TD
    A["Start: Zwei oder mehr<br/>Reaktanten gegeben"] --> B["Mol für jeden<br/>Reaktanten berechnen"]
    B --> C["Tatsächliches Verhältnis<br/>berechnen"]
    C --> D["Mit theoretischem Verhältnis<br/>aus Gleichung vergleichen"]
    D --> E{Vergleich?}
    E -->|"Tatsächlich < Theoretisch"| F["Zähler-Stoff ist<br/>BEGRENZEND"]
    E -->|"Tatsächlich > Theoretisch"| G["Nenner-Stoff ist<br/>BEGRENZEND"]
    E -->|"Gleich"| H["Exakt stöchiometrisch<br/>(beide aufgebraucht)"]
    F --> I["Alle Berechnungen mit<br/>dem BR durchführen!"]
    G --> I
    H --> I
    
    style F fill:#ffcccc
    style G fill:#ffcccc
    style I fill:#ccffcc
```

## Merkhilfe

> 🎯 **Der begrenzende Reaktant bestimmt, wie viel Produkt entstehen kann!**
>
> Stellen Sie sich vor: Sie können nur so viele Sandwiches machen, wie Sie Käse haben – egal wie viel Brot noch da ist.

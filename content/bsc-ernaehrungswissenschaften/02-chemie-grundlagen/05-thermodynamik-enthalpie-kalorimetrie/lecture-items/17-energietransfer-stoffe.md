---
type: 'learning-content'
topic: 'Energietransfer zwischen Stoffen'
sourceRefs:
  - sourceId: 'vorlesung-k5'
    pages: '17-18'
---

## Energietransfer zwischen zwei Stoffen

Wenn ein heißer und ein kalter Stoff in Kontakt kommen, findet Energieaustausch statt.

### Das Prinzip

Nach dem **Energieerhaltungssatz** gilt bei idealer Isolierung:

$$\boxed{q_{\text{heiß}} = -q_{\text{kalt}}}$$

Oder anders ausgedrückt:
$$q_{\text{heiß}} + q_{\text{kalt}} = 0$$

**Bedeutung:** Die Energie, die der heiße Stoff verliert, gewinnt der kalte Stoff.

### Beispiel: Heißes Metall in kaltes Wasser

```text
Vorher:                    Nachher:
┌──────────┐               ┌──────────┐
│ Metall   │               │ Metall   │
│ 100 °C   │──────────────▶│  45 °C   │
└──────────┘               └──────────┘
                                 
┌──────────┐               ┌──────────┐
│ Wasser   │               │ Wasser   │
│  20 °C   │──────────────▶│  45 °C   │
└──────────┘               └──────────┘
```

- Metall gibt Energie ab: $q_{\text{Metall}} < 0$
- Wasser nimmt Energie auf: $q_{\text{Wasser}} > 0$
- Im Gleichgewicht: gleiche Endtemperatur

### Die Gleichung aufstellen

$$m_{\text{Metall}} \cdot c_{\text{Metall}} \cdot \Delta T_{\text{Metall}} = -m_{\text{Wasser}} \cdot c_{\text{Wasser}} \cdot \Delta T_{\text{Wasser}}$$

### Anwendung: Unbekanntes Metall identifizieren

Diese Methode wird genutzt, um die **spezifische Wärmekapazität** eines unbekannten Materials zu bestimmen:

1. Metall erhitzen und in Wasser bekannter Temperatur geben
2. Endtemperatur messen
3. Aus der Energiebilanz $c_{\text{Metall}}$ berechnen

> 🔬 **Praxistipp:** Diese Methode setzt voraus, dass keine Wärme an die Umgebung verloren geht – daher verwendet man isolierte Gefäße (Kalorimeter).

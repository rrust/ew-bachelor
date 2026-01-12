---
type: 'learning-content'
topic: 'Kalorimetrie-Berechnungen'
sourceRefs:
  - sourceId: 'vorlesung-k5'
    pages: '43-45'
---

## Auswertung kalorimetrischer Messungen

Bei der Verbrennung im Bombenkalorimeter wird die freigesetzte Wärme von **zwei Komponenten** aufgenommen.

### Die Energiebilanz

$$q_{\text{Reaktion}} = -(q_{\text{Wasser}} + q_{\text{Bombe}})$$

Das negative Vorzeichen, weil die Reaktion Energie **abgibt**, während Wasser und Bombe sie **aufnehmen**.

### Die Teilgleichungen

**Wärme ans Wasser:**
$$q_{\text{Wasser}} = m_{\text{Wasser}} \cdot c_{\text{Wasser}} \cdot \Delta T$$

**Wärme an die Bombe:**
$$q_{\text{Bombe}} = C_{\text{Bombe}} \cdot \Delta T$$

Dabei ist $C_{\text{Bombe}}$ die **Wärmekapazität des Geräts** (in J/K), die durch Kalibrierung bestimmt wird.

### Gesamtgleichung

$$q_{\text{gesamt}} = (m_{\text{Wasser}} \cdot c_{\text{Wasser}} + C_{\text{Bombe}}) \cdot \Delta T$$

### Warum die Bombe berücksichtigen?

Nicht nur das Wasser erwärmt sich – auch der Stahlbehälter, die Rührer und andere Metallteile nehmen Wärme auf. Ohne diese Korrektur wären die Ergebnisse zu niedrig!

### Typische Größenordnungen

| Größe                      | Typischer Wert |
| -------------------------- | -------------- |
| Wassermenge                | 1000–2000 g    |
| $c_{\text{Wasser}}$        | 4,184 J/(g·K)  |
| $C_{\text{Bombe}}$         | 500–2000 J/K   |
| $\Delta T$ bei Verbrennung | 2–10 K         |

> 💡 **Tipp:** Bei Prüfungsaufgaben werden $C_{\text{Bombe}}$ und Wassermenge immer angegeben!

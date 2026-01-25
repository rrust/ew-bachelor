---
type: 'learning-content'
sourceRefs:
  - sourceId: 'vorlesung-k16'
  - sourceId: 'kotz-k16'
---

# Berechnungen bei Gleichgewichtsstörungen

Wenn ein Gleichgewicht gestört wird, ist Q ≠ K. Das System läuft zu einem neuen Gleichgewichtszustand.

## Die Methode

1. **Altes Gleichgewicht bestimmen** (gegeben oder berechnen)
2. **Störung anwenden** (neue Anfangskonzentrationen)
3. **Q berechnen und mit K vergleichen** (Richtung bestimmen)
4. **Neue ICE-Tabelle aufstellen**
5. **Neues Gleichgewicht berechnen**

## Beispiel: Phosgen-Gleichgewicht

$$\text{CO(g)} + \text{Cl}_2\text{(g)} \rightleftharpoons \text{COCl}_2\text{(g)}$$

### Schritt 1: Altes Gleichgewicht

Gegeben: [CO] = 0,30 M, [Cl₂] = 0,10 M, [COCl₂] = 0,60 M

$$K_c = \frac{[\text{COCl}_2]}{[\text{CO}][\text{Cl}_2]} = \frac{0{,}60}{0{,}30 \times 0{,}10} = 20$$

### Schritt 2: Störung anwenden

Zugabe von 0,40 M Cl₂

Neue Anfangskonzentrationen:
- [CO] = 0,30 M
- [Cl₂] = 0,10 + 0,40 = **0,50 M**
- [COCl₂] = 0,60 M

### Schritt 3: Q berechnen

$$Q = \frac{0{,}60}{0{,}30 \times 0{,}50} = 4$$

Da Q = 4 < K = 20 → Reaktion läuft nach **rechts**

### Schritt 4: ICE-Tabelle

|       | [CO]   | [Cl₂]  | [COCl₂] |
| ----- | ------ | ------ | ------- |
| **I** | 0,30   | 0,50   | 0,60    |
| **C** | −x     | −x     | +x      |
| **E** | 0,30−x | 0,50−x | 0,60+x  |

### Schritt 5: Einsetzen in K

$$20 = \frac{0{,}60 + x}{(0{,}30-x)(0{,}50-x)}$$

Dies führt zu einer quadratischen Gleichung. Die Lösung ergibt x ≈ 0,14 M.

**Neue Gleichgewichtskonzentrationen:**
- [CO] = 0,16 M
- [Cl₂] = 0,36 M
- [COCl₂] = 0,74 M

> **Merksatz:** Bei Zugabe eines Reaktanten wird dieser teilweise verbraucht und das Produkt nimmt zu – aber K bleibt konstant!

---
type: 'learning-content'
topic: 'Genauigkeit, Präzision und Fehlerrechnung'
sourceRefs:
  - sourceId: 'kapitel-1'
---

## Dimensionsanalyse bei Flächen und Volumen

Ein häufiger Fehler bei der Einheitenumrechnung: Bei Flächen und Volumen muss der Umrechnungsfaktor potenziert werden!

### Flächen (quadrierte Einheiten)

Bei der Umrechnung von $\text{mm}^2$ in $\text{m}^2$ muss der Faktor **quadriert** werden:

$$1\,\text{m} = 1000\,\text{mm}$$
$$(1\,\text{m})^2 = (1000\,\text{mm})^2$$
$$1\,\text{m}^2 = 1.000.000\,\text{mm}^2 = 10^6\,\text{mm}^2$$

**Beispiel:** Umrechnung von $50\,\text{cm}^2$ in $\text{m}^2$

❌ **Falsch:** $50 \div 100 = 0,5\,\text{m}^2$

✅ **Richtig:** $50 \div 100^2 = 50 \div 10.000 = 0,005\,\text{m}^2$

### Volumen (kubierte Einheiten)

Bei Volumen muss der Faktor **kubiert** werden:

$$1\,\text{m} = 100\,\text{cm}$$
$$(1\,\text{m})^3 = (100\,\text{cm})^3$$
$$1\,\text{m}^3 = 1.000.000\,\text{cm}^3 = 10^6\,\text{cm}^3$$

### Merkhilfe

| Dimension | Potenz | Faktor cm → m |
| --------- | ------ | ------------- |
| Länge     | 1      | ÷ 100         |
| Fläche    | 2      | ÷ 10.000      |
| Volumen   | 3      | ÷ 1.000.000   |

> **Eselsbrücke:** Der Exponent der Einheit zeigt an, wie oft der Umrechnungsfaktor angewendet werden muss!

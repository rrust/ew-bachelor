---
type: 'learning-content'
topic: 'Genauigkeit, Präzision und Fehlerrechnung'
sourceRefs:
  - sourceId: 'kapitel-1'
---

## Rechenregeln für signifikante Stellen

### Multiplikation und Division

Das Ergebnis hat so viele signifikante Stellen wie die Zahl mit den **wenigsten** signifikanten Stellen.

**Beispiel:**
$$4,242 \times 1,23 = 5,21766 \rightarrow \textbf{5,22}$$

| Zahl         | Sig. Stellen |
| ------------ | ------------ |
| 4,242        | 4            |
| 1,23         | 3 ← wenigste |
| **Ergebnis** | **3**        |

### Addition und Subtraktion

Das Ergebnis wird durch die **wenigsten Dezimalstellen** bestimmt (nicht signifikante Stellen!).

**Beispiel:**
$$3,6923 + 1,234 + 2,02 = 6,9463 \rightarrow \textbf{6,95}$$

| Zahl         | Dezimalstellen |
| ------------ | -------------- |
| 3,6923       | 4              |
| 1,234        | 3              |
| 2,02         | 2 ← wenigste   |
| **Ergebnis** | **2**          |

### Zusammenfassung

| Operation      | Regel           | Bezogen auf          |
| -------------- | --------------- | -------------------- |
| Multiplikation | Wenigste Anzahl | Signifikante Stellen |
| Division       | Wenigste Anzahl | Signifikante Stellen |
| Addition       | Wenigste Anzahl | Dezimalstellen       |
| Subtraktion    | Wenigste Anzahl | Dezimalstellen       |

> **Tipp:** Bei mehrstufigen Rechnungen erst am Ende runden, um Rundungsfehler zu vermeiden!

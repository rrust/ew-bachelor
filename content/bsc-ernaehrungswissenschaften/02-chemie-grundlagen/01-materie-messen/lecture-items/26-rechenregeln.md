---
type: 'learning-content'
topic: 'Messunsicherheit'
---

## Rechenregeln für signifikante Stellen

Je nach Rechenoperation gelten unterschiedliche Regeln:

### Multiplikation und Division

> Das Ergebnis darf **nicht mehr signifikante Stellen** haben als der Faktor mit den **wenigsten** signifikanten Stellen.

**Beispiel:**

$$4{,}242 \times 1{,}23 = 5{,}21766...$$

- $4{,}242$ hat 4 signifikante Stellen
- $1{,}23$ hat **3** signifikante Stellen (limitierend!)
- **Ergebnis:** $5{,}22$ (auf 3 signifikante Stellen gerundet)

### Addition und Subtraktion

> Das Ergebnis richtet sich nach der Zahl mit den **wenigsten Nachkommastellen**.

**Beispiel:**

$$3{,}6923 + 1{,}234 + 2{,}02 = 6{,}9463$$

- $3{,}6923$ hat 4 Nachkommastellen
- $1{,}234$ hat 3 Nachkommastellen
- $2{,}02$ hat **2** Nachkommastellen (limitierend!)
- **Ergebnis:** $6{,}95$ (auf 2 Nachkommastellen gerundet)

### Zusammenfassung

| Operation | Regel                             | Beispiel                      |
| --------- | --------------------------------- | ----------------------------- |
| × und ÷   | Wenigste **signifikante Stellen** | $2{,}0 \times 3{,}00 = 6{,}0$ |
| + und −   | Wenigste **Nachkommastellen**     | $2{,}0 + 3{,}001 = 5{,}0$     |

### Rundungsregeln

- < 5 → abrunden
- ≥ 5 → aufrunden
- Bei Zwischenrechnungen: **mehr Stellen behalten**, erst am Ende runden!

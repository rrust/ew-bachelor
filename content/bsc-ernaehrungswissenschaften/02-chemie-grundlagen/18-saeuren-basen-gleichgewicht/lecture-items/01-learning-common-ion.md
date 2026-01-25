---
type: 'learning-content'
sourceRefs:
  - sourceId: 'vorlesung-k18'
  - sourceId: 'kotz-k18'
---

# Der gemeinsame Ionen-Effekt (Common Ion Effect)

Der gemeinsame Ionen-Effekt beschreibt die Auswirkung auf ein Gleichgewicht, wenn ein Ion hinzugefügt wird, das bereits in der Lösung vorhanden ist. Er ist eine direkte Anwendung des **Prinzips von Le Chatelier**.

## Grundprinzip

Betrachten wir eine schwache Base wie Ammoniak im Gleichgewicht mit Wasser:

$$\text{NH}_3\text{(aq)} + \text{H}_2\text{O(l)} \rightleftharpoons \text{NH}_4^+\text{(aq)} + \text{OH}^-\text{(aq)}$$

Wenn wir nun ein Salz zugeben, das eines der Produkt-Ionen enthält (z.B. Ammoniumchlorid NH₄Cl), fügen wir sogenannte **gemeinsame Ionen** (NH₄⁺) hinzu.

## Auswirkung nach Le Chatelier

Das System versucht, dem Zwang (Erhöhung der NH₄⁺-Konzentration) auszuweichen:

1. Das Gleichgewicht verschiebt sich nach **links** (Richtung Edukte)
2. Dabei werden OH⁻-Ionen verbraucht
3. Die Konzentration von OH⁻ sinkt
4. Der **pH-Wert sinkt** (wird weniger basisch)

## Quantitative Betrachtung

Der Effekt lässt sich quantitativ berechnen. Vergleichen wir zwei Szenarien:

### Szenario A: Reine Ammoniak-Lösung (0,25 M NH₃)

Mit $K_b = 1{,}8 \times 10^{-5}$ gilt:

$$[\text{OH}^-] = \sqrt{K_b \cdot 0{,}25} = 0{,}0021\,\text{M}$$

Dies ergibt pOH = 2,67 und **pH = 11,33**.

### Szenario B: Mischung (0,25 M NH₃ + 0,10 M NH₄Cl)

Hier ist die Anfangskonzentration von NH₄⁺ bereits 0,10 M:

$$[\text{OH}^-] = K_b \times \frac{[\text{NH}_3]}{[\text{NH}_4^+]} = 1{,}8 \times 10^{-5} \times \frac{0{,}25}{0{,}10} = 4{,}5 \times 10^{-5}\,\text{M}$$

Das ergibt pOH = 4,35 und **pH = 9,65**.

## Zusammenfassung

| Lösung           | pH-Wert |
| ---------------- | ------- |
| Reine NH₃-Lösung | 11,33   |
| NH₃ + NH₄Cl      | 9,65    |

Der pH-Wert fällt drastisch durch die Zugabe des Salzes – obwohl wir keine Säure zugegeben haben! Dies ist der Common Ion Effect in Aktion.

> **Merksatz:** Die Zugabe eines gemeinsamen Ions verschiebt das Gleichgewicht einer schwachen Säure/Base und verringert deren Dissoziationsgrad.

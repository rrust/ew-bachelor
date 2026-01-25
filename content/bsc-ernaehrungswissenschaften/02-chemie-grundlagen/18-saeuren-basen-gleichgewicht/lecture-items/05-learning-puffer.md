---
type: 'learning-content'
sourceRefs:
  - sourceId: 'vorlesung-k18'
  - sourceId: 'kotz-k18'
---

# Pufferlösungen – Grundlagen

Eine Pufferlösung ist eine spezielle Anwendung des gemeinsamen Ionen-Effekts. Ihre Hauptfunktion ist es, **pH-Änderungen zu widerstehen**, wenn Säuren oder Basen hinzugefügt werden.

## Zusammensetzung eines Puffers

Ein Puffer besteht immer aus zwei Komponenten:

1. Einer **schwachen Säure** (neutralisiert hinzugefügte OH⁻-Ionen)
2. Ihrer **konjugierten Base** (neutralisiert hinzugefügte H⁺-Ionen)

### Wichtige Puffersysteme

| Puffersystem    | Schwache Säure       | Konjugierte Base |
| --------------- | -------------------- | ---------------- |
| Acetat-Puffer   | CH₃COOH (Essigsäure) | CH₃COO⁻ (Acetat) |
| Phosphat-Puffer | H₂PO₄⁻               | HPO₄²⁻           |
| Ammonium-Puffer | NH₄⁺                 | NH₃              |
| Carbonat-Puffer | H₂CO₃ / CO₂          | HCO₃⁻            |

## Funktionsweise am Beispiel des Acetat-Puffers

### Bei Zugabe einer starken Base (OH⁻)

Die schwache Säure im Puffer reagiert:

$$\text{CH}_3\text{COOH} + \text{OH}^- \rightarrow \text{CH}_3\text{COO}^- + \text{H}_2\text{O}$$

Die OH⁻-Ionen werden fast vollständig abgefangen und in die schwach basische konjugierte Base und Wasser umgewandelt.

### Bei Zugabe einer starken Säure (H⁺)

Die konjugierte Base reagiert:

$$\text{CH}_3\text{COO}^- + \text{H}_3\text{O}^+ \rightarrow \text{CH}_3\text{COOH} + \text{H}_2\text{O}$$

Die starken Protonen werden abgefangen und in die schwache Essigsäure umgewandelt.

## Die Henderson-Hasselbalch-Gleichung

Um den pH-Wert eines Puffers zu berechnen, verwenden wir die **Henderson-Hasselbalch-Gleichung**:

$$\text{pH} = \text{p}K_s + \log\left(\frac{[\text{konjugierte Base}]}{[\text{Säure}]}\right)$$

### Wichtige Erkenntnisse

- Der pH-Wert wird primär durch den **pKs-Wert** der Säure bestimmt
- Das **Konzentrationsverhältnis** von Base zu Säure ermöglicht die Feinjustierung
- Wenn [Base] = [Säure], dann gilt: **pH = pKs** (da log(1) = 0)

## Warum funktioniert ein Puffer?

Ein Puffer enthält immer beide Komponenten (Säure und Base) in ausreichender Menge:

- Säure fängt zugegebene Base ab
- Base fängt zugegebene Säure ab

Solange beide Reservoire nicht erschöpft sind, bleibt der pH-Wert nahezu konstant.

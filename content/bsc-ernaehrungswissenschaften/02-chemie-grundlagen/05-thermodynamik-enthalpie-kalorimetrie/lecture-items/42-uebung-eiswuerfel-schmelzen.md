---
type: 'practice-exercise'
topic: 'Energie bei Phasenübergängen'
title: 'Eiswürfel schmelzen'
scenario: |
  Du holst einen Eiswürfel aus dem Gefrierfach (-18°C) und legst ihn in ein Glas. Er soll bei Zimmertemperatur (20°C) vollständig schmelzen.
  
  **Gegeben für Wasser:**
  - Masse Eiswürfel: $m = 25$ g
  - $c_{\text{Eis}} = 2,03$ J/(g·K)
  - $c_{\text{Wasser}} = 4,184$ J/(g·K)
  - Schmelzwärme: $L = 333$ J/g
tasks:
  - task: 'Berechne die Energie, um das Eis von -18°C auf 0°C zu erwärmen.'
    solution: '$q_1 = m \cdot c_{\text{Eis}} \cdot \Delta T = 25 \text{ g} \cdot 2,03 \frac{\text{J}}{\text{g}\cdot\text{K}} \cdot 18 \text{ K} = 913,5 \text{ J}$'
  - task: 'Berechne die Energie, um das Eis bei 0°C zu schmelzen.'
    solution: '$q_2 = m \cdot L = 25 \text{ g} \cdot 333 \frac{\text{J}}{\text{g}} = 8325 \text{ J}$'
  - task: 'Berechne die Energie, um das Wasser von 0°C auf 20°C zu erwärmen.'
    solution: '$q_3 = m \cdot c_{\text{Wasser}} \cdot \Delta T = 25 \text{ g} \cdot 4,184 \frac{\text{J}}{\text{g}\cdot\text{K}} \cdot 20 \text{ K} = 2092 \text{ J}$'
  - task: 'Berechne die Gesamtenergie und vergleiche die Anteile.'
    solution: '$q_{\text{ges}} = 913,5 + 8325 + 2092 = 11.330,5 \text{ J} \approx 11,3 \text{ kJ}$. Das Schmelzen macht 73% der Gesamtenergie aus!'
hint: 'Teile den Prozess in drei Schritte: Eis erwärmen, Eis schmelzen, Wasser erwärmen.'
successMessage: 'Richtig! Du siehst, dass der Phasenübergang (Schmelzen) den größten Energieanteil ausmacht.'
---

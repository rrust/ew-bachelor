---
type: 'calculation'
topic: 'Anwendung Ernährungswissenschaft'
question: |
  Für eine Kältepackung soll die Lösung um 25°C abkühlen. Die Packung enthält 80 g Wasser.
  
  Wie viel Gramm Ammoniumnitrat ($\text{NH}_4\text{NO}_3$) werden benötigt?
  
  **Gegeben:**
  - Lösungsenthalpie: $\Delta H = +28,1$ kJ/mol
  - Molare Masse NH₄NO₃: 80 g/mol
  - $c_{\text{Wasser}} = 4,184$ J/(g·K)
correctAnswer: '24'
tolerance: 1
unit: 'g'
hint: 'Berechne erst die benötigte Wärme q, dann die Stoffmenge n, dann die Masse m.'
steps:
  - '**Benötigte Wärme:** $q = m \cdot c \cdot \Delta T = 80 \text{ g} \cdot 4,184 \frac{\text{J}}{\text{g·K}} \cdot 25 \text{ K} = 8368$ J = 8,37 kJ'
  - '**Stoffmenge NH₄NO₃:** $n = \frac{q}{\Delta H} = \frac{8,37 \text{ kJ}}{28,1 \text{ kJ/mol}} = 0,298$ mol'
  - '**Masse:** $m = n \cdot M = 0,298 \text{ mol} \cdot 80 \frac{\text{g}}{\text{mol}} = 23,8$ g ≈ 24 g'
explanation: 'Etwa 24 g Ammoniumnitrat reichen aus, um 80 g Wasser um 25°C zu kühlen. Dies ist eine typische Größenordnung für kommerzielle Kältepackungen. Der endotherme Lösevorgang entzieht dem Wasser die nötige Energie.'
---

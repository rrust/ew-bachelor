---
type: 'calculation'
topic: 'Wärmekapazität und spezifische Wärme'
question: |
  Ein 50,0 g schweres Stück eines unbekannten Metalls wird auf 100,0 °C erhitzt und in 100,0 g Wasser bei 22,0 °C getaucht. Die Endtemperatur beträgt 28,5 °C.
  
  Berechne die spezifische Wärmekapazität des Metalls.
  
  **Gegeben:** $c_{\text{Wasser}} = 4,184$ J/(g·K)
correctAnswer: '0,76'
tolerance: 0.02
unit: 'J/(g·K)'
hint: 'Nutze die Energiebilanz: $q_{\text{Metall}} = -q_{\text{Wasser}}$. Die Energie, die das Metall abgibt, nimmt das Wasser auf.'
steps:
  - 'Wärme des Wassers berechnen: $q_{\text{W}} = 100 \cdot 4,184 \cdot (28,5-22,0) = 2719,6$ J'
  - 'Energiebilanz: Das Metall gibt diese Energie ab: $q_{\text{M}} = -2719,6$ J'
  - 'Temperaturänderung Metall: $\Delta T_{\text{M}} = 28,5 - 100,0 = -71,5$ K'
  - 'Nach c auflösen: $c = \frac{q}{m \cdot \Delta T} = \frac{-2719,6}{50,0 \cdot (-71,5)} = 0,76$ J/(g·K)'
explanation: 'Dieses Experiment nutzt man tatsächlich, um unbekannte spezifische Wärmekapazitäten zu bestimmen. Der Wert 0,76 J/(g·K) liegt zwischen Aluminium und Eisen - es könnte z.B. eine Legierung sein.'
---

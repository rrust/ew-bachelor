---
type: 'calculation'
topic: 'Genauigkeit, Präzision und Fehlerrechnung'
question: 'Eine Fläche misst 500 mm². Rechne sie in m² um. Achte darauf, dass du den Umrechnungsfaktor quadrierst!'
variables:
  A: '500 mm²'
  factor: '1 m = 1000 mm → 1 m² = 1.000.000 mm²'
formula: 'A_{m^2} = \frac{A_{mm^2}}{(1000)^2}'
correctAnswer: 0.0005
unit: 'm²'
tolerance: 0.00001
hints:
  - '1 m = 1000 mm, also 1 m² = 1000² mm² = 1.000.000 mm²'
  - 'Teile 500 durch 1.000.000'
  - '500 ÷ 1.000.000 = 0,0005 m²'
explanation: 'Die Fläche beträgt 0,0005 m² oder 5 × 10⁻⁴ m². Der häufige Fehler wäre, nur durch 1000 zu teilen (was 0,5 m² ergäbe), aber bei Flächen muss der Faktor quadriert werden!'
---

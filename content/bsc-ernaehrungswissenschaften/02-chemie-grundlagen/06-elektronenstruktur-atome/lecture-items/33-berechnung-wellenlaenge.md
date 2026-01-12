---
type: 'calculation'
topic: 'Wellenlänge eines Übergangs'
question: 'Berechne die Wellenlänge des Lichts, das beim Übergang n=3 → n=2 im Wasserstoffatom emittiert wird. Nutze die Rydberg-Konstante RH = 1,097 × 10⁷ m⁻¹.'
variables:
  RH: '1,097 × 10⁷ m⁻¹'
  n_initial: '3'
  n_end: '2'
formula: '\frac{1}{\lambda} = R_H \left( \frac{1}{n_{end}^2} - \frac{1}{n_{initial}^2} \right)'
correctAnswer: 656
unit: 'nm'
tolerance: 5
hints:
  - 'Setze ein: 1/λ = 1,097×10⁷ × (1/4 - 1/9)'
  - 'Berechne: 1/4 - 1/9 = 9/36 - 4/36 = 5/36'
  - '1/λ = 1,097×10⁷ × 5/36 = 1,524×10⁶ m⁻¹'
  - 'λ = 1/(1,524×10⁶) = 6,56×10⁻⁷ m = 656 nm'
explanation: 'Dies ist die Hα-Linie (rot) der Balmer-Serie – die stärkste sichtbare Linie im Wasserstoffspektrum.'
---

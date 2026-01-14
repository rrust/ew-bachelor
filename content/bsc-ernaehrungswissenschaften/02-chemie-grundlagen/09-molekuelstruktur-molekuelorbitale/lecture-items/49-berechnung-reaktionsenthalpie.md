---
type: 'calculation'
question: 'Berechne die Reaktionsenthalpie für H₂ + Cl₂ → 2 HCl'
setup: |
  Gegeben sind die Bindungsenergien:
  - H-H: 436 kJ/mol
  - Cl-Cl: 242 kJ/mol
  - H-Cl: 432 kJ/mol

  Berechne ΔH = Σ BE(gebrochen) - Σ BE(gebildet)
correctAnswer: -186
unit: 'kJ/mol'
tolerance: 1
solution: |
  **Schritt 1: Gebrochene Bindungen (Edukte)**
  - 1× H-H: 436 kJ
  - 1× Cl-Cl: 242 kJ
  - Summe: 678 kJ (positiv, Energie wird aufgenommen)

  **Schritt 2: Gebildete Bindungen (Produkte)**
  - 2× H-Cl: 2 × 432 = 864 kJ (negativ, Energie wird freigesetzt)

  **Schritt 3: Reaktionsenthalpie**
  ΔH = 678 - 864 = **-186 kJ/mol**

  Die Reaktion ist exotherm.
---

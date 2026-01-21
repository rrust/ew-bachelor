---
type: 'calculation'
question: 'Wie viel Energie (in kJ) wird benötigt, um 100 g Eis von 0°C vollständig in Dampf von 100°C umzuwandeln?'
hint: 'Drei Schritte berechnen: 1) Schmelzen des Eises, 2) Erwärmen des Wassers, 3) Verdampfen des Wassers. Gegeben: ΔH_schmelz = 334 J/g, c_Wasser = 4.18 J/(g·K), ΔH_vap = 2260 J/g'
correctAnswer: 301.2
unit: 'kJ'
tolerance: 2
solution: |
  **Schritt 1: Schmelzen (bei 0°C)**
  q₁ = m × ΔH_schmelz = 100 g × 334 J/g = 33.400 J

  **Schritt 2: Erwärmen (0°C → 100°C)**
  q₂ = m × c × ΔT = 100 g × 4.18 J/(g·K) × 100 K = 41.800 J

  **Schritt 3: Verdampfen (bei 100°C)**
  q₃ = m × ΔH_vap = 100 g × 2.260 J/g = 226.000 J

  **Gesamt:**
  Q = q₁ + q₂ + q₃ = 33.400 + 41.800 + 226.000 = 301.200 J = **301.2 kJ**
---

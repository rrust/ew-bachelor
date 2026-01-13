---
type: 'calculation'
topic: 'Kalorimetrie (Experimentelle Messung)'
question: |
  Ein 1,50 g Stück eines unbekannten Kohlenwasserstoffs wird in einem Bombenkalorimeter verbrannt. Die Temperatur steigt von 22,00 °C auf 26,50 °C.
  
  **Gegeben:**
  - Masse Wasser: 2000 g
  - Wärmekapazität der Bombe: $C_{\text{Bombe}} = 1500$ J/K
  - $c_{\text{Wasser}} = 4,184$ J/(g·K)
  - Molare Masse des Stoffes: 44 g/mol
  
  Berechne die molare Verbrennungsenthalpie in kJ/mol.
correctAnswer: '-1300'
tolerance: 20
unit: 'kJ/mol'
hint: 'Berechne erst q_gesamt, dann teile durch die Stoffmenge n = m/M.'
steps:
  - '**ΔT berechnen:** $\Delta T = 26,50 - 22,00 = 4,50$ K'
  - '**q_Wasser:** $q_W = 2000 \cdot 4,184 \cdot 4,50 = 37.656$ J'
  - '**q_Bombe:** $q_B = 1500 \cdot 4,50 = 6.750$ J'
  - '**q_Gesamt:** $q = 37.656 + 6.750 = 44.406$ J = 44,4 kJ'
  - '**Stoffmenge:** $n = 1,50 \text{ g} \div 44 \text{ g/mol} = 0,0341$ mol'
  - '**Molare Enthalpie:** $\Delta H_m = -44,4 \text{ kJ} \div 0,0341 \text{ mol} = -1302$ kJ/mol'
explanation: 'Der Stoff mit M = 44 g/mol könnte Propan (C₃H₈) oder CO₂ sein. Der berechnete Wert von etwa -1300 kJ/mol ist niedriger als typische Kohlenwasserstoffe - es könnte ein sauerstoffhaltiger Stoff wie Acetaldehyd sein.'
---

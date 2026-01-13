---
type: 'calculation'
topic: 'Energie bei Phasenübergängen'
question: |
  Berechne die Gesamtenergie (in kJ), die benötigt wird, um 100 g Eis von -20°C in Wasserdampf von 120°C umzuwandeln.
  
  **Gegeben:**
  - $c_{\text{Eis}} = 2,03$ J/(g·K)
  - $c_{\text{Wasser}} = 4,184$ J/(g·K)
  - $c_{\text{Dampf}} = 1,99$ J/(g·K)
  - Schmelzwärme: $L_{\text{Schmelz}} = 333$ J/g
  - Verdampfungswärme: $L_{\text{Verdampf}} = 2260$ J/g
correctAnswer: '309'
tolerance: 2
unit: 'kJ'
hint: 'Teile den Prozess in 5 Schritte: Eis erwärmen, schmelzen, Wasser erwärmen, verdampfen, Dampf erwärmen.'
steps:
  - '**Schritt 1:** Eis erwärmen (-20°C → 0°C): $q_1 = 100 \cdot 2,03 \cdot 20 = 4.060$ J'
  - '**Schritt 2:** Eis schmelzen (0°C): $q_2 = 100 \cdot 333 = 33.300$ J'
  - '**Schritt 3:** Wasser erwärmen (0°C → 100°C): $q_3 = 100 \cdot 4,184 \cdot 100 = 41.840$ J'
  - '**Schritt 4:** Wasser verdampfen (100°C): $q_4 = 100 \cdot 2260 = 226.000$ J'
  - '**Schritt 5:** Dampf erwärmen (100°C → 120°C): $q_5 = 100 \cdot 1,99 \cdot 20 = 3.980$ J'
  - '**Gesamt:** $q = 4.060 + 33.300 + 41.840 + 226.000 + 3.980 = 309.180$ J $= 309,2$ kJ'
explanation: 'Diese 5-Stufen-Rechnung ist typisch für Heizkurven-Aufgaben. Beachte: Das Verdampfen macht allein 73% der Gesamtenergie aus!'
---

---
type: 'practice-exercise'
topic: 'Satz von Hess und Standard-Bildungsenthalpien'
title: 'Gleichungen kombinieren nach Hess'
scenario: |
  Berechne die Bildungsenthalpie von Methan ($\text{CH}_4$) mit dem Satz von Hess.
  
  **Zielreaktion:**
  $$\text{C}(s) + 2\text{H}_2(g) \rightarrow \text{CH}_4(g) \quad \Delta_f H° = ?$$
  
  **Gegeben sind folgende Reaktionen:**
  1. $\text{C}(s) + \text{O}_2(g) \rightarrow \text{CO}_2(g) \quad \Delta H = -393,5$ kJ
  2. $2\text{H}_2(g) + \text{O}_2(g) \rightarrow 2\text{H}_2\text{O}(l) \quad \Delta H = -571,6$ kJ
  3. $\text{CH}_4(g) + 2\text{O}_2(g) \rightarrow \text{CO}_2(g) + 2\text{H}_2\text{O}(l) \quad \Delta H = -890,4$ kJ
tasks:
  - task: 'Welche Reaktionen musst du kombinieren, um die Zielreaktion zu erhalten? (Hinweis: Eine muss umgekehrt werden!)'
    solution: 'Reaktion 1 verwenden (liefert C links), Reaktion 2 verwenden (liefert 2H₂ links), Reaktion 3 umkehren (liefert CH₄ rechts).'
  - task: 'Was passiert mit ΔH, wenn du Reaktion 3 umkehrst?'
    solution: 'Das Vorzeichen wechselt: $\Delta H_3 = +890,4$ kJ (statt -890,4 kJ)'
  - task: 'Berechne die Bildungsenthalpie von Methan.'
    solution: '$\Delta_f H° = (-393,5) + (-571,6) + (+890,4) = -74,7$ kJ/mol'
  - task: 'Überprüfe dein Ergebnis: Stimmt es mit dem Tabellenwert (-74,8 kJ/mol) überein?'
    solution: 'Ja, die kleine Differenz (0,1 kJ) kommt von Rundungen in den Ausgangsdaten.'
hint: 'Beim Umkehren einer Reaktion wechselt das Vorzeichen von ΔH! Die Reaktanten werden zu Produkten und umgekehrt.'
successMessage: 'Hervorragend! Du kannst den Satz von Hess anwenden, um unbekannte Enthalpien zu berechnen.'
---

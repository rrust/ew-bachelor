---
type: 'practice-exercise'
topic: 'Anwendung Ernährungswissenschaft'
title: 'Schokoriegel und Treppensteigen'
scenario: |
  Ein Schokoriegel enthält "250 Kalorien" (gemeint sind kcal). Du fragst dich, wie viel körperliche Aktivität nötig ist, um diese Energie zu verbrauchen.
  
  **Gegeben:**
  - Energiegehalt: 250 kcal
  - Leistung beim Treppensteigen: ca. 400 W (= 400 J/s)
  - Umrechnung: 1 kcal = 4,184 kJ
tasks:
  - task: 'Rechne 250 kcal in Joule um.'
    solution: '$250 \text{ kcal} = 250 \cdot 1000 \text{ cal} = 250.000 \text{ cal}$. In Joule: $250.000 \cdot 4,184 = 1.046.000 \text{ J} = 1,046 \text{ MJ}$'
  - task: 'Berechne die Zeit, die du bei 400 W Leistung Treppen steigen müsstest.'
    solution: '$P = \frac{E}{t} \Rightarrow t = \frac{E}{P} = \frac{1.046.000 \text{ J}}{400 \text{ J/s}} = 2615 \text{ s}$'
  - task: 'Rechne die Zeit in Minuten um.'
    solution: '$\frac{2615 \text{ s}}{60 \text{ s/min}} = 43,6$ Minuten'
  - task: 'Warum ist diese Rechnung in der Praxis nur eine Schätzung?'
    solution: 'Der Körper wandelt nicht 100% der Nahrungsenergie in Bewegung um. Der Wirkungsgrad des menschlichen Körpers liegt bei etwa 20-25%. Außerdem verbraucht man auch in Ruhe Energie (Grundumsatz).'
hint: 'Nutze die Beziehung Leistung = Energie / Zeit.'
successMessage: 'Toll! Du kannst Energieangaben in praktische Zusammenhänge übertragen.'
---

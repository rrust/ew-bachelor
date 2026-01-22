# Säure-Base-Gleichgewichte und Pufferlösungen

**Quelle:** Kotz_Treichel_Townsend_Chapter_18.pdf
**Original-PDF:** [Vom Nutzer bereitgestellt]
**Thema:** Chemische Gleichgewichte, Puffer, Titrationen

---

## Kapitel 1: Einführung und der "Common Ion Effect"

### 1.1 Der gemeinsame Ionen-Effekt (Common Ion Effect)

Dieses Kapitel behandelt die Auswirkungen der Zugabe von Ionen, die bereits in einer Gleichgewichtsreaktion vorhanden sind. Dies ist eine direkte Anwendung des **Prinzips von Le Chatelier**.

Betrachten wir eine schwache Base, Ammoniak ($NH_3$), im Gleichgewicht mit Wasser:

$$NH_3(aq) + H_2O(l) \rightleftharpoons NH_4^+(aq) + OH^-(aq)$$

Wenn wir zu dieser Lösung ein Salz geben, das eines der beteiligten Ionen enthält (z.B. Ammoniumchlorid $NH_4Cl$), fügen wir sogenannte "gemeinsame Ionen" ($NH_4^+$) hinzu.

**Auswirkung nach Le Chatelier:**
Das System versucht, dem Zwang (Erhöhung der Konzentration von $NH_4^+$) auszuweichen.
1. Die Reaktion verschiebt sich nach **links** (in Richtung der Edukte).
2. Dabei werden $OH^-$-Ionen verbraucht.
3. Die Konzentration von $OH^-$ sinkt.
4. Der **pH-Wert sinkt** (wird saurer/weniger basisch) im Vergleich zur reinen Ammoniaklösung.

### 1.2 Berechnung des pH-Werts beim Ionen-Effekt

Um den Effekt quantitativ zu erfassen, vergleichen wir zwei Szenarien anhand des Beispiels aus den Folien:

**Szenario A: Reine Lösung** (0,25 M $NH_3$)
Hier gilt für die Basenkonstante $K_b$:
$$K_b = \frac{[NH_4^+][OH^-]}{[NH_3]} = 1,8 \times 10^{-5}$$
Durch die Näherung $x \ll 0,25$ ergibt sich:
$$[OH^-] = \sqrt{K_b \cdot 0,25} = 0,0021\, M$$
araus folgt ein $pOH = 2,67$ und ein **pH = 11,33**.

**Szenario B: Mischung** (0,25 M $NH_3$ + 0,10 M $NH_4Cl$)
Hier ist die Anfangskonzentration von $NH_4^+$ nicht 0, sondern 0,10 M.
Gleichung:
$$1,8 \times 10^{-5} = \frac{(0,10 + x)(x)}{0,25 - x}$$
Da $x$ sehr klein ist, können wir vereinfachen zu:
$$x = [OH^-] = 1,8 \times 10^{-5} \cdot \frac{0,25}{0,10} = 4,5 \times 10^{-5}\, M$$
Das ergibt einen $pOH = 4,35$ und einen **pH = 9,65**.

**Ergebnis:** Der pH-Wert fällt drastisch von 11,33 auf 9,65 durch die Zugabe des Salzes.

---

### ✅ Selbsttest: Kapitel 1

<!-- ÜBUNGSFRAGEN: Einfaches Niveau für Trainingsmodus während der Vorlesung -->

**Frage 1.1** (Verständnis)
Was besagt der "Common Ion Effect" bei einer schwachen Säure, wenn man deren Salz zugibt?
- A) Das Gleichgewicht verschiebt sich zu den Produkten, der pH sinkt.
- B) Das Gleichgewicht verschiebt sich zu den Edukten, der Dissoziationsgrad sinkt. ✓
- C) Die Säurestärke ($K_s$) ändert sich.
- D) Es hat keinen Einfluss auf den pH-Wert.

> **Erklärung:** Nach Le Chatelier drängt die Zugabe des Produkt-Ions (vom Salz) die Dissoziation der Säure zurück (Verschiebung nach links).

**Frage 1.2** (Anwendung)
Gegeben ist das Gleichgewicht $HF + H_2O \rightleftharpoons H_3O^+ + F^-$. Was passiert bei Zugabe von Natriumfluorid (NaF)?
- A) Die Konzentration von $H_3O^+$ steigt.
- B) Der pH-Wert sinkt.
- C) Der pH-Wert steigt. ✓
- D) Die Menge an ungelöstem HF nimmt ab.

> **Erklärung:** NaF liefert $F^-$-Ionen. Das Gleichgewicht weicht nach links aus, verbraucht $H_3O^+$ und bildet mehr HF. Weniger $H_3O^+$ bedeutet einen höheren pH-Wert.

**Frage 1.3** (Berechnung)
Berechne $x$ im Term $\frac{(0,5+x)x}{0,5-x} = 10^{-5}$ unter der Annahme, dass $x$ vernachlässigbar klein ist.
> **Lösung:** $\frac{0,5 \cdot x}{0,5} = 10^{-5} \rightarrow x = 10^{-5}$

---

> 📺 **Video-Empfehlung:** "Le Chatelier Prinzip einfach erklärt"
> **Kanal:** Lehrerschmidt
> **URL:** https://www.youtube.com/watch?v=QpnZ5k6l7Cc
> **oEmbed-verifiziert:** ✓

---

## Kapitel 2: Pufferlösungen – Grundlagen

### 2.1 Was ist ein Puffer?

Eine Pufferlösung ist eine spezielle Anwendung des Ionen-Effekts. Ihre Hauptfunktion ist es, **pH-Änderungen zu widerstehen**, wenn Säuren oder Basen hinzugefügt werden.

**Zusammensetzung:**
Ein Puffer besteht immer aus zwei Komponenten:
1. Einer **schwachen Säure** (um hinzugefügte $OH^-$ zu neutralisieren).
2. Ihrer **konjugierten Base** (um hinzugefügte $H^+$ zu neutralisieren).

**Beispiele:**
- Essigsäure ($HOAc$) + Acetat ($OAc^-$)
- Dihydrogenphosphat ($H_2PO_4^-$) + Hydrogenphosphat ($HPO_4^{2-}$)
- Ammonium ($NH_4^+$) + Ammoniak ($NH_3$)

### 2.2 Funktionsweise eines Puffers ($HOAc / OAc^-$)

**Fall A: Zugabe einer starken Base ($OH^-$)**
Die schwache Säure im Puffer reagiert:
$$HOAc + OH^- \rightarrow OAc^- + H_2O$$
Die Gleichgewichtskonstante für diese Rückreaktion ist extrem groß ($1/K_b \approx 1,8 \times 10^9$). Die hinzugefügten $OH^-$ werden fast vollständig zu schwach basischem Acetat und Wasser umgewandelt. Der pH ändert sich kaum.

**Fall B: Zugabe einer starken Säure ($H^+$)**
Die konjugierte Base im Puffer reagiert:
$$OAc^- + H_3O^+ \rightarrow HOAc + H_2O$$
Auch hier ist die Konstante riesig ($1/K_s \approx 5,6 \times 10^4$). Die starken Protonen werden abgefangen und in schwache Essigsäure umgewandelt.

### 2.3 Die Henderson-Hasselbalch-Gleichung

Um den pH-Wert eines Puffers direkt zu berechnen, leiten wir aus dem Massenwirkungsgesetz ab:

$$[H_3O^+] = K_s \times \frac{[Säure]}{[konj. Base]}$$

Durch Logarithmieren (negativer dekadischer Logarithmus) erhalten wir die **Henderson-Hasselbalch-Gleichung**:

$$pH = pK_s - \log\left(\frac{[Säure]}{[konj. Base]}\right)$$

Oder oft gebräuchlicher (mit Umkehrung des Bruchs im Logarithmus):

$$pH = pK_s + \log\left(\frac{[konj. Base]}{[Säure]}\right)$$

**Wichtig:** Der pH-Wert wird primär durch den $pK_s$-Wert der Säure bestimmt und dann durch das Verhältnis der Konzentrationen feinjustiert.

---

### ✅ Selbsttest: Kapitel 2

**Frage 2.1** (Wissen)
Welche Kombination ergibt einen Puffer?
- A) HCl und NaCl
- B) $HNO_3$ und $NaNO_3$
- C) $CH_3COOH$ und $NaCH_3COO$ ✓
- D) NaOH und $H_2O$

> **Erklärung:** Puffer benötigen eine *schwache* Säure und ihre konjugierte Base. HCl und $HNO_3$ sind starke Säuren.

**Frage 2.2** (Anwendung)
Ein Puffer enthält 0,5 M Säure (HA) und 0,5 M Base ($A^-$). Der $pK_s$ der Säure ist 4,75. Wie hoch ist der pH?
- A) 2,35
- B) 4,75 ✓
- C) 9,25
- D) 7,00

> **Erklärung:** Wenn $[Base] = [Säure]$, ist der Bruch im Logarithmus 1. $\log(1) = 0$. Daher gilt $pH = pK_s$.

**Frage 2.3** (Verständnis)
Was passiert chemisch, wenn man HCl in einen Acetat-Puffer gibt?
- A) Das Acetat ($OAc^-$) reagiert mit den Protonen zu Essigsäure. ✓
- B) Die Essigsäure reagiert mit den Protonen.
- C) Das HCl dissoziiert nicht.

> **Erklärung:** Die konjugierte Base (Acetat) fängt die starken Protonen der HCl ab.

---

> 📺 **Video-Empfehlung:** "Pufferlösungen einfach erklärt"
> **Kanal:** Lehrerschmidt
> **URL:** https://www.youtube.com/watch?v=O91C12h_wUk
> **oEmbed-verifiziert:** ✓

---

## Kapitel 3: Pufferkapazität und Berechnungen bei Zugabe

### 3.1 Rechenstrategie: Die 2-Schritte-Methode

Wenn man eine starke Säure oder Base zu einem Puffer gibt, verändert sich der pH-Wert leicht. Die Berechnung erfolgt in zwei getrennten Schritten:

1. **Stöchiometrie (Vollständige Reaktion):**
    Die starke Zugabe reagiert *vollständig* mit dem Pufferpartner. Wir berechnen die neuen Molmengen (nicht Konzentrationen!) in einer Tabelle (Vorher / Änderung / Nachher).
    * Beispiel: $H_3O^+ + OAc^- \rightarrow HOAc + H_2O$
    * Das $OAc^-$ nimmt ab, das $HOAc$ nimmt zu.

2. **Gleichgewicht (Henderson-Hasselbalch):**
    Mit den *neuen* Konzentrationen (oder Molmengen, da das Volumen im Bruch kürzbar ist) berechnen wir den neuen pH-Wert.

### 3.2 Vergleich: Wasser vs. Puffer

Ein Beispiel aus den Folien verdeutlicht die Pufferwirkung (Zugabe von 1 mL 1,0 M HCl):

* **In 1,0 L reinem Wasser:**
    Der pH fällt von 7,00 auf **3,00**.
    (Änderung um 4 pH-Einheiten = Faktor 10.000 in der $H^+$-Konzentration!)

* **In 1,0 L Puffer ($HOAc/OAc^-$):**
    Der pH fällt von 4,68 auf **4,68**.
    (In den Folien: Rechnerisch ergibt sich oft nur eine Änderung in der zweiten oder dritten Nachkommastelle, z.B. 4,68 -> 4,67 oder gar keine sichtbare Änderung bei Rundung).

### 3.3 Beispielrechnung

Gegeben: 1,0 L Puffer mit 0,100 M $NH_3$ und 0,200 M $NH_4Cl$ ($pK_b = 4,74 \rightarrow pK_s = 9,26$).
Start-pH = 8,95.

Zugabe von **0,020 mol NaOH** (fest, keine Volumenänderung).

**Schritt 1 (Stöchiometrie):**
NaOH reagiert mit der Säure ($NH_4^+$):
$NH_4^+ + OH^- \rightarrow NH_3 + H_2O$

| Substanz | Vorher    | Änderung   | Nachher       |
| :------- | :-------- | :--------- | :------------ |
| $NH_4^+$ | 0,200 mol | -0,020 mol | **0,180 mol** |
| $NH_3$   | 0,100 mol | +0,020 mol | **0,120 mol** |
| $OH^-$   | 0,020 mol | -0,020 mol | **0**         |

**Schritt 2 (Henderson-Hasselbalch):**
$$pH = 9,26 + \log\left(\frac{0,120}{0,180}\right)$$
$$pH = 9,26 + (-0,176) = 9,08$$

$\Delta pH = 9,08 - 8,95 = +0,13$.
Der pH ist nur minimal gestiegen, obwohl eine starke Base zugegeben wurde.

---

### ✅ Selbsttest: Kapitel 3

**Frage 3.1** (Berechnung)
In einem Puffer liegen 0,5 mol HA und 0,5 mol $A^-$ vor. Es werden 0,1 mol NaOH zugegeben. Wie lauten die Mengen nach der Reaktion?
- A) 0,6 mol HA / 0,4 mol $A^-$
- B) 0,4 mol HA / 0,6 mol $A^-$ ✓
- C) 0,5 mol HA / 0,6 mol $A^-$

> **Erklärung:** NaOH (Base) reagiert mit HA (Säure). HA wird weniger (-0,1), $A^-$ wird mehr (+0,1).

**Frage 3.2** (Verständnis)
Warum ändert das Verdünnen einer Pufferlösung den pH-Wert nicht?
- A) Weil Wasser neutral ist.
- B) Weil das Verhältnis der Molzahlen von Säure und Base gleich bleibt. ✓
- C) Weil der $pK_s$-Wert sich anpasst.

> **Erklärung:** In der Henderson-Hasselbalch-Gleichung steht der Quotient $\frac{[Base]}{[Säure]}$. Da $c = n/V$ ist, kürzt sich das Volumen $V$ heraus. Es bleibt $n(Base)/n(Säure)$.

---

> 📺 **Video-Empfehlung:** "Puffergleichung (Henderson-Hasselbalch) | Chemie Tutorial"
> **Kanal:** StudyTiger - Physik & Chemie
> **URL:** https://www.youtube.com/watch?v=GEFtdoX00GN
> **oEmbed-verifiziert:** ✓

---

## Kapitel 4: Puffer-Design und Titrationen (Stark/Stark)

### 4.1 Herstellung eines Puffers

Um einen Puffer mit einem gewünschten pH-Wert herzustellen, wählt man:
1. Eine Säure mit einem **$pK_s$, der nahe am gewünschten pH** liegt ($pH \approx pK_s$).
2. Das Feintuning erfolgt über das Verhältnis von Säure zu Base.

**Beispiel:**
Gewünschter pH = 4,30.
Verfügbare Säuren:
- $HSO_4^-$ ($pK_s \approx 1,92$)
- $HOAc$ ($pK_s \approx 4,74$)
- $HCN$ ($pK_s \approx 9,40$)

$\rightarrow$ Beste Wahl: Essigsäure ($HOAc$), da 4,74 am nächsten an 4,30 ist.

### 4.2 Titration: Starke Säure + Starke Base

Bei der Titration von z.B. HCl mit NaOH beobachten wir folgenden Kurvenverlauf:
1. **Start:** Sehr niedriger pH (reine starke Säure).
2. **Vor Äquivalenzpunkt:** pH steigt sehr langsam (logarithmische Skala, aber noch viel $H^+$ übrig).
3. **Äquivalenzpunkt (ÄP):** pH springt schlagartig auf **7,00**. Hier liegen nur neutrale Ionen ($Na^+, Cl^-$) und Wasser vor.
4. **Nach ÄP:** pH wird durch überschüssiges NaOH bestimmt und nähert sich dem pH der Maßlösung an.

---

### ✅ Selbsttest: Kapitel 4

**Frage 4.1** (Anwendung)
Du sollst einen Puffer mit pH 9,0 herstellen. Welches System wählst du?
- A) Essigsäure ($pK_s = 4,75$)
- B) Ammonium ($pK_s = 9,25$) ✓
- C) Phosphorsäure ($pK_s = 2,1$)

> **Erklärung:** Der $pK_s$ von Ammonium liegt am nächsten bei 9,0.

**Frage 4.2** (Wissen)
Welchen pH-Wert hat die Lösung am Äquivalenzpunkt einer Titration von HCl mit KOH?
- A) pH < 7
- B) pH = 7 ✓
- C) pH > 7

> **Erklärung:** Es entsteht KCl (neutrales Salz) und Wasser. Starke Säure + Starke Base = Neutral.

---

> 📺 **Video-Empfehlung:** "Titration auswerten und berechnen"
> **Kanal:** Lehrerschmidt
> **URL:** https://www.youtube.com/watch?v=o_66o7CjHk0
> **oEmbed-verifiziert:** ✓

---

## Kapitel 5: Titration Schwache Säure + Starke Base

Dies ist der komplexeste Fall (z.B. Benzoesäure $HBz$ oder Essigsäure + NaOH). Die Kurve hat vier wichtige Bereiche:

### 5.1 Vier Phasen der Titration

1. **Startpunkt (nur schwache Säure):**
    Berechnung wie in Kapitel 17. pH > 1, aber < 7.
    $$[H^+] \approx \sqrt{K_s \cdot c_{Säure}}$$

2. **Puffer-Region (vor dem ÄP):**
    Es entsteht das Salz der schwachen Säure ($Bz^-$). Zusammen mit der restlichen Säure ($HBz$) bildet sich ein Puffer.
    $\rightarrow$ **Henderson-Hasselbalch anwenden!**

    **Spezialfall: Halb-Äquivalenzpunkt**
    Wenn genau die Hälfte der Säure neutralisiert ist, gilt $[HBz] = [Bz^-]$.
    Daraus folgt: **$pH = pK_s$**.

3. **Äquivalenzpunkt (ÄP):**
    Die gesamte Säure wurde zu ihrer konjugierten Base ($Bz^-$) umgesetzt.
    **Achtung:** Der pH ist hier **NICHT 7**, sondern **> 7 (basisch)**!
    Grund: Das entstandene Benzoat ($Bz^-$) ist eine schwache Base und reagiert mit Wasser:
    $$Bz^- + H_2O \rightleftharpoons HBz + OH^-$$
    Berechnung über $K_b$ und $[OH^-] = \sqrt{K_b \cdot c_{Salz}}$.

4. **Nach dem ÄP (Überschuss Base):**
    Die starke Base (NaOH) dominiert den pH-Wert komplett. Die schwache Hydrolyse des Salzes wird vernachlässigt.

### 5.2 Indikatoren

Indikatoren sind selbst schwache Säuren/Basen, deren protonierte Form ($HInd$) eine andere Farbe hat als die deprotonierte Form ($Ind^-$).
Sie werden so gewählt, dass ihr **Umschlagspunkt ($pK_{Ind}$)** im steilen Bereich der Titrationskurve (nahe dem Äquivalenzpunkt) liegt.

* Starke Säure/Base Titration (ÄP 7): Viele Indikatoren möglich.
* Schwache Säure/Starke Base (ÄP > 7): Phenolphthalein (umschlag 8-10) geeignet.

---

### ✅ Selbsttest: Kapitel 5

**Frage 5.1** (Verständnis)
Warum ist der Äquivalenzpunkt bei der Titration von Essigsäure mit NaOH basisch?
- A) Weil zu viel NaOH zugegeben wurde.
- B) Weil das entstandene Acetat-Ion mit Wasser reagiert ($OH^-$ bildet). ✓
- C) Weil Essigsäure eine starke Säure ist.

> **Erklärung:** Das Produkt (Acetat) ist eine korrespondierende Base und hydrolysiert im Wasser, wobei $OH^-$ entsteht.

**Frage 5.2** (Anwendung)
Bei einer Titration ist nach Zugabe von 10 mL NaOH der Halbäquivalenzpunkt erreicht. Der pH misst 4,20. Wie groß ist der $pK_s$ der Säure?
- A) 2,10
- B) 4,20 ✓
- C) 8,40

> **Erklärung:** Am Halbäquivalenzpunkt gilt $pH = pK_s$.

---

> 📺 **Video-Empfehlung:** "Indikatoren einfach erklärt"
> **Kanal:** Die Merkhilfe
> **URL:** https://www.youtube.com/watch?v=3k8i5L-b3G8
> **oEmbed-verifiziert:** ✓

---

# 📝 Prüfungsaufgaben (Universitätsniveau)

<!-- Diese Aufgaben sind für die Modul-Prüfung gedacht und deutlich anspruchsvoller als die Selbsttests -->

## Hinweise für Studierende

- Bearbeitungszeit: ca. 90 Minuten
- Hilfsmittel: Taschenrechner, Periodensystem
- Alle Rechenwege müssen nachvollziehbar dokumentiert werden.

---

### Aufgabe 1 (10 Punkte) - Pufferherstellung & Kapazität

Sie sollen 1,0 Liter eines Acetat-Puffers ($pK_s = 4,75$) mit einem pH-Wert von **5,05** herstellen. Zur Verfügung stehen 0,10 M Essigsäure-Lösung und festes Natriumacetat ($M_r = 82,03$ g/mol). Die Endkonzentration der Acetat-Ionen soll 0,20 M betragen.

**Fragen:**
a) Berechnen Sie die notwendige Masse an festem Natriumacetat. (2 Punkte)
b) Berechnen Sie die notwendige Konzentration der Essigsäure in der Mischung, um den pH 5,05 zu erreichen. (4 Punkte)
c) Erklären Sie qualitativ, wie sich der pH-Wert ändern würde, wenn Sie diesen Puffer mit 500 mL Wasser verdünnen. (4 Punkte)

<details>
<summary>Musterlösung anzeigen</summary>

**a) Masse Natriumacetat**
Gegeben: $V = 1,0 L$, $c(Ac^-) = 0,20 M$.
$n = c \cdot V = 0,20 \, mol$
$m = n \cdot M_r = 0,20 \, mol \cdot 82,03 \, g/mol = \mathbf{16,41 \, g}$

**b) Konzentration Essigsäure**
Henderson-Hasselbalch: $pH = pK_s + \log\left(\frac{[Base]}{[Säure]}\right)$
$5,05 = 4,75 + \log\left(\frac{0,20}{[HA]}\right)$
$0,30 = \log\left(\frac{0,20}{[HA]}\right)$
$10^{0,30} = 1,995 = \frac{0,20}{[HA]}$
$[HA] = \frac{0,20}{1,995} = \mathbf{0,10 \, M}$

**c) Verdünnung**
Der pH-Wert würde sich **nicht ändern**. In der Henderson-Hasselbalch-Gleichung steht das Verhältnis der Konzentrationen $\frac{[Base]}{[Säure]}$. Beim Verdünnen ändern sich beide Konzentrationen um denselben Faktor (Volumen kürzt sich im Bruch $n/V$ heraus). Das Verhältnis und damit der pH bleiben konstant.
</details>

---

### Aufgabe 2 (12 Punkte) - Titration einer schwachen Säure (Mehrstufig)

Sie titrieren 50,0 mL einer 0,10 M Benzoesäure-Lösung ($HBz$, $K_s = 6,3 \times 10^{-5}$) mit 0,10 M NaOH.

**Berechnen Sie den pH-Wert:**
a) Zu Beginn der Titration (0 mL NaOH). (4 Punkte)
b) Nach Zugabe von 25,0 mL NaOH. (4 Punkte)
c) Am Äquivalenzpunkt. (4 Punkte)

<details>
<summary>Musterlösung anzeigen</summary>

**a) Start (nur schwache Säure)**
$[H^+] = \sqrt{K_s \cdot c_0} = \sqrt{6,3 \cdot 10^{-5} \cdot 0,10}$
$[H^+] = 0,00251 \, M$
$pH = -\log(0,00251) = \mathbf{2,60}$

**b) Nach 25 mL NaOH (Puffer-Region)**
$n(HBz)_{start} = 0,050 L \cdot 0,10 M = 0,005 \, mol$
$n(OH^-)_{zug} = 0,025 L \cdot 0,10 M = 0,0025 \, mol$
Reaktion: $HBz$ reagiert zur Hälfte zu $Bz^-$.
Es verbleiben 0,0025 mol $HBz$, es entstehen 0,0025 mol $Bz^-$.
Dies ist der **Halbäquivalenzpunkt**!
$pH = pK_s = -\log(6,3 \times 10^{-5}) = \mathbf{4,20}$

**c) Am Äquivalenzpunkt**
Zugabe von 50 mL NaOH (da Konzentrationen gleich sind).
Gesamtvolumen = 50 mL + 50 mL = 100 mL = 0,10 L.
Gesamtstoffmenge $Bz^-$ = 0,005 mol.
$[Bz^-] = \frac{0,005 \, mol}{0,10 \, L} = 0,05 \, M$.
$Bz^-$ ist eine schwache Base. Wir brauchen $K_b$.
$K_b = \frac{K_w}{K_s} = \frac{10^{-14}}{6,3 \cdot 10^{-5}} = 1,59 \cdot 10^{-10}$
$[OH^-] = \sqrt{K_b \cdot [Bz^-]} = \sqrt{1,59 \cdot 10^{-10} \cdot 0,05} = 2,82 \cdot 10^{-6} M$
$pOH = 5,55$
$pH = 14 - 5,55 = \mathbf{8,45}$
</details>

---

### Aufgabe 3 (8 Punkte) - Konzeptverständnis Multiple Choice

Welche der folgenden Aussagen sind korrekt? (Mehrere Antworten möglich, Punkteabzug für falsche Antworten).

- [ ] A) Ein Puffer aus $HCN/CN^-$ ($pK_s = 9,4$) eignet sich hervorragend, um einen pH von 5,0 zu stabilisieren.
- [ ] B) Bei der Titration einer schwachen Säure mit einer starken Base ist der pH am Äquivalenzpunkt immer genau 7.
- [ ] C) Die Pufferkapazität ist am höchsten, wenn $pH = pK_s$ gilt.
- [ ] D) Der "Common Ion Effect" führt dazu, dass die Löslichkeit eines Salzes sinkt oder der Dissoziationsgrad einer schwachen Säure abnimmt.
- [ ] E) Wenn man zu einem Puffer starke Säure gibt, reagiert primär die Säurekomponente des Puffers.

<details>
<summary>Musterlösung anzeigen</summary>

**Richtig sind: C und D**

- **A ist falsch:** Ein Puffer wirkt nur gut im Bereich $pK_s \pm 1$. 9,4 ist zu weit weg von 5,0.
- **B ist falsch:** Das entstehende Salz hydrolysiert basisch (pH > 7).
- **C ist richtig:** Das Verhältnis 1:1 bietet mathematisch und chemisch den größten Widerstand in beide Richtungen.
- **D ist richtig:** Definition des Ionen-Effekts (Le Chatelier).
- **E ist falsch:** Wenn man Säure ($H^+$) zugibt, reagiert die **Basekomponente** des Puffers, um die Protonen abzufangen.
</details>

---

### Aufgabe 4 (15 Punkte) - Transferaufgabe: Blutpuffer

Das wichtigste Puffersystem im menschlichen Blut ist das Kohlensäure-Bicarbonat-System:
$$CO_2(aq) + H_2O \rightleftharpoons H_2CO_3 \rightleftharpoons H^+ + HCO_3^-$$
Für dieses System gilt bei Körpertemperatur ein $pK_s$ von 6,1 (für die erste Stufe kombiniert). Der pH-Wert des Blutes liegt bei 7,4.

**Fragen:**
a) Berechnen Sie das Verhältnis von $[HCO_3^-]$ zu $[CO_2]$ im Blut. (5 Punkte)
b) Beim Hyperventilieren atmet eine Person sehr schnell viel $CO_2$ ab. In welche Richtung verschiebt sich der pH-Wert? Begründen Sie mit Le Chatelier und der Henderson-Hasselbalch-Gleichung. (5 Punkte)
c) Warum ist dieses System trotz des großen Abstands zwischen $pK_s$ (6,1) und pH (7,4) so effektiv? (Hinweis: Denken Sie daran, dass der Körper ein "offenes System" ist). (5 Punkte)

<details>
<summary>Musterlösung anzeigen</summary>

**a) Verhältnis**
$pH = pK_s + \log\left(\frac{[HCO_3^-]}{[CO_2]}\right)$
$7,4 = 6,1 + \log(Verhältnis)$
$1,3 = \log(Verhältnis)$
Verhältnis = $10^{1,3} \approx \mathbf{20:1}$

**b) Hyperventilation**
Abatmen von $CO_2$ bedeutet Senkung der Konzentration von $[CO_2]$ (Säurekomponente).
- **Le Chatelier:** Wenn Edukt ($CO_2$) entfernt wird, läuft die Reaktion nach links ($H^+$ wird verbraucht) $\rightarrow$ pH steigt.
- **Mathematisch:** Im Term $\frac{[HCO_3^-]}{[CO_2]}$ wird der Nenner kleiner. Der Bruch wird größer. Der Logarithmus wird größer. $\rightarrow$ pH steigt.
Dies führt zur *respiratorischen Alkalose*.

**c) Offenes System**
Obwohl der $pK_s$ weit entfernt liegt, funktioniert der Puffer exzellent, weil der Körper die Konzentration von $CO_2$ über die **Lunge** (Atemfrequenz) aktiv und schnell regulieren kann. Es ist kein statisches System im Becherglas, sondern ein dynamisches Fließgleichgewicht.
</details>

---

### Aufgabe 5 (10 Punkte) - Grafische Analyse

Betrachten Sie die Titrationskurve einer zweiprotonigen Säure (z.B. $H_2C_2O_4$) mit NaOH.

a) Skizzieren Sie den qualitativen Verlauf. Wie viele Äquivalenzpunkte erwarten Sie? (4 Punkte)
b) Woran erkennen Sie in der Kurve die $pK_s$-Werte der Säurestufen? (3 Punkte)
c) Welche Spezies dominiert am ersten Halbäquivalenzpunkt? (3 Punkte)

<details>
<summary>Musterlösung anzeigen</summary>

**a) Skizze**
Die Kurve zeigt **zwei** Stufen (Wellen). Sie hat **zwei** Äquivalenzpunkte, da zwei Protonen nacheinander abgespalten werden.

**b) pKs-Werte**
Die $pK_s$-Werte entsprechen den pH-Werten an den jeweiligen **Halbäquivalenzpunkten** (in der Mitte der flachen Pufferbereiche).
- $pK_{s1}$ beim 1. Halbäquivalenzpunkt.
- $pK_{s2}$ beim 2. Halbäquivalenzpunkt (Mitte zwischen 1. und 2. ÄP).

**c) Spezies**
Am 1. Halbäquivalenzpunkt liegen die Säure ($H_2C_2O_4$) und ihre korrespondierende Base der ersten Stufe ($HC_2O_4^-$) im Verhältnis 1:1 vor. Keine Spezies "dominiert" im Sinne von "ist allein da", aber diese beiden sind die Hauptkomponenten.
</details>

---

## Prüfungsstatistik

| Aufgabentyp                | Punkte | Thema                         |
| -------------------------- | ------ | ----------------------------- |
| Berechnung (Stöchiometrie) | 10     | Pufferherstellung             |
| Berechnung (Titration)     | 12     | pH-Verlauf Schwache Säure     |
| Multiple Choice            | 8      | Theorie & Verständnis         |
| Transfer                   | 15     | Physiologischer Puffer (Blut) |
| Analyse                    | 10     | Mehrprotonige Säuren          |
| **Gesamt**                 | **55** |                               |

**Notenschlüssel:**
- < 27 Punkte: Nicht genügend (5)
- 27 - 35 Punkte: Genügend (4)
- 36 - 43 Punkte: Befriedigend (3)
- 44 - 50 Punkte: Gut (2)
- > 50 Punkte: Sehr gut (1)

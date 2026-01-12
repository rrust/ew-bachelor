# Kapitel 6: Die Elektronenstruktur der Atome

**Quelle:** `Kapitel6.pdf`
**Thema:** Atomphysik, Quantenmechanik, Elektronenkonfiguration und Periodensystem

---

## Kapitel 1: Elektromagnetische Strahlung

### 1.1 Welleneigenschaften von Licht

Um die Struktur von Atomen zu verstehen, müssen wir zunächst die Natur des Lichts und der elektromagnetischen Strahlung begreifen. Die meisten subatomaren Teilchen verhalten sich ebenfalls wie Teilchen, gehorchen aber gleichzeitig der Physik der Wellen (**Welle-Teilchen-Dualismus**).

Licht breitet sich in Wellen aus. Diese Wellen werden durch drei Hauptgrößen charakterisiert:

1. **Wellenlänge ($\lambda$, Lambda):** Der Abstand zwischen zwei aufeinanderfolgenden Wellenbergen (oder Wellentälern).
    * Einheit: Meter (m), Nanometer (nm).
2. **Frequenz ($\nu$, Ny):** Die Anzahl der Wellenzyklen, die einen bestimmten Punkt pro Sekunde passieren.
    * Einheit: Hertz (Hz) oder $s^{-1}$ (cycles per second).
3. **Amplitude:** Die Höhe der Welle (bezogen auf die Nulllinie), welche die Intensität (Helligkeit) bestimmt.

**Zusammenhang zwischen Wellenlänge und Frequenz:**
Alle elektromagnetischen Strahlungen bewegen sich im Vakuum mit derselben Geschwindigkeit – der Lichtgeschwindigkeit ($c$).

$$c = \lambda \cdot \nu$$

**Konstanten:**
* $c = 2,998 \times 10^8 \text{ m/s}$ (Lichtgeschwindigkeit)

Es besteht eine **inverse Proportionalität**:
* **Lange Wellenlänge** $\rightarrow$ Niedrige Frequenz
* **Kurze Wellenlänge** $\rightarrow$ Hohe Frequenz

### 1.2 Das elektromagnetische Spektrum

Das sichtbare Licht ist nur ein sehr kleiner Teil des gesamten elektromagnetischen Spektrums.

* **Sichtbares Spektrum:** ca. 400 nm (violett) bis 700 nm (rot).
* **Energiereiche Strahlung (kurze $\lambda$, hohe $\nu$):** Gammastrahlen, Röntgenstrahlen, UV-Licht.
* **Energiearme Strahlung (lange $\lambda$, niedrige $\nu$):** Infrarot (IR), Mikrowellen, Radiowellen.

**Beispielrechnung aus den Unterlagen:**
Rotes Licht hat eine Wellenlänge von $\lambda = 700 \text{ nm}$. Berechnen Sie die Frequenz.

1. Umrechnung in Meter: $700 \text{ nm} = 700 \times 10^{-9} \text{ m} = 7,00 \times 10^{-7} \text{ m}$
2. Formel umstellen: $\nu = \frac{c}{\lambda}$
3. Einsetzen:
    $$\nu = \frac{3,00 \times 10^8 \text{ m/s}}{7,00 \times 10^{-7} \text{ m}} = 4,29 \times 10^{14} \text{ s}^{-1} \text{ (oder Hz)}$$

---

### ✅ Selbsttest: Kapitel 1

<!-- ÜBUNGSFRAGEN: Einfaches Niveau für Trainingsmodus während der Vorlesung -->

**Frage 1.1** (Verständnis)
Wenn die Wellenlänge einer elektromagnetischen Strahlung zunimmt, was passiert mit ihrer Frequenz (bei konstanter Lichtgeschwindigkeit)?
- A) Die Frequenz nimmt zu.
- B) Die Frequenz nimmt ab. ✓
- C) Die Frequenz bleibt gleich.
- D) Die Frequenz schwankt.

> **Erklärung:** Wellenlänge und Frequenz sind indirekt proportional ($c = \lambda \cdot \nu$). Wenn $\lambda$ steigt, muss $\nu$ sinken, damit das Produkt $c$ konstant bleibt.

**Frage 1.2** (Anwendung)
Welcher Bereich des elektromagnetischen Spektrums hat die höhere Energie?
- A) Radiowellen
- B) Infrarot
- C) Sichtbares Licht
- D) Ultraviolett (UV) ✓

> **Erklärung:** Hohe Energie korrespondiert mit hoher Frequenz und kurzer Wellenlänge. UV-Licht hat kürzere Wellenlängen als sichtbares Licht, IR oder Radiowellen.

**Frage 1.3** (Berechnung)
Ein Radiosender sendet auf einer Frequenz von $100 \text{ MHz}$ ($100 \times 10^6 \text{ s}^{-1}$). Wie groß ist die Wellenlänge? (Nutze $c = 3 \times 10^8 \text{ m/s}$)

> **Lösung:** $\lambda = c / \nu = (3 \times 10^8) / (1 \times 10^8) = 3 \text{ Meter}$.

---

> 📺 **Video-Empfehlung:** "Elektromagnetisches Spektrum einfach erklärt"
> **Kanal:** musstewissen Physik
> **URL:** https://www.youtube.com/watch?v=k1tC5W_Z9vQ
> **oEmbed-verifiziert:** ✓

---

## Kapitel 2: Quantisierung der Energie

### 2.1 Max Planck und Quanten

Die klassische Physik nahm an, dass Energie kontinuierlich ist. Max Planck (1858-1947) revolutionierte dieses Verständnis, indem er vorschlug, dass Energie nur in diskreten "Paketen" abgegeben oder aufgenommen werden kann. Diese Pakete nannte er **Quanten**.

Die Energie ($E$) eines Quants ist direkt proportional zur Frequenz ($\nu$) der Strahlung:

$$E = h \cdot \nu$$

**Variablen:**
* $h$ = Planck-Konstante = $6,626 \times 10^{-34} \text{ J}\cdot\text{s}$

Das bedeutet:
* Licht mit **kurzer Wellenlänge** (große $\nu$) hat eine **hohe Energie**.
* Licht mit **großer Wellenlänge** (kleine $\nu$) hat eine **niedrige Energie**.

### 2.2 Der Photoelektrische Effekt

Albert Einstein (1879-1955) nutzte Plancks Theorie, um den photoelektrischen Effekt zu erklären.
Beobachtung: Licht kann Elektronen aus einer Metalloberfläche herausschlagen, aber nur, wenn das Licht eine gewisse **Mindestenergie** (Frequenz) besitzt. Unterhalb dieser Schwelle passiert nichts, egal wie intensiv (hell) das Licht ist.

**Schlussfolgerung:** Licht besteht aus Teilchen, die **Photonen** genannt werden. Jedes Photon trägt ein Energiequant.

**Beispielrechnung (Energie von Photonen):**
Berechnen Sie die Energie von 1,00 Mol Photonen roten Lichts ($\lambda = 700 \text{ nm}$, $\nu = 4,29 \times 10^{14} \text{ s}^{-1}$).

1. Energie *eines* Photons:
    $$E_{Photon} = h \cdot \nu = (6,626 \times 10^{-34} \text{ J}\cdot\text{s})(4,29 \times 10^{14} \text{ s}^{-1}) = 2,85 \times 10^{-19} \text{ J}$$
2. Energie pro Mol (Multiplikation mit Avogadro-Konstante $N_A = 6,022 \times 10^{23}$):
    $$E_{Mol} = (2,85 \times 10^{-19} \text{ J}) \times (6,022 \times 10^{23} \text{ mol}^{-1}) = 171.627 \text{ J/mol} \approx 172 \text{ kJ/mol}$$

*Hinweis:* Diese Energie reicht aus, um chemische Bindungen zu brechen.

---

### ✅ Selbsttest: Kapitel 2

**Frage 2.1** (Wissen)
Wie nennt man die kleinste Energiemenge, die von einem Atom emittiert oder absorbiert werden kann?
- A) Proton
- B) Quant ✓
- C) Neutron
- D) Isotop

> **Erklärung:** Ein Quant ist die kleinstmögliche Energieeinheit (das "Paket"). Im Fall von Licht spricht man von Photonen.

**Frage 2.2** (Berechnung)
Berechne die Energie eines Photons mit der Frequenz $\nu = 2,0 \times 10^{15} \text{ s}^{-1}$. ($h \approx 6,63 \times 10^{-34} \text{ Js}$)
- A) $1,33 \times 10^{-18} \text{ J}$ ✓
- B) $3,31 \times 10^{-49} \text{ J}$
- C) $3,00 \times 10^{8} \text{ J}$

> **Erklärung:** $E = h \cdot \nu = 6,63 \times 10^{-34} \cdot 2,0 \times 10^{15} = 13,26 \times 10^{-19} = 1,326 \times 10^{-18} \text{ J}$.

**Frage 2.3** (Verständnis)
Was bewies der photoelektrische Effekt?
- A) Licht verhält sich wie eine Welle.
- B) Licht verhält sich wie Teilchen (Photonen). ✓
- C) Die Lichtgeschwindigkeit ist konstant.

> **Erklärung:** Einstein zeigte, dass Licht diskrete Energiepakete (Photonen) besitzt, die Elektronen aus Metall herausschlagen können.

---

> 📺 **Video-Empfehlung:** "Quantenphysik: Das Plancksche Wirkungsquantum"
> **Kanal:** musstewissen Physik
> **URL:** https://www.youtube.com/watch?v=QuqJMStV5hY
> **oEmbed-verifiziert:** ✓

---

## Kapitel 3: Das Bohr'sche Atommodell

### 3.1 Linienspektren

Wenn weißes Licht durch ein Prisma fällt, entsteht ein kontinuierliches Spektrum (Regenbogen). Wenn jedoch Hochspannung an ein Gas in einer Röhre angelegt wird (z.B. Wasserstoff oder Neon), emittiert dieses Gas Licht.
Wird dieses Licht durch ein Prisma gesendet, sieht man nur einzelne, scharfe farbige Linien. Dies nennt man **Linienemissionsspektrum**.

* **Beispiel "Elektrische Essiggurke":** Eine elektrisch erregte Gewürzgurke leuchtet gelb/orange. Dies liegt an den Natrium-Ionen ($Na^+$) im Salzwasser, die ein charakteristisches gelbes Licht emittieren.
* **Balmer-Serie:** Die sichtbaren Linien im Wasserstoffspektrum.

### 3.2 Bohrs Postulate

Niels Bohr (1885-1962) erklärte die Linienspektren mit einem neuen Modell für das Wasserstoffatom:
1. Elektronen bewegen sich auf bestimmten, festen Kreisbahnen um den Kern.
2. Jede Bahn entspricht einem **quantisierten Energieniveau** ($n = 1, 2, 3, \dots$).
3. Energie wird nur absorbiert oder emittiert, wenn ein Elektron von einer Bahn auf eine andere "springt".

**Energiesprung ($\Delta E$):**
Das Elektron absorbiert Energie, um auf eine höhere Schale zu kommen (angeregter Zustand), und emittiert Energie (als Photon/Licht), wenn es zurückfällt.

$$\Delta E = E_{endgültig} - E_{initial}$$

Für das Wasserstoffatom gilt nach der Rydberg-Gleichung:
$$\Delta E = -Rhc \left( \frac{1}{n_{end}^2} - \frac{1}{n_{init}^2} \right)$$

* $Rhc$ (Rydberg-Konstante in Energieeinheiten) $\approx 2,18 \times 10^{-18} \text{ J}$ (oder $1312 \text{ kJ/mol}$).

**Beispielrechnung (Exotherm):**
Ein Elektron springt von $n=2$ (höhere Energie) auf $n=1$ (niedrigere Energie).
$$\Delta E = -C \left[ \frac{1}{1^2} - \frac{1}{2^2} \right] = -C \left[ 1 - 0,25 \right] = -0,75 C$$
Das negative Vorzeichen zeigt an, dass Energie abgegeben wird (**Exotherm**). Die emittierte Energie entspricht einem Photon mit $\lambda = 121,6 \text{ nm}$ (UV-Bereich).

---

### ✅ Selbsttest: Kapitel 3

**Frage 3.1** (Verständnis)
Warum zeigen Atome Linienspektren und kein kontinuierliches Spektrum?
- A) Weil die Elektronen sich frei bewegen.
- B) Weil die Energieniveaus im Atom quantisiert sind. ✓
- C) Weil das Prisma defekt ist.

> **Erklärung:** Elektronen können nur bestimmte Energieniveaus annehmen. Beim Wechsel zwischen diesen Niveaus wird Licht spezifischer Wellenlängen emittiert.

**Frage 3.2** (Anwendung)
Was passiert, wenn ein Elektron von $n=1$ auf $n=3$ wechselt?
- A) Energie wird emittiert (Licht wird ausgesendet).
- B) Energie wird absorbiert. ✓
- C) Das Elektron verlässt das Atom.

> **Erklärung:** Um vom niedrigen Energieniveau ($n=1$, nah am Kern) auf ein höheres ($n=3$, weiter weg) zu kommen, muss Energie zugeführt (absorbiert) werden.

**Frage 3.3** (Wissen)
Für welches Atom funktionierte das Bohr'sche Modell perfekt?
- A) Helium
- B) Wasserstoff ✓
- C) Alle Atome
- D) Eisen

> **Erklärung:** Das Bohr-Modell konnte mathematisch exakt nur das Wasserstoffatom (1-Elektron-System) erklären.

---

> 📺 **Video-Empfehlung:** "Bohrsches Atommodell einfach erklärt"
> **Kanal:** Lehrerschmidt
> **URL:** https://www.youtube.com/watch?v=d_k8yVz4eQM
> **oEmbed-verifiziert:** ✓

---

## Kapitel 4: Wellenmechanik und Unschärfe

Bohrs Modell scheiterte bei Atomen mit mehr als einem Elektron. Die Lösung brachte die **Quantenmechanik** (Wellenmechanik).

### 4.1 De Broglie und Materiewellen

Louis de Broglie (1924) schlug vor, dass sich alle bewegten Objekte wie Wellen verhalten.
Wellenlänge eines Teilchens:

$$\lambda = \frac{h}{m \cdot v}$$
($m$ = Masse, $v$ = Geschwindigkeit)

* Bei Makro-Objekten (z.B. Baseball) ist $\lambda$ winzig und vernachlässigbar ($10^{-32} \text{ cm}$).
* Bei Mikro-Objekten (Elektronen) ist $\lambda$ relevant ($\approx \text{nm}$ Bereich) und messbar.

### 4.2 Heisenberg'sche Unschärferelation

Werner Heisenberg zeigte, dass es unmöglich ist, gleichzeitig den **Ort** und den **Impuls** ($m \cdot v$) eines Elektrons exakt zu bestimmen.
Wir können nicht mehr von festen "Bahnen" sprechen (wie bei Bohr), sondern nur von **Wahrscheinlichkeiten**.

### 4.3 Schrödinger und Orbitale

Erwin Schrödinger entwickelte die Wellengleichung. Die Lösungen dieser Gleichungen heißen **Wellenfunktionen ($\Psi$)**.
* **$\Psi$ (Psi):** Beschreibt den Energiezustand.
* **$\Psi^2$:** Ist proportional zur **Aufenthaltswahrscheinlichkeit**. Es beschreibt den Bereich, wo das Elektron zu 90% zu finden ist.
* Diesen Aufenthaltsraum nennt man **Orbital**.

---

### ✅ Selbsttest: Kapitel 4

**Frage 4.1** (Verständnis)
Was besagt die Heisenberg'sche Unschärferelation?
- A) Man kann nie wissen, welches Element man vor sich hat.
- B) Ort und Impuls eines Elektrons können nicht gleichzeitig exakt bestimmt werden. ✓
- C) Elektronen bewegen sich in exakten Kreisbahnen.

> **Erklärung:** Dies ist das fundamentale Prinzip der Quantenmechanik, das das Bohr'sche Bahnenmodell ablöste.

**Frage 4.2** (Definition)
Was beschreibt ein Orbital?
- A) Eine feste Kreisbahn um den Kern.
- B) Einen Raum, in dem sich ein Elektron mit hoher Wahrscheinlichkeit aufhält. ✓
- C) Die exakte Position des Protons.

> **Erklärung:** Orbitale sind Wahrscheinlichkeitswolken, keine festen Bahnen.

**Frage 4.3** (Anwendung)
Warum bemerken wir die Welleneigenschaften eines fliegenden Fußballs nicht?
- A) Weil er zu langsam ist.
- B) Weil seine Masse zu groß ist, was zu einer extrem kleinen Wellenlänge führt. ✓
- C) Weil er nicht geladen ist.

> **Erklärung:** Nach $\lambda = h/(mv)$ sorgt eine große Masse $m$ für eine winzige Wellenlänge $\lambda$.

---

> 📺 **Video-Empfehlung:** "Heisenbergsche Unschärferelation einfach erklärt"
> **Kanal:** musstewissen Physik
> **URL:** https://www.youtube.com/watch?v=eCj0Kox_T0o
> **oEmbed-verifiziert:** ✓

---

## Kapitel 5: Quantenzahlen und Orbitale

Jedes Orbital (und jedes Elektron darin) wird durch Quantenzahlen beschrieben.

### 5.1 Die Quantenzahlen

1. **Hauptquantenzahl ($n$):** Bestimmt die **Schale** (Energie und Größe).
    * Werte: $1, 2, 3, \dots$ (entspricht der Periode im PSE, wo die Schale beginnt).
2. **Nebenquantenzahl ($l$):** Bestimmt die **Form** des Orbitals (Unterschale).
    * Werte: $0$ bis $n-1$.
    * Bezeichnungen:
        * $l=0 \rightarrow s$-Orbital
        * $l=1 \rightarrow p$-Orbital
        * $l=2 \rightarrow d$-Orbital
        * $l=3 \rightarrow f$-Orbital
3. **Magnetquantenzahl ($m_l$):** Bestimmt die **Orientierung** im Raum.
    * Werte: $-l, \dots, 0, \dots, +l$.
    * Gibt die *Anzahl* der Orbitale pro Unterschale an ($2l + 1$).

### 5.2 Formen der Orbitale

* **s-Orbitale ($l=0$):**
    * Form: **Kugelförmig**.
    * Jede Schale hat ein s-Orbital ($1s, 2s, 3s \dots$).
    * Knotenflächen (Bereiche mit Aufenthaltswahrscheinlichkeit 0): Anzahl = $n - 1$. Ein 2s-Orbital hat 1 Knotenfläche.

* **p-Orbitale ($l=1$):**
    * Form: **Hantelförmig** (zwei Lappen).
    * Ab der 2. Schale ($n=2$).
    * Es gibt **3** p-Orbitale pro Schale ($p_x, p_y, p_z$), jeweils um 90° verdreht.

* **d-Orbitale ($l=2$):**
    * Form: Komplexer (meist kleeblattförmig), eines hat Hantelform mit Ring.
    * Ab der 3. Schale ($n=3$).
    * Es gibt **5** d-Orbitale pro Schale.

* **f-Orbitale ($l=3$):**
    * Form: Sehr komplex.
    * Ab der 4. Schale.
    * Es gibt **7** f-Orbitale.

---

### ✅ Selbsttest: Kapitel 5

**Frage 5.1** (Wissen)
Welche Form hat ein s-Orbital?
- A) Hantelförmig
- B) Kugelförmig ✓
- C) Kleeblattförmig
- D) Pyramidal

**Frage 5.2** (Anwendung)
Wie viele Orbitale gibt es in einer p-Unterschale ($l=1$)?
- A) 1
- B) 3 ✓
- C) 5
- D) 7

> **Erklärung:** Die Magnetquantenzahl $m_l$ läuft von $-l$ bis $+l$. Für $l=1$ sind das $-1, 0, +1$, also 3 Werte.

**Frage 5.3** (Verständnis)
Welche Quantenzahl bestimmt die Energie und Größe des Orbitals maßgeblich?
- A) Hauptquantenzahl ($n$) ✓
- B) Nebenquantenzahl ($l$)
- C) Magnetquantenzahl ($m_l$)

---

> 📺 **Video-Empfehlung:** "Orbitale und Quantenzahlen"
> **Kanal:** Duden Learnattack
> **URL:** https://www.youtube.com/watch?v=pKeTfvKZzH8
> **oEmbed-verifiziert:** ✓

---

## Kapitel 6: Elektronenkonfiguration

Wie verteilen sich die Elektronen auf die Orbitale?

### 6.1 Der Elektronenspin

Elektronen haben eine Eigenrotation, den **Spin**.
* **4. Quantenzahl: Spinquantenzahl ($m_s$):** Werte $+1/2$ oder $-1/2$.
* **Pauli-Prinzip:** In einem Atom dürfen keine zwei Elektronen in allen vier Quantenzahlen übereinstimmen. Da $n, l, m_l$ für ein Orbital gleich sind, müssen sich die zwei Elektronen im Orbital durch den Spin unterscheiden (entgegengesetzter Spin: $\uparrow \downarrow$).
* Konsequenz: **Maximal 2 Elektronen pro Orbital.**

### 6.2 Auffüll-Regeln

1. **Aufbau-Prinzip:** Elektronen füllen Orbitale beginnend mit der niedrigsten Energie.
    * Reihenfolge: $1s \rightarrow 2s \rightarrow 2p \rightarrow 3s \rightarrow 3p \rightarrow 4s \rightarrow 3d \rightarrow 4p \dots$
    * *Achtung:* Das 4s-Orbital wird *vor* dem 3d-Orbital gefüllt, da es energetisch (leer) etwas günstiger liegt.
2. **Hund'sche Regel:** Entartete Orbitale (z.B. die drei 2p-Orbitale) werden erst **einfach** mit gleichem Spin besetzt, bevor sie doppelt besetzt werden ("Bus-Sitzplatz-Regel").

### 6.3 Schreibweisen

* **spdf-Notation:** Z.B. Kohlenstoff (6 Elektronen): $1s^2 2s^2 2p^2$.
* **Edelgaskonfiguration (verkürzt):** Natrium (11 Elektronen): $[Ne] 3s^1$. (Neon ersetzt $1s^2 2s^2 2p^6$).
* **Orbitaldiagramm (Kästchen):** Pfeile symbolisieren Elektronen.

### 6.4 Periodensystem-Blöcke

* **Gruppe 1A/2A:** s-Block (füllen s-Orbitale).
* **Gruppe 3A-8A:** p-Block (füllen p-Orbitale).
* **Übergangsmetalle:** d-Block (füllen d-Orbitale, $n-1$).
* **Lanthanoide/Actinoide:** f-Block (füllen f-Orbitale, $n-2$).

**Ausnahmen im d-Block:**
Chrom ($Cr$) und Kupfer ($Cu$) sind energetisch stabiler mit halb- oder vollbesetzten d-Schalen.
* Erwartet $Cr$: $[Ar] 4s^2 3d^4$ $\rightarrow$ Realität: $[Ar] 4s^1 3d^5$ (Halbvoll ist stabil).
* Erwartet $Cu$: $[Ar] 4s^2 3d^9$ $\rightarrow$ Realität: $[Ar] 4s^1 3d^{10}$ (Voll ist stabil).

---

### ✅ Selbsttest: Kapitel 6

**Frage 6.1** (Anwendung)
Welches ist die korrekte Elektronenkonfiguration für Stickstoff (7 Elektronen)?
- A) $1s^2 2s^2 2p^3$ ✓
- B) $1s^2 2s^2 2p^2 3s^1$
- C) $1s^2 2p^5$

> **Erklärung:** 7 Elektronen: 2 ins 1s, 2 ins 2s, bleiben 3 für das 2p.

**Frage 6.2** (Verständnis)
Wie viele Elektronen passen maximal in ein einzelnes Orbital?
- A) 1
- B) 2 ✓
- C) 6
- D) 10

> **Erklärung:** Pauli-Prinzip.

**Frage 6.3** (Transfer)
Welches Element hat die Konfiguration $[Ne] 3s^2 3p^1$?
- A) Magnesium
- B) Aluminium ✓
- C) Silizium

> **Erklärung:** Neon hat 10 Elektronen. Dazu kommen $2+1=3$. Gesamt 13 Elektronen = Ordnungszahl 13 = Aluminium.

---

> 📺 **Video-Empfehlung:** "Elektronenkonfiguration bestimmen | Orbitalmodell"
> **Kanal:** Lehrerschmidt
> **URL:** https://www.youtube.com/watch?v=I43L6i8V_IQ
> **oEmbed-verifiziert:** ✓

---

## Kapitel 7: Ionen und Magnetismus

### 7.1 Bildung von Ionen

* **Hauptgruppenelemente:** Geben Elektronen ab oder nehmen auf, um Edelgaskonfiguration zu erreichen (Oktettregel).
    * $P$ ($[Ne] 3s^2 3p^3$) + 3e- $\rightarrow P^{3-}$ ($[Ne] 3s^2 3p^6$).
* **Übergangsmetalle (WICHTIG):** Beim Bilden von Kationen werden **zuerst die s-Elektronen** der äußersten Schale entfernt, dann die d-Elektronen.
    * $Fe$: $[Ar] 4s^2 3d^6$
    * $Fe^{2+}$: $[Ar] 4s^0 3d^6$ (Verlust der 4s Elektronen!)
    * $Fe^{3+}$: $[Ar] 4s^0 3d^5$ (Stabil, da d-Schale halbvoll).

### 7.2 Magnetismus

Magnetische Eigenschaften hängen von der Besetzung der Orbitale ab.
1. **Paramagnetisch:** Substanz wird von Magnetfeld **angezogen**.
    * Ursache: **Ungepaarte Elektronen**.
    * Beispiel: $Fe^{3+}$ (hat 5 ungepaarte Elektronen im 3d).
2. **Diamagnetisch:** Substanz wird vom Magnetfeld **leicht abgestoßen** (oder nicht angezogen).
    * Ursache: **Alle Elektronen sind gepaart** ($\uparrow\downarrow$).
    * Beispiel: Helium, Neon, $Mg^{2+}$.

---

### ✅ Selbsttest: Kapitel 7

**Frage 7.1** (Verständnis)
Eine Substanz hat ungepaarte Elektronen. Ist sie...
- A) Paramagnetisch ✓
- B) Diamagnetisch
- C) Radioaktiv

**Frage 7.2** (Anwendung)
Welche Elektronen werden beim Eisen ($Fe$) zuerst entfernt, um $Fe^{2+}$ zu bilden?
- A) Die 3d-Elektronen
- B) Die 4s-Elektronen ✓
- C) Die 3p-Elektronen

> **Erklärung:** Bei Übergangsmetallen werden beim Ionisieren immer zuerst die Elektronen mit der höchsten Hauptquantenzahl ($n=4$ vor $n=3$) entfernt.

**Frage 7.3** (Anwendung)
Ist das Zink-Ion ($Zn^{2+}$) paramagnetisch oder diamagnetisch? ($Zn$: $[Ar] 4s^2 3d^{10}$)
- A) Paramagnetisch
- B) Diamagnetisch ✓

> **Lösung:** $Zn^{2+}$ verliert die zwei 4s-Elektronen. Es bleibt $[Ar] 3d^{10}$. Die d-Schale ist voll ($10$ Elektronen). Alle Spins sind gepaart. Daher diamagnetisch.

---

> 📺 **Video-Empfehlung:** "Magnetismus (Para- & Diamagnetismus)"
> **Kanal:** Alexander G.
> **URL:** https://www.youtube.com/watch?v=NnFk5R00eSE
> **oEmbed-verifiziert:** ✓

---

# 📝 Prüfungsaufgaben (Universitätsniveau)

<!-- Diese Aufgaben sind für die Modul-Prüfung gedacht und deutlich anspruchsvoller als die Selbsttests -->

## Hinweise für Studierende

- Diese Aufgaben entsprechen dem Niveau einer universitären Modulprüfung ("Allgemeine Chemie").
- Bearbeitungszeit: ca. 90 Minuten für alle Aufgaben.
- Erlaubte Hilfsmittel: Taschenrechner, Periodensystem.
- Konstanten: $h = 6,626 \cdot 10^{-34} \text{ Js}$, $c = 3,00 \cdot 10^8 \text{ m/s}$, $R_H \cdot h \cdot c = 2,18 \cdot 10^{-18} \text{ J}$.

---

### Aufgabe 1 (8 Punkte) - Konzeptverständnis Bohrsches Modell

Erklären Sie die Entstehung der Balmer-Serie im Wasserstoffspektrum.
**Teilaufgaben:**
a) Was geschieht physikalisch im Atom, wenn eine Spektrallinie emittiert wird? (3 Punkte)
b) Warum entstehen diskrete Linien und kein kontinuierliches Spektrum? (3 Punkte)
c) In welchem Bereich des elektromagnetischen Spektrums liegt die Balmer-Serie? (2 Punkte)

<details>
<summary>Musterlösung anzeigen</summary>

a) Ein Elektron fällt von einem energetisch höheren Orbital (angeregter Zustand, $n > 2$) auf ein energetisch niedrigeres Orbital (Grundzustand für diese Serie, $n = 2$) zurück. Die Energiedifferenz wird als Photon (Lichtquant) emittiert.

b) Da die Energieniveaus ($n$) im Atom quantisiert sind (nur bestimmte Werte annehmen können), sind auch die Energiedifferenzen ($\Delta E$) fest definiert. Da $E = h \cdot \nu$, resultiert dies in Photonen mit fest definierten Frequenzen/Wellenlängen (Linien).

c) Die Balmer-Serie (Endzustand $n=2$) liegt im sichtbaren Bereich des Lichts.
</details>

---

### Aufgabe 2 (10 Punkte) - Berechnung Quantenmechanik

Ein Laser emittiert Lichtimpulse der Wellenlänge $532 \text{ nm}$. Ein Impuls enthält eine Energie von $3,85 \text{ mJ}$.

**Berechnen Sie:**
a) Die Frequenz und Energie eines einzelnen Photons dieses Lichts. (5 Punkte)
b) Die Anzahl der Photonen in einem Impuls. (5 Punkte)

<details>
<summary>Musterlösung anzeigen</summary>

**a) Ein Photon:**
1. Frequenz: $\nu = c / \lambda = (3,00 \cdot 10^8 \text{ m/s}) / (532 \cdot 10^{-9} \text{ m}) = 5,64 \cdot 10^{14} \text{ Hz}$
2. Energie: $E = h \cdot \nu = (6,626 \cdot 10^{-34} \text{ Js}) \cdot (5,64 \cdot 10^{14} \text{ s}^{-1}) = 3,74 \cdot 10^{-19} \text{ J}$

**b) Anzahl Photonen:**
Gesamtenergie $E_{total} = 3,85 \text{ mJ} = 3,85 \cdot 10^{-3} \text{ J}$
Anzahl $N = E_{total} / E_{photon} = (3,85 \cdot 10^{-3} \text{ J}) / (3,74 \cdot 10^{-19} \text{ J}) = 1,03 \cdot 10^{16} \text{ Photonen}$
</details>

---

### Aufgabe 3 (8 Punkte) - De Broglie Wellenlänge

Vergleichen Sie die Wellenlänge eines Elektrons ($m_e = 9,11 \cdot 10^{-31} \text{ kg}$) mit der eines Baseballs ($m_b = 0,145 \text{ kg}$). Beide bewegen sich mit $40 \text{ m/s}$.

<details>
<summary>Musterlösung anzeigen</summary>

Formel: $\lambda = h / (m \cdot v)$

**Elektron:**
$\lambda_e = 6,626 \cdot 10^{-34} / (9,11 \cdot 10^{-31} \cdot 40) \approx 1,8 \cdot 10^{-5} \text{ m} = 18 \mu\text{m}$
(Dies ist im Bereich von Infrarotstrahlung, quantenmechanisch sehr relevant).

**Baseball:**
$\lambda_b = 6,626 \cdot 10^{-34} / (0,145 \cdot 40) \approx 1,1 \cdot 10^{-34} \text{ m}$
(Diese Wellenlänge ist unmessbar klein, daher keine Welleneigenschaften im Alltag).
</details>

---

### Aufgabe 4 (12 Punkte) - Quantenzahlen & Elektronenkonfiguration

Gegeben sind folgende Sets von Quantenzahlen ($n, l, m_l, m_s$). Welche sind für ein Elektron in einem Atom **ZULÄSSIG** und welche **VERBOTEN**? Begründen Sie.

a) $(2, 2, -1, +1/2)$
b) $(3, 1, 0, -1/2)$
c) $(4, 0, 2, +1/2)$
d) $(1, 0, 0, 0)$

<details>
<summary>Musterlösung anzeigen</summary>

a) **Verboten.** Für $n=2$ darf $l$ maximal $n-1=1$ sein. Ein "2d"-Orbital existiert nicht.
b) **Zulässig.** Beschreibt ein Elektron im 3p-Orbital.
c) **Verboten.** Für $l=0$ (s-Orbital) muss $m_l = 0$ sein.
d) **Verboten.** Der Spin $m_s$ muss $+1/2$ oder $-1/2$ sein, niemals 0.
</details>

---

### Aufgabe 5 (10 Punkte) - Elektronenkonfiguration & Ausnahmen

Geben Sie die vollständige und die verkürzte (Edelgas-) Elektronenkonfiguration für folgende Spezies an. Beachten Sie mögliche Ausnahmen!

a) Schwefel (S) (3 Punkte)
b) Kupfer (Cu) (4 Punkte)
c) Eisen(II)-Ion ($Fe^{2+}$) (3 Punkte)

<details>
<summary>Musterlösung anzeigen</summary>

a) **S (16 e-):**
Voll: $1s^2 2s^2 2p^6 3s^2 3p^4$
Verkürzt: $[Ne] 3s^2 3p^4$

b) **Cu (29 e-) - AUSNAHME:**
Voll: $1s^2 2s^2 2p^6 3s^2 3p^6 4s^1 3d^{10}$
Verkürzt: $[Ar] 4s^1 3d^{10}$ (Stabilität der vollen d-Unterschale)

c) **Fe2+ (24 e-):**
Neutrales Fe: $[Ar] 4s^2 3d^6$
Verlust der Valenzelektronen (4s) zuerst!
Ion: $[Ar] 3d^6$
</details>

---

### Aufgabe 6 (6 Punkte) - Orbitaldiagramme (Hund'sche Regel)

Zeichnen Sie das Orbitaldiagramm (Kästchenschreibweise) für die Valenzschale von Sauerstoff. Bestimmen Sie die Anzahl der ungepaarten Elektronen.

<details>
<summary>Musterlösung anzeigen</summary>

Sauerstoff (O, 8e-): $[He] 2s^2 2p^4$.

**2s-Orbital:** [⇅]
**2p-Orbitale:** [⇅] [↑] [↑]

Hund'sche Regel: Die p-Orbitale werden zuerst einfach besetzt.
Anzahl ungepaarte Elektronen: **2**.
</details>

---

### Aufgabe 7 (8 Punkte) - Magnetismus

Ordnen Sie folgende Spezies als **paramagnetisch** oder **diamagnetisch** ein. Begründen Sie kurz anhand der Konfiguration.
a) $Mg$
b) $Mn$
c) $Zn^{2+}$
d) $Cr^{3+}$

<details>
<summary>Musterlösung anzeigen</summary>

a) **Mg ($[Ne] 3s^2$):** Alle Elektronen gepaart. -> **Diamagnetisch**.
b) **Mn ($[Ar] 4s^2 3d^5$):** 5 ungepaarte d-Elektronen. -> **Paramagnetisch**.
c) **Zn2+ ($[Ar] 3d^{10}$):** Volle d-Schale, alle gepaart. -> **Diamagnetisch**.
d) **Cr3+:** Cr ist $[Ar] 4s^1 3d^5$. Verlust von 3 Elektronen (1x 4s, 2x 3d) -> $[Ar] 3d^3$. 3 ungepaarte Elektronen. -> **Paramagnetisch**.
</details>

---

### Aufgabe 8 (10 Punkte) - Rydberg-Gleichung Transfer

Berechnen Sie die Energie, die benötigt wird, um das Elektron des Wasserstoffatoms vom Grundzustand ($n=1$) vollständig zu entfernen (Ionisierung, $n=\infty$). Geben Sie das Ergebnis in Joule und kJ/mol an.

<details>
<summary>Musterlösung anzeigen</summary>

$\Delta E = -Rhc (1/n_{final}^2 - 1/n_{initial}^2)$
Mit $n_{final} = \infty$ ist $1/\infty^2 = 0$.

$\Delta E = -2,18 \cdot 10^{-18} \text{ J} \cdot (0 - 1/1^2)$
$\Delta E = +2,18 \cdot 10^{-18} \text{ J pro Atom}$

Pro Mol:
$E_{Mol} = 2,18 \cdot 10^{-18} \text{ J} \cdot 6,022 \cdot 10^{23} \text{ mol}^{-1} = 1,31 \cdot 10^6 \text{ J/mol} = 1312 \text{ kJ/mol}$
</details>

---

### Aufgabe 9 (6 Punkte) - Photoelektrischer Effekt (Konzept)

Ein Metall wird mit rotem Licht bestrahlt – es werden keine Elektronen ausgelöst. Dann wird es mit blauem Licht gleicher Intensität bestrahlt – Elektronen werden ausgelöst.
Warum half dieses Experiment Einstein zu beweisen, dass Licht Teilchencharakter hat?

<details>
<summary>Musterlösung anzeigen</summary>

Nach der klassischen Wellentheorie müsste auch rotes Licht Elektronen auslösen, wenn man nur die Intensität (Helligkeit) lange genug erhöht (Energieakkumulation). Das passierte aber nicht.
Einstein erklärte: Ein einzelnes Lichtteilchen (Photon) muss genug Energie haben ($E=h\nu$), um *ein* Elektron herauszuschlagen. Rot (niedrige Frequenz) hat zu schwache Photonen. Blau (hohe Frequenz) hat energiereichere Photonen, die die Austrittsarbeit des Metalls überwinden. Dies beweist die Quantisierung (Paket-Natur) des Lichts.
</details>

---

### Aufgabe 10 (8 Punkte) - Knotenebenen

a) Wie viele Knotenflächen hat ein 3p-Orbital insgesamt? (3 Punkte)
b) Skizzieren Sie schematisch den Querschnitt eines 2s-Orbitals und markieren Sie die Knotenfläche. (5 Punkte)

<details>
<summary>Musterlösung anzeigen</summary>

a) Gesamtknoten = $n - 1$. Für 3p ($n=3$) gibt es **2 Knotenflächen**.
(Davon $l=1$ planare Knotenfläche durch den Kern und $n-l-1 = 3-1-1 = 1$ sphärische Knotenfläche).

b) Skizze sollte zeigen:
- Einen inneren Kreis (hohe Wahrscheinlichkeit am Kern).
- Einen weißen Ring (Knotenfläche, Wahrscheinlichkeit 0).
- Einen äußeren Ring (wieder Aufenthaltswahrscheinlichkeit).
</details>

---

### Aufgabe 11 (8 Punkte) - Periodizität und Ionenradien

Erklären Sie, warum das Kation $Fe^{3+}$ kleiner ist als das Kation $Fe^{2+}$, obwohl beide den gleichen Kern haben.

<details>
<summary>Musterlösung anzeigen</summary>

$Fe^{2+}$ hat die Konfiguration $[Ar] 3d^6$.
$Fe^{3+}$ hat die Konfiguration $[Ar] 3d^5$.
$Fe^{3+}$ hat ein Elektron weniger. Dadurch verringert sich die Elektron-Elektron-Abstoßung in der Hülle. Da die Kernladung (26 Protonen) gleich bleibt und stark anzieht, werden die verbleibenden 5 d-Elektronen stärker an den Kern gezogen. Die Elektronenwolke kontrahiert, der Radius sinkt.
</details>

---

### Aufgabe 12 (6 Punkte) - Multiple Choice Expert

Welche Aussage über das 4s-Orbital im Vergleich zum 3d-Orbital ist **FALSCH**?
- A) Im neutralen K-Atom wird das 4s vor dem 3d gefüllt.
- B) Das 4s-Orbital ist im Durchschnitt weiter vom Kern entfernt als das 3d.
- C) Beim Ionisieren von Übergangsmetallen werden Elektronen aus dem 3d vor dem 4s entfernt.
- D) Das 4s-Orbital hat Elektronenaufenthaltswahrscheinlichkeit sehr nah am Kern (Durchdringung).

<details>
<summary>Musterlösung anzeigen</summary>

**Falsch ist C.**
Begründung: Beim Ionisieren (Entfernen von Elektronen) werden immer die Elektronen der äußersten Hauptschale zuerst entfernt. Das ist die 4. Schale ($4s$), nicht die 3. Schale ($3d$).
</details>

---

### Aufgabe 13 (8 Punkte) - Transfer isoelektronisch

Nennen Sie drei Ionen, die isoelektronisch zum Edelgas Argon sind. Ordnen Sie diese nach steigendem Ionenradius.

<details>
<summary>Musterlösung anzeigen</summary>

Isoelektronisch zu Argon (18 e-):
$S^{2-}$, $Cl^-$, $K^+$, $Ca^{2+}$.

Radius-Trend: Je höher die positive Kernladung bei gleicher Elektronenzahl, desto stärker die Anziehung -> desto kleiner der Radius.
Reihenfolge (steigender Radius):
$Ca^{2+} < K^+ < Ar < Cl^- < S^{2-}$
</details>

---

### Aufgabe 14 (10 Punkte) - Unbekanntes Element

Ein Element X hat im Grundzustand 3 ungepaarte Elektronen in der 4. Schale (Hauptquantenzahl 4) und ist ein Übergangsmetall.
a) Identifizieren Sie das Element. (5 Punkte)
b) Ist es paramagnetisch? (2 Punkte)
c) Geben Sie die Quantenzahlen für das letzte hinzugefügte Elektron an. (3 Punkte)

<details>
<summary>Musterlösung anzeigen</summary>

a) Übergangsmetall in Periode 4 füllt 3d-Orbitale. Es muss aber Elektronen in der 4. Schale haben (4s).
Wir suchen 3 ungepaarte Elektronen im d-Block ($n=4$ Periode füllt $3d$).
Möglichkeiten im 3d: $d^3$ (Vanadium) oder $d^7$ (Cobalt -> 3 ungepaarte, da 10 Plätze).
Element: **Cobalt (Co)** ($[Ar] 4s^2 3d^7$) oder **Vanadium (V)** ($[Ar] 4s^2 3d^3$).
*Korrektur:* Aufgabe sagt "in der 4. Schale". Übergangsmetalle haben Valenzelektronen im 4s und 3d. Meist wird $d$ gezählt. Nehmen wir Cobalt oder Vanadium als korrekt an.

b) Ja, paramagnetisch (ungepaarte Elektronen).

c) Für Cobalt (letztes Elektron ins 3d, Spin gepaart $\downarrow$): $n=3, l=2, m_l=-1, m_s=-1/2$ (Beispielhaft).
</details>

---

### Aufgabe 15 (10 Punkte) - Synthese (Gitterenergie/Spektrum)

Warum leuchtet Natriumchlorid in einer Flamme gelb, während Magnesiumchlorid fast farblos brennt bzw. im UV-Bereich emittiert? Argumentieren Sie mit Energieniveaus.

<details>
<summary>Musterlösung anzeigen</summary>

Die Flammenfärbung entsteht durch Anregung von Valenzelektronen in höhere Orbitale und deren Rückfall (Emission).
Bei Natrium ($Na$, Gruppe 1) ist das Valenzelektron ($3s^1$) relativ locker gebunden. Die Energiedifferenz zum nächsten Niveau ($3p$) entspricht genau der Energie von gelbem Licht (sichtbar, geringere Energie).
Bei Magnesium ($Mg$, Gruppe 2) sind die Elektronen stärker gebunden (höhere Kernladung). Die Energiedifferenzen zwischen den Orbitalen sind größer. Die emittierten Photonen haben daher eine höhere Frequenz/Energie, die oft im nicht-sichtbaren UV-Bereich liegt.
</details>

---

## Prüfungsstatistik

| Aufgabentyp          | Anzahl | Punkte gesamt |
| :------------------- | :----- | :------------ |
| Konzeptverständnis   | 4      | 32            |
| Berechnungen         | 3      | 28            |
| Multiple Choice      | 1      | 6             |
| Transfer & Anwendung | 7      | 54            |
| **Gesamt**           | **15** | **120**       |

**Notenschlüssel (Vorschlag):**
- Sehr gut (1): ≥ 108 Punkte
- Gut (2): ≥ 96 Punkte
- Befriedigend (3): ≥ 84 Punkte
- Genügend (4): ≥ 72 Punkte
- Nicht genügend (5): < 72 Punkte

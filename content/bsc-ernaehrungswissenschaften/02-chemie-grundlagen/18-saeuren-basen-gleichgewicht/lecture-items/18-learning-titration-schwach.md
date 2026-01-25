---
type: 'learning-content'
sourceRefs:
  - sourceId: 'vorlesung-k18'
  - sourceId: 'kotz-k18'
---

# Titration: Schwache Säure + Starke Base

Die Titration einer schwachen Säure mit einer starken Base (z.B. Essigsäure mit NaOH) zeigt einen deutlich anderen Kurvenverlauf als die Titration starker Säure/Base.

## Die Titrationskurve

<!-- SVG-Titrationskurve: Schwache Säure + Starke Base -->
<svg viewBox="0 0 320 240" style="max-width: 400px; width: 100%;" aria-label="Titrationskurve: Start bei pH 3, flache Pufferregion, Sprung zu pH 9 am Äquivalenzpunkt"><rect width="320" height="240" fill="#fafafa"/><line x1="50" y1="20" x2="50" y2="200" stroke="#333" stroke-width="2"/><line x1="50" y1="200" x2="300" y2="200" stroke="#333" stroke-width="2"/><text x="10" y="25" font-size="11" fill="#333">pH 14</text><text x="10" y="70" font-size="11" fill="#333">pH 9</text><text x="10" y="110" font-size="11" fill="#333">pH 7</text><text x="10" y="145" font-size="11" fill="#333">pH 5</text><text x="10" y="185" font-size="11" fill="#333">pH 3</text><line x1="50" y1="110" x2="300" y2="110" stroke="#ccc" stroke-width="1" stroke-dasharray="4"/><line x1="50" y1="70" x2="300" y2="70" stroke="#ccc" stroke-width="1" stroke-dasharray="4"/><rect x="70" y="130" width="90" height="50" fill="#dbeafe" opacity="0.5"/><text x="85" y="160" font-size="10" fill="#1e40af">Puffer-Region</text><polyline points="50,180 80,170 110,150 130,145 150,138 165,120 180,70 190,55 210,45 300,35" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="110" cy="150" r="4" fill="#059669"/><text x="75" y="125" font-size="10" fill="#059669">Halb-ÄP</text><text x="75" y="137" font-size="9" fill="#059669">(pH = pKs)</text><circle cx="180" cy="70" r="5" fill="#dc2626"/><text x="188" y="60" font-size="11" fill="#dc2626" font-weight="bold">ÄP</text><text x="188" y="75" font-size="10" fill="#dc2626">(pH > 7!)</text><text x="160" y="218" font-size="12" fill="#333">V(NaOH) →</text></svg>

## Vier wichtige Bereiche

### 1. Startpunkt (nur schwache Säure)

Berechnung wie für eine schwache Säure:

$$[\text{H}^+] = \sqrt{K_s \cdot c_{\text{Säure}}}$$

Der pH-Wert liegt deutlich über 1, aber unter 7.

**Beispiel:** 0,10 M Essigsäure (Ks = 1,8 × 10⁻⁵)

$$[\text{H}^+] = \sqrt{1{,}8 \times 10^{-5} \times 0{,}10} = 1{,}34 \times 10^{-3}\,\text{M}$$

pH = 2,87

### 2. Puffer-Region (vor dem ÄP)

Während der Zugabe von NaOH entsteht ein **Puffer**:

- Die Base neutralisiert einen Teil der schwachen Säure
- Es bildet sich ein Gemisch aus schwacher Säure und konjugierter Base

**Berechnung:** Henderson-Hasselbalch-Gleichung

### Der Halbäquivalenzpunkt

Wenn genau die **Hälfte der Säure** neutralisiert ist:

$$[\text{Säure}] = [\text{konjugierte Base}]$$

Daraus folgt: **pH = pKs**

> Der Halbäquivalenzpunkt ist der einfachste Weg, den pKs-Wert einer unbekannten Säure zu bestimmen!

### 3. Äquivalenzpunkt

Am Äquivalenzpunkt wurde alle Säure zur konjugierten Base umgesetzt.

**Wichtig:** Der pH-Wert ist **größer als 7** (basisch)!

Grund: Die konjugierte Base hydrolysiert:

$$\text{A}^- + \text{H}_2\text{O} \rightleftharpoons \text{HA} + \text{OH}^-$$

**Berechnung:**

1. Berechne Kb aus Ks: $K_b = K_w / K_s$
2. Berechne [OH⁻]: $[\text{OH}^-] = \sqrt{K_b \cdot c_{\text{Salz}}}$
3. Berechne pOH und dann pH

### 4. Nach dem Äquivalenzpunkt

Überschüssiges NaOH dominiert den pH-Wert. Die Hydrolyse der konjugierten Base kann vernachlässigt werden.

## Vergleich: Äquivalenzpunkte

| Titration       | pH am ÄP | Grund                           |
| --------------- | -------- | ------------------------------- |
| Stark + Stark   | 7,00     | Neutrales Salz                  |
| Schwach + Stark | > 7      | Basische Hydrolyse des Produkts |
| Stark + Schwach | < 7      | Saure Hydrolyse des Produkts    |

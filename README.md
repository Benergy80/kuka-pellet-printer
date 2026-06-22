# KUKA Pellet 3D Printer — Conversion Plan

Planning materials for converting a KUKA KR 150 / 180 robot (KR C2 controller)
into a large-format pellet (granule) 3D printer.

## Contents

- **`index.html`** — Interactive implementation plan. Open in any web browser.
  Covers system architecture, the build platform (rigid table, heated bed,
  enclosure/safety), electrical & DeviceNet I/O wiring, the software pipeline,
  calibration, a commissioning roadmap, and an interactive, filterable Bill of
  Materials with live cost totals and charts.
- **`KUKA_Pellet_3D_Printer_Implementation.pptx`** — The same plan as a
  presentation deck with diagrams and charts.
- **`build.js`** — Node.js script (PptxGenJS) that generates the deck.

## Regenerating the deck

```bash
npm install pptxgenjs react-icons react react-dom sharp
node build.js
```

## ⚠️ Safety

This is planning material only. The 480 V three-phase power connection and the
robot safety-circuit wiring (fence interlocks, E-stops) **must** be performed
and validated by a licensed electrician and a qualified machine-safety
integrator. Do not run the robot unattended until safety, thermal, and e-stop
behavior are all proven.

const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");

// ---------- palette ----------
const INK = "151A21";       // dark bg
const PANEL = "212B36";     // dark panel
const BLUE = "0F1722";      // blueprint bg
const LIGHT = "F4F6F8";     // light bg
const CARD = "FFFFFF";
const TEXT = "1B2430";
const MUTED = "5E6B7A";
const AMBER = "EE7B1E";     // molten accent
const AMBER_DK = "B85E16";
const STEEL = "3E7CB1";     // secondary
const STEEL_DK = "2C5C86";
const GREEN = "2E9E6B";
const RED = "D2553F";
const TINT = "EAF0F5";      // card tint
const TINTW = "FBF2E8";     // warm tint

const HFONT = "Century Schoolbook";
const BFONT = "Calibri";

// ---------- icon helper ----------
function svgOf(Comp, color, size = 256) {
  return ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color, size: String(size) }));
}
async function icon(Comp, color, size = 256) {
  const svg = svgOf(Comp, color, size);
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + png.toString("base64");
}
const shadow = () => ({ type: "outer", color: "1B2430", blur: 7, offset: 3, angle: 90, opacity: 0.16 });

(async () => {
  const I = {};
  const want = {
    robot: fa.FaRobot, fire: fa.FaFireAlt, wind: fa.FaWind, up: fa.FaArrowAltCircleUp,
    table: fa.FaBorderAll, heat: fa.FaThermometerThreeQuarters, shield: fa.FaShieldAlt,
    plug: fa.FaPlug, chip: fa.FaMicrochip, code: fa.FaLaptopCode, target: fa.FaBullseye,
    list: fa.FaListOl, dollar: fa.FaDollarSign, check: fa.FaCheckCircle, warn: fa.FaExclamationTriangle,
    diagram: fa.FaProjectDiagram, arrow: fa.FaArrowRight, bolt: fa.FaBolt, tools: fa.FaTools,
    cube: fa.FaCube, sync: fa.FaSyncAlt, user: fa.FaUserShield, gear: fa.FaCog, layers: fa.FaLayerGroup,
    snow: fa.FaSnowflake, ruler: fa.FaRulerCombined, dot: fa.FaCircle, power: fa.FaIndustry
  };
  for (const [k, C] of Object.entries(want)) {
    I[k] = { amber: await icon(C, "#" + AMBER), white: await icon(C, "#FFFFFF"),
             steel: await icon(C, "#" + STEEL), dark: await icon(C, "#" + TEXT),
             green: await icon(C, "#" + GREEN), red: await icon(C, "#" + RED) };
  }

  const p = new pptxgen();
  p.defineLayout({ name: "W", width: 13.333, height: 7.5 });
  p.layout = "W";
  p.author = "Cowork";
  p.title = "KUKA Pellet 3D Printer — Implementation Plan";
  const W = 13.333, H = 7.5;

  // ---------- reusable bits ----------
  function pageNum(s, n) {
    s.addText(`${n}`, { x: W - 0.7, y: H - 0.5, w: 0.4, h: 0.3, fontFace: BFONT, fontSize: 10, color: MUTED, align: "right" });
    s.addText("KUKA · LFAM", { x: 0.6, y: H - 0.5, w: 3, h: 0.3, fontFace: BFONT, fontSize: 9, color: MUTED, charSpacing: 1 });
  }
  function head(s, kick, ttl) {
    s.addText(kick.toUpperCase(), { x: 0.7, y: 0.5, w: 11, h: 0.3, fontFace: BFONT, fontSize: 13, bold: true, color: AMBER, charSpacing: 3, margin: 0 });
    s.addText(ttl, { x: 0.68, y: 0.82, w: 12, h: 0.75, fontFace: HFONT, fontSize: 31, bold: true, color: TEXT, margin: 0 });
  }
  function card(s, x, y, w, h, fill) {
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: fill || CARD }, line: { color: "E2E8EE", width: 1 }, shadow: shadow() });
  }
  function pill(s, x, y, txt, col) {
    const w = 0.28 + txt.length * 0.082;
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.32, rectRadius: 0.16, fill: { color: col } });
    s.addText(txt.toUpperCase(), { x, y, w, h: 0.32, align: "center", valign: "middle", fontFace: BFONT, fontSize: 10, bold: true, color: "FFFFFF", charSpacing: 1, margin: 0 });
  }

  // ============================================================ S1 TITLE
  let s = p.addSlide(); s.background = { color: INK };
  s.addShape(p.shapes.OVAL, { x: 8.7, y: -2.6, w: 7.6, h: 7.6, fill: { color: PANEL } });
  s.addShape(p.shapes.OVAL, { x: 10.0, y: 2.7, w: 5.2, h: 5.2, fill: { color: "1A222C" } });
  s.addImage({ data: I.robot.amber, x: 9.75, y: 1.55, w: 2.9, h: 2.9 });
  s.addText("INDUSTRIAL ADDITIVE MANUFACTURING", { x: 0.85, y: 1.25, w: 9, h: 0.4, fontFace: BFONT, fontSize: 15, bold: true, color: AMBER, charSpacing: 3, margin: 0 });
  s.addText("Converting a KUKA Robot\ninto a Pellet 3D Printer", { x: 0.8, y: 1.75, w: 8.6, h: 2.0, fontFace: HFONT, fontSize: 45, bold: true, color: "FFFFFF", lineSpacingMultiple: 0.98, margin: 0 });
  s.addText("Implementation Plan — Platform, Wiring & Software", { x: 0.85, y: 3.95, w: 8, h: 0.5, fontFace: BFONT, fontSize: 18, color: "C7D2DD", margin: 0 });
  // chips
  const chips = ["KR 150 / 180", "KR C2 Controller", "Pellet Extrusion (LFAM)"];
  let cx = 0.85;
  chips.forEach(t => { const w = 0.5 + t.length * 0.105;
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: cx, y: 4.85, w, h: 0.46, rectRadius: 0.23, fill: { color: PANEL }, line: { color: AMBER, width: 1 } });
    s.addText(t, { x: cx, y: 4.85, w, h: 0.46, align: "center", valign: "middle", fontFace: BFONT, fontSize: 12.5, bold: true, color: "FFFFFF", margin: 0 });
    cx += w + 0.25; });
  s.addText("June 2026", { x: 0.85, y: 6.5, w: 5, h: 0.3, fontFace: BFONT, fontSize: 12, color: MUTED, charSpacing: 1, margin: 0 });

  // ============================================================ S2 WHAT WE'RE BUILDING
  s = p.addSlide(); s.background = { color: LIGHT };
  head(s, "The Goal", "A robotic large-format pellet printer");
  s.addText("A 6-axis KUKA arm carries a pellet extruder and prints large parts directly from plastic granules — no filament. The heavy-payload arm, the extruder, and the full feedstock chain are in hand; the work ahead is integration, a build platform, and safety.",
    { x: 0.72, y: 1.95, w: 6.0, h: 2.4, fontFace: BFONT, fontSize: 16.5, color: TEXT, lineSpacingMultiple: 1.18, valign: "top", margin: 0 });
  s.addImage({ data: I.cube.steel, x: 0.72, y: 4.6, w: 0.9, h: 0.9 });
  s.addText("Pellets in. Big parts out.", { x: 1.78, y: 4.72, w: 5, h: 0.7, fontFace: HFONT, fontSize: 19, italic: true, bold: true, color: STEEL_DK, valign: "middle", margin: 0 });
  // stat cards 2x2
  const stats = [
    ["150–180 kg", "Robot payload — carries any pellet head with margin", I.robot.amber],
    ["~2700 mm", "Reach — defines the build envelope & cell size", I.target.amber],
    ["3–4 kg/h", "Extruder output — moderate LFAM throughput", I.fire.amber],
    ["0–350 °C", "Melt range — covers PP, PETG, ABS, PA, PC", I.heat.amber],
  ];
  let gx = 7.05, gy = 1.95, gw = 2.92, gh = 2.42, gpx = 0.18, gpy = 0.2;
  stats.forEach((st, i) => {
    const x = gx + (i % 2) * (gw + gpx), y = gy + Math.floor(i / 2) * (gh + gpy);
    card(s, x, y, gw, gh, CARD);
    s.addImage({ data: st[2], x: x + 0.28, y: y + 0.28, w: 0.66, h: 0.66 });
    s.addText(st[0], { x: x + 0.26, y: y + 1.0, w: gw - 0.5, h: 0.6, fontFace: HFONT, fontSize: 27, bold: true, color: TEXT, margin: 0 });
    s.addText(st[1], { x: x + 0.28, y: y + 1.62, w: gw - 0.55, h: 0.7, fontFace: BFONT, fontSize: 12.5, color: MUTED, lineSpacingMultiple: 1.05, margin: 0 });
  });
  pageNum(s, 2);

  // ============================================================ S3 CURRENT ASSETS
  s = p.addSlide(); s.background = { color: LIGHT };
  head(s, "What's in Hand", "Current assets");
  const assets = [
    ["Robot + Controller", "KUKA KR 150 / 180\nKR C2 (MP9), KCP2 pendant\n480V 3-phase", I.robot.amber, "Have"],
    ["Pellet Extruder", "4 kg/h vertical servo\n1200 W · 0–350 °C\n1.5–3 mm nozzle", I.fire.amber, "Have"],
    ["Hopper Dryer", "INTSUPERMAI 110 lb\nDries hygroscopic resins\n(ABS, PC, PA, PET)", I.wind.amber, "Have"],
    ["Vacuum Autoloader", "INTBUYING XC-300G\n300 kg/h · 7.5 L\nFeeds the extruder hopper", I.up.amber, "Have"],
  ];
  let ax = 0.72, aw = 2.92, ay = 2.0, ah = 4.35, apx = 0.18;
  assets.forEach((a, i) => {
    const x = ax + i * (aw + apx);
    card(s, x, ay, aw, ah, CARD);
    s.addShape(p.shapes.OVAL, { x: x + 0.3, y: ay + 0.32, w: 1.0, h: 1.0, fill: { color: TINTW } });
    s.addImage({ data: a[2], x: x + 0.55, y: ay + 0.57, w: 0.5, h: 0.5 });
    s.addText(a[0], { x: x + 0.26, y: ay + 1.5, w: aw - 0.5, h: 0.75, fontFace: HFONT, fontSize: 16.5, bold: true, color: TEXT, lineSpacingMultiple: 0.95, margin: 0 });
    s.addText(a[1], { x: x + 0.28, y: ay + 2.28, w: aw - 0.55, h: 1.45, fontFace: BFONT, fontSize: 13, color: MUTED, lineSpacingMultiple: 1.22, valign: "top", margin: 0 });
    pill(s, x + 0.28, ay + ah - 0.55, a[3], GREEN);
  });
  pageNum(s, 3);

  // ============================================================ S4 SUBSYSTEM STATUS
  s = p.addSlide(); s.background = { color: LIGHT };
  head(s, "Where You Stand", "The four subsystems");
  const subs = [
    ["A", "Motion", "Robot arm + KR C2 controller", "Have", GREEN, 100, I.robot.steel],
    ["B", "Extrusion", "Pellet extruder, heat zones, nozzle", "Have", GREEN, 100, I.fire.steel],
    ["C", "Control", "Slicer → robot toolpath + extruder sync", "To build", RED, 18, I.code.steel],
    ["D", "Platform", "Dryer + feed (done); bed, table, enclosure", "Partial", AMBER, 45, I.table.steel],
  ];
  let ry = 2.05, rh = 1.0, rgap = 0.16;
  subs.forEach((r, i) => {
    const y = ry + i * (rh + rgap);
    card(s, 0.72, y, 11.9, rh, CARD);
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 0.92, y: y + 0.2, w: 0.6, h: 0.6, rectRadius: 0.1, fill: { color: INK } });
    s.addText(r[0], { x: 0.92, y: y + 0.2, w: 0.6, h: 0.6, align: "center", valign: "middle", fontFace: HFONT, fontSize: 22, bold: true, color: AMBER, margin: 0 });
    s.addImage({ data: r[6], x: 1.78, y: y + 0.28, w: 0.44, h: 0.44 });
    s.addText(r[1], { x: 2.4, y: y + 0.14, w: 2.5, h: 0.4, fontFace: HFONT, fontSize: 18, bold: true, color: TEXT, margin: 0 });
    s.addText(r[2], { x: 2.4, y: y + 0.54, w: 4.6, h: 0.36, fontFace: BFONT, fontSize: 12.5, color: MUTED, margin: 0 });
    // progress track
    const tx = 7.3, tw = 3.7;
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: tx, y: y + 0.43, w: tw, h: 0.16, rectRadius: 0.08, fill: { color: "E2E8EE" } });
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: tx, y: y + 0.43, w: Math.max(0.18, tw * r[5] / 100), h: 0.16, rectRadius: 0.08, fill: { color: r[4] } });
    pill(s, 11.35, y + 0.34, r[3], r[4]);
  });
  pageNum(s, 4);

  // ============================================================ S5 ARCHITECTURE (blueprint)
  s = p.addSlide(); s.background = { color: BLUE };
  s.addText("SYSTEM ARCHITECTURE", { x: 0.7, y: 0.5, w: 11, h: 0.3, fontFace: BFONT, fontSize: 13, bold: true, color: AMBER, charSpacing: 3, margin: 0 });
  s.addText("What connects to what", { x: 0.68, y: 0.82, w: 12, h: 0.7, fontFace: HFONT, fontSize: 31, bold: true, color: "FFFFFF", margin: 0 });

  function bp(x, y, w, h, title, sub, col, ic) {
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.07, fill: { color: PANEL }, line: { color: col, width: 1.5 } });
    if (ic) s.addImage({ data: ic, x: x + 0.14, y: y + h / 2 - 0.22, w: 0.44, h: 0.44 });
    const tx = ic ? x + 0.66 : x + 0.14;
    s.addText(title, { x: tx, y: y + 0.1, w: w - (tx - x) - 0.1, h: 0.34, fontFace: BFONT, fontSize: 13.5, bold: true, color: "FFFFFF", margin: 0, valign: "middle" });
    if (sub) s.addText(sub, { x: tx, y: y + 0.42, w: w - (tx - x) - 0.1, h: h - 0.5, fontFace: BFONT, fontSize: 10.5, color: "9DB0C2", margin: 0, lineSpacingMultiple: 1.0 });
  }
  function arrow(x, y, w, vert, col) {
    if (!vert) s.addShape(p.shapes.LINE, { x, y, w, h: 0, line: { color: col || AMBER, width: 2.5, endArrowType: "triangle" } });
    else s.addShape(p.shapes.LINE, { x, y, w: 0, h: w, line: { color: col || AMBER, width: 2.5, endArrowType: "triangle" } });
  }
  // top row: CAD -> Slicer -> KRC2 -> DeviceNet
  bp(0.72, 1.95, 2.5, 0.95, "CAD Model", "STL part to print", STEEL, I.cube.steel);
  arrow(3.28, 2.42, 0.5);
  bp(3.85, 1.95, 2.9, 0.95, "Slicer PC", "Cura + CuraToKRC2 plugin\n→ .src / .dat files", STEEL, I.code.steel);
  arrow(6.82, 2.42, 0.5);
  bp(7.4, 1.95, 2.6, 0.95, "KR C2 Controller", "Runs KRL motion program", AMBER, I.gear.amber);
  arrow(10.06, 2.42, 0.5);
  bp(10.62, 1.95, 2.0, 0.95, "DeviceNet I/O", "BK5120 island", AMBER, I.chip.amber);
  // down to extruder signals
  arrow(11.6, 2.95, 0.5, true);
  bp(9.4, 3.55, 3.2, 1.05, "Extruder Control Box", "$OUT → RUN/STOP\n$ANOUT[1] → speed (0–10V)\n$IN ← ready / fault", AMBER, I.fire.amber);

  // robot path
  arrow(8.7, 2.95, 0.55, true);
  bp(7.0, 3.55, 2.2, 1.05, "Robot Arm", "carries the head\nfollows the toolpath", STEEL, I.robot.steel);
  arrow(7.4, 4.7, 0.5, true);
  bp(6.3, 5.25, 2.9, 0.95, "Heated Build Bed", "part adheres here", STEEL, I.heat.steel);

  // feedstock chain bottom-left
  bp(0.72, 5.25, 2.0, 0.95, "Dryer", "dries pellets", STEEL, I.wind.steel);
  arrow(2.78, 5.72, 0.42);
  bp(3.26, 5.25, 2.4, 0.95, "Autoloader", "vacuum-feeds hopper", STEEL, I.up.steel);
  arrow(5.72, 5.72, 0.42);
  s.addImage({ data: I.fire.amber, x: 6.35, y: 5.5, w: 0.45, h: 0.45 });

  // independent-loop note
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 9.9, y: 4.95, w: 2.72, h: 1.55, rectRadius: 0.07, fill: { color: "16202B" }, line: { color: "33414F", width: 1 } });
  s.addText("SELF-REGULATING LOOPS", { x: 10.05, y: 5.08, w: 2.5, h: 0.3, fontFace: BFONT, fontSize: 10, bold: true, color: AMBER, charSpacing: 1.5, margin: 0 });
  s.addText("Barrel heat · bed PID · chamber · dryer — run on their own, not by the robot.", { x: 10.05, y: 5.4, w: 2.45, h: 1.0, fontFace: BFONT, fontSize: 11.5, color: "C7D2DD", lineSpacingMultiple: 1.05, margin: 0 });
  s.addText("Amber = robot-controlled in sync with motion     Steel = mechanical / feed path", { x: 0.72, y: 6.75, w: 12, h: 0.3, fontFace: BFONT, fontSize: 11, italic: true, color: "9DB0C2", margin: 0 });

  // ============================================================ S6 INTEGRATION PRINCIPLE
  s = p.addSlide(); s.background = { color: LIGHT };
  head(s, "The Core Idea", "The robot does only three things to the extruder");
  const three = [
    ["RUN / STOP", "Digital output  $OUT[n]", "Extrude on print moves, stop on travel moves.", I.bolt.amber],
    ["SET SPEED", "Analog output  $ANOUT[1]", "0–10 V proportional to sliced flow rate.", I.sync.amber],
    ["READ FAULT", "Digital input  $IN[n]", "Pause the print on an extruder fault.", I.warn.amber],
  ];
  let tx = 0.72, tw2 = 3.88, ty = 2.0, th = 2.78, tpx = 0.2;
  three.forEach((c, i) => {
    const x = tx + i * (tw2 + tpx);
    card(s, x, ty, tw2, th, CARD);
    s.addShape(p.shapes.OVAL, { x: x + 0.3, y: ty + 0.32, w: 0.95, h: 0.95, fill: { color: TINTW } });
    s.addImage({ data: c[3], x: x + 0.54, y: ty + 0.56, w: 0.47, h: 0.47 });
    s.addText(c[0], { x: x + 0.3, y: ty + 1.38, w: tw2 - 0.5, h: 0.38, fontFace: HFONT, fontSize: 19, bold: true, color: TEXT, margin: 0 });
    s.addText(c[1], { x: x + 0.3, y: ty + 1.76, w: tw2 - 0.5, h: 0.32, fontFace: "Courier New", fontSize: 12.5, bold: true, color: AMBER_DK, margin: 0 });
    s.addText(c[2], { x: x + 0.31, y: ty + 2.09, w: tw2 - 0.55, h: 0.62, fontFace: BFONT, fontSize: 12, color: MUTED, lineSpacingMultiple: 1.03, margin: 0 });
  });
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 0.72, y: 4.95, w: 11.9, h: 1.55, rectRadius: 0.08, fill: { color: INK } });
  s.addImage({ data: I.check.green, x: 1.05, y: 5.3, w: 0.7, h: 0.7 });
  s.addText("Everything thermal regulates itself.", { x: 1.95, y: 5.18, w: 10.4, h: 0.5, fontFace: HFONT, fontSize: 18, bold: true, color: "FFFFFF", margin: 0 });
  s.addText("Barrel heat zones, the heated bed, the chamber, and the dryer each run on their own controllers. The robot never manages temperature — which keeps the integration small and robust.", { x: 1.95, y: 5.68, w: 10.4, h: 0.7, fontFace: BFONT, fontSize: 13, color: "C7D2DD", lineSpacingMultiple: 1.1, margin: 0 });
  pageNum(s, 6);

  // ============================================================ S7 PLATFORM 1 TABLE
  s = p.addSlide(); s.background = { color: LIGHT };
  head(s, "Platform · 1 of 3", "Rigid print table, tied to the robot's base frame");
  const t7 = [
    "Size the build area to the reach — keep it ~1.0–1.5 m square, set 0.7–1.5 m in front of the base.",
    "Build a stiff steel weldment with a thick flat top plate (≥15–20 mm) — it must not flex when the heavy arm decelerates.",
    "Anchor it to the floor, ideally the same slab as the robot, so they can't move relative to each other.",
    "Add 3 hard reference features (dowels / machined pockets) at known XY — these become the base-calibration points.",
    "Mount the heated bed on top, on a thermal break so the frame doesn't sink the heat.",
  ];
  card(s, 0.72, 2.0, 7.0, 4.45, CARD);
  t7.forEach((t, i) => {
    const y = 2.32 + i * 0.82;
    s.addShape(p.shapes.OVAL, { x: 1.0, y, w: 0.5, h: 0.5, fill: { color: AMBER } });
    s.addText(`${i + 1}`, { x: 1.0, y, w: 0.5, h: 0.5, align: "center", valign: "middle", fontFace: HFONT, fontSize: 17, bold: true, color: "FFFFFF", margin: 0 });
    s.addText(t, { x: 1.66, y: y - 0.06, w: 5.85, h: 0.78, fontFace: BFONT, fontSize: 13, color: TEXT, lineSpacingMultiple: 1.05, valign: "middle", margin: 0 });
  });
  // diagram: table + base frame
  card(s, 7.95, 2.0, 4.67, 4.45, TINT);
  s.addText("BASE FRAME ON THE TABLE", { x: 8.2, y: 2.25, w: 4.2, h: 0.3, fontFace: BFONT, fontSize: 11, bold: true, color: STEEL_DK, charSpacing: 1.5, margin: 0 });
  // table top
  s.addShape(p.shapes.RECTANGLE, { x: 8.55, y: 3.95, w: 3.5, h: 0.45, fill: { color: "9FB0BF" }, line: { color: STEEL_DK, width: 1 } });
  s.addShape(p.shapes.RECTANGLE, { x: 8.85, y: 4.4, w: 0.32, h: 0.8, fill: { color: "7E8E9C" } });
  s.addShape(p.shapes.RECTANGLE, { x: 11.42, y: 4.4, w: 0.32, h: 0.8, fill: { color: "7E8E9C" } });
  // 3 reference dots
  [[8.95, 3.84], [11.55, 3.84], [10.6, 3.72]].forEach((d, i) => {
    s.addShape(p.shapes.OVAL, { x: d[0], y: d[1], w: 0.2, h: 0.2, fill: { color: AMBER } });
  });
  // axes
  s.addShape(p.shapes.LINE, { x: 9.1, y: 3.86, w: 1.4, h: 0, line: { color: RED, width: 2.5, endArrowType: "triangle" } });
  s.addShape(p.shapes.LINE, { x: 9.1, y: 3.86, w: 0, h: -0.95, line: { color: GREEN, width: 2.5, endArrowType: "triangle" } });
  s.addText("X", { x: 10.45, y: 3.88, w: 0.3, h: 0.3, fontFace: BFONT, fontSize: 12, bold: true, color: RED, margin: 0 });
  s.addText("Z", { x: 9.2, y: 2.78, w: 0.3, h: 0.3, fontFace: BFONT, fontSize: 12, bold: true, color: GREEN, margin: 0 });
  s.addText("Origin + 2 points teach the print coordinate system. Slice Z=0 then equals the real table top.", { x: 8.2, y: 5.55, w: 4.25, h: 0.8, fontFace: BFONT, fontSize: 12, italic: true, color: MUTED, lineSpacingMultiple: 1.1, margin: 0 });
  pageNum(s, 7);

  // ============================================================ S8 PLATFORM 2 BED
  s = p.addSlide(); s.background = { color: LIGHT };
  head(s, "Platform · 2 of 3", "Heated build bed — adhesion & warp control");
  const t8 = [
    "Build surface: flat aluminum tooling plate or borosilicate glass, sized to the build area.",
    "Heat with a high-wattage 240V silicone pad bonded underneath (LFAM beds run ~1.5 kW to 5 kW+).",
    "Control as an independent loop — thermocouple → PID controller → SSR → heater.",
    "Mount on the table over insulation + thermal-break standoffs to protect it and save energy.",
    "Adhesion: PEI sheet or glue, plus a wide brim/raft in the slice for big beads.",
  ];
  card(s, 0.72, 2.0, 7.0, 4.45, CARD);
  t8.forEach((t, i) => {
    const y = 2.32 + i * 0.82;
    s.addShape(p.shapes.OVAL, { x: 1.0, y, w: 0.5, h: 0.5, fill: { color: AMBER } });
    s.addText(`${i + 1}`, { x: 1.0, y, w: 0.5, h: 0.5, align: "center", valign: "middle", fontFace: HFONT, fontSize: 17, bold: true, color: "FFFFFF", margin: 0 });
    s.addText(t, { x: 1.66, y: y - 0.06, w: 5.85, h: 0.78, fontFace: BFONT, fontSize: 13, color: TEXT, lineSpacingMultiple: 1.05, valign: "middle", margin: 0 });
  });
  // right: control loop + stackup
  card(s, 7.95, 2.0, 4.67, 4.45, TINT);
  s.addText("INDEPENDENT CONTROL LOOP", { x: 8.2, y: 2.25, w: 4.3, h: 0.3, fontFace: BFONT, fontSize: 11, bold: true, color: STEEL_DK, charSpacing: 1.5, margin: 0 });
  const loop = [["Thermocouple", I.heat.steel], ["PID Controller", I.gear.steel], ["Solid-State Relay", I.bolt.steel], ["Silicone Heater", I.fire.steel]];
  loop.forEach((l, i) => {
    const y = 2.7 + i * 0.66;
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 8.3, y, w: 4.0, h: 0.52, rectRadius: 0.07, fill: { color: CARD }, line: { color: "D8E0E7", width: 1 } });
    s.addImage({ data: l[1], x: 8.45, y: y + 0.11, w: 0.3, h: 0.3 });
    s.addText(l[0], { x: 8.9, y, w: 3.3, h: 0.52, valign: "middle", fontFace: BFONT, fontSize: 13, bold: true, color: TEXT, margin: 0 });
    if (i < 3) s.addShape(p.shapes.LINE, { x: 10.3, y: y + 0.52, w: 0, h: 0.14, line: { color: STEEL, width: 2, endArrowType: "triangle" } });
  });
  s.addText("Runs by itself — the robot never sets bed temperature.", { x: 8.3, y: 5.5, w: 4.1, h: 0.8, fontFace: BFONT, fontSize: 12, italic: true, color: MUTED, lineSpacingMultiple: 1.1, margin: 0 });
  pageNum(s, 8);

  // ============================================================ S9 PLATFORM 3 ENCLOSURE
  s = p.addSlide(); s.background = { color: LIGHT };
  head(s, "Platform · 3 of 3", "Enclosure, fencing & safety interlocks");
  // two function cards
  card(s, 0.72, 2.0, 5.85, 2.05, CARD);
  s.addImage({ data: I.shield.amber, x: 1.0, y: 2.28, w: 0.6, h: 0.6 });
  s.addText("Machine guarding (required)", { x: 1.75, y: 2.3, w: 4.6, h: 0.45, fontFace: HFONT, fontSize: 16.5, bold: true, color: TEXT, margin: 0 });
  s.addText("Fence beyond the swept volume, one interlocked door, E-stops inside and out. A KR 150/180 at speed is lethal.", { x: 1.0, y: 2.95, w: 5.3, h: 0.95, fontFace: BFONT, fontSize: 12.5, color: MUTED, lineSpacingMultiple: 1.12, margin: 0 });
  card(s, 6.77, 2.0, 5.85, 2.05, CARD);
  s.addImage({ data: I.heat.amber, x: 7.05, y: 2.28, w: 0.6, h: 0.6 });
  s.addText("Thermal & fume chamber", { x: 7.8, y: 2.3, w: 4.6, h: 0.45, fontFace: HFONT, fontSize: 16.5, bold: true, color: TEXT, margin: 0 });
  s.addText("Insulated/poly panels keep a warm chamber (~60 °C, up to 150 °C) and contain fumes — duct an extractor out.", { x: 7.05, y: 2.95, w: 5.3, h: 0.95, fontFace: BFONT, fontSize: 12.5, color: MUTED, lineSpacingMultiple: 1.12, margin: 0 });
  // wiring row
  card(s, 0.72, 4.25, 11.9, 1.25, TINT);
  s.addText("WIRED INTO THE KR C2 SAFETY CIRCUIT (X11 / ESC — dual channel)", { x: 1.0, y: 4.42, w: 11, h: 0.3, fontFace: BFONT, fontSize: 11.5, bold: true, color: STEEL_DK, charSpacing: 1, margin: 0 });
  const wires = ["Door interlock → Operator Safety  C8–C10 / C9–C11", "External E-stops → C14–C15 / C16–D1", "Replace bridges with devices — never leave jumpered"];
  wires.forEach((wv, i) => {
    const x = 1.0 + i * 3.88;
    s.addImage({ data: I.dot.amber, x, y: 4.86, w: 0.16, h: 0.16 });
    s.addText(wv, { x: x + 0.27, y: 4.72, w: 3.42, h: 0.55, fontFace: BFONT, fontSize: 10.5, color: TEXT, lineSpacingMultiple: 1.0, valign: "middle", margin: 0 });
  });
  // caution banner
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 0.72, y: 5.72, w: 11.9, h: 0.92, rectRadius: 0.08, fill: { color: "FBE9E4" }, line: { color: RED, width: 1 } });
  s.addImage({ data: I.warn.red, x: 1.0, y: 5.95, w: 0.46, h: 0.46 });
  s.addText("Safety-circuit wiring must be done and validated by a qualified machine-safety integrator — not improvised with permanent jumpers.", { x: 1.6, y: 5.78, w: 10.8, h: 0.8, fontFace: BFONT, fontSize: 13, bold: true, color: "8A2A18", lineSpacingMultiple: 1.05, valign: "middle", margin: 0 });
  pageNum(s, 9);

  // ============================================================ S10 ELECTRICAL & I/O (blueprint)
  s = p.addSlide(); s.background = { color: BLUE };
  s.addText("ELECTRICAL & I/O", { x: 0.7, y: 0.5, w: 11, h: 0.3, fontFace: BFONT, fontSize: 13, bold: true, color: AMBER, charSpacing: 3, margin: 0 });
  s.addText("The DeviceNet I/O island", { x: 0.68, y: 0.82, w: 12, h: 0.7, fontFace: HFONT, fontSize: 31, bold: true, color: "FFFFFF", margin: 0 });
  // coupler
  bp(0.72, 2.2, 2.5, 1.5, "KR C2", "DeviceNet master", AMBER, I.gear.amber);
  arrow(3.28, 2.95, 0.5);
  bp(3.85, 2.2, 2.5, 1.5, "BK5120", "DeviceNet coupler\nMACID 11", STEEL, I.chip.steel);
  // three modules
  const mods = [
    ["KL4004 — Analog Out", "$ANOUT[1]  →  extruder speed (0–10 V)", AMBER, 2.2],
    ["KL2xxx — Digital Out", "$OUT[n]  →  extruder RUN / heater enable", AMBER, 3.55],
    ["KL1xxx — Digital In", "$IN[n]  ←  extruder ready / fault", STEEL, 4.9],
  ];
  mods.forEach(m => {
    arrow(6.4, m[3] + 0.27, 0.45);
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 6.9, y: m[3], w: 5.7, h: 1.05, rectRadius: 0.07, fill: { color: PANEL }, line: { color: m[2], width: 1.5 } });
    s.addText(m[0], { x: 7.1, y: m[3] + 0.13, w: 5.3, h: 0.35, fontFace: BFONT, fontSize: 13.5, bold: true, color: "FFFFFF", margin: 0 });
    s.addText(m[1], { x: 7.1, y: m[3] + 0.5, w: 5.3, h: 0.4, fontFace: "Courier New", fontSize: 12.5, color: "9DB0C2", margin: 0 });
  });
  // mapping note + power
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 0.72, y: 4.0, w: 5.6, h: 2.55, rectRadius: 0.07, fill: { color: "16202B" }, line: { color: "33414F", width: 1 } });
  s.addText("MAPPED IN  iosys.ini", { x: 1.0, y: 4.2, w: 5, h: 0.3, fontFace: BFONT, fontSize: 11.5, bold: true, color: AMBER, charSpacing: 1.5, margin: 0 });
  s.addText([
    { text: "ANOUT1=11,0,16,3", options: { breakLine: true } },
    { text: "outb0=11,8,x3", options: { breakLine: true } },
    { text: "Full-scale 0x6C00 = 27648 → 10 V", options: {} },
  ], { x: 1.0, y: 4.55, w: 5.2, h: 1.0, fontFace: "Courier New", fontSize: 12.5, color: "C7D2DD", lineSpacingMultiple: 1.25, margin: 0 });
  s.addText("Calibrate so $ANOUT[1]=1.0 → 10 V = max extrude rate. Bench-test before any print.", { x: 1.0, y: 5.7, w: 5.1, h: 0.7, fontFace: BFONT, fontSize: 12, italic: true, color: "9DB0C2", lineSpacingMultiple: 1.1, margin: 0 });
  s.addText("Power (licensed electrician): 480V 3-phase to the KR C2 sized to its nameplate (~7.5–13 kVA, not the sum of drive ratings). Bed, extruder box, dryer & loader on their own circuits.", { x: 6.9, y: 6.05, w: 5.7, h: 0.9, fontFace: BFONT, fontSize: 11.5, italic: true, color: "9DB0C2", lineSpacingMultiple: 1.1, margin: 0 });

  // ============================================================ S11 SOFTWARE PIPELINE
  s = p.addSlide(); s.background = { color: LIGHT };
  head(s, "Software", "From model to robot motion");
  const flow = [
    ["1", "CAD → Cura", "Slice the STL in Ultimaker Cura with the CuraToKRC2 plugin.", I.cube.amber],
    ["2", "Configure", "krl_config.json: tool A/B/C, HOME, Tool & Base numbers, flow constant. Enable Relative Extrusion.", I.gear.amber],
    ["3", "Export KRL", "Generates native .src / .dat, auto-split into subroutines to fit KR C2 RAM.", I.code.amber],
    ["4", "Transfer", "Copy files to the controller via USB or network share.", I.up.amber],
    ["5", "Run", "Robot follows the path; writes $ANOUT[1] for flow, toggles $OUT[n] for extrude on/off.", I.robot.amber],
  ];
  let fx = 0.72, fw = 2.28, fy = 2.1, fh = 3.0, fpx = 0.13;
  flow.forEach((c, i) => {
    const x = fx + i * (fw + fpx);
    card(s, x, fy, fw, fh, CARD);
    s.addShape(p.shapes.OVAL, { x: x + fw / 2 - 0.33, y: fy + 0.28, w: 0.66, h: 0.66, fill: { color: INK } });
    s.addText(c[0], { x: x + fw / 2 - 0.33, y: fy + 0.28, w: 0.66, h: 0.66, align: "center", valign: "middle", fontFace: HFONT, fontSize: 21, bold: true, color: AMBER, margin: 0 });
    s.addImage({ data: c[3], x: x + fw / 2 - 0.27, y: fy + 1.08, w: 0.54, h: 0.54 });
    s.addText(c[1], { x: x + 0.16, y: fy + 1.7, w: fw - 0.32, h: 0.4, align: "center", fontFace: HFONT, fontSize: 14.5, bold: true, color: TEXT, margin: 0 });
    s.addText(c[2], { x: x + 0.17, y: fy + 2.08, w: fw - 0.34, h: 0.85, align: "center", fontFace: BFONT, fontSize: 11, color: MUTED, lineSpacingMultiple: 1.05, margin: 0 });
    if (i < 4) s.addShape(p.shapes.LINE, { x: x + fw + 0.005, y: fy + 1.5, w: fpx - 0.01, h: 0, line: { color: AMBER, width: 2.5, endArrowType: "triangle" } });
  });
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 0.72, y: 5.45, w: 11.9, h: 1.05, rectRadius: 0.08, fill: { color: TINT } });
  s.addImage({ data: I.diagram.steel, x: 1.0, y: 5.7, w: 0.5, h: 0.5 });
  s.addText([
    { text: "Upgrade paths:  ", options: { bold: true, color: STEEL_DK } },
    { text: "KUKA|prc (Rhino/Grasshopper) for simulation & non-planar toolpaths · RoboDK + KUKA.RSI for live streaming (~4–12 ms) — add later, no drive changes.", options: { color: TEXT } },
  ], { x: 1.65, y: 5.55, w: 10.8, h: 0.85, fontFace: BFONT, fontSize: 12.5, valign: "middle", lineSpacingMultiple: 1.08, margin: 0 });
  pageNum(s, 11);

  // ============================================================ S12 CALIBRATION
  s = p.addSlide(); s.background = { color: LIGHT };
  head(s, "Calibration", "Tie the model, the nozzle, and the table together");
  card(s, 0.72, 2.05, 5.85, 3.55, CARD);
  s.addImage({ data: I.target.amber, x: 1.0, y: 2.33, w: 0.62, h: 0.62 });
  s.addText("Tool (TCP) — XYZ 4-point", { x: 1.78, y: 2.36, w: 4.6, h: 0.5, fontFace: HFONT, fontSize: 17, bold: true, color: TEXT, valign: "middle", margin: 0 });
  s.addText([
    { text: "Setup ▸ Measure ▸ Tool ▸ XYZ 4-point", options: { breakLine: true, bold: true, color: AMBER_DK } },
    { text: "Touch the nozzle tip to one fixed point from 4 orientations; the controller computes the TCP. Enter the tool A/B/C to match krl_config.json. Save as the Tool number.", options: {} },
  ], { x: 1.0, y: 3.15, w: 5.35, h: 2.3, fontFace: BFONT, fontSize: 13.5, color: TEXT, lineSpacingMultiple: 1.2, valign: "top", margin: 0 });
  card(s, 6.77, 2.05, 5.85, 3.55, CARD);
  s.addImage({ data: I.ruler.amber, x: 7.05, y: 2.33, w: 0.62, h: 0.62 });
  s.addText("Base — 3-point", { x: 7.83, y: 2.36, w: 4.6, h: 0.5, fontFace: HFONT, fontSize: 17, bold: true, color: TEXT, valign: "middle", margin: 0 });
  s.addText([
    { text: "Setup ▸ Measure ▸ Base ▸ 3-point", options: { breakLine: true, bold: true, color: AMBER_DK } },
    { text: "With the taught TCP, touch the table's 3 reference features: origin, a point on +X, a point in the XY plane. This builds the print coordinate frame. Save as the Base number.", options: {} },
  ], { x: 7.05, y: 3.15, w: 5.35, h: 2.3, fontFace: BFONT, fontSize: 13.5, color: TEXT, lineSpacingMultiple: 1.2, valign: "top", margin: 0 });
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 0.72, y: 5.78, w: 11.9, h: 0.82, rectRadius: 0.08, fill: { color: INK } });
  s.addImage({ data: I.check.green, x: 1.0, y: 5.97, w: 0.44, h: 0.44 });
  s.addText("Verify: jog to Base 0,0,0 — the nozzle should sit at the table origin; +X and +Y run along the table edges. Re-touch after any crash.", { x: 1.6, y: 5.78, w: 10.8, h: 0.82, fontFace: BFONT, fontSize: 13, color: "FFFFFF", valign: "middle", lineSpacingMultiple: 1.05, margin: 0 });
  pageNum(s, 12);

  // ============================================================ S13 COMMISSIONING TIMELINE (chart)
  s = p.addSlide(); s.background = { color: LIGHT };
  head(s, "Roadmap", "Commissioning sequence");
  const phases = ["1 Robot alone (motion check)", "2 Safety circuit validated", "3 I/O bench test", "4 Tool & base calibration", "5 Dry run in air", "6 Heat soak", "7 First print (PP/PETG)", "8 Scale up + engineering resins"];
  const dur = [2, 4, 3, 2, 2, 1, 3, 6];
  s.addChart(p.charts.BAR, [{ name: "Days", labels: phases, values: dur }], {
    x: 0.6, y: 1.95, w: 8.3, h: 4.85, barDir: "bar",
    chartColors: [AMBER],
    chartArea: { fill: { color: LIGHT } }, plotArea: { fill: { color: LIGHT } },
    catAxisLabelColor: TEXT, catAxisLabelFontFace: BFONT, catAxisLabelFontSize: 11.5,
    valAxisLabelColor: MUTED, valAxisLabelFontSize: 10, valAxisTitle: "Indicative effort (days)", showValAxisTitle: true, valAxisTitleColor: MUTED, valAxisTitleFontSize: 11,
    valGridLine: { color: "E2E8EE", size: 0.5 }, catGridLine: { style: "none" },
    barGapWidthPct: 45, showValue: true, dataLabelPosition: "outEnd", dataLabelColor: TEXT, dataLabelFontFace: BFONT, dataLabelFontSize: 11, dataLabelFormatCode: '0" d"',
    showLegend: false, showTitle: false,
  });
  // right rail gating note
  card(s, 9.2, 2.0, 3.45, 4.6, INK);
  s.addImage({ data: I.warn.amber, x: 9.5, y: 2.3, w: 0.55, h: 0.55 });
  s.addText("Gate everything on Step 2", { x: 9.5, y: 2.95, w: 2.9, h: 0.7, fontFace: HFONT, fontSize: 17, bold: true, color: "FFFFFF", lineSpacingMultiple: 0.98, margin: 0 });
  s.addText("Do not run the arm near the table until the door interlock and every E-stop are proven to stop it.", { x: 9.5, y: 3.7, w: 2.9, h: 1.2, fontFace: BFONT, fontSize: 13, color: "C7D2DD", lineSpacingMultiple: 1.15, margin: 0 });
  s.addShape(p.shapes.LINE, { x: 9.5, y: 4.95, w: 2.85, h: 0, line: { color: "33414F", width: 1 } });
  s.addText("First real print: a single-wall cylinder in PP or PETG (no drying needed) to dial in temp, bead width & flow.", { x: 9.5, y: 5.12, w: 2.9, h: 1.3, fontFace: BFONT, fontSize: 12.5, italic: true, color: "9DB0C2", lineSpacingMultiple: 1.15, margin: 0 });
  pageNum(s, 13);

  // ============================================================ S14 BUDGET (chart)
  s = p.addSlide(); s.background = { color: LIGHT };
  head(s, "Budget", "Remaining spend — entry path");
  const blab = ["Safety\nfencing", "Electrical\ninstall", "Heated\nbed", "Print\ntable", "Flange\nadapter", "I/O\nisland", "Slicer\nsoftware"];
  const bval = [4000, 3500, 2500, 1500, 1000, 300, 0];
  s.addChart(p.charts.BAR, [{ name: "USD", labels: blab, values: bval }], {
    x: 0.6, y: 2.0, w: 7.95, h: 4.5, barDir: "col",
    chartColors: [STEEL],
    chartArea: { fill: { color: LIGHT } }, plotArea: { fill: { color: LIGHT } },
    catAxisLabelColor: TEXT, catAxisLabelFontFace: BFONT, catAxisLabelFontSize: 11,
    valAxisLabelColor: MUTED, valAxisLabelFontSize: 10, valAxisMinVal: 0,
    valGridLine: { color: "E2E8EE", size: 0.5 }, catGridLine: { style: "none" },
    barGapWidthPct: 50, showValue: true, dataLabelPosition: "outEnd", dataLabelColor: TEXT, dataLabelFontFace: BFONT, dataLabelFontSize: 10.5, dataLabelFormatCode: '"$"#,##0',
    showLegend: false, showTitle: false,
  });
  // right rail stats
  card(s, 8.85, 2.0, 3.8, 2.15, INK);
  s.addText("~$12.8k", { x: 9.1, y: 2.25, w: 3.3, h: 0.8, fontFace: HFONT, fontSize: 40, bold: true, color: AMBER, margin: 0 });
  s.addText("estimated remaining for a working entry-level cell", { x: 9.1, y: 3.1, w: 3.35, h: 0.9, fontFace: BFONT, fontSize: 13, color: "C7D2DD", lineSpacingMultiple: 1.12, margin: 0 });
  card(s, 8.85, 4.35, 3.8, 2.15, CARD);
  s.addImage({ data: I.check.green, x: 9.1, y: 4.6, w: 0.5, h: 0.5 });
  s.addText("Already owned", { x: 9.7, y: 4.62, w: 2.8, h: 0.45, fontFace: HFONT, fontSize: 15, bold: true, color: TEXT, valign: "middle", margin: 0 });
  s.addText("Robot, extruder, dryer & autoloader. Skipping the EtherCAT/drive swap avoids several thousand more.", { x: 9.1, y: 5.18, w: 3.35, h: 1.2, fontFace: BFONT, fontSize: 12.5, color: MUTED, lineSpacingMultiple: 1.12, margin: 0 });
  pageNum(s, 14);

  // ============================================================ S15 OWNERSHIP / CLOSE (dark)
  s = p.addSlide(); s.background = { color: INK };
  s.addText("WHO DOES WHAT", { x: 0.85, y: 0.7, w: 11, h: 0.35, fontFace: BFONT, fontSize: 14, bold: true, color: AMBER, charSpacing: 3, margin: 0 });
  s.addText("Three owners, one cell", { x: 0.83, y: 1.1, w: 12, h: 0.8, fontFace: HFONT, fontSize: 33, bold: true, color: "FFFFFF", margin: 0 });
  const own = [
    ["Licensed Electrician", "480V feeder, disconnect, grounding, and the high-power bed/chamber circuits.", I.plug.amber],
    ["Safety Integrator", "X11 / ESC wiring of fence interlock + E-stops, and validation that they stop the robot.", I.shield.amber],
    ["You", "Table, bed, enclosure shell, I/O island, slicer setup, and calibration — stage and bench-test.", I.tools.amber],
  ];
  let ox = 0.85, ow = 3.84, oy = 2.2, oh = 2.7, opx = 0.2;
  own.forEach((c, i) => {
    const x = ox + i * (ow + opx);
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y: oy, w: ow, h: oh, rectRadius: 0.08, fill: { color: PANEL } });
    s.addShape(p.shapes.OVAL, { x: x + 0.32, y: oy + 0.32, w: 0.95, h: 0.95, fill: { color: "2C3845" } });
    s.addImage({ data: c[2], x: x + 0.56, y: oy + 0.56, w: 0.47, h: 0.47 });
    s.addText(c[0], { x: x + 0.32, y: oy + 1.42, w: ow - 0.6, h: 0.5, fontFace: HFONT, fontSize: 18, bold: true, color: "FFFFFF", margin: 0 });
    s.addText(c[1], { x: x + 0.33, y: oy + 1.95, w: ow - 0.62, h: 0.7, fontFace: BFONT, fontSize: 12.5, color: "B9C5D1", lineSpacingMultiple: 1.12, margin: 0 });
  });
  // gating reminder banner
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 0.85, y: 5.25, w: 11.65, h: 1.45, rectRadius: 0.08, fill: { color: "2A1E12" }, line: { color: AMBER, width: 1.5 } });
  s.addImage({ data: I.warn.amber, x: 1.15, y: 5.62, w: 0.7, h: 0.7 });
  s.addText([
    { text: "Resolve first:  ", options: { bold: true, color: AMBER } },
    { text: "confirm the extruder control box accepts an external RUN/STOP + speed signal. That single answer decides how good the prints can be — check its wiring manual before ordering the I/O island.", options: { color: "EAD9C6" } },
  ], { x: 2.05, y: 5.35, w: 10.2, h: 1.25, fontFace: BFONT, fontSize: 14, valign: "middle", lineSpacingMultiple: 1.12, margin: 0 });

  await p.writeFile({ fileName: "KUKA_Pellet_3D_Printer_Implementation.pptx" });
  console.log("WROTE DECK");
})();

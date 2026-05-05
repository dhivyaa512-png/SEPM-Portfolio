/* ===== NAVIGATION ===== */
const pages = document.querySelectorAll('.page');
const links = document.querySelectorAll('.sb-link');
const overlay = document.getElementById('overlay');
const sidebar = document.getElementById('sidebar');

function navigate(sectionId) {
  // Update nav links
  links.forEach(l => l.classList.remove('active'));
  const activeLink = document.querySelector(`.sb-link[data-sec="${sectionId}"]`);
  if(activeLink) activeLink.classList.add('active');

  // Update pages
  pages.forEach(p => p.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');

  // Update Progress Bar based on index
  const idx = Array.from(pages).findIndex(p => p.id === sectionId);
  const pct = Math.round((idx / (pages.length - 1)) * 100) || 0;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressVal').innerText = pct + '%';

  window.scrollTo(0,0);
  if(window.innerWidth <= 900) closeMenu();
}

links.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navigate(link.dataset.sec);
  });
});

/* ===== MOBILE MENU ===== */
document.getElementById('burger').addEventListener('click', () => {
  sidebar.classList.add('open');
  overlay.classList.add('show');
});
function closeMenu() {
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
}
overlay.addEventListener('click', closeMenu);

/* ===== TABS (Generic) ===== */
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', function() {
    const parent = this.closest('.page');
    parent.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    this.classList.add('active');
    document.getElementById(this.dataset.tab).classList.add('active');
  });
});

/* ===== UNIT 1: PROCESS MODELS ===== */
const models = {
  waterfall: { t: "🌊 Waterfall Model", d: "Sequential, linear progression. Phases: Requirements → Design → Implementation → Testing → Maintenance. Best for rigid, well-understood requirements." },
  incremental: { t: "📈 Incremental Model", d: "Core product built first, then features added in increments. Good for getting an early MVP to market." },
  spiral: { t: "🌀 Spiral Model", d: "Risk-driven approach. Cycles through planning, risk analysis, engineering, and evaluation. Excellent for large, high-risk projects." },
  agile: { t: "⚡ Agile / Scrum", d: "Iterative sprints (1-4 weeks). Adapts to changing requirements quickly. Daily standups, Sprint Planning, Retrospectives." },
  xp: { t: "🚀 Extreme Programming (XP)", d: "Focuses on engineering practices: Pair programming, Test-Driven Development (TDD), Continuous Integration, frequent releases." }
};

document.querySelectorAll('.ms-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.ms-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const m = models[this.dataset.model];
    document.getElementById('modelDisplay').innerHTML = `<h3>${m.t}</h3>`;
    document.getElementById('modelInfo').innerHTML = `<p>${m.d}</p>`;
  });
});
// Init U1
document.getElementById('modelDisplay').innerHTML = `<h3>🌊 Waterfall Model</h3>`;
document.getElementById('modelInfo').innerHTML = `<p>${models.waterfall.d}</p>`;

/* ===== UNIT 1: SCRUM BOARD ===== */
let dragged = null;
function dragCard(e) { dragged = e.target; }
function dropCard(e, colId) {
  e.preventDefault();
  if(dragged) document.getElementById(colId).appendChild(dragged);
}

/* ===== UNIT 1: FLASHCARDS ===== */
function toggleConcept(el) {
  el.classList.toggle('flipped');
}

/* ===== UNIT 2: COCOMO CALC ===== */
const cocomoTable = {
  organic: { a: 2.4, b: 1.05, c: 2.5, d: 0.38 },
  semidetached: { a: 3.0, b: 1.12, c: 2.5, d: 0.35 },
  embedded: { a: 3.6, b: 1.20, c: 2.5, d: 0.32 }
};
function updateCocomo() {
  document.getElementById('klocVal').innerText = document.getElementById('klocRange').value + " KLOC";
}
function calcCocomo() {
  const kloc = parseFloat(document.getElementById('klocRange').value);
  const type = document.querySelector('input[name="ptype"]:checked').value;
  const vals = cocomoTable[type];
  const effort = vals.a * Math.pow(kloc, vals.b);
  const time = vals.c * Math.pow(effort, vals.d);
  const staff = effort / time;

  document.getElementById('cocomoResult').innerHTML = `
    <div>
      <div class="cr-val">${effort.toFixed(1)} PM</div>
      <p>Estimated Effort (Person-Months)</p>
      <hr style="border:0;border-top:1px solid rgba(255,255,255,0.2);margin:1rem 0">
      <div style="display:flex;justify-content:space-around;color:#a5f3fc">
        <div><strong>${time.toFixed(1)}</strong> Months</div>
        <div><strong>${Math.round(staff)}</strong> Devs needed</div>
      </div>
    </div>
  `;
}

/* ===== UNIT 2: FUNCTION POINTS ===== */
function calcFP() {
  const ei = parseInt(document.getElementById('fp-ei').value||0) * 4;
  const eo = parseInt(document.getElementById('fp-eo').value||0) * 5;
  const eq = parseInt(document.getElementById('fp-eq').value||0) * 4;
  const ilf = parseInt(document.getElementById('fp-ilf').value||0) * 7;
  const eif = parseInt(document.getElementById('fp-eif').value||0) * 5;
  const total = ei + eo + eq + ilf + eif;
  document.getElementById('fpResult').innerHTML = `Unadjusted Function Points (UFP) = <strong>${total}</strong>`;
}
calcFP();

/* ===== UNIT 2: REQUIREMENTS ===== */
function toggleReq(el) { el.classList.toggle('done'); }
function addReq(type) {
  const text = prompt("Enter new requirement:");
  if(!text) return;
  const div = document.createElement('div');
  div.className = 'req-item';
  div.textContent = text;
  div.onclick = function() { toggleReq(this) };
  document.getElementById(type === 'func' ? 'funcReqs' : 'nonFuncReqs').appendChild(div);
}

/* ===== UNIT 3: UML & GUI ===== */
const umlData = {
  class: { d: "Shows system structure via classes, attributes, methods, and relationships. Core of Object-Oriented design." },
  usecase: { d: "Shows interactions between actors (users/systems) and the system. Defines WHAT the system does, not HOW." },
  sequence: { d: "Shows object interactions arranged in time sequence. Uses lifelines and messages." },
  component: { d: "Shows structural relationships between software components and interfaces." },
  collab: { d: "Similar to sequence diagrams but focuses on the structural organization of objects that send/receive messages." }
};
document.querySelectorAll('.uml-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.uml-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    document.getElementById('umlViewer').innerHTML = `<h3>${this.innerText}</h3>`;
    document.getElementById('umlExplain').innerHTML = `<strong>Description:</strong> ${umlData[this.dataset.uml].d}`;
  });
});
// Init U3
document.getElementById('umlViewer').innerHTML = `<h3>Class Diagram</h3>`;
document.getElementById('umlExplain').innerHTML = `<strong>Description:</strong> ${umlData.class.d}`;

function showGuiInfo(el) {
  const box = document.getElementById('guiInfoBox');
  box.style.display = 'block';
  const info = {
    menu: "Menus organize commands logically without cluttering the screen.",
    button: "Buttons trigger specific actions. Good design requires clear labels and states (hover, active, disabled).",
    scroll: "Scrollbars allow viewing content larger than the visible area. Should be unintrusive.",
    dialog: "Dialogs interrupt flow to request input or show critical information (Error, Warning, Success).",
    icon: "Icons provide visual cues and save space. They must be universally recognizable.",
    panel: "Panels group related controls visually, applying the principle of cohesion in UI."
  };
  box.innerHTML = `<strong>${el.toUpperCase()}:</strong> ${info[el]}`;
}

/* ===== UNIT 4: TESTING LAB ===== */
function selectTest(type) {
  const det = document.getElementById('testDetail');
  det.style.display = 'block';
  if(type === 'bb') {
    det.innerHTML = `<h4>⬛ Black-Box Testing Methods</h4><ul><li><strong>Equivalence Partitioning:</strong> Divides input into valid/invalid classes.</li><li><strong>Boundary Value Analysis:</strong> Tests edges of ranges (e.g. if max is 100, test 99, 100, 101).</li><li><strong>Error Guessing:</strong> Based on tester's experience.</li></ul>`;
  } else {
    det.innerHTML = `<h4>⬜ White-Box Testing Methods</h4><ul><li><strong>Statement Coverage:</strong> Every line of code executed once.</li><li><strong>Branch/Decision Coverage:</strong> Every if/else path executed.</li><li><strong>Path Coverage:</strong> Every possible route through code is tested.</li></ul>`;
  }
}
function showPyrInfo(layer) {
  const info = document.getElementById('pyrInfo');
  info.style.display = 'block';
  if(layer === 'e2e') info.innerHTML = "<strong>System / E2E Testing:</strong> Tests the complete, integrated software as a whole against requirements. Validates user flows.";
  if(layer === 'integration') info.innerHTML = "<strong>Integration Testing:</strong> Tests interfaces and data flow between individual modules (Top-down, Bottom-up, Sandwich).";
  if(layer === 'unit') info.innerHTML = "<strong>Unit Testing:</strong> Tests individual functions/components in isolation. Usually done by developers using mock data.";
}

/* ===== UNIT 5: RISK MATRIX & RMMM ===== */
const riskMap = [
  ['c-y', 'c-y', 'c-r'],
  ['c-g', 'c-y', 'c-y'],
  ['c-g', 'c-g', 'c-y']
];
const rmWrap = document.getElementById('riskMatrix');
for(let row=0; row<3; row++) {
  for(let col=0; col<3; col++) {
    const div = document.createElement('div');
    div.className = `rm-cell ${riskMap[row][col]}`;
    div.onclick = () => showRiskCell(row, col);
    rmWrap.appendChild(div);
  }
}
function showRiskCell(r, c) {
  const probs = ['High', 'Medium', 'Low'];
  const imps = ['Low', 'Medium', 'High'];
  let action = r===0 && c===2 ? '🚨 CRITICAL: Immediate RMMM required.' : (r===2 && c===0 ? '✅ LOW: Monitor occasionally.' : '⚠️ MODERATE: Needs mitigation plan.');
  document.getElementById('riskPanel').innerHTML = `<strong>Selected Risk:</strong> Probability: ${probs[r]} | Impact: ${imps[c]}<br><br>${action}`;
}

function addRisk() {
  const name = document.getElementById('riskName').value;
  const cat = document.getElementById('riskCat').value;
  const like = document.getElementById('riskLikelihood').value;
  if(!name) return alert("Enter risk name");
  
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><strong>${name}</strong></td>
    <td>${cat.toUpperCase()}</td>
    <td>${like.toUpperCase()}</td>
    <td contenteditable="true" style="background:rgba(255,255,255,0.05);border:1px dashed #666">Click to edit...</td>
    <td contenteditable="true" style="background:rgba(255,255,255,0.05);border:1px dashed #666">Click to edit...</td>
    <td contenteditable="true" style="background:rgba(255,255,255,0.05);border:1px dashed #666">Click to edit...</td>
    <td><button class="del-btn" onclick="this.closest('tr').remove()">✕</button></td>
  `;
  document.getElementById('rmmmBody').appendChild(tr);
  document.getElementById('riskName').value = '';
}

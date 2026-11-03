// Animated walkthrough of how Apex measures a countertop: the shoelace formula,
// run edge by edge on an L-shaped counter, then the island, then the total.
(function () {
  var root = document.getElementById('apex-math');
  if (!root) return;

  var NS = 'http://www.w3.org/2000/svg';
  var svg = root.querySelector('svg');
  var codeLines = root.querySelectorAll('.am-code [data-line]');
  var out = root.querySelector('.am-out');

  // L-shaped counter in inches (y grows downward), plus a 72" x 36" island.
  var L = [[0, 0], [120, 0], [120, 25.5], [25.5, 25.5], [25.5, 95], [0, 95]];
  var ISLAND = { x: 50, y: 52, w: 72, h: 36 };
  var DIMS = ['120″', '25.5″', '94.5″', '69.5″', '25.5″', '95″'];

  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    (parent || svg).appendChild(n);
    return n;
  }
  function fmt(n, d) {
    return n.toLocaleString('en-US', { minimumFractionDigits: d || 0, maximumFractionDigits: d === undefined ? 2 : d });
  }
  function num(n) { return Number(n.toFixed(2)).toLocaleString('en-US', { maximumFractionDigits: 2 }); }

  // Static layers
  var gTri = el('g', {});
  var shape = el('polygon', { points: L.map(function (p) { return p.join(','); }).join(' '), class: 'am-shape' });
  var gEdges = el('g', {});
  var island = el('rect', { x: ISLAND.x, y: ISLAND.y, width: ISLAND.w, height: ISLAND.h, rx: 1, class: 'am-island' });
  var islandLbl = el('text', { x: ISLAND.x + ISLAND.w / 2, y: ISLAND.y + ISLAND.h / 2 + 2, class: 'am-lbl am-mid' });
  islandLbl.textContent = '72″ × 36″';
  var origin = el('circle', { cx: 0, cy: 0, r: 1.8, class: 'am-origin' });
  var originLbl = el('text', { x: -3, y: -4, class: 'am-lbl am-end' });
  originLbl.textContent = '(0, 0)';

  var edges = [], labels = [];
  L.forEach(function (p, i) {
    var q = L[(i + 1) % L.length];
    edges.push(el('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1], class: 'am-edge' }, gEdges));
    var mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
    var horiz = p[1] === q[1];
    var t = el('text', {
      x: mx + (horiz ? 0 : (i === 5 ? -4 : 4)),
      y: my + (horiz ? (i === 0 ? -4 : 7) : 2),
      class: 'am-lbl ' + (horiz ? 'am-mid' : (i === 5 ? 'am-end' : ''))
    }, gEdges);
    t.textContent = DIMS[i];
    labels.push(t);
  });
  var tri = el('polygon', { points: '0,0 0,0 0,0', class: 'am-tri' }, gTri);

  function setCode(n) {
    codeLines.forEach(function (c) { c.classList.toggle('on', +c.getAttribute('data-line') === n); });
  }
  function show(nodes, on) { nodes.forEach(function (n) { n.classList.toggle('show', on); }); }
  function lines(arr) { out.innerHTML = arr.map(function (l) { return '<div>' + l + '</div>'; }).join(''); }

  // Build the timeline once
  var steps = [];
  function step(ms, fn) { steps.push({ ms: ms, fn: fn }); }

  step(500, function () {
    show(edges, false); show(labels, false); shape.classList.remove('show'); island.classList.remove('show');
    islandLbl.classList.remove('show'); tri.classList.remove('show'); setCode(-1);
    lines(['<span class="am-dim">// enter each edge…</span>']);
  });
  L.forEach(function (_, i) {
    step(320, function () { edges[i].classList.add('show'); labels[i].classList.add('show'); });
  });
  step(500, function () { shape.classList.add('show'); setCode(1); lines(['<span class="am-dim">let</span> area = 0']); });

  var sum = 0;
  L.forEach(function (p, i) {
    var q = L[(i + 1) % L.length];
    var term = p[0] * q[1] - q[0] * p[1];
    var before = sum; sum += term;
    var after = sum;
    step(term ? 1100 : 550, function () {
      edges.forEach(function (e, k) { e.classList.toggle('hot', k === i); });
      tri.setAttribute('points', '0,0 ' + p.join(',') + ' ' + q.join(','));
      tri.classList.toggle('show', !!term);
      setCode(6);
      lines([
        'edge ' + (i + 1) + ': ' + num(p[0]) + '×' + num(q[1]) + ' − ' + num(q[0]) + '×' + num(p[1]) + ' = <b>' + num(term) + '</b>',
        '<span class="am-dim">area</span> = ' + num(before) + ' + ' + num(term) + ' = <b>' + num(after) + '</b>'
      ]);
    });
  });
  step(1300, function () {
    edges.forEach(function (e) { e.classList.remove('hot'); }); tri.classList.remove('show'); setCode(8);
    lines(['|' + num(sum) + '| ÷ 2 = <b>' + fmt(sum / 2, 2) + ' in²</b>']);
  });
  step(1500, function () {
    setCode(12);
    lines([
      '|' + num(sum) + '| ÷ 2 = ' + fmt(sum / 2, 2) + ' in²',
      fmt(sum / 2, 2) + ' ÷ 144 = <b>' + fmt(sum / 2 / 144, 2) + ' sq ft</b>  <span class="am-dim">L-shape</span>'
    ]);
  });
  step(1300, function () {
    island.classList.add('show'); islandLbl.classList.add('show');
    lines([
      'L-shape&nbsp;&nbsp;' + fmt(sum / 2 / 144, 2) + ' sq ft',
      'island&nbsp;&nbsp;&nbsp;72 × 36 ÷ 144 = <b>18.00 sq ft</b>'
    ]);
  });
  step(1800, function () {
    setCode(-1);
    var total = sum / 2 / 144 + ISLAND.w * ISLAND.h / 144;
    lines([
      'total&nbsp;&nbsp;&nbsp;&nbsp;<b class="am-big">' + fmt(total, 2) + ' sq ft</b>',
      '<span class="am-dim">→ × the shop’s tier rate, on the server</span>'
    ]);
  });
  step(2600, function () {
    lines([
      'total&nbsp;&nbsp;&nbsp;&nbsp;<b class="am-big">' + fmt(sum / 2 / 144 + 18, 2) + ' sq ft</b>',
      '<span class="am-lock"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 7V5a4 4 0 1 1 8 0v2h.5A1.5 1.5 0 0 1 14 8.5v5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5v-5A1.5 1.5 0 0 1 3.5 7H4Zm2 0h4V5a2 2 0 1 0-4 0v2Z"/></svg> priced server-side, rates stay private</span>'
    ]);
  });

  // Run the loop only while visible; show the finished state for reduced motion.
  var i = 0, timer = null, visible = false;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function tick() {
    if (!visible) { timer = null; return; }
    var s = steps[i]; s.fn(); i = (i + 1) % steps.length;
    timer = setTimeout(tick, s.ms);
  }
  if (reduce) {
    steps.forEach(function (s) { s.fn(); });
    show(edges, true); show(labels, true); shape.classList.add('show');
    return;
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible && !timer) tick();
    }, { threshold: 0.25 }).observe(root);
  } else { visible = true; tick(); }
})();

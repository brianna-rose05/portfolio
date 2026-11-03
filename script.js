(function(){
  var pages = ['home','apex','research','projects','writing','photos'];
  function show(){
    var h = (location.hash || '').slice(1);
    var route = pages.indexOf(h) >= 0 ? h : 'home';
    var anchor = (h && pages.indexOf(h) < 0) ? h : null;
    document.querySelectorAll('[data-page]').forEach(function(el){
      var on = el.getAttribute('data-page') === route;
      el.hidden = !on;
    });
    document.querySelectorAll('[data-route]').forEach(function(a){
      if (a.getAttribute('data-route') === route) a.setAttribute('aria-current','page');
      else a.removeAttribute('aria-current');
    });
    if (anchor) { var t = document.getElementById(anchor); if (t) { t.scrollIntoView({behavior:'smooth'}); return; } }
    window.scrollTo(0,0);
  }
  window.addEventListener('hashchange', show);
  show();

  // Placeholder links: show what's missing instead of going nowhere
  document.querySelectorAll('a[data-todo]').forEach(function(a){
    a.addEventListener('click', function(e){
      e.preventDefault();
      var orig = a.textContent;
      a.textContent = 'needs ' + a.getAttribute('data-todo');
      setTimeout(function(){ a.textContent = orig; }, 1600);
    });
  });

  document.getElementById('totop').addEventListener('click', function(e){
    e.preventDefault(); window.scrollTo({top:0, behavior:'smooth'});
  });

  var btn = document.getElementById('copy');
  btn.addEventListener('click', function(){
    var text = document.getElementById('email').textContent;
    var done = function(){ btn.textContent = 'copied'; setTimeout(function(){ btn.textContent = 'copy'; }, 1400); };
    try {
      navigator.clipboard.writeText(text).then(done, function(){ selectEmail(); });
    } catch(err){ selectEmail(); }
  });
  function selectEmail(){
    var r = document.createRange(); r.selectNodeContents(document.getElementById('email'));
    var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
  }

  // Site previews: hovering a link with data-preview pops up a screenshot of that site
  var pv = document.createElement('img');
  pv.className = 'site-preview'; pv.alt = ''; pv.setAttribute('aria-hidden', 'true');
  document.body.appendChild(pv);
  var canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
  if (canHover) {
    document.querySelectorAll('a[data-preview]').forEach(function(a){
      a.addEventListener('mouseenter', function(){
        var full = a.hasAttribute('data-preview-full');
        pv.classList.toggle('full', full);
        var place = function(){
          var r = a.getBoundingClientRect(), w = 360;
          var h = full && pv.naturalWidth ? Math.round(w * pv.naturalHeight / pv.naturalWidth) : 225;
          var left = Math.min(Math.max(8, r.left), window.innerWidth - w - 8);
          var top = r.top - h - 10 < 8 ? r.bottom + 10 : r.top - h - 10;
          pv.style.left = (left + window.scrollX) + 'px';
          pv.style.top = (top + window.scrollY) + 'px';
        };
        pv.onload = place;
        pv.src = a.getAttribute('data-preview');
        place();
        pv.classList.add('on');
      });
      a.addEventListener('mouseleave', function(){ pv.classList.remove('on'); });
    });
  }
})();

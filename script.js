(function(){
  var pages = ['home','projects','writing','photos'];
  function show(){
    var h = (location.hash || '').slice(1);
    var route = pages.indexOf(h) >= 0 ? h : 'home';
    var anchor = (h && pages.indexOf(h) < 0) ? h : null;
    document.querySelectorAll('[data-page]').forEach(function(el){
      var on = el.getAttribute('data-page') === route;
      el.hidden = !on;
      el.style.display = on ? 'flex' : '';
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
})();

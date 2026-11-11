/* ==========================================================
   STEP — AKC & Leadership Subpage · akc.js
   ========================================================== */

(function() {
  var $ = function(s, c) {
    return Array.prototype.slice.call((c || document).querySelectorAll(s));
  };
  var lerp = function(a, b, t) {
    return a + (b - a) * t;
  };

  /* split text into masked words */
  $('[data-split]').forEach(function(el) {
    var out = [];
    el.childNodes.forEach(function(n) {
      if (n.nodeType === 3) {
        n.textContent.split(/\s+/).filter(Boolean).forEach(function(w) {
          out.push('<b class="w"><i>' + w + '</i></b> ');
        });
      } else if (n.nodeName === 'BR') {
        out.push('<br>');
      } else {
        out.push('<b class="w"><i>' + n.outerHTML + '</i></b> ');
      }
    });
    el.innerHTML = out.join('');
    $('.w i', el).forEach(function(i, k) {
      i.style.transitionDelay = (k * .09) + 's';
    });
  });

  /* preloader */
  var pn = document.getElementById('pn'), pre = document.getElementById('pre'), bar = $('.bar', pre)[0], c = 0;
  var ld = setInterval(function() {
    c += Math.ceil(Math.random() * 6);
    if (c > 100) c = 100;
    if (pn) pn.textContent = c;
    if (bar) bar.style.width = c + '%';
    if (c === 100) {
      clearInterval(ld);
      setTimeout(function() {
        if (pre) pre.classList.add('done');
        document.body.classList.remove('loading');
        setTimeout(function() {
          $('#hero .w').forEach(function(w) { w.classList.add('in'); });
          $('#hero .rv').forEach(function(r) { r.classList.add('in'); });
        }, 500);
      }, 350);
    }
  }, 40);

  /* reveal intersection observer */
  var io = new IntersectionObserver(function(es) {
    es.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: .2 });

  $('.rv,.img,.w').forEach(function(el) {
    if (!el.closest('#hero')) io.observe(el);
  });

  /* theme morphing */
  var tio = new IntersectionObserver(function(es) {
    es.forEach(function(e) {
      if (e.isIntersecting) {
        document.body.classList.toggle('light', e.target.dataset.theme === 'light');
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' });

  $('[data-theme]').forEach(function(s) {
    tio.observe(s);
  });

  /* custom cursor */
  var cur = document.getElementById('cur'), mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
  addEventListener('mousemove', function(e) {
    mx = e.clientX;
    my = e.clientY;
  });

  $('a,button').forEach(function(a) {
    a.addEventListener('mouseenter', function() { if (cur) cur.classList.add('big'); });
    a.addEventListener('mouseleave', function() { if (cur) cur.classList.remove('big'); });
  });

  /* scroll loop for sun & parallax */
  var sun = document.getElementById('sun');
  var pics = $('.pic[data-speed]');

  function tick() {
    cx = lerp(cx, mx, .18);
    cy = lerp(cy, my, .18);
    if (cur) cur.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
    
    var h = document.documentElement.scrollHeight - innerHeight, p = scrollY / (h || 1), vh = innerHeight;

    if (sun) {
      var sc = lerp(1, .15, Math.min(p / .6, 1));
      sun.style.transform = 'translate(-50%,-50%) scale(' + sc + ')';
    }

    pics.forEach(function(el) {
      var b = el.parentNode.getBoundingClientRect();
      el.style.transform = 'translateY(' + ((b.top + b.height / 2 - vh / 2) * (+el.dataset.speed)) + 'px)';
    });

    requestAnimationFrame(tick);
  }
  tick();
})();
/* ==========================================================
   STEP — Turkana · script.js
   Text split · Preloader · Reveal · Counters · Theme · Cursor
   Scroll loop (sun, scrub, horizontal programs, parallax) · Photos
   ========================================================== */

(function() {
  var $ = function(s, c) {
    return Array.prototype.slice.call((c||document).querySelectorAll(s))
  };
  var lerp = function(a, b, t) {
    return a+(b-a)*t
  };

  /* split text into masked words (no spans) */
  $('[data-split]').forEach(function(el) {
    var out = [];
    el.childNodes.forEach(function(n) {
      if(n.nodeType===3) {
        n.textContent.split(/\s+/).filter(Boolean).forEach(function(w) {
          out.push('<b class="w"><i>'+w+'</i></b> ')
        })
      } else if(n.nodeName==='BR') {
        out.push('<br>')
      } else {
        out.push('<b class="w"><i>'+n.outerHTML+'</i></b> ')
      }
    });
    el.innerHTML = out.join('');
    $('.w i', el).forEach(function(i, k) {
      i.style.transitionDelay = (k*.09)+'s'
    });
  });

  /* scrub words */
  var scrub = $('[data-scrub]')[0], sw = [];
  if(scrub) {
    scrub.innerHTML = scrub.textContent.split(' ').map(function(w) {
      return '<b>'+w+'</b>'
    }).join(' ');
    sw = $('b', scrub)
  }

  /* preloader */
  var pn = document.getElementById('pn'), pre = document.getElementById('pre'), bar = $('.bar', pre)[0], c = 0;
  var ld = setInterval(function() {
    c+=Math.ceil(Math.random()*6);
    if(c>100)c = 100;
    pn.textContent = c;
    bar.style.width = c+'%';
    if(c===100) {
      clearInterval(ld);
      setTimeout(function() {
        pre.classList.add('done');
        document.body.classList.remove('loading');
        setTimeout(function() {
          $('#hero .w').forEach(function(w) {
            w.classList.add('in')
          });
          $('#hero .rv').forEach(function(r) {
            r.classList.add('in')
          })
        }, 500)
      }, 350)
    }
  }, 40);

  /* reveal */
  var io = new IntersectionObserver(function(es) {
    es.forEach(function(e) {
      if(e.isIntersecting) {
        e.target.classList.add('in');
        if(e.target.querySelector&&e.target.querySelector('[data-c]'))count(e.target);
        io.unobserve(e.target)
      }
    })
  }, {threshold:.2});
  $('.rv,.img,.w').forEach(function(el) {
    if(!el.closest('#hero'))io.observe(el)
  });

  /* counters */
  function count(root) {
    $('[data-c]', root).forEach(function(b) {
      var t = +b.dataset.c, s = null;
      (function f(ts) {
        s = s||ts;
        var p = Math.min((ts-s)/1800, 1);
        b.textContent = Math.round(t*(1-Math.pow(1-p, 4)));
        if(p<1)requestAnimationFrame(f)
      })(performance.now())
    })
  }

  /* theme morph by section */
  var tio = new IntersectionObserver(function(es) {
    es.forEach(function(e) {
      if(e.isIntersecting) {
        document.body.classList.toggle('light', e.target.dataset.theme==='light')
      }
    })
  }, {rootMargin:'-50% 0px -50% 0px'});
  $('[data-theme]').forEach(function(s) {
    tio.observe(s)
  });

  /* cursor + footprints */
  var cur = document.getElementById('cur'), mx = innerWidth/2, my = innerHeight/2, cx = mx, cy = my, lx = mx, ly = my, side = 1;
  addEventListener('mousemove', function(e) {
    mx = e.clientX;
    my = e.clientY;
    var dx = mx-lx, dy = my-ly, d = Math.hypot(dx, dy);
    if(d>70&&matchMedia('(hover:hover)').matches) {
      var a = Math.atan2(dy, dx)*180/Math.PI+90, f = document.createElement('div');
      f.className = 'fp';
      var ox = Math.cos((a)*Math.PI/180)*9*side, oy = Math.sin((a)*Math.PI/180)*9*side;
      side*=-1;
      f.style.left = (mx+ox)+'px';
      f.style.top = (my+oy)+'px';
      f.style.transform = 'rotate('+a+'deg)';
      f.style.setProperty('--t', 'rotate('+a+'deg) translateY(-14px)');
      document.body.appendChild(f);
      setTimeout(function() {
        f.remove()
      }, 1800);
      lx = mx;
      ly = my
    }
  });
  $('a,button').forEach(function(a) {
    a.addEventListener('mouseenter', function() {
      cur.classList.add('big')
    });
    a.addEventListener('mouseleave', function() {
      cur.classList.remove('big')
    })
  });

  /* scroll loop */
  var sun = document.getElementById('sun'), track = document.getElementById('track'), progs = document.getElementById('progs'), pfill = document.getElementById('pfill');
  var pics = $('.pic[data-speed]');
  function tick() {
    cx = lerp(cx, mx, .18);
    cy = lerp(cy, my, .18);
    cur.style.transform = 'translate('+cx+'px,'+cy+'px)';
    var h = document.documentElement.scrollHeight-innerHeight, p = scrollY/h, vh = innerHeight;

    /* sun: rises in hero, sinks to a dot, returns huge at the end */
    var sc, ty;
    if(p<.9) {
      sc = lerp(1, .12, Math.min(p/.5, 1));
      ty = lerp(-5, 0, Math.min(p*3, 1))-p*vh*.25+Math.sin(p*14)*vh*.18*(1-Math.min(p*2, 1)*0)
    } else {
      var q = (p-.9)/.1;
      sc = lerp(.12, 2.4, q);
      ty = lerp(0, 0, q)
    }
    var x = p<.9?Math.sin(p*9)*innerWidth*.32:lerp(Math.sin(.81*9)*innerWidth*.32, 0, (p-.9)/.1);
    sun.style.transform = 'translate(-50%,-50%) translate('+x+'px,'+(p<.9?ty:0)+'px) scale('+sc+')';

    /* scrub words */
    if(scrub) {
      var r = scrub.getBoundingClientRect(), pr = Math.min(Math.max((vh*.85-r.top)/(r.height+vh*.35), 0), 1);
      sw.forEach(function(w, i) {
        w.classList.toggle('on', i/sw.length<pr*1.05)
      })
    }

    /* horizontal programs */
    var pr2 = progs.getBoundingClientRect(), tot = progs.offsetHeight-vh, pp = Math.min(Math.max(-pr2.top/tot, 0), 1);
    track.style.transform = 'translateX('+(-pp*(track.scrollWidth-innerWidth))+'px)';
    pfill.style.width = (pp*100)+'%';

    /* parallax images */
    pics.forEach(function(el) {
      var b = el.parentNode.getBoundingClientRect();
      el.style.transform = 'translateY('+((b.top+b.height/2-vh/2)*(+el.dataset.speed))+'px)'
    });
    requestAnimationFrame(tick)
  }
  tick();

  /* smooth anchor scroll */
  $('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var t = document.querySelector(a.getAttribute('href'));
      if(t) {
        e.preventDefault();
        t.scrollIntoView({behavior:'smooth'})
      }
    })
  });
})();
  /* PHOTOS. On your own hosting, list file paths here, in page order: p1 = hero, p2 = About, p3-p10 = Faces wall, etc. */
//   var IMAGES = {/* p1:'images/hero.jpg', p2:'images/about.jpg', p3:'images/camp.jpg' */};
//   var slots = $('.pic');

  /* Easy way: save your photos next to this file in a folder called images, named 1.jpg, 2.jpg, 3.jpg ... they load into the slots automatically. */
//  var EXTS = ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'JPEG', 'PNG'];

// slots.forEach(function(p, i) {
//   var k = 'p' + (i + 1);
//   var options = IMAGES[k] ? [IMAGES[k]] : EXTS.map(function(e) {
//     return 'images/' + (i + 1) + '.' + e;
//   });
//   p.dataset.img = k;

//   (function tryNext(n) {
//     if (n >= options.length) return;
//     var t = new Image();
//     t.onload = function() {
//       p.style.backgroundImage = 'url(' + options[n] + ')';
//     };
//     t.onerror = function() {
//       tryNext(n + 1);
//     };
//     t.src = options[n];
//   })(0);
// });

  /* preview tool: pick many photos at once and they fill the slots in order; click a photo afterwards to swap one. Delete #addph and #fin before launch. */
//   var fin = document.getElementById('fin'), one = null;
//   document.getElementById('addph').onclick = function() {
//     one = null;
//     fin.click()
//   };
//   $('.img,.hbg').forEach(function(box) {
//     box.addEventListener('click', function() {
//       if(document.body.classList.contains('edit')) {
//         one = box.querySelector('.pic');
//         fin.click()
//       }
//     })
//   });
//   fin.onchange = function() {
//     var fs = Array.prototype.slice.call(fin.files);
//     document.body.classList.add('edit');
//     fs.forEach(function(f, i) {
//       var t = one||slots[i];
//       if(t)t.style.backgroundImage = 'url('+URL.createObjectURL(f)+')'
//     });
//     fin.value = ''
//   };

/* Kestrel — Elevation motion controller (site-wide).
   Progressive enhancement: nothing here is required to read the page.
   Honors prefers-reduced-motion. */
(function(){
  "use strict";
  var root = document.documentElement;
  root.classList.add("kx-js");
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine   = matchMedia("(pointer: fine)").matches;

  function make(tag, cls, html){ var el=document.createElement(tag); if(cls)el.className=cls; if(html!=null)el.innerHTML=html; return el; }

  document.addEventListener("DOMContentLoaded", function(){
    /* ---- depth layers ---- */
    document.body.appendChild(make("div","kx-aurora","<b class='a'></b><b class='b'></b><b class='c'></b>"));
    document.body.appendChild(make("div","kx-grain"));
    var prog = make("div","kx-progress"); document.body.appendChild(prog);

    /* ---- universe ticker under nav ---- */
    var nav = document.querySelector("nav");
    if(nav){
      var U = [
        ["SPY","S&P 500","etf"],["QQQ","Nasdaq-100","etf"],["SCHD","Dividend","etf"],
        ["AAPL","Apple","stk"],["MSFT","Microsoft","stk"],["AMZN","Amazon","stk"],
        ["NVDA","Nvidia","stk"],["META","Meta","stk"],["BRK.B","Berkshire","stk"],
        ["HOOD","Robinhood","stk"],["PLTR","Palantir","stk"],["TSLA","Tesla","stk"],
        ["MU","Micron","stk"],["SPCX","SpaceX","stk"],["MSTR","MicroStrategy","stk"],
        ["COIN","Coinbase","stk"],["GLD","Gold","gld"],["SGOV","Treasuries","csh"]
      ];
      var color = { etf:"var(--sol)", stk:"var(--accent)", gld:"var(--gold)", csh:"var(--cash)" };
      function item(x){ return "<span class='it'><span class='d' style='background:"+color[x[2]]+"'></span><span class='sym'>"+x[0]+"</span><span class='nm'>"+x[1]+"</span></span>"; }
      var seq = U.map(item).join("");
      var tick = make("div","kx-ticker",
        "<div class='kx-track'>"+seq+seq+"</div>"+
        "<span class='lbl'><i></i>Tokenized universe</span>");
      nav.parentNode.insertBefore(tick, nav.nextSibling);
    }

    /* ---- reveal on scroll ---- */
    var sel = "[data-reveal], .sec-head, .eyebrow, .feat, .pcard, .panel, .ea-band-in, .hero-img, .chips, h2";
    var nodes = Array.prototype.slice.call(document.querySelectorAll(sel));
    nodes.forEach(function(n){ if(!n.hasAttribute("data-reveal")) n.setAttribute("data-reveal",""); });
    if(reduce || !("IntersectionObserver" in window)){
      nodes.forEach(function(n){ n.classList.add("kx-in"); });
    } else {
      var lastParent=null, i=0;
      var io = new IntersectionObserver(function(ents){
        ents.forEach(function(e){
          if(!e.isIntersecting) return;
          e.target.classList.add("kx-in");
          io.unobserve(e.target);
        });
      }, { threshold:0.12, rootMargin:"0px 0px -8% 0px" });
      nodes.forEach(function(n){
        if(n.parentElement!==lastParent){ lastParent=n.parentElement; i=0; }
        n.style.transitionDelay = Math.min(i*60, 300) + "ms"; i++;
        io.observe(n);
      });
    }

    /* ---- cursor spotlight ---- */
    if(fine && !reduce){
      var spots = document.querySelectorAll(".panel, .feat, .pcard, .hero-img");
      spots.forEach(function(el){
        el.setAttribute("data-spot","");
        el.addEventListener("pointermove", function(ev){
          var r = el.getBoundingClientRect();
          el.style.setProperty("--mx", ((ev.clientX-r.left)/r.width*100)+"%");
          el.style.setProperty("--my", ((ev.clientY-r.top)/r.height*100)+"%");
        });
      });
      /* subtle magnetic pull on primary buttons */
      document.querySelectorAll(".btn.solid").forEach(function(b){
        b.addEventListener("pointermove", function(ev){
          var r=b.getBoundingClientRect();
          b.style.transform="translate("+((ev.clientX-r.left-r.width/2)*0.12)+"px,"+((ev.clientY-r.top-r.height/2)*0.18)+"px)";
        });
        b.addEventListener("pointerleave", function(){ b.style.transform=""; });
      });
    }

    /* ---- number count-up ---- */
    if(!reduce && "IntersectionObserver" in window){
      var cio = new IntersectionObserver(function(ents){
        ents.forEach(function(e){
          if(!e.isIntersecting) return; cio.unobserve(e.target);
          var el=e.target, to=parseFloat(el.getAttribute("data-count")), dec=(el.getAttribute("data-count").split(".")[1]||"").length;
          var pre=el.getAttribute("data-pre")||"", suf=el.getAttribute("data-suf")||"", t0=null, dur=1100;
          function step(ts){ if(!t0)t0=ts; var p=Math.min((ts-t0)/dur,1); var v=(to*(1-Math.pow(1-p,3)));
            el.textContent=pre+v.toLocaleString(undefined,{minimumFractionDigits:dec,maximumFractionDigits:dec})+suf;
            if(p<1) requestAnimationFrame(step); }
          requestAnimationFrame(step);
        });
      }, { threshold:0.6 });
      document.querySelectorAll("[data-count]").forEach(function(el){ cio.observe(el); });
    }

    /* ---- nav condense + scroll progress ---- */
    var ticking=false;
    function onScroll(){
      if(ticking) return; ticking=true;
      requestAnimationFrame(function(){
        var y=window.scrollY||window.pageYOffset;
        if(nav){ nav.classList.toggle("kx-scrolled", y>8); }
        var h=document.documentElement.scrollHeight-window.innerHeight;
        prog.style.width = (h>0 ? (y/h*100) : 0) + "%";
        ticking=false;
      });
    }
    window.addEventListener("scroll", onScroll, {passive:true});
    window.addEventListener("resize", onScroll, {passive:true});
    onScroll();
  });
})();

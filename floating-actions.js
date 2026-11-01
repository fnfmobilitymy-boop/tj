(() => {
 const dock=document.getElementById('floatingActions'),back=document.getElementById('backToTop'),footer=document.querySelector('footer');
 if(!dock||!back)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),logo=document.querySelector('.nav .brand');
 let queued=false,measureQueued=false,docHeight=0,viewport=innerHeight,shown=null,returning=false;
 back.hidden=false;
 function finishReturn(){if(!returning)return;returning=false;back.removeAttribute('aria-busy');if(scrollY<2)logo?.focus({preventScroll:true});}
 function update(){
  queued=false;const y=scrollY,maxScroll=Math.max(0,docHeight-viewport);
  const visible=y>=240||(maxScroll>24&&y>=maxScroll-24);
  if(visible!==shown){shown=visible;back.classList.toggle('is-visible',visible);back.setAttribute('aria-hidden',String(!visible));back.tabIndex=visible?0:-1;}
  if(returning&&y<2)finishReturn();
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(update);}}
 function measure(){if(measureQueued)return;measureQueued=true;requestAnimationFrame(()=>{measureQueued=false;docHeight=document.documentElement.scrollHeight;viewport=innerHeight;update();});}
 back.onclick=()=>{if(returning)return;returning=true;back.setAttribute('aria-busy','true');scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'});schedule();};
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure);addEventListener('tj:language',measure);
 addEventListener('scrollend',e=>{if(e.target===document||e.target===window)finishReturn();},{passive:true});
 for(const event of ['wheel','touchstart'])addEventListener(event,e=>{if(event==='touchstart'&&back.contains(e.target))return;if(returning){returning=false;back.removeAttribute('aria-busy');}},{passive:true});
 if(footer)new IntersectionObserver(entries=>{document.body.classList.toggle('footer-tools-visible',entries[0].isIntersecting);}).observe(footer);
 if('ResizeObserver' in window)new ResizeObserver(measure).observe(document.body);
 measure();
})();

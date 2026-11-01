(() => {
 const dock=document.getElementById('floatingActions'),back=document.getElementById('backToTop'),footer=document.querySelector('footer');
 if(!dock||!back)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let queued=false;
 function update(){
  const maxScroll=Math.max(0,document.documentElement.scrollHeight-innerHeight);
  const atEnd=maxScroll>24&&scrollY>=maxScroll-24;
  back.hidden=scrollY<240&&!atEnd;
  const base=matchMedia('(max-width:700px)').matches?18:24;
  const safeArea=parseFloat(getComputedStyle(dock).getPropertyValue('--floating-safe-area'))||0;
  const baseline=base+safeArea;
  const footerTop=footer?.getBoundingClientRect().top??innerHeight;
  document.body.classList.toggle('footer-tools-visible',footerTop<innerHeight);
  // The footer reserves a dedicated right-hand tool lane; keep controls fixed.
  dock.style.bottom=`${baseline}px`;
  queued=false;
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(update);}}
 back.onclick=()=>{scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'});document.querySelector('.nav .brand')?.focus({preventScroll:true});};
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('tj:language',schedule);
 if('ResizeObserver' in window&&footer)new ResizeObserver(schedule).observe(footer);
 update();
})();

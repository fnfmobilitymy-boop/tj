(() => {
 const video=document.getElementById('heroVideo'),scene=document.querySelector('.hero-scene');if(!video||!scene)return;
 const slides=[{src:'./assets/hero-drive.mp4',poster:'./assets/hero-video-poster.jpg'},{src:'./assets/hero-night.mp4',poster:'./assets/hero-night-poster.jpg'}];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let current=0,visible=false,hovered=false,timer=0,transitionTimer=0,manualUntil=0;
 function setSlide(index,manual=false){
  const next=(index+slides.length)%slides.length;if(next===current)return;
  current=next;if(manual)manualUntil=Date.now()+10000;
  scene.classList.add('hero-switching');video.poster=slides[current].poster;
  video.querySelector('source').src=slides[current].src;video.load();
  document.getElementById('heroSlideNumber').textContent=`0${current+1} / 02`;
  document.querySelectorAll('[data-hero-slide]').forEach(button=>{const active=Number(button.dataset.heroSlide)===current;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));});
  clearTimeout(transitionTimer);transitionTimer=setTimeout(()=>scene.classList.remove('hero-switching'),500);
 }
 function auto(){clearInterval(timer);if(reduced.matches)return;timer=setInterval(()=>{if(visible&&!hovered&&!document.hidden&&!video.paused&&Date.now()>manualUntil&&!scene.contains(document.activeElement))setSlide(current+1);},8500);}
 document.getElementById('previousHero').onclick=()=>setSlide(current-1,true);document.getElementById('nextHero').onclick=()=>setSlide(current+1,true);
 document.querySelectorAll('[data-hero-slide]').forEach(button=>button.onclick=()=>setSlide(Number(button.dataset.heroSlide),true));
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{threshold:.1}).observe(scene);
 scene.querySelector('.hero-carousel').addEventListener('pointerenter',()=>{hovered=true;});scene.querySelector('.hero-carousel').addEventListener('pointerleave',()=>{hovered=false;});
 video.addEventListener('loadeddata',()=>scene.classList.remove('hero-switching'));reduced.addEventListener('change',auto);auto();
})();

(() => {
 const intro=document.getElementById('brandIntro');
 if(!intro)return;
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){intro.remove();return;}
 const skip=document.getElementById('skipIntro');
 function finish(){
  if(!intro.isConnected)return;
  const restoreFocus=intro.contains(document.activeElement);
  intro.classList.add('is-leaving');
  setTimeout(()=>{intro.remove();if(restoreFocus)document.querySelector('.nav .brand')?.focus({preventScroll:true});},300);
 }
 skip.addEventListener('click',finish);
 intro.addEventListener('keydown',e=>{if(e.key==='Escape')finish();});
 setTimeout(finish,2700);
})();
const cars=window.fleetCars;
const brands=window.fleetBrands;
let brand=brands.some(b=>b.id===new URLSearchParams(location.search).get('brand'))?new URLSearchParams(location.search).get('brand'):'All';
let expandedBrands=false;
let brandMotionPaused=false;
let stopBrandMotion=()=>{};
const $=s=>document.querySelector(s);let category='All';let selected=null;
const dateString=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const today=new Date();$('#pickup').min=dateString(today);$('#pickup').value=dateString(new Date(today.getFullYear(),today.getMonth(),today.getDate()+1));$('#return').value=dateString(new Date(today.getFullYear(),today.getMonth(),today.getDate()+4));
function syncDates(){const next=new Date($('#pickup').value+'T12:00:00');next.setDate(next.getDate()+1);$('#return').min=dateString(next);if($('#return').value<$('#return').min)$('#return').value=$('#return').min;}syncDates();$('#pickup').addEventListener('change',syncDates);
function days(){return Math.max(1,Math.round((new Date($('#return').value)-new Date($('#pickup').value))/86400000));}
function brandLogo(b,kind='brand-emblem'){
 return b.id==='jaecoo'?`<span class="${kind} brand-wordmark">JAECOO</span>`:`<img class="${kind}" src="${b.logo}" alt="${b.name}" loading="lazy">`;
}
function brandButton(b,copy=false){
 return `<button class="brand-option ${brand===b.id?'is-selected':''}" ${copy?'data-copy-brand':'data-brand'}="${b.id}" ${copy?'tabindex="-1"':''} aria-pressed="${brand===b.id}">${brandLogo(b)}<strong>${b.name}</strong><small>${cars.filter(c=>c.brand===b.id).length} models</small></button>`;
}
function renderBrands(){
 const positions=[...document.querySelectorAll('.brand-rail')].map(el=>el.scrollLeft);
 stopBrandMotion();
 const all=`<button class="brand-all-pill ${brand==='All'?'is-selected':''}" data-brand="All" aria-pressed="${brand==='All'}"><span aria-hidden="true">✦</span> All brands <small>${cars.length} models</small></button>`;
 $('#brandGrid').classList.toggle('brand-grid-expanded',expandedBrands);
 if(expandedBrands){$('#brandGrid').innerHTML=all+brands.map(b=>brandButton(b)).join('');}
 else{
  const rows=[brands.slice(0,14),brands.slice(14)];
  $('#brandGrid').innerHTML=`<div class="brand-reel-top">${all}<span class="brand-live-caption"><i></i> EXPLORE THE COLLECTION</span></div>`+rows.map((row,i)=>`<div class="brand-rail" tabindex="0" role="group" aria-label="Brand carousel row ${i+1}; use arrow keys or drag"><div class="brand-track"><div class="brand-track-group">${row.map(b=>brandButton(b)).join('')}</div><div class="brand-track-group" aria-hidden="true">${row.map(b=>brandButton(b,true)).join('')}</div></div></div>`).join('');
 }
 $('#expandBrands').setAttribute('aria-expanded',String(expandedBrands));$('#expandBrands').innerHTML=expandedBrands?'Back to motion <span>↔</span>':'View all brands <span>＋</span>';
 $('#brandMotionToggle').hidden=expandedBrands;
 stopBrandMotion=mountBrandMotion(positions);
 syncBrandMotionLabel();
}
function syncBrandMotionLabel(){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const button=$('#brandMotionToggle');button.disabled=reduced;
 button.setAttribute('aria-pressed',String(brandMotionPaused||reduced));button.setAttribute('aria-label',brandMotionPaused?'Play brand animation':'Pause brand animation');
 button.innerHTML=reduced?'Motion reduced':brandMotionPaused?'Play motion <span aria-hidden="true">▶</span>':'Pause motion <span aria-hidden="true">Ⅱ</span>';
}
function mountBrandMotion(positions){
 const rails=[...document.querySelectorAll('.brand-rail')];if(!rails.length)return ()=>{};
 const abort=new AbortController(),signal=abort.signal;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let frame=0,last=0,visible=false,hovered=false,touching=false,resumeTimer=0,drag=null;
 let offsets=[];
 rails.forEach((rail,i)=>{const span=rail.querySelector('.brand-track-group').offsetWidth;rail.scrollLeft=positions[i]??(i===1?span-1:0);});
 function mayRun(){return visible&&!document.hidden&&!brandMotionPaused&&!reduced.matches&&!hovered&&!touching&&!$('#brandGrid').contains(document.activeElement);}
 function tick(time){
  frame=0;if(!mayRun()){last=0;return;}
  const dt=last?Math.min(time-last,50):0;last=time;
  rails.forEach((rail,i)=>{
   const span=rail.querySelector('.brand-track-group').offsetWidth;
   if(!span)return;
   let x=(offsets[i]??rail.scrollLeft)+(i===0?1:-1)*dt*.022;
   if(x>=span)x-=span;if(x<0)x+=span;
   offsets[i]=x;rail.scrollLeft=x;
  });
  frame=requestAnimationFrame(tick);
 }
 function refresh(){if(!mayRun()){cancelAnimationFrame(frame);frame=0;last=0;}else if(!frame){offsets=rails.map(rail=>rail.scrollLeft);frame=requestAnimationFrame(tick);}}
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;refresh();},{threshold:.05});observer.observe($('.brand-browser'));
 const grid=$('#brandGrid');
 grid.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hovered=true;refresh();}},{signal});
 grid.addEventListener('pointerleave',()=>{hovered=false;refresh();},{signal});
 grid.addEventListener('focusin',refresh,{signal});grid.addEventListener('focusout',()=>queueMicrotask(refresh),{signal});
 grid.addEventListener('pointerdown',e=>{
  const rail=e.target.closest('.brand-rail');if(!rail)return;
  clearTimeout(resumeTimer);touching=true;refresh();
  if(e.pointerType==='mouse')drag={rail,start:e.clientX,scroll:rail.scrollLeft,id:e.pointerId,moved:false};
 },{signal});
 grid.addEventListener('pointermove',e=>{
  if(!drag)return;const delta=e.clientX-drag.start;
  if(Math.abs(delta)>6){drag.moved=true;drag.rail.setPointerCapture(e.pointerId);drag.rail.classList.add('is-dragging');}
  if(drag.moved){e.preventDefault();drag.rail.scrollLeft=drag.scroll-delta;}
 },{signal});
 function release(){
  if(drag){const rail=drag.rail;rail.classList.remove('is-dragging');if(drag.moved){rail.dataset.justDragged='true';setTimeout(()=>delete rail.dataset.justDragged,50);}drag=null;}
  resumeTimer=setTimeout(()=>{touching=false;refresh();},1200);
 }
 window.addEventListener('pointerup',release,{signal});window.addEventListener('pointercancel',release,{signal});
 grid.addEventListener('keydown',e=>{const rail=e.target.closest('.brand-rail');if(rail&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){e.preventDefault();rail.scrollBy({left:e.key==='ArrowRight'?180:-180,behavior:reduced.matches?'instant':'smooth'});}},{signal});
 document.addEventListener('visibilitychange',refresh,{signal});
 $('#brandMotionToggle').addEventListener('click',()=>{brandMotionPaused=!brandMotionPaused;syncBrandMotionLabel();refresh();},{signal});
 reduced.addEventListener('change',()=>{syncBrandMotionLabel();refresh();},{signal});
 return ()=>{abort.abort();observer.disconnect();cancelAnimationFrame(frame);clearTimeout(resumeTimer);};
}
function chooseBrand(value){
 brand=value;category='All';$('#budget').value=3000;$('#automatic').checked=true;$('#seats').value='All';$('#modelSearch').value='';
 document.querySelectorAll('[data-category]').forEach(b=>b.classList.toggle('selected',b.dataset.category==='All'));
 const url=new URL(location.href);if(brand==='All')url.searchParams.delete('brand');else url.searchParams.set('brand',brand);history.replaceState(null,'',url);
 renderBrands();render();if(brand!=='All')$('#brandCollection').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
}
$('#brandGrid').onclick=e=>{if(e.target.closest('[data-just-dragged]'))return;const b=e.target.closest('[data-brand],[data-copy-brand]');if(b)chooseBrand(b.dataset.brand||b.dataset.copyBrand);};
$('#expandBrands').onclick=()=>{expandedBrands=!expandedBrands;renderBrands();};
$('#allBrands').onclick=()=>{chooseBrand('All');$('.brand-browser').scrollIntoView({behavior:'smooth'});};
$('#modelSearch').addEventListener('input',render);
function render(){
 const query=$('#modelSearch').value.trim().toLowerCase();
 const list=cars.filter(c=>(brand==='All'||c.brand===brand)&&(category==='All'||c.category===category)&&c.price<=Number($('#budget').value)&&($('#seats').value==='All'||($('#seats').value==='Bus'?c.category==='Bus':c.seats===Number($('#seats').value)))&&$('#automatic').checked&&c.name.toLowerCase().includes(query));
 if($('#sort').value==='low')list.sort((a,b)=>a.price-b.price);if($('#sort').value==='high')list.sort((a,b)=>b.price-a.price);
 const chosen=brands.find(b=>b.id===brand);$('#collectionTitle').textContent=chosen?chosen.name+' collection.':'All brands. Every kind of drive.';$('#collectionDescription').textContent=chosen?`Explore ${cars.filter(c=>c.brand===brand).length} ${chosen.name} models. Narrow your choice below.`:'Explore 27 brands and 130 sample models popular in Malaysia.';$('#allBrands').hidden=!chosen;
 $('#count').textContent=list.length;$('#totalModels').textContent=cars.filter(c=>brand==='All'||c.brand===brand).length;$('#budgetLabel').textContent='RM '+Number($('#budget').value).toLocaleString();
 $('#cars').innerHTML=list.length?list.map(c=>`<article class="car" data-model-brand="${c.brand}"><div class="car-top"><div class="car-tag">${c.category.toUpperCase()} <span class="tag">SAMPLE MODEL</span></div><h3>${c.name}</h3><p class="car-sub">${c.description}</p></div><div class="vehicle-photo" role="img" aria-label="${c.name} demo vehicle illustration"><div class="vehicle-photo-crop" style="--vehicle-tile-ratio:var(--fleet-sheet-${c.photoSheet}-ratio,1.5)"><img src="./assets/vehicles/fleet-${c.photoSheet}.png" alt="" class="vehicle-photo-sheet" loading="lazy" style="--vehicle-col:${c.photoTile%4};--vehicle-row:${Math.floor(c.photoTile/4)}"></div><span class="vehicle-photo-badge">DEMO VEHICLE IMAGE</span><span class="vehicle-capacity">${c.category==='Bus'?'BUS · ':''}${c.seats} seats</span></div><div class="specs"><span>♙ &nbsp;${c.seats} seats</span><span>▣ &nbsp;${c.bags} bags</span><span>⚙ &nbsp;Auto</span></div><div class="car-bottom"><div><div class="price"><small>RM</small>${c.price}<span class="per-day">/ day</span></div><div class="deposit">${days()} days · RM ${(c.price*days()).toLocaleString()} estimated</div></div><button class="book" data-car="${c.id}">View model ↗</button></div></article>`).join(''):'<div class="empty">No models match these filters.<br><br>Try a higher budget, another vehicle type or reset your filters.</div>';
}
renderBrands();
document.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>{category=b.dataset.category;document.querySelectorAll('[data-category]').forEach(x=>x.classList.toggle('selected',x===b));render();});
['budget','seats','automatic','sort'].forEach(id=>$('#'+id).addEventListener(id==='budget'?'input':'change',render));$('#reset').onclick=()=>{category='All';$('#budget').value=3000;$('#modelSearch').value='';$('#seats').value='All';$('#automatic').checked=true;$('#sort').value='recommended';document.querySelectorAll('[data-category]').forEach(b=>b.classList.toggle('selected',b.dataset.category==='All'));render();};
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),3500);}
$('#search').onsubmit=e=>{e.preventDefault();if($('#return').value<=$('#pickup').value){toast('Return date must be after pick-up.');return;}render();$('#fleet').scrollIntoView({behavior:'smooth'});toast(`Showing cars for ${days()} days · ${$('#location').value}`);};
const modal=$('#modal');$('.close').onclick=()=>modal.close();modal.addEventListener('click',e=>{if(e.target===modal&&e.clientX<modal.getBoundingClientRect().left||e.target===modal&&e.clientX>modal.getBoundingClientRect().right)modal.close();});
function openModal(content){$('#modalContent').innerHTML=content;modal.showModal();}
$('#cars').onclick=e=>{const b=e.target.closest('[data-car]');if(!b)return;selected=cars.find(c=>c.id===b.dataset.car);openModal(`<div class="eyebrow">YOUR NEXT CHAPTER</div><h2>${selected.name}</h2><p>${selected.seats} seats · Automatic · ${selected.category}</p><div class="summary">${$('#location').value}<br>${$('#pickup').value} → ${$('#return').value}<br>${days()} days × RM ${selected.price}<br><strong>Estimated rental: RM ${(days()*selected.price).toLocaleString()}</strong></div><p class="notice">Demo booking: this saves a request on this device only. Availability, insurance, deposit and final charges require confirmation by the rental team. No payment is collected. Vehicle photos are illustrative.</p><form id="reserve"><label>Your name<input name="name" autocomplete="name" required maxlength="80" placeholder="Full name"></label><label>Email address<input name="email" type="email" autocomplete="email" required placeholder="you@example.com"></label><label>Phone number<input name="phone" type="tel" autocomplete="tel" required minlength="8" placeholder="+60"></label><button class="primary">Save booking request ↗</button></form>`);$('#reserve').onsubmit=e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.target));const booking={...data,ref:'TJ-'+(crypto.randomUUID?.()||Array.from(crypto.getRandomValues(new Uint8Array(8)),n=>n.toString(16).padStart(2,'0')).join('')).slice(0,8).toUpperCase(),car:selected.name,location:$('#location').value,pickup:$('#pickup').value,return:$('#return').value,total:days()*selected.price};try{const saved=JSON.parse(localStorage.getItem('fnf-bookings')||'[]');saved.push(booking);localStorage.setItem('fnf-bookings',JSON.stringify(saved));}catch{toast('Your browser could not save the request. Please enable local storage.');return;}openConfirmation(booking);};};
function openConfirmation(b){$('#modalContent').innerHTML=`<div class="eyebrow">SAVED ON THIS DEVICE</div><h2>Your next drive is taking shape.</h2><p>Reference <strong>${b.ref}</strong></p><div class="summary"></div><p class="notice">This is a demo request, not a confirmed reservation. Your request has not been sent to a rental operator. You can find it under My bookings on this browser.</p><button class="primary" id="done" style="margin-top:20px;width:100%">Back to exploring ↗</button>`;$('.summary').textContent=`${b.car} · ${b.location} · ${b.pickup} → ${b.return} · Estimated RM ${b.total.toLocaleString()}`;$('#done').onclick=()=>modal.close();}
$('#bookingLookup').onclick=()=>{let bookings=[];try{bookings=JSON.parse(localStorage.getItem('fnf-bookings')||'[]');}catch{}openModal('<div class="eyebrow">YOUR JOURNEYS</div><h2>My booking requests</h2><p>Demo requests saved in this browser. These are not confirmed reservations.</p><div id="savedBookings"></div>');if(!bookings.length){$('#savedBookings').innerHTML='<div class="summary">No requests yet. Your next adventure is waiting.</div>';return;}bookings.reverse().forEach(b=>{const div=document.createElement('div');div.className='summary';div.textContent=`${b.ref} · ${b.car} · ${b.pickup} → ${b.return} · RM ${b.total}`;$('#savedBookings').append(div);});};render();

// Motion is progressive enhancement: content works without animation support.
(() => {
 const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
 const finePointer=window.matchMedia('(hover: hover) and (pointer: fine)');
 const progress=document.createElement('div');
 progress.className='scroll-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
 let observer;
 if('IntersectionObserver' in window){
  observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
  }),{threshold:0.08,rootMargin:'0px 0px -20px 0px'});
 }
 function reveal(root=document){
  if(preference.matches||!observer)return;
  root.querySelectorAll('.section-heading,.fleet-toolbar,.how>div,.bottom-banner,footer,.car').forEach((el,i)=>{
   if(el.classList.contains('motion-reveal'))return;
   el.style.setProperty('--reveal-delay',`${el.classList.contains('car')?i%3*65:0}ms`);
   el.classList.add('motion-reveal');observer.observe(el);
  });
 }
 reveal();new MutationObserver(()=>reveal($('#cars'))).observe($('#cars'),{childList:true});
 let scheduled=false;
 const heroImage=document.querySelector('.hero-art img');
 function updateScroll(){
  const max=document.documentElement.scrollHeight-innerHeight;
  progress.style.transform=`scaleX(${max>0?Math.min(1,scrollY/max):0})`;
  document.body.classList.toggle('has-scrolled',scrollY>30);
  if(heroImage)heroImage.style.transform=!preference.matches&&finePointer.matches&&scrollY<650?`translateY(${Math.min(scrollY*.13,55)}px) scale(1.12)`:'none';
  scheduled=false;
 }
 addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll);}},{passive:true});
 addEventListener('resize',updateScroll);updateScroll();
 preference.addEventListener('change',()=>{
  if(preference.matches){document.querySelectorAll('.motion-reveal').forEach(el=>el.classList.add('is-visible'));}
  updateScroll();
 });
 document.addEventListener('pointermove',e=>{
  if(preference.matches||!finePointer.matches)return;
  const card=e.target.closest('.car');if(!card)return;
  const box=card.getBoundingClientRect();card.style.setProperty('--pointer-x',`${e.clientX-box.left}px`);card.style.setProperty('--pointer-y',`${e.clientY-box.top}px`);
 });
})();

// Hero phases: 0–35% copy exit, 15–85% film framing, then next section.
(() => {
 const section=document.querySelector('.hero-scroll');
 const scene=section?.querySelector('.hero-scene');
 const video=document.getElementById('heroVideo');
 const toggle=document.getElementById('videoToggle');
 if(!scene||!video||!toggle)return;
 video.muted=true;video.defaultMuted=true;video.setAttribute('muted','');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const clamp=n=>Math.max(0,Math.min(1,n));
 let requested=false,userPaused=false,inView=true,introDone=!document.getElementById('brandIntro');
 function label(){toggle.innerHTML=video.paused?'Play film <span aria-hidden="true">▶</span>':'Pause film <span aria-hidden="true">Ⅱ</span>';toggle.setAttribute('aria-label',video.paused?'Play background video':'Pause background video');}
 function playback(){
  if(!document.hidden&&inView&&introDone&&!userPaused&&!reduced.matches){video.play().catch(label);}else{video.pause();}label();
 }
 video.addEventListener('play',label);video.addEventListener('pause',label);video.addEventListener('canplay',playback);
 toggle.addEventListener('click',()=>{if(video.paused){userPaused=false;video.play().catch(label);}else{userPaused=true;video.pause();}label();});
 video.addEventListener('error',()=>{toggle.textContent='Video unavailable';toggle.disabled=true;});
 new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;playback();},{threshold:.05}).observe(scene);
 const intro=document.getElementById('brandIntro');
 if(intro){const watcher=new MutationObserver(()=>{if(!intro.isConnected){introDone=true;watcher.disconnect();playback();}});watcher.observe(document.body,{childList:true});}
 function update(){
  const distance=Math.max(1,section.offsetHeight-scene.offsetHeight);
  const p=reduced.matches?0:clamp((16-section.getBoundingClientRect().top)/distance);
  const exit=clamp(p/.48);const frame=clamp((p-.12)/.73);
  scene.style.setProperty('--hero-progress',p.toFixed(3));
  scene.style.setProperty('--copy-opacity',(1-exit).toFixed(3));
  scene.style.setProperty('--copy-shift',`${-exit*95}px`);
  scene.style.setProperty('--copy-events',exit>.95?'none':'auto');
  scene.style.setProperty('--film-scale',(1.08-frame*.08).toFixed(3));
  scene.style.setProperty('--film-inset',`${frame*3}%`);
  scene.style.setProperty('--film-radius',`${8+frame*16}px`);
  scene.style.setProperty('--cue-opacity',(1-clamp(p*4)).toFixed(3));
  requested=false;
 }
 addEventListener('scroll',()=>{if(!requested){requested=true;requestAnimationFrame(update);}},{passive:true});
 addEventListener('resize',update);document.addEventListener('visibilitychange',playback);
 reduced.addEventListener('change',()=>{update();playback();});
 update();playback();
})();

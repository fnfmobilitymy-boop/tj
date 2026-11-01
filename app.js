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
const $=s=>document.querySelector(s);let category='All';
let modelPage=1,renderTimer=0;const modelsPerPage=12;
const pager=document.createElement('div');pager.id='modelPagination';pager.className='model-pagination';pager.hidden=true;$('#cars').after(pager);
const dateString=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const today=new Date();$('#pickup').min=dateString(today);$('#pickup').value=dateString(new Date(today.getFullYear(),today.getMonth(),today.getDate()+1));$('#return').value=dateString(new Date(today.getFullYear(),today.getMonth(),today.getDate()+4));
function syncDates(){const next=new Date($('#pickup').value+'T12:00:00');next.setDate(next.getDate()+1);$('#return').min=dateString(next);if($('#return').value<$('#return').min)$('#return').value=$('#return').min;}syncDates();$('#pickup').addEventListener('change',syncDates);
function days(){return Math.max(1,Math.round((new Date($('#return').value)-new Date($('#pickup').value))/86400000));}
function brandLogo(b,kind='brand-emblem'){
 return b.id==='jaecoo'?`<span class="${kind} brand-wordmark">JAECOO</span>`:`<img class="${kind}" src="${b.logo}" alt="${b.name}" loading="lazy" decoding="async">`;
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
 let offsets=[],spans=[];
 function measureRails(){spans=rails.map(rail=>rail.querySelector('.brand-track-group').offsetWidth);}
 measureRails();rails.forEach((rail,i)=>{rail.scrollLeft=positions[i]??(i===1?spans[i]-1:0);});
 const railResize=new ResizeObserver(measureRails);rails.forEach(rail=>railResize.observe(rail.querySelector('.brand-track-group')));
 function mayRun(){return visible&&!document.hidden&&!brandMotionPaused&&!reduced.matches&&!hovered&&!touching&&!$('#brandGrid').contains(document.activeElement);}
 function tick(time){
  frame=0;if(!mayRun()){last=0;return;}
  const dt=last?Math.min(time-last,50):0;last=time;
  rails.forEach((rail,i)=>{
   const span=spans[i];
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
  if(!touching&&!drag)return;clearTimeout(resumeTimer);
  if(drag){const rail=drag.rail;rail.classList.remove('is-dragging');if(drag.moved){rail.dataset.justDragged='true';setTimeout(()=>delete rail.dataset.justDragged,50);}drag=null;}
  resumeTimer=setTimeout(()=>{touching=false;refresh();},1200);
 }
 window.addEventListener('pointerup',release,{signal});window.addEventListener('pointercancel',release,{signal});
 grid.addEventListener('keydown',e=>{const rail=e.target.closest('.brand-rail');if(rail&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){e.preventDefault();rail.scrollBy({left:e.key==='ArrowRight'?180:-180,behavior:reduced.matches?'instant':'smooth'});}},{signal});
 document.addEventListener('visibilitychange',refresh,{signal});
 $('#brandMotionToggle').addEventListener('click',()=>{brandMotionPaused=!brandMotionPaused;syncBrandMotionLabel();refresh();},{signal});
 reduced.addEventListener('change',()=>{syncBrandMotionLabel();refresh();},{signal});
 return ()=>{abort.abort();observer.disconnect();railResize.disconnect();cancelAnimationFrame(frame);clearTimeout(resumeTimer);};
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
function scheduleRender(){clearTimeout(renderTimer);renderTimer=setTimeout(render,90);}
$('#modelSearch').addEventListener('input',scheduleRender);
function render(keepPage=false){
 clearTimeout(renderTimer);if(keepPage!==true)modelPage=1;
 const query=$('#modelSearch').value.trim().toLowerCase();
 const list=cars.filter(c=>(brand==='All'||c.brand===brand)&&(category==='All'||c.category===category)&&c.price<=Number($('#budget').value)&&($('#seats').value==='All'||($('#seats').value==='Bus'?c.category==='Bus':c.seats===Number($('#seats').value)))&&$('#automatic').checked&&c.name.toLowerCase().includes(query));
 if($('#sort').value==='low')list.sort((a,b)=>a.price-b.price);if($('#sort').value==='high')list.sort((a,b)=>b.price-a.price);
 const pageCount=Math.max(1,Math.ceil(list.length/modelsPerPage));modelPage=Math.min(modelPage,pageCount);const pageCars=list.slice((modelPage-1)*modelsPerPage,modelPage*modelsPerPage);
 const chosen=brands.find(b=>b.id===brand);$('#collectionTitle').textContent=chosen?chosen.name+' collection.':'All brands. Every kind of drive.';$('#collectionDescription').textContent=chosen?`Explore ${cars.filter(c=>c.brand===brand).length} ${chosen.name} models. Narrow your choice below.`:'Explore 27 brands and 130 sample models popular in Malaysia.';$('#allBrands').hidden=!chosen;
 $('#count').textContent=list.length;$('#totalModels').textContent=cars.filter(c=>brand==='All'||c.brand===brand).length;$('#budgetLabel').textContent='RM '+Number($('#budget').value).toLocaleString();
 $('#cars').innerHTML=list.length?pageCars.map(c=>`<article class="car" data-model-brand="${c.brand}"><div class="car-top"><div class="car-tag">${c.category.toUpperCase()} <span class="tag">SAMPLE MODEL</span></div><h3>${c.name}</h3><p class="car-sub">${c.description}</p></div><div class="vehicle-photo" role="img" aria-label="${c.name} demo vehicle illustration"><img src="${c.image}" alt="" class="vehicle-model-image" loading="lazy" decoding="async" width="384" height="256"><span class="vehicle-photo-badge">DEMO VEHICLE IMAGE</span><span class="vehicle-capacity">${c.category==='Bus'?'BUS · ':''}${c.seats} seats</span></div><div class="specs"><span>♙ &nbsp;${c.seats} seats</span><span>▣ &nbsp;${c.bags} bags</span><span>⚙ &nbsp;Auto</span></div><div class="car-bottom"><div><div class="price"><small>RM</small>${c.price}<span class="per-day">/ day</span></div><div class="deposit">${days()} days · RM ${(c.price*days()).toLocaleString()} estimated</div></div><button class="book" data-car="${c.id}">View model ↗</button></div></article>`).join(''):'<div class="empty">No models match these filters.<br><br>Try a higher budget, another vehicle type or reset your filters.</div>';
 pager.hidden=pageCount<=1;
 pager.innerHTML=pageCount>1?`<button type="button" data-model-page="${modelPage-1}" ${modelPage===1?'disabled':''}>← Previous</button><div><span role="status" aria-live="polite">Showing ${(modelPage-1)*modelsPerPage+1}–${Math.min(modelPage*modelsPerPage,list.length)} of ${list.length} models</span><select id="modelPageSelect" aria-label="Model page">${Array.from({length:pageCount},(_,i)=>`<option value="${i+1}" ${i+1===modelPage?'selected':''}>${i+1} / ${pageCount}</option>`).join('')}</select></div><button type="button" data-model-page="${modelPage+1}" ${modelPage===pageCount?'disabled':''}>Next →</button>`:'';
}
function changeModelPage(value){modelPage=Math.max(1,Number(value)||1);render(true);$('#brandCollection').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}
pager.addEventListener('click',e=>{const button=e.target.closest('[data-model-page]');if(button&&!button.disabled)changeModelPage(button.dataset.modelPage);});
pager.addEventListener('change',e=>{if(e.target.id==='modelPageSelect')changeModelPage(e.target.value);});
renderBrands();
document.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>{category=b.dataset.category;document.querySelectorAll('[data-category]').forEach(x=>x.classList.toggle('selected',x===b));render();});
$('#budget').addEventListener('input',()=>{$('#budgetLabel').textContent='RM '+Number($('#budget').value).toLocaleString();scheduleRender();});
['seats','automatic','sort'].forEach(id=>$('#'+id).addEventListener('change',render));$('#reset').onclick=()=>{category='All';$('#budget').value=3000;$('#modelSearch').value='';$('#seats').value='All';$('#automatic').checked=true;$('#sort').value='recommended';document.querySelectorAll('[data-category]').forEach(b=>b.classList.toggle('selected',b.dataset.category==='All'));render();};
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),3500);}
$('#search').onsubmit=e=>{e.preventDefault();if($('#return').value<=$('#pickup').value){toast('Return date must be after pick-up.');return;}render();$('#fleet').scrollIntoView({behavior:'smooth'});toast(`Showing cars for ${days()} days · ${$('#location').value}`);};
render();

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
 reveal();new MutationObserver(records=>{if(observer)for(const record of records)for(const node of record.removedNodes)if(node.nodeType===1)observer.unobserve(node);reveal($('#cars'));}).observe($('#cars'),{childList:true});
 let scheduled=false,documentHeight=0,viewportHeight=innerHeight,wasScrolled=null,lastRatio=-1;
 function updateScroll(){
  const max=documentHeight-viewportHeight,ratio=max>0?Math.max(0,Math.min(1,scrollY/max)):0;
  if(Math.abs(ratio-lastRatio)>.00005){progress.style.transform=`scaleX(${ratio})`;lastRatio=ratio;}
  const scrolled=scrollY>30;if(scrolled!==wasScrolled){wasScrolled=scrolled;document.body.classList.toggle('has-scrolled',scrolled);}
  scheduled=false;
 }
 function measureScroll(){documentHeight=document.documentElement.scrollHeight;viewportHeight=innerHeight;updateScroll();}
 addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll);}},{passive:true});
 addEventListener('resize',measureScroll);new ResizeObserver(measureScroll).observe(document.body);measureScroll();
 preference.addEventListener('change',()=>{
  if(preference.matches){document.querySelectorAll('.motion-reveal').forEach(el=>el.classList.add('is-visible'));}
  updateScroll();
 });
 let pointerFrame=0,pointer=null;
 document.addEventListener('pointermove',e=>{
  if(preference.matches||!finePointer.matches)return;
  const card=e.target.closest('.car');if(!card)return;pointer={card,x:e.clientX,y:e.clientY};
  if(!pointerFrame)pointerFrame=requestAnimationFrame(()=>{pointerFrame=0;const point=pointer;if(!point?.card.isConnected)return;const box=point.card.getBoundingClientRect();point.card.style.setProperty('--pointer-x',`${point.x-box.left}px`);point.card.style.setProperty('--pointer-y',`${point.y-box.top}px`);});
 },{passive:true});
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
 let geometry={top:0,distance:1},previousProgress=-1;
 let requested=false,userPaused=false,inView=true,introDone=!document.getElementById('brandIntro');
 function label(){toggle.innerHTML=video.paused?'Play film <span aria-hidden="true">▶</span>':'Pause film <span aria-hidden="true">Ⅱ</span>';toggle.setAttribute('aria-label',video.paused?'Play background video':'Pause background video');}
 function playback(){
  if(!document.hidden&&inView&&introDone&&!userPaused&&!reduced.matches){video.play().catch(label);}else{video.pause();}label();
 }
 video.addEventListener('play',label);video.addEventListener('pause',label);video.addEventListener('canplay',playback);
 toggle.addEventListener('click',()=>{if(video.paused){userPaused=false;video.play().catch(label);}else{userPaused=true;video.pause();}label();});
 video.addEventListener('error',()=>{toggle.textContent='Video unavailable';toggle.disabled=true;});
 new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;scene.classList.toggle('scene-in-view',inView);if(inView)measureHero();playback();},{threshold:.05}).observe(scene);
 const intro=document.getElementById('brandIntro');
 if(intro){const watcher=new MutationObserver(()=>{if(!intro.isConnected){introDone=true;watcher.disconnect();playback();}});watcher.observe(document.body,{childList:true});}
 function measureHero(){geometry={top:section.getBoundingClientRect().top+scrollY,distance:Math.max(1,section.offsetHeight-scene.offsetHeight)};previousProgress=-1;update();}
 function update(){
  requested=false;if(!inView)return;
  const p=reduced.matches?0:clamp((16+scrollY-geometry.top)/geometry.distance);
  if(Math.abs(p-previousProgress)<.0001)return;previousProgress=p;
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
 addEventListener('scroll',()=>{if(inView&&!requested){requested=true;requestAnimationFrame(update);}},{passive:true});
 addEventListener('resize',measureHero);addEventListener('tj:language',measureHero);new ResizeObserver(measureHero).observe(section);document.addEventListener('visibilitychange',playback);
 reduced.addEventListener('change',()=>{update();playback();});
 measureHero();playback();
})();

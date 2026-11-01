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
const cars=[
 {id:'myvi',name:'Perodua Myvi',category:'Sedan',type:'COMPACT · CITY FAVOURITE',description:'Little car. Big possibilities.',price:120,seats:5,bags:2,tag:'MOST POPULAR',image:'photo-1549317661-bd32c8ce0db2'},
 {id:'city',name:'Honda City',category:'Sedan',type:'SEDAN · EVERYDAY EASE',description:'A smooth ride, wherever life goes.',price:180,seats:5,bags:3,tag:'',image:'photo-1590362891991-f776e747a588'},
 {id:'x50',name:'Proton X50',category:'SUV',type:'SUV · ROOM TO EXPLORE',description:'For the road less ordinary.',price:230,seats:5,bags:3,tag:'GREAT VALUE',image:'photo-1519641471654-76ce0107ad1b'},
 {id:'alza',name:'Perodua Alza',category:'MPV',type:'MPV · BRING EVERYONE',description:'More room for your favourite people.',price:200,seats:7,bags:2,tag:'',image:'photo-1502877338535-766e1452684a'},
 {id:'bmw',name:'BMW 3 Series',category:'Premium',type:'PREMIUM · A LITTLE EXTRA',description:'Make every arrival an occasion.',price:550,seats:5,bags:3,tag:'TREAT YOURSELF',image:'photo-1555215695-3004980ad54e'},
 {id:'alphard',name:'Toyota Alphard',category:'MPV',type:'MPV · TRAVEL BEAUTIFULLY',description:'First-class comfort. Every kilometre.',price:650,seats:7,bags:4,tag:'',image:'photo-1544620347-c4fd4a3d5957'}
];
const $=s=>document.querySelector(s);let category='All';let selected=null;
const dateString=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const today=new Date();$('#pickup').min=dateString(today);$('#pickup').value=dateString(new Date(today.getFullYear(),today.getMonth(),today.getDate()+1));$('#return').value=dateString(new Date(today.getFullYear(),today.getMonth(),today.getDate()+4));
function syncDates(){const next=new Date($('#pickup').value+'T12:00:00');next.setDate(next.getDate()+1);$('#return').min=dateString(next);if($('#return').value<$('#return').min)$('#return').value=$('#return').min;}syncDates();$('#pickup').addEventListener('change',syncDates);
function days(){return Math.max(1,Math.round((new Date($('#return').value)-new Date($('#pickup').value))/86400000));}
function render(){let list=cars.filter(c=>(category==='All'||c.category===category)&&c.price<=Number($('#budget').value)&&(!$('#seats').checked||c.seats>=6)&&$('#automatic').checked);if($('#sort').value==='low')list.sort((a,b)=>a.price-b.price);if($('#sort').value==='high')list.sort((a,b)=>b.price-a.price);$('#count').textContent=list.length;$('#budgetLabel').textContent='RM '+Number($('#budget').value).toLocaleString();$('#cars').innerHTML=list.length?list.map(c=>`<article class="car"><div class="car-top"><div class="car-tag">${c.category==='Sedan'&&c.id==='myvi'?'COMPACT':c.category.toUpperCase()} ${c.tag?`<span class="tag">${c.tag}</span>`:''}</div><h3>${c.name}</h3><p class="car-sub">${c.description}</p></div><div class="car-image"><img src="./assets/${c.id}.jpg" alt="${c.name} rental category — illustrative vehicle photo" loading="lazy"></div><div class="specs"><span>♙ &nbsp;${c.seats} seats</span><span>▣ &nbsp;${c.bags} bags</span><span>⚙ &nbsp;Auto</span></div><div class="car-bottom"><div><div class="price"><small>RM</small>${c.price}<span class="per-day">/ day</span></div><div class="deposit">${days()} days · RM ${(c.price*days()).toLocaleString()} estimated</div></div><button class="book" data-car="${c.id}">View deal ↗</button></div></article>`).join(''):'<div class="empty">No cars match these filters.<br><br>Try a higher budget or reset your filters.</div>';}
document.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>{category=b.dataset.category;document.querySelectorAll('[data-category]').forEach(x=>x.classList.toggle('selected',x===b));render();});
['budget','seats','automatic','sort'].forEach(id=>$('#'+id).addEventListener(id==='budget'?'input':'change',render));$('#reset').onclick=()=>{category='All';$('#budget').value=1000;$('#seats').checked=false;$('#automatic').checked=true;$('#sort').value='recommended';document.querySelectorAll('[data-category]').forEach(b=>b.classList.toggle('selected',b.dataset.category==='All'));render();};
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),3500);}
$('#search').onsubmit=e=>{e.preventDefault();if($('#return').value<=$('#pickup').value){toast('Return date must be after pick-up.');return;}render();$('#fleet').scrollIntoView({behavior:'smooth'});toast(`Showing cars for ${days()} days · ${$('#location').value}`);};
const modal=$('#modal');$('.close').onclick=()=>modal.close();modal.addEventListener('click',e=>{if(e.target===modal&&e.clientX<modal.getBoundingClientRect().left||e.target===modal&&e.clientX>modal.getBoundingClientRect().right)modal.close();});
function openModal(content){$('#modalContent').innerHTML=content;modal.showModal();}
$('#cars').onclick=e=>{const b=e.target.closest('[data-car]');if(!b)return;selected=cars.find(c=>c.id===b.dataset.car);openModal(`<div class="eyebrow">YOUR NEXT CHAPTER</div><h2>${selected.name}</h2><p>${selected.seats} seats · Automatic · ${selected.category}</p><div class="summary">${$('#location').value}<br>${$('#pickup').value} → ${$('#return').value}<br>${days()} days × RM ${selected.price}<br><strong>Estimated rental: RM ${(days()*selected.price).toLocaleString()}</strong></div><p class="notice">Demo booking: this saves a request on this device only. Availability, insurance, deposit and final charges require confirmation by the rental team. No payment is collected. Vehicle photos are illustrative.</p><form id="reserve"><label>Your name<input name="name" autocomplete="name" required maxlength="80" placeholder="Full name"></label><label>Email address<input name="email" type="email" autocomplete="email" required placeholder="you@example.com"></label><label>Phone number<input name="phone" type="tel" autocomplete="tel" required minlength="8" placeholder="+60"></label><button class="primary">Save booking request ↗</button></form>`);$('#reserve').onsubmit=e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.target));const booking={...data,ref:'TJ-'+crypto.randomUUID().slice(0,8).toUpperCase(),car:selected.name,location:$('#location').value,pickup:$('#pickup').value,return:$('#return').value,total:days()*selected.price};try{const saved=JSON.parse(localStorage.getItem('fnf-bookings')||'[]');saved.push(booking);localStorage.setItem('fnf-bookings',JSON.stringify(saved));}catch{toast('Your browser could not save the request. Please enable local storage.');return;}openConfirmation(booking);};};
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
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const clamp=n=>Math.max(0,Math.min(1,n));
 let requested=false,userPaused=false,inView=true,introDone=!document.getElementById('brandIntro');
 function label(){toggle.innerHTML=video.paused?'Play film <span aria-hidden="true">▶</span>':'Pause film <span aria-hidden="true">Ⅱ</span>';toggle.setAttribute('aria-label',video.paused?'Play background video':'Pause background video');}
 function playback(){
  if(!document.hidden&&inView&&introDone&&!userPaused&&!reduced.matches){video.play().catch(label);}else{video.pause();}label();
 }
 video.addEventListener('play',label);video.addEventListener('pause',label);
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

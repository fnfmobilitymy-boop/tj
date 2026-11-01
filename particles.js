(() => {
 const section=document.getElementById('particleStory'),canvas=document.getElementById('journeyParticles');if(!section||!canvas)return;
 const ctx=canvas.getContext('2d');if(!ctx){section.classList.add('particles-unavailable');return;}
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),small=matchMedia('(max-width:700px)'),fine=matchMedia('(pointer:fine)');
 const t=(en,zh)=>window.TJI18n.text(en,zh),clamp=v=>Math.max(0,Math.min(1,v)),smooth=v=>v*v*(3-2*v);
 const button=document.getElementById('pauseParticles');let paused=false,visible=false,frame=0,last=0,time=0,width=1,height=1,progress=0,phase=-1,particles=[];const mouse={x:-10000,y:-10000};
 const chapters=[['THE ART OF THE JOURNEY','旅途的细节美学','A thousand details.\nOne great journey.','千百处细节。\n成就一段好旅程。','Local people. Thoughtful plans. A drive that feels like you.','本地团队，细心安排，找到属于你的出行节奏。','01 / THE DETAILS','01 / 每一处细节'],['YOUR DRIVE. YOUR WAY.','你的座驾，你来决定','Made for\nyour next move.','为你的下一程\n准备就绪。','Find the brand, the space and the style for your plans.','选择适合行程的品牌、空间与风格。','02 / THE DRIVE','02 / 每一段驾驶'],['MORE ROADS. MORE POSSIBILITIES.','更多路线，更多可能','A little further.\nA lot to discover.','驶向更远处。\n发现更多精彩。','From Kuching streets to your next Borneo adventure.','从古晋街头出发，探索婆罗洲的更多精彩。','03 / THE POSSIBILITIES','03 / 更多可能']];
 chapters.forEach(c=>{for(let i=0;i<c.length;i+=2)window.TJI18n.register(c[i],c[i+1]);});
 function copy(){const index=progress<.32?0:progress<.68?1:2;if(index===phase)return;phase=index;const c=chapters[index];document.getElementById('particleEyebrow').textContent=t(c[0],c[1]);document.getElementById('particleTitle').textContent=t(c[2],c[3]);document.getElementById('particleDescription').textContent=t(c[4],c[5]);document.getElementById('particlePhase').textContent=t(c[6],c[7]);section.dataset.chapter=index;}
 function carPoint(i,n){
  // A volumetric side-profile silhouette with four wheel rings.
  if(i%4===0){const theta=(i/n)*Math.PI*42,side=i%8===0?-1:1,front=i%16<8;return {x:(front?-1.38:1.35)+Math.cos(theta)*.38,y:.52+Math.sin(theta)*.38,z:side*.65};}
  const outline=[[-2,.36],[-1.85,-.1],[-1,-.23],[-.57,-.83],[.75,-.83],[1.3,-.22],[1.92,-.05],[2,.45],[1.72,.6],[-1.8,.6],[-2,.36]];
  const p=(i/n*9.73)%10,k=Math.floor(p),f=p-k;const a=outline[k],b=outline[k+1];
  return{x:a[0]+(b[0]-a[0])*f,y:a[1]+(b[1]-a[1])*f,z:((i*0.61803398875)%1-.5)*1.3};
 }
 let groups=[[],[],[]],ambient=[],logoPoints=[],geometry={top:0,span:1},dirty=true,lastDraw=0,resizeTimer=0;
 const stage=section.querySelector('.particle-stage');
 function seed(logo=logoPoints){
  logoPoints=logo;const n=small.matches?700:2200;groups=[[],[],[]];
  particles=Array.from({length:n},(_,i)=>{const v=(i+.5)/n,y=1-2*v,r=Math.sqrt(1-y*y),theta=i*2.39996323,seed=i*12.9898;
   const sphere={x:Math.cos(theta)*r*1.65,y:y*1.65,z:Math.sin(theta)*r*1.65};
   const fallback={x:Math.cos(theta)*(.3+v*1.7),y:Math.sin(theta)*(.3+v)*.7,z:Math.sin(i)*.15};
   const point={logo:logo.length?logo[i%logo.length]:fallback,car:carPoint(i,n),sphere,size:.55+(i%7)/7,s1:Math.sin(seed),c1:Math.cos(seed),s2:Math.sin(seed*1.3),c2:Math.cos(seed*1.3),jz:Math.sin(seed*.7)};
   groups[i%5<2?0:i%5===2?1:2].push(point);return point;
  });
  ambient=Array.from({length:small.matches?25:55},(_,i)=>({x:Math.sin(i*74.17)*.5+.5,y:Math.cos(i*31.1)*.5+.5,speed:i%3+1,size:i%3===0?1.4:.7}));dirty=true;
 }
 function measure(){
  const rect=canvas.getBoundingClientRect(),sectionRect=section.getBoundingClientRect();
  geometry.top=sectionRect.top+scrollY;geometry.span=Math.max(1,section.offsetHeight-stage.offsetHeight);
  const w=Math.round(rect.width),h=Math.round(rect.height);
  if(w!==width||h!==height){width=w;height=h;const budget=Math.sqrt(2200000/Math.max(1,width*height));const dpr=Math.min(devicePixelRatio||1,small.matches?1.25:1.5,budget);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);dirty=true;}
  updateProgress(true);
 }
 function updateProgress(force=false){
  if(!visible&&!force)return;
  const next=reduced.matches?0:clamp((scrollY-geometry.top)/geometry.span);
  if(force||Math.abs(next-progress)>.0001){progress=next;copy();dirty=true;if(visible&&!frame)draw();}
 }
 function draw(){
  if(!visible||reduced.matches||document.hidden)return;
  ctx.clearRect(0,0,width,height);
  const phaseProgress=progress<.5?clamp(progress/.48):clamp((progress-.5)/.48),mix=smooth(phaseProgress),burst=Math.sin(mix*Math.PI)*.65;
  const yaw=Math.sin(time*.14)*.22+(progress<.5?mix*.45:.45+mix*.8),cy=Math.cos(yaw),sy=Math.sin(yaw),scale=Math.min(width*(small.matches?.21:.12),height*.25),centerX=width*(small.matches?.5:.69),centerY=height*(small.matches?.68:.50);
  const ct1=Math.cos(time*.4),st1=Math.sin(time*.4),ct2=Math.cos(time*.3),st2=Math.sin(time*.3),interactive=fine.matches&&mouse.x>=0;
  const colors=['#d6b778','#dce5eb','#589ac2'];
  for(let g=0;g<groups.length;g++){
   ctx.fillStyle=colors[g];ctx.globalAlpha=g===1?.86:.78;ctx.beginPath();
   for(const p of groups[g]){
    const from=progress<.5?p.logo:p.car,to=progress<.5?p.car:p.sphere;
    const x=from.x+(to.x-from.x)*mix+(p.s1*ct1+p.c1*st1)*burst;
    const y=from.y+(to.y-from.y)*mix+(p.c2*ct2-p.s2*st2)*burst;
    const z=from.z+(to.z-from.z)*mix+p.jz*burst;
    const rx=x*cy+z*sy,rz=z*cy-x*sy,depth=5/(5+rz);let px=centerX+rx*scale*depth,py=centerY+y*scale*depth;
    if(interactive){const dx=px-mouse.x,dy=py-mouse.y,d2=dx*dx+dy*dy;if(d2>0&&d2<10000){const d=Math.sqrt(d2),force=(1-d/100)*14;px+=dx/d*force;py+=dy/d*force;}}
    const radius=p.size*depth;ctx.moveTo(px+radius,py);ctx.arc(px,py,radius,0,Math.PI*2);
   }
   ctx.fill();
  }
  ctx.fillStyle='#d8c596';ctx.globalAlpha=.3;
  for(const dot of ambient)ctx.fillRect((dot.x*width+time*dot.speed)%width,dot.y*height,dot.size,dot.size);
  ctx.globalAlpha=1;dirty=false;
 }
 function running(){return visible&&!document.hidden&&!paused&&!reduced.matches;}
 function tick(stamp){
  frame=0;if(!running()){lastDraw=0;return;}
  const interval=small.matches?1000/30:1000/60;
  if(!lastDraw||stamp-lastDraw>=interval-.8){time+=lastDraw?Math.min(stamp-lastDraw,100)/1000:0;lastDraw=stamp;draw();}
  frame=requestAnimationFrame(tick);
 }
 function refresh(){
  button.disabled=reduced.matches;button.textContent=reduced.matches?t('Motion reduced','已减少动态效果'):paused?t('Play particles','播放粒子动画'):t('Pause particles','暂停粒子动画');button.setAttribute('aria-pressed',String(paused));section.classList.toggle('particles-reduced',reduced.matches);
  if(!running()){cancelAnimationFrame(frame);frame=0;lastDraw=0;if(visible&&dirty)draw();}else if(!frame)frame=requestAnimationFrame(tick);
 }
 button.onclick=()=>{paused=!paused;refresh();};
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)measure();refresh();},{threshold:.02}).observe(section);
 let scrollQueued=false;addEventListener('scroll',()=>{if(visible&&!scrollQueued){scrollQueued=true;requestAnimationFrame(()=>{scrollQueued=false;updateProgress();});}},{passive:true});
 canvas.addEventListener('pointermove',e=>{if(!visible||!fine.matches)return;const rect=canvas.getBoundingClientRect();mouse.x=e.clientX-rect.left;mouse.y=e.clientY-rect.top;});canvas.addEventListener('pointerleave',()=>{mouse.x=mouse.y=-10000;});
 addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(particles.length!==(small.matches?700:2200))seed();measure();},120);});
 document.addEventListener('visibilitychange',refresh);reduced.addEventListener('change',()=>{refresh();measure();refresh();});addEventListener('tj:language',()=>{phase=-1;measure();copy();refresh();});
 seed();measure();refresh();
 const image=new Image();image.onload=()=>{
  const sample=document.createElement('canvas');sample.width=300;sample.height=100;const sc=sample.getContext('2d');sc.drawImage(image,0,0,300,100);const data=sc.getImageData(0,0,300,100).data,points=[];
  for(let y=0;y<100;y+=2)for(let x=0;x<300;x+=2){const k=(y*300+x)*4;if(Math.max(data[k],data[k+1],data[k+2])>100&&data[k+3]>100)points.push({x:(x/300-.5)*4.5,y:(y/100-.5)*1.5,z:Math.sin(x*.1)*.04});}
  seed(points);if(visible)draw();
 };image.src='./assets/tj-logo.png';
})();

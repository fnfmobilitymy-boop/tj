(() => {
 const header=document.querySelector('.nav-compact'),menu=document.getElementById('headerLinks'),toggle=document.getElementById('navToggle');if(!header||!menu||!toggle)return;
 function open(value){header.classList.toggle('menu-open',value);toggle.setAttribute('aria-expanded',String(value));const label=value?'Close menu':'Open menu';toggle.setAttribute('data-original-aria-label',label);toggle.setAttribute('aria-label',window.TJI18n.text(label));}
 toggle.onclick=()=>open(toggle.getAttribute('aria-expanded')!=='true');
 document.getElementById('bookingLookup').addEventListener('click',()=>open(false));
 menu.addEventListener('click',event=>{const item=event.target.closest('a,button');if(!item)return;menu.querySelectorAll('a,button').forEach(link=>{link.classList.toggle('active',link===item);if(link===item)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});open(false);});
 document.addEventListener('click',event=>{if(!header.contains(event.target))open(false);});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){open(false);toggle.focus();}});
 matchMedia('(min-width:1280px)').addEventListener('change',event=>{if(event.matches)open(false);});
})();

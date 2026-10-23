document.querySelectorAll('a[data-group]').forEach(a=>{a.addEventListener('click',()=>{const group=a.dataset.group;try{if(typeof fbq==='function'){fbq('trackCustom','CliqueGrupoWhatsApp',{grupo:group});fbq('trackCustom','CliqueGrupo'+group.charAt(0).toUpperCase()+group.slice(1));}}catch(e){};});});const p=new URLSearchParams(location.search);const g=p.get('grupo')||p.get('g');const cards=document.querySelector('.groups');const first=document.querySelector('[data-group-card="'+(g||'')+'"]');if(cards&&first)cards.prepend(first);
(()=>{const modal=document.getElementById('gallery-modal'),photo=document.getElementById('gallery-image'),title=document.getElementById('gallery-title'),counter=document.getElementById('gallery-count');let images=[],index=0,lastFocus=null,startX=0;
function render(){photo.src=images[index];counter.textContent=`${index+1} de ${images.length}`;}
function close(){modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('gallery-open');photo.removeAttribute('src');lastFocus?.focus();}
function move(n){index=(index+n+images.length)%images.length;render();}
document.querySelectorAll('.show-offers').forEach(b=>b.addEventListener('click',()=>{images=b.dataset.images.split('|').filter(Boolean);if(!images.length)return;index=0;lastFocus=b;title.textContent=b.dataset.galleryTitle;modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');document.body.classList.add('gallery-open');render();document.getElementById('gallery-close').focus();}));
document.getElementById('gallery-close').addEventListener('click',close);
document.getElementById('gallery-done').addEventListener('click',close);
document.getElementById('gallery-prev').addEventListener('click',()=>move(-1));
document.getElementById('gallery-next').addEventListener('click',()=>move(1));
modal.addEventListener('click',e=>{if(e.target===modal)close();});
document.addEventListener('keydown',e=>{if(!modal.classList.contains('is-open'))return;if(e.key==='Escape')close();if(e.key==='ArrowRight')move(1);if(e.key==='ArrowLeft')move(-1);});
photo.addEventListener('touchstart',e=>{startX=e.changedTouches[0].screenX},{passive:true});
photo.addEventListener('touchend',e=>{const d=e.changedTouches[0].screenX-startX;if(Math.abs(d)>45)move(d<0?1:-1)},{passive:true});
})();

'use strict';
const cfg=window.OLHAI_CONFIG||{};
const pixelId=String(cfg.metaPixelId||'').trim();
if(/^\d+$/.test(pixelId)){
 (function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=true;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=true;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)})(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
 fbq('init',pixelId);fbq('track','PageView');
}
let groupUrl=null;
try{const u=new URL(cfg.groupUrl);if(u.protocol==='https:'&&u.hostname==='chat.whatsapp.com')groupUrl=u.href}catch{}
document.querySelectorAll('[data-group]').forEach(a=>{
 if(groupUrl)a.href=groupUrl;
 a.addEventListener('click',e=>{
  if(!groupUrl){e.preventDefault();alert('O link do grupo está indisponível no momento.');return;}
  if(typeof fbq==='function')fbq('trackCustom','CliqueGrupoWhatsApp',{source:'botao',destination:'WhatsApp',content_name:'OLHAI'});
 });
});
const images=Array.from({length:15},(_,i)=>`oferta-${String(i+1).padStart(2,'0')}.jpeg`);
const track=document.getElementById('carousel-track');
const viewport=document.getElementById('carousel-viewport');
const dialog=document.getElementById('image-dialog');
const expanded=document.getElementById('expanded-image');
for(let cycle=0;cycle<2;cycle++)for(let i=0;i<images.length;i++){
 const btn=document.createElement('button');btn.type='button';btn.className='offer-card';btn.setAttribute('aria-label',`Ampliar print da oferta ${i+1}`);
 const img=document.createElement('img');img.className='offer-image';img.src=images[i];img.alt=`Print original da oferta ${i+1}`;img.loading=(cycle===0&&i<4)?'eager':'lazy';img.draggable=false;
 btn.append(img);btn.addEventListener('click',()=>{if(suppressClick)return;expanded.src=images[i];dialog.showModal()});track.append(btn);
}
document.getElementById('close-image').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
let offset=0,half=0,dragging=false,startX=0,startOffset=0,lastTime=0,suppressClick=false,pauseUntil=0;
const measure=()=>{half=track.children[15].offsetLeft-track.children[0].offsetLeft;offset=((offset%half)+half)%half;render()};
const render=()=>{track.style.transform=`translate3d(${-offset}px,0,0)`};
const normalize=()=>{if(half)offset=((offset%half)+half)%half};
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function frame(time){if(lastTime&&!dragging&&!reduced&&time>pauseUntil){offset+=(time-lastTime)*.028;normalize();render()}lastTime=time;requestAnimationFrame(frame)}
viewport.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;dragging=true;startX=e.clientX;startOffset=offset;suppressClick=false;viewport.classList.add('dragging');viewport.setPointerCapture(e.pointerId)});
viewport.addEventListener('pointermove',e=>{if(!dragging)return;const delta=e.clientX-startX;if(Math.abs(delta)>6)suppressClick=true;offset=startOffset-delta;normalize();render()});
function release(){if(!dragging)return;dragging=false;viewport.classList.remove('dragging');pauseUntil=performance.now()+1600;setTimeout(()=>suppressClick=false,100)}
viewport.addEventListener('pointerup',release);viewport.addEventListener('pointercancel',release);viewport.addEventListener('lostpointercapture',release);
viewport.addEventListener('mouseenter',()=>{pauseUntil=performance.now()+300});
viewport.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>Math.abs(e.deltaY)){e.preventDefault();offset+=e.deltaX;normalize();render();pauseUntil=performance.now()+1300}},{passive:false});
window.addEventListener('resize',measure);window.addEventListener('load',measure);measure();requestAnimationFrame(frame);
const policies={terms:['Termos de uso','O OLHAI compartilha ofertas e links de lojas terceirizadas. Preços, descontos, frete, estoque e cupons podem mudar. Confira os valores e condições no aplicativo da loja antes de comprar. A participação no grupo é gratuita e alguns links podem gerar comissão de afiliado.'],privacy:['Privacidade','Esta página não solicita cadastro. O Meta Pixel é usado para medir visualizações e cliques no botão do WhatsApp. Um clique não confirma entrada no grupo. Ao abrir o WhatsApp, aplicam-se também as políticas desse serviço.']};
const policyDialog=document.getElementById('policy-dialog');
document.querySelectorAll('[data-policy]').forEach(b=>b.addEventListener('click',()=>{const [title,body]=policies[b.dataset.policy];document.getElementById('policy-title').textContent=title;document.getElementById('policy-text').textContent=body;policyDialog.showModal()}));
document.getElementById('close-policy').addEventListener('click',()=>policyDialog.close());

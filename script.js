"use strict";
const cfg=window.OLHAI_CONFIG||{};
const pixelId=String(cfg.metaPixelId||'').trim();
if(/^\d+$/.test(pixelId)){
(function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=true;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=true;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)})(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init',pixelId);fbq('track','PageView');}
let groupUrl=null;
try{const u=new URL(cfg.groupUrl);if(u.protocol==='https:'&&u.hostname==='chat.whatsapp.com')groupUrl=u.href;}catch(e){}
for(const link of document.querySelectorAll('[data-group]')){
 if(groupUrl)link.href=groupUrl;
 link.addEventListener('click',event=>{
  event.preventDefault();
  if(!groupUrl){alert('O link do grupo está temporariamente indisponível.');return;}
  if(typeof fbq==='function')fbq('trackCustom','CliqueGrupoWhatsApp',{source:'botao',destination:'WhatsApp',content_name:'OLHAI'});
  // Não existe redirecionamento automático. Este evento registra o clique, não a entrada no grupo.
  setTimeout(()=>window.location.assign(groupUrl),220);
 });
}
const images=Array.from({length:15},(_,i)=>`oferta-${String(i+1).padStart(2,'0')}.jpeg`);
const track=document.getElementById('carousel-track');
const dialog=document.getElementById('image-dialog');
const expanded=document.getElementById('expanded-image');
images.concat(images).forEach((src,index)=>{
 const button=document.createElement('button');button.className='offer-card';button.type='button';button.setAttribute('aria-label',`Ampliar print da oferta ${index%images.length+1}`);
 const img=document.createElement('img');img.className='offer-image';img.src=src;img.alt=`Print original de oferta compartilhada no grupo, número ${index%images.length+1}`;img.loading=index<3?'eager':'lazy';img.decoding='async';
 button.append(img);button.addEventListener('click',()=>{expanded.src=src;dialog.showModal();});track.append(button);
});
document.getElementById('close-image').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
const policies={terms:['Termos de uso','O OLHAI compartilha ofertas e links de produtos de terceiros. Preços, descontos, frete, estoque e cupons podem mudar. Verifique os valores e condições no aplicativo da loja antes de comprar. O grupo é gratuito e alguns links podem gerar comissão de afiliado.'],privacy:['Privacidade','Esta página não pede nome, telefone ou cadastro. Ela utiliza o Meta Pixel para mensurar visualizações e cliques no botão de acesso ao grupo, sujeito às configurações de privacidade e consentimento aplicáveis. O clique não confirma entrada no grupo. Ao acessar o WhatsApp, aplicam-se as políticas desse serviço.']};
const policyDialog=document.getElementById('policy-dialog');
document.querySelectorAll('[data-policy]').forEach(button=>button.addEventListener('click',()=>{const [title,text]=policies[button.dataset.policy];document.getElementById('policy-title').textContent=title;document.getElementById('policy-text').textContent=text;policyDialog.showModal();}));
document.getElementById('close-policy').addEventListener('click',()=>policyDialog.close());

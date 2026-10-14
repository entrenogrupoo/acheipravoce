'use strict';
const config = window.OLHAI_CONFIG || {};
const pixelId = String(config.metaPixelId || '').trim();
if (/^\d+$/.test(pixelId)) {
  (function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=true;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=true;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)})(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init',pixelId);fbq('track','PageView');
}
let groupUrl;
try {const u = new URL(config.groupUrl);if(u.protocol==='https:' && u.hostname==='chat.whatsapp.com')groupUrl=u.href;}catch(e){}
let redirecting = false;
// Ao retornar pelo histórico do navegador, reinicia a contagem.
window.addEventListener('pageshow', e => { if (e.persisted) window.location.reload(); });
let timer;
const seconds = Math.max(1, Number(config.redirectSeconds)||7);
let remaining = seconds;
const display = document.getElementById('seconds');

function track(event,source){if(typeof fbq==='function')fbq('trackCustom',event,{source:source, destination:'WhatsApp',content_name:'OLHAI'});}
function goToGroup(source){
 if(redirecting||!groupUrl)return;
 redirecting=true;clearInterval(timer);
 track(source==='timer'?'RedirecionamentoAutomaticoGrupo':'CliqueGrupoWhatsApp',source);
 // A contagem concluída e o clique indicam encaminhamento, não entrada confirmada.
 // A pequena espera ajuda o navegador a enviar o evento antes de sair da página.
 setTimeout(()=>window.location.assign(groupUrl),280);
}
document.querySelectorAll('[data-group]').forEach(a=>{
 a.href=groupUrl||'#';
 a.removeAttribute('target');
 a.addEventListener('click',e=>{e.preventDefault();goToGroup('botao');});
});
if(groupUrl){
 timer=setInterval(()=>{
  if(document.hidden)return; // Evita redirecionar inesperadamente em aba inativa.
  remaining=Math.max(0,remaining-1);display.textContent=remaining;

  if(remaining===0)goToGroup('timer');
 },1000);
}else{document.querySelector('.countdown').textContent='Link do grupo temporariamente indisponível.';}
// Avisos informativos, não simulam entradas de participantes.
// Para exibir nomes reais, conecte uma fonte autorizada de entradas verificadas.
// Nomes fornecidos pelo responsável pela página: apenas exemplos de interface.
// Nunca apresentar como atividade real sem uma integração verificável.
const exampleNames=['Juliana','Maria','Ana','Marcela','Cris','Júlia','Marta','Mônica','Raquel','Anne','Vitória','Larissa','Josi','Mariana'];
const defaultMessages=exampleNames.map(name => [name, 'Exemplo: entrou no grupo']);
// A demonstração visual não deve ser confundida com a ocupação real do grupo.
// Se houver dados verificados, substituem a simulação automaticamente.
const capacity = config.verifiedCapacity;
let percent, capacityRemaining, verified = false;
if (capacity && Number.isInteger(capacity.total) && capacity.total > 0 && Number.isInteger(capacity.remaining) && capacity.remaining >= 0 && capacity.remaining <= capacity.total) {
  percent = Math.round((capacity.total - capacity.remaining) / capacity.total * 100);
  capacityRemaining = capacity.remaining;
  verified = true;
} else {
  const demo = [{percent:93, remaining:10}, {percent:94, remaining:8}, {percent:96, remaining:6}];
  const selection = demo[Math.floor(Math.random() * demo.length)];
  percent = selection.percent;
  capacityRemaining = selection.remaining;
}
document.getElementById('capacity-title').textContent = verified ? 'Vagas preenchidas hoje' : 'Prévia de ocupação';
document.getElementById('capacity-percent').textContent = percent + '%';
document.getElementById('capacity-message').textContent = '⚡ Restam ' + capacityRemaining + ' vagas hoje';
document.getElementById('capacity-note').textContent = verified ? '' : 'Exemplo ilustrativo';
requestAnimationFrame(() => requestAnimationFrame(() => {
  document.getElementById('capacity-fill').style.width = percent + '%';
}));
// Use nomes somente quando entradas reais forem informadas em config.js.
const verifiedJoins = Array.isArray(config.verifiedJoins) ? config.verifiedJoins.filter(x => typeof x === 'string' && x.trim()) : [];
const messages = verifiedJoins.length ? verifiedJoins.map(name => [name.trim(), 'entrou no grupo']) : defaultMessages;
document.getElementById('toast-disclaimer').hidden = verifiedJoins.length > 0;
const toast=document.getElementById('toast');let toastIndex=0;
function showToast(){if(document.hidden)return;const [name,message]=messages[toastIndex++%messages.length];document.getElementById('toast-name').textContent=name;document.getElementById('toast-message').textContent=message;toast.hidden=false;toast.classList.remove('toast-in');void toast.offsetWidth;toast.classList.add('toast-in');setTimeout(()=>{toast.hidden=true;},1450);}
setTimeout(()=>{showToast();setInterval(showToast,Math.max(2000,Number(config.notificationIntervalMs)||2000));},650);
document.getElementById('dismiss-toast').onclick=()=>toast.hidden=true;
const policies={terms:['Termos de uso','O OLHAI compartilha links de ofertas da Shopee. Preços, estoque e condições de compra são definidos pela loja e podem mudar. Confira os detalhes antes de comprar. A participação no grupo é gratuita. Alguns links podem gerar comissão de afiliado.'],privacy:['Privacidade','Esta página não solicita cadastro. O Pixel da Meta pode registrar visitas e cliques para mensuração de anúncios, sujeito às suas configurações de privacidade e consentimento aplicáveis. O redirecionamento automático ou clique não confirma entrada no grupo. Ao acessar o WhatsApp, aplicam-se as políticas do serviço.']};
const dialog=document.getElementById('policy-dialog');document.querySelectorAll('[data-policy]').forEach(b=>b.onclick=()=>{const data=policies[b.dataset.policy];document.getElementById('policy-title').textContent=data[0];document.getElementById('policy-text').textContent=data[1];dialog.showModal();});
document.querySelector('#policy-dialog .close-dialog').onclick=()=>dialog.close();
const offerDialog=document.getElementById('offer-dialog');document.getElementById('close-offer').onclick=()=>offerDialog.close();

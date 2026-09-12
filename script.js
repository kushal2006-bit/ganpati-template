const arrival = new Date('2026-09-14T10:00:00+05:30').getTime();
const $ = id => document.getElementById(id);
function tick(){
  const now=Date.now();
  let diff=Math.max(0,arrival-now);
  const d=Math.floor(diff/86400000); diff%=86400000;
  const h=Math.floor(diff/3600000); diff%=3600000;
  const m=Math.floor(diff/60000); const s=Math.floor((diff%60000)/1000);
  $('days').textContent=String(d).padStart(2,'0'); $('hours').textContent=String(h).padStart(2,'0'); $('minutes').textContent=String(m).padStart(2,'0'); $('seconds').textContent=String(s).padStart(2,'0');
}
tick(); setInterval(tick,1000);

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.event-card,.person,.invite-card,.venue-grid').forEach(el=>{el.style.transition='opacity .7s ease,transform .7s ease';el.style.opacity='0';el.style.transform='translateY(20px)';observer.observe(el)});
const style=document.createElement('style');style.textContent='.visible{opacity:1!important;transform:none!important}';document.head.appendChild(style);

// Start the bhajan automatically. Browsers may block audible autoplay until the visitor interacts.
// The audio starts muted, then we attempt to unmute and play. On the first user interaction,
// we retry with sound so the bhajan begins without needing a visible play button.
const music = $('bgMusic');

async function playBhajan(){
  if(!music) return;
  try {
    music.muted = false;
    await music.play();
  } catch(error) {
    // Browser autoplay policy blocked sound. Retry immediately after the first interaction.
    music.muted = true;
    try { await music.play(); } catch(e) {}
  }
}

function enableSound(){
  if(!music) return;
  music.muted = false;
  music.play().catch(()=>{});
  document.removeEventListener('pointerdown', enableSound);
  document.removeEventListener('keydown', enableSound);
  document.removeEventListener('touchstart', enableSound);
}

music.addEventListener('canplay', playBhajan, {once:true});
window.addEventListener('load', playBhajan);
document.addEventListener('pointerdown', enableSound, {passive:true, once:true});
document.addEventListener('keydown', enableSound, {passive:true, once:true});
document.addEventListener('touchstart', enableSound, {passive:true, once:true});
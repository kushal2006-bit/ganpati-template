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

// Try to start the bhajan immediately, including before waiting for window load.
// Browsers may still block audible autoplay due to their media-autoplay policy.
const music = $('bgMusic');

function tryPlay(){
  if(!music) return;
  music.volume = 1;
  const attempt = music.play();
  if(attempt && typeof attempt.catch === 'function') attempt.catch(()=>{});
}

if(music){
  // HTML autoplay is already enabled; reinforce it as early as possible.
  music.autoplay = true;
  music.muted = false;
  tryPlay();
  document.addEventListener('DOMContentLoaded', tryPlay, {once:true});
  window.addEventListener('pageshow', tryPlay, {once:true});

  // Best-effort fallback for browsers that block audible autoplay: the very first
  // user interaction immediately starts the bhajan, with no visible play button.
  const unlock = () => {
    music.muted = false;
    music.volume = 1;
    tryPlay();
  };
  document.addEventListener('pointerdown', unlock, {once:true, passive:true});
  document.addEventListener('touchstart', unlock, {once:true, passive:true});
  document.addEventListener('keydown', unlock, {once:true});
}
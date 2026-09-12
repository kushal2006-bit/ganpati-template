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

// Background bhajan. Browsers may block sound autoplay, so the first user interaction starts it.
const music = $('bgMusic');
const musicToggle = $('musicToggle');
function updateMusicButton(){
  musicToggle.textContent = music.paused ? '♪ Play Bhajan' : '❚❚ Pause Bhajan';
  musicToggle.setAttribute('aria-label', music.paused ? 'Play Ganesh bhajan' : 'Pause Ganesh bhajan');
}
async function startMusic(){
  try { await music.play(); } catch(e) {}
  updateMusicButton();
}
musicToggle.addEventListener('click',()=>{
  if(music.paused) startMusic();
  else { music.pause(); updateMusicButton(); }
});
['click','touchstart','keydown'].forEach(eventName=>{
  document.addEventListener(eventName,()=>{ if(music.paused) startMusic(); },{once:true,passive:true});
});
startMusic();

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

const music = $('bgMusic');
const toggle = $('musicToggle');

function updateMusicButton(){
  if(!toggle || !music) return;
  const playing = !music.paused && !music.ended;
  toggle.textContent = playing ? 'Ⅱ Stop Song' : '♫ Play Song';
  toggle.setAttribute('aria-label', playing ? 'Stop song' : 'Play song');
  toggle.setAttribute('aria-pressed', playing ? 'true' : 'false');
}

function tryPlay(){
  if(!music) return;
  music.autoplay = true;
  music.muted = false;
  music.volume = 1;
  const attempt = music.play();
  if(attempt && typeof attempt.then === 'function'){
    attempt.then(updateMusicButton).catch(updateMusicButton);
  }
}

if(music){
  updateMusicButton();
  music.addEventListener('play', updateMusicButton);
  music.addEventListener('pause', updateMusicButton);
  music.addEventListener('ended', updateMusicButton);

  // Start immediately on page entry and retry once the audio file is ready.
  tryPlay();
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', tryPlay, {once:true});
  }else{
    tryPlay();
  }
  music.addEventListener('loadeddata', tryPlay, {once:true});
  music.addEventListener('canplay', tryPlay, {once:true});
  window.addEventListener('pageshow', tryPlay, {once:true});
  setTimeout(tryPlay, 250);
  setTimeout(tryPlay, 1000);

  // If the browser blocks audible autoplay, the first visitor interaction starts it.
  const unlock = () => {
    music.muted = false;
    music.volume = 1;
    tryPlay();
  };
  document.addEventListener('pointerdown', unlock, {once:true, passive:true});
  document.addEventListener('keydown', unlock, {once:true});
}

if(toggle && music){
  toggle.addEventListener('click', (event) => {
    event.preventDefault();
    if(music.paused || music.ended){
      music.muted = false;
      music.volume = 1;
      music.play().then(updateMusicButton).catch(updateMusicButton);
    }else{
      music.pause();
      updateMusicButton();
    }
  });
}
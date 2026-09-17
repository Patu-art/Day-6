const menu=document.querySelector('.menu');
const nav=document.querySelector('#nav');
const body=document.body;

/* Load the media-quality correction last so older animation CSS cannot soften images. */
const crispMediaCss=document.createElement('link');
crispMediaCss.rel='stylesheet';
crispMediaCss.href='css/crisp-media.css?v=3';
document.head.appendChild(crispMediaCss);

/*
  The first user-supplied exterior is 480px wide. It is good for a phone/card,
  but stretching it across a large desktop hero makes it look soft. Keep the
  supplied asset on compact screens and use a genuine higher-resolution Wild
  Alderman exterior for large display areas.
*/
const localExterior='assets/images/always-the-same-hero.jpg?v=3';
const desktopExterior='https://d2joqs9jfh6k92.cloudfront.net/wp-content/uploads/2025/07/28162227/thewildalderman_1753520440_3685119002759551801_74750789206-e1753719767580.jpg';
const localInterior='assets/images/daytime-interior.jpg?v=3';
const desktopInterior='https://d2s8km3brsjp0y.cloudfront.net/eyJidWNrZXQiOiJ3aGF0cHViIiwia2V5IjoiTUFTXC9NQVMrNDE5My0xNzM5ODg4LTI0MDAtMTgwMC5qcGciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjgwMCwiaGVpZ2h0Ijo2MDAsImZpdCI6ImNvdmVyIn0sInJvdGF0ZSI6bnVsbH19';

function applySharpMedia(){
  const compact=innerWidth<=760;
  document.querySelectorAll('.hero-media img,.visit-media img').forEach(img=>{
    const next=compact?localExterior:desktopExterior;
    if(img.src!==next) img.src=next;
  });
  const daylight=document.querySelector('.daylight-photo');
  if(daylight){
    const next=compact?localInterior:desktopInterior;
    if(daylight.src!==next) daylight.src=next;
  }
  document.querySelectorAll('.venue-shot img,.owner-photo img').forEach(img=>{
    const clean=img.getAttribute('src')?.split('?')[0];
    if(clean?.startsWith('assets/')) img.src=`${clean}?v=3`;
  });
}
applySharpMedia();
let mediaResizeTimer;
addEventListener('resize',()=>{
  clearTimeout(mediaResizeTimer);
  mediaResizeTimer=setTimeout(applySharpMedia,120);
},{passive:true});

function closeMenu(){
  nav?.classList.remove('open');
  menu?.setAttribute('aria-expanded','false');
  if(menu) menu.textContent='MENU';
  body.classList.remove('menu-open');
}

menu?.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  menu.setAttribute('aria-expanded',String(open));
  menu.textContent=open?'CLOSE':'MENU';
  body.classList.toggle('menu-open',open);
});

nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));

document.addEventListener('keydown',event=>{
  if(event.key==='Escape') closeMenu();
});

addEventListener('resize',()=>{
  if(innerWidth>760) closeMenu();
},{passive:true});

const progressBar=document.querySelector('.progress');
function updateProgress(){
  const doc=document.documentElement;
  const max=doc.scrollHeight-innerHeight;
  if(progressBar) progressBar.style.width=`${max>0?(scrollY/max)*100:0}%`;
}
addEventListener('scroll',updateProgress,{passive:true});
updateProgress();

const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const compactMotion=matchMedia('(max-width: 760px), (pointer: coarse)');

const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.08,rootMargin:'0px 0px -4%'});

document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

const sections=[...document.querySelectorAll('main section[id]')];
const navLinks=[...document.querySelectorAll('#nav a')];
const navObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    navLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${entry.target.id}`));
  });
},{rootMargin:'-38% 0px -54% 0px',threshold:0});
sections.forEach(section=>navObserver.observe(section));

const stepCards=[...document.querySelectorAll('.step')];
if(compactMotion.matches){
  stepCards.forEach(card=>card.addEventListener('click',()=>{
    stepCards.forEach(item=>item.classList.remove('is-active'));
    card.classList.add('is-active');
  }));
}else{
  const stepObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        stepCards.forEach(card=>card.classList.remove('is-active'));
        entry.target.classList.add('is-active');
      }
    });
  },{threshold:.58});
  stepCards.forEach(card=>stepObserver.observe(card));
}

const parallaxMedia=[...document.querySelectorAll('[data-parallax] img')];
const sun=document.querySelector('.sun');
const sunStage=document.querySelector('[data-sun-stage]');
const dayCounter=document.querySelector('.day-counter b:first-child');

function resetTouchMotion(){
  parallaxMedia.forEach(img=>{img.style.transform='';});
  if(sun) sun.style.transform='translateX(-50%)';
}

function paintMotion(){
  /* Raster photo parallax was also contributing to softness, so media stays still. */
  parallaxMedia.forEach(img=>{img.style.transform='';});
  if(reduceMotion||compactMotion.matches){
    if(sun) sun.style.transform='translateX(-50%)';
    return;
  }

  if(sun&&sunStage){
    const rect=sunStage.getBoundingClientRect();
    const span=innerHeight+rect.height;
    const p=Math.max(0,Math.min(1,(innerHeight-rect.top)/span));
    const arc=Math.sin(p*Math.PI);
    const x=(p-.5)*150;
    const y=(1-arc)*145;
    sun.style.transform=`translateX(calc(-50% + ${x}px)) translateY(${y}px)`;
    if(dayCounter) dayCounter.textContent=p<.34?'01':p<.68?'02':'03';
  }
}

if(!reduceMotion){
  addEventListener('scroll',paintMotion,{passive:true});
  addEventListener('resize',paintMotion,{passive:true});
  compactMotion.addEventListener?.('change',paintMotion);
  paintMotion();

  document.querySelectorAll('.magnetic').forEach(el=>{
    el.addEventListener('pointermove',event=>{
      if(compactMotion.matches) return;
      const rect=el.getBoundingClientRect();
      const x=(event.clientX-rect.left-rect.width/2)*.08;
      const y=(event.clientY-rect.top-rect.height/2)*.08;
      el.style.transform=`translate(${x}px,${y}px)`;
    });
    el.addEventListener('pointerleave',()=>{el.style.transform='';});
  });
}else{
  resetTouchMotion();
}

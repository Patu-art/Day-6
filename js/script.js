const menu=document.querySelector('.menu'),nav=document.querySelector('nav');menu?.addEventListener('click',()=>{const o=nav.classList.toggle('open');menu.setAttribute('aria-expanded',o);menu.textContent=o?'CLOSE':'MENU'});nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.textContent='MENU';menu.setAttribute('aria-expanded','false')}));
const bar=document.querySelector('.progress');function progress(){const d=document.documentElement,m=d.scrollHeight-innerHeight;bar.style.width=(m?scrollY/m*100:0)+'%'}addEventListener('scroll',progress,{passive:true});progress();
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.08});document.querySelectorAll('.reveal').forEach(e=>io.observe(e));
document.querySelectorAll('video').forEach(v=>{v.muted=true;v.playsInline=true;v.loop=true;v.play().catch(()=>{})});

const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduce){
 const hero=document.querySelector('.hero-media img');
 addEventListener('scroll',()=>{if(hero){const y=Math.min(scrollY*.035,18);hero.style.transform=`scale(1.04) translateY(${y}px)`}},{passive:true});
}

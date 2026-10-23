import {collectQuery,QUERY_KEYS} from './bot/core.js';
const attribution=collectQuery(location.search,QUERY_KEYS);
for(const link of document.querySelectorAll('[data-inquiry]')){
  const url=new URL(link.getAttribute('href'),location.href);
  for(const [key,value]of Object.entries(attribution))if(!url.searchParams.has(key))url.searchParams.set(key,value);
  link.href=url.href;
}
const exampleVideo=document.getElementById('example-video');
const playButton=document.getElementById('example-play');
const exampleError=document.getElementById('example-error');
const updatePlayback=()=>{playButton.textContent=exampleVideo.paused?'▶ 選択中の動画を再生':'Ⅱ 再生を一時停止';};
for(const button of document.querySelectorAll('[data-example]'))button.addEventListener('click',()=>{
  if(button.getAttribute('aria-pressed')==='true')return;
  exampleVideo.pause();
  exampleError.hidden=true;
  exampleVideo.poster=`./assets/examples/${button.dataset.example}.jpg`;
  exampleVideo.src=`./assets/examples/${button.dataset.example}.mp4`;
  exampleVideo.setAttribute('aria-label',`着物買取広告・${button.dataset.title}`);
  exampleVideo.load();
  document.getElementById('example-title').textContent=button.dataset.title;
  document.getElementById('example-description').textContent=button.dataset.description;
  document.getElementById('example-duration').textContent=button.dataset.duration;
  document.getElementById('example-original').href=button.dataset.drive;
  for(const other of document.querySelectorAll('[data-example]')){const selected=other===button;other.classList.toggle('is-active',selected);other.setAttribute('aria-pressed',String(selected));other.querySelector('.example-selected').textContent=selected?'選択中':'選ぶ';}
  updatePlayback();
  if(matchMedia('(max-width:760px)').matches)document.querySelector('.example-stage').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});
});
playButton.addEventListener('click',()=>{
  if(!exampleVideo.paused){exampleVideo.pause();return;}
  if(exampleVideo.ended)exampleVideo.currentTime=0;
  exampleError.hidden=true;
  exampleVideo.play().catch(()=>{exampleError.hidden=false;updatePlayback();});
});
for(const event of ['play','pause','ended'])exampleVideo.addEventListener(event,updatePlayback);
exampleVideo.addEventListener('error',()=>{exampleError.hidden=false;});
document.addEventListener('visibilitychange',()=>{if(document.hidden)exampleVideo.pause();});
const sticky=document.querySelector('.mobile-cta'),hero=document.querySelector('.hero'),final=document.querySelector('.final-cta');
let pastHero=false,finalVisible=false,inlineCTAVisible=false;
const updateSticky=()=>sticky.classList.toggle('visible',pastHero&&!finalVisible&&!inlineCTAVisible);
new IntersectionObserver(entries=>{for(const e of entries)pastHero=!e.isIntersecting&&e.boundingClientRect.top<0;updateSticky();},{threshold:0}).observe(hero);
new IntersectionObserver(entries=>{for(const e of entries)finalVisible=e.isIntersecting;updateSticky();},{threshold:0}).observe(final);
// Avoid showing two consultation actions while an inline consultation button is in view.
const visibleInlineCTAs=new Set();
const inlineCTAObserver=new IntersectionObserver(entries=>{
  for(const entry of entries){if(entry.isIntersecting&&entry.intersectionRatio>=.5)visibleInlineCTAs.add(entry.target);else visibleInlineCTAs.delete(entry.target);}
  inlineCTAVisible=visibleInlineCTAs.size>0;updateSticky();
},{threshold:.5});
for(const action of document.querySelectorAll('.conversion-cta'))inlineCTAObserver.observe(action);

const reducedMotion=matchMedia('(prefers-reduced-motion:reduce)');
const showreel=document.getElementById('showreel-video');
const showreelPlay=document.getElementById('showreel-play');
const showreelError=document.getElementById('showreel-error');
const reelState=()=>{showreelPlay.textContent=showreel.paused?'▶ 25秒のプレビューを再生':'Ⅱ プレビューを一時停止';};
showreelPlay.addEventListener('click',()=>{if(!showreel.paused){showreel.pause();return;}if(showreel.ended)showreel.currentTime=0;showreelError.hidden=true;showreel.play().catch(()=>{showreelError.hidden=false;reelState();});});
for(const event of ['play','pause','ended'])showreel.addEventListener(event,reelState);
showreel.addEventListener('error',()=>{showreelError.hidden=false;});
document.querySelector('.full-examples').addEventListener('toggle',event=>{if(!event.currentTarget.open)exampleVideo.pause();});


const caseStrip=document.querySelector('.hook-cases');
for(const button of document.querySelectorAll('[data-case-direction]'))button.addEventListener('click',()=>{
  const card=caseStrip.querySelector('.hook-case');
  caseStrip.scrollBy({left:Number(button.dataset.caseDirection)*(card.getBoundingClientRect().width+20),behavior:reducedMotion.matches?'instant':'smooth'});
});
const allVideos=[...document.querySelectorAll('video')];
for(const video of allVideos)video.addEventListener('play',()=>{for(const other of allVideos)if(other!==video)other.pause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)for(const video of allVideos)video.pause();});

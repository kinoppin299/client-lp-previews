import {collectQuery,QUERY_KEYS} from './bot/core.js';
const attribution=collectQuery(location.search,QUERY_KEYS);
for(const a of document.querySelectorAll('[data-inquiry]')){const u=new URL(a.getAttribute('href'),location.href);for(const[k,v]of Object.entries(attribution))if(!u.searchParams.has(k))u.searchParams.set(k,v);a.href=u.href;}
const videos=[...document.querySelectorAll('video')];
for(const v of videos){v.addEventListener('play',()=>{for(const other of videos)if(other!==v)other.pause();const b=v.parentElement.querySelector('[data-play]');if(b)b.hidden=true;});}
for(const b of document.querySelectorAll('[data-play]'))b.addEventListener('click',async()=>{const v=b.parentElement.querySelector('video');try{await v.play();b.hidden=true;}catch{b.hidden=true;v.controls=true;}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)for(const v of videos)v.pause();});
document.querySelector('.body-video').addEventListener('toggle',e=>{if(!e.currentTarget.open)for(const v of e.currentTarget.querySelectorAll('video'))v.pause();});
const sticky=document.querySelector('.sticky-cta'),hero=document.querySelector('.hero'),closing=document.querySelector('.closing');let past=false,atEnd=false;const active=new Set();const update=()=>sticky.classList.toggle('visible',past&&!atEnd&&!active.size);
new IntersectionObserver(es=>{for(const e of es)past=!e.isIntersecting&&e.boundingClientRect.top<0;update();}).observe(hero);
new IntersectionObserver(es=>{for(const e of es)atEnd=e.isIntersecting;update();}).observe(closing);
const io=new IntersectionObserver(es=>{for(const e of es){if(e.isIntersecting&&e.intersectionRatio>=.5)active.add(e.target);else active.delete(e.target);}update();},{threshold:.5});for(const a of document.querySelectorAll('.cta'))io.observe(a);

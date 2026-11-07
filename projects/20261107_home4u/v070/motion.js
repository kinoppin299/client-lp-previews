// One-shot reveals. Values and text remain in the DOM throughout the effect.
export function createMotionController(reduced) {
  const jobs=new Map();
  const visible=el=>{const r=el.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth;};
  function sync(el){
    const job=jobs.get(el);if(!job)return;
    if(reduced.matches){job.animation?.cancel();jobs.delete(el);observer.unobserve(el);return;}
    if(document.hidden||!visible(el)){job.animation?.pause();return;}
    if(job.animation){job.animation.play();return;}
    job.animation=el.animate(job.frames,{duration:480,easing:'cubic-bezier(.2,.7,.2,1)',iterations:1,...job.options});
    job.animation.addEventListener('finish',()=>{jobs.delete(el);observer.unobserve(el);},{once:true});
  }
  const observer=new IntersectionObserver(es=>es.forEach(e=>sync(e.target)),{threshold:[0,.15]});
  const syncAll=()=>[...jobs.keys()].forEach(sync);
  document.addEventListener('visibilitychange',syncAll);reduced.addEventListener('change',syncAll);
  return {
    reveal(el,frames,options={}){if(!el||reduced.matches)return;jobs.set(el,{frames,options,animation:null});observer.observe(el);sync(el);},
    reset(){for(const job of jobs.values())job.animation?.cancel();jobs.clear();observer.disconnect();}
  };
}

import data from './campaigns/buysell/motion-data.js?build=425ffb5d9fd7';
const atlases=new Map(),pictures=new Map();
async function picture(url){if(pictures.has(url))return pictures.get(url);const task=(async()=>{const img=new Image();img.src=url;await img.decode();return img;})();pictures.set(url,task);return task;}
export function createCastPlayer(){
 const actors={};let token=0;
 for(const role of ['a','b']){const img=document.getElementById('friend-'+role),canvas=document.createElement('canvas');canvas.width=data.frameWidth;canvas.height=data.frameHeight;canvas.className='character-motion';canvas.hidden=true;canvas.setAttribute('aria-hidden','true');img.parentElement.append(canvas);actors[role]={img,canvas,context:canvas.getContext('2d'),clip:null,elapsed:0,started:false,ended:false,ready:false,frame:0};}
 function pose(role,name){const a=actors[role],url=name==='neutral'?`./campaigns/buysell/assets/friend-${role}.webp`:data.characters[role].poses[name];if(url)a.img.src=url;}
 return {
  set(step,{instant=false,reduced=false}={}){const current=++token;for(const role of ['a','b']){const a=actors[role];a.canvas.hidden=true;a.img.style.opacity='';a.clip=null;a.elapsed=0;a.started=false;a.ended=false;a.ready=false;a.frame=0;a.img.dataset.motion='static';pose(role,step.faces?.[role]||'neutral');}
   const plan=step.characterAction;if(!plan)return;const a=actors[plan.role],clip=data.clips[plan.clip];if(!clip)return;if(instant||reduced){pose(plan.role,clip.endPose);return;}a.clip={...clip,cue:plan.cue||'',role:plan.role,key:plan.clip};a.img.dataset.motion='prepared';picture(clip.atlas).then(img=>{if(current!==token)return;a.atlas=img;a.ready=true;}).catch(()=>{a.ended=true;pose(plan.role,clip.endPose);});
  },
  tick(delta,{enabled,text,complete=false,reduced=false}){for(const role of ['a','b']){const a=actors[role],clip=a.clip;if(!clip||a.ended)continue;if(reduced){a.ended=true;a.canvas.hidden=true;a.img.style.opacity='';pose(role,clip.endPose);continue;}if(!enabled||!a.ready)continue;if(!a.started){if(clip.cue&&!text.includes(clip.cue)&&!complete)continue;a.started=true;a.img.dataset.motion=clip.key;a.canvas.hidden=false;a.img.style.opacity='0';}
    a.elapsed+=delta;const i=Math.min(clip.frames-1,Math.floor(a.elapsed/clip.frameMs));a.frame=i;a.canvas.dataset.frame=String(i);a.context.clearRect(0,0,a.canvas.width,a.canvas.height);a.context.drawImage(a.atlas,i*data.frameWidth,0,data.frameWidth,data.frameHeight,0,0,a.canvas.width,a.canvas.height);
    if(a.elapsed>=clip.durationMs){a.ended=true;a.img.dataset.motion='settled';pose(role,clip.endPose);const expected=a.img.src;picture(a.img.src).then(()=>{if(a.img.src===expected){a.canvas.hidden=true;a.img.style.opacity='';}}).catch(()=>{});}
   }},
  state(){return Object.fromEntries(Object.entries(actors).map(([r,a])=>[r,{clip:a.clip?.key||null,frame:a.frame,elapsed:a.elapsed,started:a.started,ended:a.ended,ready:a.ready}]))}
 };
}

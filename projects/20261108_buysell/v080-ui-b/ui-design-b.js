// Presentation-only model. Scenario copy, answers and CTA stay in the existing map.
export const CHAPTERS=['着物の話','査定実例','出張査定','申し込み'];
export function createChapterModel(scenario){
 const nodes=new Map(scenario.steps.map(s=>[s.id,s])),stages=new Map(),anchors={comparison:1,nearby:2,campaign:3};
 const next=s=>s.type==='question'?s.options.map(o=>o.next):s.next?[s.next]:[];
 function mark(id,inherited=0){const stage=anchors[id]??inherited;if(stages.has(id))return;stages.set(id,stage);for(const n of next(nodes.get(id)))mark(n,stage);}
 mark(scenario.start);
 function remaining(id,stage,seen=new Set()){if(seen.has(id)||stages.get(id)!==stage)return 0;seen=new Set(seen);seen.add(id);return 1+Math.max(0,...next(nodes.get(id)).map(n=>remaining(n,stage,seen)));}
 return {get(id,history=[]){const index=stages.get(id)??0,done=history.filter(x=>stages.get(x)===index).length,left=remaining(id,index);return{index,label:CHAPTERS[index],fills:CHAPTERS.map((_,i)=>i<index?1:i>index?0:Math.min(1,(done+1)/Math.max(1,done+left)))};}};
}

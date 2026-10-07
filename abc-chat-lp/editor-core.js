import {edges,validateScenario} from './core.js?build=703bf93b1ff2';

export function draftKey(base,campaign,variant) {
  return `chat-lp:copy-editor:${new URL('.',base).pathname}:${campaign}:${variant}`;
}
export function restoreCopyDraft(stored,original) {
  if(stored?.id!==original.id || stored?.variant!==original.variant || stored?.version!==original.version || !Array.isArray(stored.steps)) throw Error('下書きの版が異なります。');
  // Restore only editable copy onto the current graph, including unfinished blank text.
  const restored=structuredClone(original);
  for(const step of restored.steps){
    const saved=stored.steps.find(s=>s.id===step.id && s.type===step.type);
    if(!saved)continue;
    for(const key of ['title','message','label','note','hint']){
      if(typeof saved[key]==='string')step[key]=saved[key];
      else if(['note','hint'].includes(key) && !(key in saved))delete step[key];
    }
    for(const option of step.options || []){
      const value=saved.options?.find(o=>o.id===option.id)?.label;
      if(typeof value==='string')option.label=value;
    }
    if(step.disclosure)for(const key of ['label','text'])if(typeof saved.disclosure?.[key]==='string')step.disclosure[key]=saved.disclosure[key];
    if(step.offerCard)for(const key of Object.keys(step.offerCard))if(typeof saved.offerCard?.[key]==='string')step.offerCard[key]=saved.offerCard[key];
  }
  return restored;
}
export function exportScenario(scenario) {
  return `// Chat LP copy edited in the visual editor.\nexport default ${JSON.stringify({[scenario.variant]:scenario},null,2)};\n`;
}
export function importScenario(text,expected) {
  // Accept JSON or our JSON-only ES module export; never execute uploaded JavaScript.
  const raw=text.replace(/^\s*\/\/[^\n]*\n/g,'').trim();
  const parsed=JSON.parse(raw.startsWith('export default ') ? raw.slice(15).replace(/;\s*$/,'') : raw);
  const scenario=parsed.steps ? parsed : parsed[expected.variant];
  if (scenario?.id!==expected.id || scenario?.variant!==expected.variant) throw Error('この案件の原稿ファイルを選んでください。');
  if (validateScenario(scenario).errors.length) throw Error('質問や文言に未入力、または分岐の不整合があります。');
  return scenario;
}
export function mapGraph(scenario) {
  const byId=new Map(scenario.steps.map(s=>[s.id,s]));
  const visible=scenario.steps.filter(s=>!['branch','delay'].includes(s.type));
  const links=[];
  function resolve(id,label,visited=new Set()) {
    if (visited.has(id)) return [];
    const step=byId.get(id); if (!step) return [];
    if (!['branch','delay'].includes(step.type)) return [{to:id,label}];
    const nextVisited=new Set([...visited,id]);
    if (step.type==='delay') return resolve(step.next,label,nextVisited);
    const question=byId.get(step.cases[0]?.question);
    const used=new Set(step.cases.map(c=>c.answer));
    const targets=step.cases.map(c=>({next:c.next,answer:c.answer}));
    // Show the actual fallback condition rather than an internal branch ID.
    const fallbackLabels=question?.options.filter(o=>!used.has(o.id)).map(o=>o.label).join('・') || 'その他';
    return targets.flatMap(c=>resolve(c.next,[label,question?.options.find(o=>o.id===c.answer)?.label].filter(Boolean).join(' / '),nextVisited))
      .concat(resolve(step.fallback,[label,fallbackLabels].filter(Boolean).join(' / '),nextVisited));
  }
  for (const step of visible) {
    const targets=step.type==='question' ? step.options.map(o=>({next:o.next,label:o.label})) : edges(step).map(next=>({next,label:''}));
    for (const target of targets) for (const edge of resolve(target.next,target.label)) links.push({from:step.id,...edge});
  }
  const ranks=new Map();
  function rank(id) {
    if (ranks.has(id)) return ranks.get(id);
    const parents=links.filter(l=>l.to===id).map(l=>l.from);
    const r=parents.length ? Math.max(...parents.map(rank))+1 : 0;
    ranks.set(id,r); return r;
  }
  visible.forEach(s=>rank(s.id));
  const groups=[];
  for (const step of visible) (groups[ranks.get(step.id)] ||= []).push(step);
  const gap=148, pitch=292, nodes=[];
  const maxRows=Math.max(...groups.map(g=>g.length));
  groups.forEach((group,column)=>{
    const offset=(maxRows-group.length)*gap/2+48;
    group.forEach((step,row)=>nodes.push({id:step.id,step,x:column*pitch+48,y:offset+row*gap}));
  });
  return {nodes,links,width:groups.length*pitch+96,height:maxRows*gap+96};
}

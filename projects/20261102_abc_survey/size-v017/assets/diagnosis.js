(()=>{'use strict';
const root=document.querySelector('#abc-diagnosis-root'),reward=document.querySelector('[data-result]'),reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const spec={q1:{min:1,max:25,step:.1,initial:12,mean:13.56,title:'アソコの長さ',negative:'集計平均より短め',positive:'集計平均より長め'},q2:{min:1,max:6,step:.5,initial:3,mean:3.53,title:'亀頭の太さ（横幅）',negative:'集計平均より細め',positive:'集計平均より太め'}};
const one=s=>root.querySelector(s),all=s=>[...root.querySelectorAll(s)];
const answers={q1:undefined,q2:undefined},chosen={},inputs={};let observer=null;
function valid(id,n){const s=spec[id];return Number.isFinite(n)&&n>=s.min&&n<=s.max&&Math.abs((n-s.min)/s.step-Math.round((n-s.min)/s.step))<1e-6;}
function completed(){return answers.q1!==undefined&&answers.q2!==undefined;}
function updateInput(id){const has=chosen[id]!==undefined,s=spec[id];one(`[data-lp-chat-measurement="${id}"] strong`).textContent=String(has?chosen[id]:s.initial);one(`[data-lp-chat-measurement-state="${id}"]`).textContent=has?'この数値でよければ、次へ':'目盛りを動かして数値を選んでください';one(`[data-lp-chat-answer="measured"][data-lp-chat-question="${id}"]`).disabled=!has;}
function change(id,n){const s=spec[id],next=Math.round(Math.max(s.min,Math.min(s.max,Number(n)))*10)/10;if(!valid(id,next))return;chosen[id]=next;inputs[id].value=next;inputs[id].style.setProperty('--range-fill',(next-s.min)/(s.max-s.min)*100+'%');updateInput(id);}
function result(){if(observer)observer.disconnect();observer=null;
for(const card of all('[data-lp-chat-comparison]')){const id=card.dataset.lpChatComparison,s=spec[id],value=answers[id],has=valid(id,value);card.querySelector('.result-unmeasured').hidden=has;card.querySelector('.comparison-values').hidden=!has;if(!has)continue;
const delta=value-s.mean,near=Math.abs(delta)<=s.step/2+1e-7,axis=Math.ceil(Math.max(value,s.mean)*1.12/(s.step>=.5?1:2))*(s.step>=.5?1:2),bars=card.querySelectorAll('.size-bar'),values=card.querySelectorAll('.bar-value');
card.querySelector('.comparison-label').textContent=near?'集計平均に近い':delta<0?s.negative:s.positive;
bars[0].style.width=s.mean/axis*100+'%';bars[1].style.width=reduce?value/axis*100+'%':'0%';bars[1].dataset.targetWidth=value/axis*100;
values[0].textContent=s.mean.toFixed(2)+'cm';values[1].textContent=value.toFixed(1)+'cm';card.querySelector('.comparison-axis').lastElementChild.textContent=axis+'cm';card.querySelector('.difference-value').textContent=Math.abs(delta)<.05?'±0.0':(delta>0?'+':'')+delta.toFixed(1);
}
one('.result-empty').hidden=answers.q1!==null||answers.q2!==null;
if(!reduce){observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){const bar=e.target.querySelector('.size-bar');requestAnimationFrame(()=>bar.style.width=bar.dataset.targetWidth+'%');observer.unobserve(e.target);}},{threshold:.7});for(const card of all('[data-lp-chat-comparison]'))if(!card.querySelector('.comparison-values').hidden)observer.observe(card.querySelector('.own .size-bar-track'));}
}
function render(){const done=completed();for(const id of['q1','q2']){const answered=answers[id]!==undefined;one('#size-'+id).hidden=id==='q2'&&answers.q1===undefined;one(`[data-lp-chat-unanswered="${id}"]`).hidden=answered;one(`[data-lp-chat-answered="${id}"]`).hidden=!answered;one(`[data-lp-chat-receipt="${id}"]`).textContent=answers[id]===null?'測っていない・分からない':answered?answers[id].toFixed(1)+'cm':'';updateInput(id);}
one('#size-result').hidden=!done;reward.hidden=!done;one('[data-diag-back]').hidden=answers.q1===undefined;
const count=Object.values(answers).filter(x=>x!==undefined).length;one('[role=progressbar]').setAttribute('aria-valuenow',String(count));one('.diagnosis-progress-track span').style.width=count/2*100+'%';one('.diagnosis-progress-label').textContent=done?'チェック完了｜診断結果':answers.q1!==undefined?'太さをチェック → 診断結果':'長さをチェック → 太さ → 診断結果';
if(done)result();else if(observer){observer.disconnect();observer=null;}window.dispatchEvent(new Event('diagnosischange'));
}
function move(id){const el=one('#size-'+id);const title=el.querySelector('h3,h2');title.tabIndex=-1;title.focus({preventScroll:true});el.scrollIntoView({behavior:reduce?'instant':'smooth',block:'start'});}
function edit(id){answers[id]=undefined;delete chosen[id];inputs[id].value=spec[id].initial;if(id==='q1'){answers.q2=undefined;delete chosen.q2;inputs.q2.value=spec.q2.initial;}render();move(id);}
function reset(){for(const id of['q1','q2']){answers[id]=undefined;delete chosen[id];inputs[id].value=spec[id].initial;}render();}
for(const id of['q1','q2']){const s=spec[id],input=document.createElement('input');input.type='range';input.className='measurement-range';input.min=s.min;input.max=s.max;input.step=s.step;input.value=s.initial;input.dataset.measure=id;input.setAttribute('aria-label',s.title);input.setAttribute('aria-describedby',one(`[data-lp-chat-unanswered="${id}"] .measurement-help`).id='measure-help-'+id);one(`[data-lp-chat-range="${id}"]`).append(input);inputs[id]=input;input.addEventListener('input',()=>change(id,input.value));input.addEventListener('pointerup',()=>change(id,input.value));input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();change(id,input.value);}});}
root.addEventListener('click',e=>{const editButton=e.target.closest('[data-edit]');if(editButton){edit(editButton.dataset.edit);return;}const b=e.target.closest('[data-lp-chat-action]');if(!b)return;const id=b.dataset.lpChatQuestion,action=b.dataset.lpChatAction,s=spec[id];if(!s)return;
if(action==='plus'||action==='minus'){change(id,Number(inputs[id].value)+(action==='plus'?s.step:-s.step));return;}
if(action==='answer'&&answers[id]===undefined&&(id==='q1'||answers.q1!==undefined)){if(b.dataset.lpChatAnswer==='measured'){if(!valid(id,chosen[id]))return;answers[id]=chosen[id];}else answers[id]=null;render();move(id==='q1'?'q2':'result');}
});
one('[data-diag-back]').addEventListener('click',()=>edit(completed()?'q2':'q1'));one('[data-diag-reset]').addEventListener('click',()=>{reset();move('q1');});
window.ABCLPPreview={getState:()=>({length:answers.q1??null,width:answers.q2??null,lengthAnswered:answers.q1!==undefined,widthAnswered:answers.q2!==undefined,completed:completed()}),reset,mediaIds:()=>Object.keys(window.ABC_LP_MEDIA)};
if(new URLSearchParams(location.search).get('layout')==='all'){answers.q1=12;answers.q2=3;chosen.q1=12;chosen.q2=3;inputs.q1.value=12;inputs.q2.value=3;document.body.classList.add('layout-all');document.querySelector('[data-layout-label]').textContent='全枠確認モード｜代表サイズを仮表示';render();for(const id of['q1','q2']){one(`[data-lp-chat-unanswered="${id}"]`).hidden=false;one(`[data-lp-chat-answered="${id}"]`).hidden=true;}}else render();
})();

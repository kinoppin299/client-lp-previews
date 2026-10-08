import registry from './scenarios.js?build=f93669013acd';
import {route,validateScenario} from './core.js?build=f93669013acd';
import {draftKey,restoreCopyDraft,exportScenario,importScenario,mapGraph} from './editor-core.js?build=f93669013acd';
import {appendRichText,plainText,formatSelection} from './rich-text.js?build=f93669013acd';
import {renderOfferCard,OFFER_FIELDS} from './offer-card.js?build=f93669013acd';

const $=id=>document.getElementById(id);
const query=new URLSearchParams(location.search);
const campaign=query.get('scenario') || 'ecoda', variant=query.get('v') || 'a';
const original=registry[campaign]?.[variant];
if (!original) throw Error('案件が見つかりません。');
const key=draftKey(location.href,campaign,variant);
const initialStep=original.steps.some(s=>s.id==='welcome')?'welcome':original.start;
document.title=`${original.brand}｜会話マップ・文言編集`;
document.querySelector('.identity h1 span').textContent=original.brand;
let scenario=structuredClone(original),selected=initialStep,zoom=.75,graph,saveTimer,toastTimer,activeTab='map';
let hasDraft=false;
try {
  const stored=localStorage.getItem(key);
  if (stored) {scenario=restoreCopyDraft(JSON.parse(stored),original);hasDraft=true;}
} catch { /* Browser storage is optional; export remains available. */ }

const kinds={image:'画像',image_message:'画像と吹き出し',question:'質問',message:'吹き出し',offer:'オファー',cta:'CTA',end:'対象のご案内',emphasis:'強調',explanation:'説明',html:'説明'};
const names={fv:'ファーストビュー',welcome:'最初の声かけ',q1:'Q1 · 気になること',q2:'Q2 · 知りたいこと',q3:'Q3 · 特典への関心',proof:'理解を助ける画像',offer_intro:'オファーへのひと言',offer:'オファー画像',close:'最後のひと押し',final_cta:'最終CTA'};
function name(step) {
  return original.editorLabels?.[step.id] || names[step.id] || step.title || step.message?.slice(0,25) || kinds[step.type] || '吹き出し';
}
function copy(step){return plainText(step.title || step.message || (step.type==='image'?'画像パーツを表示':name(step)));}
function element(tag,className,text) {
  const node=document.createElement(tag);if(className)node.className=className;if(text)node.textContent=text;return node;
}
function changed(step){return JSON.stringify(step)!==JSON.stringify(original.steps.find(s=>s.id===step.id));}
function notify(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,2800);}
function persist() {
  clearTimeout(saveTimer);
  try {localStorage.setItem(key,JSON.stringify(scenario));$('save-status').textContent='● このブラウザに保存済み';}
  catch {$('save-status').textContent='書き出して保存してください';}
}
function scheduleSave(){$('save-status').textContent='保存中…';clearTimeout(saveTimer);saveTimer=setTimeout(persist,220);}
function check() {
  const invalid=validateScenario(scenario).errors.length>0;
  $('export').disabled=invalid;$('refresh-preview').disabled=invalid;
  $('validation').textContent=invalid?'未入力の文言があります。質問・本文・ボタン名を入力するとプレビューと書き出しができます。':'';
  return !invalid;
}
function updateCopy(step) {
  const node=document.getElementById(`node-${step.id}`);
  if(node){node.querySelector('.node-copy').textContent=copy(step);node.classList.toggle('changed',changed(step));}
  renderOutline();check();scheduleSave();
}
function field(label,value,set,{multiline=true,optional=false,help='',choice=false}={}) {
  const wrap=element('div',`field${choice?' choice':''}`),heading=element('span','',label),count=element('small','count',`${plainText(value).length}字`);
  heading.append(count);wrap.append(heading);
  const input=element(multiline?'textarea':'input');
  if(multiline)input.rows=Math.min(10,Math.max(3,Math.ceil(value.length/20)+1));else input.type='text';
  input.value=value;input.setAttribute('aria-label',label);input.spellcheck=false;
  if(!optional)input.required=true;
  const toolbar=element('div','format-toolbar'),preview=element('div','field-preview');
  toolbar.setAttribute('role','group');toolbar.setAttribute('aria-label',`${label}の文字装飾`);
  preview.setAttribute('aria-label',`${label}の見え方`);
  const refresh=()=>{preview.replaceChildren();appendRichText(preview,input.value);};
  const apply=(kind,color)=>{
    const result=formatSelection(input.value,input.selectionStart,input.selectionEnd,kind,color);
    if(!result){notify('装飾する文字を選択してください。');return;}
    input.value=result.value;input.focus();input.setSelectionRange(result.start,result.end);
    input.dispatchEvent(new Event('input',{bubbles:true}));
  };
  for(const [text,kind,color] of [['太字','bold'],['赤','color','#c6233b'],['緑','color','#16743f'],['青','color','#2457b7'],['装飾解除','clear']]){
    const button=element('button','format-button',text);button.type='button';button.setAttribute('aria-label',`${label}：${text}`);
    if(color)button.style.color=color;
    button.addEventListener('pointerdown',event=>event.preventDefault());button.addEventListener('click',()=>apply(kind,color));toolbar.append(button);
  }
  const color=element('input','format-color');color.type='color';color.value='#c6233b';color.setAttribute('aria-label',`${label}：文字色を選ぶ`);color.title='文字色を選ぶ';
  color.addEventListener('change',()=>apply('color',color.value));toolbar.append(color);
  input.addEventListener('input',()=>{set(input.value);count.textContent=`${plainText(input.value).length}字`;refresh();});wrap.append(toolbar,input,preview);refresh();
  if(help)wrap.append(element('small','',help));return wrap;
}
function context(step) {
  const questions=scenario.steps.filter(s=>s.type==='question');
  if(!questions.length)return '';
  let combinations=[[]];
  for(const question of questions)combinations=combinations.flatMap(combo=>question.options.map(option=>[...combo,option]));
  const paths=combinations.filter(combo=>route(scenario,Object.fromEntries(questions.map((q,i)=>[q.id,combo[i].id]))).some(s=>s.id===step.id));
  const labels=questions.map((q,i)=>[...new Set(paths.map(p=>p[i].label))]);
  if(labels.every((values,i)=>values.length===questions[i].options.length))return 'すべての会話で表示';
  return labels.filter((values,i)=>values.length<questions[i].options.length).map(values=>values.join('・')).filter(Boolean).join(' → ');
}
function renderFields() {
  const step=scenario.steps.find(s=>s.id===selected);
  $('step-kind').textContent=kinds[step.type] || '吹き出し';$('step-name').textContent=name(step);$('step-context').textContent=plainText(context(step));
  const fields=$('fields');fields.replaceChildren();
  if(step.offerCard){
    const panel=element('section','offer-copy-panel'),preview=element('div','offer-copy-preview');
    preview.append(renderOfferCard(step.offerCard));
    panel.append(element('h3','','オファー画像内の文言'),preview,element('p','format-help','各項目を編集すると、この画像の文字も変わります。'));
    for(const {key,label} of OFFER_FIELDS)panel.append(field(label,step.offerCard[key],value=>{
      step.offerCard[key]=value;preview.replaceChildren(renderOfferCard(step.offerCard));updateCopy(step);
    },{multiline:false,optional:true}));
    fields.append(panel);
  } else if(step.src){
    const img=element('img');img.src=step.src;img.alt=step.alt || '';fields.append(img,element('p','draft-help','画像内の文字は、元画像の差し替えで変更できます。'));
  }
  if(step.title!==undefined)fields.append(field('見出し',step.title,value=>{step.title=value;updateCopy(step);},{multiline:false}));
  if(step.message!==undefined)fields.append(field(step.type==='question'?'質問文':'吹き出しの本文',step.message,value=>{step.message=value;updateCopy(step);}));
  if(step.options){
    step.options.forEach((option,index)=>fields.append(field(`選択肢 ${index+1}`,option.label,value=>{option.label=value;updateCopy(step);renderEdges();},{multiline:false,choice:true})));
    fields.append(field('質問の補足',step.hint || '',value=>{if(value)step.hint=value;else delete step.hint;updateCopy(step);},{multiline:false,optional:true}));
  }
  if(step.label!==undefined)fields.append(field('CTAボタンの文言',step.label,value=>{step.label=value;updateCopy(step);},{multiline:false}));
  if(step.type!=='image')fields.append(field('補足文',step.note || '',value=>{if(value)step.note=value;else delete step.note;updateCopy(step);},{optional:true,help:'空欄にすると表示されません。'}));
  if(step.disclosure){
    fields.append(field('開閉欄のタイトル',step.disclosure.label,value=>{step.disclosure.label=value;updateCopy(step);},{multiline:false}));
    fields.append(field('開閉欄の本文',step.disclosure.text,value=>{step.disclosure.text=value;updateCopy(step);}));
  }
  check();
}
function renderOutline() {
  const nav=$('outline'),scroll=nav.scrollTop,search=$('search').value.trim();nav.replaceChildren();
  let previous=-1;
  for(const node of graph.nodes){
    const step=node.step;
    if(search && ![name(step),step.title,step.message,step.label,...(step.options || []).map(o=>o.label)].filter(Boolean).join('\n').includes(search))continue;
    const group=['fv','welcome','q1'].includes(step.id)?0:step.id.startsWith('reply_1')?1:step.id==='q2'?2:step.id==='q3'?4:['offer_intro','offer_details','offer','coupon','close','final_cta'].includes(step.id)?5:3;
    if(group!==previous){nav.append(element('div','outline-group',['導入・最初の質問','悩みへの返答','2つ目の質問','疑問への返答','3つ目の質問','オファー・CTA'][group]));previous=group;}
    const button=element('button','outline-item');button.type='button';button.setAttribute('aria-current',String(selected===step.id));
    button.append(element('small','',kinds[step.type]),element('span','',name(step)));button.addEventListener('click',()=>select(step.id,true));nav.append(button);
  }
  nav.scrollTop=scroll;
}
function renderEdges() {
  graph=mapGraph(scenario);
  const svg=$('connections');svg.replaceChildren();svg.setAttribute('width',graph.width);svg.setAttribute('height',graph.height);
  const positions=new Map(graph.nodes.map(n=>[n.id,n]));
  const ns='http://www.w3.org/2000/svg';
  for(const link of graph.links){
    const from=positions.get(link.from),to=positions.get(link.to);
    const x1=from.x+238,y1=from.y+56,x2=to.x,y2=to.y+56;
    const path=document.createElementNS(ns,'path');path.setAttribute('d',`M${x1},${y1} C${x1+27},${y1} ${x2-27},${y2} ${x2},${y2}`);path.setAttribute('class','connection');svg.append(path);
    if(link.label){
      const label=document.createElementNS(ns,'text');label.setAttribute('x',x2-10);label.setAttribute('y',y2-9);label.setAttribute('text-anchor','end');label.setAttribute('class','edge-label');label.textContent=plainText(link.label);svg.append(label);
    }
  }
}
function renderMap() {
  renderEdges();$('map-content').style.width=`${graph.width}px`;$('map-content').style.height=`${graph.height}px`;
  const nodes=$('nodes');nodes.replaceChildren();
  for(const item of graph.nodes){
    const step=item.step,button=element('button',`node ${step.type}${selected===step.id?' selected':''}${changed(step)?' changed':''}`);
    button.id=`node-${step.id}`;button.type='button';button.style.left=`${item.x}px`;button.style.top=`${item.y}px`;
    button.setAttribute('aria-label',`編集：${name(step)}`);button.setAttribute('aria-pressed',String(selected===step.id));
    button.append(element('span','node-kind',`${kinds[step.type]} · ${name(step)}`),element('span','node-copy',copy(step)));
    button.addEventListener('click',()=>select(step.id,false));nodes.append(button);
  }
  setZoom(zoom);renderOutline();
}
function select(id,center) {
  selected=id;
  for(const node of $('nodes').children){const isSelected=node.id===`node-${id}`;node.classList.toggle('selected',isSelected);node.setAttribute('aria-pressed',String(isSelected));}
  renderFields();renderOutline();if(center && activeTab==='map')centerNode(id);
}
function centerNode(id) {
  const node=graph.nodes.find(n=>n.id===id),panel=$('map-panel');
  if(node)panel.scrollTo({left:(node.x+119)*zoom-panel.clientWidth/2,top:(node.y+56)*zoom-panel.clientHeight/2,behavior:'instant'});
}
function setZoom(value,preserve=true) {
  const panel=$('map-panel'),old=zoom,cx=(panel.scrollLeft+panel.clientWidth/2)/old,cy=(panel.scrollTop+panel.clientHeight/2)/old;
  zoom=Math.max(.14,Math.min(1.5,value));$('map-content').style.transform=`scale(${zoom})`;
  $('map-space').style.width=`${graph.width*zoom}px`;$('map-space').style.height=`${graph.height*zoom}px`;
  $('zoom-label').textContent=`${Math.round(zoom*100)}%`;
  if(preserve)panel.scrollTo({left:cx*zoom-panel.clientWidth/2,top:cy*zoom-panel.clientHeight/2});
}
function refreshPreview() {
  if(!check()){notify('未入力の文言を確認してください。');return;}
  persist();
  const url=new URL('./index.html',location.href);url.searchParams.set('scenario',campaign);url.searchParams.set('v',variant);url.searchParams.set('editor_preview','1');url.searchParams.set('revision',String(Date.now()));
  $('preview').src=url.href;
}
function setTab(tab) {
  activeTab=tab;$('map-tab').setAttribute('aria-selected',String(tab==='map'));$('preview-tab').setAttribute('aria-selected',String(tab==='preview'));
  $('map-panel').hidden=tab!=='map';$('preview-panel').hidden=tab!=='preview';$('map-hint').hidden=tab!=='map';document.querySelector('.zoom-controls').hidden=tab!=='map';
  if(tab==='preview')refreshPreview();
}

$('map-tab').addEventListener('click',()=>setTab('map'));
$('preview-tab').addEventListener('click',()=>setTab('preview'));
$('refresh-preview').addEventListener('click',refreshPreview);
$('search').addEventListener('input',renderOutline);
$('zoom-in').addEventListener('click',()=>setZoom(zoom+.15));$('zoom-out').addEventListener('click',()=>setZoom(zoom-.15));
$('fit').addEventListener('click',()=>{setZoom(Math.min($('map-panel').clientWidth/graph.width,$('map-panel').clientHeight/graph.height)*.95,false);$('map-panel').scrollTo(0,0);});
$('export').addEventListener('click',()=>{
  if(!check())return;persist();
  const url=URL.createObjectURL(new Blob([exportScenario(scenario)],{type:'text/javascript;charset=utf-8'}));
  const link=element('a');link.href=url;link.download=`${campaign}-scenario-edited.js`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  notify('編集した原稿を書き出しました。チャットに添付するとLP本体へ反映できます。');
});
$('import').addEventListener('click',()=>$('import-file').click());
$('import-file').addEventListener('change',async event=>{
  const file=event.target.files[0];if(!file)return;
  try {scenario=importScenario(await file.text(),original);selected=scenario.steps.some(s=>s.id===selected)?selected:initialStep;persist();renderMap();renderFields();if(activeTab==='preview')refreshPreview();notify('原稿を読み込みました。');}
  catch(error){notify(error.message);}
  event.target.value='';
});
$('reset').addEventListener('click',()=>{
  if(!confirm('このブラウザの編集内容を、元の原稿に戻しますか？'))return;
  scenario=structuredClone(original);selected=initialStep;persist();renderMap();renderFields();if(activeTab==='preview')refreshPreview();else centerNode(selected);notify('元の原稿に戻しました。');
});
let drag=null;
$('map-panel').addEventListener('pointerdown',event=>{
  if(event.button!==0 || event.target.closest('button'))return;
  drag={x:event.clientX,y:event.clientY,left:$('map-panel').scrollLeft,top:$('map-panel').scrollTop};$('map-panel').classList.add('dragging');$('map-panel').setPointerCapture(event.pointerId);
});
$('map-panel').addEventListener('pointermove',event=>{if(drag)$('map-panel').scrollTo(drag.left+drag.x-event.clientX,drag.top+drag.y-event.clientY);});
for(const name of ['pointerup','pointercancel'])$('map-panel').addEventListener(name,()=>{drag=null;$('map-panel').classList.remove('dragging');});
$('map-panel').addEventListener('wheel',event=>{if(event.ctrlKey || event.metaKey){event.preventDefault();setZoom(zoom+(event.deltaY<0?.05:-.05));}},{passive:false});
window.addEventListener('pagehide',persist);
renderMap();renderFields();requestAnimationFrame(()=>centerNode(selected));
$('save-status').textContent=hasDraft?'● 前回の下書きを復元':'まだ編集していません';

import registry from './scenarios.js?build=fe48702e4990';
import {route,validateScenario} from './core.js?build=fe48702e4990';
import {draftKey,restoreCopyDraft} from './editor-core.js?build=fe48702e4990';
import {appendRichText,plainText} from './rich-text.js?build=fe48702e4990';
import {createMotionController} from './motion.js?build=fe48702e4990';
import {prepareTypewriter} from './typewriter.js?build=fe48702e4990';
import {readingHold} from './playback.js?build=fe48702e4990';

const $=id=>document.getElementById(id), query=new URLSearchParams(location.search);
const campaign=query.get('scenario')||'home4u', variant=query.get('v')||'a';
const original=registry[campaign]?.[variant];
const preview=query.get('editor_preview')==='1' && window.parent!==window;
let scenario=original;
if(preview){
  try{const saved=JSON.parse(localStorage.getItem(draftKey(location.href,campaign,variant)));const candidate=restoreCopyDraft(saved,original,{allowRouting:true});if(!validateScenario(candidate).errors.length)scenario=candidate;}catch{/* Invalid or old drafts never affect the normal page. */}
}
if(!scenario || validateScenario(scenario).errors.length)throw Error('シナリオが不正です。');
document.title=scenario.title;
const assets='./campaigns/home4u/assets/';
let answers={},history=[scenario.start],revision=0,attempt=0,questionStart=0,currentMotion=null,castVisible=false;
const started=performance.now(),seen=new Set(),reduced=matchMedia('(prefers-reduced-motion: reduce)');
const reveals=createMotionController(reduced);
const event=(name,extra={})=>{if(preview)return;window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:`home4u_${name}`,lp_id:scenario.id,lp_version:scenario.version,lp_variant:variant,tracking_version:'local-4',media_lane:'local',elapsed_ms:Math.round(performance.now()-started),...extra});};
const once=(key,name,extra={})=>{if(!seen.has(key)){seen.add(key);event(name,extra);}};
const text=(tag,className,value)=>{const e=document.createElement(tag);e.className=className||'';if(value)appendRichText(e,value);return e;};
const step=()=>scenario.steps.find(s=>s.id===history.at(-1));
// Every explanatory scene runs to the next question or CTA; answers remain explicit.
const automatic=s=>!['question','cta'].includes(s.type);
let autoFrame=0,autoRemaining=0,autoDuration=0,autoLast=0,autoPaused=false,autoLabel='',autoScale=1,lastVisual=null;
let writer=null,typeRemaining=0,costCueFired=false,sceneMotion=true;
const playback=scenario.playback||{characterMs:38,punctuationMs:90,minimumHoldMs:1000,holdBaseMs:650,holdMsPerCharacter:65,maximumHoldMs:5800,newDiagramBonusMs:1200};
function speechVisible(full=false){const r=$('bubble').getBoundingClientRect(),h=window.visualViewport?.height||innerHeight;return full?r.top>=0&&r.bottom<=h:r.bottom>0&&r.top<h;}
function stopIntro(){cancelAnimationFrame(autoFrame);autoFrame=0;autoLast=0;}
function wakeIntro(){if((automatic(step())||!writer?.complete)&&!autoFrame){autoLast=0;autoFrame=requestAnimationFrame(introFrame);}}
function resizeIntro(){
 const scale=Math.max(1,parseFloat(getComputedStyle($('line')).fontSize)/18);
 if(autoScale!==scale){autoRemaining*=scale/autoScale;autoDuration*=scale/autoScale;autoScale=scale;}
 wakeIntro();
}
function triggerCostCue(){
 const s=step();if(!s.costStage||costCueFired||!writer)return;if(!writer.complete&&!writer.text.includes(s.graphCue))return;const fill=$('visual').querySelector(`[data-cost-index="${s.costStage}"] .bar-fill`);if(!fill)return;costCueFired=true;fill.style.transform='scaleX(1)';if(sceneMotion&&!reduced.matches)reveals.reveal(fill,[{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:650});
}
function completedText(){
 triggerCostCue();
 $('bubble').dataset.typing='false';
 document.querySelectorAll('#actions .choice,#actions .cta').forEach(b=>b.disabled=false);
 if(!automatic(step())){$('bubble').removeAttribute('role');$('bubble').removeAttribute('aria-label');$('bubble').tabIndex=-1;}
 document.querySelector('.footnote').textContent=automatic(step())?'無音・タップで先へ ／ 一時停止もできます':step().type==='question'?'無音・気になることを選んでください':'無音・ボタンは仮CTAです。';
}
function completeTyping(){if(writer&&!writer.complete){writer.finish();typeRemaining=0;autoLast=0;completedText();wakeIntro();return true;}return false;}
function introFrame(now){
 autoFrame=0;const s=step(),typing=writer&&!writer.complete;
 const midButton=s.ctaPosition?$('actions').querySelector('.cta'):null;
 const midVisible=midButton?(()=>{const r=midButton.getBoundingClientRect();return r.top>=0&&r.bottom<=(window.visualViewport?.height||innerHeight);})():true;
 const visible=!typing&&s.ctaPosition?midVisible:speechVisible(!typing),image=$('visual').querySelector('img.service-lead,img.scene-image');
 const running=!autoPaused&&!document.hidden&&visible&&(!image||image.complete||typing);
 const elapsed=running&&autoLast?now-autoLast:0;autoLast=running?now:0;
 if(running&&typing){
  typeRemaining-=elapsed;
  while(typeRemaining<=0&&!writer.complete){const letter=writer.revealOne();typeRemaining+=playback.characterMs+(/[。、！？!?\n]/.test(letter)?playback.punctuationMs:0);}
  triggerCostCue();if(writer.complete){completedText();autoLast=0;}
 }else if(running&&automatic(s))autoRemaining=Math.max(0,autoRemaining-elapsed);
 if(automatic(s)){
  const label=autoPaused?'一時停止中':!visible?(s.ctaPosition?'ボタンが見えると自動進行':'セリフが見えると自動進行'):writer.complete?'自動で会話中':`${s.speaker==='brother'?'弟':'姉'}が話しています…`;
  if(label!==autoLabel){autoLabel=label;$('intro-state').textContent=label;}
  const progress=writer.complete?.65+.35*(1-autoRemaining/autoDuration):.65*writer.count/Math.max(1,writer.length);
  $('intro-progress').style.transform=`scaleX(${progress})`;
  $('intro-toggle').textContent=autoPaused?'再開':'一時停止';$('intro-toggle').setAttribute('aria-pressed',String(autoPaused));
  if(running&&writer.complete&&autoRemaining<=0){event('auto_advance',{scene_order:history.length});advance(s.next,{auto:true});return;}
 }
 if(running&&(!writer.complete||automatic(s)))autoFrame=requestAnimationFrame(introFrame);
}
function beginIntro(s,{instant=false}={}){
 writer=prepareTypewriter($('line'));autoScale=Math.max(1,parseFloat(getComputedStyle($('line')).fontSize)/18);
 autoDuration=readingHold(playback,s,writer.length,{scale:autoScale,previousVisual:lastVisual});
 $('scene').dataset.holdMs=String(autoDuration);
 autoRemaining=autoDuration;typeRemaining=0;autoLast=0;autoLabel='';
 $('bubble').dataset.typing='true';
 document.querySelector('.footnote').textContent='無音・会話をタップで全文を表示';
 $('spoken-line').textContent=plainText(s.message);
 $('bubble').setAttribute('role','button');$('bubble').tabIndex=0;$('bubble').setAttribute('aria-label',`${plainText(s.message)}。タップで全文を表示。表示後はもう一度タップで次へ。`);
 document.querySelectorAll('#actions .choice,#actions .cta').forEach(b=>b.disabled=true);
 if(instant||reduced.matches){writer.finish();completedText();}
 autoFrame=requestAnimationFrame(introFrame);
}
function skipIntro(){if(completeTyping())return;if(automatic(step()))advance(step().next);}
$('bubble').addEventListener('click',skipIntro);
$('bubble').addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)&&(!writer?.complete||automatic(step()))){e.preventDefault();skipIntro();}});
document.addEventListener('visibilitychange',()=>{autoLast=0;wakeIntro();});
window.addEventListener('scroll',wakeIntro,{passive:true});window.addEventListener('resize',resizeIntro);window.visualViewport?.addEventListener('resize',resizeIntro);new ResizeObserver(resizeIntro).observe($('bubble'));
const building='<svg viewBox="0 0 80 54" aria-hidden="true"><path d="M14 50V8h52v42M7 50h66M24 17h9v8h-9zM46 17h9v8h-9zM24 32h9v8h-9zM46 32h9v8h-9zM35 50v-8h10v8"/></svg>';
const parking='<svg viewBox="0 0 80 54" aria-hidden="true"><path d="M10 48h60M17 45V7h46v38M33 37V15h10c10 0 10 13 0 13H33M25 48v-8M55 48v-8"/></svg>';
function plans(){const el=text('div','plans');for(const [svg,name,note]of [[building,'アパート','建築費などを確認'],[parking,'駐車場','土地に合うかを確認']]){const p=text('div','plan');p.innerHTML=svg;p.append(text('b','',name),text('span','',note));el.append(p);}return el;}
function heading(s){const v=$('visual');v.className='visual';v.replaceChildren();if(s.simulation){v.classList.add('simulation-visual');v.append(text('p','story-label','プラン取得後の利用イメージ'));}const h=text('h1','',s.title);h.id='scene-title';v.append(h);return v;}
const sceneArt={
 layout:{alt:'駐車枠と車の動線が描かれた、駐車場の配置図',fallback:'駐車場の配置図'},
 car:{alt:'食卓に開いた、青い車のカタログ',fallback:'車のカタログ'},
 parking:{alt:'住宅街にある小さな駐車場の活用イメージ',fallback:'駐車場という選択肢'},
 fit:{alt:'周囲の住宅や道路に面した土地の形と広さのイメージ',fallback:'土地の広さ・立地'},
 finance:{alt:'費用と収入の見込みを、ノートと電卓で比べるイメージ',fallback:'費用と収入を比べる'},
 proposals:{alt:'駐車場と別の活用案が描かれた、二つの提案書の比較イメージ',fallback:'複数の活用プランを比較'}
};
const sceneImages=new Map();
function sceneIllustration(v,key){
 const spec=sceneArt[key];if(!spec)return;v.classList.add('art-visual');
 const figure=text('figure','scene-art'),fallback=text('div','art-fallback',spec.fallback);
 figure.dataset.art=key;fallback.setAttribute('aria-hidden','true');
 if(!sceneImages.has(key)){
  const image=text('img','scene-image');image.alt=spec.alt;image.width=800;image.height=333;image.decoding='async';
  const ready=()=>{image.closest('.scene-art')?.classList.toggle('art-ready',image.naturalWidth>0);wakeIntro();};
  image.addEventListener('load',ready,{once:true});image.addEventListener('error',ready,{once:true});sceneImages.set(key,image);
 }
 const img=sceneImages.get(key);figure.append(fallback,img);v.append(figure);
 if(!img.getAttribute('src'))img.src=assets+`scene-${key}-v070.webp`;
 figure.classList.toggle('art-ready',img.complete&&img.naturalWidth>0);
}
function visual(s){
 const v=heading(s);
 if(s.sceneArt&&sceneArt[s.sceneArt]){sceneIllustration(v,s.sceneArt);return;}
 if(['house','heritage'].includes(s.visual)){v.classList.add('house-visual');v.append(text('span','pill',s.visual==='heritage'?'父さん・母さんの土地':'毎年の固定資産税'));
 }else if(['question','compare'].includes(s.visual)){const split=text('div','split');for(const label of ['売る','残して活用']){const box=text('div');box.append(text('small','',label==='売る'?'手残りを確認':'必要な費用を確認'),text('strong','',label));split.append(box);}v.append(split);
 }else if(['parking','options'].includes(s.visual)){v.append(plans());
 }else if(s.visual==='sale'){v.append(text('div','large-number','2500万円'),text('p','visual-sub','ここから、費用と税金を差し引く。'));
 }else if(s.visual==='shares'){const split=text('div','split');for(const name of ['姉','弟']){const box=text('div');box.append(text('small','',name),text('strong','','1250万円'));split.append(box);}v.append(split);
 }else if(s.visual==='expenses'){const bars=text('div','bars');for(const [i,[label,value]]of [['解体',180],['家財の処分',40],['仲介手数料',89]].entries()){const index=i+1,row=text('div','bar-row');row.dataset.costIndex=String(index);row.classList.toggle('cost-active',s.costStage===index);row.classList.toggle('cost-pending',!!s.costStage&&s.costStage<index);const track=text('div','bar-track'),fill=text('div','bar-fill');fill.style.setProperty('--amount',`${value/180*100}%`);fill.style.transform=s.costStage&&s.costStage<=index?'scaleX(0)':'scaleX(1)';track.append(fill);row.append(text('span','',label),track,text('b','',`${label==='仲介手数料'?'約':''}${value}万円`));bars.append(row);}v.append(bars);
 }else if(s.visual==='net'){const stack=text('div','stack');stack.setAttribute('aria-hidden','true');for(let i=0;i<3;i++)stack.append(text('span'));const legend=text('dl','legend');for(const [label,value,color]of [['手残り','約1763万円','#4d9b8d'],['諸費用（税金を除く）','309万円','#df9f58'],['売却の税金','約428万円','#d8868b']]){const dt=text('dt');const dot=text('i','swatch');dot.style.setProperty('--color',color);dt.append(dot,document.createTextNode(label));legend.append(dt,text('dd','',value));}v.append(stack,legend,text('p','person-value','二人で分けると、一人 約882万円'));
 }else if(s.visual==='tax'){
  const pair=text('div','tax-pair');for(const [label,value,kind]of [['諸費用','約309万円','cost'],['売却の税金','約428万円','tax']]){const box=text('div',kind);box.append(text('span','',label),text('strong','',value));pair.append(box);}v.append(pair,text('p','deduction-total','費用と税金の合計 737万円'));
 }else if(s.visual==='car'){
  const paper=text('div','story-paper');paper.innerHTML='<svg viewBox="0 0 180 70" aria-hidden="true"><path d="M20 52V36l20-6 16-19h65l20 20 19 8v13H20zm30-23h77M63 11l-7 19m50-19 8 19"/><circle cx="49" cy="53" r="10"/><circle cx="132" cy="53" r="10"/></svg>';paper.append(text('strong','','車のカタログ'));v.append(paper);
 }else if(s.visual==='floorplan'){
  const paper=text('div','story-paper floorplan-paper');paper.innerHTML='<svg viewBox="0 0 180 90" aria-hidden="true"><path d="M28 8h124v74H28zM78 8v42h74M78 50v32M28 45h50M112 50v32M145 23h7M28 63h7"/></svg>';paper.append(text('strong','','今は、間取り図に夢中'));v.append(paper);
 }else if(['parking_plan','parking_layout'].includes(s.visual)){
  const paper=text('div','parking-diagram');paper.innerHTML='<svg viewBox="0 0 260 100" aria-hidden="true"><path d="M12 15h236v70H12zM62 15v42M112 15v42M162 15v42M212 15v42M12 57h236"/><path d="M27 70h42m-8-7 8 7-8 7M191 70h42m-8-7 8 7-8 7"/></svg>';paper.append(text('strong','',s.visual==='parking_layout'?'駐車場の配置図':'駐車場という選択肢'));v.append(paper);
 }else if(s.visual==='fit'){
  const grid=text('div','fit-grid');grid.append(text('div','','土地の広さ'),text('div','','立地・周辺環境'));v.append(grid,text('p','concept-line','土地に合う計画を、プロと考える'));
 }else if(s.visual==='finance'){
  const grid=text('div','finance-grid');const cost=text('div');cost.append(text('strong','','かかるお金'),text('span','','初期費用・管理費など'));const income=text('div');income.append(text('strong','','入るお金'),text('span','','収入の見込み'));grid.append(cost,income);v.append(grid,text('p','concept-line','手元に残る収支を比べる'));
 }else if(s.visual==='plan_compare'){
  const grid=text('div','proposal-grid');for(const [name,type]of [['A社の提案','駐車場プラン'],['B社の提案','別の活用プラン']]){const box=text('div');box.append(text('b','',name),text('strong','',type),text('span','','初期費用・収入の見込み'));grid.append(box);}v.append(grid);
 }else if(s.visual==='authority'){
  v.classList.add('authority-visual');const logo=text('img','ntt-logo');logo.src=assets+'ntt-data.webp';logo.alt='NTT DATA';logo.width=490;logo.height=105;v.append(logo,text('div','authority-main','NTTデータグループ'),text('div','authority-sub','の会社が運営'),text('p','operator-name','株式会社NTTデータ・ウィズ'));
 }else if(s.visual==='process'){
  const flow=text('div','consider-flow');for(const [i,label]of ['プランを請求','比較・相談','方向性を検討'].entries()){if(i)flow.append(text('b','','→'));flow.append(text('span','',label));}v.append(flow,text('p','concept-line','まずは、選択肢を知るところから'));
 }else if(s.visual==='offer'){
  v.classList.add('service-visual');
  const logo=text('img','service-logo');logo.src=assets+'home4u-logo.webp';logo.width=520;logo.height=147;logo.alt='HOME4U 土地活用';
  const lead=text('img','service-lead');lead.src=assets+'home4u-service.webp';lead.width=1000;lead.height=248;lead.alt='土地活用をご検討なら、まずは無料のプラン比較！';lead.addEventListener('load',wakeIntro);lead.addEventListener('error',wakeIntro);
  const benefits=text('div','service-benefits');for(const item of ['活用方法','初期費用','収益・節税効果'])benefits.append(text('span','',item));
  const row=text('div','service-brand-row');row.append(logo,text('span','authority-chip','NTTデータグループ会社運営'));v.prepend(row);v.append(lead,benefits);
 }else if(s.visual==='cta'){v.append(text('div','offer-number','最大10社・無料'));const flow=text('div','flow');for(const [i,label]of ['土地情報を入力','プランを比較'].entries()){if(i)flow.append(text('b','','→'));flow.append(text('span','',label));}v.append(flow,text('p','visual-sub','売る前に、あの土地の選択肢を。'));}
}
let observedCta=null;
const observed=new IntersectionObserver(entries=>{for(const e of entries){if(!e.target.isConnected||!e.isIntersecting||e.intersectionRatio<.2||document.hidden)continue;if(e.target.dataset.kind==='question')once('q1','question_view',{question_id:'q1',question_order:1});if(e.target.dataset.kind==='cta'){const position=e.target.dataset.position||'final';once(`cta:${position}`,'cta_view',{cta_position:position});if(position==='final')once('end','flow_end',{end_type:'prototype'});}}},{threshold:[.2]});
function ctaButton(s,position){
 const button=text('button','cta',s.label);button.type='button';button.dataset.kind='cta';button.dataset.position=position;
 button.addEventListener('click',()=>{once(`cta:${position}`,'cta_view',{cta_position:position});event('cta_click',{cta_position:position,destination_type:'local_placeholder'});if(position!=='final'){autoPaused=true;autoLast=0;wakeIntro();}
  $('notice').replaceChildren(text('span','',preview?'編集プレビューの仮CTAです。外部遷移・計測は停止しています。':'仮CTAです。正式リンクは未設定のため、外部への移動・申込・情報送信は行っていません。'));$('notice').hidden=false;
  if(position!=='final'){const next=text('button','mid-continue','利用イメージを見る →');next.type='button';next.addEventListener('click',()=>{autoPaused=false;advance(s.next);});$('notice').append(next);}
  $('notice').scrollIntoView({block:'nearest'});
 });observedCta=button;observed.observe(button);return button;
}
function animate(){if(!currentMotion||!castVisible||document.hidden||reduced.matches)return;const {name,role}=currentMotion;currentMotion=null;$(role).classList.remove('surprise','nod','phone','point');void $(role).offsetWidth;$(role).classList.add(name);}
new IntersectionObserver(es=>{castVisible=es[0].isIntersecting;if(castVisible)animate();else stopMotion();},{threshold:.15}).observe(document.querySelector('.cast'));
function stopMotion(){for(const role of ['sister','brother'])$(role).classList.remove('surprise','nod','phone','point');}
document.addEventListener('visibilitychange',()=>{document.documentElement.toggleAttribute('data-paused',document.hidden);if(document.hidden){stopMotion();currentMotion=null;}else{observed.unobserve($('actions'));observed.observe($('actions'));if(observedCta){observed.unobserve(observedCta);observed.observe(observedCta);}}});
reduced.addEventListener('change',()=>{if(reduced.matches){stopMotion();currentMotion=null;completeTyping();}});
// Retain decoded image elements, including in-flight loads. Re-answering reuses pixels.
const portraits=new Map();
function character(role,state,rev,motion){
 const current=$(role),url=assets+`${role}-${state||'neutral'}.webp`;
 if(current.getAttribute('src')===url){if(motion)requestAnimationFrame(animate);return;}
 if(!portraits.has(url)){
  const image=new Image();image.decoding='async';
  const promise=new Promise((resolve,reject)=>{image.onload=()=>resolve(image);image.onerror=reject;});
  portraits.set(url,{image,promise});image.src=url;
 }
 portraits.get(url).promise.then(image=>{
  if(rev!==revision)return;
  const previous=$(role);image.id=role;image.alt=previous.alt;image.width=image.naturalWidth;image.height=image.naturalHeight;image.className=previous.className;
  previous.replaceWith(image);if(motion)requestAnimationFrame(animate);
 }).catch(()=>{if(rev===revision){$('notice').textContent='人物素材を読み込めませんでした。会話は続けられます。';$('notice').hidden=false;}});
}

function render({focus=true,motion=true}={}){
 const s=step();$('scene').dataset.step=s.id;revision++;costCueFired=false;sceneMotion=motion;stopIntro();reveals.reset();stopMotion();currentMotion=motion&&s.motion?{name:s.motion,role:s.motion==='surprise'?'brother':s.speaker}:null;
 document.querySelector('.shell').classList.toggle('question-mode',s.type==='question');document.querySelector('.shell').dataset.visual=s.visual;visual(s);$('bubble').className=`bubble ${s.speaker}`;$('line').replaceChildren();appendRichText($('line'),s.message);$('note').textContent=s.note||'';
 for(const role of ['sister','brother']){$(role).classList.toggle('idle',role!==s.speaker);character(role,s[role],revision,currentMotion?.role===role);}
 const actions=$('actions');observed.unobserve(actions);if(observedCta){observed.unobserve(observedCta);observedCta=null;}actions.replaceChildren();delete actions.dataset.kind;$('notice').hidden=true;
 const intro=automatic(s);document.querySelector('.shell').classList.toggle('intro-mode',intro);
 if(intro){
  if(s.ctaPosition)actions.append(ctaButton(s,s.ctaPosition));
  const controls=text('div','intro-player'),toolbar=text('div','intro-toolbar'),state=text('span','','自動で会話中'),toggle=text('button','intro-toggle','一時停止');state.id='intro-state';toggle.id='intro-toggle';toggle.type='button';toggle.setAttribute('aria-pressed',String(autoPaused));toggle.addEventListener('click',()=>{autoPaused=!autoPaused;autoLast=0;wakeIntro();event('intro_pause',{paused:autoPaused});});toolbar.append(state,toggle);
  const track=text('div','intro-track'),progress=text('div','intro-progress');progress.id='intro-progress';track.setAttribute('aria-hidden','true');track.append(progress);controls.append(toolbar,track);actions.append(controls);
  
 }else if(s.type==='question'){questionStart=performance.now();actions.dataset.kind='question';for(const o of s.options){const b=text('button','choice',o.label);b.type='button';b.dataset.answer=o.id;b.addEventListener('click',()=>{attempt++;event('question_answer',{question_id:'q1',question_order:1,attempt_number:attempt,response_ms:Math.round(performance.now()-questionStart)});answers[s.id]=o.id;autoPaused=false;advance(o.next);});actions.append(b);}}
 else if(s.type==='cta'){actions.append(ctaButton(s,'final'));}
 else{const b=text('button','next','次へ');b.type='button';b.append(text('span','','→'));b.addEventListener('click',()=>advance(s.next));actions.append(b);}
 beginIntro(s,{instant:!motion});
 observed.observe(actions);
 $('back').disabled=history.length===1;$('reanswer').hidden=!answers.q1;$('position').textContent=s.type==='question'?'質問 1 / 1':s.type==='cta'||s.ctaPosition?'プランを比べる':`シーン ${history.length}`;
 const chapter=s.chapter??0;
 document.querySelectorAll('.chapters span').forEach((e,i)=>{e.classList.toggle('active',i===chapter);if(i===chapter)e.setAttribute('aria-current','step');else e.removeAttribute('aria-current');});
 if(motion){
  if(lastVisual!==s.visual){
   if(s.visual==='expenses'&&!s.costStage)document.querySelectorAll('.bar-fill').forEach((el,i)=>reveals.reveal(el,[{transform:'scaleX(.04)'},{transform:'scaleX(1)'}],{duration:650,delay:i*110}));
   if(s.visual==='net')reveals.reveal(document.querySelector('.stack'),[{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)'}],{duration:800});
   if(['shares','question','compare'].includes(s.visual))document.querySelectorAll('.split>div').forEach((el,i)=>reveals.reveal(el,[{opacity:.7,transform:`translateX(${i?10:-10}px)`},{opacity:1,transform:'translateX(0)'}],{duration:450,delay:i*100}));
   if(['options','parking'].includes(s.visual))document.querySelectorAll('.plan').forEach((el,i)=>reveals.reveal(el,[{opacity:.7,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:440,delay:i*100}));
   if(['offer','cta'].includes(s.visual))document.querySelectorAll('.flow>span').forEach((el,i)=>reveals.reveal(el,[{backgroundColor:'#dbeacb'},{backgroundColor:'#fffcf6'}],{duration:600,delay:i*200}));
  }
 }
 lastVisual=s.visual;
 if(focus){window.scrollTo(0,0);$('bubble').focus({preventScroll:true});}
 once('start','chat_start');event('scene_view',{scene_order:history.length});
}
function advance(id,{auto=false}={}){if(!route(scenario,answers).some(s=>s.id===id))return;const fromMid=!!step().ctaPosition;history.push(id);render({focus:!auto});if(auto&&fromMid)window.scrollTo(0,0);}
$('back').addEventListener('click',()=>{if(history.length<2)return;autoPaused=true;history.pop();if(step().type==='question')delete answers[step().id];event('chat_back');render({motion:false});});
$('reanswer').addEventListener('click',()=>{const q=history.indexOf('q1');if(q<0)return;history=history.slice(0,q+1);answers={};event('chat_back');render({motion:false});});
once('lp','lp_view');render({focus:false});

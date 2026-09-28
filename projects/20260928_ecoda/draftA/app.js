'use strict';
const questions = [{"title": "今のお住まいは？", "options": ["東京都の戸建て持ち家", "戸建てだが家族名義", "その他"], "image": "03-q1.webp", "hotspots": [{"x": 0.0390625, "y": 0.390625, "w": 0.9248046875, "h": 0.171875}, {"x": 0.0390625, "y": 0.5751953125, "w": 0.9248046875, "h": 0.1728515625}, {"x": 0.0390625, "y": 0.76171875, "w": 0.9248046875, "h": 0.171875}]}, {"title": "太陽光・蓄電池が気になったきっかけは？", "options": ["最近、電気代が高い", "大雨、台風、停電が心配", "補助金があると知った", "周りで設置する家が増えた"], "image": "04-q2.webp", "hotspots": [{"x": 0.03515625, "y": 0.3349609375, "w": 0.931640625, "h": 0.15234375}, {"x": 0.03515625, "y": 0.4912109375, "w": 0.931640625, "h": 0.15234375}, {"x": 0.03515625, "y": 0.6474609375, "w": 0.931640625, "h": 0.15234375}, {"x": 0.03515625, "y": 0.8046875, "w": 0.931640625, "h": 0.15234375}]}, {"title": "まず一番知りたいことは？", "options": ["我が家はいくら補助金が出る？", "実際の自己負担はいくら？", "電気代はいくら安くなる？", "停電時にどこまで使える？"], "image": "05-q3-photo-v3.webp", "hotspots": [{"x": 0.03515625, "y": 0.3349609375, "w": 0.931640625, "h": 0.15234375}, {"x": 0.03515625, "y": 0.4912109375, "w": 0.931640625, "h": 0.15234375}, {"x": 0.03515625, "y": 0.6474609375, "w": 0.931640625, "h": 0.15234375}, {"x": 0.03515625, "y": 0.8046875, "w": 0.931640625, "h": 0.15234375}]}, {"title": "今の検討状況は？", "options": ["家族と相談するために情報を集めたい", "条件が良ければ検討したい", "具体的に検討している", "まだ何も決めていない"], "image": "06-q4-photo-v3.webp", "hotspots": [{"x": 0.03515625, "y": 0.3359375, "w": 0.931640625, "h": 0.16015625}, {"x": 0.03515625, "y": 0.501953125, "w": 0.931640625, "h": 0.15234375}, {"x": 0.03515625, "y": 0.6572265625, "w": 0.931640625, "h": 0.15234375}, {"x": 0.03515625, "y": 0.810546875, "w": 0.931640625, "h": 0.15234375}]}];
const formUrl = 'https://lp.house-energy.jp/lp15_campaign_3/';
document.addEventListener('click', event => {
  const link = event.target.closest('a[data-cta]');
  if (!link) return;
  const payload = {event:`cta_${link.dataset.cta}`,cta_position:link.dataset.cta};
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  window.dispatchEvent(new CustomEvent('ecoda:cta',{detail:payload}));
});
const quiz=document.getElementById('quiz');
const result=document.getElementById('result');
const title=document.getElementById('question-title');
const questionImage=document.getElementById('question-image');
const answers=document.getElementById('answers');
const previous=document.getElementById('previous');
const fixed=document.getElementById('fixed-cta');
let step=0;
let inTransition=false;
const responses=[];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
function moveTo(element,focusTarget){
  focusTarget.focus({preventScroll:true});
  element.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});
}
function renderQuestion(move=false){
  quiz.hidden=false; result.hidden=true;
  const question=questions[step];
  questionImage.src='assets/'+question.image;
  title.textContent=question.title;
  document.getElementById('quiz-progress').textContent=`質問 ${step+1} / 4、残り${4-step}問`;
  answers.replaceChildren();
  question.options.forEach((label,index)=>{
    const b=document.createElement('button');
    b.type='button';b.className='answer-hotspot';b.setAttribute('aria-label',label);
    const r=question.hotspots[index];
    b.style.left=(r.x*100)+'%';b.style.top=(r.y*100)+'%';b.style.width=(r.w*100)+'%';b.style.height=(r.h*100)+'%';
    const currentStep=step;
    b.addEventListener('click',()=>{
      if(inTransition||step!==currentStep)return;
      inTransition=true; responses[step]=index;
      if(step<3){step++;renderQuestion(true);}else{
        quiz.hidden=true;result.hidden=false;
        moveTo(result,document.getElementById('result-focus')); syncFixed();
      }
      window.setTimeout(()=>{inTransition=false;},350);
    });
    answers.append(b);
  });
  previous.hidden=step===0;
  if(move)moveTo(quiz,title);
}
previous.addEventListener('click',()=>{if(step>0&&!inTransition){step--;renderQuestion(true);}});
renderQuestion();
function syncFixed(){
  const height=innerHeight;
  const fv=document.getElementById('fv').getBoundingClientRect();
  const q=document.getElementById('diagnosis').getBoundingClientRect();
  const notes=document.getElementById('notes').getBoundingClientRect();
  const anyCta=[...document.querySelectorAll('main [data-cta]')].some(el=>{
    if(!el.getClientRects().length)return false;
    const r=el.getBoundingClientRect();return r.bottom>0&&r.top<height;
  });
  fixed.hidden=!(fv.bottom<0&&!anyCta&&!(!quiz.hidden&&q.bottom>0&&q.top<height)&&notes.top>height);
}
let scheduled=false;
function queueSync(){if(!scheduled){scheduled=true;requestAnimationFrame(()=>{scheduled=false;syncFixed();});}}
addEventListener('scroll',queueSync,{passive:true});addEventListener('resize',queueSync,{passive:true});addEventListener('load',syncFixed);
// 質問画像は初回ロード後に準備し、操作時の画像切り替え待ちを短縮する。
addEventListener('load',()=>{for(const q of questions.slice(1)){const image=new Image();image.src='assets/'+q.image;}});

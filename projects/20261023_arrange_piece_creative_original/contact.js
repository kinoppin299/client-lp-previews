import config from './site-config.js';
import registry from './bot/scenarios.js';
import {replay,route} from './bot/core.js';
const scenario=registry.creative.a,summary=document.getElementById('inquiry-summary');
let choices=[];
try{
  const saved=JSON.parse(sessionStorage.getItem('ap-creative-inquiry-v1'));
  if(saved&&saved.version===scenario.version&&Date.now()-saved.createdAt<30*60*1000&&Date.now()>=saved.createdAt){
    const valid=replay(scenario,saved.entries);
    if(valid.entries.length===4&&route(scenario,valid.answers).at(-1).type==='cta'){
      for(const entry of valid.entries){const q=scenario.steps.find(s=>s.id===entry.step_id);const answer=q.options.find(o=>o.id===entry.answer_id);choices.push({name:({q1:'制作の課題',q2:'商材',q3:'希望プラン',q4:'制作時期'})[q.id],value:answer.label});}
    }
  }
}catch{/* A blocked or expired tab store does not prevent direct inquiries. */}
const row=(target,name,value)=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=name;dd.textContent=value;target.append(dt,dd);};
if(choices.length)for(const choice of choices)row(summary,choice.name,choice.value);
else{row(summary,'ご相談内容','未選択');row(summary,'ご案内','相談内容欄にご希望をご入力いただくか、質問ガイドをご利用ください。');}
const form=document.getElementById('inquiry-form'),review=document.getElementById('form-review'),details=document.getElementById('review-details'),error=document.getElementById('form-error'),submit=document.getElementById('submit-inquiry'),result=document.getElementById('submission-result');
let confirmed=null;
const fieldNames={company:'会社名',name:'お名前',email:'メールアドレス',lp_url:'案件LP・商品URL',message:'ご相談内容'};
form.addEventListener('submit',event=>{
  event.preventDefault();error.hidden=true;
  for(const input of form.querySelectorAll('input:not([type=checkbox]),textarea'))input.value=input.value.trim();
  if(!form.reportValidity())return;
  const data=Object.fromEntries(new FormData(form));
  if(!data.company||!data.name||!data.email){error.textContent='会社名・お名前・メールアドレスをご入力ください。';error.hidden=false;return;}
  if(data.website){error.textContent='入力内容をご確認ください。';error.hidden=false;return;}
  if(data.lp_url){try{if(!['http:','https:'].includes(new URL(data.lp_url).protocol))throw Error();}catch{error.textContent='案件LPには、http:// または https:// から始まるURLをご入力ください。';error.hidden=false;document.getElementById('lp-url').focus();return;}}
  confirmed={company:data.company,name:data.name,email:data.email,lp_url:data.lp_url||'',message:data.message||'',consent:true,choices:choices.map(c=>({...c})),version:config.version};
  details.replaceChildren();for(const [key,label]of Object.entries(fieldNames))row(details,label,confirmed[key]||'未入力');for(const choice of choices)row(details,choice.name,choice.value);
  form.hidden=true;review.hidden=false;document.getElementById('review-title').focus();review.scrollIntoView({behavior:'smooth',block:'start'});
});
document.getElementById('edit-form').addEventListener('click',()=>{review.hidden=true;form.hidden=false;confirmed=null;document.getElementById('company').focus();form.scrollIntoView({behavior:'smooth',block:'start'});});
if(config.mode==='production'&&config.submissionEndpoint){
  const endpoint=new URL(config.submissionEndpoint,location.origin);
  if(endpoint.origin===location.origin&&endpoint.protocol==='https:'){
    submit.disabled=false;submit.firstChild.textContent='この内容で問い合わせる';document.getElementById('preview-message').hidden=true;result.textContent='送信前に内容をご確認ください。';
    submit.addEventListener('click',async()=>{
      if(!confirmed||submit.disabled)return;submit.disabled=true;result.textContent='送信しています。';
      try{
        const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(confirmed),credentials:'same-origin'});
        const body=await response.json();
        if(!response.ok||body.accepted!==true||!body.inquiryId)throw Error('Not accepted');
        result.textContent=`お問い合わせを受け付けました。受付番号：${body.inquiryId}`;
        sessionStorage.removeItem('ap-creative-inquiry-v1');confirmed=null;document.getElementById('edit-form').disabled=true;
      }catch{result.textContent='送信を確認できませんでした。時間をおいて再度お試しいただくか、app@a-piece.co.jpへご連絡ください。';submit.disabled=false;}
    });
  }
}

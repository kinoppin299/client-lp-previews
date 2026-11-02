(() => {
  'use strict';
  const config=window.ABC_LP_CONFIG, scenario=window.ABC_LP_SCENARIO, media=window.ABC_LP_MEDIA;
  const one=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const state={step:0,concern:null,future:null,objection:null,completed:false};
  const getConcern=()=>scenario.questions.q1.options.find(x=>x.id===state.concern);
  const concernLabels={foreskin:'包茎・かぶりが気になる',length:'長さが気になる',girth:'太さが気になる',early:'早漏が気になる'};
  let locked=false,unlockTimer=null,raf=null,previousFocus=null;

  function renderResult(){one('[data-result]').hidden=!state.completed;}
  function render(){
    const values=[state.concern,state.future,state.objection],count=values.filter(Boolean).length;
    const options=[scenario.questions.q1.options,getConcern()?.futures||[],scenario.questions.q3.options];
    const titles=['いちばん気になる悩みは？','どんな場面を変えたい？','治療を考えるとき、気になることは？'];
    one('[role="progressbar"]').setAttribute('aria-valuenow',String(count));
    one('[data-progress-text]').textContent=count?count+' / 3問に回答':'全3問';
    all('.progress-segments i').forEach((el,i)=>el.classList.toggle('done',i<count));
    for(let i=0;i<3;i++){
      const card=one(`[data-question-card="${i+1}"]`),choices=one(`[data-choices="${i+1}"]`);
      card.hidden=i===1?!state.concern:i===2?!state.future:false;
      card.classList.toggle('is-answered',Boolean(values[i]));
      one(`[data-title="${i+1}"]`).textContent=titles[i];
      one(`[data-hint="${i+1}"]`).textContent=i===2?'1つ選ぶと、クーポンの受取案内が開きます':'1つ選ぶと、下に次の質問が開きます';
      choices.replaceChildren();
      for(const option of options[i]){
        const button=document.createElement('button');button.type='button';button.className='choice-button';button.dataset.value=option.id;button.dataset.question=String(i+1);button.setAttribute('aria-pressed',String(option.id===values[i]));
        const marker=document.createElement('span');marker.className='choice-index';marker.textContent='✓';marker.setAttribute('aria-hidden','true');
        const label=document.createElement('span');label.className='choice-label';
        if(i===1&&option.id==='foreskin_3'){
          for(const text of['見た目を気にする時間を','減らしたい']){const line=document.createElement('span');line.className='choice-phrase';line.textContent=text;label.append(line);}
        }else if(i===1&&option.label.includes('、')){
          const at=option.label.indexOf('、')+1;
          for(const text of[option.label.slice(0,at),option.label.slice(at)]){const line=document.createElement('span');line.className='choice-phrase';line.textContent=text;label.append(line);}
        }else label.textContent=i===0?concernLabels[option.id]:option.label;
        const arrow=document.createElement('span');arrow.className='choice-arrow';arrow.textContent='›';arrow.setAttribute('aria-hidden','true');
        button.append(marker,label,arrow);choices.append(button);
        button.addEventListener('click',()=>{
          if(locked)return;locked=true;clearTimeout(unlockTimer);
          if(i===0){if(state.concern!==option.id){state.future=null;state.objection=null;}state.concern=option.id;}
          if(i===1)state.future=option.id;
          if(i===2)state.objection=option.id;
          state.completed=Boolean(state.concern&&state.future&&state.objection);state.step=Math.min(i+1,2);
          render();scrollToStep(i+1);unlockTimer=setTimeout(()=>{locked=false;},180);
        });
      }
    }
    updateQuestionImage();renderResult();scheduleSticky();
  }
  function scrollToStep(next){
    const result=next===3,card=result?one('[data-result]'):one(`[data-question-card="${next+1}"]`);
    const heading=result?one('[data-result-receive-title]'):one(`[data-title="${next+1}"]`);
    heading.focus({preventScroll:true});card.scrollIntoView({behavior:reduce?'instant':'smooth',block:'start'});
  }
  function updateQuestionImage(){
    const slot=one('[data-media-slot="I03"]'),spec=media.I03;
    const src=spec.variants?.[state.concern]||spec.src;
    if(slot.dataset.currentSrc===(src||''))return;
    mountSlot(slot,{...spec,src});
  }

  function placeholder(slot,spec,error=false){const el=document.createElement('div');el.className='media-load-fallback';el.setAttribute('role','status');el.textContent=error?'メディアを読み込めませんでした。ページを再読み込みしてください。':'読み込み中';return el;}
  const videos=new Set();
  const observer=new IntersectionObserver(entries=>{for(const entry of entries){const video=entry.target;video.dataset.inView=String(entry.isIntersecting);if(entry.isIntersecting){if(!video.src&&video.dataset.src){video.src=video.dataset.src;video.load();}if(!reduce&&!document.hidden&&video.dataset.userPaused!=='true')video.play().catch(()=>{});}else video.pause();}},{threshold:.15});
  function registerVideo(video){videos.add(video);observer.observe(video);}
  function mountSlot(slot,spec){
    const previous=slot.querySelector('video');if(previous){observer.unobserve(previous);previous.pause();videos.delete(previous);}
    slot.replaceChildren();slot.dataset.currentSrc=spec.src||'';slot.style.aspectRatio=spec.ratio;slot.classList.toggle('slot-is-video',spec.kind==='video');slot.classList.remove('has-asset');
    const fallback=placeholder(slot,spec);slot.append(fallback);
    if(!spec.src&&spec.poster){
      const poster=document.createElement('img');poster.className='slot-asset is-pending';poster.alt=spec.poster_alt||spec.title;poster.loading='lazy';poster.decoding='async';
      poster.addEventListener('load',()=>{poster.classList.remove('is-pending');fallback.hidden=true;slot.classList.add('has-asset');});
      poster.addEventListener('error',()=>{poster.hidden=true;fallback.replaceWith(placeholder(slot,spec,true));});poster.src=spec.poster;slot.append(poster);
      return;
    }
    if(!spec.src)return;
    const asset=document.createElement(spec.kind==='video'?'video':'img');asset.className='slot-asset is-pending';asset.hidden=false;
    const loaded=()=>{asset.hidden=false;asset.classList.remove('is-pending');fallback.hidden=true;slot.classList.add('has-asset');};
    asset.addEventListener('error',()=>{asset.hidden=true;slot.classList.remove('has-asset');fallback.replaceWith(placeholder(slot,spec,true));const control=slot.querySelector('.slot-controls');if(control)control.hidden=true;});
    if(spec.kind==='video'){
      asset.hidden=false;asset.classList.add('is-pending');asset.muted=true;asset.playsInline=true;asset.loop=true;asset.preload='none';asset.dataset.src=spec.src;asset.setAttribute('aria-label',spec.title);if(spec.poster)asset.poster=spec.poster;
      asset.addEventListener('loadeddata',loaded);if(spec.poster){asset.classList.remove('is-pending');fallback.hidden=true;slot.classList.add('has-asset');}
      const control=document.createElement('button');control.type='button';control.className='slot-controls';control.textContent=reduce?'再生':'一時停止';
      control.addEventListener('click',()=>{if(asset.paused){asset.dataset.userPaused='false';if(!asset.src)asset.src=asset.dataset.src;asset.play().catch(()=>{});}else{asset.dataset.userPaused='true';asset.pause();}});
      asset.addEventListener('play',()=>control.textContent='一時停止');asset.addEventListener('pause',()=>control.textContent='再生');slot.append(asset,control);registerVideo(asset);
    }else{asset.alt=spec.title;asset.loading='lazy';asset.decoding='async';asset.addEventListener('load',loaded);asset.src=spec.src;slot.append(asset);}
  }
  all('[data-media-slot]').forEach(slot=>mountSlot(slot,media[slot.dataset.mediaSlot]));

  const heroVideo=one('[data-talent-video]'),heroStill=one('[data-talent-still]'),heroFrame=one('[data-hero-frame]'),scene=one('[data-media-composition]'),windowEl=one('[data-video-window]');
  scene.style.aspectRatio='1080 / 1620';windowEl.style.inset='0';windowEl.style.width='100%';windowEl.style.height='100%';
  heroFrame.hidden=true;one('[data-hero-html]').hidden=true;
  heroStill.src=config.media.heroPoster;heroVideo.poster=config.media.heroPoster;
  heroVideo.muted=true;heroVideo.playsInline=true;heroVideo.loop=true;heroVideo.preload='none';heroVideo.hidden=false;heroVideo.dataset.src=media.V01.src;
  const playbackRow=document.createElement('div');playbackRow.className='hero-playback-row';
  const control=document.createElement('button');control.type='button';control.className='hero-media-controls';control.textContent=reduce?'動画を再生':'動画を停止';playbackRow.append(control);scene.insertAdjacentElement('afterend',playbackRow);
  control.addEventListener('click',()=>{if(heroVideo.paused){heroVideo.dataset.userPaused='false';if(!heroVideo.src)heroVideo.src=heroVideo.dataset.src;heroVideo.play().catch(()=>{});}else{heroVideo.dataset.userPaused='true';heroVideo.pause();}});
  heroVideo.addEventListener('play',()=>control.textContent='動画を停止');heroVideo.addEventListener('pause',()=>control.textContent='動画を再生');
  heroVideo.addEventListener('loadeddata',()=>{heroStill.hidden=true;heroFrame.hidden=true;one('[data-hero-html]').hidden=true;});
  heroVideo.addEventListener('error',()=>{heroVideo.hidden=true;heroStill.hidden=false;heroFrame.hidden=true;one('[data-hero-html]').hidden=true;control.hidden=true;});
  registerVideo(heroVideo);
  document.addEventListener('visibilitychange',()=>{for(const v of videos){if(document.hidden)v.pause();else if(!reduce&&v.dataset.inView==='true'&&v.dataset.userPaused!=='true')v.play().catch(()=>{});}});

  const ctaDialog=one('[data-cta-dialog]');
  const liveReady=config.mode==='live'&&config.offer.confirmed&&config.offer.conditionsConfirmed&&config.cta.url;
  const setModalState=()=>{document.body.classList.toggle('is-dialog-open',ctaDialog.open);scheduleSticky();};
  all('[data-cta]').forEach(a=>{if(liveReady){a.href=config.cta.url;a.target='_blank';a.rel='noopener noreferrer';}a.addEventListener('click',event=>{if(liveReady)return;event.preventDefault();previousFocus=a;ctaDialog.showModal();setModalState();});});
  all('[data-close-dialog]').forEach(x=>x.addEventListener('click',()=>ctaDialog.close()));
  for(const dialog of[ctaDialog]){dialog.addEventListener('close',()=>{setModalState();previousFocus?.focus({preventScroll:true});});dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});}
  if(config.offer.confirmed&&config.offer.amount){one('[data-offer-amount]').textContent=config.offer.amount;one('[data-offer-amount]').hidden=Boolean(media.I05.src);}
  // 指定LPのフッター注釈を原文で固定表示。追加の注釈を追記しない。
  function updateSticky(){const vh=innerHeight,inView=el=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&r.top<vh&&r.bottom>0;},inline=all('[data-cta-inline]').some(inView),questions=all('[data-question-card]').some(inView);one('[data-sticky]').hidden=one('.hero').getBoundingClientRect().bottom>0||inView(one('.survey-offer-intro'))||inline||questions||one('.site-footer').getBoundingClientRect().top<vh||ctaDialog.open;raf=null;}
  function scheduleSticky(){if(raf===null)raf=requestAnimationFrame(updateSticky);}
  addEventListener('scroll',scheduleSticky,{passive:true});addEventListener('resize',scheduleSticky);
  window.ABCLPPreview={getState:()=>({...state}),reset:()=>{clearTimeout(unlockTimer);locked=false;Object.assign(state,{step:0,concern:null,future:null,objection:null,completed:false});render();},mediaIds:()=>Object.keys(media)};
  if(new URLSearchParams(location.search).get('layout')==='all'){Object.assign(state,{step:2,concern:'foreskin',future:'foreskin_1',objection:'cost',completed:true});document.body.classList.add('layout-all');one('[data-layout-label]').textContent='全枠確認モード｜代表回答を仮表示';}
  const ctaMotionObserver=new IntersectionObserver(entries=>{for(const entry of entries)entry.target.classList.toggle('cta-in-view',entry.isIntersecting);},{threshold:.2});
  all('.unified-line-cta').forEach(el=>ctaMotionObserver.observe(el));
  render();updateSticky();
})();

(() => {
  'use strict';
  const config=window.ABC_LP_CONFIG, media=window.ABC_LP_MEDIA;
  const one=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf=null,previousFocus=null;
  function placeholder(slot,spec,error=false){const el=document.createElement('div');el.className='media-load-fallback';el.setAttribute('role','status');el.textContent=error?'メディアを読み込めませんでした。ページを再読み込みしてください。':'読み込み中';return el;}
  const videos=new Set();
  const observer=new IntersectionObserver(entries=>{for(const entry of entries){const video=entry.target;video.dataset.inView=String(entry.isIntersecting);if(entry.isIntersecting){if(!video.src&&video.dataset.src){video.src=video.dataset.src;video.load();}if(!reduce&&!document.hidden&&video.dataset.userPaused!=='true')video.play().catch(()=>{});}else video.pause();}},{threshold:.15});
  function registerVideo(video){videos.add(video);observer.observe(video);}
  function mountSlot(slot,spec){
    const maxLabel=slot.querySelector('.max-off-label');
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
    if(maxLabel)slot.append(maxLabel);
  }
  all('[data-media-slot]').forEach(slot=>mountSlot(slot,media[slot.dataset.mediaSlot]));

  const heroVideo=one('[data-talent-video]'),heroStill=one('[data-talent-still]'),heroFrame=one('[data-hero-frame]'),scene=one('[data-media-composition]'),windowEl=one('[data-video-window]');
  scene.style.aspectRatio=(config.media.canvasWidth||1080)+' / '+(config.media.canvasHeight||1620);windowEl.style.inset='0';windowEl.style.width='100%';windowEl.style.height='100%';
  heroFrame.hidden=true;one('[data-hero-html]').hidden=true;
  heroStill.src=config.media.heroPoster;heroVideo.poster=config.media.heroPoster;
  if(media.V01.kind==='image'){heroStill.hidden=false;heroVideo.hidden=true;heroVideo.removeAttribute('src');}
  else{
  heroVideo.muted=true;heroVideo.playsInline=true;heroVideo.loop=true;heroVideo.preload='none';heroVideo.hidden=false;heroVideo.dataset.src=media.V01.src;
  heroVideo.tabIndex=0;heroVideo.setAttribute('role','button');
  const syncHeroLabel=()=>{heroVideo.setAttribute('aria-label',heroVideo.paused?'動画を再生':'動画を一時停止');heroVideo.setAttribute('aria-pressed',String(!heroVideo.paused));};
  const toggleHero=()=>{if(heroVideo.paused){heroVideo.dataset.userPaused='false';if(!heroVideo.src)heroVideo.src=heroVideo.dataset.src;heroVideo.play().catch(()=>{});}else{heroVideo.dataset.userPaused='true';heroVideo.pause();}};
  heroVideo.addEventListener('click',toggleHero);heroVideo.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggleHero();}});
  heroVideo.addEventListener('play',syncHeroLabel);heroVideo.addEventListener('pause',syncHeroLabel);syncHeroLabel();
  heroVideo.addEventListener('loadeddata',()=>{heroStill.hidden=true;heroFrame.hidden=true;one('[data-hero-html]').hidden=true;});
  heroVideo.addEventListener('error',()=>{heroVideo.hidden=true;heroStill.hidden=false;heroFrame.hidden=true;one('[data-hero-html]').hidden=true;});
  registerVideo(heroVideo);
  }
  document.addEventListener('visibilitychange',()=>{for(const v of videos){if(document.hidden)v.pause();else if(!reduce&&v.dataset.inView==='true'&&v.dataset.userPaused!=='true')v.play().catch(()=>{});}});

  const ctaDialog=one('[data-cta-dialog]');
  const liveReady=config.mode==='live'&&config.offer.confirmed&&config.offer.conditionsConfirmed&&config.cta.url;
  const setModalState=()=>{document.body.classList.toggle('is-dialog-open',ctaDialog.open);scheduleSticky();};
  all('[data-cta]').forEach(a=>{if(liveReady){a.href=config.cta.url;a.target='_blank';a.rel='noopener noreferrer';}a.addEventListener('click',event=>{if(liveReady)return;event.preventDefault();previousFocus=a;ctaDialog.showModal();setModalState();});});
  all('[data-close-dialog]').forEach(x=>x.addEventListener('click',()=>ctaDialog.close()));
  for(const dialog of[ctaDialog]){dialog.addEventListener('close',()=>{setModalState();previousFocus?.focus({preventScroll:true});});dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});}
  if(config.offer.confirmed&&config.offer.amount){one('[data-offer-amount]').textContent=config.offer.amount;one('[data-offer-amount]').hidden=Boolean(media.I05.src);}
  const couponResult=one('[data-result]'),couponVisual=one('.reward-keyvisual');
  function updateSticky(){
    const vh=innerHeight,inView=el=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&r.top<vh&&r.bottom>0;};
    const couponImage=couponVisual?.querySelector('img');
    // 診断結果の表示では解除せず、読み込まれたクーポン画像の下端まで画面に出てから表示する。
    const couponShown=Boolean(couponResult&&!couponResult.hidden&&couponVisual.classList.contains('has-asset')&&couponImage?.complete&&couponImage.naturalWidth>0&&couponVisual.getBoundingClientRect().bottom<=vh);
    const inline=all('[data-cta-inline]').some(inView),questions=all('#abc-diagnosis-root [data-lp-chat-unanswered]').some(inView);
    one('[data-sticky]').hidden=!couponShown||one('.hero').getBoundingClientRect().bottom>0||inView(one('.survey-offer-intro'))||inline||questions||one('.site-footer').getBoundingClientRect().top<vh||ctaDialog.open;
    raf=null;
  }
  function scheduleSticky(){if(raf===null)raf=requestAnimationFrame(updateSticky);}
  addEventListener('scroll',scheduleSticky,{passive:true});addEventListener('resize',scheduleSticky);
  addEventListener('diagnosischange',scheduleSticky);
  couponVisual?.addEventListener('load',scheduleSticky,true);
  const ctaMotionObserver=new IntersectionObserver(entries=>{for(const entry of entries)entry.target.classList.toggle('cta-in-view',entry.isIntersecting);},{threshold:.2});
  all('.unified-line-cta').forEach(el=>ctaMotionObserver.observe(el));
  updateSticky();
})();

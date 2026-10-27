'use strict';
(() => {
  const data = window.PROPOSAL_DATA;
  const byId = id => document.getElementById(id);
  const player = byId('player');
  const videoDialog = byId('video-dialog');
  const overview = byId('overview-dialog');
  let currentPage = 1;
  let currentVideo = null;
  let returnFocus = null;
  let updatingFromHash = false;
  let playbackGeneration = 0;
  const mobile = () => matchMedia('(max-width:600px)').matches;
  byId('pdf-download').href = data.pdf;
  byId('annex-download').href = data.annex;
  player.muted = true;
  player.volume = 1;

  function hashState(page = currentPage, video = currentVideo) {
    const params = new URLSearchParams({p: String(page)});
    if (video) params.set('video', video);
    return '#' + params.toString();
  }
  function updateHash() {
    if (!updatingFromHash) history.replaceState(null, '', hashState());
  }
  function closeVideo(update = true) {
    playbackGeneration++;
    player.pause();
    player.muted = true;
    player.removeAttribute('src');
    player.load();
    currentVideo = null;
    if (videoDialog.open) videoDialog.close();
    if (update) updateHash();
    if (returnFocus?.isConnected) returnFocus.focus({preventScroll:true});
  }
  function soundLabel() {
    byId('sound-toggle').textContent = player.muted ? '音声をオンにする' : '音声をオフにする';
    byId('sound-notice').textContent = player.muted ? '消音で再生します。音声も聞く場合は、下のボタンを押してください。' : '音声ありで再生します。商談では画面共有側の音声共有も有効にしてください。';
  }
  function openVideo(id) {
    const video = data.videos.find(v => v.id === id);
    if (!video) return;
    if (currentPage !== 7) renderPage(7);
    playbackGeneration++;
    player.pause();
    player.muted = true;
    currentVideo = id;
    byId('video-title').textContent = video.title;
    byId('video-caption').textContent = video.caption;
    player.poster = video.poster;
    player.src = video.src;
    player.load();
    soundLabel();
    byId('play-overlay').hidden = false;
    byId('playback-status').textContent = '再生ボタンを押してください。';
    byId('video-switcher').replaceChildren(...data.videos.map(item => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = item.title;
      b.setAttribute('aria-pressed', String(item.id === id));
      const small = document.createElement('small'); small.textContent = item.label;
      b.append(small); b.addEventListener('click', () => openVideo(item.id)); return b;
    }));
    if (!videoDialog.open) {
      returnFocus = document.activeElement;
      videoDialog.showModal();
    }
    updateHash();
  }
  function playButton(video, className, style) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = className;
    b.setAttribute('aria-label', `${video.title}の動画を再生（${video.label}）`);
    if (style) Object.assign(b.style, style);
    if (className !== 'video-image-hotspot') b.textContent = '▶ ' + (video.id === 'body' ? '本編を再生' : '冒頭を再生');
    b.addEventListener('click', () => openVideo(video.id)); return b;
  }
  function renderPage(n) {
    const page = data.pages[Math.min(data.pages.length, Math.max(1, n)) - 1];
    if (!page) return;
    if (videoDialog.open) closeVideo(false);
    currentPage = page.number;
    byId('slide-image').src = page.image;
    byId('slide-image').alt = `${page.number}ページ：${page.title}`;
    byId('page-title').textContent = page.title;
    byId('chapter-label').textContent = String(currentPage).padStart(2, '0') + ' / 13';
    byId('page-select').value = String(currentPage);
    byId('prev').disabled = currentPage === 1;
    byId('next').disabled = currentPage === data.pages.length;
    byId('progress').style.width = `${currentPage / data.pages.length * 100}%`;
    byId('transcript-content').replaceChildren(...page.paragraphs.map(t => {const p = document.createElement('p');p.textContent = t;return p;}));
    byId('transcript').open = mobile();
    byId('page-note').textContent = currentPage === 7 ? '動画を押すと、この画面で再生できます。' : '矢印キーでもページを移動できます。';
    const hotspots = byId('slide-hotspots'); hotspots.replaceChildren();
    const quick = byId('video-quick-list'); quick.replaceChildren();
    if (currentPage === 7) data.videos.forEach((v, i) => {
      const left = (42.02346 + i * 225) / 960 * 100;
      hotspots.append(playButton(v, 'video-image-hotspot', {left:left+'%',top:'31.6667%',width:'15.07324%',height:'47.6389%'}));
      hotspots.append(playButton(v, 'video-text-hotspot', {left:(42+i*225)/960*100+'%',top:'80.8%',width:'22.421875%',height:'5.6%'}));
      const b = playButton(v, '');b.textContent = '▶ ' + v.title;
      const small = document.createElement('small');small.textContent=v.label;b.append(small);quick.append(b);
    });
    if (currentPage === 13) {
      const a=document.createElement('a');a.href='https://a-piece.co.jp/';a.target='_blank';a.rel='noopener noreferrer';a.className='company-hotspot';a.setAttribute('aria-label','株式会社アレンジピースの企業サイトを開く');Object.assign(a.style,{left:'3%',top:'86%',width:'42%',height:'8%'});hotspots.append(a);
    }
    overview.querySelectorAll('[data-page]').forEach(b => b.setAttribute('aria-current', Number(b.dataset.page) === currentPage ? 'page' : 'false'));
    document.title = `${currentPage}/13 ${page.title}｜アレンジピース`;
    updateHash();
    if (mobile()) window.scrollTo({top:0,behavior:'instant'});
    const nextImage=data.pages[currentPage]?.image;if(nextImage){const pre=new Image();pre.src=nextImage;}
  }
  data.pages.forEach(page => {
    const option = document.createElement('option');option.value=String(page.number);option.textContent=String(page.number).padStart(2,'0');byId('page-select').append(option);
    const b=document.createElement('button');b.type='button';b.dataset.page=page.number;b.setAttribute('aria-label',`${page.number}ページ ${page.title}`);
    const img=document.createElement('img');img.src=page.thumb;img.loading='lazy';img.width=480;img.height=270;img.alt='';
    const span=document.createElement('span'),num=document.createElement('b');num.textContent=String(page.number).padStart(2,'0')+' / 13';span.append(num,document.createTextNode(page.title));b.append(img,span);b.addEventListener('click',()=>{overview.close();renderPage(page.number);});byId('overview-grid').append(b);
  });
  byId('prev').addEventListener('click', () => renderPage(currentPage - 1));
  byId('next').addEventListener('click', () => renderPage(currentPage + 1));
  byId('page-select').addEventListener('change', e => renderPage(Number(e.target.value)));
  byId('examples-jump').addEventListener('click', () => renderPage(7));
  byId('overview-open').addEventListener('click', () => overview.showModal());
  byId('back-to-deck').addEventListener('click', () => closeVideo());
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>b.dataset.close==='video-dialog'?closeVideo():byId(b.dataset.close).close()));
  videoDialog.addEventListener('cancel',e=>{e.preventDefault();closeVideo();});
  videoDialog.addEventListener('close',()=>{if(currentVideo)closeVideo();});
  for(const dlg of [overview,videoDialog]) dlg.addEventListener('click', e=>{if(e.target===dlg){const r=dlg.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dlg===videoDialog?closeVideo():dlg.close();}});
  byId('play-overlay').addEventListener('click',async()=>{
    const generation=playbackGeneration;
    try {await player.play();if(generation===playbackGeneration)byId('play-overlay').hidden=true;}
    catch(e){if(generation!==playbackGeneration||e.name==='AbortError')return;byId('playback-status').textContent='再生を開始できませんでした。動画の再生ボタンからもう一度お試しください。';}
  });
  byId('sound-toggle').addEventListener('click',()=>{player.muted=!player.muted;soundLabel();});
  player.addEventListener('volumechange',soundLabel);
  player.addEventListener('play',()=>{byId('play-overlay').hidden=true;byId('playback-status').textContent='再生中';});
  player.addEventListener('pause',()=>{if(currentVideo)byId('playback-status').textContent=player.ended?'再生が完了しました。':'一時停止中';});
  player.addEventListener('ended',()=>{byId('playback-status').textContent='再生が完了しました。';});
  player.addEventListener('error',()=>{if(!currentVideo)return;byId('play-overlay').hidden=true;byId('playback-status').textContent='動画を読み込めませんでした。通信状況を確認して、動画を選び直してください。';});
  function presentationLabel() {
    const active = !!document.fullscreenElement || byId('app').classList.contains('presentation-mode');
    byId('fullscreen').setAttribute('aria-pressed', String(active));
    byId('fullscreen').setAttribute('aria-label', active ? '拡大表示を終了' : '資料を大きく表示');
  }
  async function exitPresentation() {
    if (document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen();
    byId('app').classList.remove('presentation-mode');presentationLabel();
  }
  byId('fullscreen').addEventListener('click',async()=>{
    if(document.fullscreenElement || byId('app').classList.contains('presentation-mode')) {await exitPresentation();return;}
    try {
      if(byId('app').requestFullscreen) await byId('app').requestFullscreen();
      else byId('app').classList.add('presentation-mode');
    } catch {byId('app').classList.add('presentation-mode');}
    presentationLabel();
  });
  byId('exit-presentation').addEventListener('click',exitPresentation);
  document.addEventListener('fullscreenchange',presentationLabel);
  document.addEventListener('keydown',e=>{
    if(videoDialog.open||overview.open||['SELECT','INPUT','TEXTAREA','VIDEO'].includes(e.target.tagName))return;
    if(e.key==='Escape' && byId('app').classList.contains('presentation-mode')){exitPresentation();return;}
    if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();renderPage(currentPage+1);}
    if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();renderPage(currentPage-1);}
    if(e.key==='Home'){e.preventDefault();renderPage(1);}
    if(e.key==='End'){e.preventDefault();renderPage(13);}
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)player.pause();});
  window.addEventListener('pagehide',()=>player.pause());
  function fromHash(){
    updatingFromHash=true;
    const p=new URLSearchParams(location.hash.slice(1));
    const n=Number(p.get('p'));renderPage(Number.isFinite(n)&&n>=1?n:1);
    if(p.has('video'))openVideo(p.get('video'));
    updatingFromHash=false;updateHash();
  }
  window.addEventListener('hashchange',fromHash);fromHash();
})();

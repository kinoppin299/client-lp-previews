import registry from './scenarios.js?build=027094968716';
import {appendRichText,plainText} from './rich-text.js?build=027094968716';
import {renderOfferCard} from './offer-card.js?build=027094968716';
import {QUERY_KEYS,collectQuery,conversionURL,route,replay,validateScenario,safeURL,conversationWait} from './core.js?build=027094968716';
const $ = id => document.getElementById(id);
const backControl = $('back');
const query = new URLSearchParams(location.search);
const campaign = query.get('scenario') || 'demo', variant = query.get('v') || 'a';
// Only the explicit authoring iframe uses copy drafts. Ordinary ad visitors never read them.
const editorPreview = query.get('editor_preview') === '1' && window.parent !== window;
let scenario = registry[campaign]?.[variant];
if (editorPreview) {
  try {
    const draft = JSON.parse(localStorage.getItem(`chat-lp:copy-editor:${new URL('.',location.href).pathname}:${campaign}:${variant}`));
    if (draft?.id === scenario?.id && draft?.version === scenario?.version && draft?.variant === variant && !validateScenario(draft).errors.length) scenario = draft;
  } catch { /* The published scenario remains the fallback. */ }
}
let entries = [], answers = {}, started = false, seen = new Set(), attribution = {}, observer, generation = 0, busy = false, cancelScroll = false;
const storageKey = scenario ? `chat-lp:${location.pathname}:${scenario.id}:${scenario.version}:${variant}` : '';
const canResume = scenario?.resume === true;
let lastFullPath = [], openingActive = false;
const ctaClicks = new Map();
function emit(event, step = null, extra = {}) {
  if (editorPreview) return;
  if (event === 'branch_select' && scenario.tracking?.branchDetails === false) return;
  // Branch-specific reply IDs can reveal the answer even when answer_id is null.
  if (event === 'step_view' && scenario.tracking?.stepViews === 'funnel' && !['question','offer','cta'].includes(step?.type) && step?.id !== scenario.start) return;
  // Explicit fields only: no answer labels, URL, query, HTML, or complete answer map.
  const payload = {event,lp_id:scenario.id,lp_version:scenario.version,ab_variant:variant,step_id:step?.id || null,step_type:step?.type || null,question_id:step?.type === 'question' ? step.id : null,answer_id:null,branch_id:null,branch_target:null,cta_id:null,...extra};
  try { (window.dataLayer ||= []).push(payload);
    const audit = document.getElementById('event-audit');
    if (audit) audit.textContent += JSON.stringify(payload) + '\n';
  } catch { /* Analytics failure must never block the guide or navigation. */ }
}
function store() {
  if (!canResume) return;
  try { sessionStorage.setItem(storageKey,JSON.stringify({entries,started,seen:[...seen],attribution})); } catch { /* Private mode / quota: continue in memory. */ }
}
function once(event, step) {
  const key = `${event}:${step.id}`;
  if (!seen.has(key)) { seen.add(key); emit(event,step); store(); }
}
function load() {
  attribution = collectQuery(location.search,[...QUERY_KEYS,...(scenario.conversion.extraQueryKeys || [])]);
  if (!canResume) return;
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey));
    if (saved?.started === true && Array.isArray(saved.entries)) {
      const valid = replay(scenario,saved.entries); entries = valid.entries; answers = valid.answers; started = true;
      const allowed = new Set(scenario.steps.flatMap(s => ['step_view','offer_view','cta_view'].map(e => `${e}:${s.id}`)));
      allowed.add('chat_complete');
      for (const step of scenario.steps.filter(s => s.type === 'branch')) for (const target of [...step.cases.map(c => c.next), step.fallback]) allowed.add(`branch:${step.id}:${target}`);
      seen = new Set(Array.isArray(saved.seen) ? saved.seen.filter(k => allowed.has(k)) : []);
      const currentKeys = Object.keys(attribution);
      // An explicitly tagged new ad landing uses its own attribution, not stale click IDs.
      if (!currentKeys.length) attribution = collectQuery(new URLSearchParams(saved.attribution || {}).toString(),[...QUERY_KEYS,...(scenario.conversion.extraQueryKeys || [])]);
    }
  } catch { /* Malformed storage falls back to a new guide. */ }
}
function element(tag, className, text) {
  const node = document.createElement(tag); if (className) node.className = className; if (text) appendRichText(node,text); return node;
}
function customHTML(html) {
  // Inert parsing and rebuilding; no raw HTML is inserted into the live document.
  const doc = new DOMParser().parseFromString(html,'text/html'), fragment = document.createDocumentFragment();
  const tags = new Set(['P','H2','H3','STRONG','EM','UL','OL','LI','BR','SPAN']);
  function copy(source, target) {
    for (const child of source.childNodes) {
      if (child.nodeType === 3) target.append(document.createTextNode(child.textContent));
      else if (tags.has(child.nodeName)) { const node = document.createElement(child.nodeName.toLowerCase()); copy(child,node); target.append(node); }
    }
  }
  copy(doc.body,fragment); return fragment;
}
function avatar() {
  const node = element('span','avatar',scenario.avatarImage ? '' : scenario.avatar || '案');
  node.setAttribute('aria-hidden','true');
  if (scenario.avatarImage) { const img = element('img',''); img.src = scenario.avatarImage; img.alt = ''; img.width = 40; img.height = 40; node.append(img); }
  return node;
}
function disclosure(data) {
  const details = element('details','conditions');
  details.append(element('summary','',data.label),element('p','',data.text)); return details;
}
function campaignFooter() {
  if (!scenario.footer) return null;
  const footer = element('div','campaign-footer');
  footer.setAttribute('role','contentinfo'); footer.setAttribute('aria-label','フッター');
  const img = element('img','');
  for (const key of ['src','alt','width','height']) img[key] = scenario.footer[key];
  img.loading = 'lazy'; img.decoding = 'async'; footer.append(img);
  if (scenario.footer.privacyURL) {
    const link = element('a','privacy-link','プライバシーポリシー');
    link.href = scenario.footer.privacyURL; link.target = '_blank'; link.rel = 'noopener noreferrer';
    footer.append(link);
  }
  return footer;
}
function ctaLink(step) {
  const link = element('a','primary',step.image ? '' : step.label);
  if (step.image) {
    link.classList.add('image-cta');
    const img = element('img','');
    for (const key of ['src','alt','width','height']) img[key] = step.image[key];
    img.decoding = 'async';
    if (step.image.crop) {
      const {x,y,width,height} = step.image.crop;
      link.classList.add('cropped-cta');
      link.style.aspectRatio = `${width} / ${height}`;
      img.style.width = `${step.image.width / width * 100}%`;
      img.style.left = `${-x / width * 100}%`;
      img.style.top = `${-y / height * 100}%`;
    }
    link.append(img); link.setAttribute('aria-label',plainText(step.label));
  }
  link.href = conversionURL(scenario.conversion,attribution,location.href);
  if (editorPreview) {
    link.href = '#preview-cta';
    link.title = '編集プレビューでは外部へ移動しません';
    link.addEventListener('click',event => event.preventDefault());
    link.addEventListener('auxclick',event => event.preventDefault());
  }
  link.dataset.cta = step.id;
  // A real native link keeps navigation working with blocked or broken analytics.
  
  const trackClick = () => {
    const now = performance.now(); if (now - (ctaClicks.get(step.id) ?? -Infinity) < 500) return; ctaClicks.set(step.id,now);
    once('step_view',step); once('cta_view',step);
    emit('cta_click',step,{cta_id:step.id});
    // No callback, promise, timeout, or preventDefault. Navigation wins.
  };
  link.addEventListener('click',trackClick);
  link.addEventListener('auxclick',event => { if (event.button === 1) trackClick(); });
  return link;
}
function buildStep(step) {
  const turn = element('article',`turn ${step.type}${step.layout === 'fullbleed' ? ' fullbleed' : ''}`); turn.dataset.step = step.id;
  if (step.layout === 'fullbleed') {
    const img = element('img','fv-image'); img.src = step.src; img.alt = step.alt; img.width = step.width; img.height = step.height;
    img.loading = 'eager'; img.fetchPriority = 'high'; img.decoding = 'async'; turn.append(img);
    if (step.adLabel) turn.append(element('span','fv-ad-label',step.adLabel));
    turn.append(element('span','entry-guide-note','選択式の自動ガイド'));
    if (step.disclosure) turn.append(disclosure(step.disclosure));
    const trigger = element('div','entry-trigger'); trigger.setAttribute('aria-hidden','true'); turn.append(trigger);
    return turn;
  }
  if (step.type === 'question') turn.dataset.answerId = answers[step.id] || '';
  const speaker = element('div','speaker'); speaker.append(avatar(),element('span','',scenario.brand));
  const bubble = element('div','bubble');
  let chatMedia = null, mediaCaption = null, standaloneCTA = null, ctaDetails = null;
  if (step.type === 'question') {
    const heading = element('h2','',step.message); heading.id = `heading-${step.id}`; bubble.append(heading); turn.setAttribute('aria-labelledby',heading.id);
    if (step.hint) bubble.append(element('div','hint',step.hint));
  } else {
    if (step.title) bubble.append(element('h2','',step.title));
    if (['image','image_message','video'].includes(step.type) || step.type === 'offer' && step.src) {
      const media = step.offerCard ? renderOfferCard(step.offerCard) : document.createElement(step.type === 'video' ? 'video' : 'img');
      if (!step.offerCard) {media.src = step.src; media.width = step.width; media.height = step.height;}
      if (step.offerCard) { /* Editable text in a code-native SVG card. */ }
      else if (step.type === 'video') {
        media.controls = true; media.playsInline = true; media.preload = 'none';
        const track = document.createElement('track'); track.kind = 'captions'; track.src = step.captions; track.srclang = 'ja'; track.label = '日本語'; media.append(track);
        if (step.poster && safeURL(step.poster)) media.poster = step.poster;
      } else { media.alt = step.alt; media.loading = 'lazy'; media.decoding = 'async'; }
      if (scenario.autoStart) {
        chatMedia = media;
        if (step.crop) {
          const {x,y,width,height} = step.crop;
          chatMedia = element('div','media-window');
          chatMedia.style.aspectRatio = `${width} / ${height}`;
          media.style.width = `${step.width / width * 100}%`;
          media.style.left = `${-x / width * 100}%`;
          media.style.top = `${-y / height * 100}%`;
          chatMedia.append(media);
        }
        chatMedia.classList.add('chat-media');
        mediaCaption = element('div','bubble media-caption');
      } else bubble.append(media);
    }
    const content = mediaCaption || bubble;
    if (step.type === 'html') content.append(customHTML(step.html));
    if (step.message) content.append(element('p','',step.message));
    if (step.type === 'cta') {
      if (scenario.autoStart && step.image) {
        standaloneCTA = ctaLink(step);
        ctaDetails = element('div','cta-details');
        turn.classList.add('has-image-cta');
      } else content.append(ctaLink(step));
    }
    if (step.note) content.append(element('p','small-note',step.note));
    if (step.disclosure) (ctaDetails || content).append(disclosure(step.disclosure));
  }
  if (bubble.childElementCount || mediaCaption?.childElementCount) turn.append(speaker);
  if (bubble.childElementCount) turn.append(bubble);
  if (chatMedia) turn.append(chatMedia);
  if (mediaCaption?.childElementCount) turn.append(mediaCaption);
  if (standaloneCTA) turn.append(standaloneCTA);
  if (ctaDetails?.childElementCount) turn.append(ctaDetails);
  if (step.type === 'question') {
    const selected = step.options.find(o => o.id === answers[step.id]);
    if (selected) turn.append(element('p','answer',selected.label));
    else {
      const options = element('div','options'); options.setAttribute('role','group'); options.setAttribute('aria-labelledby',`heading-${step.id}`);
      for (const option of step.options) {
        const button = element('button','option',option.label); button.type = 'button'; button.dataset.answer = option.id;
        button.addEventListener('click',event => {
          if (busy || answers[step.id]) return;
          // Synchronous lock prevents both double-click and delayed duplicate handlers.
          busy = true; for (const b of options.children) b.disabled = true;
          answers[step.id] = option.id; entries.push({step_id:step.id,answer_id:option.id});
          once('step_view',step);
          emit('chat_answer',step,scenario.tracking?.answerIdsFor?.includes(step.id) ? {answer_id:option.id} : {});
          emit('step_complete',step); store(); render({focus:event.detail === 0});
        }); options.append(button);
      }
      turn.append(options);
    }
  }
  return turn;
}
function moveTo(node, focus = false) {
  if (!node) return;
  node.scrollIntoView({behavior:'auto',block:'start'});
  if (focus) { const target = node.querySelector('button,a') || node; if (target === node) target.tabIndex = -1; target.focus({preventScroll:true}); }
}
function typingIndicator() {
  const turn = element('div','turn typing-turn');
  turn.setAttribute('aria-hidden','true');
  const speaker = element('div','speaker');
  speaker.append(avatar(),element('span','',scenario.brand));
  const bubble = element('div','bubble typing-bubble');
  for (let i = 0; i < 3; i++) bubble.append(element('span','typing-dot'));
  turn.append(speaker,bubble); return turn;
}
async function waitForEntry(node) {
  const img = node.querySelector('img');
  try { await img.decode(); } catch { /* Keep the guide usable if the source image fails. */ }
  await new Promise(resolve => {
    const watch = new IntersectionObserver(items => {
      if (items.some(item => item.isIntersecting)) { watch.disconnect(); resolve(); }
    },{root:$('transcript')});
    watch.observe(node.querySelector('.entry-trigger'));
  });
}
async function render({focus = false, rewind = false, animate = true, opening = false} = {}) {
  openingActive = opening;
  const token = ++generation; busy = true; cancelScroll = false;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  $('hero').hidden = true; $('chat').hidden = false; $('sticky').hidden = true;
  document.body.classList.add('is-chat'); document.body.classList.remove('has-sticky');
  observer?.disconnect();
  const path = route(scenario,answers), visible = path.filter(s => !['branch','delay'].includes(s.type));
  const previousAll = lastFullPath; lastFullPath = path.map(s => s.id);
  const transcript = $('transcript');
  // Keep one back control/listener while its previous question is replaced.
  if (scenario.autoStart) document.querySelector('.progress-copy').append(backControl);
  let footer = transcript.querySelector('.campaign-footer');
  if (!footer) { footer = campaignFooter(); if (footer) transcript.append(footer); }
  // Retain the shared conversation prefix. Do not flash/rebuild the entire history.
  const oldNodes = [...transcript.children].filter(node => node.dataset.step);
  let common = 0;
  while (common < oldNodes.length && oldNodes[common].dataset.step === visible[common]?.id) common++;
  for (const node of oldNodes.slice(common)) node.remove();
  for (let i = 0; i < common; i++) {
    const step = visible[i], node = oldNodes[i];
    if (step.type === 'question' && node.dataset.answerId !== (answers[step.id] || '')) node.replaceWith(buildStep(step));
  }
  const total = Math.max(...allQuestionCounts(scenario)), count = entries.length;
  $('progress-label').textContent = `${count}問回答済み / 最大${total}問`;
  $('progress').setAttribute('aria-valuemax',total); $('progress').setAttribute('aria-valuenow',count);
  $('progress-fill').style.width = `${count / total * 100}%`;
  backControl.disabled = true;
  $('status').textContent = animate && !rewind && !reduced ? '自動ガイドの案内を準備中です。' : '';
  observer = new IntersectionObserver(items => {
    for (const item of items) if (item.isIntersecting) {
      const step = scenario.steps.find(s => s.id === item.target.dataset.step);
      if (!step) continue;
      once('step_view',step);
      if (step.type === 'offer') once('offer_view',step);
      if (step.type === 'cta') once('cta_view',step);
    }
  },{threshold:0.2});
  for (const node of transcript.children) observer.observe(node);
  let firstReply = null;
  const responseScroll = scenario.conversation?.scrollTo === 'response';
  const follow = node => {
    if (opening || (responseScroll && firstReply)) return;
    if (!cancelScroll) node.scrollIntoView({behavior:reduced ? 'auto' : 'smooth',block:'nearest'});
  };
  let waited = 0, explicitWait = 0;
  const waitBudget = scenario.conversation?.maxWaitMs ?? 600;
  for (const step of path) {
    if (token !== generation) return;
    if (step.type === 'branch') {
      const target = step.cases.find(c => answers[c.question] === c.answer)?.next || step.fallback;
      const marker = `branch:${step.id}:${target}`;
      if (!seen.has(marker)) { seen.add(marker); emit('branch_select',step,{branch_id:step.id,branch_target:target}); }
      continue;
    }
    if (step.type === 'delay') {
      if (animate && !rewind && !reduced && !previousAll.includes(step.id) && explicitWait < 200) {
        const ms = Math.max(0,Math.min(step.ms,200-explicitWait,waitBudget-waited)); explicitWait += ms; waited += ms;
        await new Promise(resolve => setTimeout(resolve,ms));
      }
      continue;
    }
    if (visible.indexOf(step) < common) continue;
    const wait = conversationWait(scenario,waited,{step,instant:step.layout === 'fullbleed' || step.type === 'cta' || !animate || rewind || reduced});
    if (wait) {
      const mediaOnly = ['image','video','offer'].includes(step.type) && !step.title && !step.message && !step.note;
      const typing = mediaOnly ? null : typingIndicator();
      if (typing) { transcript.insertBefore(typing,footer); follow(typing); }
      waited += wait;
      await new Promise(resolve => setTimeout(resolve,wait));
      typing?.remove();
      if (token !== generation) return;
    }
    const node = buildStep(step);
    if (wait) node.classList.add('arriving');
    transcript.insertBefore(node,footer); observer.observe(node);
    if (responseScroll && !opening && !firstReply && !cancelScroll) {
      node.scrollIntoView({behavior:reduced ? 'auto' : 'smooth',block:'start'}); firstReply = node;
    } else follow(node);
    if (opening && step.layout === 'fullbleed') {
      await waitForEntry(node);
      if (token !== generation) return;
      emit('chat_start');
    }
  }
  if (token !== generation) return;
  const terminal = path.at(-1);
  if (terminal.type === 'cta') {
    $('progress-label').textContent = '確認ポイントがまとまりました';
    if (!seen.has('chat_complete')) { seen.add('chat_complete'); emit('chat_complete',terminal); }
    if (scenario.stickyCTA) {
      $('sticky').replaceChildren(ctaLink(terminal)); $('sticky').dataset.step = terminal.id;
      $('sticky').hidden = false; document.body.classList.add('has-sticky'); observer.observe($('sticky'));
    }
  }
  $('status').textContent = terminal.type === 'question' ? plainText(terminal.message) : '確認ポイントがまとまりました。公式ページへ進めます。';
  busy = false; openingActive = false; backControl.disabled = !entries.length; store();
  const destination = transcript.querySelector(`[data-step="${terminal.id}"]`);
  if (scenario.autoStart) {
    backControl.hidden = !entries.length;
    backControl.classList.add('back-control');
    if (entries.length) destination.append(backControl);
  }
  if (!cancelScroll) {
    if (responseScroll && firstReply) firstReply.scrollIntoView({behavior:reduced ? 'auto' : 'smooth',block:'start'});
    else if (!responseScroll) follow(destination);
    if (focus) { const target = destination.querySelector('button,a') || destination; if (target === destination) target.tabIndex = -1; target.focus({preventScroll:true}); }
  }
  $('latest').hidden = !cancelScroll;
}

function allQuestionCounts(s) {
  const map = new Map(s.steps.map(step => [step.id,step])), memo = new Map();
  function count(id) {
    if (memo.has(id)) return memo.get(id);
    const step = map.get(id); let next = [];
    if (step.type === 'question') next = step.options.map(o=>o.next);
    else if (step.type === 'branch') next = [...step.cases.map(c=>c.next),step.fallback];
    else if (step.next) next = [step.next];
    const n = (step.type === 'question' ? 1 : 0) + (next.length ? Math.max(...next.map(count)) : 0); memo.set(id,n); return n;
  }
  return [Math.max(1,count(s.start))];
}
function init() {
  if (!scenario || validateScenario(scenario).errors.length) {
    $('hero').hidden = true; $('error').hidden = false; return;
  }
  document.title = scenario.title;
  document.body.classList.toggle('image-entry',scenario.autoStart === true);
  for (const [key,value] of Object.entries(scenario.theme || {})) document.documentElement.style.setProperty(`--${key}`,value);
  $('brand').textContent = scenario.brand;
  const brandIcon = document.querySelector('.brand-icon');
  if (scenario.avatarImage) brandIcon.replaceChildren(avatar());
  else brandIcon.textContent = scenario.avatar || '案';
  if (scenario.autoStart) {
    new ResizeObserver(()=>document.body.style.setProperty('--sticky-height',`${$('sticky').getBoundingClientRect().height}px`)).observe($('sticky'));
  }
  $('eyebrow').textContent = scenario.hero.eyebrow; $('hero-title').textContent = scenario.hero.title; $('hero-description').textContent = scenario.hero.description;
  $('start-note').textContent = scenario.hero.note; $('start').textContent = scenario.hero.startLabel; $('start').disabled = false; $('demo-note').hidden = !scenario.demo;
  if (['127.0.0.1','localhost','[::1]'].includes(location.hostname) && query.get('debug') === '1') {
    const details = element('details','event-debug'); details.append(element('summary','','開発用イベント確認'));
    const audit = element('pre',''); audit.id = 'event-audit'; details.append(audit); document.querySelector('.shell').append(details);
  }
  load(); emit('lp_view');
  $('start').addEventListener('click',event => { if (started) return; started = true; emit('chat_start'); store(); render({focus:event.detail === 0}); });
  backControl.addEventListener('click',event => {
    if (busy || !entries.length) return;
    entries.pop(); ({answers,entries} = replay(scenario,entries));
    emit('chat_back',route(scenario,answers).at(-1)); render({focus:event.detail === 0,rewind:true});
  });
  $('latest').addEventListener('click',() => { moveTo([...$('transcript').querySelectorAll('[data-step]')].at(-1)); $('latest').hidden = true; });
  for (const event of ['wheel','touchstart']) window.addEventListener(event,() => { if (busy && !openingActive) cancelScroll = true; },{passive:true});
  // User scrolls are never continuously corrected. Only explicit answers initiate a scroll.
  window.addEventListener('pageshow',event => { if (event.persisted) { $('latest').hidden = true; } });
  if (started) { emit('chat_resume'); render({animate:false}); }
  else if (scenario.autoStart) { started = true; render({opening:true}); }
}
try { init(); } catch { $('hero').hidden = true; $('chat').hidden = true; $('error').hidden = false; }

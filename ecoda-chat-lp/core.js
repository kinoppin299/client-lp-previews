// Shared pure functions. No DOM, network, or storage side effects.
import {plainText} from './rich-text.js?build=41215fed5cdf';
export const TYPES = ['message','question','image','image_message','video','explanation','emphasis','offer','cta','end','branch','delay','html'];
export const QUERY_KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id','fbclid','ttclid','gclid','gbraid','wbraid','msclkid','yclid'];
const ID = /^[a-zA-Z0-9_-]{1,64}$/;
export const safeURL = (url, base = 'https://local.invalid/') => {
  try { const u = new URL(url, base); return ['https:','http:'].includes(u.protocol) ? u : null; } catch { return null; }
};
export function collectQuery(search, keys = QUERY_KEYS) {
  const input = new URLSearchParams(search), result = {};
  for (const key of keys) { const value = input.get(key); if (value && value.length <= 512 && !/[\x00-\x1f]/.test(value)) result[key] = value; }
  return result;
}
export function conversionURL(conversion, attribution, base) {
  const url = safeURL(conversion.url, base);
  if (!url) throw new Error('CTA URL must use HTTP(S).');
  if (conversion.inheritQueryParameters) {
    for (const key of [...QUERY_KEYS, ...(conversion.extraQueryKeys || [])]) {
      if (!url.searchParams.has(key) && attribution[key]) url.searchParams.set(key, attribution[key]);
    }
  }
  return url.href;
}
export function edges(step) {
  if (step.type === 'question') return (step.options || []).map(o => o.next);
  if (step.type === 'branch') return [...(step.cases || []).map(c => c.next), step.fallback];
  return step.next ? [step.next] : [];
}
export function route(scenario, answers) {
  const byId = new Map(scenario.steps.map(s => [s.id, s]));
  let id = scenario.start; const path = [], seen = new Set();
  while (id) {
    if (seen.has(id) || !byId.has(id)) throw new Error('Invalid scenario path');
    seen.add(id); const step = byId.get(id); path.push(step);
    if (['cta','end'].includes(step.type)) break;
    if (step.type === 'question') {
      const choice = step.options.find(o => o.id === answers[step.id]);
      if (!choice) break;
      id = choice.next;
    } else if (step.type === 'branch') {
      id = step.cases.find(c => answers[c.question] === c.answer)?.next || step.fallback;
    } else id = step.next;
  }
  return path;
}
// Derive valid progress from answer IDs; never trust stored current-step or branch fields.
export function replay(scenario, entries = []) {
  let answers = {}; const accepted = [];
  for (const entry of entries.slice(0, scenario.steps.length)) {
    const step = route(scenario, answers).at(-1);
    if (step?.type !== 'question' || entry.step_id !== step.id || !step.options.some(o => o.id === entry.answer_id)) break;
    answers[step.id] = entry.answer_id; accepted.push({step_id:step.id,answer_id:entry.answer_id});
  }
  return { answers, entries: accepted };
}
export function validateScenario(s) {
  const errors = [], warnings = [];
  const err = msg => errors.push(msg);
  if (!s || !Array.isArray(s.steps) || !s.steps.length) return {errors:['steps must be a non-empty array'],warnings};
  if (!ID.test(s.id || '') || !/^[a-zA-Z0-9_.-]{1,64}$/.test(s.version || '') || !ID.test(s.variant || '')) err('id/version/variant must be short IDs');
  if (!s.title || !s.hero?.title || !s.hero?.startLabel) err('title and hero title/startLabel required');
  if (!s.conversion?.url || !safeURL(s.conversion.url)) err('CTA URL missing or unsafe');
  if (s.conversation && !(Number.isInteger(s.conversation.typingMs) && s.conversation.typingMs >= 0 && s.conversation.typingMs <= 1800)) err('conversation.typingMs must be 0..1800ms');
  if (s.conversation?.maxWaitMs !== undefined && !(Number.isInteger(s.conversation.maxWaitMs) && s.conversation.maxWaitMs >= 0 && s.conversation.maxWaitMs <= 10000)) err('conversation.maxWaitMs must be 0..10000ms');
  if (s.conversation?.imageAdvanceMs !== undefined && !(Number.isInteger(s.conversation.imageAdvanceMs) && s.conversation.imageAdvanceMs >= 0 && s.conversation.imageAdvanceMs <= 15000)) err('conversation.imageAdvanceMs must be 0..15000ms');
  const reading = s.conversation?.reading;
  if (reading && (!(Number.isFinite(reading.charactersPerSecond) && reading.charactersPerSecond >= 5 && reading.charactersPerSecond <= 60) || !Number.isInteger(reading.minMs) || !Number.isInteger(reading.maxMs) || reading.minMs < 0 || reading.maxMs < reading.minMs || reading.maxMs > 15000)) err('Reading cadence invalid');
  if (s.conversation?.imageReadMs && (typeof s.conversation.imageReadMs !== 'object' || Array.isArray(s.conversation.imageReadMs) || Object.entries(s.conversation.imageReadMs).some(([id,ms])=>!s.steps.some(step=>step.id===id && ['image','image_message','offer'].includes(step.type)) || !Number.isInteger(ms) || ms<0 || ms>15000))) err('Image reading cadence invalid');
  if (s.autoStart && !(s.steps[0]?.id === s.start && s.steps[0]?.type === 'image' && s.steps[0]?.layout === 'fullbleed')) err('autoStart requires a fullbleed image as the first step');
  if (s.avatarImage && !safeURL(s.avatarImage)) err('Avatar URL unsafe');
  if (s.footer && !s.footer.src && !s.footer.notes) err('Footer content required');
  if (s.footer?.src && (!safeURL(s.footer.src) || !s.footer.alt || !(s.footer.width > 0 && s.footer.height > 0))) err('Footer image incomplete/unsafe');
  if (s.footer?.notes && (!Array.isArray(s.footer.notes) || !s.footer.notes.length || !s.footer.notes.every(note=>typeof note==='string' && note.trim()))) err('Footer notes must be non-empty text');
  if (s.footer?.privacyURL && !safeURL(s.footer.privacyURL)) err('Privacy policy URL unsafe');
  if (s.footer?.companyURL && !safeURL(s.footer.companyURL)) err('Company URL unsafe');
  if (s.conversation?.scrollTo && !['latest','response'].includes(s.conversation.scrollTo)) err('conversation.scrollTo must be latest or response');
  if (s.tracking?.stepViews && !['all','funnel'].includes(s.tracking.stepViews)) err('tracking.stepViews must be all or funnel');
  const ids = new Set(), byId = new Map();
  for (const step of s.steps) {
    if (!ID.test(step.id || '')) err('Invalid step ID');
    if (ids.has(step.id)) err(`Duplicate ID: ${step.id}`);
    ids.add(step.id); byId.set(step.id, step);
    if (!TYPES.includes(step.type)) err(`Unknown type: ${step.id}`);
    if (step.offerCard && (step.type!=='offer' || !['badge','condition','regularPrice','discount','lead','price','footnoteLine1','footnoteLine2'].every(key=>typeof step.offerCard[key]==='string' && step.offerCard[key].length<=500))) err(`Offer card text incomplete: ${step.id}`);
    if (!['branch','cta','end','question'].includes(step.type) && !step.next) err(`next missing: ${step.id}`);
    if (step.type === 'question') {
      if (!step.message || !step.options?.length) err(`Question empty: ${step.id}`);
      const choices = new Set();
      for (const o of step.options || []) {
        if (!ID.test(o.id || '') || !o.label || choices.has(o.id)) err(`Invalid/duplicate answer: ${step.id}`);
        choices.add(o.id); if (!o.next) err(`Answer next missing: ${step.id}/${o.id}`);
      }
    }
    if (['message','explanation','emphasis','image_message','end'].includes(step.type) && !step.message || step.type === 'offer' && !step.message && !step.src) err(`message missing: ${step.id}`);
    if (['image','image_message','video'].includes(step.type) || step.type === 'offer' && step.src) {
      if (!step.src || !safeURL(step.src)) err(`Media src missing/unsafe: ${step.id}`);
      if (step.type !== 'video' && !step.alt) err(`Image alt missing: ${step.id}`);
      if (!(step.width > 0 && step.height > 0)) err(`Media dimensions missing: ${step.id}`);
      if (step.crop) {
        const {x,y,width,height} = step.crop;
        if (step.type === 'video' || step.layout || ![x,y,width,height].every(Number.isFinite) || x < 0 || y < 0 || width <= 0 || height <= 0 || x + width > step.width || y + height > step.height) err(`Image crop out of bounds: ${step.id}`);
      }
      if (step.type === 'video' && (!step.captions || !safeURL(step.captions))) err(`Video captions required: ${step.id}`);
    }
    if (step.layout && (step.layout !== 'fullbleed' || step.type !== 'image' || step.id !== s.start)) err(`fullbleed is only valid for the opening image: ${step.id}`);
    if (step.disclosure && (!step.disclosure.label || !step.disclosure.text)) err(`Disclosure incomplete: ${step.id}`);
    if (step.image && (step.type !== 'cta' || !safeURL(step.image.src) || !step.image.alt || !(step.image.width > 0 && step.image.height > 0))) err(`CTA image incomplete/unsafe: ${step.id}`);
    if (step.image?.crop) {
      const {x,y,width,height} = step.image.crop;
      if (![x,y,width,height].every(Number.isFinite) || x < 0 || y < 0 || width <= 0 || height <= 0 || x + width > step.image.width || y + height > step.image.height) err(`CTA image crop out of bounds: ${step.id}`);
    }
    if (step.type === 'delay'  && !(Number.isInteger(step.ms) && step.ms >= 0 && step.ms <= 200)) err(`Delay must be 0..200ms: ${step.id}`);
    if (step.type === 'cta' && (!step.label || step.next)) err(`CTA label required; CTA must be terminal: ${step.id}`);
    if (step.type === 'end' && (step.next || step.label || step.image)) err(`End must have no CTA or next: ${step.id}`);
    if (step.type === 'html' && (!step.html || /<\/?(?!p\b|h[23]\b|strong\b|em\b|ul\b|ol\b|li\b|br\b|span\b)[a-z]|<[^>]+\s+[a-z][\w-]*\s*=/i.test(step.html))) err(`HTML must use allowed text tags without attributes: ${step.id}`);
  }
  if (!ids.has(s.start)) err('start does not exist');
  for (const step of s.steps) {
    for (const next of edges(step)) if (!ids.has(next)) err(`next does not exist: ${step.id} -> ${next}`);
    if (step.type === 'branch') {
      if (!step.fallback || !step.cases?.length) err(`Branch cases/fallback missing: ${step.id}`);
      for (const c of step.cases || []) if (!byId.get(c.question)?.options?.some(o => o.id === c.answer)) err(`Invalid branch condition: ${step.id}`);
    }
  }
  const visited = new Set(), active = new Set();
  function visit(id) {
    if (active.has(id)) { err(`Cycle detected: ${id}`); return; }
    if (visited.has(id) || !byId.has(id)) return;
    active.add(id); visited.add(id); for (const next of edges(byId.get(id))) visit(next); active.delete(id);
  }
  visit(s.start);
  for (const id of ids) if (!visited.has(id)) err(`Unreachable step: ${id}`);
  if (!s.steps.some(step => step.type === 'cta')) err('CTA step required');
  // Eligible paths terminate in a CTA; out-of-scope paths may terminate without a link.
  for (const step of s.steps) if (!edges(step).length && !['cta','end'].includes(step.type)) err(`Dead end: ${step.id}`);
  for (const id of s.tracking?.answerIdsFor || []) if (byId.get(id)?.type !== 'question') err(`Tracking question invalid: ${id}`);
  for (const key of s.conversion?.extraQueryKeys || []) if (!/^[a-z][a-z0-9_]{0,40}$/.test(key) || /name|mail|phone|address|token|password|answer/i.test(key)) err(`Disallowed extra query key: ${key}`);
  for (const [key,value] of Object.entries(s.theme || {})) {
    if (!['primary','background','text','accent'].includes(key) || !/^#[a-f\d]{6}$/i.test(value)) err(`Invalid theme token: ${key}`);
  }
  if (s.conversion?.url?.includes('example.com')) warnings.push('Demo CTA destination: replace before production');
  return {errors:[...new Set(errors)],warnings};
}

// A campaign may opt into a conversational cadence with a bounded response budget.
export function conversationWait(scenario, spent = 0, {instant = false, step = null, previousStep = null, afterImage = false} = {}) {
  if (instant) return 0;
  // The image-reading pause replaces typing delay, independent of its budget.
  if (afterImage) return scenario.conversation?.imageReadMs?.[previousStep?.id] ?? scenario.conversation?.imageAdvanceMs ?? 0;
  const configured = scenario.conversation?.typingMs ?? 200;
  const reading = scenario.conversation?.reading;
  if (reading) {
    // Give time to read the bubble already on screen, rather than timing the upcoming copy.
    // This pause applies to every consecutive bubble and is never exhausted by a burst budget.
    const text = previousStep?.layout !== 'fullbleed' && previousStep ? plainText([previousStep.message,previousStep.title,previousStep.note].filter(Boolean).join('\n')).replace(/\s/g,'') : '';
    return text ? Math.round(Math.min(reading.maxMs,Math.max(reading.minMs,[...text].length / reading.charactersPerSecond * 1000))) : configured;
  }
  const budget = scenario.conversation?.maxWaitMs ?? 600;
  let duration = configured;
  if (configured && scenario.conversation?.maxWaitMs && step) {
    if (step.type === 'cta') return 0;
    if (step.type === 'question') duration *= .65;
    else if (['image','video'].includes(step.type)) duration *= .3;
    else duration += Math.min(700,(step.message || step.title || '').length * 4);
  }
  return Math.max(0,Math.min(Math.round(duration),1800,budget-spent));
}

import {appendRichText,plainText} from './rich-text.js?build=f93669013acd';
export const OFFER_FIELDS=[{"key": "badge", "label": "オファー上部のラベル"}, {"key": "condition", "label": "対象・目的"}, {"key": "regularPrice", "label": "主見出し"}, {"key": "discount", "label": "レポートの内容"}, {"key": "lead", "label": "メイン訴求の前置き"}, {"key": "price", "label": "メイン訴求"}, {"key": "footnoteLine1", "label": "画像内の補足 1行目"}, {"key": "footnoteLine2", "label": "画像内の補足 2行目"}];
const template="<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"800\" height=\"600\" viewBox=\"0 0 800 600\">\n<title>オファー内容</title>\n<defs><linearGradient id=\"gold\" x2=\"0.8\" y2=\"1\"><stop stop-color=\"#fff5c4\"/><stop offset=\".45\" stop-color=\"#ebc563\"/><stop offset=\"1\" stop-color=\"#fff1be\"/></linearGradient><linearGradient id=\"dark\" x2=\"0\" y2=\"1\"><stop stop-color=\"#19372a\"/><stop offset=\"1\" stop-color=\"#0c2218\"/></linearGradient></defs>\n<rect x=\"3\" y=\"3\" width=\"794\" height=\"594\" rx=\"25\" fill=\"url(#dark)\" stroke=\"#d4b368\" stroke-width=\"6\"/>\n<g font-family=\"Hiragino Kaku Gothic ProN,Meiryo,sans-serif\" text-anchor=\"middle\" font-weight=\"700\">\n<rect x=\"152\" y=\"34\" width=\"496\" height=\"56\" rx=\"28\" fill=\"url(#gold)\"/>\n<text x=\"400\" y=\"73\" fill=\"#243124\" font-size=\"29\" data-offer=\"badge\"></text>\n<text x=\"400\" y=\"147\" fill=\"#fff8df\" font-size=\"32\" data-offer=\"condition\"></text>\n<text x=\"400\" y=\"215\" fill=\"#fff\" font-size=\"49\" data-offer=\"regularPrice\"></text>\n\n<text x=\"400\" y=\"280\" fill=\"#f1d683\" font-size=\"52\" data-offer=\"discount\"></text>\n<path d=\"M379 295H421L400 317Z\" fill=\"#d9bd75\"/>\n<text x=\"400\" y=\"365\" fill=\"#fff4c9\" font-size=\"41\" data-offer=\"lead\"></text>\n<text x=\"400\" y=\"460\" fill=\"url(#gold)\" font-size=\"100\" letter-spacing=\"-5\" data-offer=\"price\"></text>\n<path d=\"M52 490H748\" stroke=\"#b99b56\"/>\n<text x=\"400\" y=\"535\" fill=\"#e8eadf\" font-size=\"23\" font-weight=\"400\" data-offer=\"footnoteLine1\"></text>\n<text x=\"400\" y=\"568\" fill=\"#e8eadf\" font-size=\"23\" font-weight=\"400\" data-offer=\"footnoteLine2\"></text>\n</g></svg>\n";
export function renderOfferCard(copy) {
  const svg=new DOMParser().parseFromString(template,'image/svg+xml').documentElement;
  svg.classList.add('editable-offer-card');
  svg.setAttribute('role','img');svg.setAttribute('aria-label',OFFER_FIELDS.map(({key})=>plainText(copy[key])).filter(Boolean).join('。'));
  svg.querySelector('title').textContent=svg.getAttribute('aria-label');
  for (const {key} of OFFER_FIELDS) {
    const node=svg.querySelector(`[data-offer="${key}"]`),value=copy[key] || '';
    const originalSize=Number(node.getAttribute('font-size'));
    const units=[...plainText(value)].reduce((sum,char)=>sum+(/[ -~]/.test(char) ? .57 : 1),0);
    const available=key==='badge'?464:700;
    node.setAttribute('font-size',String(Math.min(originalSize,units?available/units:originalSize)));
    node.replaceChildren();appendRichText(node,value);
  }
  return svg;
}

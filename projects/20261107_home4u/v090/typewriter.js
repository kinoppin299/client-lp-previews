// Split safe rich-text DOM into graphemes while preserving the final layout.
export function prepareTypewriter(line) {
  const walker=document.createTreeWalker(line,NodeFilter.SHOW_TEXT),nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  const segmenter=typeof Intl.Segmenter==='function'?new Intl.Segmenter('ja',{granularity:'grapheme'}):null;
  const glyphs=[];
  for(const node of nodes){
    const fragment=document.createDocumentFragment();
    const letters=segmenter?[...segmenter.segment(node.data)].map(s=>s.segment):Array.from(node.data);
    for(const letter of letters){const span=document.createElement('span');span.className='type-char';span.textContent=letter;fragment.append(span);glyphs.push(span);}
    node.replaceWith(fragment);
  }
  let count=0,visibleText="";
  return {
    length:glyphs.length,
    get count(){return count;},
    get text(){return visibleText;},
    get complete(){return count===glyphs.length;},
    revealOne(){const glyph=glyphs[count++];if(!glyph)return '';glyph.style.visibility='visible';visibleText+=glyph.textContent;return glyph.textContent;},
    finish(){while(count<glyphs.length)this.revealOne();}
  };
}

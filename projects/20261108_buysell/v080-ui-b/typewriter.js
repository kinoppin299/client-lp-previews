import {graphemes} from './playback-compat.js?build=b534b91f2f93';
// Safe rich-text glyphs keep their final positions. Long lines can use in-screen pages.
export function prepareTypewriter(line){
 const walker=document.createTreeWalker(line,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 const glyphs=[];
 for(const node of nodes){const fragment=document.createDocumentFragment();for(const item of graphemes(node.data)){const span=document.createElement('span');span.className='type-char';span.textContent=item;span.setAttribute('aria-hidden','true');fragment.append(span);glyphs.push(span);}node.replaceWith(fragment);}
 let pages=[[0,glyphs.length]],page=0,count=0,visibleText='';
 function paint(){const [start,end]=pages[page];glyphs.forEach((g,i)=>{g.style.display=i<start||i>=end?'none':'';g.style.visibility=i>=start&&i<start+count?'visible':'hidden';});visibleText=glyphs.slice(start,start+count).map(g=>g.textContent).join('');}
 return {
  get length(){return pages[page][1]-pages[page][0];},get fullLength(){return glyphs.length;},get count(){return count;},get absoluteCount(){return pages[page][0]+count;},get text(){return visibleText;},get complete(){return count===this.length;},get allComplete(){return this.complete&&!this.hasNextPage;},get hasNextPage(){return page<pages.length-1;},get pageIndex(){return page;},get pageCount(){return pages.length;},
  paginate(maxLines,{preserve=false}={}){const absolute=pages[page][0]+count,wasComplete=this.complete;glyphs.forEach(g=>{g.style.display='';g.style.visibility='hidden';});line.style.minHeight='0';const top=glyphs.find(g=>g.getBoundingClientRect().height>0)?.getBoundingClientRect().top||0,lh=parseFloat(getComputedStyle(line).lineHeight),groups=[];let start=0,startRow=0;
   for(let i=0;i<glyphs.length;i++){const rect=glyphs[i].getBoundingClientRect();if(!rect.height)continue;const row=Math.max(0,Math.round((rect.top-top)/lh));if(row-startRow>=maxLines){groups.push([start,i]);start=i;startRow=row;}}groups.push([start,glyphs.length]);pages=groups.filter(([a,b])=>b>a);if(!pages.length)pages=[[0,0]];page=preserve?Math.max(0,pages.findIndex(([a,b])=>absolute>=a&&absolute<b)):0;if(preserve&&absolute===glyphs.length)page=pages.length-1;count=preserve?Math.max(0,Math.min(pages[page][1]-pages[page][0],absolute-pages[page][0])):0;
   paint();const needed=pages.map(([a,b])=>{glyphs.forEach((g,i)=>g.style.display=i<a||i>=b?'none':'');return line.getBoundingClientRect().height;});line.style.minHeight=Math.max(...needed,lh)+'px';paint();
  },
  revealOne(){if(this.complete)return'';const glyph=glyphs[pages[page][0]+count++];glyph.style.visibility='visible';visibleText+=glyph.textContent;return glyph.textContent;},
  finish(){while(!this.complete)this.revealOne();},
  nextPage(){if(!this.hasNextPage)return false;page++;count=0;visibleText='';paint();return true;},
  previousPage(){if(page===0)return false;page--;count=pages[page][1]-pages[page][0];paint();return true;}
 };
}

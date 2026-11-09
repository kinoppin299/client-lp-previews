// Small, text-only formatting syntax. Raw HTML is always rendered literally.
export function richTokens(value,depth=0) {
  const text=String(value ?? '');
  if (depth>=8) return [{type:'text',text}];
  const pattern=/\*\*([\s\S]+?)\*\*|\[color=(#[0-9a-fA-F]{6})\]([\s\S]+?)\[\/color\]/g;
  const result=[];let offset=0;
  for (const match of text.matchAll(pattern)) {
    if (match.index>offset) result.push({type:'text',text:text.slice(offset,match.index)});
    result.push(match[1]!==undefined ? {type:'bold',children:richTokens(match[1],depth+1)} : {type:'color',color:match[2],children:richTokens(match[3],depth+1)});
    offset=match.index+match[0].length;
  }
  if (offset<text.length) result.push({type:'text',text:text.slice(offset)});
  return result;
}
export function plainText(value) {
  const flatten=tokens=>tokens.map(token=>token.type==='text'?token.text:flatten(token.children)).join('');
  return flatten(richTokens(value));
}
export function appendRichText(target,value) {
  const svg=target.namespaceURI==='http://www.w3.org/2000/svg';
  function append(parent,tokens) {
    for (const token of tokens) {
      if (token.type==='text') {parent.append(document.createTextNode(token.text));continue;}
      const node=svg ? document.createElementNS('http://www.w3.org/2000/svg','tspan') : document.createElement(token.type==='bold'?'strong':'span');
      if (token.type==='bold' && svg) node.setAttribute('font-weight','800');
      if (token.type==='color') {if(svg)node.setAttribute('fill',token.color);else node.style.color=token.color;}
      append(node,token.children);parent.append(node);
    }
  }
  append(target,richTokens(value));return target;
}
export function formatSelection(value,start,end,kind,color='#c6233b') {
  if (start===end) return null;
  let selected=value.slice(start,end);
  if (kind==='bold') selected=selected.startsWith('**')&&selected.endsWith('**') ? selected.slice(2,-2) : `**${selected}**`;
  else if (kind==='color') {
    if (!/^#[0-9a-fA-F]{6}$/.test(color)) return null;
    selected=selected.replace(/^\[color=#[0-9a-fA-F]{6}\]([\s\S]*)\[\/color\]$/,'$1');
    selected=`[color=${color}]${selected}[/color]`;
  } else if (kind==='clear') selected=plainText(selected);
  else return null;
  return {value:value.slice(0,start)+selected+value.slice(end),start,end:start+selected.length};
}

// Articulate the approved full-body pixels; no replacement characters or video files.
const W=224,H=380,PI=Math.PI;
const configs={a:{left:{shoulder:[76,158],elbow:[56,209],upper:[[78,147],[65,150],[56,168],[48,190],[44,210],[68,215],[72,192],[75,174]],lower:[[44,201],[70,207],[63,232],[59,241],[59,253],[57,263],[48,271],[39,268],[31,257],[33,244],[38,234],[37,222]]},right:{shoulder:[150,158],elbow:[171,209],upper:[[146,147],[160,150],[171,168],[181,190],[184,210],[160,215],[155,192],[150,174]],lower:[[160,207],[185,201],[191,224],[190,236],[197,248],[197,259],[189,270],[179,272],[171,262],[168,249],[170,239],[165,226]]}},b:{left:{shoulder:[77,151],elbow:[57,207],upper:[[80,140],[67,143],[59,160],[51,183],[45,208],[70,214],[75,191],[76,169]],lower:[[46,200],[72,207],[67,228],[63,238],[66,248],[63,259],[56,268],[48,268],[40,258],[39,247],[42,236],[40,223]]},right:{shoulder:[148,151],elbow:[166,207],upper:[[144,140],[156,143],[166,160],[175,183],[181,208],[156,214],[152,191],[148,169]],lower:[[155,207],[181,200],[186,223],[184,236],[188,247],[185,258],[177,268],[169,268],[162,259],[161,248],[161,238],[158,228]]}}};
function canvas(){const c=document.createElement('canvas');c.width=W;c.height=H;return c;}
function path(ctx,poly){ctx.beginPath();poly.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();}
function layer(image,poly){const c=canvas(),x=c.getContext('2d');path(x,poly);x.clip();x.drawImage(image,0,0,W,H);return c;}
export function prepareRig(image,role){const cfg=configs[role],body=canvas(),x=body.getContext('2d');x.drawImage(image,0,0,W,H);const arms={};for(const side of ['left','right']){const a=cfg[side];arms[side]={...a,upperLayer:layer(image,a.upper),lowerLayer:layer(image,a.lower)};x.save();x.globalCompositeOperation='destination-out';for(const poly of [a.upper,a.lower]){path(x,poly);x.fill();}x.restore();}x.save();x.globalCompositeOperation='destination-in';const torso=role==='a'?[[73,142],[72,172],[70,199],[64,223],[59,250],[67,280],[0,280],[0,380],[224,380],[224,280],[160,280],[169,250],[163,223],[156,199],[152,172],[151,142]]:[[78,139],[75,170],[74,195],[69,220],[65,250],[71,280],[0,280],[0,380],[224,380],[224,280],[157,280],[163,250],[159,220],[154,195],[150,170],[146,139]];path(x,torso);x.fill();x.restore();x.clearRect(0,0,W,148);const head=layer(image,[[0,0],[W,0],[W,154],[0,154]]);return{image,body,head,arms};}
const ease=t=>(1-Math.cos(Math.max(0,Math.min(1,t))*PI))/2;
export function actingPose(kind,t){const enter=ease(t/.18),exit=1-ease((t-.82)/.18),amount=enter*exit,beat=Math.sin(Math.max(0,t-.18)/.64*PI*4)*amount;let l=[0,0],r=[0,0],head=0,dy=0;
 switch(kind){
 case'offer':r=[13,-88+beat*7];head=-1.5;break;
 case'explain':l=[-10,92+beat*9];r=[5,-22+beat*4];head=1.2*Math.sin(t*PI*2);break;
 case'present':l=[-8,106+beat*6];head=-1.3;break;
 case'count':l=[-17,122+beat*7];r=[5,-24];head=1.5*Math.sin(t*PI*2);break;
 case'invite':l=[-8,88+beat*5];r=[8,-88-beat*5];head=-1;break;
 case'question':r=[12,-112+beat*4];head=-3.5;break;
 case'ponder':r=[38,-170];head=-4.5;dy=1;break;
 case'surprise':l=[-34,160];r=[34,-160];head=1.5;dy=-3;break;
 case'stop':l=[-18,138+beat*10];r=[18,-138-beat*10];head=-2;dy=-1;break;
 case'reassure':l=[-6,73+beat*5];head=2*Math.sin(t*PI*2);dy=1.5*Math.sin(t*PI)**2;break;
 case'relief':r=[34,-157];head=2.3*Math.sin(t*PI*2);dy=3*Math.sin(t*PI)**2;break;
 case'resolve':r=[28,-146];head=3*Math.sin(t*PI*3);dy=2*Math.sin(t*PI)**2;break;
 case'laugh':l=[-26,148];head=2.3;dy=-Math.sin(t*PI*4);break;
 case'nod':head=3.5*Math.sin(t*PI*3);dy=4*Math.sin(t*PI*2)**2;break;
 case'listen':head=2.7*Math.sin(t*PI*2);dy=2.8*Math.sin(t*PI)**2;break;
 }
 return{left:l.map(v=>v*amount),right:r.map(v=>v*amount),head:head*amount,headY:dy*amount,amount};
}
function rotate(ctx,pivot,degrees){ctx.translate(...pivot);ctx.rotate(degrees*PI/180);ctx.translate(-pivot[0],-pivot[1]);}
function arm(ctx,a,angles){const[u,f]=angles;ctx.save();rotate(ctx,a.shoulder,u);ctx.drawImage(a.upperLayer,0,0);ctx.save();rotate(ctx,a.elbow,f);ctx.drawImage(a.lowerLayer,0,0);ctx.restore();ctx.restore();}
export function drawRig(ctx,rig,kind,t){ctx.clearRect(0,0,288,H);ctx.save();ctx.translate(32,0);const p=actingPose(kind,t);if(p.amount<.0001){ctx.drawImage(rig.image,0,0,W,H);}else{arm(ctx,rig.arms.left,p.left);arm(ctx,rig.arms.right,p.right);ctx.drawImage(rig.body,0,0);ctx.save();ctx.translate(0,p.headY);rotate(ctx,[112,145],p.head);ctx.drawImage(rig.head,0,0);ctx.restore();}ctx.restore();return p;}

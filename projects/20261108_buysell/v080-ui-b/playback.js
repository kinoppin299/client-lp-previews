// Reading time starts after the last glyph. Short replies should not inherit long pauses.
export function readingHold(settings,step,length,{scale=1,previousVisual=null}={}){
  if(Number.isFinite(step.autoHoldMs))return step.autoHoldMs*scale;
  const minimum=settings.minimumHoldMs??1800,maximum=settings.maximumHoldMs??9000;
  const freshDiagram=['shares','expenses','tax','net'].includes(step.visual)&&step.visual!==previousVisual&&!step.costStage;
  const extra=freshDiagram?(settings.newDiagramBonusMs??1500):0;
  const duration=(settings.holdBaseMs??1000)+length*(settings.holdMsPerCharacter??100)+extra;
  return Math.max(minimum,Math.min(maximum,duration))*scale;
}

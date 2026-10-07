// Change this file to create a campaign. All wording is fictional demonstration content.
const a = {
  id: 'energy-demo', version: '1.1.0', variant: 'a', title: '電気代の見直しガイド',
  brand: 'くらしの電気ガイド', avatar: '電', demo: true,
  hero: { eyebrow: '電気代、気になっていませんか？', title: 'その電気代、\n見直すならどこから？', description: '3つの質問で、わが家に合う\n見直しのポイントをチェック。', startLabel: '見直しポイントをチェック', note: '選ぶだけ・入力不要' },
  theme: {primary:'#125C4D',background:'#F0F4F3',text:'#162E29',accent:'#DDF37B'},
  resume: true, stickyCTA: true, conversation: {typingMs:200},
  conversion: {url:'https://example.com/client-lp/?offer=energy-guide',inheritQueryParameters:true,extraQueryKeys:[]},
  tracking: {answerIdsFor:['q1','q2','q3']},
  start: 'welcome',
  steps: [
    {id:'welcome',type:'message',message:'こんにちは。まずは、最近の電気代について教えてください。',next:'q1'},
    {id:'q1',type:'question',message:'最近の電気代、どう感じますか？',hint:'一番近いものを1つ選んでください',options:[
      {id:'high',label:'高くなったと感じる',next:'q2'},
      {id:'concern',label:'今のうちに見直したい',next:'q2'},
      {id:'unknown',label:'適正かどうか分からない',next:'q2'}]},
    {id:'q2',type:'question',message:'見直すとき、何が一番気になりますか？',options:[
      {id:'price',label:'どのくらい費用がかかる？',next:'concern_branch'},
      {id:'fit',label:'わが家にも合っている？',next:'concern_branch'},
      {id:'process',label:'どんな手続きが必要？',next:'concern_branch'}]},
    {id:'concern_branch',type:'branch',cases:[{question:'q2',answer:'price',next:'price_message'},{question:'q2',answer:'fit',next:'fit_message'}],fallback:'process_message'},
    {id:'price_message',type:'emphasis',title:'月々の金額だけで決めない。',message:'初期費用や契約条件も合わせて確認すると、納得して比較できます。',next:'service'},
    {id:'fit_message',type:'emphasis',title:'暮らしに合う選び方から。',message:'電気を使う時間帯や住まいの条件によって、確認したいポイントは変わります。',next:'service'},
    {id:'process_message',type:'emphasis',title:'手続きの流れを先にチェック。',message:'必要な準備と申込みの流れを把握してから、検討を進めましょう。',next:'service'},
    {id:'service',type:'image_message',src:'./campaigns/demo/assets/checkpoints.svg',alt:'料金、住まい、手続きの3つの比較ポイント',width:640,height:280,title:'比較するのは、この3つ。',message:'公式ページで料金・対象条件・手続きの流れをまとめて確認できます。',next:'q3'},
    {id:'q3',type:'question',message:'次に、どこから確認したいですか？',options:[
      {id:'conditions',label:'料金や対象条件を確認したい',next:'offer'},
      {id:'details',label:'まずはサービスを詳しく知りたい',next:'offer'}]},
    {id:'offer',type:'offer',title:'条件を見てから、検討できます。',message:'次の公式ページで、サービス内容と申込み条件をご確認ください。ここで申込みは完了しません。',note:'この画面は架空サービスのデモです。価格・特典・削減額を保証するものではありません。',next:'final_cta'},
    {id:'final_cta',type:'cta',title:'わが家に合うか、もう一歩。',message:'サービス内容・料金・対象条件を確認する',label:'公式ページで見直し方法を見る',note:'外部ページへ移動します'}
  ]
};
const b = structuredClone(a);
b.variant = 'b';
b.hero.title = '電気代の見直し、\nまずは3問から。';
b.hero.startLabel = '3問で見直しポイントを知る';
export default {a,b};

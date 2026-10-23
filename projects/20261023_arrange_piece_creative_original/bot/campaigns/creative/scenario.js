const message=(id,text,next)=>({id,type:'message',message:text,next});
export default {a:{
 id:'creative-chat',version:'1.1.1',variant:'a',title:'動画制作のご相談｜株式会社アレンジピース',brand:'アレンジピース 制作ガイド',avatar:'ap',autoStart:true,
 hero:{title:'制作の希望を、4つの質問から。',startLabel:'制作の相談をはじめる',description:'気になることから、制作の希望を整理します。',note:'選択のあとに、お名前とメールアドレスを入力できます。'},
 theme:{primary:'#31594b',background:'#e9ede4',text:'#171a18',accent:'#d4f86b'},resume:false,stickyCTA:true,
 conversation:{typingMs:300,maxWaitMs:1800,scrollTo:'latest',imageAdvanceMs:1500},conversion:{url:'../contact.html',inheritQueryParameters:true,extraQueryKeys:[]},tracking:{answerIdsFor:[],branchDetails:false,stepViews:'funnel'},start:'fv',
 steps:[
 {id:'fv',type:'image',layout:'fullbleed',src:'./campaigns/creative/assets/fv.svg',width:720,height:420,alt:'TikTok広告 プラチナ代理店 アレンジピース。制作のご相談を、4つの質問から。',next:'welcome'},
 message('welcome','制作の課題や希望をお聞きして、相談内容を整理します。\nまずは、いちばん近いものを選んでください。','q1'),
 {id:'q1',type:'question',message:'動画広告で、いま困っていることは？',hint:'4つの質問のあとに、お問い合わせ内容を入力できます。',options:[{id:'volume',label:'成果が伸びず、次の一手を探している',next:'r_volume'},{id:'actor',label:'制作が追いつかず、テストが止まる',next:'r_actor'},{id:'hook',label:'冒頭の切り口を増やしたい',next:'r_hook'},{id:'first',label:'まずは内容を相談したい',next:'r_first'}]},
 message('r_volume','商材LPや既存広告、共有いただく顧客情報から、誰のどんな悩みに入るかを整理します。キャッチと冒頭シーンを複数用意し、次に試す切り口を動画にします。','q2'),
 message('r_actor','企画・台本から演者の撮影・編集まで対応します。基本は30代〜50代前半の男性演者で、必要な本編と冒頭違いをまとめて制作。女性演者はモデル手配を含め、納期を別途ご案内します。','q2'),
 message('r_hook','届けたい相手が反応する悩みや欲求から、冒頭の言葉とシーンを考えます。同じ本編につながる複数の入口を用意し、配信で比較できる完成動画にします。','q2'),
 message('r_first','企画や本数が決まっていなくてもご相談いただけます。案件LPや参考広告をもとに、必要な制作範囲から一緒に整理します。','q2'),
 {id:'q2',type:'question',message:'どのような商材・サービスですか？',options:[{id:'career',label:'転職・人材・仕事関連',next:'r_career'},{id:'home',label:'住まい・暮らし関連',next:'r_home'},{id:'beauty',label:'美容・健康関連',next:'r_beauty'},{id:'commerce',label:'通販・EC商品',next:'r_commerce'},{id:'other',label:'その他・まだ未定',next:'r_other'}]},
 message('r_career','どのような人に、何を伝えて問い合わせにつなげたいか。案件LPと現在の訴求を確認し、一人語り型の広告へ落とし込みます。','q3'),
 message('r_home','費用や利用条件、相談することで得られることを整理します。案件LPや既存の獲得広告があれば、制作の参考としてお送りいただけます。','q3'),
 message('r_beauty','商材のLPと使用可能な表現、必須注釈をもとに構成します。参考CRがあれば、訴求や見せ方も確認できます。','q3'),
 message('r_commerce','商品の見せ方と、一人語りで伝える便益を整理します。商品画像や使用シーンなど、使える素材の範囲を確認してご提案します。','q3'),
 message('r_other','フォームの相談内容に、商材や検討状況をわかる範囲でご記入ください。一人語り型との相性も含めて、制作可否をご案内します。','q3'),
 {id:'q3',type:'question',message:'ご希望の制作プランはありますか？',hint:'企画・撮影・編集・修正2回までを含む制作料金です。広告運用・広告費は別途。制作費は全額前払いです。',options:[{id:'trial',label:'4本プラン・計4本／49,800円（税別）',next:'r_trial'},{id:'standard',label:'基本セット・計11本／98,000円（税別）',next:'r_standard'},{id:'consult',label:'量産・継続制作から相談したい',next:'r_consult'}]},
 message('r_trial','本編単体1本と、冒頭違いを付けた完成動画3本を納品するプランです。同じ本編に異なる冒頭を組み合わせ、計4本すべて完成動画でお届けします。','q4'),
 message('r_standard','本編単体1本と、冒頭違いを付けた完成動画10本を納品するプランです。同じ本編を使い、計11本で複数の入口を比較できます。','q4'),
 message('r_consult','必要な本編の数と、各本編の冒頭パターン数を整理してお見積りします。継続供給や、配信結果を見ながらの追加制作もご相談ください。','q4'),
 {id:'q4',type:'question',message:'いつごろの制作を考えていますか？',options:[{id:'soon',label:'できるだけ早く制作を進めたい',next:'r_soon'},{id:'month',label:'1か月以内を目安に検討したい',next:'r_month'},{id:'undecided',label:'時期も含めて相談したい',next:'r_undecided'}]},
 message('r_soon','通常の男性演者による制作は、台本確定後2営業日で初稿、最短3営業日〜で納品します。確認・修正内容や出演条件などにより変動しますので、ご希望日をフォームにご記入ください。','offer'),
 message('r_month','ご希望の時期に向けて、台本・人物表現・必要素材をすり合わせます。案件LPがあれば、フォームにURLを添えていただけます。','offer'),
 message('r_undecided','時期が未定でも大丈夫です。現在の状況に合わせて、制作範囲と進め方をご案内します。','offer'),
 {id:'offer',type:'offer',message:'**制作の希望がまとまりました。**\n次の画面には、いま選んだ内容を引き継ぎます。会社名・お名前・メールアドレスを入力して、相談内容をご確認ください。',next:'review_support'},
 message('review_support','**初回の広告審査対応も、料金に含みます。**\n通常修正2回とは別に、初回納品から30日以内の初回審査差し戻しには、本編再撮影1回と対象動画の再書き出しまで対応します。当初合意した商材・媒体・企画の範囲が対象です。当社の制作ミスはこの枠と別に訂正します。審査通過を保証するものではありません。','final_cta'),
 {id:'final_cta',type:'cta',message:'案件LPや参考広告のURLは、わかる範囲で添えていただけます。制作費は全額前払い・修正2回まで。完成MP4またはMOVを納品し、広告での利用期間に制限はありません。',label:'回答を引き継いで、連絡先を入力する',note:'制作プレビューのため、フォームの入力・確認までお試しいただけます。送信は行われません。'}
 ]
}};

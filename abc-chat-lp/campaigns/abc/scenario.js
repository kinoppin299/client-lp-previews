// Copy supplied in abc-scenario-edited(3).js; compact guide header and generated CTA.
export default {
  "a": {
    "id": "abc-chat",
    "version": "0.15.0",
    "variant": "a",
    "title": "ABCクリニック｜悩みとクーポンのご案内",
    "brand": "アソコのお悩みガイド",
    "avatar": "A",
    "avatarImage": "./campaigns/abc/assets/guide.jpg",
    "autoStart": true,
    "hero": {
      "eyebrow": "人に聞きにくい悩みを、選ぶだけで",
      "title": "気になる疑問を、3問で確認。",
      "description": "悩みに合わせて、知りたいことから。",
      "startLabel": "気になることを確認する",
      "note": "個人情報の入力はありません"
    },
    "theme": {
      "primary": "#16743F",
      "background": "#8FAED4",
      "text": "#192B23",
      "accent": "#EED68A"
    },
    "resume": false,
    "stickyCTA": true,
    "conversation": {
      "typingMs": 1000,
      "maxWaitMs": 8000,
      "scrollTo": "response"
    },
    "conversion": {
      "url": "https://s8affi.net/link.php?i=pidb1iykk8h4&m=midb1m7wfqj5",
      "inheritQueryParameters": true,
      "extraQueryKeys": []
    },
    "tracking": {
      "answerIdsFor": [],
      "branchDetails": false,
      "stepViews": "funnel"
    },
    "start": "fv",
    "steps": [
      {
        "id": "fv",
        "type": "image",
        "layout": "fullbleed",
        "src": "./campaigns/abc/assets/wine-fv-cropped.jpg",
        "width": 1024,
        "height": 1084,
        "alt": "ABCクリニック美容外科。LINE登録と簡単なアンケート回答で治療クーポン。参照LPの実質無料キャンペーン画像。",
        "next": "welcome",
        "adLabel": "PR：ABCクリニック"
      },
      {
        "id": "welcome",
        "type": "message",
        "message": "**おめでとうございます！**\nあなたのアソコをお得に[color=#c6233b]**アップグレード**[/color]する大チャンスです！",
        "next": "welcome_coupon"
      },
      {
        "id": "welcome_coupon",
        "type": "message",
        "message": "LINE登録して簡単アンケートに答えると、もれなく治療に使える[color=#2457b7]**クーポン**[/color]が発行されます！",
        "next": "clinic_intro"
      },
      {
        "id": "clinic_intro",
        "type": "image",
        "src": "./campaigns/abc/assets/clinic-intro.png",
        "width": 938,
        "height": 268,
        "alt": "ABCクリニック美容外科。施術時間は最短30分、2段階麻酔で痛みはほぼ0、治療実績178,205件（2009年7月〜2025年12月）。",
        "next": "q1"
      },
      {
        "id": "q1",
        "type": "question",
        "message": "まず、アソコのどの部分が気になっていますか？",
        "hint": "いちばん近いものを1つタップ",
        "options": [
          {
            "id": "a",
            "label": "包茎/仮性包茎",
            "next": "reply_1a"
          },
          {
            "id": "b",
            "label": "長さ",
            "next": "reply_1b"
          },
          {
            "id": "c",
            "label": "太さ",
            "next": "reply_1c"
          },
          {
            "id": "d",
            "label": "早漏気味",
            "next": "reply_1d"
          }
        ]
      },
      {
        "id": "reply_1a",
        "type": "message",
        "message": "包茎治療は日本では1日約400人が受けているぐらい、身近な治療になりつつあります。\n\nたとえば仮性包茎の場合、必ず切開が必要というわけではないんです。\n施術最短30分、痛みほぼなしの「切らない包茎治療」という選択肢もありますよ。",
        "next": "clinic_points"
      },
      {
        "id": "reply_1b",
        "type": "message",
        "message": "ABCには、身体に埋もれた部分を引き出して、見た目を長くする「切らない長茎術」もあるんです。\n施術は最短30分、痛みもほぼないってすごいですよね。",
        "next": "clinic_points"
      },
      {
        "id": "reply_1c",
        "type": "message",
        "message": "ABCではヒアルロン酸を注入する増大治療を案内しています。\n注射というと怖いかもしれませんが、二段階麻酔を行っているので、痛みがほぼないのが特徴なんです。",
        "next": "clinic_points"
      },
      {
        "id": "reply_1d",
        "type": "message",
        "message": "大丈夫！「何分だから早漏」と、時間だけで決めるものではありません。\nタイミングを調整しにくいか、どのくらい困っているかも、気軽に相談できますよ！",
        "next": "clinic_points"
      },
      {
        "id": "clinic_points",
        "type": "image",
        "src": "./campaigns/abc/assets/wine-points.webp",
        "width": 1024,
        "height": 1536,
        "crop": {
          "x": 0,
          "y": 0,
          "width": 1024,
          "height": 960
        },
        "alt": "ABCが選ばれるポイント。追加請求一切なし、最短30分の即日治療、治療実績17万件以上、包茎治療とセットでブツブツ除去無料、徒歩5分のアクセス、24時間メール相談。",
        "next": "q2"
      },
      {
        "id": "q2",
        "type": "question",
        "message": "不安に思うことはありますか？",
        "hint": "気になる疑問を1つ選んでください",
        "options": [
          {
            "id": "a",
            "label": "あとから高くならない？",
            "next": "cost_branch"
          },
          {
            "id": "b",
            "label": "相談だけでもいい？",
            "next": "consult_1"
          },
          {
            "id": "c",
            "label": "痛みや治療後が心配",
            "next": "pain_branch"
          },
          {
            "id": "e",
            "label": "周りに知られたくない",
            "next": "privacy_1"
          }
        ]
      },
      {
        "id": "cost_branch",
        "type": "branch",
        "cases": [
          {
            "question": "q1",
            "answer": "a",
            "next": "cost_a"
          }
        ],
        "fallback": "cost_other"
      },
      {
        "id": "cost_a",
        "type": "message",
        "message": "ABCでは、**施術料金以外の追加料金はかかりません。**",
        "next": "cost_total"
      },
      {
        "id": "cost_other",
        "type": "message",
        "message": "ABCでは、**施術料金以外の追加料金はかかりません。**",
        "next": "cost_total"
      },
      {
        "id": "cost_total",
        "type": "message",
        "message": "麻酔代、術後の薬代、縫合糸代、アフターケア代などがすべて**提示された治療費に含まれている**のでご安心ください。",
        "next": "fees_image"
      },
      {
        "id": "fees_image",
        "type": "image",
        "src": "./campaigns/abc/assets/wine-fees.webp",
        "width": 1024,
        "height": 1024,
        "alt": "手術料金以外の追加費用もかかりません。麻酔料金・縫合糸料金・アフターケア料金・お薬料金0円。",
        "next": "q3"
      },
      {
        "id": "consult_1",
        "type": "message",
        "message": "はい。ABCは、カウンセリングだけで悩みが解消することも大切にしています。\n治療前のカウンセリングは[color=#2457b7]**無料**[/color]です。\n公式LINEでも細かい内容の確認ができます！",
        "next": "consult_2"
      },
      {
        "id": "consult_2",
        "type": "message",
        "message": "「治療するかは、説明を聞いてから考えたい」と伝えても大丈夫です。\nまずは話を聞いて、自分に合う選択肢を知るところから始められます。",
        "next": "q3"
      },
      {
        "id": "pain_branch",
        "type": "branch",
        "cases": [
          {
            "question": "q1",
            "answer": "a",
            "next": "pain_a_1"
          },
          {
            "question": "q1",
            "answer": "b",
            "next": "pain_b_1"
          },
          {
            "question": "q1",
            "answer": "c",
            "next": "pain_c_1"
          }
        ],
        "fallback": "pain_d_1"
      },
      {
        "id": "pain_a_1",
        "type": "message",
        "message": "痛みは気になるところですよね。\nABCの包茎治療では、先に皮膚へ麻酔をしてから注射する、二段階麻酔を行っているので[color=#2457b7]**痛みはほぼありません**[/color]。",
        "next": "pain_a_2"
      },
      {
        "id": "pain_a_2",
        "type": "message",
        "message": "治療後の通院も基本的には不要です。\n術後のお薬や過ごし方についても、治療前に説明してもらえますよ。",
        "next": "q3"
      },
      {
        "id": "pain_b_1",
        "type": "message",
        "message": "痛みは気になるところですよね。\nでも、ABCクリニックは徹底した減痛治療を追求しているので[color=#2457b7]**痛みはほぼありません**[/color]。",
        "next": "pain_b_2"
      },
      {
        "id": "pain_b_2",
        "type": "message",
        "message": "長茎術には切る方法・切らない方法があります。\n希望に合う方法を、カウンセリングで相談できます。",
        "next": "q3"
      },
      {
        "id": "pain_c_1",
        "type": "message",
        "message": "痛みは気になるところですよね。\nABCでは、先に皮膚へ麻酔をしてから注射する、二段階麻酔を行っているので[color=#2457b7]**痛みはほぼありません**[/color]。",
        "next": "pain_c_2"
      },
      {
        "id": "pain_c_2",
        "type": "message",
        "message": "どの部分を、どのくらい変えたいか。\n希望を伝えながら、使う量や方法を相談できます。",
        "next": "q3"
      },
      {
        "id": "pain_d_1",
        "type": "message",
        "message": "痛みは気になるところですよね。\nABCでは、先に皮膚へ麻酔をしてから注射する、二段階麻酔を行っているので[color=#2457b7]**痛みはほぼありません**[/color]。",
        "next": "pain_d_2"
      },
      {
        "id": "pain_d_2",
        "type": "message",
        "message": "困っていることを医師に伝えて、自分に合う方法から検討できますよ！",
        "next": "q3"
      },
      {
        "id": "privacy_1",
        "type": "message",
        "message": "**誰にもバレずに治療したい方にはABCクリニックはピッタリです。**\n\n泌尿器科医だけでなく、形成外科専門医の資格を持つ医師が在籍・監修を行っているので、丁寧な縫合や、目立ちにくい独自の手術法（全周埋没縫合や特殊な吸収糸など）を取り入れています。",
        "next": "privacy_2"
      },
      {
        "id": "privacy_2",
        "type": "message",
        "message": "また、スタッフは全員男性ですのでご安心ください。",
        "next": "q3"
      },
      {
        "id": "q3",
        "type": "question",
        "message": "治療に使えるお得な**クーポン**を受け取ってみませんか？",
        "options": [
          {
            "id": "yes",
            "label": "**はい**",
            "next": "offer_intro"
          },
          {
            "id": "details",
            "label": "詳細を知りたい",
            "next": "offer_details"
          }
        ]
      },
      {
        "id": "offer_details",
        "type": "message",
        "message": "いまABCでは**「よくばりキャンペーン」**を開催中！\n2つの治療を同時に受けると[color=#2457b7]**10万円OFF**[/color]。\n3つの治療を同時に受けると[color=#c6233b]**15万円OFF**[/color]という、超お得なクーポンなんです。",
        "next": "offer"
      },
      {
        "id": "offer_intro",
        "type": "message",
        "message": "ご回答ありがとうございました！\nぜひLINE友だち追加して、治療に使えるクーポンをGETしてみてください！",
        "next": "offer"
      },
      {
        "id": "offer",
        "type": "offer",
        "title": "",
        "next": "coupon",
        "src": "./campaigns/abc/assets/yokubari-campaign-v1.png",
        "width": 1254,
        "height": 1254,
        "alt": "よくばりキャンペーン。クーポンのご利用で対象の治療が実質無料。2つの治療で10万円OFF。3つの治療で15万円OFF。"
      },
      {
        "id": "coupon",
        "type": "message",
        "message": "LINE登録後、簡単なアンケートに答えればもれなくもらえますよ！",
        "next": "close"
      },
      {
        "id": "close",
        "type": "message",
        "message": "まずは、クーポンの内容を見てから考えてみませんか？",
        "next": "final_cta"
      },
      {
        "id": "final_cta",
        "type": "cta",
        "title": "**今すぐお得なクーポンを受け取ってみてください！**",
        "message": "LINE追加後の簡単なアンケートに回答すると、クーポンを受け取れます。",
        "label": "LINEでお得なクーポンを受け取る",
        "disclosure": {
          "label": "ほかに気になることを見る",
          "text": "【相談だけを希望したいとき】\n予約するときに「今回は相談だけを希望しています」と先に伝える方法があります。\n\n【仕事は休む必要がある？】\n治療方法によって変わります。普段の動きに合わせて医師へ確認してください。\n\n【LINEの通知が気になる】\n通知OFFやプレビューの設定を確認してください。"
        },
        "image": {
          "src": "./campaigns/abc/assets/coupon-cta-v1.png",
          "width": 2172,
          "height": 724,
          "crop": {"x": 0, "y": 74, "width": 2172, "height": 560},
          "alt": "LINEでお得なクーポンを受け取る"
        }
      }
    ],
    "footer": {
      "privacyURL": "https://www.abcclinicad.com/privacy.php",
      "src": "./campaigns/abc/assets/footer-notes.svg",
      "width": 720,
      "height": 488,
      "alt": "※自由診療のクリニックです。\n※個人差がありますので、症状によっては、治療ができない場合があります。\n※LINE登録後、アンケート回答でクーポンを受け取れます。\n※2つの治療をすると10万円割引\n※3つの治療をすると15万円割引\n※定着タイプのみ、最低2本以上\n※診察費無料は治療を受けていただいた方限定の特典です\n※他キャンペーンとの併用不可\n※ABC式Sカット、切らない包茎治療の場合\n※切らない長茎術の場合　※名古屋院は除く\n※包茎・増大・長茎・早漏限定\n※初診の方限定\n※2009年7月〜2025年12月"
    }
  }
};

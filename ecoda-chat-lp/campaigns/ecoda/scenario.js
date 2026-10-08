export default {
  "a": {
    "id": "ecoda-chat",
    "version": "2.2.9",
    "variant": "a",
    "title": "東京都の戸建て向け｜無料の個別補助金レポート",
    "brand": "東京都の補助金レポートガイド",
    "avatar": "家",
    "autoStart": true,
    "hero": {
      "title": "高いから無理、と決める前に。",
      "startLabel": "無料レポートについて確認する",
      "description": "東京都の戸建て向け・自宅の補助金を知るためのガイド",
      "note": "このチャットで個人情報は入力しません"
    },
    "theme": {
      "primary": "#145D49",
      "background": "#A5BDD3",
      "text": "#192B23",
      "accent": "#EED68A"
    },
    "resume": false,
    "stickyCTA": true,
    "conversation": {
      "typingMs": 1200,
      "maxWaitMs": 5000,
      "scrollTo": "response",
      "imageAdvanceMs": 6000,
      "reading": {
        "charactersPerSecond": 18,
        "minMs": 2500,
        "maxMs": 6500
      },
      "imageReadMs": {
        "report": 10000,
        "electricity_example": 8000,
        "offer": 6000
      }
    },
    "conversion": {
      "url": "https://adco.jp/link.php?i=pihtirej77nk&m=mihsnkonq7t7",
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
        "src": "./campaigns/ecoda/assets/fv-original.webp",
        "width": 1024,
        "height": 1536,
        "alt": "PR 東京都の戸建てにお住まいの方へ 太陽光・蓄電池 あなたの家なら 補助金いくら？ 大雨・台風・突然の停電。 いざという時の備えも、 まずは自宅で確認。 AI補助金レポート 無料 いきなり現地見積もりではなく、 まずはWEBで確認できます。",
        "next": "welcome"
      },
      {
        "id": "welcome",
        "type": "message",
        "message": "**「高そう」で終わらせる前に、\n自宅なら補助金がいくら使えそうか、知ってみませんか？**\n\nまず、今の予想で選んでみてください。",
        "next": "q1"
      },
      {
        "id": "q1",
        "type": "question",
        "message": "ご自宅なら、補助金はいくらくらい出ると思いますか？",
        "options": [
          {
            "id": "under50",
            "label": "50万円未満",
            "next": "guess_low"
          },
          {
            "id": "under100",
            "label": "50万〜100万円未満",
            "next": "guess_low"
          },
          {
            "id": "over100",
            "label": "100万円以上",
            "next": "guess_high"
          },
          {
            "id": "unknown",
            "label": "見当がつかない",
            "next": "guess_unknown"
          }
        ],
        "hint": "今の予想で大丈夫です。この回答から補助金額を計算するものではありません。"
      },
      {
        "id": "guess_low",
        "type": "message",
        "message": "数十万円程度と考えていたら、印象が変わるかもしれません。\nまず、こちらの**実際の補助金レポート**を見てください。",
        "next": "report_intro"
      },
      {
        "id": "guess_high",
        "type": "message",
        "message": "予想した金額と比べながら、こちらの**補助金レポート**を見てみてください。",
        "next": "report_intro"
      },
      {
        "id": "guess_unknown",
        "type": "message",
        "message": "金額のイメージがわかない方は、まず、こちらの**実際の補助金レポート**をご覧ください。",
        "next": "report_intro"
      },
      {
        "id": "report_intro",
        "type": "message",
        "message": "補助金レポートには、補助金欄に**[color=#c6233b]242.8万円[/color]**と記載されています。\n\n**この住宅の概算例です。**受給確定額や、ご自宅の算出結果ではありません。",
        "next": "report"
      },
      {
        "id": "report",
        "type": "image",
        "src": "./campaigns/ecoda/assets/report-example.png",
        "width": 528,
        "height": 565,
        "alt": "既存記事に掲載された個別AI補助金レポート見本。黒塗り済み。設置容量6.51kW、補助金242万8000円はこの住宅の一例で、ご自宅の金額ではありません。",
        "message": "画像をタップすると拡大できますよ。",
        "next": "sample_bridge"
      },
      {
        "id": "sample_bridge",
        "type": "message",
        "message": "**本来ならお宅に訪問して屋根をチェックしないと分からなかった補助金が、WEBで簡単に無料で分かる。それがこの補助金レポートです。**",
        "next": "sample_bridge_individual"
      },
      {
        "id": "sample_bridge_individual",
        "type": "message",
        "message": "ただし、どの家も同じ補助金額になるわけではなく、載せられる設備の容量や条件で、補助金は変わるんです。\nだからこそ、個別で補助金レポートがもらえると助かりますよね！",
        "next": "q2"
      },
      {
        "id": "q2",
        "type": "question",
        "message": "お住まいは、東京都の戸建て持ち家ですか？",
        "options": [
          {
            "id": "own",
            "label": "はい、自分名義の持ち家です",
            "next": "reply_own"
          },
          {
            "id": "family",
            "label": "東京都の戸建て・家族名義です",
            "next": "reply_family"
          },
          {
            "id": "other",
            "label": "都外・マンション・賃貸などです",
            "next": "outside"
          }
        ],
        "hint": "今回の無料レポートは、東京都の戸建て持ち家の方向けです。"
      },
      {
        "id": "reply_own",
        "type": "message",
        "message": "**ご自宅の補助金レポートを作成できます。**",
        "next": "q3"
      },
      {
        "id": "reply_family",
        "type": "message",
        "message": "**まずは、ご自宅の補助金レポートを見て、ご家族と一緒に考えるための材料にしてみてください。**",
        "next": "q3"
      },
      {
        "id": "outside",
        "type": "end",
        "message": "今回の無料レポートのご案内は、**東京都の戸建て持ち家**の方が対象です。\n\n選び間違えた場合は、下の「ひとつ戻る」から変更できます。"
      },
      {
        "id": "q3",
        "type": "question",
        "message": "いま、不安に思っていることはありますか？",
        "options": [
          {
            "id": "cost",
            "label": "補助金が出ても自己負担がキツそう",
            "next": "reply_cost"
          },
          {
            "id": "roof",
            "label": "うちの屋根・築年数で使える？",
            "next": "reply_roof"
          },
          {
            "id": "sales",
            "label": "営業や訪問が気になる",
            "next": "reply_sales"
          },
          {
            "id": "ready",
            "label": "特にない・まずレポートを見たい",
            "next": "fast_close"
          }
        ],
        "hint": ""
      },
      {
        "id": "reply_cost",
        "type": "message",
        "message": "自己負担がいくらになるかは大事ですよね。\n導入費用とあわせて、**毎月の電気代を減らせるか**も考えたいところです。",
        "next": "monthly_bill"
      },
      {
        "id": "reply_roof",
        "type": "message",
        "message": "屋根の広さだけで、載せられる量や発電量は決まりません。\n**向きや周囲の影なども関係します。**",
        "next": "reply_roof_next"
      },
      {
        "id": "reply_roof_next",
        "type": "message",
        "message": "レポートではAIが衛星画像をもとに**載せられそうな容量と年間発電量の目安**も算出します。\n補助金目安と合わせて検討材料にしてみてください。",
        "next": "monthly_bill"
      },
      {
        "id": "reply_sales",
        "type": "message",
        "message": "今回ご案内するのは、**無料の個別レポートの申込**です。\n**いきなり訪問することはありません**ので、ご安心ください。\nレポートの数字を見てから、導入するか考える材料にできます。",
        "next": "monthly_bill"
      },
      {
        "id": "monthly_bill",
        "type": "question",
        "message": "ちなみに、毎月の電気代はどのくらいですか？",
        "options": [
          {
            "id": "under1",
            "label": "1万円未満",
            "next": "electricity_example_intro"
          },
          {
            "id": "under2",
            "label": "1万〜2万円未満",
            "next": "electricity_example_intro"
          },
          {
            "id": "under3",
            "label": "2万〜3万円未満",
            "next": "electricity_example_intro"
          },
          {
            "id": "over3",
            "label": "3万円以上",
            "next": "electricity_example_intro"
          },
          {
            "id": "unknown",
            "label": "今はわからない",
            "next": "electricity_example_intro"
          }
        ],
        "hint": "わかる範囲で大丈夫です。この回答から節約額を計算するものではありません。"
      },
      {
        "id": "electricity_example_intro",
        "type": "message",
        "message": "こちらは、**月28,000円の電気代を想定した、太陽光＋蓄電池を導入した際のシミュレーション例**です。",
        "next": "electricity_example",
        "note": "※ご自宅の予測額ではありません"
      },
      {
        "id": "electricity_example",
        "type": "image",
        "src": "./campaigns/ecoda/assets/electricity-example.png",
        "width": 656,
        "height": 378,
        "alt": "太陽光と蓄電池を導入した家庭のシミュレーション例。導入前の電気代月28,000円から導入後月1,070円。提供された例であり、ご自宅の予測額ではありません。基本料金等は残ります。",
        "message": "",
        "next": "battery_value"
      },
      {
        "id": "battery_value",
        "type": "question",
        "message": "太陽光＋蓄電池で、どちらに魅力を感じますか？",
        "options": [
          {
            "id": "saving",
            "label": "毎月の電気代を抑えられること",
            "next": "battery_saving"
          },
          {
            "id": "backup",
            "label": "停電時の電気を備えられること",
            "next": "battery_backup"
          },
          {
            "id": "both",
            "label": "どちらも気になる",
            "next": "battery_both"
          }
        ]
      },
      {
        "id": "battery_saving",
        "type": "message",
        "message": "太陽光でつくった電気を、**[color=#2457b7]蓄電池にためて夜にも使う。[/color]**\n電力会社から買う電気を減らすことにつながります。",
        "next": "report_value"
      },
      {
        "id": "battery_backup",
        "type": "message",
        "message": "蓄電池に電気をためておけば、**[color=#c6233b]停電時でも冷蔵庫や照明、スマホ充電などの備え[/color]**にもなります。",
        "next": "report_value"
      },
      {
        "id": "battery_both",
        "type": "message",
        "message": "太陽光でつくった電気を、**[color=#2457b7]蓄電池にためて夜にも使う。[/color]**\n買う電気を減らすことに加え、**[color=#c6233b]停電時でも冷蔵庫や照明、スマホ充電などの備え[/color]**にもなります。",
        "next": "report_value"
      },
      {
        "id": "report_value",
        "type": "message",
        "message": "**ご自宅の補助金を、家族で検討する材料に。**\nお申し込みは**30秒程度**。次のページで住所などの必要事項を入力すると、**5分以内に個別レポートをメールで受け取れます。**",
        "next": "offer"
      },
      {
        "id": "offer",
        "type": "offer",
        "src": "./campaigns/ecoda/assets/offer-sunburst.webp",
        "width": 1024,
        "height": 1024,
        "alt": "東京都の戸建て持ち家向け。自宅の補助金・屋根の容量・年間発電量の目安をまとめた無料の個別レポート。",
        "next": "final_cta"
      },
      {
        "id": "fast_close",
        "type": "message",
        "message": "お申し込みは**30秒程度**。\n次のページで住所などの必要事項を入力すると、**5分以内に個別レポートをメールで受け取れます。**\nご自宅の数字を、ご家族で一緒に確認できます。",
        "next": "final_cta"
      },
      {
        "id": "final_cta",
        "type": "cta",
        "message": "まずは「うちならいくら？」を確かめてみてください。\nレポートを見ながら、ご家族でゆっくり相談してみてくださいね。",
        "label": "自宅の補助金を無料レポートで確認する",
        "note": "ECODAの無料レポート申込ページへ進みます。\nこのチャットの回答だけでは、申込は完了しません。"
      }
    ],
    "footer": {
      "notes": [
        "※補助金額・対象条件は、住宅条件・設備内容・申請時期等により異なります。",
        "※レポートは申請内容をもとに作成する参考情報であり、補助金の交付を保証するものではありません。",
        "※各種補助制度には受付条件・予算上限・受付期間があります。",
        "※停電時に使用できる機器や時間は、設備仕様や使用状況により異なります。"
      ],
      "privacyURL": "https://lp.house-energy.jp/lp69/step/privacy.php",
      "companyURL": "https://ecoda-corp.com/company/"
    },
    "avatarImage": "./campaigns/ecoda/assets/operator-female.jpg",
    "editorLabels": {
      "fv": "FV｜うちの補助金、いくら？",
      "welcome": "導入｜自宅の数字を知る",
      "q1": "Q1｜補助金はいくら？今の予想",
      "guess_low": "予想①｜数十万円と思っていたら",
      "guess_high": "予想②｜見本と比べてみる",
      "guess_unknown": "予想③｜まずは実物の見本を",
      "report_intro": "発見｜見本の補助金欄242.8万円",
      "report": "実物見本｜自宅の診断結果ではない",
      "sample_bridge": "橋渡し①｜訪問前にWEBで補助金レポート",
      "q2": "Q2｜東京都・戸建ての対象確認",
      "reply_own": "持ち家｜自宅の数字を検討材料に",
      "reply_family": "家族名義｜ご夫婦の検討材料に",
      "outside": "対象外のご案内・CTAなし",
      "q3": "Q3｜最後の不安・すぐ進む選択",
      "reply_cost": "費用｜毎月の電気代にも目を向ける",
      "reply_roof": "屋根①｜広さだけでは決まらない",
      "reply_roof_next": "屋根②｜衛星画像で分かる範囲",
      "reply_sales": "営業①｜取り寄せるものを明確に",
      "report_value": "申込へ｜家族の検討材料に",
      "offer": "無料レポート｜家族会議の材料に",
      "fast_close": "すぐ進む｜無料レポート申込へ",
      "final_cta": "クライアントLPへ｜無料レポート申込",
      "monthly_bill": "追加質問｜毎月の電気代",
      "electricity_example_intro": "節約｜月28,000円を想定した例",
      "electricity_example": "電気代シミュレーション｜提供画像",
      "battery_value": "蓄電池の質問｜節約・停電への備え",
      "battery_saving": "節約の返し｜ためた電気を夜に使う",
      "battery_backup": "停電の返し｜照明・スマホ充電の備え",
      "battery_both": "両方の返し｜節約と停電対策",
      "sample_bridge_individual": "橋渡し②｜自宅の条件に合わせたレポート"
    }
  }
};

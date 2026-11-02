window.ABC_LP_SCENARIO = {
  "schema": "abc_lp_copy_scenario.v1",
  "version": "ui-v015-github-review",
  "intended_use": "ローカルUIプレビュー。相談ポイントの案内であり、医療的な診断は行わない。",
  "questions": {
    "q1": {
      "text": "いちばん気になる悩みは？",
      "options": [
        {
          "id": "foreskin",
          "label": "包茎・かぶり",
          "reply": "見た目の気になるところから、相談できます。ABCでは、包茎の状態や希望に合わせて治療方法を提案します。",
          "futures": [
            {
              "id": "foreskin_1",
              "label": "温泉で、隠すことを気にせず過ごしたい",
              "summary": "温泉で隠すことを考えずに過ごす時間"
            },
            {
              "id": "foreskin_2",
              "label": "パートナーの前で、見られる不安を減らしたい",
              "summary": "見られる不安を減らすこと"
            },
            {
              "id": "foreskin_3",
              "label": "見た目を気にする時間を減らしたい",
              "summary": "見た目を気にする時間を減らすこと"
            }
          ]
        },
        {
          "id": "length",
          "label": "長さ",
          "reply": "ABCは長茎術の相談にも対応しています。希望する変化と、状態に合う方法を医師と確認していきます。",
          "futures": [
            {
              "id": "length_1",
              "label": "人と見比べて、落ち込みたくない",
              "summary": "人と見比べて落ち込まない自分"
            },
            {
              "id": "length_2",
              "label": "パートナーの前で、自信を持ちたい",
              "summary": "パートナーの前での自信"
            },
            {
              "id": "length_3",
              "label": "脱ぐ前に、考え込むのをやめたい",
              "summary": "脱ぐ前に考え込まない自分"
            }
          ]
        },
        {
          "id": "girth",
          "label": "太さ",
          "reply": "太さについては増大術の相談に対応しています。希望と状態を確かめ、方法や費用を検討できます。",
          "futures": [
            {
              "id": "girth_1",
              "label": "見た目に、もっと自信を持ちたい",
              "summary": "見た目への自信"
            },
            {
              "id": "girth_2",
              "label": "相手の反応を、気にしすぎず過ごしたい",
              "summary": "相手の反応を気にしすぎない時間"
            },
            {
              "id": "girth_3",
              "label": "自分の体に、納得して向き合いたい",
              "summary": "自分の体に納得して向き合うこと"
            }
          ]
        },
        {
          "id": "early",
          "label": "早漏",
          "reply": "時間を気にしてしまう悩みも相談できます。ABCでは、早漏防止治療の相談に対応しています。",
          "futures": [
            {
              "id": "early_1",
              "label": "時間ばかり、気にせず過ごしたい",
              "summary": "時間ばかり気にしない自分"
            },
            {
              "id": "early_2",
              "label": "パートナーとの時間を、落ち着いて楽しみたい",
              "summary": "二人で落ち着いて楽しむ時間"
            },
            {
              "id": "early_3",
              "label": "終わった後に、落ち込みたくない",
              "summary": "終わった後に落ち込まない自分"
            }
          ]
        }
      ]
    },
    "q2": {
      "text": "どんな場面を変えたい？"
    },
    "q3": {
      "text": "治療で、いちばん気になるのは？",
      "options": [
        {
          "id": "cost",
          "label": "費用の総額",
          "heading": "割引額と、支払う総額を分けて確認。",
          "body": "ABCでは、治療内容と費用を事前に説明します。\nクーポンの対象になる治療・組合せと、適用後の総額を確認してから検討できます。"
        },
        {
          "id": "pain",
          "label": "痛み",
          "heading": "麻酔の方法まで、事前の相談で確認。",
          "body": "ABCでは、麻酔法の工夫など、痛みやストレスの軽減に配慮しています。\n麻酔の方法や治療後の経過も、カウンセリングで確認してください。\n※痛みの感じ方や経過には個人差があります。"
        },
        {
          "id": "privacy",
          "label": "人に知られること",
          "heading": "完全予約制。男性スタッフが対応。",
          "body": "ABCでは、待合室も個別対応です。\n相談内容や治療情報の管理にも配慮しています。"
        },
        {
          "id": "skill",
          "label": "仕上がり・医師の技術",
          "heading": "希望と状態に合わせて、治療方法を検討。",
          "body": "ABCでは、医師同士の症例研究・技術研修を実施しています。\n希望する見た目、傷跡やリスクについても、カウンセリングで確認してください。"
        }
      ]
    }
  },
  "handoff": {
    "early_cta_available": true,
    "reset_q2_when_q1_changes": true,
    "answers_change_coupon_or_eligibility": false,
    "automatically_pass_answers_to_line": false,
    "event_payload_excludes_sensitive_answers": true,
    "retention": "実装時に決定。資料の分岐確認はページ内だけで保持。"
  },
  "cta": {
    "label": "LINEで治療クーポンを確認する",
    "subtext": "LINE登録後、クーポン案内に必要なアンケート回答があります。",
    "production_url": null,
    "note": "既存の表示CTAのASP経路を実装時に照合し保持する。資料からは送信・登録しない。"
  },
  "offer": {
    "amount": null,
    "status": "MISSING",
    "reason": "現行画像16.5万円と本文15万円の表記差を未解決。対象・条件も要照合。"
  },
  "fallback": {
    "heading": "気になる悩みを、相談のきっかけに。",
    "body": "まずは、使える治療クーポンの内容と条件を確かめてみてください。"
  },
  "review_status": {
    "complete_branches": 48,
    "line_registration_tested": false,
    "images_produced": false,
    "published": false
  },
  "source_copy_version": "ABC copy v004 / UI v002 retained"
};

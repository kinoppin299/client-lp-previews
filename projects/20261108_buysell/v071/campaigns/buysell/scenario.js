export default {
  "a": {
    "id": "buysell-silent",
    "version": "0.7.1",
    "variant": "a",
    "title": "母の着物、しまったまま？",
    "brand": "【大注目】古い着物が驚きの査定額に!?",
    "hero": {
      "title": "母の着物、しまったまま？",
      "startLabel": "会話をはじめる"
    },
    "autoStart": false,
    "conversion": {
      "url": "https://example.com/local-placeholder",
      "inheritQueryParameters": false
    },
    "tracking": {
      "answerIdsFor": [],
      "branchDetails": false
    },
    "start": "welcome",
    "cases": [
      {
        "id": "kimono",
        "title": "着物と帯の実例",
        "item": "希少な著名作家や有名産地の着物や帯",
        "area": "神奈川県三浦郡",
        "amount": 1601000,
        "file": "kimono-case.webp",
        "url": "https://buysell-kaitori.com/wp-content/uploads/994869d7-d4ef-48af-961a-ed336060ab2e-3.png",
        "row": 2,
        "condition": "未着用の人間国宝の作家品や、有名産地の着物・帯など多数の合計です。"
      },
      {
        "id": "obi",
        "title": "袋帯を含む実例",
        "item": "細見華岳の袋帯など着物数点",
        "area": "熊本県熊本市",
        "amount": 280000,
        "file": "obi-case.webp",
        "url": "https://buysell-kaitori.com/wp-content/uploads/fukuroobi_js_n00a1-1.png",
        "row": 7,
        "condition": "細見華岳の袋帯など、着物数点をあわせた実例です。"
      },
      {
        "id": "accessory",
        "title": "かんざしなどの実例",
        "item": "かんざしセットなど和装小物",
        "area": "千葉県袖ケ浦市",
        "amount": 138500,
        "file": "accessory-case.webp",
        "url": "https://buysell-kaitori.com/wp-content/uploads/kimono_js_komono002.png",
        "row": 37,
        "condition": "かんざしセットなど、和装小物をあわせた実例です。"
      }
    ],
    "steps": [
      {
        "id": "welcome",
        "type": "message",
        "speaker": "a",
        "message": "ねぇ、この着物いらない？",
        "visual": "fv-photo",
        "next": "daughter",
        "faces": {
          "a": "neutral",
          "b": "neutral"
        }
      },
      {
        "id": "daughter",
        "type": "message",
        "speaker": "b",
        "message": "あら、お母さんの着物？ 娘さんに譲った方がいいんじゃない？",
        "visual": "fv-photo",
        "next": "refused",
        "faces": {
          "a": "neutral",
          "b": "smile"
        }
      },
      {
        "id": "refused",
        "type": "message",
        "speaker": "a",
        "message": "「着る機会もないし、しまう場所もないから要らない」って……",
        "visual": "fv-photo",
        "next": "friend",
        "faces": {
          "a": "confused",
          "b": "neutral"
        },
        "characterAction": {
          "role": "a",
          "clip": "a-hesitate",
          "cue": "要らない"
        }
      },
      {
        "id": "friend",
        "type": "message",
        "speaker": "b",
        "message": "ウチも娘に同じこと言われたわ。だから私は査定に出しちゃったわよ",
        "visual": "fv-photo",
        "next": "shop",
        "faces": {
          "a": "neutral",
          "b": "smile"
        },
        "characterAction": {
          "role": "b",
          "clip": "b-nod",
          "cue": "査定"
        }
      },
      {
        "id": "shop",
        "type": "message",
        "speaker": "a",
        "message": "え？ 近所のリサイクルショップ？",
        "visual": "fv-photo",
        "next": "buysell",
        "faces": {
          "a": "neutral",
          "b": "neutral"
        },
        "characterAction": {
          "role": "a",
          "clip": "a-surprise",
          "cue": "え？"
        }
      },
      {
        "id": "buysell",
        "type": "message",
        "speaker": "b",
        "message": "違うわよ。CMやってる**バイセル**に査定してもらったの",
        "visual": "service-photo",
        "next": "old",
        "faces": {
          "a": "neutral",
          "b": "smile"
        },
        "characterAction": {
          "role": "b",
          "clip": "b-smile",
          "cue": "バイセル"
        }
      },
      {
        "id": "old",
        "type": "message",
        "speaker": "a",
        "message": "こんな**古い着物**でも、見てもらえるの？",
        "visual": "old-photo",
        "next": "expert",
        "faces": {
          "a": "confused",
          "b": "neutral"
        },
        "characterAction": {
          "role": "a",
          "clip": "a-hesitate",
          "cue": "古い"
        }
      },
      {
        "id": "expert",
        "type": "message",
        "speaker": "b",
        "message": "バイセルは、年間約100万枚以上の着物を買い取ってるから、**経験豊富な査定士**が、ちゃんと価値を見てくれるのよ",
        "visual": "service-photo",
        "claimVerification": "MISSING",
        "claimSource": "提供台本",
        "next": "demand_question",
        "faces": {
          "a": "neutral",
          "b": "smile"
        },
        "characterAction": {
          "role": "b",
          "clip": "b-nod",
          "cue": "査定士"
        }
      },
      {
        "id": "demand_question",
        "type": "message",
        "speaker": "a",
        "message": "でも、今どき着物を欲しがる人なんているの？",
        "visual": "demand-photo",
        "next": "demand",
        "faces": {
          "a": "neutral",
          "b": "neutral"
        }
      },
      {
        "id": "demand",
        "type": "message",
        "speaker": "b",
        "message": "実はいま、海外でも“KIMONO”が注目されていて、インバウンド需要もあって、[color=#b72e28]**着物の取引相場が高騰中**[/color]なの！",
        "visual": "demand-photo",
        "claimVerification": "MISSING",
        "claimSource": "提供台本",
        "next": "tourists",
        "faces": {
          "a": "neutral",
          "b": "smile"
        }
      },
      {
        "id": "tourists",
        "type": "message",
        "speaker": "a",
        "message": "確かに。観光地でも着物着た外国の方、多いわね。",
        "visual": "demand-photo",
        "next": "market_news",
        "faces": {
          "a": "neutral",
          "b": "neutral"
        }
      },
      {
        "id": "market_news",
        "type": "message",
        "speaker": "b",
        "message": "中古着物の業者間市場では、取引相場が1年前の[color=#b72e28]**約2倍**[/color]になったというニュースまであるのよ",
        "visual": "demand-photo",
        "claimVerification": "OK",
        "claimSource": "https://www.recycle-tsushin.com/news/detail_11999.php",
        "next": "realization",
        "faces": {
          "a": "neutral",
          "b": "smile"
        },
        "note": "※リユース経済新聞2025年12月11日より",
        "noteUrl": "https://www.recycle-tsushin.com/news/detail_11999.php",
        "noteKind": "source",
        "claimScope": "2025年12月11日掲載のジャパンキモノオークションに関する報道。着物全体・現在の個別査定結果を表すものではない。"
      },
      {
        "id": "realization",
        "type": "message",
        "speaker": "a",
        "message": "私が着ないからって、もう誰も着ないわけじゃないのね",
        "visual": "demand-photo",
        "next": "channels",
        "faces": {
          "a": "neutral",
          "b": "neutral"
        },
        "characterAction": {
          "role": "a",
          "clip": "a-nod",
          "cue": "着ない"
        }
      },
      {
        "id": "channels",
        "type": "message",
        "speaker": "b",
        "message": "そう。バイセルは、買い取った着物を**国内外の欲しい人に届ける販路**も持ってるの。",
        "visual": "channels-photo",
        "next": "channels_value",
        "faces": {
          "a": "neutral",
          "b": "smile"
        }
      },
      {
        "id": "channels_value",
        "type": "message",
        "speaker": "b",
        "message": "価値を見極めて、次の買い手につなげられるから、**査定額に差がつく**のよ",
        "visual": "value-photo",
        "next": "difference_question",
        "faces": {
          "a": "neutral",
          "b": "smile"
        }
      },
      {
        "id": "difference_question",
        "type": "message",
        "speaker": "a",
        "message": "頼むところで、そんなに変わるもの？",
        "visual": "channels-photo",
        "next": "comparison",
        "faces": {
          "a": "neutral",
          "b": "neutral"
        }
      },
      {
        "id": "comparison",
        "type": "message",
        "speaker": "b",
        "message": "他社では**5,000円**と言われた着物が、バイセルでは[color=#b72e28]**21万円**[/color]だった事例もあるわよ",
        "visual": "comparison-photo",
        "advanceMode": "manual",
        "next": "comparison_reaction",
        "faces": {
          "a": "neutral",
          "b": "smile"
        },
        "note": "※全ての着物に同様の査定額・価格差が生じるものではありません。",
        "noteKind": "case"
      },
      {
        "id": "comparison_reaction",
        "type": "message",
        "speaker": "a",
        "message": "同じ着物で!? それなら、**どこに見てもらうか**大事ね",
        "visual": "comparison-photo",
        "next": "also_accessories",
        "faces": {
          "a": "neutral",
          "b": "neutral"
        },
        "characterAction": {
          "role": "a",
          "clip": "a-surprise",
          "cue": "同じ"
        },
        "note": "※全ての着物に同様の査定額・価格差が生じるものではありません。",
        "noteKind": "case"
      },
      {
        "id": "also_accessories",
        "type": "message",
        "speaker": "a",
        "message": "そういえば、**帯やかんざし**も残ってるんだけど……",
        "visual": "case-choice",
        "next": "case_invite",
        "faces": {
          "a": "neutral",
          "b": "neutral"
        }
      },
      {
        "id": "case_invite",
        "type": "message",
        "speaker": "b",
        "message": "帯も査定してもらえるわよ。着物も小物も、実際の写真があるから見てみる？",
        "visual": "case-choice",
        "next": "q2",
        "faces": {
          "a": "neutral",
          "b": "smile"
        }
      },
      {
        "id": "q2",
        "type": "question",
        "speaker": "a",
        "message": "どんな実例があるのかしら。",
        "visual": "case-choice",
        "options": [
          {
            "id": "kimono",
            "label": "着物と帯の査定実例",
            "next": "case_kimono"
          },
          {
            "id": "obi",
            "label": "袋帯の査定実例",
            "next": "case_obi"
          },
          {
            "id": "accessory",
            "label": "かんざしなどの査定実例",
            "next": "case_accessory"
          }
        ],
        "faces": {
          "a": "neutral",
          "b": "neutral"
        }
      },
      {
        "id": "case_kimono",
        "type": "message",
        "speaker": "b",
        "message": "それだけじゃないの。この着物や帯には、[color=#b72e28]**160万1,000円**[/color]の査定がついた事例もあるのよ",
        "visual": "case",
        "caseId": "kimono",
        "advanceMode": "manual",
        "note": "※全ての着物に同様の査定額・価格差が生じるものではありません。",
        "next": "react_kimono",
        "copyGroup": "case_kimono",
        "faces": {
          "a": "neutral",
          "b": "smile"
        },
        "noteKind": "case"
      },
      {
        "id": "react_kimono",
        "type": "message",
        "speaker": "a",
        "message": "[color=#b72e28]**160万円**[/color]!? ……母の着物も、**自分で価値がないって決めちゃダメ**ね",
        "visual": "case",
        "caseId": "kimono",
        "next": "more_cases_1",
        "copyGroup": "react_kimono",
        "faces": {
          "a": "neutral",
          "b": "neutral"
        },
        "characterAction": {
          "role": "a",
          "clip": "a-surprise",
          "cue": "160"
        },
        "note": "※全ての着物に同様の査定額・価格差が生じるものではありません。",
        "noteKind": "case"
      },
      {
        "id": "case_obi",
        "type": "message",
        "speaker": "b",
        "message": "この袋帯も見て。細見華岳の袋帯など、着物数点で[color=#b72e28]**28万円**[/color]になった実例なのよ",
        "visual": "case",
        "caseId": "obi",
        "advanceMode": "manual",
        "note": "※全ての着物に同様の査定額・価格差が生じるものではありません。",
        "next": "react_obi",
        "copyGroup": "case_obi",
        "faces": {
          "a": "neutral",
          "b": "smile"
        },
        "noteKind": "case"
      },
      {
        "id": "react_obi",
        "type": "message",
        "speaker": "a",
        "message": "帯も一緒に見てもらえるのね。着物に合わせていた帯も、残っているわ。",
        "visual": "case",
        "caseId": "obi",
        "next": "more_cases_2",
        "copyGroup": "react_obi",
        "faces": {
          "a": "neutral",
          "b": "neutral"
        },
        "characterAction": {
          "role": "a",
          "clip": "a-surprise",
          "cue": "帯"
        },
        "note": "※全ての着物に同様の査定額・価格差が生じるものではありません。",
        "noteKind": "case"
      },
      {
        "id": "case_accessory",
        "type": "message",
        "speaker": "b",
        "message": "かんざしセットなどの小物にも、[color=#b72e28]**13万8,500円**[/color]の査定事例があるの",
        "visual": "case",
        "caseId": "accessory",
        "advanceMode": "manual",
        "note": "※全ての着物に同様の査定額・価格差が生じるものではありません。",
        "next": "react_accessory",
        "copyGroup": "case_accessory",
        "faces": {
          "a": "neutral",
          "b": "smile"
        },
        "noteKind": "case"
      },
      {
        "id": "react_accessory",
        "type": "message",
        "speaker": "a",
        "message": "かんざしにも、そんな価値があるの!? あの引き出しも確認しなきゃ。",
        "visual": "case",
        "caseId": "accessory",
        "next": "more_cases_4",
        "copyGroup": "react_accessory",
        "faces": {
          "a": "neutral",
          "b": "neutral"
        },
        "characterAction": {
          "role": "a",
          "clip": "a-surprise",
          "cue": "かんざし"
        },
        "note": "※全ての着物に同様の査定額・価格差が生じるものではありません。",
        "noteKind": "case"
      },
      {
        "id": "case_obi_after_1",
        "type": "message",
        "speaker": "b",
        "message": "この袋帯も見て。細見華岳の袋帯など、着物数点で[color=#b72e28]**28万円**[/color]になった実例なのよ",
        "visual": "case",
        "caseId": "obi",
        "advanceMode": "manual",
        "note": "※全ての着物に同様の査定額・価格差が生じるものではありません。",
        "next": "react_obi_after_1",
        "copyGroup": "case_obi",
        "faces": {
          "a": "neutral",
          "b": "smile"
        },
        "noteKind": "case"
      },
      {
        "id": "react_obi_after_1",
        "type": "message",
        "speaker": "a",
        "message": "帯も一緒に見てもらえるのね。着物に合わせていた帯も、残っているわ。",
        "visual": "case",
        "caseId": "obi",
        "next": "more_cases_3",
        "copyGroup": "react_obi",
        "faces": {
          "a": "neutral",
          "b": "neutral"
        },
        "characterAction": {
          "role": "a",
          "clip": "a-surprise",
          "cue": "帯"
        },
        "note": "※全ての着物に同様の査定額・価格差が生じるものではありません。",
        "noteKind": "case"
      },
      {
        "id": "case_accessory_after_1",
        "type": "message",
        "speaker": "b",
        "message": "かんざしセットなどの小物にも、[color=#b72e28]**13万8,500円**[/color]の査定事例があるの",
        "visual": "case",
        "caseId": "accessory",
        "advanceMode": "manual",
        "note": "※全ての着物に同様の査定額・価格差が生じるものではありません。",
        "next": "react_accessory_after_1",
        "copyGroup": "case_accessory",
        "faces": {
          "a": "neutral",
          "b": "smile"
        },
        "noteKind": "case"
      },
      {
        "id": "react_accessory_after_1",
        "type": "message",
        "speaker": "a",
        "message": "かんざしにも、そんな価値があるの!? あの引き出しも確認しなきゃ。",
        "visual": "case",
        "caseId": "accessory",
        "next": "more_cases_5",
        "copyGroup": "react_accessory",
        "faces": {
          "a": "neutral",
          "b": "neutral"
        },
        "characterAction": {
          "role": "a",
          "clip": "a-surprise",
          "cue": "かんざし"
        },
        "note": "※全ての着物に同様の査定額・価格差が生じるものではありません。",
        "noteKind": "case"
      },
      {
        "id": "case_kimono_after_2",
        "type": "message",
        "speaker": "b",
        "message": "それだけじゃないの。この着物や帯には、[color=#b72e28]**160万1,000円**[/color]の査定がついた事例もあるのよ",
        "visual": "case",
        "caseId": "kimono",
        "advanceMode": "manual",
        "note": "※全ての着物に同様の査定額・価格差が生じるものではありません。",
        "next": "react_kimono_after_2",
        "copyGroup": "case_kimono",
        "faces": {
          "a": "neutral",
          "b": "smile"
        },
        "noteKind": "case"
      },
      {
        "id": "react_kimono_after_2",
        "type": "message",
        "speaker": "a",
        "message": "[color=#b72e28]**160万円**[/color]!? ……母の着物も、**自分で価値がないって決めちゃダメ**ね",
        "visual": "case",
        "caseId": "kimono",
        "next": "more_cases_3",
        "copyGroup": "react_kimono",
        "faces": {
          "a": "neutral",
          "b": "neutral"
        },
        "characterAction": {
          "role": "a",
          "clip": "a-surprise",
          "cue": "160"
        },
        "note": "※全ての着物に同様の査定額・価格差が生じるものではありません。",
        "noteKind": "case"
      },
      {
        "id": "case_accessory_after_2",
        "type": "message",
        "speaker": "b",
        "message": "かんざしセットなどの小物にも、[color=#b72e28]**13万8,500円**[/color]の査定事例があるの",
        "visual": "case",
        "caseId": "accessory",
        "advanceMode": "manual",
        "note": "※全ての着物に同様の査定額・価格差が生じるものではありません。",
        "next": "react_accessory_after_2",
        "copyGroup": "case_accessory",
        "faces": {
          "a": "neutral",
          "b": "smile"
        },
        "noteKind": "case"
      },
      {
        "id": "react_accessory_after_2",
        "type": "message",
        "speaker": "a",
        "message": "かんざしにも、そんな価値があるの!? あの引き出しも確認しなきゃ。",
        "visual": "case",
        "caseId": "accessory",
        "next": "more_cases_6",
        "copyGroup": "react_accessory",
        "faces": {
          "a": "neutral",
          "b": "neutral"
        },
        "characterAction": {
          "role": "a",
          "clip": "a-surprise",
          "cue": "かんざし"
        },
        "note": "※全ての着物に同様の査定額・価格差が生じるものではありません。",
        "noteKind": "case"
      },
      {
        "id": "case_kimono_after_4",
        "type": "message",
        "speaker": "b",
        "message": "それだけじゃないの。この着物や帯には、[color=#b72e28]**160万1,000円**[/color]の査定がついた事例もあるのよ",
        "visual": "case",
        "caseId": "kimono",
        "advanceMode": "manual",
        "note": "※全ての着物に同様の査定額・価格差が生じるものではありません。",
        "next": "react_kimono_after_4",
        "copyGroup": "case_kimono",
        "faces": {
          "a": "neutral",
          "b": "smile"
        },
        "noteKind": "case"
      },
      {
        "id": "react_kimono_after_4",
        "type": "message",
        "speaker": "a",
        "message": "[color=#b72e28]**160万円**[/color]!? ……母の着物も、**自分で価値がないって決めちゃダメ**ね",
        "visual": "case",
        "caseId": "kimono",
        "next": "more_cases_5",
        "copyGroup": "react_kimono",
        "faces": {
          "a": "neutral",
          "b": "neutral"
        },
        "characterAction": {
          "role": "a",
          "clip": "a-surprise",
          "cue": "160"
        },
        "note": "※全ての着物に同様の査定額・価格差が生じるものではありません。",
        "noteKind": "case"
      },
      {
        "id": "case_obi_after_4",
        "type": "message",
        "speaker": "b",
        "message": "この袋帯も見て。細見華岳の袋帯など、着物数点で[color=#b72e28]**28万円**[/color]になった実例なのよ",
        "visual": "case",
        "caseId": "obi",
        "advanceMode": "manual",
        "note": "※全ての着物に同様の査定額・価格差が生じるものではありません。",
        "next": "react_obi_after_4",
        "copyGroup": "case_obi",
        "faces": {
          "a": "neutral",
          "b": "smile"
        },
        "noteKind": "case"
      },
      {
        "id": "react_obi_after_4",
        "type": "message",
        "speaker": "a",
        "message": "帯も一緒に見てもらえるのね。着物に合わせていた帯も、残っているわ。",
        "visual": "case",
        "caseId": "obi",
        "next": "more_cases_6",
        "copyGroup": "react_obi",
        "faces": {
          "a": "neutral",
          "b": "neutral"
        },
        "characterAction": {
          "role": "a",
          "clip": "a-surprise",
          "cue": "帯"
        },
        "note": "※全ての着物に同様の査定額・価格差が生じるものではありません。",
        "noteKind": "case"
      },
      {
        "id": "case_accessory_after_3",
        "type": "message",
        "speaker": "b",
        "message": "かんざしセットなどの小物にも、[color=#b72e28]**13万8,500円**[/color]の査定事例があるの",
        "visual": "case",
        "caseId": "accessory",
        "advanceMode": "manual",
        "note": "※全ての着物に同様の査定額・価格差が生じるものではありません。",
        "next": "react_accessory_after_3",
        "copyGroup": "case_accessory",
        "faces": {
          "a": "neutral",
          "b": "smile"
        },
        "noteKind": "case"
      },
      {
        "id": "react_accessory_after_3",
        "type": "message",
        "speaker": "a",
        "message": "かんざしにも、そんな価値があるの!? あの引き出しも確認しなきゃ。",
        "visual": "case",
        "caseId": "accessory",
        "next": "more_cases_7",
        "copyGroup": "react_accessory",
        "faces": {
          "a": "neutral",
          "b": "neutral"
        },
        "characterAction": {
          "role": "a",
          "clip": "a-surprise",
          "cue": "かんざし"
        },
        "note": "※全ての着物に同様の査定額・価格差が生じるものではありません。",
        "noteKind": "case"
      },
      {
        "id": "case_obi_after_5",
        "type": "message",
        "speaker": "b",
        "message": "この袋帯も見て。細見華岳の袋帯など、着物数点で[color=#b72e28]**28万円**[/color]になった実例なのよ",
        "visual": "case",
        "caseId": "obi",
        "advanceMode": "manual",
        "note": "※全ての着物に同様の査定額・価格差が生じるものではありません。",
        "next": "react_obi_after_5",
        "copyGroup": "case_obi",
        "faces": {
          "a": "neutral",
          "b": "smile"
        },
        "noteKind": "case"
      },
      {
        "id": "react_obi_after_5",
        "type": "message",
        "speaker": "a",
        "message": "帯も一緒に見てもらえるのね。着物に合わせていた帯も、残っているわ。",
        "visual": "case",
        "caseId": "obi",
        "next": "more_cases_7",
        "copyGroup": "react_obi",
        "faces": {
          "a": "neutral",
          "b": "neutral"
        },
        "characterAction": {
          "role": "a",
          "clip": "a-surprise",
          "cue": "帯"
        },
        "note": "※全ての着物に同様の査定額・価格差が生じるものではありません。",
        "noteKind": "case"
      },
      {
        "id": "case_kimono_after_6",
        "type": "message",
        "speaker": "b",
        "message": "それだけじゃないの。この着物や帯には、[color=#b72e28]**160万1,000円**[/color]の査定がついた事例もあるのよ",
        "visual": "case",
        "caseId": "kimono",
        "advanceMode": "manual",
        "note": "※全ての着物に同様の査定額・価格差が生じるものではありません。",
        "next": "react_kimono_after_6",
        "copyGroup": "case_kimono",
        "faces": {
          "a": "neutral",
          "b": "smile"
        },
        "noteKind": "case"
      },
      {
        "id": "react_kimono_after_6",
        "type": "message",
        "speaker": "a",
        "message": "[color=#b72e28]**160万円**[/color]!? ……母の着物も、**自分で価値がないって決めちゃダメ**ね",
        "visual": "case",
        "caseId": "kimono",
        "next": "more_cases_7",
        "copyGroup": "react_kimono",
        "faces": {
          "a": "neutral",
          "b": "neutral"
        },
        "characterAction": {
          "role": "a",
          "clip": "a-surprise",
          "cue": "160"
        },
        "note": "※全ての着物に同様の査定額・価格差が生じるものではありません。",
        "noteKind": "case"
      },
      {
        "id": "more_cases_1",
        "type": "question",
        "speaker": "b",
        "message": "他にも知りたい査定事例はある？",
        "visual": "case-choice",
        "options": [
          {
            "id": "obi",
            "label": "袋帯も見てみる",
            "next": "case_obi_after_1"
          },
          {
            "id": "accessory",
            "label": "かんざしなども見てみる",
            "next": "case_accessory_after_1"
          },
          {
            "id": "done",
            "label": "いまは大丈夫。話の続きを聞く",
            "next": "know_first"
          }
        ],
        "copyGroup": "more_cases",
        "seenCases": [
          "kimono"
        ],
        "faces": {
          "a": "neutral",
          "b": "smile"
        }
      },
      {
        "id": "more_cases_2",
        "type": "question",
        "speaker": "b",
        "message": "他にも知りたい査定事例はある？",
        "visual": "case-choice",
        "options": [
          {
            "id": "kimono",
            "label": "着物と帯も見てみる",
            "next": "case_kimono_after_2"
          },
          {
            "id": "accessory",
            "label": "かんざしなども見てみる",
            "next": "case_accessory_after_2"
          },
          {
            "id": "done",
            "label": "いまは大丈夫。話の続きを聞く",
            "next": "know_first"
          }
        ],
        "copyGroup": "more_cases",
        "seenCases": [
          "obi"
        ],
        "faces": {
          "a": "neutral",
          "b": "smile"
        }
      },
      {
        "id": "more_cases_4",
        "type": "question",
        "speaker": "b",
        "message": "他にも知りたい査定事例はある？",
        "visual": "case-choice",
        "options": [
          {
            "id": "kimono",
            "label": "着物と帯も見てみる",
            "next": "case_kimono_after_4"
          },
          {
            "id": "obi",
            "label": "袋帯も見てみる",
            "next": "case_obi_after_4"
          },
          {
            "id": "done",
            "label": "いまは大丈夫。話の続きを聞く",
            "next": "know_first"
          }
        ],
        "copyGroup": "more_cases",
        "seenCases": [
          "accessory"
        ],
        "faces": {
          "a": "neutral",
          "b": "smile"
        }
      },
      {
        "id": "more_cases_3",
        "type": "question",
        "speaker": "b",
        "message": "他にも知りたい査定事例はある？",
        "visual": "case-choice",
        "options": [
          {
            "id": "accessory",
            "label": "かんざしなども見てみる",
            "next": "case_accessory_after_3"
          },
          {
            "id": "done",
            "label": "いまは大丈夫。話の続きを聞く",
            "next": "know_first"
          }
        ],
        "copyGroup": "more_cases",
        "seenCases": [
          "kimono",
          "obi"
        ],
        "faces": {
          "a": "neutral",
          "b": "smile"
        }
      },
      {
        "id": "more_cases_5",
        "type": "question",
        "speaker": "b",
        "message": "他にも知りたい査定事例はある？",
        "visual": "case-choice",
        "options": [
          {
            "id": "obi",
            "label": "袋帯も見てみる",
            "next": "case_obi_after_5"
          },
          {
            "id": "done",
            "label": "いまは大丈夫。話の続きを聞く",
            "next": "know_first"
          }
        ],
        "copyGroup": "more_cases",
        "seenCases": [
          "kimono",
          "accessory"
        ],
        "faces": {
          "a": "neutral",
          "b": "smile"
        }
      },
      {
        "id": "more_cases_6",
        "type": "question",
        "speaker": "b",
        "message": "他にも知りたい査定事例はある？",
        "visual": "case-choice",
        "options": [
          {
            "id": "kimono",
            "label": "着物と帯も見てみる",
            "next": "case_kimono_after_6"
          },
          {
            "id": "done",
            "label": "いまは大丈夫。話の続きを聞く",
            "next": "know_first"
          }
        ],
        "copyGroup": "more_cases",
        "seenCases": [
          "obi",
          "accessory"
        ],
        "faces": {
          "a": "neutral",
          "b": "smile"
        }
      },
      {
        "id": "more_cases_7",
        "type": "message",
        "speaker": "b",
        "message": "気になる実例は、ひと通り見られたわね。",
        "visual": "case-choice",
        "copyGroup": "all_cases_done",
        "seenCases": [
          "kimono",
          "obi",
          "accessory"
        ],
        "faces": {
          "a": "neutral",
          "b": "smile"
        },
        "next": "know_first",
        "autoHoldMs": 2200
      },
      {
        "id": "know_first",
        "type": "message",
        "speaker": "b",
        "message": "見てもらわないと分からないものね",
        "visual": "hidden-value-photo",
        "next": "nearby",
        "faces": {
          "a": "neutral",
          "b": "smile"
        }
      },
      {
        "id": "nearby",
        "type": "message",
        "speaker": "a",
        "message": "でも、バイセルって近所にあったかしら？",
        "visual": "store-photo",
        "next": "visit",
        "faces": {
          "a": "neutral",
          "b": "neutral"
        }
      },
      {
        "id": "visit",
        "type": "message",
        "speaker": "b",
        "message": "お店まで持っていかなくていいの。出張査定なら、[color=#1e663f]**家まで来て見てもらえる**[/color]わよ",
        "visual": "visit-photo",
        "next": "heavy_fee",
        "faces": {
          "a": "neutral",
          "b": "smile"
        }
      },
      {
        "id": "heavy_fee",
        "type": "message",
        "speaker": "a",
        "message": "それは助かる！ 着物って、まとめると重いのよね。でも、来てもらうのにお金がかかるでしょ？",
        "visual": "visit-photo",
        "next": "reply_fee",
        "faces": {
          "a": "neutral",
          "b": "neutral"
        },
        "characterAction": {
          "role": "a",
          "clip": "a-hesitate",
          "cue": "お金"
        }
      },
      {
        "id": "reply_fee",
        "type": "message",
        "speaker": "b",
        "message": "[color=#1e663f]**出張料・査定料・キャンセル料も無料**[/color]よ",
        "visual": "free-photo",
        "advanceMode": "manual",
        "next": "treasured",
        "faces": {
          "a": "neutral",
          "b": "smile"
        },
        "note": "※宅配買取の場合、査定後買取希望されない場合は返送料がかかります。",
        "noteKind": "fees"
      },
      {
        "id": "treasured",
        "type": "message",
        "speaker": "a",
        "message": "でも、母がよく着ていた一枚は、まだ手放すか迷ってるの",
        "visual": "keep-photo",
        "next": "keep_it",
        "faces": {
          "a": "anxious",
          "b": "neutral"
        },
        "characterAction": {
          "role": "a",
          "clip": "a-anxious",
          "cue": "一枚"
        }
      },
      {
        "id": "keep_it",
        "type": "message",
        "speaker": "b",
        "message": "それなら[color=#1e663f]**残していい**[/color]のよ。査定額に納得できなければ、[color=#1e663f]**手放さなくても大丈夫**[/color]。聞いてから決めればいいんだから",
        "visual": "keep-photo",
        "next": "relief",
        "faces": {
          "a": "anxious",
          "b": "smile"
        },
        "characterAction": {
          "role": "b",
          "clip": "b-reassure",
          "cue": "残して"
        }
      },
      {
        "id": "relief",
        "type": "message",
        "speaker": "a",
        "message": "そうね。**まず査定額を知れば**、残すか手放すかも考えやすいわね",
        "visual": "decision-photo",
        "next": "campaign",
        "faces": {
          "a": "neutral",
          "b": "neutral"
        },
        "characterAction": {
          "role": "a",
          "clip": "a-nod",
          "cue": "そうね"
        }
      },
      {
        "id": "campaign",
        "type": "message",
        "speaker": "b",
        "message": "しかも今月は、[color=#b72e28]**抽選で買取金額5倍キャンペーン**[/color]もやってるのよ。",
        "visual": "campaign",
        "advanceMode": "manual",
        "note": "※2026年11月1日〜30日に、出張買取で一度に5,000円以上ご成約の方が抽選対象。最大25名に、買取金額を含めて5倍の金額を還元。還元額の上限は10万円。当せん金額は後日振込。クーリング・オフ申請の方は対象外。予告なく変更・終了する場合があります。",
        "next": "callback",
        "faces": {
          "a": "neutral",
          "b": "smile"
        },
        "characterAction": {
          "role": "b",
          "clip": "b-smile",
          "cue": "5倍"
        }
      },
      {
        "id": "callback",
        "type": "message",
        "speaker": "a",
        "message": "ホント!? じゃあ、さっきの「この着物いらない？」は、**ちょっと待って！**",
        "visual": "appraisal-choice-photo",
        "next": "first_appraisal",
        "faces": {
          "a": "neutral",
          "b": "neutral"
        },
        "characterAction": {
          "role": "a",
          "clip": "a-excited",
          "cue": "ホント"
        }
      },
      {
        "id": "first_appraisal",
        "type": "message",
        "speaker": "b",
        "message": "ふふっ。[color=#1e663f]**まずは査定してから**[/color]、ね",
        "visual": "consultation-photo",
        "next": "close",
        "faces": {
          "a": "neutral",
          "b": "smile"
        },
        "characterAction": {
          "role": "b",
          "clip": "b-smile",
          "cue": "ふふっ"
        }
      },
      {
        "id": "close",
        "type": "message",
        "speaker": "a",
        "message": "うん！ 着物も帯も小物も、**まとめて相談**してみるわ",
        "visual": "service-photo",
        "showCTA": true,
        "next": "final_cta",
        "faces": {
          "a": "neutral",
          "b": "neutral"
        },
        "characterAction": {
          "role": "a",
          "clip": "a-determined",
          "cue": "うん"
        }
      },
      {
        "id": "final_cta",
        "type": "cta",
        "speaker": "b",
        "message": "スマホで**30秒**で申し込めるから、[color=#1e663f]**まずは査定額だけでも**[/color]聞いてみて！",
        "visual": "service-photo",
        "label": "無料査定を申し込む",
        "claimSource": "提供台本。公式着物ページには30秒のお問い合わせと表記",
        "claimVerification": "FOUND",
        "faces": {
          "a": "neutral",
          "b": "smile"
        },
        "characterAction": {
          "role": "b",
          "clip": "b-nod",
          "cue": "まず"
        }
      }
    ],
    "editorLabels": {
      "welcome": "A｜ねぇ、この着物いらない？",
      "daughter": "B｜あら、お母さんの着物？ 娘さんに譲った方がいいんじゃない？",
      "refused": "A｜「着る機会もないし、しまう場所もないから要らない」って……",
      "friend": "B｜ウチも娘に同じこと言われたわ。だから私は査定に出しちゃったわ",
      "shop": "A｜え？ 近所のリサイクルショップ？",
      "buysell": "B｜違うわよ。CMやってるバイセルに査定してもらったの",
      "old": "A｜こんな古い着物でも、見てもらえるの？",
      "expert": "B｜バイセルは、年間約100万枚以上の着物を買い取ってるから、経",
      "demand_question": "A｜でも、今どき着物を欲しがる人なんているの？",
      "demand": "B｜実はいま、海外でも“KIMONO”が注目されていて、インバウ",
      "tourists": "A｜確かに。観光地でも着物着た外国の方、多いわね。",
      "market_news": "B｜中古着物の業者間市場では、取引相場が1年前の約2倍になったと",
      "realization": "A｜私が着ないからって、もう誰も着ないわけじゃないのね",
      "channels": "B｜そう。バイセルは、買い取った着物を国内外の欲しい人に届ける販",
      "channels_value": "B｜価値を見極めて、次の買い手につなげられるから、査定額に差がつ",
      "difference_question": "A｜頼むところで、そんなに変わるもの？",
      "comparison": "B｜他社では5,000円と言われた着物が、バイセルでは21万円だ",
      "comparison_reaction": "A｜同じ着物で!? それなら、どこに見てもらうか大事ね",
      "also_accessories": "A｜そういえば、帯やかんざしも残ってるんだけど……",
      "case_invite": "B｜帯も査定してもらえるわよ。着物も小物も、実際の写真があるから",
      "q2": "A｜どんな実例があるのかしら。",
      "case_kimono": "B｜それだけじゃないの。この着物や帯には、160万1,000円の",
      "react_kimono": "A｜160万円!? ……母の着物も、自分で価値がないって決めちゃ",
      "case_obi": "B｜この袋帯も見て。細見華岳の袋帯など、着物数点で28万円になっ",
      "react_obi": "A｜帯も一緒に見てもらえるのね。着物に合わせていた帯も、残ってい",
      "case_accessory": "B｜かんざしセットなどの小物にも、13万8,500円の査定事例が",
      "react_accessory": "A｜かんざしにも、そんな価値があるの!? あの引き出しも確認しな",
      "case_obi_after_1": "B｜この袋帯も見て。細見華岳の袋帯など、着物数点で28万円になっ",
      "react_obi_after_1": "A｜帯も一緒に見てもらえるのね。着物に合わせていた帯も、残ってい",
      "case_accessory_after_1": "B｜かんざしセットなどの小物にも、13万8,500円の査定事例が",
      "react_accessory_after_1": "A｜かんざしにも、そんな価値があるの!? あの引き出しも確認しな",
      "case_kimono_after_2": "B｜それだけじゃないの。この着物や帯には、160万1,000円の",
      "react_kimono_after_2": "A｜160万円!? ……母の着物も、自分で価値がないって決めちゃ",
      "case_accessory_after_2": "B｜かんざしセットなどの小物にも、13万8,500円の査定事例が",
      "react_accessory_after_2": "A｜かんざしにも、そんな価値があるの!? あの引き出しも確認しな",
      "case_kimono_after_4": "B｜それだけじゃないの。この着物や帯には、160万1,000円の",
      "react_kimono_after_4": "A｜160万円!? ……母の着物も、自分で価値がないって決めちゃ",
      "case_obi_after_4": "B｜この袋帯も見て。細見華岳の袋帯など、着物数点で28万円になっ",
      "react_obi_after_4": "A｜帯も一緒に見てもらえるのね。着物に合わせていた帯も、残ってい",
      "case_accessory_after_3": "B｜かんざしセットなどの小物にも、13万8,500円の査定事例が",
      "react_accessory_after_3": "A｜かんざしにも、そんな価値があるの!? あの引き出しも確認しな",
      "case_obi_after_5": "B｜この袋帯も見て。細見華岳の袋帯など、着物数点で28万円になっ",
      "react_obi_after_5": "A｜帯も一緒に見てもらえるのね。着物に合わせていた帯も、残ってい",
      "case_kimono_after_6": "B｜それだけじゃないの。この着物や帯には、160万1,000円の",
      "react_kimono_after_6": "A｜160万円!? ……母の着物も、自分で価値がないって決めちゃ",
      "more_cases_1": "B｜他にも知りたい査定事例はある？",
      "more_cases_2": "B｜他にも知りたい査定事例はある？",
      "more_cases_4": "B｜他にも知りたい査定事例はある？",
      "more_cases_3": "B｜他にも知りたい査定事例はある？",
      "more_cases_5": "B｜他にも知りたい査定事例はある？",
      "more_cases_6": "B｜他にも知りたい査定事例はある？",
      "more_cases_7": "B｜気になる実例は、ひと通り見られたわね。",
      "know_first": "B｜見てもらわないと分からないものね",
      "nearby": "A｜でも、バイセルって近所にあったかしら？",
      "visit": "B｜お店まで持っていかなくていいの。出張査定なら、家まで来て見て",
      "heavy_fee": "A｜それは助かる！ 着物って、まとめると重いのよね。でも、来ても",
      "reply_fee": "B｜出張料・査定料・キャンセル料も無料よ",
      "treasured": "A｜でも、母がよく着ていた一枚は、まだ手放すか迷ってるの",
      "keep_it": "B｜それなら残していいのよ。査定額に納得できなければ、手放さなく",
      "relief": "A｜そうね。まず査定額を知れば、残すか手放すかも考えやすいわね",
      "campaign": "B｜しかも今月は、抽選で買取金額5倍キャンペーンもやってるのよ。",
      "callback": "A｜ホント!? じゃあ、さっきの「この着物いらない？」は、ちょっ",
      "first_appraisal": "B｜ふふっ。まずは査定してから、ね",
      "close": "A｜うん！ 着物も帯も小物も、まとめて相談してみるわ",
      "final_cta": "B｜スマホで30秒で申し込めるから、まずは査定額だけでも聞いてみ"
    }
  }
};

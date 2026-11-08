// 元サイトの「お客様の声」全14件を、掲載順に移行したデータ。
// sourceUrl は移行内容の照合用に保持する。
export type Voice = {
  slug: string;
  name: string;
  dateLabel: string;
  body: string;
  image: string;
  sourceUrl: string;
};

export const voices: readonly Voice[] = [
  {
    "slug": "customer0513",
    "name": "ミオ　さま",
    "dateLabel": "2022年5月",
    "body": "きっかけは、希望の土地の条件を満たしていたことでしたが、\n来店時に、須川社長が何通りか間取りを準備してくださっていて、\nその間取りが完璧だったからです。須川社長はじめ、吉田先生も\n見高さんも外構の方も皆様素晴らしく、本当に満足です。\n\n駐車場２台 ➡ 〇　　４LDK以上 ➡ ５LDK\nルーフバルコニー or スカイバルコニー ➡ スカイバルコニー",
    "sourceUrl": "https://www.c-shonan.co.jp/comments/customer0513.html",
    "image": "/images/voices/customer0513-thumb.jpg"
  },
  {
    "slug": "customer43",
    "name": "K　さま",
    "dateLabel": "2022年4月",
    "body": "気に入った土地がコミュニティ湘南さんの建築条件付きだった為。\n\n南面に開放感をもった広いLDスペースの確保を希望しました。\nバルコニーの位置やリビングを勾配天井にした事で、想像以上に\n南面の解放感が得られました。大満足です。\n\n社長をはじめ、設計の先生やハウスメーカーの担当者の方に\n何度もプラン変更や仕様の変更、要望に応えて頂いた事、\n本当にいろいろお世話になりありがとうございました。",
    "sourceUrl": "https://www.c-shonan.co.jp/comments/customer43.html",
    "image": "/images/voices/customer43-thumb.png"
  },
  {
    "slug": "customer12-",
    "name": "ベス　さま",
    "dateLabel": "2022年3月",
    "body": "気に入った土地が、コミュニティ湘南さんの建築条件付きだった為。地元で長く活動している不動産屋さんだったのでお願いしようと思いました。\n\n日当たりが良い、和室がある、木のぬくもりを感じたい等、ざっくりとした希望でしたが、色々と叶えられて満足しています。\n\n皆さんお人柄がとても良く、建築士の先生ともたくさん話をさせていただいたので、安心でした。",
    "sourceUrl": "https://www.c-shonan.co.jp/comments/customer12-.html",
    "image": "/images/voices/customer12--thumb.jpg"
  },
  {
    "slug": "customer11",
    "name": "Komame さま",
    "dateLabel": "2021年9月",
    "body": "初回訪問時、こちらの様々な要望を真摯に聞いて下さり、実現可能であることをしっかり説明して下さったこと。\n\n自分が考えたベースプランをなるべく忠実に形にしたかった。\nベースプランの実現たけでなく、住みやすさや耐久性等、プロのアドバイスも数多く入れていただき、期待以上の実現度だった。\n\n心温かい皆様に大変お世話になりました。",
    "sourceUrl": "https://www.c-shonan.co.jp/comments/customer11.html",
    "image": "/images/voices/customer11-thumb.png"
  },
  {
    "slug": "customer10",
    "name": "H さま",
    "dateLabel": "2021年6月",
    "body": "注文住宅のようなすてきな家だったからです。地域の物件を数多く取り扱っているとうかがい安心できました。\n\n駐車スペース有り、広いリビング、収納が多いこと、（特にリビング収納とパントリー）などを希望しておりました。\n\n上記が叶っただけでなく、シューズクローク、１階の洗面台、水色のアクセントクロスが特に気に入っていて、大変満足しております。\n\nこの度は、お世話になり有難うございました。\n今後とも宜しくお願い致します。",
    "sourceUrl": "https://www.c-shonan.co.jp/comments/customer10.html",
    "image": "/images/voices/customer10-thumb.png"
  },
  {
    "slug": "customer9",
    "name": "めちめちさま",
    "dateLabel": "2020年10月",
    "body": "なじみのある場所で、条件の合う土地があった為。\n社長さんがその土地、環境のことにくわしい方で、信用できた為です。\n\n子育てしやすい間取り、収納の多さにこだわっていましたが、すべて実現できました。\n\nインテリアコーディネーターがいたら、助かります。",
    "sourceUrl": "https://www.c-shonan.co.jp/comments/customer9.html",
    "image": "/images/voices/customer9-thumb.png"
  },
  {
    "slug": "customer8",
    "name": "スカイさま",
    "dateLabel": "2020年5月",
    "body": "地元で数多くの実績があり、施主のこだわりを形にしてきた実績から、御社に決めました。\n\n間取りは、気学を取り入れ、こだわりは、少ない建坪とは感じないような2階リビングの開放感と収納の確保でしたが、予算の範囲内でほぼ実現することができました。また、子どもが小さいため、2階リビングの階段に転落防止を兼ねた引き戸をとりつけたことと、隣家との視線を考慮した窓や壁の配置等細部まで提案・実現して頂き、大変満足しています。\n\n良かった点は、2階リビングです。勾配天井、下り壁、小上がり、ロフト、バルコニーの一体感はとても気に入っています。\n気づいた点は、リビング、キッチン等をひとつづきにカウンターやPCスペースを作ったため、収納の棚などを置く壁(スペース)があまりないことです。",
    "sourceUrl": "https://www.c-shonan.co.jp/comments/customer8.html",
    "image": "/images/voices/customer8-thumb.jpg"
  },
  {
    "slug": "customer7",
    "name": "しおしゃけさま",
    "dateLabel": "2020年5月",
    "body": "社長の人柄に後押しされて決めました。\n\nリビングを広くして家族が自然と集まれるようにしたかったです。\nとても満足のいく出来になりました。\n\n全ての条件がそろわなくても、縁とタイミングも大事だと思います。\nコミュニティ湘南、設計士の先生、住宅メーカーの担当の方とみんなで一緒につくったなという\n想いがあります。おかげで理想的な家になりました。",
    "sourceUrl": "https://www.c-shonan.co.jp/comments/customer7.html",
    "image": "/images/voices/customer7-thumb.png"
  },
  {
    "slug": "customer6",
    "name": "あつもりさま",
    "dateLabel": "2020年5月",
    "body": "希望の立地であった、注文住宅なみに希望を聞いて頂けた、担当、建築士さん、工務店の方、皆さん人柄が良かった。\n\n共働き、子育て世帯であったので、機能的(家事の負担が少ない)な家を希望していました。予算の範囲でかなり聞いてもらいました。\n何度も図面を直して頂きました。通常の建売では、ありえないと思う。\n\n自分達家族のライフスタイルに合った家をつくることが出来る(建物に合わせて生活するのではなく・・・）\n\n満足しています。ただ、細かい点、例えば「照明の位置がもう少し高いと良かった」「窓がもう少し大きいと良かった」などは、\n生活してから思うことはあります。",
    "sourceUrl": "https://www.c-shonan.co.jp/comments/customer6.html",
    "image": "/images/voices/customer6-thumb.jpg"
  },
  {
    "slug": "customer5",
    "name": "ぎーさま",
    "dateLabel": "2020年5月",
    "body": "建築士(吉田さん)の方に直接自分たちの希望をお伝えしながら、家を建てることに魅力を感じたから。\n\n2階リビングの家にしたので、開放感のある暮らしをしたくて、勾配天井にしてもらいました。また、シューズクロークやウォークインクローゼットなど、収納する場所を多く作ってもらいました。その他のことも含めて、ほぼ自分達の希望のつまった家を建てることができたと思います。\n\n親身になって相談にのってもらえたことが良かったです。ありがとうございました。",
    "sourceUrl": "https://www.c-shonan.co.jp/comments/customer5.html",
    "image": "/images/voices/customer5-thumb.jpg"
  },
  {
    "slug": "customer4",
    "name": "とのさま",
    "dateLabel": "2020年5月",
    "body": "最初は土地が希望する場所だった為でしたが、話を聞いているうちに建築士さんと一緒に納得できる間取りを決められたことが一番大きかったです。\n\nお風呂にこだわりました。他にも細かい所もありましたが、9割程は実現できたと思います。\n\n良かった点は、皆さん良く話を聞いて頂き、分からないことなどを詳しく丁寧に教えてくれました。",
    "sourceUrl": "https://www.c-shonan.co.jp/comments/customer4.html",
    "image": "/images/voices/customer4-thumb.png"
  },
  {
    "slug": "customer3",
    "name": "ハリーさま",
    "dateLabel": "2020年5月",
    "body": "建築条件付きの土地だった為。\n\n高齢者対応(バリアフリーなど)、シアタールーム、外観デザイン、採光など、こだわりがたくさんありましたが、ご紹介頂いた設計担当の吉岡さんと何度も相談させてもらった結果、私たちの理想を十分実現してもらえました。\n\n商売上、やむを得ないところですが、土地の区画販売においてもっと柔軟な対応があれば良かったかなと思います。\n(贅沢なお願いでしょうが………)",
    "sourceUrl": "https://www.c-shonan.co.jp/comments/customer3.html",
    "image": "/images/voices/customer3-thumb.png"
  },
  {
    "slug": "customer2",
    "name": "Y.Sさま",
    "dateLabel": "2020年5月",
    "body": "気になっていた場所(土地)の売主さんでした。\n\n場所、間取りや内装など、満足しています！！\n\n建築士の方、ハウスメーカーさんが決まっていましたが、どの担当の方もとても接しやすく、私たちの要望をプロの目線からアドバイスしてくれて良かったです！！皆さん、とても親切です！！",
    "sourceUrl": "https://www.c-shonan.co.jp/comments/customer2.html",
    "image": "/images/voices/customer2-thumb.jpg"
  },
  {
    "slug": "customer1",
    "name": "D.I.さま",
    "dateLabel": "2020年5月",
    "body": "土地が気に入り、紹介を受け対応も良かった為。\n\n希望は2Fリビング、バルコニー2か所、2台駐車スペース、ロフト全て実現出来ました。\n\n初回訪問時に間取図を描いて頂き、イメージが湧いたのが良かったです。",
    "sourceUrl": "https://www.c-shonan.co.jp/comments/customer1.html",
    "image": "/images/voices/customer1-thumb.jpg"
  }
];

export function getVoice(slug: string): Voice | undefined {
  const id = slug.endsWith(".html") ? slug.slice(0, -5) : slug;
  return voices.find((voice) => voice.slug === id);
}

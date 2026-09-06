// 現行サイト https://www.c-shonan.co.jp/ から 2026-09-05 に取得した実データ。
// 物件の販売状況・駐車場の空き状況は取得時点のスナップショット。

const IMG = "https://www.c-shonan.co.jp/global-image";

export const site = {
  name: "株式会社コミュニティ湘南",
  shortName: "コミュニティ湘南",
  tel: "0467-89-9811",
  telHref: "tel:0467899811",
  fax: "0467-89-9810",
  hours: "10:00〜16:00",
  closed: "毎週火曜日・水曜日",
  postal: "〒253-0085",
  address: "神奈川県茅ヶ崎市矢畑254-1",
  access: "JR東海道本線 茅ヶ崎駅 徒歩20分",
  parking: "計6台（店舗前2台、旧店舗向かい4台）",
  founded: "2000年2月",
  capital: "1,000万円",
  ceo: "須川 宣明",
  licenses: [
    "宅地建物取引業 神奈川県知事（3）第29447号",
    "一般建設業 神奈川県知事（般-2）第69917号",
  ],
  logo: `${IMG}/header/10-logo.png`,
  shopPhoto: `${IMG}/units/img/4173-5-20230112113403_b63bf719bb50af.JPG`,
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3254.7870927295667!2d139.3957083176778!3d35.33610814533931!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xad295704938765c7!2z77yI5qCq77yJ44Kz44Of44Ol44OL44OG44Kj5rmY5Y2X!5e0!3m2!1sja!2sjp!4v1673492156885!5m2!1sja!2sjp",
  currentUrl: "https://www.c-shonan.co.jp",
};

export const nav = [
  { label: "お知らせ", href: "/news/" },
  { label: "家創りのコンセプト", href: "/concept/" },
  { label: "売買物件", href: "/sale/" },
  { label: "賃貸物件", href: "/rent/" },
  { label: "施工事例", href: "/works/" },
  { label: "お客様の声", href: "/comments/" },
  { label: "会社案内", href: "/company/" },
] as const;

// 現行サイトのヒーローに使われている社長の言葉を、モックどおり一続きで表示する。
export const hero = {
  phrase: "豊かな自然の中で 大切な家族と紡ぐ かけがえのない時の流れ",
  slides: [
    {
      src: `${IMG}/units/img/1530-13-20191030165417_b5db941a982a97.jpg`,
      alt: "茅ヶ崎の砂浜と青い空。遠くに江の島が見える",
    },
    {
      src: `${IMG}/units/img/1639-11-20191108171915_b5dc525030d08c.jpg`,
      alt: "茅ヶ崎の海岸から望む江の島とサーファーたち",
    },
    {
      src: `${IMG}/units/img/1530-14-20191030165417_b5db941a983016.jpg`,
      alt: "茅ヶ崎の海に浮かぶ烏帽子岩",
    },
  ],
};

export const concept = {
  photos: [
    { src: `${IMG}/units/img/5279-15-20191219162420_b5dfb25a47a895.jpg`, alt: "茅ヶ崎市下寺尾 U様邸のLDK", caption: "茅ヶ崎市下寺尾 U様邸。1階LDKの吹き抜けを、2階の回廊が囲む" },
    { src: `${IMG}/units/img/4638-16-20191206023713_b5de940499cf62.jpg`, alt: "茅ヶ崎市中海岸 N様邸のリビングダイニング", caption: "茅ヶ崎市中海岸 N様邸。ロフトを含めた、ゆったりとした大空間" },
    { src: `${IMG}/units/img/5279-17-20191219162420_b5dfb25a47b79d.jpg`, alt: "茅ヶ崎市下寺尾 U様邸のLDKを別角度から", caption: "茅ヶ崎市下寺尾 U様邸。無垢材の床と、光の入る大きな窓" },
    { src: `${IMG}/units/img/10249-10-20210823155914_b61234742609c0.jpg`, alt: "茅ケ崎市東海岸 N様邸の外観", caption: "茅ケ崎市東海岸 N様邸。湘南の青空に映えるアメリカンスタイル" },
  ],
  items: [
    {
      title: "建築家と創る、こだわりの家",
      body: "センスと実力を備えた建築家と、納得いくまで間取りを相談できます。設計料の目安は建物価格の約1割ですが、その負担を大幅に軽減してご提供しています。",
    },
    {
      title: "設計から完成まで、建築士が一貫サポート",
      body: "工事担当者に任せきりにせず、建築士が設計どおりに施工されているかを確認し、必要に応じて現場へ指示します。完成後の不具合にも責任をもって対応します。",
    },
    {
      title: "地震・火災に強い構造",
      body: "耐震等級3、省令準耐火構造の住宅を多数施工しています。地震保険・火災保険の割引対象となり、地盤保証は20年です。",
    },
  ],
};

// 建築家の言葉（コンセプトページの実文）と手書き署名
export const architect = {
  house: `${IMG}/units/img/7942-5-20200207101750_b5e3cbabe744a4.jpg`,
  houseAlt: "建築家と創った住まいの外観",
  houseCaption: "建築家との協業で建てた住まい。",
  quote: ["建築は丈夫でなければならない。", "機能的でなければならない。", "美しくなければならない。"],
  body: "建物の敷地は、世界で唯一その場所だけです。その場所のポテンシャルをしっかり把握して、住まう人の考えと融合させる。敷地を読む、環境を読む、居心地を考える。いつも心がけています。",
  signature: `${IMG}/units/img/7947-5-20220509115412_b627882545cd4e.png`,
  signatureAlt: "吉田靖の署名",
  title: "一級建築士",
};

// 実績の数字（会社案内・コンセプトページに記載の数値）
export const facts = [
  { value: 26, unit: "年", note: "2000年の創業から、茅ヶ崎で" },
  { value: 200, unit: "棟以上", note: "一級建築士とともに手がけた住まい" },
  { value: 3, prefix: "等級", unit: "", note: "最高ランクの耐震等級を多数施工" },
];

export const featured = {
  status: "販売中",
  dealType: "売主物件",
  title: "茅ヶ崎市矢畑売地 小島矢畑B区画",
  href: "/sale/yabata124koji.html",
  price: "2,780万円",
  image: `${IMG}/page/632-20260126143808.png`,
  imageAlt: "茅ヶ崎市矢畑 小島矢畑B区画の現地",
  body: "整形地で日当たり良好。スーパーやコンビニが徒歩圏にあり、子育て世代にも便利な生活環境です。",
  specs: [
    { label: "土地面積", value: "135.17㎡（40.88坪）" },
    { label: "交通", value: "JR東海道線 茅ヶ崎駅 徒歩22分" },
    { label: "用途地域", value: "第1種中高層住居専用地域" },
    { label: "種別", value: "建築条件付売地" },
  ],
};

export const works = [
  {
    title: "茅ケ崎市東海岸 N様邸",
    body: "湘南の青空に映える、アメリカンスタイルの住まい",
    image: `${IMG}/units/img/10249-10-20210823155914_b61234742609c0.jpg`,
    href: "/works/20210823.html",
  },
  {
    title: "茅ヶ崎市下寺尾 U様邸",
    body: "1階LDKの大きな吹き抜けを、2階の回廊が囲む",
    image: `${IMG}/units/img/5279-10-20191217202541_b5df8bb35ead4f.jpg`,
    href: "/works/10.html",
  },
  {
    title: "茅ヶ崎市中海岸 N様邸",
    body: "ロフトを含めた、ゆったりとした大空間",
    image: `${IMG}/units/img/4638-16-20191206023713_b5de940499cf62.jpg`,
    href: "/works/14.html",
  },
  {
    title: "茅ケ崎市矢畑A号棟 Y様邸",
    body: "2棟同時に計画し、通風・採光・眺望を両立",
    image: `${IMG}/units/img/9167-10-20200829120339_b5f49c58b2d65f.jpg`,
    href: "/works/16.html",
  },
  {
    title: "茅ヶ崎市矢畑 H様邸",
    body: "インナーガレージのある都市型住宅",
    image: `${IMG}/units/img/12847-11-20251025121137_b68fc3fe9c270b.JPG`,
    href: "/works/2025ybl88.html",
  },
  {
    title: "茅ケ崎市西久保 新築戸建て",
    body: "高い天井と、リビングと一体のフルフラットバルコニー",
    image: `${IMG}/page/424-20201101144725.jpg`,
    href: "/works/202103.html",
  },
];

export const voices = [
  {
    name: "ミオ さま",
    when: "2022年5月 ご新築",
    quote:
      "きっかけは、希望の土地の条件を満たしていたことでしたが、来店時に須川社長が何通りか間取りを準備してくださって…",
    image: `${IMG}/page/535-20220513161430.jpg`,
  },
  {
    name: "あつもり さま",
    when: "2020年5月 ご新築",
    quote:
      "希望の立地であった、注文住宅並みに希望を聞いて頂けた、担当、建築士さん、工務店の方、みなさん人柄が良かった。",
    image: `${IMG}/page/403-20200628125959.jpg`,
  },
  {
    name: "しおしゃけ さま",
    when: "2020年5月 ご新築",
    quote:
      "社長の人柄に後押しされて決めました。リビングを広くして家族が自然と集まれるようにしたかったです。とても満足…",
    image: `${IMG}/page/406-20200628133011.png`,
  },
];

export const rentals = [
  {
    title: "シャトー太田弐番館 101号室",
    category: "居住用",
    body: "閑静な住宅街にあるテラスハウス。専用庭付き、駐車スペースあり。",
    href: "/rent/sya10ri9z3xj.html",
  },
  {
    title: "IR貸家",
    category: "居住用",
    body: "中庭付きで収納豊富な貸家。5年定期での募集。海と駅どちらも近い立地。",
    href: "/rent/eastcoast.html",
  },
  {
    title: "ウィステリア101号室",
    category: "貸事務所・貸店舗",
    body: "収納豊富でLDKは12帖と広々。スーパーやコンビニも徒歩圏内。",
    href: "/rent/140074-1-101.html",
  },
];

export const parkingLots = [
  { name: "萩園駐車場", address: "茅ヶ崎市萩園2329-5", price: "7,000円/月", vacancy: 2 },
  { name: "松林駐車場（3か所）", address: "茅ヶ崎市松林2丁目・3丁目", price: "7,000円/月", vacancy: 5 },
  { name: "鶴嶺駐車場", address: "茅ヶ崎市浜之郷中谷338-9", price: "7,000円/月", vacancy: 1 },
  { name: "みずき駐車場", address: "茅ヶ崎市みずき2-18-11", price: "5,000円/月", vacancy: 1 },
  { name: "中谷駐車場", address: "茅ヶ崎市浜之郷中谷340", price: "8,000円/月", vacancy: 0 },
];

export const news = [
  { date: "2026.07.25", title: "夏季休暇について", href: "/news/2026svc.html", tag: "お知らせ" },
  { date: "2026.06.26", title: "石川矢畑NO6 お蔭様でご成約となりました", href: "/news/yabata2652.html", tag: "売買" },
  { date: "2026.04.10", title: "岡田貸家 お申込みを頂きました", href: "/news/samoka3581renta.html", tag: "賃貸" },
  { date: "2026.03.29", title: "月極駐車場空き状況について", href: "/news/2512parking-copy-copy.html", tag: "駐車場" },
  { date: "2026.03.21", title: "岡田貸家 募集中です", href: "/news/samoka3581rent.html", tag: "賃貸" },
];

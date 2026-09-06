import Image from "next/image";
import Link from "next/link";
import { IMG, SubpageFrame } from "./Shared";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-[13px] tracking-[0.12em] text-accent">{children}</p>;
}

function ConceptTitle({ children, id }: { children: React.ReactNode; id?: string }) {
  return <h2 id={id} className="text-[clamp(29px,3.4vw,46px)] leading-[1.55]">{children}</h2>;
}

const faqs = [
  ["建築費用はどのくらいかかりますか？", "コミュニティ湘南には、独自に定めた住宅の標準仕様があります。社長がお客様の状況に合う住宅ローンの見積もりと資金計画を検討しますので、気軽にご相談ください。", "標準仕様に含まれない設備や素材をご希望の場合も、満足いただける形を目指して丁寧に対応します。"],
  ["建築相談には費用がかかりますか？", "建築のご相談に費用はかかりません。", "参考プランを作成するため、建てられる建物のおおよその規模や間取りを確認したうえで、計画を進めるかどうかをご判断いただけます。"],
  ["建築期間はどのくらいですか？", "基本プランとなる間取りが決まった後に地盤調査を行い、結果に応じて地盤改良工事を実施します。その後、建築確認の手続きを経て着工します。", "基本プランの決定から着工までは、おおむね1か月が目安です。耐震等級3を取得する場合は、さらに約1か月を見込みます。着工後の工期は4〜5か月程度です。"],
  ["コミュニティ湘南が施工した新築住宅を訪問できますか？", "これまで多くのお客様が、当社で先に住まいを建てられた施主様のお宅を訪問しています。実際の住み心地や家づくりの感想を施主様から直接聞くことは、これから間取りを考えるうえで大変参考になります。", "元サイトでは、感染症対策期間中は施主様宅への訪問を控え、モデルハウスをご案内している旨も掲載しています。"],
  ["完成後もメンテナンスやリフォームを依頼できますか？", "完成時にはお客様ご自身による施主検査を行っていただいたうえで、住まいをお引き渡しします。実際に暮らし始めてから気づく点もあるため、完成後も責任を持って対応します。", ""],
] as const;

const levels = [
  { image: `${IMG}/units/img/5670-5-20191222124033_b5dfee5b103c52.png`, alt: "耐震等級1", title: "建築基準法（2000年基準）", texts: ["数百年に一度発生する震度6強から震度7程度の地震で、倒壊や崩壊を防ぐことを想定した基準です。", "数十年に一度発生する震度5強程度の地震では、損傷を防ぐ効果があるとされ、一般住宅の耐震性に相当します。"] },
  { image: `${IMG}/units/img/5671-5-20191222124049_b5dfee5c12ce20.png`, alt: "耐震等級2", title: "長期優良住宅認定基準", texts: ["耐震等級1で想定する地震の1.25倍の強さに耐えられる基準です。", "避難所として使われる病院や学校などと同程度の耐震性に相当します。"] },
  { image: `${IMG}/units/img/5672-5-20191222124104_b5dfee5d03245f.png`, alt: "耐震等級3", title: "最高レベル", texts: ["耐震等級1で想定する地震の1.5倍の強さに耐えられる基準です。", "消防署や警察署など、防災拠点となる建物と同程度の耐震性に相当し、地震保険の割引対象になります。"] },
] as const;

export function ConceptPage() {
  return (
    <SubpageFrame hero={{ title: "コンセプト", label: "Concept", lead: <><span className="block">一棟ずつ、向き合う。</span><span>私たちが大切にしていること。</span></>, image: `${IMG}/units/img/7942-5-20200207101750_b5e3cbabe744a4.jpg`, imageAlt: "光が差し込むコミュニティ湘南の住まい", imagePosition: "center 54%" }}>
      <nav className="overflow-x-auto border-b border-line bg-white/70" aria-label="コンセプトページ内"><ul className="mx-auto flex w-max min-w-full max-w-[1280px] justify-center px-5 md:px-6">{[["#philosophy","私たちの家づくり"],["#architect","建築家の家"],["#gratitude","感謝会"],["#faq","家づくりのQ&A"]].map(([href,label]) => <li key={href}><Link href={href} className="block min-w-[152px] px-5 py-5 text-center hover:text-accent">{label}</Link></li>)}</ul></nav>

      <section id="philosophy" className="scroll-mt-20 px-5 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-8 md:grid-cols-[0.85fr_1fr] md:items-end md:gap-20"><div><Eyebrow>Our philosophy</Eyebrow><ConceptTitle id="philosophy-title">住み心地を決めるのは、<br />予算より良いプランニング。</ConceptTitle></div><p className="leading-[2.05] text-muted">大切なのは、予算をかけることよりも、家族の暮らしを丁寧に考えること。光や風、家事の動線、これから変わっていく家族の時間まで見つめ、限られた条件の中から、そのご家族にとって心地よい答えを探します。</p></div>
          <div className="mt-14 grid grid-cols-[minmax(0,1fr)_34%] items-end gap-3 md:mt-20 md:gap-5"><figure className="relative h-[330px] overflow-hidden md:h-[clamp(420px,48vw,660px)]"><Image src={`${IMG}/units/img/5279-15-20191219162420_b5dfb25a47a895.jpg`} alt="家族が集う明るいリビング" fill sizes="70vw" className="object-cover" /></figure><figure className="relative mb-[-30px] h-[205px] overflow-hidden md:mb-[-64px] md:h-[clamp(270px,31vw,420px)]"><Image src={`${IMG}/units/img/10249-10-20210823155914_b61234742609c0.jpg`} alt="木の素材を生かした住まいの空間" fill sizes="34vw" className="object-cover" /></figure></div>
        </div>
      </section>

      <section className="bg-tint/80 px-5 py-20 md:px-6 md:py-28" aria-labelledby="principles-title"><div className="mx-auto max-w-[1280px]"><Eyebrow>Our commitments</Eyebrow><ConceptTitle id="principles-title">一棟ずつ、向き合う。<br />私たちが大切にしていること。</ConceptTitle><div className="mt-12 border-t border-[#cfdbe2] md:mt-16">
        <article className="grid gap-5 border-b border-[#cfdbe2] py-8 md:grid-cols-[60px_0.75fr_1fr] md:gap-9"><p className="text-[14px] text-accent">01</p><h3 className="text-[clamp(20px,2vw,27px)] leading-[1.65]">建築家と創る、<br />こだわりの憩いの家</h3><div className="space-y-4 leading-[2.05] text-muted"><p>心地よく暮らすための工夫と、細部まで建築主の思いが行き届いた憩いの家を目指しています。そのために大切なことは、センス、実力、人柄を備えた建築家との出会いです。</p><p>建築家へ設計を依頼する場合の設計料の目安は、建物価格の約1割であり、「負担が増えてしまう」とお考えの方も多いと思います。</p><p><strong className="font-bold text-fg">コミュニティ湘南では、建築家へ直接依頼した場合とほぼ同じ設計のプロセスを、お客様の負担を大きく抑えた形でご提供しています。</strong></p><p>デザイナーズハウスやカリフォルニアスタイルの住宅、無垢材と珪藻土を取り入れた自然素材の住宅など、工夫を凝らした住まいを数多く施工しています。</p></div></article>
        <article className="grid gap-5 border-b border-[#cfdbe2] py-8 md:grid-cols-[60px_0.75fr_1fr] md:gap-9"><p className="text-[14px] text-accent">02</p><h3 className="text-[clamp(20px,2vw,27px)] leading-[1.65]">設計から完成まで、<br />建築士が一貫サポート</h3><div className="space-y-4 leading-[2.05] text-muted"><p>建築士が設計の段階から完成、引き渡しまで一貫してお客様を支えます。</p><p>工事担当者に任せきりにせず、設計どおりに施工されているかを建築士が確認し、必要に応じて工事担当者へ指示します。</p><p>センスと実力を持つ建築家と、豊富な経験と高い技術力を持つ建築会社。それぞれの力を生かせるようチームワークを整え、一棟ずつ丹念に形にしていきます。</p><p><strong className="font-bold text-fg">当社で住まいを建てられたお客様から高い満足をいただいていることを、私たちの誇りとしています。</strong></p></div></article>
        <article className="grid gap-5 border-b border-[#cfdbe2] py-8 md:grid-cols-[60px_0.75fr_1fr] md:gap-9"><p className="text-[14px] text-accent">03</p><h3 className="text-[clamp(20px,2vw,27px)] leading-[1.65]">地震・火災に強い構造</h3><div className="space-y-4 leading-[2.05] text-muted"><p>地震や火災などの災害に備えた家づくりにも力を入れています。お客様のご希望に合わせて、次の仕様に対応しています。</p><ul className="space-y-2 text-fg"><li>・<strong>耐震等級3の構造基準を取得した住宅</strong></li><li>・<strong>省令準耐火構造の住宅</strong></li><li>・<strong>20年間の地盤保証</strong></li></ul><p>耐震等級3と省令準耐火構造の住宅は、地震保険や火災保険の大幅な割引対象になります。耐震等級の詳しい内容は、ページ下部の「家づくりのQ&A」でご案内しています。</p></div></article>
      </div></div></section>

      <section id="architect" className="scroll-mt-20 px-5 py-20 md:px-6 md:py-28"><div className="mx-auto grid max-w-[1280px] gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-20"><figure className="relative h-[380px] overflow-hidden md:h-[clamp(480px,51vw,680px)]"><Image src={`${IMG}/units/img/5279-17-20191219162420_b5dfb25a47b79d.jpg`} alt="建築家とつくる開放的な住空間" fill sizes="(max-width:767px) 100vw, 52vw" className="object-cover" /></figure><div><Eyebrow>Architect&apos;s words</Eyebrow><ConceptTitle id="architect-title">建築家の家</ConceptTitle><blockquote className="my-7 whitespace-nowrap font-hand text-[clamp(18px,calc(15px+1vw),30px)] leading-[1.9] tracking-[0.04em] text-accent">建築は丈夫でなければならない。<br />機能的でなければならない。<br />美しくなければならない。</blockquote><div className="space-y-4 leading-[2.05] text-muted"><p>「美しいものだけが機能的である」と語った建築家もいます。言葉そのものを見ても、その奥にある意味を考えても、建築という空間はとても奥深いものです。</p><p>数学だけでも文学だけでも答えにはたどり着けません。さまざまな知恵と創造を重ねることで、初めて一つの形になっていきます。</p><p>建物の敷地は、世界に一つしかない場所です。その場所が持つ可能性を丁寧に捉え、住まう人の考えと重ね合わせます。</p><p>敷地を読み、環境を読み、居心地を考えることを、いつも心がけています。コミュニティ湘南との協働で手がけた住まいは、すでに200棟を超えています。</p></div><div className="mt-7 flex items-center justify-end gap-4"><span className="text-[13px] text-muted">一級建築士</span><Image src={`${IMG}/units/img/7947-5-20220509115412_b627882545cd4e.png`} alt="建築家署名" width={142} height={46} /></div></div></div></section>

      <section id="gratitude" className="scroll-mt-20 bg-tint/80 px-5 py-20 md:px-6 md:py-28"><div className="mx-auto grid max-w-[1280px] gap-10 md:grid-cols-[1.05fr_0.75fr] md:items-center md:gap-20"><div className="grid grid-cols-[1.25fr_0.75fr] items-end gap-3"><figure className="relative h-[300px] overflow-hidden md:h-[480px]"><Image src={`${IMG}/units/img/5026-5-20191218114007_b5df991871aa14.jpg`} alt="住まい手の皆さまが集う感謝会" fill sizes="50vw" className="object-cover" /></figure><figure className="relative mb-[-28px] h-[190px] overflow-hidden md:mb-[-54px] md:h-[310px]"><Image src={`${IMG}/units/img/5026-6-20191218114007_b5df991871b8c7.jpg`} alt="感謝会で交流するご家族" fill sizes="30vw" className="object-cover" /></figure></div><div><Eyebrow>Gratitude gathering</Eyebrow><ConceptTitle id="gratitude-title">家が完成してからも、<br />続いていくお付き合い。</ConceptTitle><p className="mt-7 leading-[2.05] text-muted">お引き渡しは、関係の終わりではありません。住まい手の皆さまをお招きして感謝会を開き、家づくりの思い出や新しい暮らしを語り合ってきました。困ったときにいつでも顔を思い出していただける、地域の身近な存在でありたいと考えています。</p></div></div></section>

      <section id="faq" className="scroll-mt-20 px-5 py-20 md:px-6 md:py-28"><div className="mx-auto max-w-[1280px]"><div className="mb-12 grid gap-6 md:grid-cols-[0.72fr_1fr] md:items-end md:gap-16"><div><Eyebrow>Questions and answers</Eyebrow><ConceptTitle id="faq-title">家づくりのQ&A</ConceptTitle></div><p className="leading-[2.05] text-muted">初めての家づくりで気になることをまとめました。ここにない疑問も、どうぞ気兼ねなくご相談ください。</p></div><div className="border-t border-line">
        {faqs.map(([question, answer, note]) => <details key={question} className="group border-b border-line"><summary className="cursor-pointer list-none py-6 pr-10 text-[17px] leading-[1.75] marker:hidden before:mr-6 before:text-accent before:content-['Q'] group-open:text-accent">{question}</summary><div className="space-y-4 pb-7 pl-10 pr-2 leading-[2.05] text-muted md:pl-12 md:pr-14"><p>{answer}</p>{note ? <p className="text-[14px]">{note}</p> : null}</div></details>)}
        <details className="group border-b border-line"><summary className="cursor-pointer list-none py-6 pr-10 text-[17px] leading-[1.75] marker:hidden before:mr-6 before:text-accent before:content-['Q'] group-open:text-accent">耐震性能はどのようになっていますか？</summary><div className="space-y-6 pb-7 pl-10 pr-2 leading-[2.05] text-muted md:pl-12 md:pr-14"><p>耐震等級は建築基準法に基づく住宅性能表示制度の指標です。建物が地震にどの程度耐えられるかを、壁の量や配置などから評価し、3段階で示します。</p><div className="w-full max-w-[872px] overflow-hidden" aria-label="耐震等級の違い">{levels.map((level) => <section key={level.alt} className="grid items-center gap-4 py-5 sm:grid-cols-[207px_1fr]"><Image src={level.image} alt={level.alt} width={207} height={170} className="h-auto w-[min(58%,180px)] object-contain sm:w-[207px]" /><div className="space-y-1.5"><h3 className="text-[18px] leading-[1.6] text-[#0099dc]">{level.title}</h3>{level.texts.map((text) => <p key={text} className="text-[14px] leading-[1.85] text-fg">{text}</p>)}</div></section>)}</div><p>最高レベルの耐震等級3を希望されるお客様は増えています。当社でも耐震等級3を取得した住まいを多数施工し、お客様から好評をいただいています。</p></div></details>
      </div></div></section>
    </SubpageFrame>
  );
}

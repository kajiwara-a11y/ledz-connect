/* ============================================================
   LEDZ Connect — 詳細画面モジュール
   サブ項目ごとに「固有の内容」を持つ画面を描画する。
   行クリックで詳細モーダル。AIは機能ごとに専用UI。通知ベルも動作。
   （データはデモ用のサンプル）
   ============================================================ */

const P=(cls,t,dot)=>`<span class="pill ${cls}">${dot!==false?'<span class="d"></span>':''}${t}</span>`;
const strip=h=>String(h).replace(/<[^>]*>/g,'').trim();
const NUM=v=>`<span style="font-variant-numeric:tabular-nums">${v}</span>`;

/* ====== サブ項目ごとの画面定義 ====== */
function getScreen(catId,idx,sub){
  switch(catId){

  /* ---------- 在庫・物流 ---------- */
  case 'logi': return [
    {kpis:[{l:'総SKU',v:'18'},{l:'在庫あり',v:'14'},{l:'残少',v:'3'},{l:'受注生産',v:'1'}],
     cols:['型番','商品','在庫数','区分','ロケーション'],
     rows:PRODUCTS.slice(0,8).map(p=>[`<b>${p.sku}</b>`,p.name,NUM(p.stock.toLocaleString()),p.stock===0?P('warn','受注生産'):p.stock<80?P('warn','残'+p.stock):P('ok','在庫あり'),'朝霞DC A-'+(10+(p.sku.length%9))])},
    {kpis:[{l:'入荷予定',v:'5'},{l:'今週',v:'3'},{l:'遅延',v:'0'}],
     cols:['入荷予定日','型番','数量','仕入先','状態'],
     rows:[['2026-06-08','ERK-1041',NUM('120'),'本社工場',P('ok','確定')],['2026-06-10','ERX-9001',NUM('40'),'協力工場B',P('warn','調整中')],['2026-06-12','ERG-5512',NUM('80'),'本社工場',P('ok','確定')],['2026-06-15','FX-LITE-CTL',NUM('30'),'協力工場A',P('ok','確定')]]},
    {kpis:[{l:'本日出荷',v:'12'},{l:'当日便',v:'8'},{l:'翌日便',v:'4'}],
     cols:['出荷予定日','注文番号','届け先','数量','便'],
     rows:[['2026-06-02','SO-204790','◯◯電材 朝霞',NUM('24'),'当日便'],['2026-06-02','SO-204655','△△商会 大宮',NUM('16'),'当日便'],['2026-06-03','SO-204812','□□電気 川越',NUM('8'),'翌日便']]},
    {kpis:[{l:'追跡中',v:'6'},{l:'配送中',v:'4'},{l:'到着予定 本日',v:'2'}],
     cols:['注文番号','届け先','現在地','状態','到着予定'],
     rows:[['SO-204790','◯◯電材 朝霞','さいたま中継',P('info','配送中'),'06-02 午前'],['SO-204655','△△商会 大宮','配達店',P('warn','配達中'),'06-02 午後'],['SO-204700','□□電気 川越','—',P('ok','配達完了'),'06-01']]},
    {kpis:[{l:'回答待ち',v:'3'},{l:'回答済',v:'12'},{l:'平均納期',v:'18日'}],
     cols:['型番','商品','数量','回答納期','状態'],
     rows:[['ERX-9001','マルチローポール アウトドア',NUM('40'),'2026-06-28',P('warn','回答待ち')],['ERE-2200','高天井用LED',NUM('20'),'2026-06-20',P('ok','回答済')],['SYN-MOD','Synca 調光調色モジュール',NUM('60'),'2026-06-14',P('ok','回答済')]]},
    {kpis:[{l:'登録配送先',v:'42'},{l:'本社',v:'1'},{l:'拠点',v:'41'}],
     cols:['届け先名','住所','担当','区分'],
     rows:[['◯◯電材 朝霞本店','埼玉県朝霞市本町1-16','梶原',P('info','本店')],['◯◯電材 大宮支店','さいたま市大宮区…','梶原',P('mut','支店')],['現場：A工務店新社屋','東京都新宿区…','田中',P('mut','現場直送')]]},
    {kpis:[{l:'分納案件',v:'4'},{l:'進行中',v:'2'},{l:'完了',v:'2'}],
     cols:['注文番号','分納回','数量','予定日','状態'],
     rows:[['SO-204790','1/3',NUM('8'),'2026-06-02',P('ok','出荷済')],['SO-204790','2/3',NUM('8'),'2026-06-09',P('warn','準備中')],['SO-204790','3/3',NUM('8'),'2026-06-16',P('mut','予定')]]},
    {kpis:[{l:'当月出荷',v:'128件'},{l:'出荷金額',v:'¥18.4M'},{l:'返品',v:'1件'}],
     cols:['出荷日','注文番号','数量','便','金額'],
     rows:[['2026-05-25','SO-204790',NUM('24'),'当日便',NUM('¥258,720')],['2026-05-21','SO-204655',NUM('16'),'当日便',NUM('¥147,840')],['2026-05-18','SO-204600',NUM('40'),'翌日便',NUM('¥744,000')]]},
  ][idx];

  /* ---------- ドキュメント ---------- */
  case 'doc':{
    const fmtMap=['PDF','PDF','DWG','PDF','IES','PDF','PDF','RFA','PDF','PDF','PDF'];
    const fmt=fmtMap[idx]||'PDF';
    return {dl:true,
      kpis:[{l:'対象型番',v:'7,800'},{l:'形式',v:fmt},{l:'新製品',v:'3,608'},{l:'更新',v:'2024-04'}],
      cols:['型番','商品','形式','サイズ','更新日'],
      rows:PRODUCTS.slice(0,7).map((p,i)=>[`<b>${p.sku}</b>`,p.name,P('mut',fmt,false),NUM((0.4+i*0.7).toFixed(1)+'MB'),`2026-0${(i%5)+1}-1${i%9}`])};
  }

  /* ---------- 要望・VOC ---------- */
  case 'voc': return [
    {kpis:[{l:'総投稿',v:'24'},{l:'対応中',v:'6'},{l:'反映済',v:'3'}],
     cols:['投稿日','代理店','内容','状態'],
     rows:[['2026-05-30','◯◯電材','受発注画面に納期表示が欲しい',P('warn','対応中')],['2026-05-28','△△商会','スリムタイプの間接照明を増やして',P('info','検討中')],['2026-05-22','◇◇工業','CADを一括DLしたい',P('ok','反映済')]]},
    {kpis:[{l:'改善提案',v:'18'},{l:'採用',v:'5'},{l:'検討中',v:'7'}],
     cols:['提案日','起案','テーマ','評価','状態'],
     rows:[['2026-05-29','◯◯電材','配送追跡の通知',P('info','★★★'),P('warn','検討中')],['2026-05-20','社内','見積テンプレ追加',P('info','★★★★'),P('ok','採用')],['2026-05-12','△△商会','在庫アラート',P('info','★★'),P('mut','受付')]]},
    {kpis:[{l:'評価件数',v:'312'},{l:'平均',v:'4.3'},{l:'今月',v:'28'}],
     cols:['型番','商品','評価','コメント','投稿日'],
     rows:[['ERD-7720W','グレアレスダウンライト',P('ok','★4.6'),'グレアレスで現場好評','2026-05-27'],['SYN-MOD','Synca 調光調色',P('ok','★4.8'),'調色が自然','2026-05-24'],['ERS-6021B','Twin Beam スポット',P('warn','★3.9'),'取付に工夫が必要','2026-05-20']]},
    {kpis:[{l:'回答数',v:'186'},{l:'満足',v:'72%'},{l:'回答率',v:'58%'}],
     cols:['調査名','配信','回答数','満足度','期間'],
     rows:[['2026 上期 取引満足度',NUM('320'),NUM('186'),P('ok','72%'),'05/01-05/20'],['配送品質調査',NUM('210'),NUM('132'),P('ok','81%'),'04/01-04/15'],['Webポータル使用感',NUM('150'),NUM('64'),P('warn','64%'),'03/10-03/25']]},
    {kpis:[{l:'実施中',v:'2'},{l:'回答',v:'248'},{l:'締切間近',v:'1'}],
     cols:['アンケート','対象','回答','締切','状態'],
     rows:[['新製品ニーズ調査','全代理店',NUM('128'),'2026-06-10',P('info','実施中')],['展示会満足度','来場者',NUM('120'),'2026-06-05',P('warn','締切間近')]]},
    {kpis:[{l:'NPS',v:'+32'},{l:'推奨者',v:'48%'},{l:'中立',v:'36%'},{l:'批判者',v:'16%'}],
     chartTitle:'NPS 推移',chart:[{label:'2025 上期',v:21,disp:'+21'},{label:'2025 下期',v:28,disp:'+28'},{label:'2026 上期',v:32,disp:'+32'}],
     cols:['期','回答数','NPS','推奨者','批判者'],
     rows:[['2026 上期',NUM('186'),P('ok','+32'),'48%','16%'],['2025 下期',NUM('204'),P('ok','+28'),'45%','17%'],['2025 上期',NUM('190'),P('warn','+21'),'41%','20%']]},
  ][idx];

  /* ---------- コミュニティ ---------- */
  case 'comm': return [
    {kpis:[{l:'スレッド',v:'342'},{l:'今週',v:'28'},{l:'参加',v:'1,204'}],
     cols:['スレッド','カテゴリ','投稿者','返信','最終更新'],
     rows:[['Synca の現場調色テクニック',P('mut','設計',false),'梶谷設計',NUM('12'),'2時間前'],['高天井LEDの放熱対策',P('mut','施工',false),'北電工事',NUM('8'),'昨日'],['店舗演出のグレアレス活用',P('mut','設計',false),'アトリエM',NUM('17'),'3日前']]},
    {kpis:[{l:'質問',v:'520'},{l:'解決',v:'89%'},{l:'未解決',v:'58'}],
     cols:['質問','タグ','回答数','状態','投稿日'],
     rows:[['Smart LEDZ の同時接続上限は？',P('mut','制御',false),NUM('4'),P('ok','解決'),'2026-05-30'],['IESデータの読み込み方法',P('mut','設計',false),NUM('2'),P('ok','解決'),'2026-05-28'],['レースウェイ施工の効率化',P('mut','施工',false),NUM('1'),P('warn','回答待ち'),'2026-05-26']]},
    {kpis:[{l:'メンバー',v:'430'},{l:'設計事務所',v:'186'},{l:'今月投稿',v:'42'}],
     cols:['投稿','事務所','種別','いいね','投稿日'],
     rows:[['オフィス照度設計の勘所','梶谷設計',P('mut','ナレッジ',false),NUM('34'),'2026-05-29'],['Synca 演色の事例共有','アトリエM',P('mut','事例',false),NUM('21'),'2026-05-25']]},
    {kpis:[{l:'ノウハウ',v:'168'},{l:'動画',v:'24'},{l:'今月',v:'9'}],
     cols:['タイトル','工種','形式','閲覧','投稿日'],
     rows:[['配線ダクト施工の標準手順','電気',P('mut','動画',false),NUM('1.2k'),'2026-05-22'],['防水器具のシーリング','屋外',P('mut','記事',false),NUM('860'),'2026-05-18']]},
  ][idx];

  /* ---------- ポイント・会員 ---------- */
  case 'point': return [
    {kpis:[{l:'保有',v:(DB.points||0).toLocaleString()},{l:'今月獲得',v:'421'},{l:'累計',v:'48,200'}],
     cols:['日付','区分','内容','ポイント'],
     rows:[['2026-05-25','獲得','受注 SO-204790',`<b style="color:var(--ok)">+264</b>`],['2026-05-21','獲得','受注 SO-204655',`<b style="color:var(--ok)">+157</b>`],['2026-05-01','獲得','月間取引ボーナス',`<b style="color:var(--ok)">+1,000</b>`]]},
    {kpis:[{l:'現ランク',v:'Gold'},{l:'年間取引',v:'¥58M'},{l:'次ランク',v:'Platinum'},{l:'到達まで',v:'¥22M'}],
     chartTitle:'会員ランク分布',chart:[{label:'Bronze',v:64},{label:'Silver',v:46},{label:'Gold',v:18},{label:'Platinum',v:4}],
     cols:['ランク','年間取引条件','付与率','特典'],
     rows:[['Bronze','〜¥10M','0.5%','基本'],['Silver','¥10M〜','0.8%','送料優遇'],[`<b>Gold（現在）</b>`,'¥30M〜','1.0%','専任担当'],['Platinum','¥80M〜','1.2%','優先生産枠']]},
    {kpis:[{l:'交換可能',v:'24特典'},{l:'保有',v:(DB.points||0).toLocaleString()},{l:'人気',v:'カタログ什器'}],
     cols:['特典','必要ポイント','区分','在庫'],
     rows:[['LEDZ カタログスタンド',NUM('800'),P('mut','什器',false),P('ok','あり')],['ショールーム優先予約',NUM('500'),P('mut','体験',false),P('ok','あり')],['オリジナル測色計',NUM('5,000'),P('mut','ツール',false),P('warn','残少')]]},
    {kpis:[{l:'実施中施策',v:'3'},{l:'対象代理店',v:'128'},{l:'付与予定',v:'¥1.2M'}],
     cols:['施策','対象','インセンティブ','期間','状態'],
     rows:[['新製品拡販キャンペーン','全代理店','ポイント2倍','06/01-06/30',P('info','実施中')],['Synca 導入推進','重点先','+5,000pt','〜07/31',P('info','実施中')],['夏季セール','Gold以上','5%還元','07/01-07/15',P('mut','予定')]]},
  ][idx];

  /* ---------- CRM（代理店管理） ---------- */
  case 'crm': return [
    {kpis:[{l:'代理店',v:'128'},{l:'重点先',v:'24'},{l:'休眠',v:'6'}],
     cols:['代理店','ランク','担当','直近取引','与信枠'],
     rows:[['◯◯電材',P('info','Gold'),'梶原','2026-05-25',NUM('¥5,000,000')],['△△商会',P('mut','Silver'),'田中','2026-05-20',NUM('¥3,000,000')],['□□電気',P('info','Gold'),'梶原','2026-05-18',NUM('¥8,000,000')]]},
    {kpis:[{l:'担当者',v:'312'},{l:'キーマン',v:'64'},{l:'要フォロー',v:'12'}],
     cols:['氏名','代理店','役職','担当','最終接触'],
     rows:[['山田 太郎','◯◯電材','購買部長','梶原','2026-05-25'],['佐藤 花子','△△商会','設計課','田中','2026-05-19'],['鈴木 次郎','□□電気','代表','梶原','2026-05-10']]},
    {kpis:[{l:'組織',v:'42'},{l:'グループ',v:'8'},{l:'拠点',v:'186'}],
     cols:['組織','区分','拠点数','担当営業所'],
     rows:[['◯◯電材グループ',P('mut','法人',false),NUM('12'),'朝霞'],['△△商会',P('mut','単独',false),NUM('3'),'大宮'],['□□電気ホールディングス',P('mut','法人',false),NUM('24'),'川越']]},
    {kpis:[{l:'商談',v:'86'},{l:'進行中',v:'31'},{l:'今月',v:'18'}],
     cols:['日付','代理店','商談内容','金額','状態'],
     rows:[['2026-05-28','◯◯電材','新社屋オフィス照明',NUM('¥3,200,000'),P('info','提案中')],['2026-05-24','□□電気','倉庫高天井LED化',NUM('¥1,100,000'),P('warn','見積中')]]},
    {kpis:[{l:'訪問',v:'56件'},{l:'今週',v:'14'},{l:'同行',v:'8'}],
     cols:['訪問日','代理店','目的','担当','結果'],
     rows:[['2026-05-29','◯◯電材','新製品提案','梶原',P('ok','好感触')],['2026-05-27','△△商会','定期訪問','田中',P('mut','継続')],['2026-05-25','□□電気','見積提出','梶原',P('info','検討')]]},
    {kpis:[{l:'通話',v:'124件'},{l:'今週',v:'32'},{l:'要折返し',v:'4'}],
     cols:['日時','代理店','区分','内容','担当'],
     rows:[['05-30 10:24','◯◯電材',P('mut','着信',false),'納期確認','梶原'],['05-29 15:10','△△商会',P('mut','発信',false),'新製品案内','田中'],['05-28 09:40','□□電気',P('mut','着信',false),'見積依頼','梶原']]},
    {kpis:[{l:'メール',v:'420'},{l:'今週',v:'88'},{l:'未対応',v:'6'}],
     cols:['日時','代理店','件名','区分','状態'],
     rows:[['05-30 11:02','◯◯電材','見積書送付の件',P('mut','送信',false),P('ok','済')],['05-30 09:15','△△商会','カタログ請求',P('mut','受信',false),P('warn','未対応')]]},
    {kpis:[{l:'分析対象',v:'128社'},{l:'当年累計',v:'¥1.62B'},{l:'前年比',v:'+8%'},{l:'上位集中',v:'62%'}],
     chartTitle:'代理店別 取引額 TOP',chart:[{label:'◯◯電材',v:58,disp:'¥58M'},{label:'□□電気',v:41,disp:'¥41M'},{label:'◎◎照明資材',v:28,disp:'¥28M'},{label:'△△商会',v:22,disp:'¥22M'},{label:'◇◇工業',v:8,disp:'¥8M'}],
     cols:['代理店','当年取引','前年比','主力カテゴリ','構成比'],
     rows:[['◯◯電材',NUM('¥58M'),P('ok','+12%'),'ダウンライト','38%'],['□□電気',NUM('¥41M'),P('ok','+6%'),'施設照明','44%'],['◎◎照明資材',NUM('¥28M'),P('ok','+9%'),'制御・調光','33%'],['△△商会',NUM('¥22M'),P('warn','-3%'),'スポット','29%'],['◇◇工業',NUM('¥8M'),P('warn','-5%'),'ランプ・光源','51%']]},
    {kpis:[{l:'評価対象',v:'128'},{l:'優良(A)',v:'24'},{l:'標準(B/C)',v:'95'},{l:'要注意(D)',v:'9'}],
     chartTitle:'ランク分布',chart:[{label:'A（優良）',v:24},{label:'B',v:52},{label:'C',v:43},{label:'D（要注意）',v:9}],
     cols:['代理店','R(最近)','F(頻度)','M(金額)','スコア'],
     rows:[['◯◯電材','5','5','5',P('ok','A+')],['□□電気','4','5','5',P('ok','A')],['◎◎照明資材','4','4','4',P('ok','B')],['△△商会','3','3','3',P('warn','C')],['◇◇工業','2','2','3',P('bad','D')]]},
    {kpis:[{l:'Gold',v:'18'},{l:'Silver',v:'46'},{l:'Bronze',v:'64'}],
     cols:['代理店','現ランク','年間取引','判定','次回見直し'],
     rows:[['◯◯電材',P('info','Gold'),NUM('¥58M'),P('ok','維持'),'2026-09'],['◇◇工業',P('mut','Bronze'),NUM('¥8M'),P('warn','降格検討'),'2026-09'],['◎◎照明資材',P('mut','Silver'),NUM('¥28M'),P('ok','昇格候補'),'2026-09']]},
  ][idx];

  /* ---------- マーケティング ---------- */
  case 'mkt': return [
    {kpis:[{l:'配信中',v:'4'},{l:'既読率',v:'62%'},{l:'今月',v:'12'}],
     cols:['お知らせ','区分','配信日','既読率'],
     rows:[['夏季休業のご案内',P('mut','重要',false),'2026-05-28','58%'],['価格改定のお知らせ',P('mut','重要',false),'2026-05-20','71%'],['Webポータル機能追加',P('mut','一般',false),'2026-05-12','44%']]},
    {kpis:[{l:'新製品',v:'3,608型番'},{l:'掲載点数',v:'7,800'},{l:'発刊',v:'2024-04'}],
     cols:['製品ライン','カテゴリ','型番数','発売'],
     rows:[['Synca シリーズ','調光調色',NUM('420'),'2024-04'],['グレアレスDL Pro.7','ダウンライト',NUM('680'),'2024-04'],['高天井 リニア','施設照明',NUM('210'),'2024-05']]},
    {kpis:[{l:'実施中',v:'2'},{l:'参加代理店',v:'86'},{l:'効果',v:'+18%'}],
     cols:['キャンペーン','対象','特典','期間','状態'],
     rows:[['新製品拡販','全代理店','ポイント2倍','06/01-06/30',P('info','実施中')],['Synca推進','重点先','+5,000pt','〜07/31',P('info','実施中')]]},
    {kpis:[{l:'セール',v:'1'},{l:'対象型番',v:'240'},{l:'平均値引',v:'12%'}],
     cols:['セール名','対象','値引率','期間','状態'],
     rows:[['夏季先行セール','旧在庫品','15%','07/01-07/15',P('mut','予定')],['アウトレット','生産終了品','30%','常設',P('info','実施中')]]},
    {kpis:[{l:'展示会',v:'2'},{l:'申込',v:'128'},{l:'来場予定',v:'310'}],
     cols:['展示会','会場','会期','申込','状態'],
     rows:[['オルガテック東京','東京ビッグサイト','2026-06-18〜20',NUM('128'),P('info','受付中')],['ライティングフェア','幕張メッセ','2026-09-02〜05',NUM('0'),P('mut','準備中')]]},
    {kpis:[{l:'セミナー',v:'3'},{l:'申込',v:'96'},{l:'満席',v:'1'}],
     cols:['セミナー','形式','日程','申込','状態'],
     rows:[['Synca 調光調色 実践','会場','2026-06-12',NUM('40'),P('bad','満席')],['照明計算ツール入門','オンライン','2026-06-19',NUM('38'),P('info','受付中')],['省エネ提案の作り方','オンライン','2026-06-26',NUM('18'),P('info','受付中')]]},
    {kpis:[{l:'エリア',v:'8'},{l:'配信',v:'12'},{l:'平均開封',v:'40%'}],
     cols:['エリア','対象数','配信','開封率','CV'],
     rows:[['関東','42',NUM('4'),'46%',NUM('32')],['関西','28',NUM('3'),'38%',NUM('18')],['中部','22',NUM('2'),'35%',NUM('9')]]},
    {kpis:[{l:'業種',v:'6'},{l:'配信',v:'9'},{l:'平均CTR',v:'6.4%'}],
     cols:['業種','対象数','配信','開封率','CTR'],
     rows:[['オフィス','38',NUM('3'),'42%','7.1%'],['店舗','30',NUM('3'),'39%','6.0%'],['施設','24',NUM('2'),'36%','5.4%']]},
    {kpis:[{l:'対象代理店',v:'128'},{l:'個別配信',v:'24'},{l:'反応',v:'高'}],
     cols:['代理店','ランク','配信内容','開封','CV'],
     rows:[['◯◯電材',P('info','Gold'),'専用キャンペーン',P('ok','開封'),P('ok','資料DL')],['□□電気',P('info','Gold'),'新製品先行案内',P('ok','開封'),P('mut','—')]]},
    {kpis:[{l:'平均開封率',v:'38%'},{l:'最高',v:'71%'},{l:'配信数',v:'42'},{l:'総配信',v:'7,800'}],
     chartTitle:'配信別 開封率',chart:[{label:'価格改定',v:71,disp:'71%'},{label:'展示会案内',v:51,disp:'51.2%'},{label:'新製品案内',v:42,disp:'42.1%'},{label:'省エネ更新',v:38,disp:'38.4%'},{label:'機能追加',v:33,disp:'33.1%'}],
     cols:['配信名','配信日','配信数','開封率','傾向'],
     rows:[['価格改定のお知らせ','2026-05-20',NUM('320'),P('ok','71.0%'),'↑'],['展示会案内','2026-05-01',NUM('186'),P('ok','51.2%'),'↑'],['新製品案内 Pro.7','2026-05-20',NUM('320'),P('ok','42.1%'),'→'],['省エネ更新キャンペーン','2026-05-12',NUM('210'),P('warn','38.4%'),'→'],['Webポータル機能追加','2026-05-12',NUM('150'),P('warn','33.1%'),'↓']]},
    {kpis:[{l:'平均CTR',v:'6.2%'},{l:'最高',v:'9.4%'},{l:'クリック総数',v:'1,284'}],
     cols:['配信名','開封率','CTR','クリック','CV'],
     rows:[['新製品案内 Pro.7','42.1%',P('ok','7.0%'),NUM('420'),NUM('128')],['展示会案内','51.2%',P('ok','9.4%'),NUM('310'),NUM('89')],['セール先行案内','46.0%',P('warn','5.1%'),NUM('180'),NUM('10')]]},
    {kpis:[{l:'総CV',v:'312'},{l:'資料DL',v:'186'},{l:'問合せ',v:'64'},{l:'CVR',v:'2.4%'}],
     chartTitle:'CV種別 内訳',chart:[{label:'資料DL',v:186},{label:'来場申込',v:89},{label:'問合せ',v:64},{label:'セミナー申込',v:38}],
     cols:['配信名','CV種別','CV数','CVR','貢献度'],
     rows:[['新製品案内 Pro.7','資料DL',NUM('128'),P('ok','3.1%'),'高'],['展示会案内','来場申込',NUM('89'),P('ok','2.8%'),'高'],['価格改定','問合せ',NUM('42'),P('ok','2.2%'),'中'],['セミナー案内','申込',NUM('38'),P('warn','1.4%'),'中'],['セール先行案内','資料DL',NUM('15'),P('warn','0.9%'),'低']]},
  ][idx];

  /* ---------- 営業支援 ---------- */
  case 'sales': return [
    {kpis:[{l:'引合',v:'18'},{l:'未対応',v:'4'},{l:'今月',v:'9'}],
     cols:['受付日','顧客','内容','金額目安','状態'],
     rows:[['2026-05-30','F製作所','工場 高天井LED化',NUM('¥2,400,000'),P('warn','未対応')],['2026-05-28','G自治体','庁舎共用部更新',NUM('¥9,800,000'),P('info','対応中')],['2026-05-25','H店舗','店舗照明',NUM('¥1,200,000'),P('ok','商談化')]]},
    {kpis:[{l:'配布待ち',v:'5'},{l:'配布済',v:'13'},{l:'今週',v:'6'}],
     cols:['案件','エリア','金額','配布先','状態'],
     rows:[['F製作所 工場','中部',NUM('¥2.4M'),'名古屋営業所',P('ok','配布済')],['G庁舎','関東',NUM('¥9.8M'),'—',P('warn','配布待ち')],['H店舗','関西',NUM('¥1.2M'),'大阪営業所',P('ok','配布済')]]},
    {kpis:[{l:'商談',v:'31'},{l:'今月受注',v:'4'},{l:'勝率',v:'42%'}],
     cols:['案件','顧客','金額','担当','フェーズ'],
     rows:[['新社屋オフィス照明','A工務店',NUM('¥3,200,000'),'田中',P('info','提案')],['店舗リニューアル','B開発',NUM('¥5,400,000'),'梶原',P('warn','見積')],['病棟改修 Synca','D医療',NUM('¥2,750,000'),'田中',P('ok','受注')]]},
    {kpis:[{l:'資料',v:'248'},{l:'今月DL',v:'1,024'},{l:'新着',v:'12'}],
     cols:['資料名','カテゴリ','形式','DL数','更新'],
     rows:[['Synca 提案書テンプレ','提案',P('mut','PPTX',false),NUM('312'),'2026-05'],['省エネ試算シート','ツール',P('mut','XLSX',false),NUM('186'),'2026-05'],['LEDZ Pro.7 総合カタログ','カタログ',P('mut','PDF',false),NUM('526'),'2024-04']]},
    {kpis:[{l:'テンプレ',v:'36'},{l:'用途別',v:'12'},{l:'人気',v:'オフィス'}],
     cols:['テンプレート','用途','形式','利用数'],
     rows:[['オフィス照明 提案一式','オフィス',P('mut','PPTX',false),NUM('142')],['店舗演出 提案','店舗',P('mut','PPTX',false),NUM('98')],['高天井 省エネ提案','施設',P('mut','PPTX',false),NUM('76')]]},
    {kpis:[{l:'納入事例',v:'420'},{l:'今月追加',v:'8'},{l:'人気業種',v:'オフィス'}],
     cols:['事例','業種','製品','規模','公開'],
     rows:[['NOT A HOTEL OFFICE','オフィス','Synca / Smart LEDZ',NUM('¥12M'),P('ok','公開')],['D病院 病棟改修','医療','調光調色',NUM('¥2.7M'),P('ok','公開')],['C物流 高天井LED化','倉庫','高天井LED',NUM('¥1.1M'),P('mut','申請中')]]},
  ][idx];

  /* ---------- 外部システム連携 ---------- */
  case 'intg':{
    const sysName=sub.replace(/（.*?）|\(.*?\)/g,'');
    return {kpis:[{l:'状態',v:idx===6?'要確認':'正常'},{l:'方式',v:'API/バッチ'},{l:'最終同期',v:'06:00'},{l:'当日処理',v:NUM('1,284')}],
      cols:['処理','方向','件数','最終実行','状態'],
      rows:[[`${sysName} 受信`,P('mut','IN',false),NUM('642'),'2026-06-01 06:00',idx===6?P('warn','要確認'):P('ok','正常')],[`${sysName} 送信`,P('mut','OUT',false),NUM('318'),'2026-06-01 05:30',P('ok','正常')],['差分同期',P('mut','SYNC',false),NUM('324'),'2026-06-01 04:00',P('ok','正常')]]};
  }

  /* ---------- 管理者機能 ---------- */
  case 'admin': return [
    {kpis:[{l:'ユーザー',v:'312'},{l:'有効',v:'304'},{l:'停止',v:'8'}],
     cols:['氏名','所属','役割','状態'],
     rows:[['梶原 隆','◯◯営業所','営業',P('ok','有効')],['田中 美咲','◯◯営業所','営業',P('ok','有効')],['退職者B','—','—',P('mut','停止')]]},
    {kpis:[{l:'権限セット',v:'12'},{l:'ロール',v:'6'},{l:'要見直し',v:'2'}],
     cols:['ロール','対象','受発注','案件','管理'],
     rows:[['管理者','本社',P('ok','可'),P('ok','可'),P('ok','可')],['営業','営業所',P('ok','可'),P('ok','可'),P('mut','不可')],['代理店','取引先',P('ok','可'),P('mut','不可'),P('mut','不可')]]},
    {kpis:[{l:'組織',v:'58'},{l:'営業所',v:'12'},{l:'部署',v:'46'}],
     cols:['組織','区分','人数','親組織'],
     rows:[['本社 情報システム部',P('mut','部署',false),NUM('8'),'本社'],['◯◯営業所',P('mut','拠点',false),NUM('14'),'東日本'],['大宮営業所',P('mut','拠点',false),NUM('9'),'東日本']]},
    {kpis:[{l:'本日ログ',v:'12,840'},{l:'エラー',v:'3'},{l:'警告',v:'12'}],
     cols:['日時','ユーザー','操作','対象','結果'],
     rows:[['06-01 09:32','梶原','受注登録','SO-204790',P('ok','成功')],['06-01 09:10','田中','案件更新','PJ-2',P('ok','成功')],['06-01 08:55','system','SAP同期','—',P('warn','再試行')]]},
    {kpis:[{l:'監査記録',v:'保持5年'},{l:'今月',v:'2,180'},{l:'要確認',v:'1'}],
     cols:['日時','操作者','監査区分','内容','重要度'],
     rows:[['06-01 09:32','梶原','データ変更','与信枠変更',P('warn','中')],['05-31 18:02','管理者A','権限変更','ロール付与',P('bad','高')],['05-30 11:20','田中','エクスポート','顧客一覧DL',P('mut','低')]]},
    {kpis:[{l:'ポリシー',v:'適用中'},{l:'パスワード',v:'90日'},{l:'要対応',v:'0'}],
     cols:['設定','内容','適用','最終更新'],
     rows:[['パスワードポリシー','12文字以上・90日',P('ok','有効'),'2026-04'],['セッション','30分で自動ログアウト',P('ok','有効'),'2026-04'],['ログイン試行','5回でロック',P('ok','有効'),'2026-04']]},
    {kpis:[{l:'許可IP',v:'24'},{l:'拒否',v:'186件'},{l:'当日ブロック',v:'4'}],
     cols:['IP/レンジ','拠点','区分','状態'],
     rows:[['203.0.113.0/24','本社',P('mut','許可',false),P('ok','有効')],['198.51.100.10','◯◯営業所',P('mut','許可',false),P('ok','有効')],['—','社外',P('mut','拒否',false),P('warn','MFA必須')]]},
    {kpis:[{l:'SSO',v:'有効'},{l:'IdP',v:'Azure AD'},{l:'連携ユーザー',v:'312'}],
     cols:['プロバイダ','プロトコル','対象','状態'],
     rows:[['Azure AD','SAML 2.0','全社員',P('ok','有効')],['Google Workspace','OIDC','一部',P('mut','停止')]]},
    {kpis:[{l:'MFA有効',v:'298'},{l:'未設定',v:'14'},{l:'必須',v:'管理者'}],
     cols:['ユーザー','所属','方式','状態'],
     rows:[['梶原 隆','◯◯営業所','認証アプリ',P('ok','有効')],['管理者A','本社','認証アプリ',P('ok','有効')],['新人C','大宮営業所','—',P('warn','未設定')]]},
  ][idx];

  default: return {cols:['項目'],rows:[]};
  }
}

/* ====== AI・自動発注：機能ごとの専用UI ====== */
function aiCard(ic,t,d,sku){
  const p=sku?prod(sku):null;
  return `<div class="card" style="padding:18px"><div style="display:flex;gap:13px;align-items:flex-start">
    <div class="tic" style="margin:0">${icon(ic,{size:24})}</div>
    <div style="flex:1"><div style="font-weight:700;font-size:14px">${t}</div>
    <div class="legend" style="margin-top:5px;line-height:1.7">${d}</div>
    ${p?`<div style="margin-top:12px;display:flex;gap:8px;align-items:center"><button class="btn sm" onclick="addCart('${p.sku}')">${icon('plus',{size:14})}カートに追加</button><span class="legend">${p.sku}・${yen(p.price)}</span></div>`:''}</div></div></div>`;
}
function aiTable(kpis,cols,rows){
  const k=`<div class="kpis" style="margin-bottom:22px">${kpis.map(x=>`<div class="kpi"><div class="kl">${icon('ai')}${x.l}</div><div class="kv" ${String(x.v).length>6?'style="font-size:21px"':''}>${x.v}</div></div>`).join('')}</div>`;
  const th=cols.map(c=>`<th>${c}</th>`).join('');
  const body=rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('');
  return k+`<div class="tablewrap"><table><thead><tr>${th}</tr></thead><tbody>${body}</tbody></table></div>`;
}
function aiContent(idx){
  switch(idx){
    case 0: return aiTable(
      [{l:'後継候補',v:'128'},{l:'生産終了予定',v:'42'},{l:'採用率',v:'38%'}],
      ['現行型番（終了予定）','後継型番','互換','省エネ',''],
      [['ERX-9001','ERX-9210',P('ok','配光・寸法互換'),P('ok','-15%'),`<button class="btn sm" onclick="addCart('ERX-9001')">${icon('plus',{size:13})}追加</button>`],
       ['ERS-5310W','ERS-5410W',P('warn','口金要確認'),P('ok','-10%'),`<button class="btn sm" onclick="addCart('ERS-5310W')">${icon('plus',{size:13})}追加</button>`],
       ['ERB-6201W','ERB-6320W',P('ok','互換'),P('ok','-8%'),`<button class="btn sm" onclick="addCart('ERB-6201W')">${icon('plus',{size:13})}追加</button>`]]);
    case 1: return `<div class="sec">類似器具レコメンド</div><div style="display:flex;flex-direction:column;gap:13px">
      ${aiCard('cat_down','ERD-7720W に近い器具','配光・色温度が近いグレアレスDL。ERD-6543W（拡散）/ ERD-7820W（広角）が候補です。','ERD-6543W')}
      ${aiCard('cat_spot','スポットの代替候補','ERS-6021B の設置条件に合う ERS-5310W（プラグタイプ）を提案します。','ERS-5310W')}</div>`;
    case 2: return `<div class="sec">調光制御セット提案</div><div style="display:flex;flex-direction:column;gap:13px">
      ${aiCard('cat_ctrl','ERD-7720W ＋ 無線調光','Smart LEDZ Lite コントローラー＋無線調光リモコンの同時提案で、現場の調光導入がスムーズです。','FX-LITE-CTL')}
      ${aiCard('ai','Synca 調色セット','SYN-MOD（1800-12000K）と対応器具のセット。オフィス・医療施設に好適。','SYN-MOD')}</div>`;
    case 3: return aiTable(
      [{l:'試算案件',v:'12'},{l:'平均削減',v:'-62%'},{l:'CO₂削減',v:'18t/年'}],
      ['対象','現行','更新後','消費電力','削減'],
      [['C物流倉庫 水銀灯','400W×120','高天井LED 150W',NUM('48kW→18kW'),P('ok','-62%')],
       ['B店舗 ハロゲン','100W×80','LEDスポット 12W',NUM('8kW→1kW'),P('ok','-88%')],
       ['A工場 蛍光灯','40W×300','リニアLED 20W',NUM('12kW→6kW'),P('ok','-50%')]]);
    case 4: {
      const sug=genAutoReorder();
      const body=sug.map(s=>{const st=s.stock===0?P('warn','受注生産'):s.stock<80?P('warn','残'+s.stock):P('ok','在庫あり');
        return `<tr><td><b>${s.p.sku}</b></td><td>${s.p.name}</td><td>${NUM(s.times+'回')}</td><td>${NUM(s.avg+'点')}</td><td>${st}</td><td style="text-align:right"><button class="btn sm" onclick="addCart('${s.p.sku}')">${icon('plus',{size:13})}追加</button></td></tr>`;}).join('');
      const k=`<div class="kpis" style="margin-bottom:22px">
        <div class="kpi"><div class="kl">${icon('ai')}発注提案</div><div class="kv">${sug.length}</div><div class="kd">過去注文より</div></div>
        <div class="kpi"><div class="kl">${icon('refresh')}リピート品</div><div class="kv">${sug.filter(s=>s.times>1).length}</div></div>
        <div class="kpi"><div class="kl">${icon('package')}欠品リスク</div><div class="kv">${sug.filter(s=>s.stock<80).length}</div></div>
        <div class="kpi"><div class="kl">${icon('order')}提案合計</div><div class="kv" style="font-size:20px">${yen(sug.reduce((a,s)=>a+s.p.price*s.avg,0))}</div></div>
      </div>`;
      return `<div class="card" style="margin-bottom:18px;border-left:3px solid var(--ink)"><div style="display:flex;gap:12px;align-items:flex-start">${icon('ai',{size:20})}<div style="flex:1"><div style="font-weight:700">過去の発注パターンから提案</div><p class="legend" style="margin-top:5px;line-height:1.7">注文履歴の頻度・平均数量をもとに、次に発注すべき品目と推奨数量を自動算出します。</p></div><button class="btn" onclick="addAllReorder()">${icon('order',{size:15})}まとめてカートに追加</button></div></div>`
        +k+`<div class="sec">発注提案 <span class="scount">${sug.length} 件</span></div><div class="tablewrap"><table><thead><tr><th>型番</th><th>商品</th><th>発注回数</th><th>推奨数量</th><th>在庫</th><th></th></tr></thead><tbody>${body}</tbody></table></div>`;
    }
    case 5: return aiTable(
      [{l:'予測精度',v:'92%'},{l:'来月需要',v:'↑ +14%'},{l:'要増産',v:'4型番'}],
      ['カテゴリ','当月','来月予測','前年同月','傾向'],
      [['ダウンライト',NUM('1,840'),NUM('2,100'),NUM('1,720'),P('ok','↑ +14%')],
       ['施設照明',NUM('620'),NUM('700'),NUM('580'),P('ok','↑ +13%')],
       ['制御・調光',NUM('410'),NUM('480'),NUM('300'),P('ok','↑ +17%')]]);
    case 6: return aiTable(
      [{l:'欠品予測',v:'3型番'},{l:'2週以内',v:'1'},{l:'過剰在庫',v:'2'}],
      ['型番','現在庫','消費ペース','欠品予測','推奨'],
      [['ERK-1041',NUM('90'),'約30/週','2026-06-21',P('warn','補充推奨')],
       ['ERX-9001',NUM('0'),'受注生産','—',P('mut','受注対応')],
       ['LDA-E26',NUM('880'),'約20/週','—',P('info','過剰気味')]]);
    case 7: return `<div class="card" style="padding:0;overflow:hidden">
      <div style="padding:18px 20px;background:var(--surface-2);border-bottom:1px solid var(--line);display:flex;gap:11px;align-items:flex-start">${icon('ai',{size:18})}<div class="legend" style="color:var(--ink-2);line-height:1.7">仕様・用途・型番で質問できます。回答には<b>出典・データ更新日</b>を併記し、生産終了や非推奨の組合せは<b>警告</b>します。確証が低い場合は<b>有人サポートへ転送</b>します。</div></div>
      <div style="padding:18px 20px;display:flex;flex-direction:column;gap:14px">
        <div style="align-self:flex-end;max-width:80%;background:var(--ink);color:#fff;padding:10px 14px;border-radius:10px 10px 2px 10px;font-size:13px">ERD-7720W と組み合わせる調光、今でも有効？</div>
        <div style="align-self:flex-start;max-width:88%;background:var(--surface-2);border:1px solid var(--line);padding:12px 14px;border-radius:10px 10px 10px 2px;font-size:13px;line-height:1.7">
          <b>ERD-7720W</b> は <b>Smart LEDZ Lite コントローラー</b>で調光可能です。
          <div style="margin-top:10px;padding:10px 12px;background:var(--bad-bg);border:1px solid var(--bad-bg);border-left:3px solid var(--bad);border-radius:2px;font-size:12px;color:var(--ink-2)">
            ${icon('alert',{size:14,cls:''})} <b style="color:var(--bad)">注意：</b>旧リモコン <b>FX-DIM01</b> との直結は<b>非推奨（NG）</b>です。PWM変換が必要なため、FX-LITE-CTL 経由を推奨します。
          </div>
          <div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:8px;align-items:center">
            <span class="srcbadge">${icon('doc',{size:11})}出典：商品仕様書 / 調光対応表</span>
            <span class="srcbadge">${icon('clock',{size:11})}データ更新日：2026-05-28</span>
            <span class="pill ok"><span class="d"></span>確証 高</span>
          </div>
        </div>
        <div style="align-self:flex-start;display:flex;gap:8px">
          <button class="btn ghost sm" onclick="addCart('FX-LITE-CTL')">${icon('plus',{size:13})}FX-LITE-CTL をカート</button>
          <button class="btn ghost sm" onclick="toast('有人サポートへ転送しました（TK発番）')">${icon('users',{size:13})}有人へ転送</button>
        </div>
      </div>
      <div style="padding:14px 20px;display:flex;gap:10px;border-top:1px solid var(--line)"><div class="search" style="flex:1">${icon('search',{size:17})}<input placeholder="器具・仕様・用途を入力…"></div><button class="btn" onclick="toast('AI応答（サンプル）を生成しました')">${icon('arrowR',{size:15})}送信</button></div></div>`;
    case 8: return `<div class="toolbar"><div class="search">${icon('search',{size:17})}<input placeholder="自然文で検索（例: 倉庫 高天井 200W相当 防塵）" value="倉庫 高天井 200W相当"></div><button class="btn">${icon('ai',{size:15})}AI検索</button></div>
      <div class="sec">検索結果 <span class="scount">3 件</span></div>
      <div class="grid">${['ERE-2200','ERG-5512','ERK-1041'].map(s=>{const p=prod(s);return `<div class="pcard"><div class="thumb"><image-slot id="ph-ai-${p.sku}" shape="rect" src="${prodImg(p)}" placeholder="${p.sku}" style="width:100%;height:100%;display:block"></image-slot></div><div class="body"><div class="sku">${p.sku} ・ ${p.cat}</div><div class="nm">${p.name}</div><div class="price">${yen(p.price)}<span class="u">/ 税抜</span></div><div class="pfoot"><span class="legend">AI適合度 高</span><button class="btn sm" onclick="addCart('${p.sku}')">${icon('plus',{size:13})}カート</button></div></div></div>`;}).join('')}</div>`;
    default: return aiTable([{l:'AI',v:'—'}],['項目'],[['—']]);
  }
}

/* ====== 共通：ツールバー / 絞り込み / 内訳グラフ ====== */
function subToolbar(catId){
  const act={logi:'CSVエクスポート',doc:'一括ダウンロード',voc:'新規投稿',comm:'新規スレッド',point:'明細をCSV出力',crm:'新規登録',mkt:'新規配信',sales:'引合を登録',intg:'今すぐ同期',admin:'新規追加'}[catId]||'エクスポート';
  const ai={logi:'doc',doc:'doc',voc:'plus',comm:'plus',point:'doc',crm:'plus',mkt:'plus',sales:'plus',intg:'refresh',admin:'plus'}[catId]||'doc';
  return `<div class="toolbar"><div class="search">${icon('search',{size:17})}<input id="subq" placeholder="この一覧を絞り込み" oninput="filterSubTable(this.value)"></div><button class="btn ghost" onclick="toast('${act}（デモ）')">${icon(ai,{size:15})}${act}</button></div>`;
}
function filterSubTable(q){document.querySelectorAll('#subtable tbody tr').forEach(tr=>{tr.style.display=tr.textContent.includes(q)?'':'none';});}
function chartCard(title,data){
  const max=Math.max(...data.map(d=>d.v))||1;
  return `<div class="card" style="margin-bottom:16px"><div class="ch">${title}</div>
    ${data.map(d=>`<div class="metric"><div class="ml"><span class="mn">${d.label}</span><span class="mv">${d.disp!=null?d.disp:d.v}</span></div><div class="bar"><i style="width:${Math.round(d.v/max*100)}%"></i></div></div>`).join('')}</div>`;
}

/* ====== サブ詳細画面 ====== */
function vSubDetail(catId,idx){
  const c=CATS.find(x=>x.id===catId);
  const subs=SUBITEMS[catId]||[];
  const subName=subs[idx]||'';
  const dom=MODE==='customer'?'代理店向け':'営業所向け';
  const head=`<div class="crumb">${icon('home')}ホーム / <span class="linkish" onclick="go('${catId}')">${catName(c)}</span> / ${subName}</div>
  <div class="phead">
    <button class="btn ghost sm" onclick="go('${catId}')" style="padding:8px 12px"><span style="transform:scaleX(-1);display:inline-flex">${icon('chevR',{size:15})}</span>戻る</button>
    <div class="tic" style="width:34px;height:34px;display:grid;place-items:center;color:var(--ink)">${icon(c.icon,{size:26})}</div>
    <div class="ptitle">${subName}</div><span class="badge">${dom}</span>
  </div>`;

  if(catId==='ai') return head+aiContent(idx);

  const s=getScreen(catId,idx,subName);
  if(!s||!s.rows) return head+`<div class="card"><p class="legend">この画面は準備中です。</p></div>`;
  const kpis=s.kpis?`<div class="kpis" style="margin-bottom:22px">${s.kpis.map(k=>`<div class="kpi"><div class="kl">${icon(c.icon)}${k.l}</div><div class="kv" ${String(k.v).length>6?'style="font-size:20px"':''}>${k.v}</div>${k.d?`<div class="kd">${k.d}</div>`:''}</div>`).join('')}</div>`:'';
  const chart=s.chart?chartCard(s.chartTitle||'内訳',s.chart):'';
  const th=s.cols.map(x=>`<th>${x}</th>`).join('')+'<th></th>';
  const body=s.rows.map((row,i)=>{
    const cells=row.map(x=>`<td>${x}</td>`).join('');
    const dl=s.dl?`<button class="btn sm" onclick="event.stopPropagation();toast('${subName} をダウンロード')">${icon('doc',{size:13})}DL</button> `:'';
    return `<tr style="cursor:pointer" onclick="openRowDetail('${catId}',${idx},${i})">${cells}<td style="white-space:nowrap;text-align:right">${dl}<button class="btn ghost sm" onclick="event.stopPropagation();openRowDetail('${catId}',${idx},${i})">詳細</button></td></tr>`;
  }).join('');
  return head+kpis+chart+subToolbar(catId)+`<div class="sec">${subName} <span class="scount">${s.rows.length} 件</span></div>
  <div class="tablewrap"><table id="subtable"><thead><tr>${th}</tr></thead><tbody>${body}</tbody></table></div>`;
}

/* ---- 行詳細モーダル ---- */
function openRowDetail(catId,idx,rowIdx){
  const subName=(SUBITEMS[catId]||[])[idx]||'';
  const s=getScreen(catId,idx,subName);const row=s.rows[rowIdx];if(!row)return;
  const c=CATS.find(x=>x.id===catId);
  const fields=s.cols.map((col,i)=>`<tr><td style="color:var(--muted);white-space:nowrap;width:38%">${col}</td><td><b>${strip(row[i])||'—'}</b></td></tr>`).join('');
  openModal(`<h3>${icon(c.icon,{size:18})}${subName}<button class="x" onclick="closeModal()">${icon('close')}</button></h3>
    <div class="mb"><table class="bare"><tbody>${fields}</tbody></table></div>
    <div class="mf">${s.dl?`<button class="btn ghost" onclick="toast('${subName} をダウンロード')">${icon('doc',{size:15})}ダウンロード</button>`:''}<button class="btn" onclick="closeModal()">閉じる</button></div>`);
}

/* ---- 通知パネル ---- */
function openNotifications(){
  const items=[
    {ic:'package',t:'注文 SO-204790 が配送中になりました',d:'30分前'},
    {ic:'chat',t:'問い合わせ TK-5521 に営業所が返信しました',d:'2時間前'},
    {ic:'star',t:'新製品カタログ LEDZ Pro.7 が公開されました',d:'昨日'},
    {ic:'gift',t:'月間取引ボーナス +1,000pt を付与しました',d:'5日前'},
  ];
  const list=items.map(n=>`<div style="display:flex;gap:13px;align-items:flex-start;padding:14px 0;border-bottom:1px solid var(--line-2)">
    <div class="tic" style="width:34px;height:34px;margin:0;color:var(--ink)">${icon(n.ic,{size:19})}</div>
    <div style="flex:1"><div style="font-weight:500;line-height:1.5">${n.t}</div><div class="legend" style="margin-top:3px">${n.d}</div></div>
  </div>`).join('');
  openModal(`<h3>${icon('bell',{size:18})}通知<button class="x" onclick="closeModal()">${icon('close')}</button></h3>
    <div class="mb" style="padding-top:6px">${list}<div style="text-align:center;margin-top:14px"><span class="legend">これ以上の通知はありません</span></div></div>
    <div class="mf"><button class="btn" onclick="closeModal()">閉じる</button></div>`);
}

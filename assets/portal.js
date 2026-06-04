/* ============================================================
   LEDZ Connect — アプリケーションロジック & 画面
   データ・機能は既存プロトタイプを踏襲、UIを全面再設計
   ============================================================ */

/* ============ ストア（localStorage） ============ */
const KEY='endo_portal_v3';
/* 遠藤照明（LEDZ）想定の照明カタログ。型番・価格はデモ用ダミー */
const PRODUCTS=[
  {sku:'ERD-7720W',name:'グレアレスダウンライト 100φ 4000K 中角',cat:'ダウンライト',price:9800,stock:640},
  {sku:'ERD-6543W',name:'ベースダウンライト 150φ 3000K 拡散',cat:'ダウンライト',price:7200,stock:1200},
  {sku:'ERS-6021B',name:'Twin Beam スポットライト 黒 4000K',cat:'スポットライト',price:14800,stock:210},
  {sku:'ERS-5310W',name:'プラグタイプスポット 白 電球色',cat:'スポットライト',price:8600,stock:480},
  {sku:'ERK-9851',name:'リニアシリーズ ベースライト 40形 5000K',cat:'ベースライト',price:11200,stock:320},
  {sku:'ERK-1041',name:'レースウェイ用ベースライト 110形',cat:'ベースライト',price:18600,stock:90},
  {sku:'ERG-5512',name:'LED防水投光器 50W 屋外用 4000K',cat:'屋外・防水',price:21800,stock:64},
  {sku:'ERX-9001',name:'マルチローポール アウトドア H1200',cat:'屋外・防水',price:48000,stock:0},
  {sku:'ERB-6201W',name:'ブラケットライト 上下配光 電球色',cat:'ブラケット',price:6400,stock:300},
  {sku:'ERP-7421',name:'ペンダントライト φ200 ガラスセード',cat:'ペンダント',price:9200,stock:160},
  {sku:'EFI-8810',name:'幕板間接照明ユニット 1200mm 2700K',cat:'間接照明',price:13400,stock:140},
  {sku:'FX-LITE-CTL',name:'Smart LEDZ Lite コントローラー',cat:'制御・調光',price:32800,stock:48},
  {sku:'FX-DIM01',name:'無線調光リモコン（PWM対応）',cat:'制御・調光',price:5800,stock:260},
  {sku:'SYN-MOD',name:'Synca 調光調色モジュール 1800-12000K',cat:'制御・調光',price:16800,stock:120},
  {sku:'RAD-902L',name:'交換用LEDユニット φ100 電球色',cat:'ランプ・光源',price:3200,stock:2400},
  {sku:'LDA-E26',name:'LED電球 E26 60形相当 昼白色（20個）',cat:'ランプ・光源',price:9600,stock:880},
  {sku:'ERE-2200',name:'高天井用LED 100W相当 工場・倉庫',cat:'施設照明',price:38600,stock:54},
  {sku:'EHR-110',name:'LED非常用照明器具 埋込型',cat:'施設照明',price:12200,stock:180},
];
const SEED_FAQ=[
  {q:'注文の締め時間と当日出荷の条件は？',a:'平日15:00までのご注文は当日出荷対象です。在庫品が対象で、受注生産品は別途納期回答となります。'},
  {q:'商品仕様図・光度データ（IES）をダウンロードしたい',a:'「ドキュメント」→ 商品仕様書／CADデータ／光度データから型番単位で取得できます（本デモではモック）。'},
  {q:'Smart LEDZ の調光制御に対応した器具を知りたい',a:'カテゴリ「制御・調光」または商品検索で「Synca」「Smart LEDZ」で絞り込めます。'},
  {q:'簡易見積をそのまま注文にできますか？',a:'「見積履歴」から該当見積を開き「注文に変換」で受注登録できます。'},
  {q:'受注生産品の納期回答はどこで確認できますか？',a:'「在庫・物流」→ 納期回答でご確認いただけます（本デモでは画面イメージ）。'},
  {q:'返品・交換の条件を教えてください',a:'未開封・納品後14日以内が対象です。受発注の返品申請よりお手続きください。'},
];
const SEED={
  agency:'◯◯電材',
  cart:[],
  quotes:[],
  returns:[
    {id:'RT-3008',date:'2026-05-23',orderId:'SO-204655',sku:'FX-DIM01',qty:2,reason:'初期不良（点灯不良）',status:'承認'},
  ],
  orders:[
    {id:'SO-204655',date:'2026-05-21',lines:[{sku:'ERK-9851',qty:12},{sku:'FX-DIM01',qty:4}],status:'納品完了'},
    {id:'SO-204790',date:'2026-05-25',lines:[{sku:'ERD-7720W',qty:24}],status:'配送中'},
    {id:'SO-204815',date:'2026-05-31',lines:[{sku:'ERE-2200',qty:8},{sku:'FX-LITE-CTL',qty:2}],status:'承認待ち',approval:{requestedDiscount:8,approvedDiscount:null,by:'◯◯電材',note:'C物流 高天井案件・台数まとまるため特価希望'}},
  ],
  tickets:[
    {id:'TK-5510',date:'2026-05-27',subject:'ERD-7720W の光度データが欲しい',body:'照度計算に使う配光データ(IES)をいただけますか',priority:'中',status:'解決'},
    {id:'TK-5521',date:'2026-05-30',subject:'納期の確認（受注生産品）',body:'ERX-9001 の納期を教えてください',priority:'高',status:'対応中'},
  ],
  projects:[
    {id:'PJ-1',name:'A工務店 新社屋 オフィス照明',customer:'A工務店',amount:3200000,owner:'田中',stage:'提案中'},
    {id:'PJ-2',name:'B商業施設 店舗リニューアル',customer:'B開発',amount:5400000,owner:'梶原',stage:'見積中'},
    {id:'PJ-3',name:'C物流倉庫 高天井LED化',customer:'C物流',amount:1100000,owner:'鈴木',stage:'見積中'},
    {id:'PJ-4',name:'D病院 病棟改修 Synca導入',customer:'D医療',amount:2750000,owner:'田中',stage:'受注'},
    {id:'PJ-5',name:'E学校 教室照明更新',customer:'E学園',amount:6800000,owner:'梶原',stage:'完工'},
  ],
  points:12400,
  seq:{q:100,o:204900,t:5530,p:6,r:3009}
};
let DB;
function load(){ try{DB=JSON.parse(localStorage.getItem(KEY))||null;}catch(e){DB=null;} if(!DB){DB=JSON.parse(JSON.stringify(SEED));save();} 
  /* 後方互換：新フィールドのバックフィル */
  if(!DB.agency)DB.agency='◯◯電材';
  if(!DB.returns)DB.returns=JSON.parse(JSON.stringify(SEED.returns));
  if(DB.seq&&DB.seq.r==null)DB.seq.r=3009;
  save();
}
function save(){ localStorage.setItem(KEY,JSON.stringify(DB)); }
function resetAll(){ if(confirm('全データを初期状態に戻しますか？')){localStorage.removeItem(KEY);load();go(ROUTE);toast('データを初期化しました');} }
function prod(sku){return PRODUCTS.find(p=>p.sku===sku);}
const yen=n=>'¥'+Number(n).toLocaleString('ja-JP');
const TAX=0.10;
function linesTotal(lines){return lines.reduce((s,l)=>s+prod(l.sku).price*l.qty,0);}
function orderDisc(o){return o&&o.approval&&o.approval.approvedDiscount!=null?o.approval.approvedDiscount:0;}
function orderNet(o){return Math.round(linesTotal(o.lines)*(1-orderDisc(o)/100));}
function orderGross(o){return Math.round(orderNet(o)*(1+TAX));}
function today(){return new Date().toISOString().slice(0,10);}

/* ============ カテゴリ定義（再整理したナビ） ============
   c = 代理店ビューでのグループ / i = 営業所ビューでのグループ
   nameI = 営業所ビューでの表示名（任意） */
const CATS=[
  {id:'order', icon:'order',  name:'受発注',                live:true, c:'業務',          i:'営業',       nameI:'受発注（代理発注）'},
  {id:'ret',   icon:'undo',   name:'返品・特価申請',          live:true, c:'業務'},
  {id:'deliv', icon:'floors', name:'物件別 納品・残管理',    live:true, c:'業務',          i:'営業',       nameI:'物件別 納品・残管理'},
  {id:'logi',  icon:'truck',  name:'在庫・物流',                       c:'業務',          i:'業務支援'},
  {id:'doc',   icon:'doc',    name:'ドキュメント',                     c:'業務',          i:'業務支援'},
  {id:'sup',   icon:'chat',   name:'問い合わせ',            live:true, c:'サポート＆活用', i:'顧客・販促', nameI:'問い合わせ（チケット）'},
  {id:'ai',    icon:'ai',     name:'AI・自動発注',          live:true, c:'サポート＆活用'},
  {id:'comm',  icon:'users',  name:'コミュニティ',                     c:'サポート＆活用'},
  {id:'voc',   icon:'voc',    name:'要望・VOC',                        c:'サポート＆活用', i:'顧客・販促'},
  {id:'point', icon:'gift',   name:'ポイント・会員',                   c:'アカウント'},
  {id:'bill',  icon:'receipt',name:'請求・帳票',            live:true, c:'アカウント'},
  {id:'portal',icon:'store',  name:'マイページ',            live:true, c:'アカウント'},
  {id:'approval',icon:'check',name:'受注承認',              live:true,                    i:'営業'},
  {id:'proj',  icon:'folder', name:'案件管理',              live:true,                    i:'営業'},
  {id:'sales', icon:'trend',  name:'営業支援',                                            i:'営業'},
  {id:'crm',   icon:'building',name:'CRM（代理店管理）',                                  i:'顧客・販促'},
  {id:'mkt',   icon:'star',   name:'マーケティング',                                      i:'顧客・販促'},
  {id:'bi',    icon:'chart',  name:'分析・BI',              live:true,                    i:'分析'},
  {id:'arch',  icon:'sitemap',name:'システム構成・連携',    live:true,                    i:'システム'},
  {id:'roadmap',icon:'flag',  name:'導入ロードマップ',       live:true,                    i:'システム'},
  {id:'intg',  icon:'link',   name:'外部システム連携',                                    i:'システム'},
  {id:'admin', icon:'gear',   name:'管理者機能',                                          i:'システム'},
];
const CGROUPS=['業務','サポート＆活用','アカウント'];
const IGROUPS=['営業','顧客・販促','業務支援','分析','システム'];
const SUBITEMS={
  logi:['リアルタイム在庫確認','入荷予定','出荷予定','配送状況追跡','受注生産品の納期回答','配送先管理','分納管理','出荷実績'],
  doc:['総合カタログ LEDZ Pro.7','商品仕様書','CADデータ','姿図','光度データ(IES)','照度分布図','照明計算書','BIMデータ','契約書','覚書','申請書'],
  ai:['商品推薦（後継品提案）','類似器具提案','調光制御セット提案','省エネ更新提案','自動発注提案','需要予測','在庫予測','AIチャット','AI検索'],
  voc:['要望投稿','改善提案','商品評価','満足度調査','アンケート','NPS調査'],
  comm:['掲示板','Q&Aフォーラム','設計者コミュニティ','施工ノウハウ共有'],
  point:['ポイント付与','ランク制度','会員特典','インセンティブ管理'],
  crm:['代理店情報管理','担当者管理','組織管理','商談履歴','訪問履歴','電話履歴','メール履歴','購買分析','RFM分析','ランク管理'],
  mkt:['お知らせ','新製品案内（LEDZ Pro.7）','キャンペーン','セール情報','展示会案内（オルガテック等）','セミナー案内','エリア別配信','業種別配信','代理店別配信','開封率','クリック率','CV分析'],
  sales:['引合管理','案件配布','商談管理','営業資料DL','提案テンプレート','成功事例（納入事例）共有'],
  intg:['SAP連携（既存）','会計連携','既存受発注システム連携(API)','Salesforce連携','HubSpot連携','Marketo連携','Account Engagement連携','コーポレートサイト連携','製品検索サイト連携'],
  admin:['ユーザー管理','権限管理','組織管理','ログ管理','監査ログ','セキュリティ設定','IP制限','SSO','MFA認証'],
};

/* ============ 共通UI ============ */
let MODE='customer', ROUTE='home';
function toast(m){const t=document.getElementById('toast');t.innerHTML=icon('check',{size:18})+'<span>'+m+'</span>';t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2200);}
function openModal(html){document.getElementById('modal').innerHTML=html;document.getElementById('modalBg').classList.add('show');}
function closeModal(){document.getElementById('modalBg').classList.remove('show');}
document.getElementById('modalBg').addEventListener('click',e=>{if(e.target.id==='modalBg')closeModal();});
function cartCount(){return DB.cart.reduce((s,l)=>s+l.qty,0);}
function updateCartDot(){const n=cartCount();const d=document.getElementById('cartDot');d.style.display=n?'grid':'none';d.textContent=n;}
function iconFor(cat){return {'ダウンライト':'cat_down','スポットライト':'cat_spot','ベースライト':'cat_base','屋外・防水':'cat_out','ブラケット':'cat_brkt','ペンダント':'cat_pend','間接照明':'cat_indir','制御・調光':'cat_ctrl','ランプ・光源':'cat_lamp','施設照明':'cat_fac'}[cat]||'bulb';}

function catsFor(mode){const k=mode==='customer'?'c':'i';return CATS.filter(c=>c[k]);}
function catName(c){return (MODE==='internal'&&c.nameI)?c.nameI:c.name;}

function renderSide(){
  const k=MODE==='customer'?'c':'i';
  const groups=MODE==='customer'?CGROUPS:IGROUPS;
  let h=`<a class="navitem ${ROUTE==='home'?'active':''}" onclick="go('home')">${icon('home')}<span>ホーム</span></a>`;
  groups.forEach(g=>{
    const items=CATS.filter(c=>c[k]===g);
    if(!items.length)return;
    h+=`<div class="navgrp">${g}</div>`;
    items.forEach(c=>{
      const on=ROUTE===c.id||ROUTE.indexOf('g:'+c.id+':')===0||(c.id==='order'&&['cart','quote','orders'].includes(ROUTE));
      h+=`<a class="navitem ${on?'active':''}" onclick="go('${c.id}')">${icon(c.icon)}<span>${catName(c)}</span></a>`;
    });
  });
  h+=`<div class="resetbar"><div class="rlink" onclick="resetAll()">${icon('refresh',{size:14})}データを初期化</div></div>`;
  document.getElementById('side').innerHTML=h;
}
function setMode(m){
  MODE=m;document.body.className=m;
  document.getElementById('avatar').textContent=m==='customer'?'代':'営';
  go('home');
}
function go(r){ROUTE=r;renderSide();const mn=document.getElementById('main');mn.scrollTop=0;render();}

/* ============ ヘッダー初期化 ============ */
function initChrome(){
  document.getElementById('bellBtn').innerHTML=icon('bell',{size:19});
  document.getElementById('bellBtn').onclick=()=>openNotifications();
  document.getElementById('cartBtn').insertAdjacentHTML('afterbegin',icon('order',{size:19}));
  document.getElementById('mC').innerHTML=icon('store',{size:15})+'<span>代理店</span>';
  document.getElementById('mI').innerHTML=icon('building',{size:15})+'<span>営業所</span>';
}

/* ============ ルーター ============ */
function render(){
  const m=document.getElementById('main');
  updateCartDot();
  if(ROUTE.indexOf('g:')===0){
    const[,cid,idx]=ROUTE.split(':');
    if(cid==='logi'&&Number(idx)===3&&typeof vDeliveryTrack==='function'){m.innerHTML=vDeliveryTrack();return;}
    if(cid==='sup'&&typeof vInbox==='function'&&idx==='inbox'){m.innerHTML=vInbox();return;}
    m.innerHTML=vSubDetail(cid,Number(idx));return;
  }
  if(ROUTE==='sup:inbox'&&typeof vInbox==='function'){m.innerHTML=vInbox();return;}
  const map={home:'vHome',order:'vOrder',cart:'vCart',quote:'vQuotes',orders:'vOrders',sup:'vSup',portal:'vPortal',proj:'vProj',bi:'vBI',
    approval:'vApproval',arch:'vArch',roadmap:'vRoadmap',bill:'vBill',ret:'vReturns',deliv:'vSites'};
  const fn=map[ROUTE]&&window[map[ROUTE]];
  if(typeof fn==='function'){m.innerHTML=fn();afterRender();return;}
  const c=CATS.find(x=>x.id===ROUTE);
  m.innerHTML=c?vGeneric(c):vHome();
}
function afterRender(){ if(ROUTE==='proj')bindDnD(); }

/* ============ ホーム ============ */
function tileGrid(){
  const k=MODE==='customer'?'c':'i';
  const groups=MODE==='customer'?CGROUPS:IGROUPS;
  let h='';
  groups.forEach(g=>{
    const items=CATS.filter(c=>c[k]===g);
    if(!items.length)return;
    h+=`<div class="sec">${g}</div><div class="grid">`;
    items.forEach(c=>{
      h+=`<div class="tile" onclick="go('${c.id}')">
        <div class="arr">${icon('arrowR',{size:16})}</div>
        <div class="tic">${icon(c.icon,{size:26})}</div>
        <div class="tn">${catName(c)}</div>
      </div>`;
    });
    h+='</div>';
  });
  return h;
}
function vHome(){
  if(MODE==='customer'){
    const open=DB.orders.filter(o=>o.status!=='納品完了').length;
    const tk=DB.tickets.filter(t=>t.status!=='解決'&&t.status!=='クローズ').length;
    return `<div class="crumb">${icon('home')}ホーム</div>
    <div class="greet"><small>取引先ポータル</small>こんにちは、<span class="linkish" onclick="editAgency()" title="代理店名を変更">${DB.agency}</span> 様</div>
    <div class="kpis">
      <div class="kpi"><div class="kl">${icon('package')}処理中の注文</div><div class="kv">${open}</div><div class="kd">配送中・準備中</div></div>
      <div class="kpi"><div class="kl">${icon('order')}カート内</div><div class="kv">${cartCount()}<span class="u">点</span></div></div>
      <div class="kpi"><div class="kl">${icon('chat')}未解決の問い合わせ</div><div class="kv">${tk}</div></div>
      <div class="kpi"><div class="kl">${icon('gift')}保有ポイント</div><div class="kv">${DB.points.toLocaleString()}</div><div class="kd">Goldランク</div></div>
    </div>
    ${tileGrid()}`;
  }
  const recv=DB.projects.filter(p=>p.stage==='受注').length, proposal=DB.projects.length;
  const tkOpen=DB.tickets.filter(t=>t.status!=='解決').length;
  const pend=DB.orders.filter(o=>o.status==='承認待ち').length;
  return `<div class="crumb">${icon('home')}ホーム</div>
  <div class="greet"><small>営業所ダッシュボード</small>梶原さん、おつかれさまです。</div>
  ${pend?`<div class="card" style="margin-bottom:22px;display:flex;align-items:center;gap:16px;border-color:var(--warn)">
    <div class="tic" style="width:38px;height:38px;margin:0;color:var(--warn)">${icon('check',{size:24})}</div>
    <div style="flex:1"><div style="font-weight:700">承認待ちの代理発注が ${pend} 件あります</div><div class="legend">代理店からの発注・特価申請を確認してください。</div></div>
    <button class="btn" onclick="go('approval')">${icon('arrowR',{size:15})}受注承認へ</button>
  </div>`:''}
  <div class="kpis">
    <div class="kpi"><div class="kl">${icon('check')}承認待ち</div><div class="kv">${pend}</div><div class="kd">要対応</div></div>
    <div class="kpi"><div class="kl">${icon('folder')}進行中案件</div><div class="kv">${proposal}</div><div class="kd">全ステージ</div></div>
    <div class="kpi"><div class="kl">${icon('chat')}オープンチケット</div><div class="kv">${tkOpen}</div></div>
    <div class="kpi"><div class="kl">${icon('trend')}受注額（累計）</div><div class="kv" style="font-size:22px">${yen(DB.projects.filter(p=>['受注','完工'].includes(p.stage)).reduce((s,p)=>s+p.amount,0))}</div></div>
  </div>
  ${tileGrid()}`;
}

/* ============ 受発注：商品一覧 ============ */
let orderFilter={q:'',cat:'すべて'};
function stockTag(p){
  if(p.stock===0)return `<span class="stk" style="color:var(--warn)"><span class="d" style="background:var(--warn)"></span>受注生産</span>`;
  if(p.stock<80)return `<span class="stk" style="color:var(--warn)"><span class="d" style="background:var(--warn)"></span>残${p.stock}</span>`;
  return `<span class="stk" style="color:var(--ok)"><span class="d" style="background:var(--ok)"></span>在庫あり</span>`;
}
function vOrder(){
  const cats=['すべて',...new Set(PRODUCTS.map(p=>p.cat))];
  const chips=cats.map(c=>`<span class="chip ${orderFilter.cat===c?'on':''}" onclick="setCat('${c}')">${c}</span>`).join('');
  const list=PRODUCTS.filter(p=>(orderFilter.cat==='すべて'||p.cat===orderFilter.cat)&&(p.name.includes(orderFilter.q)||p.sku.toLowerCase().includes(orderFilter.q.toLowerCase())));
  const cards=list.map(p=>{const sp=specialOf(p.sku);return `<div class="pcard">
    <div class="thumb"><image-slot id="ph-${p.sku}" shape="rect" placeholder="${p.sku}" style="width:100%;height:100%;display:block"></image-slot>${sp?`<span class="spbadge">特価 -${sp.off}%</span>`:''}</div>
    <div class="body">
      <div class="sku">${p.sku} ・ ${p.cat}</div>
      <div class="nm">${p.name}</div>
      ${sp?`<div style="margin-top:auto"><span class="legend" style="text-decoration:line-through">${yen(p.price)}</span> <span class="price" style="display:inline">${yen(specialPrice(p))}<span class="u">/ 税抜</span></span></div>`:`<div class="price">${yen(p.price)}<span class="u">/ 税抜</span></div>`}
      <div class="pfoot">${stockTag(p)}<button class="btn sm" onclick="addCart('${p.sku}')">${icon('plus',{size:14})}カート</button></div>
    </div></div>`;}).join('');
  const special=(typeof specialBlock==='function'&&orderFilter.cat==='すべて'&&!orderFilter.q)?specialBlock():'';
  return `<div class="crumb">${icon('home')}ホーム / 受発注</div>
  <div class="phead"><div class="ptitle">受発注</div><span class="badge">${MODE==='customer'?'代理店向け':'営業所 代理発注'}</span></div>
  <div class="toolbar">
    <div class="search">${icon('search',{size:17})}<input id="srch" placeholder="型番・名称で検索（例: ERD, Synca, ダウンライト）" value="${orderFilter.q}" oninput="orderFilter.q=this.value;rerenderOrder()"></div>
    <button class="btn ghost" onclick="go('quote')">${icon('receipt',{size:15})}見積履歴</button>
    <button class="btn ghost" onclick="go('orders')">${icon('package',{size:15})}注文履歴</button>
    <button class="btn" onclick="go('cart')">${icon('order',{size:15})}カート (${cartCount()})</button>
  </div>
  ${special}
  <div class="chips">${chips}</div>
  <div style="margin:0 0 12px">${typeof srcBadge==='function'?srcBadge('既存受発注（SAP）／商品マスタ'):''}</div>
  <div id="plist" class="grid">${cards||emptyBox('search','該当商品なし','検索条件を変えてください')}</div>`;
}
function setCat(c){orderFilter.cat=c;go('order');}
function rerenderOrder(){const m=document.getElementById('main');m.innerHTML=vOrder();const s=document.getElementById('srch');s.focus();s.setSelectionRange(s.value.length,s.value.length);}
function addCart(sku){const l=DB.cart.find(x=>x.sku===sku);if(l)l.qty++;else DB.cart.push({sku,qty:1});save();updateCartDot();toast(prod(sku).name+' をカートに追加');rerenderOrder();}

/* ============ カート ============ */
function vCart(){
  const head=`<div class="crumb">${icon('home')}ホーム / 受発注 / カート</div><div class="phead"><div class="ptitle">カート</div></div>`;
  if(!DB.cart.length)return head+emptyBox('order','カートは空です','受発注から商品を追加してください','受発注へ','order');
  const rows=DB.cart.map(l=>{const p=prod(l.sku);return `<tr>
    <td><b>${p.name}</b><br><span class="legend">${p.sku}</span></td>
    <td style="font-variant-numeric:tabular-nums">${yen(p.price)}</td>
    <td><div class="qty"><button onclick="cartQty('${l.sku}',-1)">${icon('minus',{size:14})}</button><input value="${l.qty}" readonly><button onclick="cartQty('${l.sku}',1)">${icon('plus',{size:14})}</button></div></td>
    <td><b style="font-variant-numeric:tabular-nums">${yen(p.price*l.qty)}</b></td>
    <td><button class="btn danger sm" onclick="cartDel('${l.sku}')">${icon('trash',{size:14})}削除</button></td></tr>`;}).join('');
  const sub=linesTotal(DB.cart),tax=Math.round(sub*TAX);
  return `${head}
  <div class="tablewrap"><table><thead><tr><th>商品</th><th>単価</th><th>数量</th><th>小計</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>
  <div class="row2" style="margin-top:20px">
    <div class="card"><div class="ch">お支払い金額</div>
      <table class="bare"><tbody>
        <tr><td>小計（税抜）</td><td style="text-align:right;font-variant-numeric:tabular-nums">${yen(sub)}</td></tr>
        <tr><td>消費税 10%</td><td style="text-align:right;font-variant-numeric:tabular-nums">${yen(tax)}</td></tr>
        <tr><td><b>合計（税込）</b></td><td style="text-align:right"><b class="bignum" style="font-size:18px">${yen(sub+tax)}</b></td></tr>
      </tbody></table>
      <div class="field" style="margin:18px 0 0"><label>特価・値引のご希望（任意）</label>
        <div style="display:flex;gap:10px;align-items:center">
          <select id="discReq" style="max-width:140px"><option value="0">希望なし</option><option value="3">3% 値引希望</option><option value="5">5% 値引希望</option><option value="8">8% 値引希望</option><option value="10">10% 値引希望</option></select>
          <span class="legend">営業所の承認後に確定します</span>
        </div>
      </div>
    </div>
    <div class="card" style="display:flex;flex-direction:column;gap:11px;justify-content:center">
      <button class="btn ghost" onclick="makeQuote()">${icon('receipt',{size:16})}この内容で簡易見積を作成</button>
      <button class="btn" onclick="checkout()">${icon('check',{size:16})}発注する（承認申請）</button>
      <span class="legend" style="line-height:1.6">代理店の発注は <b>営業所の受注承認</b> を経て確定します。特価申請がある場合も承認時に査定されます。</span>
    </div>
  </div>`;
}
function cartQty(sku,d){const l=DB.cart.find(x=>x.sku===sku);l.qty=Math.max(1,l.qty+d);save();go('cart');}
function cartDel(sku){DB.cart=DB.cart.filter(x=>x.sku!==sku);save();go('cart');toast('削除しました');}
function makeQuote(){const id='Q-'+(++DB.seq.q);DB.quotes.unshift({id,date:today(),lines:JSON.parse(JSON.stringify(DB.cart)),status:'有効'});save();toast('見積 '+id+' を作成しました');go('quote');}
function checkout(){
  const sub=linesTotal(DB.cart),tax=Math.round(sub*TAX),tot=sub+tax;
  const disc=Number((document.getElementById('discReq')||{}).value||0);
  const id='SO-'+(++DB.seq.o);
  DB.orders.unshift({id,date:today(),lines:JSON.parse(JSON.stringify(DB.cart)),status:'承認待ち',approval:{requestedDiscount:disc,approvedDiscount:null,by:DB.agency,note:disc?disc+'% の値引を希望':''}});
  DB.cart=[];save();updateCartDot();
  openModal(`<h3>${icon('check',{size:20})}発注を申請しました<button class="x" onclick="closeModal()">${icon('close')}</button></h3>
    <div class="mb"><p>注文番号 <b>${id}</b> を <b>承認申請</b> しました。営業所の受注承認後に確定し、基幹システム（SAP）へ連携されます。</p>
    <div style="display:flex;gap:24px;margin-top:16px">
      <div><div class="legend">申請金額（税込）</div><div class="bignum" style="font-size:24px">${yen(tot)}</div></div>
      ${disc?`<div><div class="legend">特価希望</div><div class="bignum" style="font-size:24px">${disc}%</div></div>`:''}
      <div><div class="legend">状態</div><div style="margin-top:6px">${orderPill('承認待ち')}</div></div>
    </div>
    <p class="legend" style="margin-top:14px">営業所ビューの「受注承認」で承認すると確定します。</p></div>
    <div class="mf"><button class="btn ghost" onclick="closeModal();go('orders')">注文履歴を見る</button><button class="btn" onclick="closeModal();go('order')">買い物を続ける</button></div>`);
}

/* ============ 見積履歴 ============ */
function vQuotes(){
  const head=`<div class="crumb">${icon('home')}ホーム / 受発注 / 見積履歴</div><div class="phead"><div class="ptitle">見積履歴</div></div>`;
  if(!DB.quotes.length)return head+emptyBox('receipt','見積がありません','カートから簡易見積を作成できます','受発注へ','order');
  const rows=DB.quotes.map(q=>{const sub=linesTotal(q.lines),tot=sub+Math.round(sub*TAX);return `<tr>
    <td><b>${q.id}</b></td><td>${q.date}</td><td>${q.lines.length}品目 / ${q.lines.reduce((s,l)=>s+l.qty,0)}点</td>
    <td style="font-variant-numeric:tabular-nums">${yen(tot)}</td><td><span class="pill info"><span class="d"></span>${q.status}</span></td>
    <td><button class="btn sm" onclick="quoteToOrder('${q.id}')">${icon('arrowR',{size:14})}受注に変換</button> <button class="btn ghost sm" onclick="viewLines('${q.id}','q')">明細</button></td></tr>`;}).join('');
  return `${head}
  <div class="tablewrap"><table><thead><tr><th>見積番号</th><th>作成日</th><th>内容</th><th>金額(税込)</th><th>状態</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
function quoteToOrder(qid){const q=DB.quotes.find(x=>x.id===qid);const id='SO-'+(++DB.seq.o);DB.orders.unshift({id,date:today(),lines:JSON.parse(JSON.stringify(q.lines)),status:'受付済み'});q.status='受注済';const tot=Math.round(linesTotal(q.lines)*(1+TAX));DB.points+=Math.floor(tot/1000);save();toast('見積 '+qid+' を受注 '+id+' に変換しました');go('orders');}

/* ============ 注文履歴 ============ */
const FLOW=['受付済み','出荷準備中','配送中','納品完了'];
function orderPill(s){const cls=s==='納品完了'?'ok':s==='配送中'?'info':s==='出荷準備中'?'warn':s==='承認待ち'?'warn':s==='差戻し'?'bad':'mut';return `<span class="pill ${cls}"><span class="d"></span>${s}</span>`;}
function vOrders(){
  const head=`<div class="crumb">${icon('home')}ホーム / 受発注 / 注文履歴</div><div class="phead"><div class="ptitle">注文履歴</div></div>`;
  if(!DB.orders.length)return head+emptyBox('package','注文がありません','','受発注へ','order');
  const rows=DB.orders.map(o=>{const tot=orderGross(o);const d=orderDisc(o);
    const advance=MODE==='internal'&&FLOW.includes(o.status)&&FLOW.indexOf(o.status)<FLOW.length-1?`<button class="btn sm" onclick="advanceOrder('${o.id}')">${icon('arrowR',{size:14})}次の状態へ</button>`:'';
    const pend=o.status==='承認待ち'?(MODE==='internal'?`<button class="btn sm" onclick="go('approval')">${icon('check',{size:14})}承認へ</button>`:''):'';
    const ret=o.status==='納品完了'?`<button class="btn ghost sm" onclick="requestReturn('${o.id}')">${icon('undo',{size:14})}返品申請</button>`:'';
    return `<tr><td><b>${o.id}</b>${d?` <span class="pill info" style="margin-left:4px">特価${d}%</span>`:''}</td><td>${o.date}</td><td>${prod(o.lines[0].sku).name}${o.lines.length>1?' 他'+(o.lines.length-1)+'点':''}</td>
    <td style="font-variant-numeric:tabular-nums">${yen(tot)}</td><td>${orderPill(o.status)}</td>
    <td style="white-space:nowrap;text-align:right"><button class="btn ghost sm" onclick="viewLines('${o.id}','o')">明細</button> <button class="btn ghost sm" onclick="reorder('${o.id}')">${icon('refresh',{size:14})}再注文</button> ${ret}${pend}${advance}</td></tr>`;}).join('');
  return `${head}
  <div class="tablewrap"><table><thead><tr><th>注文番号</th><th>注文日</th><th>主要品目</th><th>金額(税込)</th><th>状況</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
function advanceOrder(id){const o=DB.orders.find(x=>x.id===id);const i=FLOW.indexOf(o.status);if(i>=0&&i<FLOW.length-1){o.status=FLOW[i+1];save();go('orders');toast(id+' → '+o.status);}}
function reorder(id){const o=DB.orders.find(x=>x.id===id);o.lines.forEach(l=>{const c=DB.cart.find(x=>x.sku===l.sku);if(c)c.qty+=l.qty;else DB.cart.push({sku:l.sku,qty:l.qty});});save();updateCartDot();toast('カートに追加しました');go('cart');}
function viewLines(id,type){const src=(type==='q'?DB.quotes:DB.orders).find(x=>x.id===id);const rows=src.lines.map(l=>{const p=prod(l.sku);return `<tr><td>${p.name}<br><span class="legend">${p.sku}</span></td><td>${l.qty}</td><td style="text-align:right;font-variant-numeric:tabular-nums">${yen(p.price*l.qty)}</td></tr>`;}).join('');const sub=linesTotal(src.lines);openModal(`<h3>${id} 明細<button class="x" onclick="closeModal()">${icon('close')}</button></h3><div class="mb"><table class="bare"><thead><tr><th>商品</th><th>数量</th><th style="text-align:right">小計</th></tr></thead><tbody>${rows}<tr><td colspan="2"><b>合計(税込)</b></td><td style="text-align:right"><b class="bignum">${yen(sub+Math.round(sub*TAX))}</b></td></tr></tbody></table></div><div class="mf"><button class="btn" onclick="closeModal()">閉じる</button></div>`);}

/* ============ 問い合わせ ============ */
function vSup(){
  const cust=MODE==='customer';
  const open=DB.tickets.filter(t=>t.status!=='解決').length;
  const chMap={'TK-5510':'メール','TK-5521':'電話'};
  const rows=DB.tickets.map(t=>{const cls=t.status==='解決'?'ok':t.status==='対応中'?'warn':'info';
    const act=cust?`<button class="btn ghost sm" onclick="viewTicket('${t.id}')">詳細</button>`:`<button class="btn sm" onclick="cycleTicket('${t.id}')">${icon('refresh',{size:14})}状態変更</button>`;
    const pp=t.priority==='高'?'bad':t.priority==='中'?'warn':'mut';
    const ch=t.ch||chMap[t.id]||'Web';
    return `<tr><td><b>${t.id}</b></td><td><span style="display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--ink-2)">${icon((typeof CHAN_ICON!=='undefined'&&CHAN_ICON[ch])||'grid',{size:13})}${ch}</span></td><td>${t.subject}</td><td><span class="pill ${pp}"><span class="d"></span>${t.priority}</span></td><td>${t.date}</td><td><span class="pill ${cls}"><span class="d"></span>${t.status}</span></td><td>${act}</td></tr>`;}).join('');
  const faq=SEED_FAQ.map((f,i)=>`<div class="faq-item" id="faq${i}"><div class="q" onclick="document.getElementById('faq${i}').classList.toggle('open')">${f.q}${icon('chevDown')}</div><div class="a">${f.a}</div></div>`).join('');
  return `<div class="crumb">${icon('home')}ホーム / 問い合わせ</div>
  <div class="phead"><div class="ptitle">問い合わせ</div><span class="badge">${cust?'代理店サポート':'チケット管理'}</span></div>
  <div class="card" style="margin-bottom:22px;display:flex;align-items:center;gap:16px">
    <div class="tic" style="width:38px;height:38px;margin:0;color:var(--ink)">${icon('inbox',{size:24})}</div>
    <div style="flex:1"><div style="font-weight:700">統合インボックス（電話・メール・チャット・Web・FAX）</div><div class="legend">通話の自動文字起こし、顧客との双方向共有まで一元管理</div></div>
    <button class="btn" onclick="go('sup:inbox')">${icon('arrowR',{size:15})}開く</button>
  </div>
  <div class="kpis"><div class="kpi"><div class="kl">${icon('chat')}未解決</div><div class="kv">${open}</div></div><div class="kpi"><div class="kl">${icon('receipt')}総チケット</div><div class="kv">${DB.tickets.length}</div></div><div class="kpi"><div class="kl">${icon('phone')}通路</div><div class="kv">5</div><div class="kd">電話/メール/Chat/Web/FAX</div></div><div class="kpi"><div class="kl">${icon('doc')}FAQ記事</div><div class="kv">${SEED_FAQ.length}</div></div></div>
  <div class="sec">チケット一覧 <button class="btn sm" onclick="newTicket()">${icon('plus',{size:14})}問い合わせを登録</button></div>
  <div class="tablewrap"><table><thead><tr><th>番号</th><th>通路</th><th>件名</th><th>優先</th><th>日付</th><th>状況</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>
  <div class="sec">FAQ検索</div>
  <div class="search" style="margin-bottom:14px">${icon('search',{size:17})}<input id="faqq" placeholder="キーワードで絞り込み（例: 仕様図, 納期, 調光）" oninput="filterFaq(this.value)"></div>
  <div id="faqlist">${faq}</div>`;
}
function filterFaq(q){SEED_FAQ.forEach((f,i)=>{const el=document.getElementById('faq'+i);el.style.display=(f.q+f.a).includes(q)?'':'none';});}
function newTicket(){openModal(`<h3>問い合わせを登録<button class="x" onclick="closeModal()">${icon('close')}</button></h3>
  <div class="mb">
    <div class="field"><label>件名</label><input id="tk_s" placeholder="例: 納期の確認 / 仕様図の依頼"></div>
    <div class="field"><label>優先度</label><select id="tk_p"><option>低</option><option selected>中</option><option>高</option></select></div>
    <div class="field"><label>内容</label><textarea id="tk_b" rows="4" placeholder="お問い合わせ内容を入力"></textarea></div>
  </div>
  <div class="mf"><button class="btn ghost" onclick="closeModal()">キャンセル</button><button class="btn" onclick="saveTicket()">登録</button></div>`);}
function saveTicket(){const s=document.getElementById('tk_s').value.trim();if(!s){toast('件名を入力してください');return;}const id='TK-'+(++DB.seq.t);DB.tickets.unshift({id,date:today(),subject:s,body:document.getElementById('tk_b').value,priority:document.getElementById('tk_p').value,status:'新規'});save();closeModal();toast(id+' を登録しました');go('sup');}
const TKFLOW=['新規','対応中','解決'];
function cycleTicket(id){const t=DB.tickets.find(x=>x.id===id);const i=TKFLOW.indexOf(t.status);t.status=TKFLOW[(i+1)%TKFLOW.length];save();go('sup');toast(id+' → '+t.status);}
function viewTicket(id){const t=DB.tickets.find(x=>x.id===id);openModal(`<h3>${t.id}<button class="x" onclick="closeModal()">${icon('close')}</button></h3><div class="mb"><p><b>${t.subject}</b></p><p class="legend" style="margin-top:4px">${t.date} ・ 優先度 ${t.priority} ・ ${t.status}</p><p style="margin-top:12px">${t.body||'（内容なし）'}</p></div><div class="mf"><button class="btn" onclick="closeModal()">閉じる</button></div>`);}

/* ============ マイページ ============ */
function vPortal(){
  const monthOrders=DB.orders.filter(o=>o.date>='2026-05-01');
  const monthTotal=monthOrders.reduce((s,o)=>s+Math.round(linesTotal(o.lines)*(1+TAX)),0);
  const unpaid=DB.orders.filter(o=>o.status!=='納品完了').reduce((s,o)=>s+Math.round(linesTotal(o.lines)*(1+TAX)),0);
  const rank=DB.points>=10000?'Gold':DB.points>=5000?'Silver':'Bronze';
  return `<div class="crumb">${icon('home')}ホーム / マイページ</div>
  <div class="phead"><div class="ptitle">マイページ</div><span class="badge">代理店向け</span></div>
  <div class="kpis">
    <div class="kpi"><div class="kl">${icon('package')}今月の発注額(税込)</div><div class="kv" style="font-size:23px">${yen(monthTotal)}</div><div class="kd">${monthOrders.length}件</div></div>
    <div class="kpi"><div class="kl">${icon('receipt')}未納品(請求予定)</div><div class="kv" style="font-size:23px">${yen(unpaid)}</div></div>
    <div class="kpi"><div class="kl">${icon('gift')}保有ポイント</div><div class="kv">${DB.points.toLocaleString()}</div><div class="kd">${rank}ランク</div></div>
    <div class="kpi"><div class="kl">${icon('order')}累計注文件数</div><div class="kv">${DB.orders.length}</div></div>
  </div>
  <div class="row2">
    <div class="card"><div class="ch">${icon('package',{size:16})}最近の注文</div>
      <table class="bare"><tbody>
      ${DB.orders.slice(0,5).map(o=>`<tr><td class="linkish" onclick="go('orders')">${o.id}</td><td>${o.date}</td><td>${orderPill(o.status)}</td></tr>`).join('')||'<tr><td colspan=3 class="legend">注文なし</td></tr>'}
      </tbody></table>
    </div>
    <div class="card"><div class="ch">${icon('store',{size:16})}契約・取引情報</div>
      <table class="bare"><tbody>
        <tr><td>取引区分</td><td><b>正規代理店（電材・建材商社）</b></td></tr>
        <tr><td>与信枠</td><td style="font-variant-numeric:tabular-nums">¥5,000,000</td></tr>
        <tr><td>支払条件</td><td>月末締め翌月末</td></tr>
        <tr><td>担当営業所</td><td>◯◯営業所（梶原）</td></tr>
        <tr><td>会員ランク</td><td><span class="pill ok"><span class="d"></span>${rank}</span></td></tr>
      </tbody></table>
    </div>
  </div>
  <div class="row2" style="margin-top:16px">
    <div class="card"><div class="ch" style="justify-content:space-between"><span>${icon('layers',{size:16})}取扱商材・仕入先</span><span class="legend" style="text-transform:none;letter-spacing:0">多商材取扱</span></div>
      <p class="legend" style="margin:-4px 0 12px;line-height:1.7">照明（遠藤照明）に加え、配線器具・空調・建材など複数メーカーを取扱う商社です。LEDZ Connect は照明領域の窓口として連携します。</p>
      <table class="bare"><tbody>
        <tr><td>遠藤照明（LEDZ）</td><td style="text-align:right">${P('info','本ポータル連携')}</td></tr>
        <tr><td>配線器具・制御 A社</td><td style="text-align:right">${P('mut','他システム')}</td></tr>
        <tr><td>空調・換気 B社</td><td style="text-align:right">${P('mut','他システム')}</td></tr>
        <tr><td>建材・内装 C社</td><td style="text-align:right">${P('mut','他システム')}</td></tr>
      </tbody></table>
      <div style="margin-top:12px">${typeof srcBadge==='function'?srcBadge('代理店マスタ（自社基幹）'):''}</div>
    </div>
    <div class="card"><div class="ch">${icon('floors',{size:16})}進行中の納入物件</div>
      <table class="bare"><tbody>
        ${(typeof DELIV_SITES!=='undefined'?DELIV_SITES:[]).map(s=>`<tr><td class="linkish" onclick="go('deliv')">${s.name}</td><td style="text-align:right">${siteProgress(s)}%${siteRemain(s)?` ・ 残${siteRemain(s)}`:''}</td></tr>`).join('')||'<tr><td class="legend">物件なし</td></tr>'}
      </tbody></table>
      <div style="margin-top:12px"><button class="btn ghost sm" onclick="go('deliv')">${icon('arrowR',{size:14})}物件別 納品・残管理へ</button></div>
    </div>
  </div>`;
}

/* ============ 案件管理（ドラッグ） ============ */
const STAGES=['提案中','見積中','受注','失注','完工'];
function vProj(){
  const cols=STAGES.map(s=>{
    const cards=DB.projects.filter(p=>p.stage===s).map(p=>`<div class="pjcard" draggable="true" data-id="${p.id}" onclick="openProjDetail('${p.id}')"><div class="pjn">${p.name}</div><div class="pja">${yen(p.amount)}</div><div class="pjo">${icon('users',{size:12})}担当: ${p.owner}</div></div>`).join('');
    return `<div class="pcol" data-stage="${s}"><h4>${s}<span class="n">${DB.projects.filter(p=>p.stage===s).length}</span></h4>${cards}</div>`;
  }).join('');
  return `<div class="crumb">${icon('home')}ホーム / 案件管理</div>
  <div class="phead"><div class="ptitle">案件管理</div><span class="badge">営業所向け</span></div>
  <div class="toolbar"><button class="btn" onclick="newProj()">${icon('plus',{size:15})}案件作成</button></div>
  <div class="pipe">${cols}</div>`;
}
function newProj(){openModal(`<h3>案件を作成<button class="x" onclick="closeModal()">${icon('close')}</button></h3><div class="mb">
  <div class="field"><label>案件名</label><input id="pj_n" placeholder="例: F社 工場 高天井LED化"></div>
  <div class="field"><label>顧客名</label><input id="pj_c" placeholder="例: F製作所"></div>
  <div class="field"><label>金額(税抜)</label><input id="pj_a" type="number" placeholder="2000000"></div>
  <div class="field"><label>担当</label><input id="pj_o" value="梶原"></div>
  <div class="field"><label>初期ステータス</label><select id="pj_s">${STAGES.map(s=>`<option>${s}</option>`).join('')}</select></div>
  </div><div class="mf"><button class="btn ghost" onclick="closeModal()">キャンセル</button><button class="btn" onclick="saveProj()">作成</button></div>`);}
function saveProj(){const n=document.getElementById('pj_n').value.trim();if(!n){toast('案件名を入力してください');return;}DB.projects.push({id:'PJ-'+(++DB.seq.p),name:n,customer:document.getElementById('pj_c').value,amount:Number(document.getElementById('pj_a').value)||0,owner:document.getElementById('pj_o').value,stage:document.getElementById('pj_s').value});save();closeModal();toast('案件を作成しました');go('proj');}
function openProjDetail(id){
  const p=DB.projects.find(x=>x.id===id);if(!p)return;
  const tax=Math.round(p.amount*TAX);
  openModal(`<h3>${icon('folder',{size:18})}案件詳細<button class="x" onclick="closeModal()">${icon('close')}</button></h3>
    <div class="mb">
      <div style="font-weight:700;font-size:16px;line-height:1.5">${p.name}</div>
      <div class="legend" style="margin:4px 0 18px">${p.id}</div>
      <table class="bare"><tbody>
        <tr><td style="color:var(--muted);width:40%">顧客</td><td><b>${p.customer||'—'}</b></td></tr>
        <tr><td style="color:var(--muted)">金額（税抜）</td><td><b class="bignum">${yen(p.amount)}</b></td></tr>
        <tr><td style="color:var(--muted)">金額（税込）</td><td>${yen(p.amount+tax)}</td></tr>
        <tr><td style="color:var(--muted)">担当</td><td>${p.owner}</td></tr>
        <tr><td style="color:var(--muted)">担当営業所</td><td>◯◯営業所</td></tr>
        <tr><td style="color:var(--muted)">想定納期</td><td>2026年Q3</td></tr>
      </tbody></table>
      <div class="field" style="margin-top:20px"><label>ステータス</label><select id="pjstage" onchange="updateProjStage('${p.id}',this.value)">${STAGES.map(s=>`<option ${s===p.stage?'selected':''}>${s}</option>`).join('')}</select></div>
    </div>
    <div class="mf"><button class="btn" onclick="closeModal()">閉じる</button></div>`);
}
function updateProjStage(id,stage){const p=DB.projects.find(x=>x.id===id);if(!p)return;p.stage=stage;save();const m=document.getElementById('main');if(ROUTE==='proj'){m.innerHTML=vProj();bindDnD();}toast(p.name+' → '+stage);}
let dragId=null;
function bindDnD(){
  document.querySelectorAll('.pjcard').forEach(c=>{c.addEventListener('dragstart',()=>{dragId=c.dataset.id;});});
  document.querySelectorAll('.pipe .pcol').forEach(col=>{
    col.addEventListener('dragover',e=>{e.preventDefault();col.classList.add('drag');});
    col.addEventListener('dragleave',()=>col.classList.remove('drag'));
    col.addEventListener('drop',e=>{e.preventDefault();col.classList.remove('drag');const p=DB.projects.find(x=>x.id===dragId);if(p){p.stage=col.dataset.stage;save();go('proj');toast(p.name+' → '+col.dataset.stage);}});
  });
}

/* ============ 分析・BI ============ */
function vBI(){
  const all=DB.orders;
  const byProd={};
  all.forEach(o=>o.lines.forEach(l=>{byProd[l.sku]=(byProd[l.sku]||0)+prod(l.sku).price*l.qty;}));
  const top=Object.entries(byProd).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const max=top.length?top[0][1]:1;
  const totalSales=Object.values(byProd).reduce((s,v)=>s+v,0);
  const byCat={};all.forEach(o=>o.lines.forEach(l=>{const c=prod(l.sku).cat;byCat[c]=(byCat[c]||0)+prod(l.sku).price*l.qty;}));
  const pipeline=DB.projects.reduce((s,p)=>s+p.amount,0);
  return `<div class="crumb">${icon('home')}ホーム / 分析・BI</div>
  <div class="phead"><div class="ptitle">分析・BI</div><span class="badge">営業所向け</span></div>
  <div class="kpis">
    <div class="kpi"><div class="kl">${icon('trend')}受注ベース売上(税抜)</div><div class="kv" style="font-size:23px">${yen(totalSales)}</div></div>
    <div class="kpi"><div class="kl">${icon('package')}受注件数</div><div class="kv">${all.length}</div></div>
    <div class="kpi"><div class="kl">${icon('folder')}案件パイプライン</div><div class="kv" style="font-size:23px">${yen(pipeline)}</div></div>
    <div class="kpi"><div class="kl">${icon('chart')}平均受注単価</div><div class="kv" style="font-size:23px">${yen(all.length?Math.round(totalSales/all.length):0)}</div></div>
  </div>
  <div class="row2">
    <div class="card"><div class="ch">${icon('trend',{size:16})}商品別売上 TOP</div>
      ${top.length?top.map(([sku,v])=>`<div class="metric"><div class="ml"><span class="mn">${icon(iconFor(prod(sku).cat),{size:15})}${prod(sku).name}</span><span class="mv">${yen(v)}</span></div><div class="bar"><i style="width:${Math.round(v/max*100)}%"></i></div></div>`).join(''):'<p class="legend">データなし</p>'}
    </div>
    <div class="card"><div class="ch">${icon('grid',{size:16})}カテゴリ別売上</div>
      ${Object.entries(byCat).sort((a,b)=>b[1]-a[1]).map(([c,v])=>`<div class="metric"><div class="ml"><span class="mn">${icon(iconFor(c),{size:15})}${c}</span><span class="mv">${yen(v)}</span></div><div class="bar"><i style="width:${Math.round(v/(totalSales||1)*100)}%"></i></div></div>`).join('')||'<p class="legend">データなし</p>'}
    </div>
  </div>`;
}

/* ============ 汎用（カテゴリのランディング） ============ */
function vGeneric(c){
  const items=SUBITEMS[c.id]||[];
  return `<div class="crumb">${icon('home')}ホーム / ${catName(c)}</div>
  <div class="phead"><div class="tic" style="width:34px;height:34px;display:grid;place-items:center;color:var(--ink)">${icon(c.icon,{size:26})}</div><div class="ptitle">${catName(c)}</div></div>
  <div class="grid">${items.map((it,i)=>`<div class="tile" onclick="go('g:${c.id}:${i}')"><div class="arr">${icon('arrowR',{size:16})}</div><div class="tic">${icon(c.icon,{size:26})}</div><div class="tn">${it}</div></div>`).join('')}</div>`;
}

/* ============ utils ============ */
function emptyBox(ic,t,s,btn,route){return `<div class="empty"><div class="ei">${icon(ic,{size:30})}</div><div class="et">${t}</div><div>${s||''}</div>${btn?`<div style="margin-top:16px"><button class="btn" onclick="go('${route}')">${btn}</button></div>`:''}</div>`;}

/* ============ init（全スクリプト読込後に起動） ============ */
function boot(){ load(); initChrome(); setMode('customer'); }
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
else setTimeout(boot,0);

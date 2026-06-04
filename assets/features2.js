/* ============================================================
   LEDZ Connect — 追加機能モジュール 2（会議FBの核心痛点）
   ・配送追跡タイムライン（注文→出荷→中継→配達 + ETA）
   ・物件×フロア/ロット別 残管理・分納進捗（重複発注の防止）
   ・多チャネル問い合わせ（電話/メール/チャット/Web + 電話転記）
   ・代理店別 特価（受発注連動）
   ・データ同期元バッジ（既存受発注/SF 等の可視化）
   ============================================================ */

/* ====== データ同期元バッジ ====== */
function srcBadge(src){
  return `<span class="srcbadge" title="このデータの連携元">${icon('swap',{size:11})}同期元：${src}</span>`;
}

/* ====== 代理店別 特価（受発注連動） ====== */
const SPECIALS=[
  {sku:'ERD-7720W',off:12,label:'グレアレスDL 期間限定',until:'2026-06-30'},
  {sku:'SYN-MOD',off:8,label:'Synca 拡販キャンペーン',until:'2026-07-31'},
  {sku:'ERE-2200',off:10,label:'高天井 省エネ更新',until:'2026-07-15'},
];
function specialOf(sku){return SPECIALS.find(s=>s.sku===sku);}
function specialPrice(p){const s=specialOf(p.sku);return s?Math.round(p.price*(1-s.off/100)):p.price;}
function specialBlock(){
  return `<div class="card" style="margin-bottom:22px;border-color:var(--ink)">
    <div class="ch" style="justify-content:space-between"><span>${icon('tag',{size:16})} ${DB.agency} 様 限定 特価</span><span class="legend" style="text-transform:none;letter-spacing:0">${srcBadge('CRM・販促マスタ')}</span></div>
    <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(230px,1fr))">
    ${SPECIALS.map(s=>{const p=prod(s.sku);const sp=specialPrice(p);return `<div class="pcard" style="border-color:var(--ink)">
      <div class="thumb"><image-slot id="ph-sp-${p.sku}" shape="rect" placeholder="${p.sku}" style="width:100%;height:100%;display:block"></image-slot><span class="spbadge">特価 -${s.off}%</span></div>
      <div class="body">
        <div class="sku">${p.sku} ・ ${p.cat}</div>
        <div class="nm">${p.name}</div>
        <div style="margin-top:auto"><span class="legend" style="text-decoration:line-through">${yen(p.price)}</span> <span class="price" style="display:inline">${yen(sp)}<span class="u">/ 税抜</span></span></div>
        <div class="legend" style="margin-top:2px">${s.label}・〜${s.until}</div>
        <div class="pfoot">${stockTag(p)}<button class="btn sm" onclick="addCart('${p.sku}')">${icon('plus',{size:14})}カート</button></div>
      </div></div>`;}).join('')}
    </div>
  </div>`;
}

/* ====== 配送追跡タイムライン ====== */
const TRACK_STEPS=['注文受付','出荷','中継','配達中','配達完了'];
const SHIPMENTS=[
  {id:'SO-204790',dest:'◯◯電材 朝霞本店',site:'△△ホテル 新築（3F客室分）',qty:80,step:3,eta:'2026-06-04 午前',carrier:'西濃 / 朝霞ルート',loc:'さいたま中継センター',
   log:[['2026-06-02 14:20','注文受付','朝霞DC'],['2026-06-03 08:10','出荷','朝霞DC'],['2026-06-03 19:40','中継','さいたま中継センター'],['2026-06-04 06:30','配達中','朝霞配達店']]},
  {id:'SO-204655',dest:'△△商会 大宮支店',site:'B商業施設',qty:16,step:4,eta:'2026-06-01 到着済',carrier:'福山通運',loc:'配達完了',
   log:[['2026-05-30 11:00','注文受付','朝霞DC'],['2026-05-31 09:00','出荷','朝霞DC'],['2026-05-31 18:30','中継','大宮中継'],['2026-06-01 10:15','配達中','大宮配達店'],['2026-06-01 14:02','配達完了','△△商会 大宮支店']]},
  {id:'SO-204815',dest:'C物流 川越センター',site:'C物流倉庫 高天井',qty:8,step:1,eta:'2026-06-06 予定',carrier:'手配中',loc:'出荷準備',
   log:[['2026-06-01 16:40','注文受付','朝霞DC'],['2026-06-04 07:00','出荷','朝霞DC']]},
];
function trackTimeline(s){
  const dots=TRACK_STEPS.map((label,i)=>{
    const done=i<s.step,cur=i===s.step;
    const mk=done?icon('check',{size:13}):cur?icon('truck',{size:14}):'';
    return `<div class="tstep ${done?'done':''} ${cur?'cur':''}">
      <div class="tdot">${mk}</div>
      <div class="tlabel">${label}</div>
      ${cur?`<div class="teta">${icon('clock',{size:12})}ETA ${s.eta}</div>`:''}
    </div>`;
  }).join('<div class="tline"></div>');
  return `<div class="ttrack">${dots}</div>`;
}
function vDeliveryTrack(){
  const c=CATS.find(x=>x.id==='logi');
  const head=`<div class="crumb">${icon('home')}ホーム / <span class="linkish" onclick="go('logi')">在庫・物流</span> / 配送状況追跡</div>
  <div class="phead">
    <button class="btn ghost sm" onclick="go('logi')" style="padding:8px 12px"><span style="transform:scaleX(-1);display:inline-flex">${icon('chevR',{size:15})}</span>戻る</button>
    <div class="tic" style="width:34px;height:34px;display:grid;place-items:center;color:var(--ink)">${icon('truck',{size:26})}</div>
    <div class="ptitle">配送状況追跡</div><span class="badge">${MODE==='customer'?'代理店向け':'営業所向け'}</span>
  </div>`;
  const kpis=`<div class="kpis" style="margin-bottom:22px">
    <div class="kpi"><div class="kl">${icon('truck')}追跡中</div><div class="kv">${SHIPMENTS.filter(s=>s.step<4).length}</div></div>
    <div class="kpi"><div class="kl">${icon('clock')}本日到着予定</div><div class="kv">${SHIPMENTS.filter(s=>s.eta.includes('2026-06-04')).length}</div></div>
    <div class="kpi"><div class="kl">${icon('check')}配達完了</div><div class="kv">${SHIPMENTS.filter(s=>s.step>=4).length}</div></div>
    <div class="kpi"><div class="kl">${icon('phone')}問合せ削減</div><div class="kv">-68<span class="u">%</span></div><div class="kd">電話/FAX照会</div></div>
  </div>`;
  const cards=SHIPMENTS.map(s=>`<div class="card" style="margin-bottom:16px">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:14px;flex-wrap:wrap;margin-bottom:18px">
      <div><div style="font-weight:700;font-size:15px">${s.id} ・ ${s.dest}</div>
      <div class="legend" style="margin-top:3px">${icon('pin',{size:12})} 納入物件：${s.site} ／ ${s.qty}点 ／ ${s.carrier}</div></div>
      <div style="text-align:right">${s.step>=4?P('ok','配達完了'):P('info',TRACK_STEPS[s.step])}<div class="legend" style="margin-top:4px">現在地：${s.loc}</div></div>
    </div>
    ${trackTimeline(s)}
    <div style="margin-top:18px;text-align:right"><button class="btn ghost sm" onclick="trackLog('${s.id}')">${icon('clock',{size:14})}配送履歴</button></div>
  </div>`).join('');
  return head+kpis+`<div style="margin-bottom:8px">${srcBadge('既存受発注（SAP）／配送会社API')}</div>`+cards;
}
function trackLog(id){
  const s=SHIPMENTS.find(x=>x.id===id);
  openModal(`<h3>${icon('truck',{size:18})}${id} 配送履歴<button class="x" onclick="closeModal()">${icon('close')}</button></h3>
    <div class="mb"><div class="vlog">${s.log.map((l,i)=>`<div class="vlog-row ${i===s.log.length-1?'last':''}"><div class="vlog-dot"></div><div><div style="font-weight:700;font-size:13px">${l[1]}</div><div class="legend">${l[0]} ・ ${l[2]}</div></div></div>`).join('')}</div>
    <p class="legend" style="margin-top:14px">ETA：<b>${s.eta}</b>（配送会社APIと自動連携を想定）</p></div>
    <div class="mf"><button class="btn" onclick="closeModal()">閉じる</button></div>`);
}

/* ====== 物件×フロア/ロット別 残管理・分納進捗 ====== */
const SITE_STATUS={'納品済':'ok','出荷済':'info','配送中':'info','手配済':'warn','未手配':'mut'};
const DELIV_SITES=[
  {id:'ST-1001',name:'△△ホテル 新築工事',customer:'A工務店',so:'SO-204790',owner:'田中',
   units:[
    {floor:'1F ロビー・レストラン',sku:'ERS-6021B',qty:40,status:'納品済',date:'2026-05-20'},
    {floor:'2F 宴会場',sku:'ERD-7720W',qty:60,status:'納品済',date:'2026-05-22'},
    {floor:'3F 客室 201-220',sku:'ERD-6543W',qty:80,status:'配送中',date:'2026-06-04'},
    {floor:'4F 客室 301-320',sku:'ERD-6543W',qty:80,status:'未手配',date:null},
    {floor:'5F 客室 401-420',sku:'ERD-6543W',qty:80,status:'未手配',date:null},
   ]},
  {id:'ST-1002',name:'B商業施設 リニューアル',customer:'B開発',so:'SO-204655',owner:'梶原',
   units:[
    {floor:'B1 駐車場',sku:'ERG-5512',qty:24,status:'納品済',date:'2026-05-18'},
    {floor:'1F 物販ゾーン',sku:'ERS-5310W',qty:120,status:'納品済',date:'2026-05-26'},
    {floor:'2F 物販ゾーン',sku:'ERS-5310W',qty:120,status:'出荷済',date:'2026-06-05'},
    {floor:'3F レストラン街',sku:'EFI-8810',qty:36,status:'手配済',date:'2026-06-12'},
   ]},
  {id:'ST-1003',name:'C物流倉庫 高天井LED化',customer:'C物流',so:'SO-204815',owner:'鈴木',
   units:[
    {floor:'A棟',sku:'ERE-2200',qty:48,status:'手配済',date:'2026-06-06'},
    {floor:'B棟',sku:'ERE-2200',qty:48,status:'未手配',date:null},
    {floor:'C棟（保留）',sku:'ERE-2200',qty:48,status:'未手配',date:null},
   ]},
];
function siteProgress(site){const done=site.units.filter(u=>u.status==='納品済').length;return Math.round(done/site.units.length*100);}
function siteRemain(site){return site.units.filter(u=>u.status==='未手配').reduce((s,u)=>s+u.qty,0);}
function vSites(){
  const head=`<div class="crumb">${icon('home')}ホーム / 物件別 納品・残管理</div>
  <div class="phead"><div class="ptitle">物件別 納品・残管理</div><span class="badge">${MODE==='customer'?'代理店向け':'営業所向け'}</span></div>`;
  const totRemain=DELIV_SITES.reduce((s,x)=>s+siteRemain(x),0);
  const kpis=`<div class="kpis" style="margin-bottom:22px">
    <div class="kpi"><div class="kl">${icon('floors')}進行中物件</div><div class="kv">${DELIV_SITES.length}</div></div>
    <div class="kpi"><div class="kl">${icon('package')}未手配 残数</div><div class="kv">${totRemain}<span class="u">点</span></div><div class="kd">要手配</div></div>
    <div class="kpi"><div class="kl">${icon('alert')}重複発注 防止</div><div class="kv">${DELIV_SITES.reduce((s,x)=>s+x.units.filter(u=>u.status==='納品済').length,0)}</div><div class="kd">納品済ロット</div></div>
    <div class="kpi"><div class="kl">${icon('truck')}分納進行中</div><div class="kv">${DELIV_SITES.filter(x=>x.units.some(u=>['出荷済','配送中','手配済'].includes(u.status))).length}</div></div>
  </div>`;
  const notice=`<div class="card" style="margin-bottom:18px;border-left:3px solid var(--ink)"><div style="display:flex;gap:12px;align-items:flex-start">${icon('alert',{size:20})}<div><div style="font-weight:700">「どの階まで納品済か」を物件単位で共有</div><p class="legend" style="margin-top:5px;line-height:1.7">フロア／ロット別の納品状況を可視化し、営業担当の記憶頼みによる<b>重複発注を防止</b>。未手配の残数から、その場で追加手配できます。</p></div></div></div>`;
  const cards=DELIV_SITES.map(site=>{
    const prog=siteProgress(site),rem=siteRemain(site);
    const rows=site.units.map((u,i)=>{const p=prod(u.sku);const cls=SITE_STATUS[u.status];
      const act=u.status==='未手配'?`<button class="btn sm" onclick="arrangeUnit('${site.id}',${i})">${icon('plus',{size:13})}手配</button>`:(u.status==='納品済'?`<button class="btn ghost sm" onclick="reorderWarn('${site.id}',${i})">${icon('refresh',{size:13})}再手配</button>`:'');
      return `<tr><td><b>${u.floor}</b></td><td>${p.name}<br><span class="legend">${u.sku}</span></td><td style="font-variant-numeric:tabular-nums">${u.qty}点</td><td><span class="pill ${cls}"><span class="d"></span>${u.status}</span></td><td>${u.date||'—'}</td><td style="text-align:right">${act}</td></tr>`;}).join('');
    return `<div class="card" style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:14px;flex-wrap:wrap;margin-bottom:14px">
        <div><div style="font-weight:700;font-size:15px">${site.name}</div><div class="legend" style="margin-top:3px">${site.customer} ／ 担当 ${site.owner} ／ ${site.so}</div></div>
        <div style="text-align:right;min-width:160px">
          <div class="legend">納品進捗 ${prog}%${rem?` ・ 残 ${rem}点`:''}</div>
          <div class="bar" style="margin-top:6px"><i style="width:${prog}%"></i></div>
        </div>
      </div>
      <div class="tablewrap"><table><thead><tr><th>フロア / ロット</th><th>器具</th><th>数量</th><th>納品状況</th><th>予定/実績</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>
    </div>`;
  }).join('');
  return head+kpis+notice+`<div style="margin-bottom:8px">${srcBadge('既存受発注（SAP）／案件管理')}</div>`+cards;
}
function arrangeUnit(siteId,i){
  const site=DELIV_SITES.find(s=>s.id===siteId);const u=site.units[i];const p=prod(u.sku);
  const c=DB.cart.find(x=>x.sku===u.sku);if(c)c.qty+=u.qty;else DB.cart.push({sku:u.sku,qty:u.qty});
  u.status='手配済';u.date=today();save();updateCartDot();
  toast(site.name+' '+u.floor+' を手配（カートに'+u.qty+'点追加）');go('deliv');
}
function reorderWarn(siteId,i){
  const site=DELIV_SITES.find(s=>s.id===siteId);const u=site.units[i];
  openModal(`<h3>${icon('alert',{size:18})}重複発注の確認<button class="x" onclick="closeModal()">${icon('close')}</button></h3>
    <div class="mb"><div class="card" style="border-left:3px solid var(--bad);background:var(--bad-bg);border-color:var(--bad-bg)">
      <div style="font-weight:700;color:var(--bad)">${site.name}／${u.floor} は <u>納品済</u> です</div>
      <p style="font-size:13px;color:var(--ink-2);margin-top:6px;line-height:1.7">${u.date} に ${u.qty}点 を納品済みです。追加手配すると重複発注になる可能性があります。</p>
    </div>
    <p class="legend" style="margin-top:14px">それでも追加手配しますか？</p></div>
    <div class="mf"><button class="btn ghost" onclick="closeModal()">やめる</button><button class="btn danger" onclick="closeModal();toast('追加手配しました（要確認）')">承知のうえ手配</button></div>`);
}

/* ====== 多チャネル問い合わせ inbox ====== */
const CHAN_ICON={'電話':'phone','メール':'mail','チャット':'chat','Web':'grid','FAX':'doc'};
const INBOX=[
  {id:'TK-5521',ch:'電話',from:'◯◯電材 山田様',subject:'納期の確認（ERX-9001 受注生産品）',date:'2026-05-30 10:24',status:'対応中',priority:'高',
   transcript:'（自動文字起こし）「ERX-9001 を40台、いつ頃納品できますか。現場が6月末なので間に合うか確認したい」→ 営業所より6/28回答予定と案内。',shared:true},
  {id:'TK-5520',ch:'メール',from:'△△商会 佐藤様',subject:'ERD-7720W の光度データ(IES)が欲しい',date:'2026-05-29 16:10',status:'解決',priority:'中',
   transcript:'照度計算に使うIESデータの依頼。ドキュメントよりDLリンクを返信し解決。',shared:true},
  {id:'TK-5519',ch:'チャット',from:'□□電気 鈴木様',subject:'Synca 調光に対応した器具を知りたい',date:'2026-05-28 11:42',status:'解決',priority:'低',
   transcript:'AIチャットで一次回答→ 有人へ転送。SYN-MOD と対応器具を案内。',shared:true},
  {id:'TK-5518',ch:'FAX',from:'◇◇工業 高橋様',subject:'分納の3F分 出荷予定を知りたい',date:'2026-05-27 09:05',status:'対応中',priority:'中',
   transcript:'（FAX-OCR取込）△△ホテル3F分の出荷予定照会。物件別残管理より6/4出荷と回答。',shared:false},
  {id:'TK-5517',ch:'Web',from:'◯◯電材 山田様',subject:'返品（初期不良）の手続き',date:'2026-05-23 14:30',status:'解決',priority:'高',
   transcript:'Webフォームより返品申請。RT-3008 として受付・承認済み。',shared:true},
];
function vInbox(){
  const c=CATS.find(x=>x.id==='sup');
  const head=`<div class="crumb">${icon('home')}ホーム / <span class="linkish" onclick="go('sup')">問い合わせ</span> / 統合インボックス</div>
  <div class="phead">
    <button class="btn ghost sm" onclick="go('sup')" style="padding:8px 12px"><span style="transform:scaleX(-1);display:inline-flex">${icon('chevR',{size:15})}</span>戻る</button>
    <div class="tic" style="width:34px;height:34px;display:grid;place-items:center;color:var(--ink)">${icon('inbox',{size:26})}</div>
    <div class="ptitle">統合インボックス</div><span class="badge">${MODE==='customer'?'代理店向け':'営業所向け'}</span>
  </div>`;
  const byCh={};INBOX.forEach(m=>byCh[m.ch]=(byCh[m.ch]||0)+1);
  const kpis=`<div class="kpis" style="margin-bottom:22px">
    ${['電話','メール','チャット','Web','FAX'].map(ch=>`<div class="kpi"><div class="kl">${icon(CHAN_ICON[ch])}${ch}</div><div class="kv">${byCh[ch]||0}</div></div>`).join('')}
  </div>`;
  const rows=INBOX.map(m=>`<tr style="cursor:pointer" onclick="openInbox('${m.id}')">
    <td>${P('mut',m.ch,false).replace('<span class="d"></span>','')}</td>
    <td><b>${m.subject}</b><br><span class="legend">${m.from}</span></td>
    <td><span class="pill ${m.priority==='高'?'bad':m.priority==='中'?'warn':'mut'}"><span class="d"></span>${m.priority}</span></td>
    <td>${m.date}</td>
    <td><span class="pill ${m.status==='解決'?'ok':'warn'}"><span class="d"></span>${m.status}</span></td>
    <td>${m.shared?P('info','顧客と共有'):P('mut','社内のみ')}</td>
  </tr>`).join('');
  const notice=`<div class="card" style="margin-bottom:18px;border-left:3px solid var(--ink)"><div style="display:flex;gap:12px;align-items:flex-start">${icon('phone',{size:20})}<div><div style="font-weight:700">電話・メール・チャット・FAX を一元化</div><p class="legend" style="margin-top:5px;line-height:1.7">通話は<b>自動文字起こし</b>で履歴に登録。Web/メール/チャット/FAXと同じ画面で管理し、<b>顧客とも双方向に共有</b>できます。</p></div></div></div>`;
  return head+kpis+notice+`<div style="margin-bottom:8px">${srcBadge('CTI（電話）／メール／チャット／FAX-OCR')}</div>
  <div class="tablewrap"><table><thead><tr><th>通路</th><th>件名 / 相手</th><th>優先</th><th>日時</th><th>状況</th><th>共有</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
function openInbox(id){
  const m=INBOX.find(x=>x.id===id);
  openModal(`<h3>${icon(CHAN_ICON[m.ch],{size:18})}${m.id} ・ ${m.ch}<button class="x" onclick="closeModal()">${icon('close')}</button></h3>
    <div class="mb">
      <div style="font-weight:700;font-size:15px">${m.subject}</div>
      <div class="legend" style="margin:4px 0 16px">${m.from} ・ ${m.date}</div>
      <table class="bare"><tbody>
        <tr><td style="color:var(--muted);width:34%">通路</td><td><b>${m.ch}</b></td></tr>
        <tr><td style="color:var(--muted)">優先度</td><td>${m.priority}</td></tr>
        <tr><td style="color:var(--muted)">状況</td><td>${m.status}</td></tr>
        <tr><td style="color:var(--muted)">顧客共有</td><td>${m.shared?'あり（双方向）':'社内のみ'}</td></tr>
      </tbody></table>
      <div style="margin-top:16px;padding:14px;background:var(--surface-2);border:1px solid var(--line);border-radius:var(--r)">
        <div style="font-weight:700;font-size:12px;letter-spacing:.04em;margin-bottom:6px">${m.ch==='電話'?icon('phone',{size:13})+' 通話 自動文字起こし':icon('doc',{size:13})+' 内容'}</div>
        <div style="font-size:13px;line-height:1.8;color:var(--ink-2)">${m.transcript}</div>
      </div>
    </div>
    <div class="mf"><button class="btn ghost" onclick="toast('担当へ転送しました')">${icon('users',{size:15})}有人へ転送</button><button class="btn" onclick="closeModal()">閉じる</button></div>`);
}

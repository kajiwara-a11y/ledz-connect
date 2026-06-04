/* ============================================================
   LEDZ Connect — 追加機能モジュール
   ・受注承認ワークフロー（代理発注→営業所承認・特価査定）
   ・システム構成/連携図（パターン1/2/3、パターン2推し）
   ・導入ロードマップ（17機能をPhase1〜3）
   ・請求・帳票（納品書/請求書 PDF想定）
   ・返品・特価申請
   ・自動発注（過去注文から提案）
   ・代理店名の編集
   ============================================================ */

/* ============ 受注承認ワークフロー ============ */
function vApproval(){
  const head=`<div class="crumb">${icon('home')}ホーム / 受注承認</div>
  <div class="phead"><div class="ptitle">受注承認</div><span class="badge">営業所向け</span></div>`;
  const pend=DB.orders.filter(o=>o.status==='承認待ち');
  const done=DB.orders.filter(o=>['受付済み','出荷準備中','配送中','納品完了','差戻し'].includes(o.status)).slice(0,6);
  const kpis=`<div class="kpis" style="margin-bottom:22px">
    <div class="kpi"><div class="kl">${icon('check')}承認待ち</div><div class="kv">${pend.length}</div><div class="kd">要対応</div></div>
    <div class="kpi"><div class="kl">${icon('receipt')}特価申請あり</div><div class="kv">${pend.filter(o=>o.approval&&o.approval.requestedDiscount>0).length}</div></div>
    <div class="kpi"><div class="kl">${icon('users')}承認権限者</div><div class="kv">50<span class="u">名</span></div><div class="kd">全国営業所</div></div>
    <div class="kpi"><div class="kl">${icon('clock')}平均承認</div><div class="kv">3.2<span class="u">h</span></div></div>
  </div>`;
  const queue=pend.length?pend.map(o=>{
    const sub=linesTotal(o.lines),req=o.approval?o.approval.requestedDiscount:0;
    const net=Math.round(sub*(1-req/100)),gross=Math.round(net*(1+TAX));
    return `<div class="card" style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap">
        <div>
          <div style="font-weight:700;font-size:15px">${o.id} ・ ${o.approval?o.approval.by:'代理店'}</div>
          <div class="legend" style="margin-top:3px">${o.date} ・ ${o.lines.length}品目 / ${o.lines.reduce((s,l)=>s+l.qty,0)}点</div>
          ${o.approval&&o.approval.note?`<div style="margin-top:8px;font-size:12.5px;color:var(--ink-2)">${icon('chat',{size:13})} ${o.approval.note}</div>`:''}
        </div>
        <div style="text-align:right">
          <div class="legend">申請金額（税込）</div>
          <div class="bignum" style="font-size:20px">${yen(gross)}</div>
          ${req?`<div style="margin-top:4px">${P('warn','特価希望 '+req+'%')}</div>`:'<div style="margin-top:4px">'+P('mut','特価なし')+'</div>'}
        </div>
      </div>
      <table class="bare" style="margin-top:6px"><tbody>${o.lines.map(l=>{const p=prod(l.sku);return `<tr><td>${p.name}<br><span class="legend">${p.sku}</span></td><td style="text-align:right">${l.qty} × ${yen(p.price)}</td><td style="text-align:right;font-variant-numeric:tabular-nums"><b>${yen(p.price*l.qty)}</b></td></tr>`;}).join('')}</tbody></table>
      <div style="display:flex;gap:12px;align-items:center;margin-top:16px;flex-wrap:wrap;padding-top:16px;border-top:1px solid var(--line)">
        <label style="font-size:12px;font-weight:700;color:var(--ink-2)">承認値引</label>
        <select id="ap_${o.id}" style="max-width:130px;padding:9px 12px;border:1px solid var(--line);border-radius:2px;font-family:var(--font)">
          ${[0,3,5,8,10].map(d=>`<option value="${d}" ${d===req?'selected':''}>${d}%</option>`).join('')}
        </select>
        <span class="legend">査定後の値引率を選択</span>
        <div style="flex:1"></div>
        <button class="btn danger sm" onclick="rejectOrder('${o.id}')">${icon('close',{size:14})}差戻し</button>
        <button class="btn sm" onclick="approveOrder('${o.id}')">${icon('check',{size:14})}承認して確定</button>
      </div>
    </div>`;
  }).join(''):`<div class="card"><p class="legend">承認待ちの発注はありません。代理店ビューで発注すると、ここに承認待ちとして表示されます。</p></div>`;
  const hist=done.length?`<div class="sec">最近の承認・処理</div>
    <div class="tablewrap"><table><thead><tr><th>注文番号</th><th>代理店</th><th>承認値引</th><th>金額(税込)</th><th>状態</th></tr></thead><tbody>
    ${done.map(o=>`<tr><td><b>${o.id}</b></td><td>${o.approval?o.approval.by:'—'}</td><td>${orderDisc(o)?P('info',orderDisc(o)+'%'):'—'}</td><td style="font-variant-numeric:tabular-nums">${yen(orderGross(o))}</td><td>${orderPill(o.status)}</td></tr>`).join('')}
    </tbody></table></div>`:'';
  return head+kpis+`<div class="sec">承認キュー <span class="scount">${pend.length} 件</span></div>${queue}${hist}`;
}
function approveOrder(id){
  const o=DB.orders.find(x=>x.id===id);if(!o)return;
  const sel=document.getElementById('ap_'+id);const d=sel?Number(sel.value):0;
  if(!o.approval)o.approval={};o.approval.approvedDiscount=d;o.status='受付済み';
  DB.points+=Math.floor(orderGross(o)/1000);
  save();go('approval');toast(id+' を承認しました（値引 '+d+'%）');
}
function rejectOrder(id){
  const o=DB.orders.find(x=>x.id===id);if(!o)return;
  o.status='差戻し';if(o.approval)o.approval.approvedDiscount=null;
  save();go('approval');toast(id+' を差戻しました');
}

/* ============ システム構成・連携図 ============ */
function archBox(title,sub,tag,strong){
  return `<div class="card" style="padding:16px 18px;${strong?'border-color:var(--ink);border-width:2px':''}">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
      <div style="font-weight:700;font-size:14px;flex:1;min-width:0">${title}</div>
      ${tag?`<span class="pill ${tag.cls}" style="flex:none">${tag.t}</span>`:''}
    </div>
    ${sub?`<div class="legend" style="margin-top:6px;line-height:1.6">${sub}</div>`:''}
  </div>`;
}
function archConn(label){
  return `<div style="display:flex;flex-direction:column;align-items:center;padding:6px 0;color:var(--muted)">
    ${icon('swap',{size:18})}<span style="font-size:11px;letter-spacing:.04em;margin-top:2px">${label}</span>
  </div>`;
}
function vArch(){
  const head=`<div class="crumb">${icon('home')}ホーム / システム構成・連携</div>
  <div class="phead"><div class="ptitle">システム構成・連携</div><span class="badge">提案</span></div>`;
  const diagram=`<div class="card" style="margin-bottom:24px">
    <div class="ch">${icon('sitemap',{size:16})}連携アーキテクチャ（推奨：パターン2）</div>
    <div style="max-width:560px;margin:0 auto">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        ${archBox('代理店','受発注・見積・問い合わせ',{cls:'mut',t:'ユーザー'})}
        ${archBox('営業所（全国約50名）','代理発注・受注承認',{cls:'mut',t:'ユーザー'})}
      </div>
      ${archConn('ログイン / 単一窓口')}
      ${archBox('LEDZ Connect 取引先ポータル','受発注UI・受注承認・販促・AI自動発注・分析。<b>顧客接点を集約する新規レイヤー</b>',{cls:'info',t:'新規構築'},true)}
      ${archConn('API連携（受注・在庫・マスタ）')}
      ${archBox('既存受発注システム（受注エンジン）','SAP連携済の現行システムを<b>受注処理の中核として維持</b>。リスク・コストを抑制',{cls:'ok',t:'現行維持'},true)}
      ${archConn('データ連携')}
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
        ${archBox('Salesforce','CRM・商談',{cls:'mut',t:'連携'})}
        ${archBox('会計システム','請求・入金',{cls:'mut',t:'連携'})}
        ${archBox('コーポレート/製品検索サイト','製品マスタ',{cls:'mut',t:'連携'})}
      </div>
    </div>
  </div>`;
  const patterns=`<div class="sec">構築パターンの比較</div>
  <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr))">
    <div class="card">
      <div class="ch" style="text-transform:none;letter-spacing:0">パターン1：全面新規</div>
      <p style="font-size:13px;color:var(--ink-2);line-height:1.7">既存受発注システムを置換し、ポータルに受注エンジンも内包。</p>
      <table class="bare" style="margin-top:8px"><tbody>
        <tr><td>初期コスト</td><td style="text-align:right">${P('bad','大')}</td></tr>
        <tr><td>リスク</td><td style="text-align:right">${P('bad','高')}</td></tr>
        <tr><td>SAP資産</td><td style="text-align:right">${P('warn','作り直し')}</td></tr>
      </tbody></table>
    </div>
    <div class="card" style="border-color:var(--ink);border-width:2px">
      <div class="ch" style="text-transform:none;letter-spacing:0;justify-content:space-between">パターン2：API連携 <span class="pill ok">推奨</span></div>
      <p style="font-size:13px;color:var(--ink-2);line-height:1.7">既存を受注エンジンとして残し、ポータルはAPIで連携。顧客接点だけを刷新。</p>
      <table class="bare" style="margin-top:8px"><tbody>
        <tr><td>初期コスト</td><td style="text-align:right">${P('ok','中')}</td></tr>
        <tr><td>リスク</td><td style="text-align:right">${P('ok','低')}</td></tr>
        <tr><td>SAP資産</td><td style="text-align:right">${P('ok','活用')}</td></tr>
      </tbody></table>
    </div>
    <div class="card">
      <div class="ch" style="text-transform:none;letter-spacing:0">パターン3：既存に追加</div>
      <p style="font-size:13px;color:var(--ink-2);line-height:1.7">既存受発注システムに機能を追加。UI刷新・拡張に制約。</p>
      <table class="bare" style="margin-top:8px"><tbody>
        <tr><td>初期コスト</td><td style="text-align:right">${P('ok','小')}</td></tr>
        <tr><td>拡張性</td><td style="text-align:right">${P('bad','低')}</td></tr>
        <tr><td>UX刷新</td><td style="text-align:right">${P('warn','限定的')}</td></tr>
      </tbody></table>
    </div>
  </div>
  <div class="card" style="margin-top:16px;border-left:3px solid var(--ink)">
    <div style="display:flex;gap:12px;align-items:flex-start">${icon('shield',{size:20})}<div><div style="font-weight:700">提案：パターン2（既存をAPI連携で活かす）</div>
    <p style="font-size:13px;color:var(--ink-2);line-height:1.7;margin-top:6px">SAP連携済の受発注資産を受注エンジンとして維持しつつ、代理店・営業所の顧客接点（受発注UX・承認・販促・AI）だけを新ポータルに集約。段階導入が可能で、初期投資とリスクを最小化します。</p></div></div>
  </div>`;
  return head+diagram+patterns;
}

/* ============ 導入ロードマップ ============ */
function vRoadmap(){
  const head=`<div class="crumb">${icon('home')}ホーム / 導入ロードマップ</div>
  <div class="phead"><div class="ptitle">導入ロードマップ</div><span class="badge">提案</span></div>`;
  const phases=[
    {t:'Phase 1',when:'2026年度（今期）構想・PoC',cost:'1,000〜2,000万円',note:'まず顧客接点と業務の核を立ち上げ',
     items:['受発注（代理発注）','受注承認ワークフロー','在庫・納期回答','ドキュメント（仕様書/CAD/IES）','問い合わせ（チケット/FAQ）','マイページ・請求/帳票'],tag:'ok'},
    {t:'Phase 2',when:'2027年4月〜 予算化・第一弾',cost:'追加開発で段階拡張',note:'販促・分析・基幹連携を強化',
     items:['AI・自動発注提案','分析・BIダッシュボード','CRM（代理店管理）連携','マーケティング配信','ポイント・会員制度','返品・特価申請'],tag:'info'},
    {t:'Phase 3',when:'複数年・順次',cost:'運用しながら高度化',note:'高度化と全社連携',
     items:['コミュニティ/フォーラム','需要・在庫予測（高度AI）','Salesforce/MA 全連携','コーポレート/製品検索サイト連携','管理者機能・監査の高度化'],tag:'mut'},
  ];
  const timeline=`<div class="card" style="margin-bottom:22px;border-left:3px solid var(--ink)">
    <div style="display:flex;gap:12px;align-items:flex-start">${icon('calendar',{size:20})}<div>
    <div style="font-weight:700">段階構築の方針</div>
    <p style="font-size:13px;color:var(--ink-2);line-height:1.7;margin-top:6px">17機能を一括ではなく <b>3フェーズ</b> に分割。今期は構想・PoC、2027年度に予算化して第一弾を稼働、以降は運用しながら順次拡張します。<b>億単位の一括投資を避け、1,000〜2,000万円規模から段階的に</b>立ち上げる前提です。</p></div></div>
  </div>`;
  const cards=phases.map((ph,i)=>`<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:6px">
      <div style="font-weight:700;font-size:17px">${ph.t}</div><span class="pill ${ph.tag}">${ph.items.length}機能</span>
    </div>
    <div class="legend">${ph.when}</div>
    <div style="margin:14px 0;padding:12px 0;border-top:1px solid var(--line-2);border-bottom:1px solid var(--line-2)">
      ${ph.items.map(it=>`<div style="display:flex;align-items:center;gap:9px;padding:5px 0;font-size:13px"><span style="color:var(--ink)">${icon('check',{size:14})}</span>${it}</div>`).join('')}
    </div>
    <table class="bare"><tbody>
      <tr><td style="color:var(--muted)">想定規模</td><td style="text-align:right"><b>${ph.cost}</b></td></tr>
      <tr><td style="color:var(--muted)">狙い</td><td style="text-align:right">${ph.note}</td></tr>
    </tbody></table>
  </div>`).join('');
  return head+timeline+`<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr));align-items:start">${cards}</div>`;
}

/* ============ 請求・帳票 ============ */
function vBill(){
  const head=`<div class="crumb">${icon('home')}ホーム / 請求・帳票</div>
  <div class="phead"><div class="ptitle">請求・帳票</div><span class="badge">代理店向け</span></div>`;
  const confirmed=DB.orders.filter(o=>FLOW.includes(o.status));
  const months={};confirmed.forEach(o=>{const m=o.date.slice(0,7);months[m]=(months[m]||0)+orderGross(o);});
  const monthRows=Object.entries(months).sort((a,b)=>b[0].localeCompare(a[0])).map(([m,v])=>`<tr>
    <td><b>${m.replace('-','年')}月</b></td><td>${confirmed.filter(o=>o.date.slice(0,7)===m).length}件</td>
    <td style="font-variant-numeric:tabular-nums">${yen(v)}</td>
    <td><span class="pill ${m<today().slice(0,7)?'ok':'warn'}"><span class="d"></span>${m<today().slice(0,7)?'確定':'締め前'}</span></td>
    <td style="text-align:right"><button class="btn ghost sm" onclick="toast('${m} 請求書 PDF を発行（想定）')">${icon('doc',{size:14})}請求書PDF</button></td></tr>`).join('')||'<tr><td colspan="5" class="legend">確定した請求はありません</td></tr>';
  const docRows=confirmed.slice(0,8).map(o=>`<tr>
    <td><b>${o.id}</b></td><td>${o.date}</td><td>${prod(o.lines[0].sku).name}${o.lines.length>1?' 他'+(o.lines.length-1)+'点':''}</td>
    <td style="font-variant-numeric:tabular-nums">${yen(orderGross(o))}</td>
    <td style="text-align:right;white-space:nowrap">
      <button class="btn ghost sm" onclick="toast('${o.id} 納品書 PDF を発行（想定）')">${icon('doc',{size:14})}納品書</button>
      <button class="btn ghost sm" onclick="toast('${o.id} 請求書 PDF を発行（想定）')">${icon('receipt',{size:14})}請求書</button>
    </td></tr>`).join('')||'<tr><td colspan="5" class="legend">帳票対象の注文はありません</td></tr>';
  const totalUnpaid=DB.orders.filter(o=>FLOW.includes(o.status)&&o.status!=='納品完了').reduce((s,o)=>s+orderGross(o),0);
  const thisMonth=months[today().slice(0,7)]||0;
  return head+`<div class="kpis" style="margin-bottom:22px">
    <div class="kpi"><div class="kl">${icon('receipt')}今月請求予定(税込)</div><div class="kv" style="font-size:21px">${yen(thisMonth)}</div></div>
    <div class="kpi"><div class="kl">${icon('clock')}未納品(請求予定)</div><div class="kv" style="font-size:21px">${yen(totalUnpaid)}</div></div>
    <div class="kpi"><div class="kl">${icon('doc')}発行可能帳票</div><div class="kv">${confirmed.length*2}</div><div class="kd">納品書+請求書</div></div>
    <div class="kpi"><div class="kl">${icon('store')}支払条件</div><div class="kv" style="font-size:17px">月末締め翌末</div></div>
  </div>
  <div class="sec">月次請求</div>
  <div class="tablewrap" style="margin-bottom:8px"><table><thead><tr><th>請求月</th><th>件数</th><th>金額(税込)</th><th>状態</th><th></th></tr></thead><tbody>${monthRows}</tbody></table></div>
  <div class="sec">納品書・請求書（注文別）</div>
  <div class="tablewrap"><table><thead><tr><th>注文番号</th><th>注文日</th><th>主要品目</th><th>金額(税込)</th><th></th></tr></thead><tbody>${docRows}</tbody></table></div>`;
}

/* ============ 返品・特価申請 ============ */
function vReturns(){
  const head=`<div class="crumb">${icon('home')}ホーム / 返品・特価申請</div>
  <div class="phead"><div class="ptitle">返品・特価申請</div><span class="badge">代理店向け</span></div>`;
  const retRows=DB.returns.map(r=>{const p=prod(r.sku);const cls=r.status==='承認'?'ok':r.status==='却下'?'bad':'warn';
    return `<tr><td><b>${r.id}</b></td><td>${r.date}</td><td>${r.orderId}</td><td>${p?p.name:r.sku}<br><span class="legend">${r.sku} ・ ${r.qty}点</span></td><td>${r.reason}</td><td><span class="pill ${cls}"><span class="d"></span>${r.status}</span></td></tr>`;}).join('')||'<tr><td colspan="6" class="legend">返品申請はありません</td></tr>';
  const discOrders=DB.orders.filter(o=>o.approval&&o.approval.requestedDiscount>0);
  const discRows=discOrders.map(o=>{const st=o.status==='承認待ち'?'warn':o.status==='差戻し'?'bad':'ok';const fin=orderDisc(o);
    return `<tr><td><b>${o.id}</b></td><td>${o.date}</td><td>${P('mut',o.approval.requestedDiscount+'% 希望',false)}</td><td>${o.status==='承認待ち'?'査定中':fin+'% で査定'}</td><td style="font-variant-numeric:tabular-nums">${yen(orderGross(o))}</td><td><span class="pill ${st}"><span class="d"></span>${o.status}</span></td></tr>`;}).join('')||'<tr><td colspan="6" class="legend">特価・値引申請はありません</td></tr>';
  const delivered=DB.orders.filter(o=>o.status==='納品完了');
  return head+`<div class="kpis" style="margin-bottom:22px">
    <div class="kpi"><div class="kl">${icon('undo')}返品申請</div><div class="kv">${DB.returns.length}</div></div>
    <div class="kpi"><div class="kl">${icon('clock')}返品 処理中</div><div class="kv">${DB.returns.filter(r=>r.status==='申請中').length}</div></div>
    <div class="kpi"><div class="kl">${icon('receipt')}特価申請</div><div class="kv">${discOrders.length}</div></div>
    <div class="kpi"><div class="kl">${icon('check')}承認済</div><div class="kv">${discOrders.filter(o=>orderDisc(o)>0).length}</div></div>
  </div>
  <div class="sec">返品申請 <button class="btn sm" onclick="newReturn()">${icon('plus',{size:14})}返品を申請</button></div>
  <div class="tablewrap" style="margin-bottom:8px"><table><thead><tr><th>申請番号</th><th>申請日</th><th>注文</th><th>商品</th><th>理由</th><th>状態</th></tr></thead><tbody>${retRows}</tbody></table></div>
  <div class="sec">特価・値引申請</div>
  <div class="tablewrap"><table><thead><tr><th>注文番号</th><th>申請日</th><th>希望</th><th>査定</th><th>金額(税込)</th><th>状態</th></tr></thead><tbody>${discRows}</tbody></table></div>
  ${delivered.length?'':'<p class="legend" style="margin-top:14px">※ 返品は「納品完了」の注文が対象です。</p>'}`;
}
function requestReturn(oid){
  go('ret');
  newReturn();
  const sel=document.getElementById('rt_o');
  if(sel){sel.value=oid;rtFillLines();}
}
function newReturn(){
  const delivered=DB.orders.filter(o=>o.status==='納品完了');
  if(!delivered.length){toast('返品対象（納品完了）の注文がありません');return;}
  const opts=delivered.map(o=>`<option value="${o.id}">${o.id}（${o.date}）</option>`).join('');
  openModal(`<h3>${icon('undo',{size:18})}返品を申請<button class="x" onclick="closeModal()">${icon('close')}</button></h3>
    <div class="mb">
      <div class="field"><label>対象注文</label><select id="rt_o" onchange="rtFillLines()">${opts}</select></div>
      <div class="field"><label>商品</label><select id="rt_sku"></select></div>
      <div class="field"><label>数量</label><input id="rt_qty" type="number" value="1" min="1"></div>
      <div class="field"><label>理由</label><select id="rt_reason"><option>初期不良（点灯不良）</option><option>誤発注</option><option>破損</option><option>仕様相違</option><option>その他</option></select></div>
    </div>
    <div class="mf"><button class="btn ghost" onclick="closeModal()">キャンセル</button><button class="btn" onclick="saveReturn()">申請する</button></div>`);
  rtFillLines();
}
function rtFillLines(){
  const oid=document.getElementById('rt_o').value;const o=DB.orders.find(x=>x.id===oid);
  document.getElementById('rt_sku').innerHTML=o.lines.map(l=>{const p=prod(l.sku);return `<option value="${l.sku}">${p.name}（${l.sku}）</option>`;}).join('');
}
function saveReturn(){
  const oid=document.getElementById('rt_o').value,sku=document.getElementById('rt_sku').value,qty=Number(document.getElementById('rt_qty').value)||1,reason=document.getElementById('rt_reason').value;
  DB.returns.unshift({id:'RT-'+(++DB.seq.r),date:today(),orderId:oid,sku,qty,reason,status:'申請中'});
  save();closeModal();toast('返品を申請しました');go('ret');
}

/* ============ 自動発注（過去注文から提案） ============ */
function genAutoReorder(){
  const freq={};
  DB.orders.forEach(o=>o.lines.forEach(l=>{freq[l.sku]=freq[l.sku]||{qty:0,times:0};freq[l.sku].qty+=l.qty;freq[l.sku].times++;}));
  return Object.entries(freq).map(([sku,f])=>({sku,avg:Math.max(1,Math.round(f.qty/Math.max(1,f.times))),times:f.times,p:prod(sku),stock:prod(sku).stock}))
    .sort((a,b)=>b.times-a.times).slice(0,5);
}
function addAllReorder(){
  genAutoReorder().forEach(s=>{const c=DB.cart.find(x=>x.sku===s.sku);if(c)c.qty+=s.avg;else DB.cart.push({sku:s.sku,qty:s.avg});});
  save();updateCartDot();toast('発注提案をまとめてカートに追加しました');go('cart');
}

/* ============ 代理店名の編集 ============ */
function editAgency(){
  openModal(`<h3>${icon('store',{size:18})}代理店名を変更<button class="x" onclick="closeModal()">${icon('close')}</button></h3>
    <div class="mb"><div class="field"><label>代理店名（デモ表示用）</label><input id="ag_n" value="${DB.agency}" placeholder="例: 〇〇電材"></div>
    <p class="legend">商談デモ用に、ログイン中の代理店名を差し替えられます。</p></div>
    <div class="mf"><button class="btn ghost" onclick="closeModal()">キャンセル</button><button class="btn" onclick="saveAgency()">保存</button></div>`);
}
function saveAgency(){const v=document.getElementById('ag_n').value.trim();if(v)DB.agency=v;save();closeModal();go('home');toast('代理店名を変更しました');}

/* ============================================================
   LEDZ Connect — ラインアイコンシステム
   全アイコン 24×24 / stroke / currentColor / round caps
   絵文字を全廃し、統一されたラインアイコンで構成
   ============================================================ */
const ICON_PATHS = {
  /* --- ナビ / 機能 --- */
  home:      '<path d="M3.5 11.5 12 4.2l8.5 7.3"/><path d="M5.5 10v9.3h13V10"/><path d="M10 19.3v-5h4v5"/>',
  order:     '<circle cx="9.5" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/><path d="M2.5 4h2.2l2.2 11.4h10.4l1.8-8.2H6.3"/>',
  truck:     '<path d="M2.5 6.5h11v9.5h-11z"/><path d="M13.5 9.5h3.6l3.4 3.4v3.1h-7z"/><circle cx="6.5" cy="18.2" r="1.6"/><circle cx="17.4" cy="18.2" r="1.6"/>',
  doc:       '<path d="M6 2.8h7.5L18 7.3v13.9H6z"/><path d="M13.5 2.8v4.5H18"/><path d="M9 12.5h6M9 16h4.5"/>',
  chat:      '<path d="M4 5.2h16a1 1 0 0 1 1 1v8.6a1 1 0 0 1-1 1h-9.4L6.4 20v-3.2H4a1 1 0 0 1-1-1V6.2a1 1 0 0 1 1-1z"/><path d="M8 9.6h8M8 12.6h5"/>',
  ai:        '<path d="M12 3.6l1.7 4.4 4.4 1.7-4.4 1.7L12 15.8l-1.7-4.4L5.9 9.7l4.4-1.7z"/><path d="M18.4 15.2l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
  users:     '<circle cx="9" cy="8.5" r="3"/><path d="M3.5 19.5a5.6 5.6 0 0 1 11 0"/><path d="M16 6.2a3 3 0 0 1 .3 5.9"/><path d="M17.3 13.6a5.3 5.3 0 0 1 3.2 5.9"/>',
  voc:       '<path d="M4 9.5v5h3.2l7 4V5.5l-7 4z"/><path d="M17.5 9a4 4 0 0 1 0 6"/>',
  gift:      '<path d="M4.5 11.2h15v8.6h-15z"/><path d="M3.2 7.2h17.6v4H3.2z"/><path d="M12 7.2v12.6"/><path d="M12 7.2C11.2 5 9.5 4 8.2 4.7s-.5 2.9 3.8 2.5zM12 7.2C12.8 5 14.5 4 15.8 4.7s.5 2.9-3.8 2.5z"/>',
  folder:    '<path d="M3 6.2h6l2 2.2h10v11.4H3z"/>',
  trend:     '<path d="M3.5 17l5.5-5.6 3.5 3.5 7-7.2"/><path d="M15.5 7.7h4.5v4.5"/>',
  chart:     '<path d="M3.5 20.2h17"/><path d="M6.5 20V11.5M11.5 20V5.2M16.5 20v-6.2"/>',
  link:      '<path d="M9.2 14.8 14.8 9.2"/><path d="M11.4 7.4l1.3-1.3a3.8 3.8 0 0 1 5.4 5.4l-1.3 1.3"/><path d="M12.6 16.6l-1.3 1.3a3.8 3.8 0 0 1-5.4-5.4l1.3-1.3"/>',
  gear:      '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v2.6M12 18.9v2.6M21.5 12h-2.6M5.1 12H2.5M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8M18.7 18.7l-1.8-1.8M7.1 7.1 5.3 5.3"/>',
  /* --- ユーティリティ --- */
  bell:      '<path d="M6 16.2v-5a6 6 0 0 1 12 0v5l1.6 1.8H4.4z"/><path d="M10 19.6a2 2 0 0 0 4 0"/>',
  search:    '<circle cx="11" cy="11" r="6.2"/><path d="M15.6 15.6 20 20"/>',
  plus:      '<path d="M12 5v14M5 12h14"/>',
  minus:     '<path d="M5 12h14"/>',
  close:     '<path d="M6 6l12 12M18 6 6 18"/>',
  check:     '<path d="M5 12.5l4.5 4.5L19 6.5"/>',
  arrowR:    '<path d="M4.5 12h14.5M13 6l6 6-6 6"/>',
  package:   '<path d="M12 3 20 7.3v9.4L12 21l-8-4.3V7.3z"/><path d="M4 7.5l8 4.4 8-4.4M12 11.9V21"/>',
  receipt:   '<path d="M6 2.8h12v18.4l-3-1.9-3 1.9-3-1.9-3 1.9z"/><path d="M9 8h6M9 11.5h6M9 15h3.5"/>',
  grid:      '<path d="M4 4h6.4v6.4H4zM13.6 4H20v6.4h-6.4zM4 13.6h6.4V20H4zM13.6 13.6H20V20h-6.4z"/>',
  chevDown:  '<path d="M6 9.5l6 6 6-6"/>',
  chevR:     '<path d="M9.5 6l6 6-6 6"/>',
  bulb:      '<path d="M9.2 18.5h5.6M10.2 21.2h3.6"/><path d="M12 2.8a6 6 0 0 0-3.9 10.6c.8.8 1.2 1.4 1.3 2.5h5.2c.1-1.1.5-1.7 1.3-2.5A6 6 0 0 0 12 2.8z"/>',
  zap:       '<path d="M13 2.8 5 14.2h6l-1 7 8-11.4h-6z"/>',
  inbox:     '<path d="M3.2 13l3-8.5h11.6l3 8.5v6.5H3.2z"/><path d="M3.2 13h5l1.2 2.2h5.2L15.8 13h5"/>',
  refresh:   '<path d="M4.2 11.5a8 8 0 0 1 13.4-4.3l2.2 2.1"/><path d="M19.8 12.5a8 8 0 0 1-13.4 4.3l-2.2-2.1"/><path d="M20 4.8v4.5h-4.5M4 19.2v-4.5h4.5"/>',
  clock:     '<circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3 2"/>',
  trash:     '<path d="M4.5 6.5h15M9 6.5V4.5h6v2M6 6.5l1 13.5h10l1-13.5"/><path d="M10 10v6.5M14 10v6.5"/>',
  store:     '<path d="M4 9.5 5.3 4.5h13.4L20 9.5M4 9.5h16M4 9.5a2.4 2.4 0 0 0 4 0 2.4 2.4 0 0 0 4 0 2.4 2.4 0 0 0 4 0 2.4 2.4 0 0 0 4 0"/><path d="M5.5 11v8.5h13V11"/>',
  building:  '<path d="M5 20.5V4.5h9v16M14 20.5V9.5h5v11M3 20.5h18"/><path d="M8 8h2.5M8 11.5h2.5M8 15h2.5"/>',
  bolt:      '<path d="M11 21v-7H7l6-11v7h4z"/>',
  sun:       '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M4.5 12H2M22 12h-2.5M5.6 5.6 7.4 7.4M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8"/>',
  star:      '<path d="M12 3.5l2.5 5.6 6.1.6-4.6 4 1.4 6-5.4-3.2L6.1 19.7l1.4-6-4.6-4 6.1-.6z"/>',
  /* --- 照明カテゴリ用グリフ --- */
  cat_down:  '<path d="M4.5 6h15"/><circle cx="12" cy="9.4" r="2.6"/><path d="M8.6 14.5 7.4 18M12 15.2V19M15.4 14.5 16.6 18"/>',
  cat_spot:  '<rect x="4.2" y="4.6" width="6.6" height="4" rx="2" transform="rotate(34 7.5 6.6)"/><path d="M9.6 9.4 18 17.8M8 12l-2.4 4.8M12.4 13l-.6 5.2"/>',
  cat_base:  '<rect x="3.5" y="9" width="17" height="4.4" rx="1.4"/><path d="M6.5 16.4 6 19M10.5 16.4 10 19M14.5 16.4 14 19M18.5 16.4 18 19"/>',
  cat_out:   '<path d="M12 3.5c3.4 4 5 6.7 5 9.2a5 5 0 0 1-10 0c0-2.5 1.6-5.2 5-9.2z"/><path d="M12 17.5a2.8 2.8 0 0 1-2.6-2"/>',
  cat_brkt:  '<path d="M4 4.5v15"/><path d="M4 8.5h5l3 3"/><circle cx="15" cy="13.5" r="3.4"/><path d="M12.6 16 11.6 19h6.8l-1-3"/>',
  cat_pend:  '<path d="M12 3v5"/><path d="M7 14.5a5 5 0 0 1 10 0z"/><path d="M7 14.5h10"/>',
  cat_indir: '<path d="M4 8h16"/><path d="M4.5 13c2-2.6 4.6-3.2 7.5-3.2S17.5 10.4 19.5 13"/><path d="M7 17c1.5-1.6 3.2-2 5-2s3.5.4 5 2"/>',
  cat_ctrl:  '<path d="M5 7.5h14M5 16.5h14"/><circle cx="9" cy="7.5" r="2.2"/><circle cx="15" cy="16.5" r="2.2"/>',
  cat_lamp:  '<path d="M9.2 18h5.6M10 20.5h4"/><path d="M12 3.2a5.6 5.6 0 0 0-3.6 9.9c.7.7 1.1 1.3 1.2 2.4h4.8c.1-1.1.5-1.7 1.2-2.4A5.6 5.6 0 0 0 12 3.2z"/>',
  cat_fac:   '<path d="M3 20.5V11l5 2.5V11l5 2.5V8.5h6v12M3 20.5h18"/>',
  /* --- 追加：業務フロー系 --- */
  undo:      '<path d="M4 8.5h9.5a5 5 0 0 1 0 10H7"/><path d="M7.5 4.5 3.5 8.5l4 4"/>',
  sitemap:   '<rect x="9" y="3.2" width="6" height="4.4" rx="1"/><rect x="3.2" y="15.4" width="6" height="4.4" rx="1"/><rect x="14.8" y="15.4" width="6" height="4.4" rx="1"/><path d="M12 7.6v4.4M6.2 15.4V12h11.6v3.4"/>',
  flag:      '<path d="M6 21V4.5M6 5h10l-2.2 3.3L16 11.6H6"/>',
  calendar:  '<rect x="3.8" y="5" width="16.4" height="15" rx="2"/><path d="M3.8 9.5h16.4M8 3v4M16 3v4"/>',
  swap:      '<path d="M7 4.5 3.5 8 7 11.5M3.5 8H15M17 12.5 20.5 16 17 19.5M20.5 16H9"/>',
  shield:    '<path d="M12 3.2 19 6v5.5c0 4.3-3 7.5-7 9.3-4-1.8-7-5-7-9.3V6z"/><path d="M9 12l2.2 2.2L15.5 10"/>',
  layers:    '<path d="M12 3.5 21 8l-9 4.5L3 8z"/><path d="M3 12l9 4.5L21 12M3 16l9 4.5L21 16"/>',
  /* --- 追加：配送・残管理・多チャネル --- */
  phone:     '<path d="M6.5 3.5h3l1.4 4-2 1.4a11 11 0 0 0 5.2 5.2l1.4-2 4 1.4v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5z"/>',
  mail:      '<rect x="3.2" y="5.2" width="17.6" height="13.6" rx="2"/><path d="m3.8 6.5 8.2 6 8.2-6"/>',
  pin:       '<path d="M12 21s6.5-5.8 6.5-10.5A6.5 6.5 0 0 0 5.5 10.5C5.5 15.2 12 21 12 21z"/><circle cx="12" cy="10.4" r="2.4"/>',
  alert:     '<path d="M12 3.5 21.5 20H2.5z"/><path d="M12 9.5v5M12 17.4v.1"/>',
  floors:    '<path d="M4 20.5V8l8-4.5L20 8v12.5M4 20.5h16"/><path d="M4 13h16M4 16.7h16"/><path d="M9 20.5v-3.8h6v3.8"/>',
  dot3:      '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  tag:       '<path d="M3.5 11.8V4.5h7.3l9.2 9.2-7.3 7.3z"/><circle cx="7.8" cy="8.4" r="1.4"/>',
};

function icon(name, opts) {
  opts = opts || {};
  const size = opts.size || 20;
  const sw = opts.sw || 1.6;
  const cls = opts.cls ? ' ' + opts.cls : '';
  const inner = ICON_PATHS[name] || ICON_PATHS.grid;
  return `<svg class="ic${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

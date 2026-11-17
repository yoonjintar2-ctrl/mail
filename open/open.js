// 지니메일 실행 아이콘: 앱으로 열렸으면 이 PC의 지니메일 확장에 '열어 줘'만 보내고 창을 닫음. 메일·로그인 정보는 다루지 않음
const STORE_ID = 'bbofndhoknajkmlpidjbfkhigppiknko', PC_ID = 'hfjgdhjepedelhgdmdcpljmdjkknjfkh';
const $ = s => document.querySelector(s), show = id => { for (const s of document.querySelectorAll('main section')) s.hidden = s.id !== id; };
const qid = new URLSearchParams(location.search).get('id');
try { if (/^[a-p]{32}$/.test(qid || '')) localStorage.setItem('jinny-ext', qid); } catch (e) { /* */ }
let pref = null; try { pref = localStorage.getItem('jinny-ext'); } catch (e) { /* */ }
const IDS = [...new Set([pref, PC_ID, STORE_ID].filter(Boolean))];
const isApp = matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: window-controls-overlay)').matches || matchMedia('(display-mode: minimal-ui)').matches;
function ask(id) { return new Promise(res => { try { if (!(window.chrome && chrome.runtime && chrome.runtime.sendMessage)) return res(false); chrome.runtime.sendMessage(id, { type: 'open' }, r => { void chrome.runtime.lastError; res(!!(r && r.ok)); }); } catch (e) { res(false); } }); }
async function openJinny() { for (const id of IDS) { if (await ask(id)) { try { localStorage.setItem('jinny-ext', id); } catch (e) { /* */ } return true; } } return false; }
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js', { scope: './' }).catch(() => {});
if (isApp) {
  show('opening');
  openJinny().then(ok => { if (ok) setTimeout(() => window.close(), 150); else show('noext'); });
} else {
  show('setup'); let prompt = null;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); prompt = e; });
  window.addEventListener('appinstalled', () => show('done'));
  $('#install').addEventListener('click', async () => {
    if (!prompt) { $('#manual').hidden = false; return; }
    prompt.prompt(); const r = await prompt.userChoice; prompt = null; if (r && r.outcome === 'accepted') show('done');
  });
}

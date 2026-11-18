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
  // 크롬은 이 페이지를 처음 볼 때 '한 번 이상 클릭 + 30초 이상 보기'가 채워져야 설치 창(beforeinstallprompt)을 줌 → 첫 방문엔 기다렸다가 띄움
  show('setup'); let prompt = null, waiting = false, timer = 0;
  const t0 = Date.now(), btn = $('#install');
  const manual = () => { clearInterval(timer); waiting = false; $('#wait').hidden = true; btn.hidden = true; $('#manualHead').hidden = false; $('#manual').hidden = false; };
  const ready = () => { clearInterval(timer); waiting = false; $('#wait').hidden = true; btn.disabled = false; btn.textContent = '설치 창 열기'; btn.classList.add('ready'); };
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); prompt = e; if (waiting) ready(); });
  window.addEventListener('appinstalled', () => show('done'));
  btn.addEventListener('click', async () => {
    if (prompt) { const p = prompt; prompt = null; btn.classList.remove('ready'); p.prompt(); const r = await p.userChoice; if (r && r.outcome === 'accepted') show('done'); else { btn.textContent = '아이콘 만들기'; } return; }
    if (waiting) return;
    waiting = true; btn.disabled = true; btn.textContent = '설치 준비 중…'; $('#wait').hidden = false;
    const until = Math.max(t0 + 34000, Date.now() + 6000), limit = until + 12000;
    const tick = () => { const left = Math.ceil((until - Date.now()) / 1000); $('#sec').textContent = left > 0 ? `(약 ${left}초)` : '(거의 다 됐어요)'; if (Date.now() > limit) manual(); };
    tick(); timer = setInterval(tick, 500);
  });
}

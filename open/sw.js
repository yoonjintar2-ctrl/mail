// 지니메일 실행 아이콘용: 아무것도 저장하지 않고 그대로 통과 (설치 조건만 맞춤)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});

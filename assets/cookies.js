/* Aviso de cookies (LGPD) da MDA Concursos.
   O Pixel da Meta e a UTMify só carregam depois que a pessoa toca em "Aceitar".
   A estatística da Vercel continua sempre ligada: ela não usa cookies nem identifica ninguém.
   Quem recusar ainda leva para o checkout as UTMs que já estão no endereço (sem cookie nenhum).
   Uso: <script src="assets/cookies.js" data-pixel="ID_DO_PIXEL" defer></script>  (data-utmify="nao" para não carregar a UTMify)
   Qualquer link ou botão com o atributo data-cookies reabre o aviso.
   O mesmo arquivo vai em todas as páginas: mudou aqui, copie para as outras. */
(function () {
  var eu = document.currentScript;
  var PIXEL = (eu && eu.getAttribute('data-pixel')) || '';
  var USA_UTMIFY = (eu && eu.getAttribute('data-utmify')) || 'sim';   // data-utmify="nao" nas páginas que não usam UTMify
  var CHAVE = 'mda-cookies';               // "sim" ou "nao"
  var PRIVACIDADE = 'https://links.mdaconcursos.com.br/privacidade#cookies';

  function ler() { try { return localStorage.getItem(CHAVE); } catch (e) { return null; } }
  function gravar(v) { try { localStorage.setItem(CHAVE, v); } catch (e) {} }

  function carregarMedicao() {
    if (window.__mdaMedicao) return;
    window.__mdaMedicao = true;
    if (PIXEL) {
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', PIXEL);
      fbq('track', 'PageView');
    }
    if (USA_UTMIFY === 'nao') return;
    var u = document.createElement('script');
    u.src = 'https://cdn.utmify.com.br/scripts/utms/latest.js';
    u.async = true;
    u.setAttribute('data-utmify-prevent-xcod-sck', '');
    u.setAttribute('data-utmify-prevent-subids', '');
    document.head.appendChild(u);
  }

  // Sem aceite: só copia para os links do checkout as utm_ que vieram no endereço da página.
  function repassarUtms() {
    var q = new URLSearchParams(location.search), utm = [];
    q.forEach(function (v, k) { if (/^utm_/i.test(k)) utm.push([k, v]); });
    if (!utm.length) return;
    document.querySelectorAll('a[href*="pay.cakto.com.br"]').forEach(function (a) {
      try {
        var url = new URL(a.href);
        utm.forEach(function (p) { if (!url.searchParams.has(p[0])) url.searchParams.set(p[0], p[1]); });
        a.href = url.toString();
      } catch (e) {}
    });
  }

  // Ao recusar depois de ter aceitado: apaga os cookies da Meta e recarrega sem eles.
  function apagarCookiesMeta() {
    ['_fbp', '_fbc'].forEach(function (n) {
      var d = location.hostname.split('.').slice(-3).join('.');
      document.cookie = n + '=; Max-Age=0; path=/';
      document.cookie = n + '=; Max-Age=0; path=/; domain=.' + d;
      document.cookie = n + '=; Max-Age=0; path=/; domain=.mdaconcursos.com.br';
    });
  }

  var css = '' +
    '.mda-ck{position:fixed;z-index:9999;left:50%;bottom:calc(14px + env(safe-area-inset-bottom,0px));transform:translate(-50%,16px);opacity:0;' +
    'width:min(560px,calc(100% - 24px));box-sizing:border-box;padding:16px 16px 14px;border-radius:16px;' +
    'background:#141416;border:1px solid rgba(255,255,255,.15);box-shadow:0 18px 50px rgba(0,0,0,.55);' +
    'color:#D6D6DA;font:400 14px/1.5 "Saira","Segoe UI",system-ui,sans-serif;transition:opacity .25s ease,transform .25s ease}' +
    '.mda-ck.on{opacity:1;transform:translate(-50%,0)}' +
    '.mda-ck b{color:#fff;font-weight:600}' +
    '.mda-ck p{margin:0 0 12px;max-width:none;font-size:14px;color:#D6D6DA}' +
    '.mda-ck a{color:#F6C111;text-underline-offset:3px}' +
    '.mda-ck .bt{display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
    '.mda-ck button{all:unset;box-sizing:border-box;cursor:pointer;text-align:center;padding:11px 14px;border-radius:999px;font:700 14px/1.2 "Saira","Segoe UI",sans-serif}' +
    '.mda-ck .ok{background:#F6C111;color:#0B0B0C}' +
    '.mda-ck .no{border:1px solid rgba(255,255,255,.28);color:#fff}' +
    '.mda-ck button:focus-visible{outline:2px solid #F6C111;outline-offset:3px}' +
    '@media (prefers-reduced-motion:reduce){.mda-ck{transition:none}}';

  var caixa = null;
  function mostrar() {
    if (!caixa) {
      var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
      caixa = document.createElement('div');
      caixa.className = 'mda-ck';
      caixa.setAttribute('role', 'dialog');
      caixa.setAttribute('aria-label', 'Aviso de cookies');
      caixa.innerHTML = '<p><b>Cookies:</b> com o seu aceite, usamos cookies para saber de onde vêm as visitas e melhorar os nossos anúncios. ' +
        'Você pode mudar de ideia quando quiser pelo link "Cookies" no fim da página. <a href="' + PRIVACIDADE + '" target="_blank" rel="noopener">Saiba mais</a></p>' +
        '<div class="bt"><button type="button" class="no">Recusar</button><button type="button" class="ok">Aceitar</button></div>';
      caixa.querySelector('.ok').addEventListener('click', function () { escolher('sim'); });
      caixa.querySelector('.no').addEventListener('click', function () { escolher('nao'); });
      document.body.appendChild(caixa);
    }
    caixa.hidden = false;
    void caixa.offsetWidth;   // força o navegador a desenhar antes, para a entrada ser animada
    caixa.classList.add('on');
  }
  function esconder() { if (caixa) { caixa.classList.remove('on'); setTimeout(function () { caixa.hidden = true; }, 260); } }

  function escolher(v) {
    var antes = ler();
    gravar(v);
    esconder();
    if (v === 'sim') carregarMedicao();
    else if (antes === 'sim' || window.__mdaMedicao) { apagarCookiesMeta(); location.reload(); }
  }

  function iniciar() {
    document.addEventListener('click', function (e) {
      var alvo = e.target.closest && e.target.closest('[data-cookies]');
      if (alvo) { e.preventDefault(); mostrar(); }
    });
    var v = ler();
    if (v === 'sim') carregarMedicao();
    else { repassarUtms(); if (v !== 'nao') mostrar(); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();

/* THINKO+ 콘텐츠 로더 — content.json을 읽어 페이지 곳곳을 채웁니다.
   편집은 content.json(또는 /admin CMS)에서만 하면 전 페이지에 자동 반영됩니다. */
(function () {
  function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}

  fetch("content.json", { cache: "no-store" })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      // 1) 푸터 주소 블록 (모든 페이지 공통)
      document.querySelectorAll('[data-addr]').forEach(function (el) {
        el.innerHTML =
          '시장·산업 리서치 · 데이터 분석 전문<br>' +
          esc(d.address) + '<br>' +
          esc(d.email) + ' · ' + esc(d.phone);
      });

      // 2) contact 페이지 연락처 항목
      var em = document.querySelector('[data-email]');
      if (em) em.textContent = d.email;
      var ph = document.querySelector('[data-phone]');
      if (ph) ph.textContent = d.phone;
      var ad = document.querySelector('[data-address]');
      if (ad) ad.textContent = d.address;

      // 3) contact 폼: 수신 이메일 (전역 변수로 노출)
      window.THINKO_CONTACT_EMAIL = d.email;

      // 4) 대표 프로필 (about 페이지)
      var cn = document.querySelector('[data-ceo-name]');
      if (cn) cn.textContent = d.ceo_name;
      var cp = document.querySelector('[data-ceo-photo]');
      if (cp) cp.setAttribute('data-initial', (d.ceo_name || '').charAt(0));
      var cr = document.querySelector('[data-ceo-role]');
      if (cr) cr.textContent = d.ceo_role;
      var cc = document.querySelector('[data-ceo-current]');
      if (cc) cc.innerHTML = (d.ceo_current || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
      var cpa = document.querySelector('[data-ceo-past]');
      if (cpa) cpa.innerHTML = (d.ceo_past || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');

      // 6) 세미나·교육 페이지 — 프로그램 개요
      var pi = d.program_intro;
      if (pi) {
        var pt = document.querySelector('[data-prog-title]'); if (pt && pi.title) pt.textContent = pi.title;
        var pl = document.querySelector('[data-prog-lead]'); if (pl && pi.lead) pl.textContent = pi.lead;
        var pl2 = document.querySelector('[data-prog-lead2]'); if (pl2 && pi.lead) pl2.textContent = pi.lead;
        var pd = document.querySelector('[data-prog-desc]'); if (pd && pi.desc) pd.textContent = pi.desc;
        var pc = document.querySelector('[data-prog-contact]'); if (pc && pi.contact) pc.textContent = pi.contact;
        var ov = document.querySelector('[data-prog-overview]');
        if (ov && pi.overview) {
          ov.innerHTML = pi.overview.map(function (r) {
            return '<div class="ov-row"><div class="ov-label">' + esc(r.label) +
                   '</div><div class="ov-value">' + esc(r.value) + '</div></div>';
          }).join('');
        }
      }

      // 7) 세미나·교육 페이지 — 공지 목록
      var nl = document.getElementById('noticeList');
      if (nl) {
        var notices = d.program_notices || [];
        if (!notices.length) {
          nl.innerHTML = '<div class="notice-empty">등록된 공지가 없습니다.</div>';
        } else {
          nl.innerHTML = notices.map(function (n) {
            var cat = n.category ? '<span class="notice-cat">' + esc(n.category) + '</span>' : '';
            var dt = n.date ? '<span class="notice-date">' + esc(n.date) + '</span>' : '';
            var sum = n.summary ? '<p class="notice-sum">' + esc(n.summary) + '</p>' : '';
            var body = n.body ? '<div class="notice-body">' + esc(n.body) + '</div><span class="notice-toggle">접기 ▲</span>' : '';
            return '<div class="notice-card"><div class="notice-meta">' + cat + dt +
                   '</div><h3>' + esc(n.title || '') + '</h3>' + sum + body + '</div>';
          }).join('');
          nl.querySelectorAll('.notice-card').forEach(function (card) {
            if (!card.querySelector('.notice-body')) return;
            card.addEventListener('click', function () { card.classList.toggle('open'); });
          });
        }
      }

      // 5) 팀원 그리드 (about 페이지)
      var g = document.getElementById('teamGrid');
      if (g && d.team) {
        var grads = [["#1b63f0","#0d9488"],["#1b63f0","#5b8cff"],["#0d9488","#22c55e"],
                     ["#6366f1","#1b63f0"],["#0ea5e9","#0d9488"]];
        g.innerHTML = d.team.map(function (m, i) {
          var c = grads[i % grads.length];
          var nm = esc(m.name || ''), rl = esc(m.role || '');
          return '<div class="member"><div class="avatar" style="background:linear-gradient(140deg,' +
                 c[0] + ',' + c[1] + ')">' + nm.charAt(0) + '</div><h3>' + nm +
                 '</h3><div class="role">' + rl + '</div></div>';
        }).join('');
      }
    })
    .catch(function (e) { console.warn('content.json 로드 실패:', e); });
})();

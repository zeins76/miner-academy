(function () {
  'use strict';

  var LEVELS = window.LEVELS;
  var SITE = window.SITE || {};
  var KEY = 'minerAcademy.v1';
  var state = { done: {} };
  try {
    var saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && saved.done) state = saved;
  } catch (e) { /* storage unavailable: progress lasts for this visit only */ }

  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  var app = document.getElementById('app');
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  var cleanup = null;

  var nf0 = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });
  var nf2 = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 });

  function $(sel, root) { return (root || document).querySelector(sel); }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  var CHECK = '<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="rgba(244,183,64,.14)" stroke="#F4B740" stroke-width="1.4"/><path d="M6 10.3l2.6 2.6L14 7.5" stroke="#F4B740" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CHECK_GREEN = '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="#3DD6A0"/><path d="M6 10.3l2.6 2.6L14 7.5" stroke="#05261A" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function doneCount() {
    var n = 0;
    for (var i = 0; i < LEVELS.length; i++) if (state.done[i]) n++;
    return n;
  }
  function nextIndex() {
    for (var i = 0; i < LEVELS.length; i++) if (!state.done[i]) return i;
    return -1;
  }
  function joinAttrs() {
    return SITE.joinUrl
      ? 'href="' + esc(SITE.joinUrl) + '" target="_blank" rel="noopener"'
      : 'href="#/membership"';
  }

  /* ---------- Menu ---------- */

  function setMenu(open) {
    header.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  toggle.addEventListener('click', function () { setMenu(!header.classList.contains('open')); });

  function markNav(key) {
    var links = document.querySelectorAll('[data-nav]');
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute('data-nav') === key) links[i].setAttribute('aria-current', 'page');
      else links[i].removeAttribute('aria-current');
    }
  }

  /* ---------- Router ---------- */

  var SECTIONS = { kurikulum: 1, tools: 1, membership: 1, faq: 1 };

  function scrollToSection(id, smooth) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant', block: 'start' });
  }

  function route() {
    setMenu(false);
    var parts = location.hash.replace(/^#\/?/, '').split('/');
    var key = parts[0] || '';
    var idx = parseInt(parts[1], 10);

    // Moving between sections of the home page: scroll, don't re-render.
    if ((key === '' || SECTIONS[key]) && app.getAttribute('data-page') === 'home') {
      markNav(key);
      if (key) scrollToSection(key, true);
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (cleanup) { cleanup(); cleanup = null; }

    if (key === 'level' && LEVELS[idx]) {
      renderLevel(idx);
      markNav('kurikulum');
      window.scrollTo(0, 0);
    } else if (key === 'kalkulator') {
      renderCalcPage();
      markNav('tools');
      window.scrollTo(0, 0);
    } else {
      renderHome();
      markNav(SECTIONS[key] ? key : '');
      if (SECTIONS[key]) scrollToSection(key, false);
      else window.scrollTo(0, 0);
    }
  }

  // Clicking a link to the hash we are already on should still scroll there.
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href^="#/"]');
    if (!a) return;
    if (a.getAttribute('href') === location.hash) {
      ev.preventDefault();
      route();
    }
  });

  /* ---------- Home ---------- */

  var BENEFITS = [
    ['Kelas dibimbing mentor', 'Pembelajaran kelas langsung, dibimbing mentor yang ahli di bidangnya.'],
    ['Modul dasar-dasar mining', 'Fondasi lengkap dari blockchain, hash, hardware, pool, sampai hitungan biaya.'],
    ['Sesi live meeting', 'Pembahasan materi dan tanya jawab langsung bersama mentor.'],
    ['Praktik langsung', 'Setup dan jalankan mining langsung, didampingi mentor.'],
    ['Lahan cuan di coin baru', 'Cara mengenali peluang di coin mining yang baru muncul.'],
    ['Strategi GPU/CPU', 'Strategi mendapatkan GPU dan CPU yang tepat untuk mining.'],
    ['Script mining', 'Pembuatan script mining tingkat basic, lanjutan, sampai expert.'],
    ['Update news dan metode', 'Info dan metode terbaru, terus diperbarui untuk member.']
  ];

  function renderHome() {
    document.title = 'Miner Academy | High class to get cuan';
    app.setAttribute('data-page', 'home');
    var done = doneCount();
    var next = nextIndex();
    var startHref = '#/level/' + (next === -1 ? 0 : next);
    var startLabel = next === -1 ? 'Ulangi modul gratis' : (done ? 'Lanjut modul ' + (next + 1) : 'Mulai modul gratis');
    var pct = Math.round((done / LEVELS.length) * 100);

    app.innerHTML =
      /* Hero */
      '<section class="hero">' +
        '<div class="container hero-grid">' +
          '<div>' +
            '<span class="chip gold"><span class="dot"></span>Early membership dibuka, diskon 50%</span>' +
            '<h1 tabindex="-1">High class to get cuan.</h1>' +
            '<p class="lead">Miner Academy adalah kelas mining crypto dari dasar sampai expert, dibimbing langsung oleh mentor yang ahli di bidangnya. Mulai gratis lewat 7 modul pengantar, lalu naik kelas di VVIP membership.</p>' +
            '<div class="hero-actions">' +
              '<a class="btn btn-gold" href="#/membership">Join VVIP membership</a>' +
              '<a class="btn btn-outline" href="' + startHref + '">' + startLabel + '</a>' +
            '</div>' +
            '<ul class="hero-facts">' +
              '<li><strong>7 modul</strong><span>pengantar gratis</span></li>' +
              '<li><strong>Live</strong><span>sesi bareng mentor</span></li>' +
              '<li><strong>Lifetime</strong><span>akses member</span></li>' +
            '</ul>' +
          '</div>' +
          '<div class="hero-visual"><div class="card miner" id="hero-miner"></div></div>' +
        '</div>' +
      '</section>' +

      /* Curriculum */
      '<section class="section" id="kurikulum">' +
        '<div class="container">' +
          '<div class="section-head">' +
            '<p class="kicker">Kurikulum</p>' +
            '<h2>Mulai dari dasar, naik bertahap</h2>' +
            '<p>Tujuh modul pengantar bisa langsung dipelajari gratis, tanpa akun. Setiap modul ditutup kuis singkat untuk mengecek pemahaman.</p>' +
          '</div>' +
          '<div class="progress-row">' +
            '<p>Progres kamu: <strong>' + done + ' dari ' + LEVELS.length + ' modul</strong></p>' +
            '<div class="bar" role="img" aria-label="' + pct + ' persen selesai"><i style="width:' + pct + '%"></i></div>' +
          '</div>' +
          '<ol class="modules">' +
            LEVELS.map(function (L, i) {
              return '<li><a class="card module" href="#/level/' + i + '">' +
                '<div class="module-num"><b>Modul ' + (i + 1) + '</b>' +
                  (state.done[i] ? '<span class="chip green">Selesai</span>' : '<span class="chip">Gratis</span>') +
                '</div>' +
                '<h3>' + L.title + '</h3>' +
                '<p>' + L.summary + '</p>' +
                '<div class="module-foot"><span>' + L.sections.length + ' materi, ' + L.quiz.length + ' soal kuis</span>' +
                  (L.demo ? '<span>Ada simulasi</span>' : '') + '</div>' +
              '</a></li>';
            }).join('') +
            '<li><a class="card module vip" href="#/membership">' +
              '<div class="module-num"><b>Kelas VVIP</b><span class="chip gold">Member</span></div>' +
              '<h3>Praktik, live session, dan script mining</h3>' +
              '<p>Lanjutkan bersama mentor: praktik langsung, strategi perangkat, coin baru, dan script mining sampai tingkat expert.</p>' +
              '<div class="module-foot"><span>Lihat benefit membership</span></div>' +
            '</a></li>' +
          '</ol>' +
        '</div>' +
      '</section>' +

      /* Tools */
      '<section class="section" id="tools">' +
        '<div class="container split">' +
          '<div class="section-head">' +
            '<p class="kicker">Tools gratis</p>' +
            '<h2>Hitung dulu sebelum beli alat</h2>' +
            '<p>Kalkulator ini memperkirakan laba harian dari angka yang kamu isi sendiri, termasuk biaya listrik dan fee pool.</p>' +
            '<ul class="ticks">' +
              '<li>' + CHECK + '<span>Laba atau rugi per hari dan per 30 hari</span></li>' +
              '<li>' + CHECK + '<span>Harga koin titik impas</span></li>' +
              '<li>' + CHECK + '<span>Perkiraan lama balik modal alat</span></li>' +
            '</ul>' +
            '<a class="text-link" href="#/level/4">Pelajari cara menghitungnya di Modul 5</a>' +
          '</div>' +
          '<div class="card calc" id="home-calc"></div>' +
        '</div>' +
      '</section>' +

      /* Membership */
      '<section class="section" id="membership">' +
        '<div class="container">' +
          '<div class="section-head">' +
            '<p class="kicker">VVIP membership</p>' +
            '<h2>Gabung bersama Miner Academy sekarang</h2>' +
            '<p>Dapatkan benefit pembelajaran lengkap, dengan mentor langsung oleh ahli di bidangnya.</p>' +
          '</div>' +
          '<div class="member-grid">' +
            '<div>' +
              '<ul class="benefits">' +
                BENEFITS.map(function (b) {
                  return '<li class="card benefit"><span class="ic">' + CHECK + '</span><div><h3>' + b[0] + '</h3><p>' + b[1] + '</p></div></li>';
                }).join('') +
              '</ul>' +
              '<div class="lifetime">' + CHECK_GREEN + '<span>Semua benefit berlaku lifetime.</span></div>' +
            '</div>' +
            priceCard() +
          '</div>' +
        '</div>' +
      '</section>' +

      /* How to join */
      '<section class="section">' +
        '<div class="container">' +
          '<div class="section-head center">' +
            '<p class="kicker">Cara bergabung</p>' +
            '<h2>Tiga langkah untuk mulai kelas</h2>' +
          '</div>' +
          '<ol class="steps">' +
            '<li class="card step"><h3>Klik Join now</h3><p>Tombol akan membuka WhatsApp dengan pesan pendaftaran yang sudah terisi.</p></li>' +
            '<li class="card step"><h3>Ngobrol dengan admin</h3><p>Tanyakan jadwal kelas, materi, dan cara pembayaran.</p></li>' +
            '<li class="card step"><h3>Mulai belajar</h3><p>Ikuti kelas, sesi live, dan praktik langsung bersama mentor.</p></li>' +
          '</ol>' +
        '</div>' +
      '</section>' +

      /* FAQ */
      '<section class="section" id="faq">' +
        '<div class="container">' +
          '<div class="section-head center">' +
            '<p class="kicker">FAQ</p>' +
            '<h2>Pertanyaan yang sering ditanyakan</h2>' +
          '</div>' +
          '<div class="faq">' +
            faq('Saya pemula, apakah bisa ikut?', 'Bisa. Membership mencakup modul dasar-dasar mining, dan 7 modul gratis di situs ini bisa jadi titik awal sebelum bergabung.') +
            faq('Apakah modul gratis butuh akun?', 'Tidak. Modul, kuis, tambang mini, dan kalkulator bisa langsung dipakai. Progres kamu tersimpan di browser yang sedang dipakai.') +
            faq('Bagaimana cara mendaftar VVIP membership?', 'Klik tombol Join now. Kamu akan terhubung ke WhatsApp admin Miner Academy untuk informasi jadwal dan pembayaran.') +
            faq('Berapa lama benefit membership berlaku?', 'Semua benefit membership berlaku lifetime.') +
            faq('Apakah ada jaminan profit dari mining?', 'Tidak ada. Hasil mining bergantung pada harga koin, tingkat kesulitan jaringan, tarif listrik, dan perangkat yang dipakai. Kelas ini membantu kamu menghitung dan mengambil keputusan dengan lebih matang.') +
          '</div>' +
        '</div>' +
      '</section>' +

      /* CTA */
      '<section class="cta-band">' +
        '<div class="container">' +
          '<div class="cta-box">' +
            '<h2>Mari ternak mesin bersama Miner Academy</h2>' +
            '<p>Early membership diskon 50%, slot terbatas. Don\'t be late.</p>' +
            '<div class="hero-actions"><a class="btn btn-gold" ' + joinAttrs() + '>Join now</a><a class="btn btn-outline" href="' + startHref + '">' + startLabel + '</a></div>' +
          '</div>' +
        '</div>' +
      '</section>';

    var stopMiner = mountMiner($('#hero-miner'), true);
    mountCalc($('#home-calc'));

    // Highlight the menu item of the section in view.
    var spy = null;
    if ('IntersectionObserver' in window) {
      spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) markNav(en.target.id);
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      Object.keys(SECTIONS).forEach(function (id) {
        var el = document.getElementById(id);
        if (el) spy.observe(el);
      });
      spy.observe($('.hero', app));
    }
    cleanup = function () { stopMiner(); if (spy) spy.disconnect(); };
  }

  function faq(q, a) {
    return '<details><summary>' + q + '</summary><p>' + a + '</p></details>';
  }

  function priceCard() {
    return '<aside class="price" aria-label="Harga membership">' +
      '<span class="chip gold">Diskon 50% early membership</span>' +
      '<h3>VVIP membership</h3>' +
      '<p class="was">Harga normal <s>Rp 100.000.000</s></p>' +
      '<p class="now">Rp 50.000.000</p>' +
      '<p class="per">Harga early membership, semua benefit lifetime.</p>' +
      '<a class="btn btn-gold btn-block" ' + joinAttrs() + '>Join now</a>' +
      '<ul>' +
        '<li>' + CHECK + '<span>Kelas, sesi live, dan praktik bersama mentor</span></li>' +
        '<li>' + CHECK + '<span>Script mining basic, lanjutan, dan expert</span></li>' +
        '<li>' + CHECK + '<span>Update news dan metode terbaru</span></li>' +
      '</ul>' +
      '<p class="urgent">Limited slot. Don\'t be late.</p>' +
    '</aside>';
  }

  /* ---------- Mini miner ---------- */

  function fmtRate(r) {
    if (r >= 1e6) return nf2.format(r / 1e6) + ' MH/s';
    if (r >= 1e3) return nf0.format(r / 1e3) + ' kH/s';
    return nf0.format(r) + ' H/s';
  }

  function mountMiner(slot, inHero) {
    var tag = inHero ? 'h2' : 'h3';
    slot.innerHTML =
      '<div class="miner-top"><' + tag + '>Coba menambang di browser</' + tag + '><span class="chip green"><span class="dot"></span>Live</span></div>' +
      '<p class="note">Browser kamu mencoba nonce satu per satu sampai hash blok diawali nol sebanyak tingkat kesulitan. Persis cara kerja Proof of Work.</p>' +
      '<div class="miner-controls">' +
        '<div class="field"><label for="m-data">Data blok</label>' +
        '<input id="m-data" type="text" maxlength="100" value="Blok 1: Ani kirim 0,5 koin ke Budi" autocomplete="off"></div>' +
        '<div class="field"><label for="m-diff">Kesulitan</label>' +
        '<select id="m-diff">' +
          [1, 2, 3, 4, 5, 6].map(function (d) {
            return '<option value="' + d + '"' + (d === 5 ? ' selected' : '') + '>' + d + ' nol' + (d === 6 ? ' (lama)' : '') + '</option>';
          }).join('') +
        '</select></div>' +
      '</div>' +
      '<button class="btn btn-gold" type="button" id="m-go">Mulai menambang</button>' +
      '<dl class="stats">' +
        '<div><dt>Nonce</dt><dd id="m-nonce">0</dd></div>' +
        '<div><dt>Kecepatan</dt><dd id="m-rate">-</dd></div>' +
        '<div><dt>Waktu</dt><dd id="m-time">0 d</dd></div>' +
      '</dl>' +
      '<p class="hash" id="m-hash" aria-hidden="true">Hash akan muncul di sini.</p>' +
      '<p class="m-status" id="m-status" role="status"></p>';

    var dataEl = $('#m-data', slot), diffEl = $('#m-diff', slot), go = $('#m-go', slot);
    var nonceEl = $('#m-nonce', slot), rateEl = $('#m-rate', slot), timeEl = $('#m-time', slot);
    var hashEl = $('#m-hash', slot), statusEl = $('#m-status', slot);
    var running = false, timer = null;

    function stop() {
      running = false;
      clearTimeout(timer);
      go.textContent = 'Mulai menambang';
    }

    function show(m, cur, ms, found) {
      var lz = m.leadingZeros();
      var hex = m.hex();
      var secs = Math.max(ms / 1000, 0.001);
      nonceEl.textContent = nf0.format(cur);
      rateEl.textContent = fmtRate((cur + 1) / secs);
      timeEl.textContent = nf2.format(secs) + ' d';
      hashEl.innerHTML = '<span class="z">' + hex.slice(0, lz) + '</span>' + hex.slice(lz);
      slot.classList.toggle('found', !!found);
    }

    function start() {
      var data = dataEl.value.trim() || 'Blok 1';
      var diff = parseInt(diffEl.value, 10);
      var m = SHA.createMiner(data + '|');
      var nonce = 0, cur = 0, lastUI = 0;
      var t0 = performance.now();
      running = true;
      slot.classList.remove('found');
      go.textContent = 'Berhenti';
      statusEl.textContent = 'Menambang...';

      function tick() {
        if (!running) return;
        var end = performance.now() + 14;
        var found = false;
        do {
          for (var i = 0; i < 500; i++) {
            cur = nonce++;
            m.hash(cur);
            if (m.leadingZeros() >= diff) { found = true; break; }
          }
        } while (!found && performance.now() < end);
        var now = performance.now();
        if (found || now - lastUI > 60) { show(m, cur, now - t0, found); lastUI = now; }
        if (found) {
          stop();
          statusEl.textContent = 'Blok ketemu di nonce ' + nf0.format(cur) + ' setelah ' + nf0.format(cur + 1) + ' percobaan.';
        } else {
          timer = setTimeout(tick, 0);
        }
      }
      tick();
    }

    go.addEventListener('click', function () {
      if (running) { stop(); statusEl.textContent = 'Dihentikan.'; } else { start(); }
    });
    dataEl.addEventListener('input', function () {
      if (running) { stop(); statusEl.textContent = 'Data berubah, mulai lagi untuk mencari nonce baru.'; }
    });
    diffEl.addEventListener('change', function () {
      if (running) { stop(); statusEl.textContent = 'Kesulitan berubah, mulai lagi.'; }
    });

    return stop;
  }

  /* ---------- Calculator ---------- */

  function mountCalc(slot) {
    slot.innerHTML =
      '<h3>Kalkulator untung rugi</h3>' +
      '<p class="note">Ambil angka koin per hari dari statistik pool atau kalkulator publik untuk alat dan koin yang kamu pakai.</p>' +
      '<form class="calc-form" onsubmit="return false">' +
        field('c-coins', 'Koin per hari', '0.0005') +
        field('c-price', 'Harga per koin (Rp)', '1500000000') +
        field('c-watt', 'Daya alat (watt)', '600') +
        field('c-tariff', 'Tarif listrik (Rp/kWh)', '1445') +
        field('c-fee', 'Fee pool (%)', '1') +
        field('c-extra', 'Biaya lain per hari (Rp)', '0') +
        field('c-hw', 'Harga alat (Rp)', '0') +
      '</form>' +
      '<div class="results" id="c-out" role="status"></div>';

    function field(id, label, val) {
      return '<div class="field"><label for="' + id + '">' + label + '</label>' +
        '<input id="' + id + '" type="number" inputmode="decimal" min="0" step="any" value="' + val + '"></div>';
    }
    function num(id) { var v = parseFloat($('#' + id, slot).value); return isFinite(v) && v >= 0 ? v : 0; }
    function rp(x) { return 'Rp ' + nf0.format(Math.round(x)); }

    function calc() {
      var coins = num('c-coins'), price = num('c-price'), watt = num('c-watt');
      var tariff = num('c-tariff'), fee = Math.min(num('c-fee'), 100), extra = num('c-extra'), hw = num('c-hw');
      var netCoins = coins * (1 - fee / 100);
      var revenue = netCoins * price;
      var kwh = (watt / 1000) * 24;
      var power = kwh * tariff;
      var cost = power + extra;
      var profit = revenue - cost;
      var breakeven = netCoins > 0 ? cost / netCoins : 0;
      var payback = '-';
      if (hw > 0) payback = profit > 0 ? nf0.format(Math.ceil(hw / profit)) + ' hari' : 'Tidak balik modal';
      $('#c-out', slot).innerHTML =
        '<div class="big' + (profit < 0 ? ' neg' : '') + '"><span>' + (profit < 0 ? 'Rugi per hari' : 'Laba per hari') + '</span><strong>' + rp(Math.abs(profit)) + '</strong></div>' +
        '<dl>' +
          '<div><dt>Pendapatan per hari</dt><dd>' + rp(revenue) + '</dd></div>' +
          '<div><dt>Biaya listrik per hari</dt><dd>' + rp(power) + ' (' + nf2.format(kwh) + ' kWh)</dd></div>' +
          '<div><dt>' + (profit < 0 ? 'Rugi' : 'Laba') + ' per 30 hari</dt><dd>' + rp(Math.abs(profit) * 30) + '</dd></div>' +
          '<div><dt>Harga koin titik impas</dt><dd>' + (netCoins > 0 ? rp(breakeven) : '-') + '</dd></div>' +
          '<div><dt>Balik modal alat</dt><dd>' + payback + '</dd></div>' +
          '<div><dt>Fee pool per hari</dt><dd>' + rp(coins * price * fee / 100) + '</dd></div>' +
        '</dl>';
    }

    slot.addEventListener('input', calc);
    calc();
  }

  function renderCalcPage() {
    document.title = 'Kalkulator mining | Miner Academy';
    app.setAttribute('data-page', 'calc');
    app.innerHTML =
      '<section class="page-head"><div class="container">' +
        '<nav class="crumb" aria-label="Breadcrumb"><a href="#/">Beranda</a><span>/</span><a href="#/tools">Tools</a><span>/</span><span>Kalkulator</span></nav>' +
        '<h1 tabindex="-1">Kalkulator untung rugi mining</h1>' +
        '<p class="lead">Hitung laba harian, titik impas, dan lama balik modal dari angka kamu sendiri. Semua perhitungan berjalan di browser.</p>' +
      '</div></section>' +
      '<div class="container calc-page">' +
        '<div class="card calc" id="calc-slot"></div>' +
        '<aside>' +
          '<div class="card side-note"><h2>Angka berubah setiap hari</h2><p>Hashrate jaringan, tingkat kesulitan, dan harga koin terus bergerak. Ulangi perhitungan secara berkala, dan coba juga skenario harga koin turun 50%.</p></div>' +
          '<div class="card side-note" style="margin-top:12px"><h2>Mau dibimbing langsung?</h2><p>Strategi perangkat dan hitungan cuan dibahas bersama mentor di kelas VVIP.</p><p><a class="btn btn-gold btn-sm" href="#/membership" style="margin-top:0.4rem">Lihat membership</a></p></div>' +
        '</aside>' +
      '</div>';
    mountCalc($('#calc-slot'));
  }

  /* ---------- Lesson ---------- */

  function tocHTML(active) {
    return '<p class="toc-title">Modul gratis</p><ol>' +
      LEVELS.map(function (L, i) {
        var done = state.done[i];
        return '<li><a href="#/level/' + i + '"' + (done ? ' class="done"' : '') + (i === active ? ' aria-current="page"' : '') + '>' +
          '<span class="n">' + (done ? '&#10003;' : (i + 1)) + '</span><span>' + L.title + (done ? '<span class="sr"> (selesai)</span>' : '') + '</span></a></li>';
      }).join('') + '</ol>' +
      '<div class="card toc-cta"><p>Lanjutkan dengan praktik dan live session bersama mentor.</p><a class="btn btn-gold btn-sm btn-block" href="#/membership">Join VVIP</a></div>';
  }

  function renderLevel(i) {
    var L = LEVELS[i];
    document.title = L.title + ' | Miner Academy';
    app.setAttribute('data-page', 'level');
    var prev = i > 0
      ? '<a class="card prev" href="#/level/' + (i - 1) + '"><span>Sebelumnya</span>' + LEVELS[i - 1].title + '</a>'
      : '';
    var next = i < LEVELS.length - 1
      ? '<a class="card next" href="#/level/' + (i + 1) + '"><span>Berikutnya</span>' + LEVELS[i + 1].title + '</a>'
      : '<a class="card next" href="#/membership"><span>Berikutnya</span>Kelas VVIP bersama mentor</a>';

    app.innerHTML =
      '<section class="page-head"><div class="container">' +
        '<nav class="crumb" aria-label="Breadcrumb"><a href="#/">Beranda</a><span>/</span><a href="#/kurikulum">Kurikulum</a><span>/</span><span>Modul ' + (i + 1) + '</span></nav>' +
        '<h1 tabindex="-1">' + L.title + '</h1>' +
        '<p class="lead">' + L.summary + '</p>' +
        '<div class="page-meta">' +
          '<span class="chip">Modul ' + (i + 1) + ' dari ' + LEVELS.length + '</span>' +
          '<span class="chip">' + L.quiz.length + ' soal kuis</span>' +
          (state.done[i] ? '<span class="chip green" id="done-chip">Selesai</span>' : '<span class="chip" id="done-chip" hidden></span>') +
        '</div>' +
      '</div></section>' +
      '<div class="container lesson-grid">' +
        '<aside class="toc" id="toc" aria-label="Daftar modul">' + tocHTML(i) + '</aside>' +
        '<article class="prose">' +
          L.sections.map(function (s) {
            return '<section><h2>' + s.h + '</h2>' + s.p.map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</section>';
          }).join('') +
          (L.demo === 'miner' ? '<div class="card miner" id="demo-slot"></div>' : '') +
          (L.demo === 'calc' ? '<div class="card calc" id="demo-slot"></div>' : '') +
          '<section class="card quiz" aria-labelledby="quiz-title">' +
            '<div class="quiz-head"><h2 id="quiz-title">Kuis modul ' + (i + 1) + '</h2><span class="chip">Jawab semua untuk menyelesaikan modul</span></div>' +
            '<form id="quiz" novalidate>' +
              L.quiz.map(function (q, qi) {
                return '<fieldset><legend>' + (qi + 1) + '. ' + q.q + '</legend>' +
                  q.options.map(function (o, oi) {
                    return '<label class="opt"><input type="radio" name="q' + qi + '" value="' + oi + '"><span>' + o + '</span></label>';
                  }).join('') +
                  '<p class="fb" id="fb' + qi + '"></p></fieldset>';
              }).join('') +
              '<button class="btn btn-gold" type="submit">Periksa jawaban</button>' +
            '</form>' +
            '<div class="quiz-result" id="quiz-result" role="status"></div>' +
          '</section>' +
          '<nav class="pager" aria-label="Modul lain">' + prev + next + '</nav>' +
        '</article>' +
      '</div>';

    if (L.demo === 'miner') cleanup = mountMiner($('#demo-slot'), false);
    if (L.demo === 'calc') mountCalc($('#demo-slot'));

    $('#quiz').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var result = $('#quiz-result');
      var correct = 0, unanswered = 0;
      L.quiz.forEach(function (q, qi) {
        var picked = $('input[name="q' + qi + '"]:checked');
        var fb = $('#fb' + qi);
        if (!picked) { unanswered++; fb.textContent = ''; fb.className = 'fb'; return; }
        if (parseInt(picked.value, 10) === q.answer) {
          correct++;
          fb.className = 'fb ok';
          fb.textContent = 'Benar. ' + q.why;
        } else {
          fb.className = 'fb bad';
          fb.textContent = 'Belum tepat, coba pilihan lain.';
        }
      });
      if (unanswered) {
        result.className = 'quiz-result';
        result.textContent = 'Masih ada ' + unanswered + ' pertanyaan yang belum dijawab.';
        return;
      }
      if (correct === L.quiz.length) {
        state.done[i] = true;
        persist();
        $('#toc').innerHTML = tocHTML(i);
        var chip = $('#done-chip');
        chip.hidden = false; chip.className = 'chip green'; chip.textContent = 'Selesai';
        result.className = 'quiz-result ok';
        result.innerHTML = 'Modul selesai, semua jawaban benar. ' +
          (i < LEVELS.length - 1 ? '<a href="#/level/' + (i + 1) + '">Lanjut ke modul ' + (i + 2) + '</a>' : '<a href="#/membership">Lanjut ke kelas VVIP</a>');
      } else {
        result.className = 'quiz-result';
        result.textContent = correct + ' dari ' + L.quiz.length + ' benar. Perbaiki jawaban yang belum tepat, lalu periksa lagi.';
      }
    });
  }

  window.addEventListener('hashchange', route);
  route();
})();

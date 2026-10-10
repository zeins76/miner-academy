(function () {
  'use strict';

  var LEVELS = window.LEVELS;
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
  var gauge = document.getElementById('gauge');
  var cleanup = null;

  var nf0 = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });
  var nf2 = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 });

  function $(sel, root) { return (root || document).querySelector(sel); }

  /* ---------- Gauge (depth rail) ---------- */

  function renderGauge(active) {
    gauge.innerHTML =
      '<p class="gauge-title">Kedalaman</p><ol>' +
      LEVELS.map(function (L, i) {
        var done = state.done[i];
        return '<li><a href="#/level/' + i + '"' + (done ? ' class="done"' : '') +
          (i === active ? ' aria-current="page"' : '') + '>' +
          '<span class="m">' + L.depth + '</span>' +
          '<span class="t">' + L.title + '</span>' +
          (done ? '<span class="sr"> (selesai)</span>' : '') +
          '</a></li>';
      }).join('') + '</ol>';
    var cur = gauge.querySelector('[aria-current]');
    if (cur && cur.scrollIntoView && window.matchMedia('(max-width: 820px)').matches) {
      cur.scrollIntoView({ block: 'nearest', inline: 'center' });
    }
  }

  /* ---------- Router ---------- */

  function route() {
    if (cleanup) { cleanup(); cleanup = null; }
    var parts = location.hash.replace(/^#\/?/, '').split('/');
    var active = -1;
    var idx = parseInt(parts[1], 10);
    if (parts[0] === 'level' && LEVELS[idx]) {
      active = idx;
      renderLevel(idx);
    } else if (parts[0] === 'kalkulator') {
      renderCalcPage();
    } else if (parts[0] === 'membership') {
      renderMembership();
    } else {
      renderHome();
    }
    renderGauge(active);
    window.scrollTo(0, 0);
    var h = app.querySelector('h1');
    if (h) { h.setAttribute('tabindex', '-1'); }
  }

  /* ---------- Home ---------- */

  function renderHome() {
    document.title = 'MINER ACADEMY';
    var nextIdx = -1;
    for (var i = 0; i < LEVELS.length; i++) { if (!state.done[i]) { nextIdx = i; break; } }
    var started = Object.keys(state.done).length > 0;
    var cta = nextIdx === -1
      ? '<a class="btn" href="#/kalkulator">Buka kalkulator</a>'
      : '<a class="btn" href="#/level/' + nextIdx + '">' + (started ? 'Lanjut ke level ' + (nextIdx + 1) : 'Mulai dari permukaan') + '</a>';

    app.innerHTML =
      '<section class="hero">' +
        '<div class="hero-copy">' +
          '<h1>High class to get cuan</h1>' +
          '<p class="lede">Kelas mining dari dasar sampai strategi, dibimbing langsung oleh mentor. Mulai gratis: tujuh level pendek, tambang mini yang berjalan di browser Anda, dan kalkulator untung rugi.</p>' +
          '<p class="cta-row"><a class="btn" href="#/membership">Join VVIP membership</a> ' + cta.replace('class="btn"', 'class="btn ghost"') + '</p>' +
        '</div>' +
        '<div class="panel dark" id="miner-slot"></div>' +
      '</section>' +
      '<section class="curriculum">' +
        '<h2>Kurikulum</h2>' +
        '<ol class="levels">' +
        LEVELS.map(function (L, i) {
          return '<li><a href="#/level/' + i + '">' +
            '<span class="depth">' + L.depth + '</span>' +
            '<span class="body"><strong>' + L.title + '</strong><span>' + L.summary + '</span></span>' +
            '<span class="status' + (state.done[i] ? ' ok' : '') + '">' + (state.done[i] ? 'Selesai' : '') + '</span>' +
            '</a></li>';
        }).join('') +
        '</ol>' +
      '</section>' +
      '<section class="teaser">' +
        '<h2>VVIP membership</h2>' +
        '<p>Kelas langsung bersama mentor, sesi live, dan praktik langsung. Early membership diskon 50%, slot terbatas.</p>' +
        '<p><a class="btn" href="#/membership">Lihat benefit</a></p>' +
      '</section>';
    cleanup = mountMiner($('#miner-slot'));
  }

  /* ---------- Membership ---------- */

  function renderMembership() {
    document.title = 'VVIP Membership · MINER ACADEMY';
    var joinUrl = (window.SITE && window.SITE.joinUrl) || '';
    var joinAttrs = joinUrl
      ? 'href="' + joinUrl.replace(/"/g, '&quot;') + '" target="_blank" rel="noopener"'
      : 'href="#/membership"';
    var perks = [
      'Pembelajaran kelas langsung dibimbing oleh mentor',
      'Module dasar-dasar mining',
      'Sesi live meeting',
      'Praktik langsung bersama mentor',
      'Mengenali lahan cuan di coin mining baru',
      'Strategi mendapatkan GPU/CPU untuk mining',
      'Pembuatan script mining tingkat basic, lanjutan, dan expert',
      'Update news dan metode'
    ];
    app.innerHTML =
      '<article class="member">' +
        '<p class="crumb"><a href="#/">Kurikulum</a> / Membership</p>' +
        '<h1>Gabung bersama MINER ACADEMY sekarang</h1>' +
        '<p class="lede">Dapatkan benefit pembelajaran lengkap, dengan mentor langsung oleh ahli di bidangnya.</p>' +
        '<p><a class="btn" ' + joinAttrs + '>Join now VVIP membership</a></p>' +
        '<section class="perks">' +
          '<h2>What you get as membership</h2>' +
          '<ul>' + perks.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ul>' +
          '<p class="lifetime"><strong>Semua benefit lifetime.</strong></p>' +
        '</section>' +
        '<section class="price panel" id="harga">' +
          '<h2 class="panel-title">Limited offer, diskon 50% untuk early membership</h2>' +
          '<p class="was">Harga normal <s>Rp 100.000.000</s></p>' +
          '<p class="now"><span>Early membership</span><strong>Rp 50.000.000</strong></p>' +
          '<p class="panel-note">Limited slot. Don\'t be late.</p>' +
          '<p><a class="btn" ' + joinAttrs + '>Join now</a></p>' +
        '</section>' +
        '<p class="closing">Mari ternak mesin bersama MINER ACADEMY</p>' +
        '<p class="small">Hasil mining tidak dijamin. Pendapatan bergantung pada harga koin, tingkat kesulitan jaringan, tarif listrik, dan alat yang dipakai. Materi ini bukan saran investasi.</p>' +
      '</article>';
  }

  /* ---------- Mini miner ---------- */

  function fmtRate(r) {
    if (r >= 1e6) return nf2.format(r / 1e6) + ' MH/s';
    if (r >= 1e3) return nf0.format(r / 1e3) + ' kH/s';
    return nf0.format(r) + ' H/s';
  }

  function mountMiner(slot) {
    slot.innerHTML =
      '<h2 class="panel-title">Tambang mini</h2>' +
      '<p class="panel-note">Browser Anda mencoba nonce satu per satu sampai hash blok diawali nol sebanyak yang dipilih.</p>' +
      '<label for="m-data">Data blok</label>' +
      '<input id="m-data" type="text" maxlength="100" value="Blok 1: Ani kirim 0,5 koin ke Budi" autocomplete="off">' +
      '<label for="m-diff">Kesulitan</label>' +
      '<select id="m-diff">' +
        [1, 2, 3, 4, 5, 6].map(function (d) {
          return '<option value="' + d + '"' + (d === 5 ? ' selected' : '') + '>' + d + ' nol di depan' + (d === 6 ? ' (bisa lama)' : '') + '</option>';
        }).join('') +
      '</select>' +
      '<p><button class="btn" type="button" id="m-go">Mulai menambang</button></p>' +
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
          statusEl.textContent = 'Blok ketemu pada nonce ' + nf0.format(cur) + ' setelah ' + nf0.format(cur + 1) + ' percobaan.';
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
      '<h2 class="panel-title">Kalkulator untung rugi</h2>' +
      '<p class="panel-note">Isi dengan angka Anda sendiri. Koin per hari bisa diambil dari statistik pool atau kalkulator publik untuk alat dan koin yang Anda pakai.</p>' +
      '<form class="calc" onsubmit="return false">' +
        field('c-coins', 'Koin per hari', '0.0005', 'any') +
        field('c-price', 'Harga per koin (Rp)', '1500000000', 'any') +
        field('c-watt', 'Daya alat (watt)', '600', 'any') +
        field('c-tariff', 'Tarif listrik (Rp per kWh)', '1445', 'any') +
        field('c-fee', 'Fee pool (%)', '1', 'any') +
        field('c-extra', 'Biaya lain per hari (Rp)', '0', 'any') +
        field('c-hw', 'Harga alat (Rp)', '0', 'any') +
      '</form>' +
      '<div class="results" id="c-out" role="status"></div>';

    function field(id, label, val, step) {
      return '<div class="f"><label for="' + id + '">' + label + '</label>' +
        '<input id="' + id + '" type="number" inputmode="decimal" min="0" step="' + step + '" value="' + val + '"></div>';
    }
    function num(id) { var v = parseFloat($('#' + id, slot).value); return isFinite(v) && v >= 0 ? v : 0; }
    function rp(x) { return 'Rp ' + nf0.format(Math.round(x)); }

    function calc() {
      var coins = num('c-coins'), price = num('c-price'), watt = num('c-watt');
      var tariff = num('c-tariff'), fee = Math.min(num('c-fee'), 100), extra = num('c-extra'), hw = num('c-hw');
      var netCoins = coins * (1 - fee / 100);
      var revenue = netCoins * price;
      var power = (watt / 1000) * 24 * tariff;
      var cost = power + extra;
      var profit = revenue - cost;
      var breakeven = netCoins > 0 ? cost / netCoins : 0;
      var payback = '-';
      if (hw > 0) payback = profit > 0 ? nf0.format(Math.ceil(hw / profit)) + ' hari' : 'tidak balik modal';
      var kwh = (watt / 1000) * 24;
      $('#c-out', slot).innerHTML =
        '<div class="big ' + (profit < 0 ? 'neg' : '') + '"><span>' + (profit < 0 ? 'Rugi per hari' : 'Laba per hari') + '</span><strong>' + rp(Math.abs(profit)) + '</strong></div>' +
        '<table>' +
          '<tr><th scope="row">Pendapatan per hari (setelah fee)</th><td>' + rp(revenue) + '</td></tr>' +
          '<tr><th scope="row">Pemakaian listrik per hari</th><td>' + nf2.format(kwh) + ' kWh</td></tr>' +
          '<tr><th scope="row">Biaya listrik per hari</th><td>' + rp(power) + '</td></tr>' +
          '<tr><th scope="row">Laba per 30 hari</th><td>' + (profit < 0 ? '-' : '') + rp(Math.abs(profit) * 30) + '</td></tr>' +
          '<tr><th scope="row">Harga koin titik impas</th><td>' + (netCoins > 0 ? rp(breakeven) : '-') + '</td></tr>' +
          '<tr><th scope="row">Balik modal alat</th><td>' + payback + '</td></tr>' +
        '</table>';
    }

    slot.addEventListener('input', calc);
    calc();
  }

  function renderCalcPage() {
    document.title = 'Kalkulator · MINER ACADEMY';
    app.innerHTML =
      '<article class="lesson">' +
        '<p class="crumb"><a href="#/">Kurikulum</a></p>' +
        '<h1>Kalkulator untung rugi</h1>' +
        '<p class="lede">Hitung laba harian, titik impas, dan lama balik modal dari angka yang Anda isi sendiri. Semua perhitungan terjadi di browser ini.</p>' +
        '<div class="panel dark" id="calc-slot"></div>' +
        '<p class="small">Hasilnya hanya sebaik angka masukannya. Hashrate jaringan, kesulitan, dan harga koin berubah setiap hari, jadi ulangi perhitungan secara berkala.</p>' +
      '</article>';
    mountCalc($('#calc-slot'));
  }

  /* ---------- Lesson ---------- */

  function renderLevel(i) {
    var L = LEVELS[i];
    document.title = L.title + ' · MINER ACADEMY';
    var prev = i > 0 ? '<a href="#/level/' + (i - 1) + '">Level ' + i + ': ' + LEVELS[i - 1].title + '</a>' : '<span></span>';
    var next = i < LEVELS.length - 1
      ? '<a href="#/level/' + (i + 1) + '">Level ' + (i + 2) + ': ' + LEVELS[i + 1].title + '</a>'
      : '<a href="#/kalkulator">Buka kalkulator</a>';

    app.innerHTML =
      '<article class="lesson">' +
        '<p class="crumb"><a href="#/">Kurikulum</a> / Level ' + (i + 1) + ' dari ' + LEVELS.length + ', kedalaman ' + L.depth + '</p>' +
        '<h1>' + L.title + '</h1>' +
        '<p class="lede">' + L.summary + '</p>' +
        L.sections.map(function (s) {
          return '<section><h2>' + s.h + '</h2>' + s.p.map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</section>';
        }).join('') +
        (L.demo ? '<div class="panel dark" id="demo-slot"></div>' : '') +
        '<section class="quiz"><h2>Kuis</h2>' +
          '<form id="quiz" novalidate>' +
            L.quiz.map(function (q, qi) {
              return '<fieldset><legend>' + (qi + 1) + '. ' + q.q + '</legend>' +
                q.options.map(function (o, oi) {
                  return '<label class="opt"><input type="radio" name="q' + qi + '" value="' + oi + '"><span>' + o + '</span></label>';
                }).join('') +
                '<p class="fb" id="fb' + qi + '"></p></fieldset>';
            }).join('') +
            '<p><button class="btn" type="submit">Periksa jawaban</button></p>' +
          '</form>' +
          '<div id="quiz-result" role="status"></div>' +
        '</section>' +
        '<nav class="pager" aria-label="Level lain">' + prev + next + '</nav>' +
      '</article>';

    if (L.demo === 'miner') cleanup = mountMiner($('#demo-slot'));
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
          fb.textContent = 'Belum tepat. Coba lagi.';
        }
      });
      if (unanswered) {
        result.className = '';
        result.textContent = 'Jawab semua pertanyaan dulu. Masih ada ' + unanswered + ' yang kosong.';
        return;
      }
      if (correct === L.quiz.length) {
        state.done[i] = true;
        persist();
        renderGauge(i);
        result.className = 'quiz-ok';
        result.innerHTML = 'Level selesai, ' + correct + ' dari ' + L.quiz.length + ' benar. ' +
          (i < LEVELS.length - 1 ? '<a href="#/level/' + (i + 1) + '">Turun ke level berikutnya</a>' : '<a href="#/kalkulator">Buka kalkulator</a>');
      } else {
        result.className = '';
        result.textContent = correct + ' dari ' + L.quiz.length + ' benar. Ubah jawaban yang belum tepat, lalu periksa lagi.';
      }
    });
  }

  window.addEventListener('hashchange', route);
  route();
})();

(function (root) {
  'use strict';

  var K = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ]);
  var INIT = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  var W = new Uint32Array(64);
  var H = new Uint32Array(8);

  function compress(buf, off) {
    var t, x, y, s0, s1;
    for (t = 0; t < 16; t++) {
      var j = off + t * 4;
      W[t] = (buf[j] << 24) | (buf[j + 1] << 16) | (buf[j + 2] << 8) | buf[j + 3];
    }
    for (t = 16; t < 64; t++) {
      x = W[t - 15];
      y = W[t - 2];
      s0 = ((x >>> 7) | (x << 25)) ^ ((x >>> 18) | (x << 14)) ^ (x >>> 3);
      s1 = ((y >>> 17) | (y << 15)) ^ ((y >>> 19) | (y << 13)) ^ (y >>> 10);
      W[t] = (W[t - 16] + s0 + W[t - 7] + s1) | 0;
    }
    var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
    for (t = 0; t < 64; t++) {
      var S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
      var ch = (e & f) ^ (~e & g);
      var t1 = (h + S1 + ch + K[t] + W[t]) | 0;
      var S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
      var maj = (a & b) ^ (a & c) ^ (b & c);
      var t2 = (S0 + maj) | 0;
      h = g; g = f; f = e; e = (d + t1) | 0;
      d = c; c = b; b = a; a = (t1 + t2) | 0;
    }
    H[0] += a; H[1] += b; H[2] += c; H[3] += d;
    H[4] += e; H[5] += f; H[6] += g; H[7] += h;
  }

  // Hash buf[0..L) and leave the result in H.
  function digest(buf, L) {
    var P = ((L + 9 + 63) >> 6) << 6;
    var i;
    buf[L] = 0x80;
    for (i = L + 1; i < P - 4; i++) buf[i] = 0;
    var bits = L * 8;
    buf[P - 4] = (bits >>> 24) & 255;
    buf[P - 3] = (bits >>> 16) & 255;
    buf[P - 2] = (bits >>> 8) & 255;
    buf[P - 1] = bits & 255;
    for (i = 0; i < 8; i++) H[i] = INIT[i];
    for (i = 0; i < P; i += 64) compress(buf, i);
  }

  // A miner hashes prefix + decimal nonce, reusing one buffer.
  function createMiner(prefix) {
    var pre = new TextEncoder().encode(prefix);
    var plen = pre.length;
    var buf = new Uint8Array(plen + 16 + 80);
    buf.set(pre);
    return {
      hash: function (nonce) {
        var digits = 1, t = nonce;
        while (t >= 10) { t = Math.floor(t / 10); digits++; }
        var i = plen + digits - 1;
        t = nonce;
        do {
          buf[i--] = 48 + (t % 10);
          t = Math.floor(t / 10);
        } while (i >= plen);
        digest(buf, plen + digits);
      },
      leadingZeros: function () {
        if (H[0] === 0) return 8 + (H[1] === 0 ? 8 : Math.clz32(H[1]) >> 2);
        return Math.clz32(H[0]) >> 2;
      },
      hex: function () {
        var s = '';
        for (var i = 0; i < 8; i++) s += ('00000000' + H[i].toString(16)).slice(-8);
        return s;
      }
    };
  }

  root.SHA = { createMiner: createMiner };
})(typeof window !== 'undefined' ? window : module.exports);

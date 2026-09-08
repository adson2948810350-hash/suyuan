/**
 * hashchain.js —— 哈希链存证（防篡改）模块
 *
 * 原理：每一个生产环节生成一条存证记录，其哈希值以上一环节哈希为输入：
 *   record[i].hash = SHA256( record[i-1].hash + record[i].contentHash )
 *
 * 任何一条记录的数据被改动，该环节及之后所有环节的哈希都会失效，
 * 从而直观体现「信息不可篡改」。
 *
 * 纯 JavaScript 实现 SHA-256（FIPS 180-4），零依赖、同步执行，
 * 在 file:// / http / https 环境下均可运行。
 */
(function (global) {
  'use strict';

  // SHA-256 常量 K[0..63]
  var K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  function rotr(x, n) { return (x >>> n) | (x << (32 - n)); }

  /** 对 Uint8Array 计算 SHA-256，返回 64 位十六进制小写字符串 */
  function sha256Bytes(msgBytes) {
    var H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    var l = msgBytes.length;
    var bitLenHi = Math.floor(l * 8 / 0x100000000);
    var bitLenLo = (l * 8) >>> 0;

    // 填充：追加 0x80，补零，末尾 64bit 大端存储位长度
    var total = ((l + 8 + 63) >> 6) << 6; // 64 的倍数
    var data = new Uint8Array(total);
    data.set(msgBytes);
    data[l] = 0x80;
    var dv = new DataView(data.buffer);
    dv.setUint32(total - 8, bitLenHi, false);
    dv.setUint32(total - 4, bitLenLo, false);

    var w = new Uint32Array(64);
    for (var i = 0; i < total; i += 64) {
      var t;
      for (t = 0; t < 16; t++) w[t] = dv.getUint32(i + t * 4, false);
      for (t = 16; t < 64; t++) {
        var w15 = w[t - 15], w2 = w[t - 2];
        var s0 = rotr(w15, 7) ^ rotr(w15, 18) ^ (w15 >>> 3);
        var s1 = rotr(w2, 17) ^ rotr(w2, 19) ^ (w2 >>> 10);
        w[t] = (w[t - 16] + s0 + w[t - 7] + s1) >>> 0;
      }
      var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (t = 0; t < 64; t++) {
        var S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
        var ch = (e & f) ^ (~e & g);
        var temp1 = (h + S1 + ch + K[t] + w[t]) >>> 0;
        var S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var temp2 = (S0 + maj) >>> 0;
        h = g; g = f; f = e; e = (d + temp1) >>> 0;
        d = c; c = b; b = a; a = (temp1 + temp2) >>> 0;
      }
      H[0] = (H[0] + a) >>> 0; H[1] = (H[1] + b) >>> 0; H[2] = (H[2] + c) >>> 0; H[3] = (H[3] + d) >>> 0;
      H[4] = (H[4] + e) >>> 0; H[5] = (H[5] + f) >>> 0; H[6] = (H[6] + g) >>> 0; H[7] = (H[7] + h) >>> 0;
    }
    var out = '';
    for (var k = 0; k < 8; k++) out += H[k].toString(16).padStart ? H[k].toString(16).padStart(8, '0') : ('00000000' + H[k].toString(16)).slice(-8);
    return out;
  }

  /** 对 UTF-8 字符串计算 SHA-256 */
  function sha256(str) {
    return sha256Bytes(new TextEncoder().encode(String(str)));
  }

  /** 生成环节内容指纹（参与哈希的规范化数据） */
  function contentOf(record) {
    return JSON.stringify({
      no: record.no,
      name: record.name,
      time: record.time,
      place: record.place,
      craftsman: record.craftsman,
      temp: record.temp,
      desc: record.desc
    });
  }

  /** 依据当前数据构建哈希链（模拟「生产环节信息同步上链存档」） */
  function buildChain(records) {
    var prev = '0'.repeat(64); // 创世哈希
    return records.map(function (r) {
      var content = contentOf(r);
      var hash = sha256(prev + content);
      var rec = {
        no: r.no, name: r.name, time: r.time, place: r.place,
        craftsman: r.craftsman, temp: r.temp, desc: r.desc, imgs: r.imgs,
        content: content, prevHash: prev, hash: hash
      };
      prev = hash;
      return rec;
    });
  }

  /** 校验哈希链，返回每条记录是否通过（篡改任一环节，其及后续环节一并失效） */
  function verifyChain(chain) {
    var prev = '0'.repeat(64);
    return chain.map(function (r) {
      var expected = sha256(prev + r.content);
      var valid = expected === r.hash;
      prev = expected; // 使用重算值继续，使后续环节一并失效，直观呈现「牵一发动全身」
      return { no: r.no, name: r.name, valid: valid, expected: expected, actual: r.hash };
    });
  }

  global.HashChain = { sha256: sha256, buildChain: buildChain, verifyChain: verifyChain, contentOf: contentOf };
})(window);

/**
 * app.js —— 页面渲染与交互
 */
(function () {
  'use strict';

  var DATA = window.TRACE_DATA;
  var currentSteps = JSON.parse(JSON.stringify(DATA.steps)); // 工作副本（用于防篡改演示）
  var chain = null;
  var verdicts = [];

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------- 大图/原件查看（灯箱） ---------- */
  function initLightbox() {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = '<span class="close">×</span><img alt=""><div class="cap"></div>';
    document.body.appendChild(lb);
    var img = lb.querySelector('img');
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.className === 'close') lb.classList.remove('show');
    });
    window.showLightbox = function (src, cap) {
      img.src = src; lb.querySelector('.cap').textContent = cap || ''; lb.classList.add('show');
    };
  }

  /* ---------- 产品档案 ---------- */
  function renderProduct() {
    var p = DATA.product;
    var rows = [
      ['品牌', p.brand + ' · ' + p.name],
      ['生产商', p.mill],
      ['产品类别', p.category],
      ['批次号', p.batchNo],
      ['规格', p.spec],
      ['生产日期', p.produceDate],
      ['保质期', p.expiry],
      ['贮存条件', p.storage],
      ['首次查询', p.firstQuery],
      ['产地', p.region]
    ];
    document.getElementById('productInfo').innerHTML = rows.map(function (r) {
      return '<div class="prod-row"><span class="k">' + esc(r[0]) + '</span><span class="v">' + esc(r[1]) + '</span></div>';
    }).join('');
    document.getElementById('uniqueCode').textContent = p.uniqueCode;
  }

  /* ---------- 原料产地 ---------- */
  function renderOrigin() {
    var o = DATA.origin;
    document.getElementById('originPlace').textContent = o.rawMaterial + ' · ' + o.place;
    document.getElementById('originIntro').textContent = o.intro + '（' + o.harvest + '）';
  }

  /* ---------- 质检报告 ---------- */
  function renderQuality() {
    var q = DATA.quality;
    document.getElementById('qualityMeta').innerHTML =
      '<b>报告编号</b>：' + esc(q.reportNo) + '、' + esc(q.reportNo2) + '（共 2 份） · <b>检测机构</b>：' + esc(q.agency) + '<br>' +
      '<b>检测日期</b>：' + esc(q.date) + ' · <b>依据标准</b>：' + esc(q.standard);

    var rows = q.items.map(function (it) {
      return '<tr><td class="name">' + esc(it.name) + '</td><td>' + esc(it.standard) + '</td>' +
             '<td>' + esc(it.result) + '</td><td class="pass">' + esc(it.verdict) + '</td></tr>';
    }).join('');
    document.getElementById('qualityTable').innerHTML =
      '<table class="inspect"><thead><tr><th>检测项目</th><th>标准要求</th><th>实测结果</th><th>判定</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table>' +
      '<div class="report-label">报告原件（扫描件，点击查看大图）</div>' +
      '<div class="report-gallery">' +
        q.imgs.map(function (src) {
          return '<img src="' + esc(src) + '" data-cap="质检报告原件" alt="质检报告" loading="lazy" decoding="async">';
        }).join('') +
      '</div>';
  }

  /* ---------- 匠人工序 ---------- */
  function renderCraftsmen() {
    document.getElementById('craftsmen').innerHTML = DATA.craftsmen.map(function (c) {
      return '<div class="craftsman">' +
        '<div class="avatar">' + esc(c.name.slice(0, 1)) + '</div>' +
        '<div class="info">' +
          '<div class="nm">' + esc(c.name) + '</div>' +
          '<div class="tt">' + esc(c.title) + ' · ' + esc(c.years) + ' · 负责' + esc(c.steps) + '</div>' +
          '<div class="intro">' + esc(c.intro) + '</div>' +
        '</div></div>';
    }).join('');
  }

  /* ---------- 存证状态条 ---------- */
  function renderLedger(allValid) {
    var dot = document.getElementById('ledgerDot');
    var title = document.getElementById('ledgerTitle');
    var sub = document.getElementById('ledgerSub');
    var flag = document.getElementById('ledgerFlag');
    if (allValid) {
      dot.className = 'ledger-dot';
      title.textContent = '区块链存证 · 链校验通过';
      sub.textContent = chain.length + ' 个环节全部哈希加密存档 · 存证链完整';
      flag.className = 'ledger-ok';
      flag.textContent = '已存证';
    } else {
      var firstBad = verdicts.find(function (v) { return !v.valid; });
      dot.className = 'ledger-dot warn';
      title.textContent = '检测到数据被篡改！';
      sub.textContent = '第 ' + firstBad.no + ' 环节「' + firstBad.name + '」及后续存证已失效';
      flag.className = 'ledger-bad';
      flag.textContent = '存证异常';
    }
  }

  /* ---------- 溯源时间轴 ---------- */
  function renderTimeline() {
    document.getElementById('timeline').innerHTML = chain.map(function (r, i) {
      var v = verdicts[i];
      var nodeCls = v.valid ? 'ok' : 'bad';
      var bodyCls = v.valid ? '' : 'bad';
      var flagCls = v.valid ? 'ok' : 'bad';
      var flagTxt = v.valid ? '✓ 存证有效' : '✗ 已篡改';
      var gallery = r.imgs ? r.imgs.map(function (src) {
        return '<img src="' + esc(src) + '" data-cap="' + esc(r.name) + '" alt="' + esc(r.name) + '" loading="lazy" decoding="async">';
      }).join('') : '';
      return '<div class="tl-item" data-no="' + r.no + '">' +
        '<div class="tl-node ' + nodeCls + '">' + r.no + '</div>' +
        '<div class="tl-body ' + bodyCls + '">' +
          '<div class="tl-head" data-idx="' + i + '">' +
            '<span class="tl-no">工序 ' + r.no + '</span>' +
            '<span class="tl-name">' + esc(r.name) + '</span>' +
            '<span class="tl-hash-flag ' + flagCls + '">' + flagTxt + '</span>' +
          '</div>' +
          '<div class="tl-meta"><span>' + esc(r.time) + '</span><span>' + esc(r.place) + '</span><span>' + esc(r.craftsman) + '</span></div>' +
          '<div class="tl-gallery">' + gallery + '</div>' +
          '<div class="tl-desc">' + esc(r.desc) + '</div>' +
          '<div class="tl-temp"><b>' + esc(r.temp) + '</b></div>' +
          '<div class="tl-hash" data-idx="' + i + '" style="display:none">' +
            '<b>存证哈希</b>：<span class="h-full">' + esc(r.hash) + '</span><br>' +
            '<b>前序哈希</b>：<span class="h-prev">' + esc(r.prevHash) + '</span>' +
          '</div>' +
        '</div></div>';
    }).join('');

    // 点击环节头部切换存证哈希详情
    document.querySelectorAll('.tl-head').forEach(function (el) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', function () {
        var idx = el.getAttribute('data-idx');
        var hashBox = document.querySelector('.tl-hash[data-idx="' + idx + '"]');
        if (hashBox) hashBox.style.display = hashBox.style.display === 'none' ? 'block' : 'none';
      });
    });

    // 图集与质检报告原件 -> 灯箱查看大图
    document.querySelectorAll('.tl-gallery img, .report-gallery img').forEach(function (img) {
      img.addEventListener('click', function () {
        window.showLightbox(img.src, img.getAttribute('data-cap'));
      });
    });
  }

  /* ---------- 重建链并渲染 ---------- */
  function renderChain() {
    var allValid = verdicts.every(function (v) { return v.valid; });
    renderLedger(allValid);
    renderTimeline();
  }

  function rebuild() {
    chain = HashChain.buildChain(currentSteps);
    verdicts = HashChain.verifyChain(chain);
    renderChain();
  }

  /* ---------- 防篡改演示 ---------- */
  function doTamper() {
    // 直接篡改「已上链」的第 2 道工序存证内容，但其哈希保持原值（模拟未经重新上链的非法修改）
    var rec = chain.find(function (r) { return r.no === 2; });
    rec.temp = '柴火铁锅 · 高温急炒（异常）';
    rec.content = HashChain.contentOf(rec);
    verdicts = HashChain.verifyChain(chain);
    renderChain();
    document.getElementById('btnTamper').style.display = 'none';
    document.getElementById('btnReset').style.display = 'block';
    var hint = document.getElementById('demoHint');
    hint.textContent = '已篡改第 2 道工序的工艺参数，整条存证链已断裂，验证失败！';
    hint.className = 'demohint alert';
    // 高亮并滚动到被篡改环节，状态条闪烁
    var item = document.querySelector('.tl-item[data-no="2"]');
    if (item) {
      item.classList.add('flash-bad');
      setTimeout(function () { item.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 80);
    }
    var strip = document.getElementById('ledgerStrip');
    strip.classList.add('flash-bad');
    setTimeout(function () { strip.classList.remove('flash-bad'); }, 2400);
  }

  function doReset() {
    currentSteps = JSON.parse(JSON.stringify(DATA.steps));
    rebuild();
    document.getElementById('btnTamper').style.display = 'block';
    document.getElementById('btnReset').style.display = 'none';
    var hint = document.getElementById('demoHint');
    hint.textContent = '当前存证链完整，未检测到数据篡改。';
    hint.className = 'demohint';
  }

  /* ---------- 查询记录（持续被查询 / 销售动态） ---------- */
  var QUERY_PLACES = [
    '西安市 · 长安区', '西安市 · 雁塔区', '西安市 · 高新区', '西安市 · 未央区',
    '咸阳市 · 秦都区', '宝鸡市 · 渭滨区', '渭南市 · 临渭区', '汉中市 · 汉台区',
    '北京市 · 朝阳区', '上海市 · 浦东新区', '成都市 · 锦江区', '兰州市 · 城关区',
    '郑州市 · 金水区', '广州市 · 天河区', '深圳市 · 南山区', '重庆市 · 渝中区'
  ];
  var queryTotal = DATA.queries.total;
  var queryItems = DATA.queries.recent.slice(); // 工作副本

  function renderQueryList() {
    var list = document.getElementById('queryList');
    list.innerHTML = queryItems.slice(0, 8).map(function (it, idx) {
      return '<div class="q-item' + (idx === 0 ? ' new' : '') + '">' +
        '<div class="q-row"><span class="q-time">' + esc(it.time) + '</span>' +
        '<span class="q-place">' + esc(it.place) + '</span></div>' +
        '<div class="q-act">' + esc(it.act) + ' · <b class="q-pass">正品 · 存证有效</b></div>' +
      '</div>';
    }).join('');
  }

  function renderQueries() {
    document.getElementById('queryTotal').textContent = queryTotal.toLocaleString('zh-CN');
    document.getElementById('querySince').textContent = '首次查询 ' + DATA.queries.since + ' · 持续扫码溯源中';
    renderQueryList();
  }

  function pushQuery() {
    queryTotal += 1;
    queryItems.unshift({
      time: '刚刚',
      place: QUERY_PLACES[Math.floor(Math.random() * QUERY_PLACES.length)],
      act: '微信扫码验证'
    });
    if (queryItems.length > 12) queryItems.pop();
    document.getElementById('queryTotal').textContent = queryTotal.toLocaleString('zh-CN');
    renderQueryList();
  }

  /* ---------- 启动 ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initLightbox();
    renderProduct();
    renderOrigin();
    renderQuality();
    renderCraftsmen();
    rebuild();
    renderQueries();
    setInterval(pushQuery, 5000);
    document.getElementById('btnTamper').addEventListener('click', doTamper);
    document.getElementById('btnReset').addEventListener('click', doReset);
  });
})();

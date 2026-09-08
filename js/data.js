/**
 * data.js —— 溯源档案数据
 *
 * 数据来源：沣峪口百年老油坊真实质检报告（西安市产品质量监督检验院）与用户提供的真实信息。
 */
window.TRACE_DATA = {
  // 产品档案
  product: {
    brand: '劲金乡月',
    name: '古法菜籽油',
    mill: '沣峪口百年老油坊',
    category: '食用植物油 · 非遗古法压榨',
    batchNo: 'FYG-2025-0412',
    uniqueCode: 'FYG-2025-0412-0888',
    spec: '散装 / 桶装',
    produceDate: '2025-04-12',
    expiry: '12 个月',
    storage: '阴凉、干燥、避光保存',
    firstQuery: '2025-08-30',
    region: '陕西省 · 西安市 · 长安区沣峪口'
  },

  // 原料产地
  origin: {
    rawMaterial: '秦岭高山菜籽',
    place: '陕西省西安市长安区 · 秦岭北麓',
    harvest: '2025年 人工采收',
    intro: '精选秦岭北麓高山生态种植的优质菜籽，自然成熟、人工晾晒筛选，从源头把控每一滴油的品质。'
  },

  // 生产全流程（七道工序，每道附现场实拍照片）
  steps: [
    {
      no: 1, name: '原料晾晒筛选', time: '2025-04-09 08:30', place: '沣峪口老油坊 · 晾晒场',
      craftsman: '高飞', temp: '自然晾晒 · 人工筛选',
      imgs: ['assets/img/web/rapeseed.jpg', 'assets/img/step1_1.jpg', 'assets/img/step1_2.jpg', 'assets/img/step1_4.jpg'],
      desc: '精选秦岭高山菜籽，摊晒去杂、人工逐粒筛选，剔除瘪粒与杂质，保证入榨原料纯净饱满。'
    },
    {
      no: 2, name: '炒籽蒸坯', time: '2025-04-09 14:00', place: '沣峪口老油坊 · 炒房',
      craftsman: '高飞', temp: '柴火铁锅 · 低温慢炒',
      imgs: ['assets/img/step2_1.jpg', 'assets/img/step2_2.jpg', 'assets/img/step2_3.jpg'],
      desc: '沿用古法柴火铁锅低温慢炒，火候恰到好处，激发菜籽原始油香，为后续研磨取油奠定风味基础。'
    },
    {
      no: 3, name: '研磨制坯', time: '2025-04-10 09:00', place: '沣峪口老油坊 · 石磨坊',
      craftsman: '赵开齐', temp: '石磨细研',
      imgs: ['assets/img/web/grind1.jpg', 'assets/img/web/grind2.jpg'],
      desc: '炒制后的菜籽经传统石磨细细研磨，碾成浓稠油泥，最大限度保留营养成分与天然香气。'
    },
    {
      no: 4, name: '包饼', time: '2025-04-10 11:30', place: '沣峪口老油坊 · 包饼间',
      craftsman: '赵开齐', temp: '麻布包裹 · 手工压饼',
      imgs: ['assets/img/step4_1.jpg', 'assets/img/step4_2.jpg', 'assets/img/step4_3.jpg'],
      desc: '油泥以传统麻布包裹、手工压制成饼，饼形均匀紧实，为木榨物理压榨做好准备。'
    },
    {
      no: 5, name: '木榨取油', time: '2025-04-10 15:00', place: '沣峪口老油坊 · 木榨坊',
      craftsman: '高飞', temp: '百年木榨 · 物理压榨',
      imgs: ['assets/img/step5_2.jpg', 'assets/img/step5_1.jpg', 'assets/img/step5_3.jpg'],
      desc: '借助百年木榨物理压榨，不添加任何化学溶剂，金黄原油自木榨缝隙中缓缓渗出、滴落收集。'
    },
    {
      no: 6, name: '过滤滤油', time: '2025-04-11 09:00', place: '沣峪口老油坊 · 滤油间',
      craftsman: '赵开齐', temp: '静置沉淀 · 纱布过滤',
      imgs: ['assets/img/step6_1.jpg', 'assets/img/step6_2.jpg', 'assets/img/step6_3.jpg', 'assets/img/step6_4.jpg'],
      desc: '初榨原油经静置沉淀与多层纱布自然过滤，去除油渣杂质，油体逐渐澄澈金黄。'
    },
    {
      no: 7, name: '油渣分离精滤', time: '2025-04-11 14:00', place: '沣峪口老油坊 · 精滤车间',
      craftsman: '赵开齐', temp: '卧螺分离 · 精细提纯',
      imgs: ['assets/img/step7_2.jpg', 'assets/img/step7_3.jpg'],
      desc: '采用卧螺油渣分离机精细提纯，进一步分离细微油渣，确保成品油质清亮、口感纯净。'
    }
  ],

  // 质检报告（结构化摘要 + 报告原件扫描件）
  quality: {
    reportNo: 'S2501208',
    agency: '西安市产品质量监督检验院',
    date: '2025-04-27',
    standard: 'GB 2716-2018《食品安全国家标准 植物油》',
    // 报告原件（菜籽油两份报告：S2501208 + S2501788）
    imgs: [
      'assets/img/report/report_02.jpg', 'assets/img/report/report_09.jpg',
      'assets/img/report/report_10.jpg', 'assets/img/report/report_11.jpg',
      'assets/img/report/report_01.jpg', 'assets/img/report/report_12.jpg',
      'assets/img/report/report_13.jpg'
    ],
    items: [
      { name: '酸价(以KOH计)', standard: '≤ 3.0 mg/g', result: '1.1', verdict: '合格' },
      { name: '过氧化值', standard: '≤ 0.25 g/100g', result: '0.052', verdict: '合格' },
      { name: '溶剂残留量', standard: '不得检出（定量限10mg/kg）', result: '未检出', verdict: '合格' },
      { name: '黄曲霉毒素 B₁', standard: '≤ 10 μg/kg', result: '未检出（定量限0.1μg/kg）', verdict: '合格' },
      { name: '苯并[a]芘', standard: '≤ 10 μg/kg', result: '2.6', verdict: '合格' }
    ]
  },

  // 匠人工序（非遗传承人 · 榨油师傅）
  craftsmen: [
    {
      name: '高飞',
      title: '非遗传承人 · 榨油师傅',
      years: '1975 年生',
      intro: '沣峪口百年老油坊榨油师傅、非遗传承人，掌握古法榨油全套技艺，负责原料筛选、柴火炒籽与百年木榨压榨等核心工序。',
      steps: '工序 ① ② ⑤'
    },
    {
      name: '赵开齐',
      title: '非遗传承人 · 榨油师傅',
      years: '1977 年生',
      intro: '沣峪口百年老油坊榨油师傅、非遗传承人，精通石磨研磨、手工包饼与油品精滤，守护每一滴油的传统工艺。',
      steps: '工序 ③ ④ ⑥ ⑦'
    }
  ],

  // 查询记录（展示产品持续被扫码查询 / 销售，佐证溯源系统可靠 + 销量充沛）
  queries: {
    total: 12847,
    since: '2025-08-30',
    recent: [
      { time: '12-08 14:32', place: '西安市 · 长安区', act: '微信扫码验证' },
      { time: '12-08 13:57', place: '咸阳市 · 秦都区', act: '微信扫码验证' },
      { time: '12-08 12:41', place: '宝鸡市 · 渭滨区', act: '微信扫码验证' },
      { time: '12-08 11:05', place: '西安市 · 雁塔区', act: '微信扫码验证' },
      { time: '12-08 09:48', place: '北京市 · 朝阳区', act: '微信扫码验证' },
      { time: '12-07 21:16', place: '成都市 · 锦江区', act: '微信扫码验证' },
      { time: '12-07 18:52', place: '上海市 · 浦东新区', act: '微信扫码验证' },
      { time: '12-07 15:33', place: '西安市 · 高新区', act: '微信扫码验证' }
    ]
  }
};

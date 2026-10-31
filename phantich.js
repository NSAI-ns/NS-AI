/**
 * NS AI - Thuật toán phân tích định hướng nghề nghiệp
 * Kết hợp: Điểm số môn học, Sở thích (100+ danh mục), Xu hướng tính cách, Mục tiêu học sinh
 * Cung cấp: Độ phù hợp (%), Lý do, Tổ hợp môn xét tuyển nên theo (A00, A01, D01, B00...) và lời khuyên.
 */

function analyzeCareer() {
  const info = read('info') || {};
  const scores = read('scores') || {};
  const hobbies = read('hobbies') || { selected: [], custom: '' };
  const answers = read('personalityAnswers') || [];
  const goals = read('goals') || { selected: [], other: '' };

  const vals = Object.values(scores);
  const avg = vals.length
    ? vals.reduce((a, b) => a + Number(b), 0) / vals.length
    : 6;

  const allHobbyText = ((hobbies.selected || []).join(' ') + ' ' + (hobbies.custom || '')).toLowerCase();
  const has = (...keywords) => keywords.some(k => allHobbyText.includes(k.toLowerCase()));

  const result = [
    {
      name: 'Công nghệ thông tin',
      base: 55,
      fit:
        (scores['Tin học'] || 0) * 3 +
        (scores['Toán'] || 0) * 2 +
        (has('công nghệ', 'lập trình', 'phần mềm', 'website', 'máy tính', 'an ninh mạng', 'app') ? 14 : 0) +
        (has('game', 'esports') ? 5 : 0),
      combinations: [
        'A00 (Toán, Lý, Hóa)',
        'A01 (Toán, Lý, Anh)',
        'D01 (Toán, Văn, Anh)',
        'D07 (Toán, Hóa, Anh)'
      ],
      bestCombo: 'A00 hoặc A01',
      advice: 'Nên ưu tiên khối A00 hoặc A01 nếu có thế mạnh tự nhiên; hoặc D01 nếu tự tin môn Tiếng Anh.'
    },
    {
      name: 'Khoa học máy tính / Trí tuệ nhân tạo',
      base: 50,
      fit:
        (scores['Tin học'] || 0) * 2.5 +
        (scores['Toán'] || 0) * 2.5 +
        (has('ai', 'trí tuệ nhân tạo', 'dữ liệu', 'khoa học', 'toán', 'robot') ? 15 : 0) +
        (has('lập trình', 'công nghệ') ? 8 : 0),
      combinations: [
        'A00 (Toán, Lý, Hóa)',
        'A01 (Toán, Lý, Anh)',
        'D01 (Toán, Văn, Anh)'
      ],
      bestCombo: 'A00 hoặc A01',
      advice: 'Môn Toán tư duy logic và Tin học là chìa khóa. Các trường lớn (Bách Khoa, ĐHQG) tuyển sinh chủ yếu khối A00 và A01.'
    },
    {
      name: 'Kinh tế / Quản trị kinh doanh',
      base: 50,
      fit:
        (scores['Toán'] || 0) * 1.5 +
        (scores['Tiếng Anh'] || 0) * 1.5 +
        (has('kinh doanh', 'khởi nghiệp', 'tài chính', 'chứng khoán', 'marketing', 'bán hàng', 'thương mại', 'logistics') ? 16 : 0) +
        (has('giao tiếp', 'lãnh đạo', 'đàm phán') ? 7 : 0),
      combinations: [
        'A01 (Toán, Lý, Anh)',
        'D01 (Toán, Văn, Anh)',
        'A00 (Toán, Lý, Hóa)',
        'D07 (Toán, Hóa, Anh)'
      ],
      bestCombo: 'D01 hoặc A01',
      advice: 'Khối D01 và A01 có chỉ tiêu lớn nhất tại các trường như Ngoại thương, Kinh tế Quốc dân, UEH.'
    },
    {
      name: 'Y khoa / Dược học',
      base: 45,
      fit:
        (scores['Sinh học'] || 0) * 2.5 +
        (scores['Hóa học'] || 0) * 2.2 +
        (has('y học', 'dược', 'sức khỏe', 'thảo dược', 'bệnh') ? 16 : 0) +
        (has('khoa học', 'thí nghiệm', 'sinh học', 'hóa học') ? 9 : 0),
      combinations: [
        'B00 (Toán, Hóa, Sinh)',
        'A00 (Toán, Lý, Hóa)',
        'D07 (Toán, Hóa, Anh)'
      ],
      bestCombo: 'B00',
      advice: 'Khối B00 là con đường chính cho Y đa khoa; ngành Dược mở rộng thêm xét tuyển khối A00 và D07.'
    },
    {
      name: 'Kỹ thuật',
      base: 50,
      fit:
        (scores['Toán'] || 0) * 2 +
        (scores['Vật lý'] || 0) * 2 +
        (has('kỹ thuật', 'cơ khí', 'ô tô', 'máy bay', 'chế tạo', 'mạch điện', 'in 3d', 'kiến trúc') ? 16 : 0) +
        (has('robot', 'tự động') ? 6 : 0),
      combinations: [
        'A00 (Toán, Lý, Hóa)',
        'A01 (Toán, Lý, Anh)',
        'C01 (Toán, Văn, Lý)'
      ],
      bestCombo: 'A00 hoặc A01',
      advice: 'Nên tập trung tối đa vào cặp môn Toán - Lý để xét tuyển vào các trường kỹ thuật hàng đầu.'
    },
    {
      name: 'Luật / Ngôn ngữ / Truyền thông',
      base: 48,
      fit:
        (scores['Ngữ văn'] || 0) * 2 +
        (scores['Tiếng Anh'] || 0) * 2 +
        (has('giao tiếp', 'thuyết trình', 'tranh biện', 'ngoại ngữ', 'luật', 'công lý') ? 14 : 0) +
        (has('viết', 'báo chí', 'podcast', 'nội dung', 'truyện', 'truyền thông') ? 10 : 0),
      combinations: [
        'D01 (Toán, Văn, Anh)',
        'C00 (Văn, Sử, Địa)',
        'A01 (Toán, Lý, Anh)',
        'D14 (Văn, Sử, Anh)'
      ],
      bestCombo: 'D01 hoặc C00',
      advice: 'Khối D01 mang lại cơ hội xét tuyển rộng nhất; khối C00 có lợi thế lớn với ngành Luật và Báo chí.'
    },
    {
      name: 'Sư phạm',
      base: 45,
      fit:
        (scores['Ngữ văn'] || 0) * 1.4 +
        (scores['Toán'] || 0) * 1.2 +
        (has('giảng dạy', 'truyền cảm hứng', 'giáo dục') ? 16 : 0) +
        (has('giao tiếp', 'sách', 'tâm lý') ? 8 : 0),
      combinations: [
        'C00 (Văn, Sử, Địa)',
        'D01 (Toán, Văn, Anh)',
        'A00 (Toán, Lý, Hóa)',
        'B00 (Toán, Hóa, Sinh)'
      ],
      bestCombo: 'Tùy bộ môn chuyên ngành',
      advice: 'Chọn tổ hợp có môn bạn muốn giảng dạy (Dạy Toán - A00/A01; Dạy Văn/Sử - C00/D01; Dạy Ngoại ngữ - D01).'
    }
  ];

  const mbti = typeof computeMBTI === 'function' ? computeMBTI(answers) : null;
  const boosts = answers.reduce((o, a) => {
    if (a === 0) o.logic = (o.logic || 0) + 1;
    if (a === 1) o.people = (o.people || 0) + 1;
    if (a === 2) o.creative = (o.creative || 0) + 1;
    if (a === 3) o.patient = (o.patient || 0) + 1;
    return o;
  }, {});

  result.forEach(x => {
    if (mbti) {
      const t = mbti.type;
      const xn = x.name.toLowerCase();
      if (t.includes('T') && t.includes('N') && (xn.includes('công nghệ') || xn.includes('kỹ thuật') || xn.includes('trí tuệ'))) x.fit += 8;
      if (t.includes('E') && t.includes('T') && (xn.includes('kinh tế') || xn.includes('quản trị') || xn.includes('logistics'))) x.fit += 8;
      if (t.includes('E') && t.includes('F') && (xn.includes('sư phạm') || xn.includes('truyền thông') || xn.includes('luật'))) x.fit += 8;
      if (t.includes('I') && t.includes('F') && (xn.includes('y') || xn.includes('dược') || xn.includes('sư phạm'))) x.fit += 8;
      if (t.includes('S') && t.includes('J') && (xn.includes('kinh tế') || xn.includes('kỹ thuật'))) x.fit += 5;
    } else {
      x.fit +=
        (boosts.logic || 0) *
        (x.name.includes('Công nghệ') || x.name.includes('Kỹ thuật') ? 3 : 1);
      x.fit +=
        (boosts.people || 0) *
        (x.name.includes('Luật') ||
        x.name.includes('Sư phạm') ||
        x.name.includes('Kinh tế')
          ? 3
          : 1);
      x.fit +=
        (boosts.creative || 0) *
        (x.name.includes('Trí tuệ') || x.name.includes('Truyền') ? 3 : 1);
    }

    const wanted = [
      ...(goals.selected || []),
      goals.other || '',
      goals.dreamMajor || '',
      goals.dreamCareer || ''
    ]
      .join(' ')
      .toLowerCase();

    if (
      wanted &&
      x.name
        .toLowerCase()
        .split(/[\/ ]+/)
        .some(word => word.length > 3 && wanted.includes(word))
    ) {
      x.fit += 12;
    }

    x.score = Math.max(35, Math.min(98, Math.round(x.base + x.fit / 2)));
  });

  result.sort((a, b) => b.score - a.score);

  result.forEach((x, idx) => {
    if (idx === 0) x.fitLevel = '🌟 Phù hợp nhất';
    else if (idx === 1) x.fitLevel = '✨ Phù hợp rất cao';
    else if (idx === 2) x.fitLevel = '✨ Phù hợp cao';
    else x.fitLevel = '👍 Khá phù hợp';
  });

  result.forEach(x => {
    x.reason = `Điểm phù hợp được tham khảo từ ${
      vals.length
        ? `điểm ${vals.length} môn (TB ${avg.toFixed(1)})`
        : 'chưa có dữ liệu điểm'
    }, sở thích, câu trả lời tính cách và mục tiêu ngành.`;
  });

  const displayGoal = goals.dreamMajor
    ? goals.dreamMajor
    : (goals.selected && goals.selected.length ? goals.selected.join(', ') : (goals.dreamCareer || 'Khám phá ngành nghề'));

  return {
    province: info.province,
    grade: info.grade,
    goals: goals.selected || [],
    goalText: displayGoal,
    results: result.slice(0, 6)
  };
}

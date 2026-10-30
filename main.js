
const NS_PREFIX = 'ns_';

function save(key, value) {
  localStorage.setItem(NS_PREFIX + key, JSON.stringify(value));
}

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(NS_PREFIX + key));
  } catch (e) {
    return null;
  }
}

function resetAllData(showMessage = true) {
  Object.keys(localStorage)
    .filter(k => k.startsWith(NS_PREFIX))
    .forEach(k => localStorage.removeItem(k));

  if (showMessage) {
    alert('Đã tạo phiên mới. Toàn bộ dữ liệu cũ đã được xóa.');
    location.href = 'index.html';
  }
}

function loadInfo() {
  const d = read('info');
  if (!d) return;

  ['province', 'grade'].forEach(k => {
    const el = document.getElementById(k);
    if (el && d[k] != null) el.value = d[k];
  });
}

// =================== HỆ THỐNG TRẮC NGHIỆM TÍNH CÁCH MBTI ===================
const MBTI_INFO = {
  'INTJ': { title: 'Nhà chiến lược', desc: 'Tư duy chiến lược sắc bén, độc lập, tầm nhìn xa trông rộng và quyết đoán.' },
  'INTP': { title: 'Nhà tư duy logic', desc: 'Phân tích logic sắc sảo, đam mê tìm tòi lý thuyết và giải mã quy luật phức tạp.' },
  'ENTJ': { title: 'Nhà chỉ huy', desc: 'Quyết đoán, có tài lãnh đạo, tư duy cấu trúc và định hướng mục tiêu mạnh mẽ.' },
  'ENTP': { title: 'Người nhìn xa sáng tạo', desc: 'Thông minh, thích tranh luận, sáng tạo không giới hạn và giàu ý tưởng đột phá.' },
  'INFJ': { title: 'Người cố vấn thấu cảm', desc: 'Giàu lòng trắc ẩn, trực giác sâu sắc, luôn hướng đến các giá trị nhân văn cao đẹp.' },
  'INFP': { title: 'Người hòa giải lý tưởng', desc: 'Sáng tạo, giàu lòng đồng cảm, sống chân thành và trung thành với giá trị nội tâm.' },
  'ENFJ': { title: 'Người truyền cảm hứng', desc: 'Nhiệt huyết, thu hút, giỏi kết nối và dẫn dắt người khác phát triển.' },
  'ENFP': { title: 'Người khám phá tự do', desc: 'Năng động, giàu cảm xúc, sáng tạo linh hoạt và luôn tràn đầy năng lượng tích cực.' },
  'ISTJ': { title: 'Người trách nhiệm', desc: 'Thực tế, cẩn trọng, tôn trọng quy tắc và luôn hoàn thành cam kết mẫu mực.' },
  'ISFJ': { title: 'Người bảo vệ chu đáo', desc: 'Tận tụy, ấm áp, kiên nhẫn và luôn chăm sóc người khác một cách chu toàn.' },
  'ESTJ': { title: 'Nhà điều hành thực tế', desc: 'Tổ chức kỷ luật, thực tế, rõ ràng và giỏi quản lý điều hành quy trình.' },
  'ESFJ': { title: 'Người chăm sóc tận tâm', desc: 'Nhiệt tình, hòa đồng, chu đáo và luôn tạo ra bầu không khí gắn kết tập thể.' },
  'ISTP': { title: 'Nhà kỹ thuật điêu luyện', desc: 'Quan sát nhạy bén, thích làm việc thực tế với công cụ máy móc và xử lý sự cố.' },
  'ISFP': { title: 'Nghệ sĩ phóng khoáng', desc: 'Tinh tế, giàu thẩm mỹ, yêu tự do và có năng khiếu nghệ thuật biểu đạt.' },
  'ESTP': { title: 'Người khởi xướng thực tế', desc: 'Táo bạo, năng động, hành động thực tế và nhạy bén với cơ hội thị trường.' },
  'ESFP': { title: 'Người trình diễn hoạt náo', desc: 'Vui vẻ, hào phóng, yêu đời và luôn là tâm điểm kết nối mọi người.' }
};

function computeMBTI(answers) {
  const savedType = typeof read === 'function' ? read('mbtiType') : null;
  if (!Array.isArray(answers) || answers.length === 0) {
    if (savedType && MBTI_INFO[savedType]) {
      return { type: savedType, ...MBTI_INFO[savedType], traits: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }, counts: {} };
    }
    return null;
  }

  // Đếm các xu hướng từ câu hỏi 4 lựa chọn (0: logic, 1: people, 2: creative, 3: patient)
  const counts = { logic: 0, people: 0, creative: 0, patient: 0 };
  answers.forEach(a => {
    if (a === 0) counts.logic++;
    else if (a === 1) counts.people++;
    else if (a === 2) counts.creative++;
    else if (a === 3) counts.patient++;
  });

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const top1 = sorted[0][0];
  const top2 = sorted[1] ? sorted[1][0] : null;

  // Xác định nhóm tính cách MBTI tương ứng với thế mạnh vượt trội
  let type = 'INTP';
  if (top1 === 'logic' && top2 === 'creative') type = 'INTP';
  else if (top1 === 'logic' && top2 === 'patient') type = 'INTJ';
  else if (top1 === 'logic') type = 'INTP';
  else if (top1 === 'people' && top2 === 'creative') type = 'ENFP';
  else if (top1 === 'people' && top2 === 'patient') type = 'ESFJ';
  else if (top1 === 'people') type = 'ENFJ';
  else if (top1 === 'creative' && top2 === 'logic') type = 'ENTP';
  else if (top1 === 'creative' && top2 === 'people') type = 'INFP';
  else if (top1 === 'creative') type = 'ISFP';
  else if (top1 === 'patient' && top2 === 'logic') type = 'ISTJ';
  else if (top1 === 'patient' && top2 === 'people') type = 'ISFJ';
  else if (top1 === 'patient') type = 'ESTJ';

  const info = MBTI_INFO[type] || { title: 'Nhóm tính cách đa diện', desc: 'Kết hợp hài hòa giữa các yếu tố tính cách.' };

  const vietnameseTrait = {
    logic: 'thiên về tư duy logic và phân tích',
    people: 'thiên về giao tiếp, thấu cảm và kết nối con người',
    creative: 'thiên về sáng tạo, trực giác và đổi mới',
    patient: 'thiên về kỷ luật, thực tế và kiên trì'
  }[top1] || 'đa diện';

  return {
    type,
    title: info.title,
    desc: info.desc,
    topTrait: top1,
    vietnameseTrait,
    counts
  };
}

function getProfile() {
  const info = read('info') || {};
  const scores = read('scores') || {};
  const hobbies = read('hobbies') || {selected: [], custom: ''};
  const answers = read('personalityAnswers') || [];
  const goals = read('goals') || {selected: [], other: ''};

  const values = Object.values(scores);
  const avg = values.length
    ? values.reduce((a,b) => a + Number(b), 0) / values.length
    : null;

  const mbti = computeMBTI(answers);
  let personality = 'đang được xác định';

  if (mbti) {
    personality = `[MBTI: ${mbti.type}] ${mbti.vietnameseTrait}`;
  } else {
    const counts = {logic: 0, people: 0, creative: 0, patient: 0};
    answers.forEach(a => {
      if (a === 0) counts.logic++;
      if (a === 1) counts.people++;
      if (a === 2) counts.creative++;
      if (a === 3) counts.patient++;
    });

    const top = Object.entries(counts).sort((a,b) => b[1] - a[1])[0];
    if (top && top[1] > 0) {
      personality = {
        logic: 'thiên về tư duy và phân tích',
        people: 'thiên về giao tiếp và hợp tác',
        creative: 'thiên về sáng tạo và thử nghiệm',
        patient: 'thiên về kiên trì và ổn định'
      }[top[0]];
    }
  }

  return {
    info,
    scores,
    hobbies,
    answers,
    goals,
    avg,
    personality,
    mbti,
    scoreCount: values.length
  };
}

function profileText() {
  const p = getProfile();
  const name = 'bạn';
  const province = p.info.province || 'chưa chọn tỉnh/thành';
  const grade = p.info.grade ? `lớp ${p.info.grade}` : 'chưa chọn lớp';
  const dream = p.goals.dreamMajor || p.goals.dreamCareer || (p.goals.selected || []).join(', ') || 'chưa đặt mục tiêu';
  const hobbies = (p.hobbies.selected || []).join(', ') || 'chưa chọn sở thích';
  const custom = p.hobbies.custom ? `; sở thích thêm: ${p.hobbies.custom}` : '';
  const avg = p.avg == null ? 'chưa có' : p.avg.toFixed(1);

  return `${name} đang ở ${province}, ${grade}; định hướng: ${dream}; đã nhập ${p.scoreCount} môn, điểm trung bình ${avg}; sở thích: ${hobbies}${custom}; xu hướng tính cách: ${p.personality}.`;
}

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

  const mbti = computeMBTI(answers);
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

// Tìm tỉnh/thành trong trang Thông tin
(function setupProvinceSearch(){
  const search = document.getElementById('provinceSearch');
  const select = document.getElementById('province');
  if (!search || !select) return;

  const provinces = Array.from(select.options)
    .slice(1)
    .map(o => o.textContent.trim());

  const normalize = s => s.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');

  search.addEventListener('input', function(){
    const keyword = normalize(this.value.trim());
    const current = select.value;
    select.innerHTML = '<option value="">-- Chọn tỉnh/thành --</option>';

    provinces
      .filter(name => !keyword || normalize(name).includes(keyword))
      .forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
      });

    if (provinces.includes(current)) select.value = current;
  });
})();

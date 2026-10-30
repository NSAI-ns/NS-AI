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

/**
 * Đánh giá Điểm mạnh, Điểm yếu và Những điều bản thân cần khắc phục (SWOT cá nhân hóa)
 * Dựa trên: Điểm các môn, Trắc nghiệm tính cách [MBTI], Sở thích và Mục tiêu
 */
function evaluateProfileSWOT() {
  const p = typeof getProfile === 'function' ? getProfile() : {};
  const scores = p.scores || read('scores') || {};
  const answers = p.answers || read('personalityAnswers') || [];
  const mbti = typeof computeMBTI === 'function' ? computeMBTI(answers) : null;
  const hobbies = (p.hobbies && p.hobbies.selected) || (read('hobbies') || {}).selected || [];
  const customHobby = (p.hobbies && p.hobbies.custom) || (read('hobbies') || {}).custom || '';
  const goals = (p.goals && p.goals.selected) || (read('goals') || {}).selected || [];
  const dreamMajor = (p.goals && p.goals.dreamMajor) || (read('goals') || {}).dreamMajor || '';

  const strengths = [];
  const weaknesses = [];
  const improvements = [];

  // 1. Phân tích điểm học thuật
  const scoreEntries = Object.entries(scores)
    .filter(([_, v]) => typeof v === 'number' && !isNaN(v))
    .sort((a, b) => b[1] - a[1]);

  if (scoreEntries.length > 0) {
    const topSubject = scoreEntries[0];
    const highSubs = scoreEntries.filter(s => s[1] >= 8.0);
    if (highSubs.length > 0) {
      strengths.push({
        title: `Thế mạnh học thuật nổi trội: ${highSubs.map(s => `${s[0]} (${s[1]}đ)`).join(', ')}`,
        desc: `Bạn có tư duy tiếp thu rất nhanh ở nhóm môn này. Đây là "vũ khí ghi điểm" chủ lực giúp bạn tối ưu hóa điểm số trong tổ hợp xét tuyển đại học.`
      });
    } else {
      strengths.push({
        title: `Môn học tự tin nhất: ${topSubject[0]} (${topSubject[1]}đ)`,
        desc: `Môn ${topSubject[0]} là điểm tựa kiến thức vững nhất của bạn hiện tại, nên chọn làm môn trụ cột trong các khối thi.`
      });
    }

    const lowSubs = scoreEntries.filter(s => s[1] < 7.0);
    if (lowSubs.length > 0) {
      const lowest = lowSubs[lowSubs.length - 1];
      weaknesses.push({
        title: `Môn học đang có nguy cơ kéo điểm: ${lowSubs.map(s => `${s[0]} (${s[1]}đ)`).join(', ')}`,
        desc: `Nếu các môn này nằm trong khối thi hoặc kỳ thi tốt nghiệp THPT, nó có thể làm tụt điểm chuẩn cạnh tranh của bạn.`
      });
      improvements.push({
        title: `Chiến lược bứt phá môn ${lowest[0]} (Quy tắc 80/20 cơ bản)`,
        desc: `Dành 40 phút mỗi ngày làm lại toàn bộ lý thuyết và bài tập trong SGK. Đừng vội làm bài khó, chỉ cần nắm chắc kiến thức cơ bản là bạn đã cầm chắc 7.0 - 7.5 điểm an toàn.`
      });
    } else if (scoreEntries.length >= 3) {
      strengths.push({
        title: 'Học lực đồng đều và nền tảng cân bằng',
        desc: 'Tất cả các môn đã nhập đều đạt từ 7.0 trở lên, tạo lợi thế lớn khi xét tuyển bằng điểm học bạ 3 năm THPT.'
      });
    }
  } else {
    weaknesses.push({
      title: 'Chưa nhập điểm số cụ thể các môn',
      desc: 'Hồ sơ chưa có dữ liệu điểm để đo lường chính xác năng lực học tập và độ an toàn khi chọn khối thi.'
    });
    improvements.push({
      title: 'Cập nhật bảng điểm học tập ngay',
      desc: 'Vào mục "Điểm số" để điền điểm các môn bạn đang học, giúp NS AI phân tích chuẩn xác cơ hội đỗ đại học.'
    });
  }

  // 2. Phân tích tính cách [MBTI]
  if (mbti) {
    const type = mbti.type;
    strengths.push({
      title: `Nhóm tính cách [${type}] – ${mbti.title}`,
      desc: mbti.desc
    });

    if (type.includes('P')) {
      weaknesses.push({
        title: 'Dễ trì hoãn & "nước đến chân mới nhảy" (Đặc tính P - Linh hoạt)',
        desc: 'Bạn giàu ý tưởng và thích sự tự do, nhưng dễ chán khi phải học bài dài hoặc lặp đi lặp lại, dẫn đến tình trạng dồn bài vào sát ngày thi.'
      });
      improvements.push({
        title: 'Áp dụng Quy tắc 5 phút & Đồng hồ Pomodoro 25/5',
        desc: 'Giao hẹn với não bộ: Chỉ mở sách làm đúng 1 câu trong 5 phút. Khi vượt qua sức ỳ ban đầu, bạn sẽ tự động cuốn vào bài học. Cất điện thoại sang phòng khác khi học.'
      });
    } else if (type.includes('J')) {
      weaknesses.push({
        title: 'Dễ căng thẳng & cầu toàn quá mức (Đặc tính J - Kỷ luật)',
        desc: 'Bạn luôn muốn mọi thứ hoàn hảo theo kế hoạch nên dễ bị stress, thất vọng hoặc hoảng loạn khi bài thi có câu bất ngờ không như dự tính.'
      });
      improvements.push({
        title: 'Học cách "Nghỉ ngơi chủ động" & Rèn tâm lý linh hoạt',
        desc: 'Chấp nhận sai số là một phần của quá trình trưởng thành. Thực hành bài tập thở 4-7-8 khi lo lắng và đi ngủ trước 11h đêm.'
      });
    }

    if (type.includes('I')) {
      weaknesses.push({
        title: 'Ngại mở rộng quan hệ & ít khi chủ động xin trợ giúp (Đặc tính I - Hướng nội)',
        desc: 'Bạn có khả năng tập trung độc lập tốt nhưng dễ ngại hỏi thầy cô khi không hiểu bài, hoặc tự ôm áp lực thi cử một mình.'
      });
      improvements.push({
        title: 'Chủ động đặt 1 câu hỏi mỗi tuần & Tìm bạn đồng hành',
        desc: 'Hãy tập đặt câu hỏi ngắn với thầy cô hoặc bạn thân khi gặp bài khó. Có người hỗ trợ sẽ giúp bạn đi nhanh hơn gấp nhiều lần.'
      });
    } else if (type.includes('E')) {
      weaknesses.push({
        title: 'Dễ bị xao nhãng bởi môi trường & mạng xã hội (Đặc tính E - Hướng ngoại)',
        desc: 'Bạn hòa đồng, hoạt ngôn nhưng dễ bị phân tâm bởi tin nhắn, bạn bè rủ rê hoặc lướt mạng xã hội làm gián đoạn giờ tự học.'
      });
      improvements.push({
        title: 'Dopamine Reset & Thiết lập khung giờ "Học sâu" (Deep Work)',
        desc: 'Dành riêng khung giờ 20h - 22h học tập trung tuyệt đối không chạm vào điện thoại để tối ưu khả năng ghi nhớ dài hạn.'
      });
    }

    if (type.includes('F')) {
      weaknesses.push({
        title: 'Nhạy cảm trước phán xét & áp lực so sánh (Đặc tính F - Cảm xúc)',
        desc: 'Bạn giàu lòng trắc ẩn và tinh tế, nhưng dễ bị tổn thương khi bị bố mẹ so sánh với "con nhà người ta" hoặc khi gặp điểm kém.'
      });
      improvements.push({
        title: 'Xây dựng tư duy "Bản thân hôm nay tiến bộ 1% so với hôm qua"',
        desc: 'Đối thủ duy nhất bạn cần chiến thắng là chính bạn của ngày hôm qua. Đừng so sánh hậu trường của mình với hào nhoáng của người khác.'
      });
    }
  }

  // 3. Sở thích & Đam mê
  if (hobbies.length > 0 || customHobby) {
    const hobbyStr = [...hobbies, ...(customHobby ? [customHobby] : [])].slice(0, 4).join(', ');
    strengths.push({
      title: `Định hướng đam mê rõ ràng (${hobbyStr})`,
      desc: 'Sở thích thực sự là ngọn lửa nội sinh giúp bạn giữ vững nhiệt huyết, không bị chán nản suốt 4 năm đại học.'
    });
  }

  // 4. Khắc phục chung về chiến lược tuyển sinh
  improvements.push({
    title: 'Đa dạng hóa phương thức xét tuyển (Không bỏ trứng vào 1 giỏ)',
    desc: 'Bên cạnh kỳ thi Tốt nghiệp THPT, hãy chuẩn bị học bạ thật đẹp, tham gia thi Đánh giá năng lực (HSA/ĐHQG) và chứng chỉ Tiếng Anh (IELTS) để tăng gấp 3 lần cơ hội đỗ đại học.'
  });

  return { strengths, weaknesses, improvements };
}

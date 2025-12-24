const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const log = document.getElementById("chat-log");

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = "message " + (role === "user" ? "user" : "bot");
  div.textContent = text;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

// ✅ HTML 렌더(체크리스트 표/버튼 카드)
function addBotHTML(html) {
  const div = document.createElement("div");
  div.className = "message bot";
  div.innerHTML = html;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

/***********************
 * 체크리스트 기능
 ***********************/
const CHECKLIST_OPTIONS = [
  { id: "school", label: "학교" },
  { id: "explosive", label: "폭발물" },
  { id: "venue", label: "공연장·영화관·체육관" },
  { id: "firearm", label: "총기" },
  { id: "intl", label: "국제행사" },
  { id: "unknown", label: "미상물질" },
];

const LEVELS = ["무", "저", "중", "고"];

const CHECKLISTS = {
  school: {
    title: "학교 위협 - 대테러 합동조사 필요성 판단",
    items: [
      { name: "구체성", detail: "학교명/건물/구역 특정, 날짜·시간대 지정, 수단·표적(학생/교직원) 지목" },
      { name: "일관성", detail: "대상·장소·시간 핵심 유지, 반복 게시 시 구체화 여부, 철회·번복 정황" },
      { name: "가능성", detail: "접근·반입 가능한 시간/동선, 답사·관찰 정황, 과거 유사 위협" },
      { name: "현실성", detail: "학교 일정·구조 이해, 대피·통제 혼선 고려 표현, 비현실 과장/허구" },
      { name: "목적성", detail: "피해 유발 의도 vs 공포 조성, 요구사항, 실행 선언 반복" },
      { name: "동기", detail: "학교 관련 갈등·보복, 외부 이념·조직 동기, 동기 설명 구체성" },
      { name: "언어", detail: "계획형 문장(순서·조건), 선언형·명령형 반복, 실행 수단 표현" },
      { name: "작성자(특정 가능성)", detail: "식별 단서(계정/번호), 문체·패턴 반복, 내부자 단서" },
      { name: "익명성", detail: "실명/연동 여부, 복수 계정·우회 정황, 삭제·변경 회피" },
      { name: "전문성", detail: "출입·통제 취약점 언급, 현실적 수단·시간 선택, 시설 이해 수준" },
    ],
  },

  explosive: {
    title: "폭발물 위협 - 대테러 합동조사 필요성 판단",
    items: [
      { name: "구체성", detail: "설치 장소·지점 특정, 기폭 시점(시간/조건), 장치 형태·설치 방식" },
      { name: "일관성", detail: "장소·시간·수단 유지, 반복 시 구체화/강화, 허세 vs 계획형 서술" },
      { name: "가능성", detail: "현장 접근·설치 가능성, 설치/재료 확보 정황, 의심물 실물·사진" },
      { name: "현실성", detail: "혼잡·사각지대 반영, 과장·허구 여부, 유사 사례 수준 전개" },
      { name: "목적성", detail: "인명피해 의도 표현, 요구조건/협상 시도, 상징 표적 선택" },
      { name: "동기", detail: "개인 원한 vs 이념·조직, 특정 기관·정책 적대, 선전·보복 시사" },
      { name: "언어", detail: "설치·기폭 실행 표현, 단계·조건 있는 계획형, 행동 선언 반복" },
      { name: "작성자(특정 가능성)", detail: "동일 계정·문체 반복, 연락수단 남김 여부, 증거/과시 자료" },
      { name: "익명성", detail: "익명 수준(일반/강화), 계정 변경·삭제 반복, 추적 회피 의도" },
      { name: "전문성", detail: "용어 정확성, 통제반경·피해 언급, 설치·기폭 방식 현실성" },
    ],
  },

  venue: {
    title: "공연장·영화관·체육관 위협 - 대테러 합동조사 필요성 판단",
    items: [
      { name: "구체성", detail: "행사명·회차·시간·좌석, 출입구·로비 지점, 혼잡 시간대 겨냥" },
      { name: "일관성", detail: "행사·장소·시간 유지, 반복 시 구체화, 번복/철회 정황" },
      { name: "가능성", detail: "보안검색·출입통제 이해, 반입·회피 시사 표현, 답사·관찰 정황" },
      { name: "현실성", detail: "시설 구조·동선 이해, 대피 혼선·군중 위험 고려, 과장·허구 여부" },
      { name: "목적성", detail: "다중 인원 피해 의도, 행사 방해·중단 목적, 요구사항 제시" },
      { name: "동기", detail: "개인 원한 vs 이념·조직, 특정 공연/단체 적대, 선전·보복 시사" },
      { name: "언어", detail: "계획형(시간·조건), 행동 선언·시간 지정, 위협 강도 변화" },
      { name: "작성자(특정 가능성)", detail: "동일 계정·문체 반복, 내부자 단서, 연락수단·요구 전달" },
      { name: "익명성", detail: "복수 계정·우회 정황, 삭제·변경 회피, 실명/연동 여부" },
      { name: "전문성", detail: "운영·동선·보안 이해, 취약 구역·시간 지적, 군중·대피 영향" },
    ],
  },

  firearm: {
    title: "총기 위협 - 대테러 합동조사 필요성 판단",
    items: [
      { name: "구체성", detail: "표적(인물/장소) 지목, 시간·동선·사격 위치, 도주·은닉 계획" },
      { name: "일관성", detail: "표적·시간·장소 유지, 반복 시 구체화, 번복/장난 주장" },
      { name: "가능성", detail: "무기·탄약 확보 정황, 사진/구매/접근 단서, 접근 가능한 환경" },
      { name: "현실성", detail: "경비·통제 회피 현실성, 과장 묘사 여부, 실제 가능한 시나리오" },
      { name: "목적성", detail: "피해 유발 의도 표현, 확정적 위협 문구, 요구사항 제시" },
      { name: "동기", detail: "개인 원한·보복 정황, 이념·조직 동기, 과거 갈등/전력 암시" },
      { name: "언어", detail: "계획형(순서·조건), 선언형 반복, 시간 경과 강도 상승" },
      { name: "작성자(특정 가능성)", detail: "식별 단서(연락처/실명), 동일 계정·문체, 주변인/내부자 정황" },
      { name: "익명성", detail: "익명 수준(일반/강화), 계정 변경·삭제, 회피 의도 강도" },
      { name: "전문성", detail: "무기 운용 지식, 사각지대·패턴 언급, 실행 가능성 정보" },
    ],
  },

  intl: {
    title: "국제행사 위협 - 대테러 합동조사 필요성 판단",
    items: [
      { name: "구체성", detail: "행사명·기간·장소 정확성, 동선·통제구역 언급, 외빈·상징 표적" },
      { name: "일관성", detail: "행사 정보·위협 유지, 계획 일관성, 번복/철회 정황" },
      { name: "가능성", detail: "접근 가능 시간·장소, 답사·관찰 정황, 수단 현실성" },
      { name: "현실성", detail: "경호·통제 구조 반영, 과장·허구 여부, 유사 사례 수준" },
      { name: "목적성", detail: "국제적 파장·선전 목적, 행사 방해 목적, 정치적 요구사항" },
      { name: "동기", detail: "이념·조직·선전 동기, 특정 국가/기관 적대, 동기 구체성" },
      { name: "언어", detail: "선전성·선언형 반복, 계획형(시간·조건), 강도 단계 상승" },
      { name: "작성자(특정 가능성)", detail: "동일 계정·문체 반복, 관계자 단서, 연락수단·요구 전달" },
      { name: "익명성", detail: "우회·복수 계정 정황, 삭제·변경 회피, 실명/연동 여부" },
      { name: "전문성", detail: "경호·운영 구조 이해, 보안구역·동선 정확성, 취약점 지적" },
    ],
  },

  unknown: {
    title: "미상물질 위협 - 대테러 합동조사 필요성 판단",
    items: [
      { name: "구체성", detail: "형태(분말/액체/가스)·위치, 용기·표식, 확산·증상 언급" },
      { name: "일관성", detail: "위치·형태·증상 유지, 시간 경과 일관, 과장/번복 정황" },
      { name: "가능성", detail: "실물·사진 존재 여부, 인체 증상 동반 여부, 오인 가능성 배제" },
      { name: "현실성", detail: "확산 경로 현실성, 현장 정황 일치, 과장·허구 여부" },
      { name: "목적성", detail: "소동 유발 vs 피해 의도, 노출 대상 시사, 요구사항 제시" },
      { name: "동기", detail: "개인 원한·보복, 이념·조직 동기, 동기 설명 구체성" },
      { name: "언어", detail: "계획형(노출/확산), 시간 지정·선언, 감정적 표현 위주 여부" },
      { name: "작성자(특정 가능성)", detail: "동일 계정·문체 반복, 내부자 단서, 연락수단·요구 전달" },
      { name: "익명성", detail: "우회·복수 계정 정황, 삭제·변경 회피, 실명/연동 여부" },
      { name: "전문성", detail: "물질·노출 지식 현실성, 전문 표현, 증상·확산 설명 정확성" },
    ],
  },
};

function judge(selectedLevels) {
  let high = 0;
  let mid = 0;
  for (const v of selectedLevels) {
    if (v === "고") high += 1;
    if (v === "중") mid += 1;
  }

  let decision = "단독 대응/관찰";
  if (high >= 1) decision = "합동조사 필요";
  else if (mid >= 2) decision = "합동조사 권고";

  return { high, mid, decision };
}

function showChecklistOptions() {
  const btns = CHECKLIST_OPTIONS
    .map((o) => `<button type="button" class="cl-opt" data-cl="${o.id}">${o.label}</button>`)
    .join("");

  addBotHTML(`
    <div class="cl-card">
      <div class="cl-title">체크리스트 선택</div>
      <div class="cl-desc">유형 선택</div>
      <div class="cl-grid">${btns}</div>
    </div>
  `);
}

function renderChecklist(typeId) {
  const data = CHECKLISTS[typeId];
  if (!data) return;

  const rows = data.items
    .map((it, idx) => {
      const radios = LEVELS
        .map((lv) => {
          const name = `cl_${typeId}_${idx}`;
          return `
            <label class="cl-lv">
              <input type="radio" name="${name}" value="${lv}">
              <span>${lv}</span>
            </label>
          `;
        })
        .join("");

      return `
        <tr>
          <td class="c1">${it.name}</td>
          <td class="c2">${it.detail}</td>
          <td class="c3">${radios}</td>
        </tr>
      `;
    })
    .join("");

  addBotHTML(`
    <div class="cl-card">
      <div class="cl-title">${data.title}</div>
      <div class="cl-rule">판정 기준: <b>고 1개 이상 → 합동조사 필요</b> / <b>중 2개 이상 → 합동조사 권고</b></div>

      <div class="cl-table-wrap">
        <table class="cl-table">
          <thead>
            <tr>
              <th>항목</th>
              <th>핵심 고려 요소(요약)</th>
              <th>평가</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>

      <div class="cl-actions">
        <button type="button" class="cl-submit" data-submit="${typeId}">결과 확인</button>
      </div>

      <div class="cl-result" id="result_${typeId}" style="display:none;"></div>
    </div>
  `);
}

function submitChecklist(typeId) {
  const data = CHECKLISTS[typeId];
  if (!data) return;

  const selected = data.items.map((_, idx) => {
    const name = `cl_${typeId}_${idx}`;
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value : null;
  });

  const resultBox = document.getElementById(`result_${typeId}`);
  const missingIdx = selected.findIndex((v) => v === null);

  if (missingIdx !== -1) {
    resultBox.style.display = "block";
    resultBox.textContent = `미선택 항목 존재. ${missingIdx + 1}번째 항목 평가 필요`;
    return;
  }

  const { high, mid, decision } = judge(selected);

  resultBox.style.display = "block";
  resultBox.innerHTML = `
    <div class="cl-r-title">판정 결과</div>
    <div>고 개수 <b>${high}</b></div>
    <div>중 개수 <b>${mid}</b></div>
    <div class="cl-r-decision"><b>${decision}</b></div>
  `;
}

// 버튼 클릭 이벤트 위임
document.addEventListener("click", (e) => {
  const opt = e.target.closest(".cl-opt");
  if (opt) {
    renderChecklist(opt.dataset.cl);
    return;
  }

  const submit = e.target.closest(".cl-submit");
  if (submit) {
    submitChecklist(submit.dataset.submit);
    return;
  }
});

/***********************
 * 채팅 submit(기존 Q&A 유지 + 체크리스트 트리거)
 ***********************/
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  addMessage("user", text);
  input.value = "";

  // ✅ 포함 트리거 반영: "체크리스트"가 문장 안에 있어도 동작
  if (text.includes("체크리스트")) {
    showChecklistOptions();
    return;
  }

  const loadingMsg = document.createElement("div");
  loadingMsg.className = "message bot";
  loadingMsg.textContent = "답변 생성 중...";
  log.appendChild(loadingMsg);
  log.scrollTop = log.scrollHeight;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    if (res.status === 401) {
      loadingMsg.textContent = "로그인이 필요합니다. 페이지를 새로고침해 주세요.";
      return;
    }

    const data = await res.json();
    loadingMsg.textContent = data.reply || "응답이 비어 있습니다.";
  } catch (err) {
    loadingMsg.textContent = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
});

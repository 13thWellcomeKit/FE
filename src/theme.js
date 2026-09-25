// 앱 전체 디자인 토큰. 색·타입·간격은 여기서만 정의하고 페이지는 가져다 쓴다.
export const color = {
  ink: "#1c1b1a", // 페이지 바탕
  surface: "#24221f", // 패널
  raised: "#2e2b27", // 입력칸, 패널 안의 행
  line: "#3a3632",
  text: "#f6f2ec",
  muted: "#a8a097",
  brand: "#ff7710",
  brandDeep: "#e05f00",
  danger: "#ff6b5e",
};

export const font = {
  display: "'Montserrat', 'Pretendard Variable', Pretendard, sans-serif",
  body: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
};

// 1.25 배율
export const size = {
  xs: "0.8rem",
  sm: "0.875rem",
  md: "1rem",
  lg: "1.25rem",
  xl: "1.5625rem",
  x2: "1.953rem",
  x3: "2.441rem",
  x4: "3.815rem",
  hero: "clamp(3rem, 7.4vw, 6.75rem)",
};

export const radius = { panel: "20px", control: "12px", pill: "999px" };

export const bp = {
  mobile: "576px",
  tablet: "768px",
  laptop: "1024px",
};

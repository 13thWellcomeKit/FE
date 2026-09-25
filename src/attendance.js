// 출석 상태 표시와 QR 토큰 파싱을 출석체크·마이페이지·운영진 화면이 함께 쓴다.

// 색은 상태 신호용(good / warning / critical). 항상 라벨과 같이 써서 색만으로 구분하지 않게 한다.
export const ATTENDANCE_STATUS = {
  PRESENT: { label: "출석", color: "#0ca30c" },
  LATE: { label: "지각", color: "#fab219" },
  ABSENT: { label: "결석", color: "#d03b3b" },
};

export const STATUS_ORDER = ["PRESENT", "LATE", "ABSENT"];

export const statusLabel = (status) =>
  ATTENDANCE_STATUS[status]?.label ?? "상태 불명";

// QR 내용은 `<FE 도메인>/check?token=...`. URL이 아니거나 token이 없으면 null.
export function extractQrToken(text) {
  if (!text) return null;
  try {
    return new URL(text).searchParams.get("token");
  } catch {
    return null;
  }
}

// 서버는 LocalDate / LocalDateTime을 "2026-09-22" / "2026-09-22T19:05:00.123" 문자열로 준다.
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function formatDate(value) {
  if (!value) return "-";
  const day = value.slice(0, 10);
  const weekday = new Date(`${day}T00:00:00`).getDay();
  return `${day.replace(/-/g, ".")} (${WEEKDAYS[weekday]})`;
}

export function formatTime(value) {
  return value && value.length >= 16 ? value.slice(11, 16) : "";
}

export function errorMessage(error, fallback) {
  const data = error?.response?.data;
  if (data?.errorCode === "PERMISSION_ERROR") return "운영진만 할 수 있습니다.";
  if (data?.errorCode === "INVALID_QR")
    return "만료되었거나 유효하지 않은 QR입니다. 운영진에게 새 QR을 요청해주세요.";
  return data?.message || fallback;
}

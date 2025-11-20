// src/lib/formatNumber.ts

export default function formatNumber(value: string | number) {
  const num = Number(value);
  if (isNaN(num)) return String(value);

  return num.toLocaleString("ko-KR");
}

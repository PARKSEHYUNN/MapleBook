// src/lib/formatFloat.ts

export default function formatFloat(value: string | number, point: number) {
  const num = Number(value);
  if (isNaN(num)) return String(value);

  return num.toLocaleString("ko-KR", {
    maximumFractionDigits: point,
    minimumFractionDigits: point,
  });
}

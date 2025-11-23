// src/lib/formatToKoreanNumber.ts

export default function formatToKoreanNumber(value: string | number) {
  let num = Number(value);

  if (isNaN(num) || num === 0) return "0";

  const units = ["", "만", "억", "조"];
  const result: string[] = [];
  let unitIndex = 0;

  while (num > 0 && unitIndex < units.length) {
    const chunk = num % 10000;

    if (chunk > 0) result.unshift(`${chunk}${units[unitIndex]}`);

    num = Math.floor(num / 10000);
    unitIndex++;
  }

  return result.join(" ");
}

// src/lib/getAvg.ts

export default function getAvg(
  value1: string | number,
  value2: string | number
) {
  const num1 = Number(value1);
  const num2 = Number(value2);

  if (isNaN(num1) || isNaN(num2)) return 0;

  return (num1 + num2) / 2;
}

// src/lib/utils/fotmat.ts

export function formatToKoreanNumber(value: string | number | null = 0) {
  let num = Number(value);
  if (isNaN(num) || num === 0) {
    return '0';
  }

  const units = ['', '만', '억', '조'];
  const result: string[] = [];
  let unitIndex = 0;

  while (num > 0 && unitIndex < units.length) {
    const chunk = num % 10000;

    if (chunk > 0) {
      result.unshift(`${chunk}${units[unitIndex]}`);
    }

    num = Math.floor(num / 10000);
    unitIndex++;
  }

  return result.join(' ');
}

export function formatTimeAgo(date: Date | string | number): string {
  const now = new Date();
  const target = new Date(date);

  const diff = (now.getTime() - target.getTime()) / 1000;

  if (diff < 0) {
    return '방금 전';
  }

  if (diff < 60) {
    return `${Math.floor(diff)}초 전`;
  }
  if (diff < 3600) {
    return `${Math.floor(diff / 60)}분 전`;
  }
  if (diff < 86400) {
    return `${Math.floor(diff / 3600)}시간 전`;
  }
  if (diff < 2592000) {
    return `${Math.floor(diff / 86400)}일 전`;
  }
  if (diff < 31536000) {
    return `${Math.floor(diff / 2592000)}개월 전`;
  }
  return `${Math.floor(diff / 31536000)}년 전`;
}

export function formatNumber(value: string | number) {
  const num = Number(value);
  if (isNaN(num)) {
    return String(value);
  }

  return num.toLocaleString('ko-KR');
}

export function formatFloat(value: string | number, point: number) {
  const num = Number(value);
  if (isNaN(num)) {
    return String(value);
  }

  return num.toLocaleString('ko-KR', {
    maximumFractionDigits: point,
    minimumFractionDigits: point,
  });
}

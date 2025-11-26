'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  PolarRadiusAxis,
  Tooltip, // 👈 1. Tooltip 임포트
} from 'recharts';

type TraitData = {
  subject: string;
  value: number;
  fullMark: number;
};

// 📌 2. 커스텀 툴팁 컴포넌트 (그래프 점 호버 시 나옴)
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
        <p className="mb-1 text-xs font-bold text-gray-700">
          {payload[0].payload.subject}
        </p>
        <p className="text-xs text-sky-600">
          Lv. <span className="font-bold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

// 📌 3. 커스텀 틱 수정 (라벨 호버 시 값 표시)
const CustomTick = ({ payload, x, y, cx, cy, chartData }: any) => {
  // 현재 라벨에 해당하는 데이터 찾기
  const currentItem = chartData.find(
    (item: TraitData) => item.subject === payload.value
  );
  const value = currentItem ? currentItem.value : 0;

  // 좌표 계산 로직 (기존 동일)
  const isVertical = Math.abs(x - cx) < 1;
  const dynamicGap = isVertical ? 10 : 25;
  const distance = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
  const newX = x + ((x - cx) / distance) * dynamicGap;
  const newY = y + ((y - cy) / distance) * dynamicGap;

  return (
    <g transform={`translate(${newX},${newY})`}>
      <foreignObject x={-30} y={-12} width={60} height={24}>
        {/* title 속성에 값을 넣으면 라벨에 마우스 올렸을 때 브라우저 툴팁이 뜸 */}
        <div
          className="flex h-full w-full cursor-help items-center justify-center rounded-md border border-sky-300 bg-sky-200 shadow-sm transition-transform hover:scale-110"
          title={`${payload.value}: ${value}`}
        >
          <span className="text-[10px] font-bold whitespace-nowrap text-white md:text-xs">
            {payload.value}
          </span>
        </div>
      </foreignObject>
    </g>
  );
};

export default function TraitRadar({ data }: { data: TraitData[] }) {
  // 데이터 기본값
  const chartData = data || [
    { subject: '카리스마', value: 80, fullMark: 100 },
    { subject: '감성', value: 40, fullMark: 100 },
    { subject: '통찰력', value: 30, fullMark: 100 },
    { subject: '의지', value: 60, fullMark: 100 },
    { subject: '손재주', value: 50, fullMark: 100 },
    { subject: '매력', value: 90, fullMark: 100 },
  ];

  return (
    <div className="flex h-[300px] w-full items-center justify-center rounded-xl bg-white">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
          <PolarGrid stroke="#e5e7eb" />

          <PolarAngleAxis
            dataKey="subject"
            // chartData를 CustomTick에 넘겨줘서 값을 알 수 있게 함
            tick={(props) => <CustomTick {...props} chartData={chartData} />}
          />

          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />

          {/* 4. Tooltip 컴포넌트 추가 */}
          <Tooltip
            content={<CustomTooltip />}
            cursor={false} // 호버 시 나오는 십자선 제거 (지저분함)
          />

          <Radar
            name="Traits"
            dataKey="value"
            stroke="#38bdf8"
            strokeWidth={2}
            fill="#bae6fd"
            fillOpacity={0.5}
            dot={{
              r: 4,
              fill: '#ffffff',
              stroke: '#38bdf8',
              strokeWidth: 2,
            }}
            // 레이더 영역 호버 시 커서 변경
            className="cursor-pointer"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

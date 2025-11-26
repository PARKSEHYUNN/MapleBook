// src/app/user/[characterName]/_components/CharacterDetails/PropensityRadar.tsx
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

type PropensityData = {
  subject: string;
  value: number;
  fullMark: number;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: {
    value: number;
    payload: PropensityData;
  }[];
  label?: string;
};

type CustomTickProps = {
  payload: {
    value: string;
  };
  x?: string | number;
  y?: string | number;
  cx?: string | number;
  cy?: string | number;
  chartData: PropensityData[];
};

type PropensityProps = {
  data: PropensityData[];
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
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
};

const CustomTick = ({
  payload,
  x = 0,
  y = 0,
  cx = 0,
  cy = 0,
  chartData,
}: CustomTickProps) => {
  const numX = Number(x);
  const numY = Number(y);
  const numCx = Number(cx);
  const numCy = Number(cy);

  const currentItem = chartData.find(
    (item: PropensityData) => item.subject === payload.value
  );
  const value = currentItem ? currentItem.value : 0;

  const isVertical = Math.abs(numX - numCx) < 1;
  const dynamicGap = isVertical ? 10 : 25;
  const distance = Math.sqrt(
    Math.pow(numX - numCx, 2) + Math.pow(numY - numCy, 2)
  );

  if (distance === 0) {
    return null;
  }

  const newX = numX + ((numX - numCx) / distance) * dynamicGap;
  const newY = numY + ((numY - numCy) / distance) * dynamicGap;

  return (
    <g transform={`translate(${newX}, ${newY})`}>
      <foreignObject x={-30} y={-12} width={60} height={24}>
        <div
          className="flex h-full w-full items-center justify-center rounded-md border-sky-300 bg-sky-200 shadow-sm transition-transform hover:scale-110"
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

export default function PropensityRadar({ data }: PropensityProps) {
  const chartData = data || [
    { subject: '카리스마', value: 0, fullMark: 100 },
    { subject: '감성', value: 0, fullMark: 100 },
    { subject: '통찰력', value: 0, fullMark: 100 },
    { subject: '의지', value: 0, fullMark: 100 },
    { subject: '손재주', value: 0, fullMark: 100 },
    { subject: '매력', value: 0, fullMark: 100 },
  ];

  return (
    <div className="flex h-[300px] w-full items-center justify-center rounded-xl bg-white">
      <ResponsiveContainer width={'100%'} height={'100%'}>
        <RadarChart cx={'50%'} cy={'50%'} outerRadius={'65%'} data={chartData}>
          <PolarGrid stroke={'#E5E7EB'} />

          <PolarAngleAxis
            dataKey={'subject'}
            tick={(props) => <CustomTick {...props} chartData={chartData} />}
          />

          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />

          <Tooltip content={<CustomTooltip />} cursor={false} />

          <Radar
            name="Propensity"
            dataKey={'value'}
            stroke="#38BDF8"
            strokeWidth={2}
            fill="#BAE6FD"
            fillOpacity={0.5}
            dot={{
              r: 4,
              fill: '#FFFFFF',
              stroke: '#38BDF8',
              strokeWidth: 2,
            }}
            className="curosr-pointer"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

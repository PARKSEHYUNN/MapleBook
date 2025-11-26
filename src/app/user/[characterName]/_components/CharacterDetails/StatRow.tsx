// src/app/user/[characterName]/_components/CharacterDetails/StatRow.tsx

type StatRowProps = {
  label: string;
  value: React.ReactNode;
};

export default function StatRow({ label, value }: StatRowProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <p className="nexon text-sm font-bold text-shadow-lg">{label}</p>
      <p className="galmuri text-right text-xs text-shadow-lg">{value}</p>
    </div>
  );
}

// src/components/common/PresetNavigation.tsx

type PresetNavigationProps = {
  presets: string[] | number[];
  activeIndex: number;
  initalIndex: number;
  onSelect: (index: number) => void;
  className?: string;
};

export default function PresetNavigation({
  presets,
  activeIndex,
  initalIndex,
  onSelect,
  className,
}: PresetNavigationProps) {
  return (
    <div
      className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-500 py-1 text-white ${className}`}
    >
      <p className="nexon text-xs">PRESETS</p>
      {presets.map((label, index) => {
        const isInitial = index === initalIndex;
        const isActive = index === activeIndex;
        return (
          <div
            key={`${label}-${index}`}
            onClick={() => onSelect(index)}
            className={`galmuri flex h-6 w-6 items-center justify-center rounded-lg border text-xs shadow-lg hover:cursor-pointer ${
              isInitial ? 'bg-gray-600' : 'bg-gray-400'
            } ${isActive ? 'border-white' : 'border-gray-500'}`}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
}

// src/components/ui/Separator.tsx

type SeparatorProps = {
  className?: string;
};

export default function Separator({ className = '' }: SeparatorProps) {
  return <div className={`my-4 border-t border-gray-200 ${className}`}></div>;
}

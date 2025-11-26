// src/app/user/[characterName]/_components/CharacterDetails/StatBox.tsx
import StatRow from './StatRow';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';

type StatConfig = {
  label: string;
  value: string | number | React.ReactNode;
};

type StatBoxProps = {
  items: StatConfig[];
  className?: string;
  itemsPerPage?: number;
};

export default function StatBox({
  items,
  className,
  itemsPerPage = 6,
}: StatBoxProps) {
  const [page, setPage] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentItem = items.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  if (totalPages <= 1) {
    return (
      <div className={`m-2 rounded-lg bg-gray-400 p-4 text-white ${className}`}>
        <div className="grid grid-cols-2 items-center justify-center gap-5">
          {items.map((item, index) => (
            <StatRow
              key={`${item.label}-${index}`}
              label={item.label}
              value={item.value}
            />
          ))}
        </div>
      </div>
    );
  }
  const handleWheel = (e: React.WheelEvent) => {
    if (timerRef.current) {
      return;
    }

    if (e.deltaY > 0) {
      setPage((prev) => (prev + 1) % totalPages);
    } else {
      setPage((prev) => (prev - 1 + totalPages) % totalPages);
    }

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
    }, 500);
  };

  return (
    <div
      className={`m-2 rounded-lg bg-gray-400 p-4 text-white ${className}`}
      onWheel={handleWheel}
    >
      <div className="grid grid-cols-2 items-center justify-center gap-5">
        {currentItem.map((item, index) => (
          <StatRow
            key={`${item.label}-${page}-${index}`}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>

      <div className="mt-2 flex w-full justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <div
            key={idx}
            className={`text-[7px] hover:cursor-pointer ${page === idx ? 'text-white' : 'text-gray-600'}`}
            onClick={() => setPage(idx)}
          >
            <FontAwesomeIcon icon={faCircle} />
          </div>
        ))}
      </div>
    </div>
  );
}

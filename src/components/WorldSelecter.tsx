// src/components/WorldSelecter.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import WorldIcon from "./WorldIcon";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

type WorldSelecterProps = {
  list: string[];
  selectedWorld: string;
  onSelectWorld: (worldName: string) => void;
};

export default function WorldSelecter({
  list,
  selectedWorld,
  onSelectWorld,
}: WorldSelecterProps) {
  const [isWorldSelecterOpen, setIsWorldSelecterOpen] = useState(false);
  const worldSelecterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        worldSelecterRef.current &&
        !worldSelecterRef.current.contains(event.target as Node)
      )
        setIsWorldSelecterOpen(false);
    };

    if (isWorldSelecterOpen)
      document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isWorldSelecterOpen]);

  return (
    <div ref={worldSelecterRef}>
      <div
        className="px-3 py-2 m-2 flex justify-center items-center gap-1 bg-white rounded-4xl shadow-md cursor-pointer text-sm "
        onClick={() => setIsWorldSelecterOpen(!isWorldSelecterOpen)}
      >
        <WorldIcon worldName={selectedWorld} />
        <span className="ms-1 me-1">{selectedWorld}</span>
        <FontAwesomeIcon icon={faChevronDown} />
      </div>

      <div
        className={`z-50 list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm absolute top-14 right-0 min-w-35 ${
          !isWorldSelecterOpen && "hidden"
        }`}
      >
        {list.map((world_name) => (
          <div
            key={`${world_name}_block`}
            className="flex justify-center items-center w-full px-3 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              onSelectWorld(world_name);
              setIsWorldSelecterOpen(false);
            }}
          >
            <div className="w-4 ms-2 flex-shrink-0">
              <WorldIcon worldName={world_name} />
            </div>
            <span className="block flex-1">{world_name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

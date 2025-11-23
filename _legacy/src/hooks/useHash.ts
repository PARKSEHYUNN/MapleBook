// src/hooks/useHash.ts

"use client";

import { useState, useEffect } from "react";

export function useHash() {
  const [hash, setHash] = useState("");

  useEffect(() => {
    const setHashFromWindow = () => {
      setHash(window.location.hash);
    };

    setHashFromWindow();

    window.addEventListener("hashchange", setHashFromWindow);

    return () => {
      window.removeEventListener("hashchange", setHashFromWindow);
    };
  }, []);

  return hash;
}

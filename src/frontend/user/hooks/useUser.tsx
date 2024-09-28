"use client";

import { useEffect, useState } from "react";
import { getXuidFromIndexedDB } from "../utils/storage";

const useUser = () => {
  const [xuid, setXuid] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const xuid = await getXuidFromIndexedDB();
      setXuid(xuid);
    })();
  }, []);

  return { xuid };
};

export default useUser;

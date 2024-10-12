"use client";

import { useEffect, useState } from "react";
import { getXuidFromIndexedDB } from "../utils/storage";
import { UserPublic } from "@/backend/user/types";
import axios from "axios";

const useUser = () => {
  const [xuid, setXuid] = useState<string>("");
  const [userPublic, setUserPublic] = useState<UserPublic | null>(null);

  useEffect(() => {
    (async () => {
      const xuid = await getXuidFromIndexedDB();

      const { data } = await axios.get<UserPublic>("/api/user", { headers: { xuid } });

      setUserPublic(data);
      setXuid(xuid || "");
    })();
  }, []);

  return { xuid, userPublic };
};

export default useUser;

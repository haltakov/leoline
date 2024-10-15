import cuid from "cuid";

export const getXuidFromIndexedDB = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const request: IDBOpenDBRequest = indexedDB.open("lludb", 1);

    request.onerror = (event) => {
      console.error("Error opening IndexedDB", event);
      reject("Error opening IndexedDB");
    };

    request.onsuccess = (event) => {
      const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;

      const transaction: IDBTransaction = db.transaction(["lluos"], "readwrite");
      const objectStore: IDBObjectStore = transaction.objectStore("lluos");

      const xuidRequest: IDBRequest = objectStore.get("xuid");

      xuidRequest.onerror = (event) => {
        console.error("Error fetching xuid from IndexedDB", event);
        reject("Error fetching xuid from IndexedDB");
      };

      xuidRequest.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result;

        if (result !== undefined) {
          resolve(result.value as string);
        } else {
          const xuid = cuid();
          objectStore.add({ id: "xuid", value: xuid });
          resolve(xuid);
        }
      };
    };

    request.onupgradeneeded = (event) => {
      const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains("lluos")) {
        const objectStore = db.createObjectStore("lluos", { keyPath: "id" });

        objectStore.add({ id: "xuid", value: cuid() });
      }
    };
  });
};

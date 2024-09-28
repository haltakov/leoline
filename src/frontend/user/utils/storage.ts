import cuid from "cuid";

export const getXuidFromIndexedDB = async (): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    // Open a connection to the IndexedDB database (replace 'myDatabase' with your actual database name)
    const request: IDBOpenDBRequest = indexedDB.open("lludb", 1);

    request.onerror = (event) => {
      // Handle errors when opening the database
      console.error("Error opening IndexedDB", event);
      reject("Error opening IndexedDB");
    };

    request.onsuccess = (event) => {
      const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;

      const transaction: IDBTransaction = db.transaction(["lluos"], "readonly");
      const objectStore: IDBObjectStore = transaction.objectStore("lluos");

      // Assuming 'xuid' is the key or unique identifier in your IndexedDB
      const xuidRequest: IDBRequest = objectStore.get("xuid");

      xuidRequest.onerror = (event) => {
        // Handle errors when fetching data
        console.error("Error fetching xuid from IndexedDB", event);
        reject("Error fetching xuid from IndexedDB");
      };

      xuidRequest.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result;

        if (result !== undefined) {
          resolve(result as string); // Successfully retrieved the xuid
        } else {
          resolve(null); // No xuid found
        }
      };
    };

    request.onupgradeneeded = (event) => {
      const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains("lluos")) {
        const objectStore = db.createObjectStore("lluos", { keyPath: "id" });

        // Add default data if needed (optional)
        objectStore.add({ id: "xuid", value: cuid() });
      }
    };
  });
};

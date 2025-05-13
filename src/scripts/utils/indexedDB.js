// Fungsi untuk membuka IndexedDB
export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("appDataDB", 1);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("dataStore")) {
        db.createObjectStore("dataStore", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
};

// Fungsi untuk menyimpan data ke IndexedDB
export const saveDataToDB = async (data) => {
  const db = await openDB();
  const transaction = db.transaction("dataStore", "readwrite");
  const store = transaction.objectStore("dataStore");
  store.add(data);
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve("Data saved");
    transaction.onerror = (e) => reject(e.target.error);
  });
};

// Fungsi untuk mengambil data dari IndexedDB
export const getDataFromDB = async () => {
  const db = await openDB();
  const transaction = db.transaction("dataStore", "readonly");
  const store = transaction.objectStore("dataStore");
  const request = store.getAll();
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = (e) => reject(e.target.error);
  });
};

// Fungsi untuk menghapus data dari IndexedDB
export const deleteDataFromDB = async (id) => {
  const db = await openDB();
  const transaction = db.transaction("dataStore", "readwrite");
  const store = transaction.objectStore("dataStore");
  store.delete(id);
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve("Data deleted");
    transaction.onerror = (e) => reject(e.target.error);
  });
};

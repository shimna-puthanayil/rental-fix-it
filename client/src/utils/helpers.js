export function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
//creates a db fix-it and object stores in indexedDB and
//perform get, put and delete operations based on method inside products, categories and cart

export function idbPromise(complaintAppName, method, object) {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("fix-it", 1);
    let db, tx, complaint;
    request.onupgradeneeded = function (e) {
      const db = request.result;
      db.createObjectStore("complaints", { keyPath: "_id" });
    };

    request.onerror = function (e) {
      console.log("There was an error");
    };

    request.onsuccess = function (e) {
      db = request.result;
      tx = db.transaction(complaintAppName, "readwrite");
      complaint = tx.objectStore(complaintAppName);

      db.onerror = function (e) {
        console.log("error", e);
      };
      //performs the operations put, get , delete and clear based on method
      switch (method) {
        case "put":
          complaint.put(object);
          resolve(object);
          break;
        case "get":
          const all = complaint.getAll();
          all.onsuccess = function () {
            resolve(all.result);
          };
          break;
        case "delete":
          complaint.delete(object._id);
          break;
        case "clear":
          complaint.clear();
          break;
        default:
          console.log("No valid method");
          break;
      }

      tx.oncomplete = function () {
        db.close();
      };
    };
  });
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyA5cx9pSWL6YkzFhmz2qHIjrtmgxWnt4o5fMB1w",
  authDomain: "suivi-cosmosushimougins.firebaseapp.com",
  databaseURL: "https://suivi-cosmosushimougins-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "suivi-cosmosushimougins",
  storageBucket: "suivi-cosmosushimougins.appspot.com",
  messagingSenderId: "792108307295",
  appId: "1:792108307295:web:93a905f8ab7e0ed8d084b6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };

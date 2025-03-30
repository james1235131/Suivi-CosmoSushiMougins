// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCSmq6ZSYKt9GKGklWufjFHmlD2Jn43iQo",
  authDomain: "suivi-cosmosushimougins.firebaseapp.com",
  databaseURL: "https://suivi-cosmosushimougins-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "suivi-cosmosushimougins",
  storageBucket: "suivi-cosmosushimougins.firebasestorage.app",
  messagingSenderId: "912838657291",
  appId: "1:912838657291:web:374a4858bf83d0aad38e0e"
};

// Initialise l'app Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };

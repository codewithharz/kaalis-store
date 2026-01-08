import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAxegfm4kVdYsaqrlN2V9tF3KXhjCD_zxM",
  authDomain: "kaalis-store.firebaseapp.com",
  projectId: "kaalis-store",
  storageBucket: "kaalis-store.appspot.com",
  messagingSenderId: "4899945782",
  appId: "1:4899945782:web:a8fbbfc85487fd7b950797",
  measurementId: "G-TE5MYV1WB0",
};

let app;
let storage;

try {
  app = initializeApp(firebaseConfig);
  storage = getStorage(app);
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

export { app, storage };

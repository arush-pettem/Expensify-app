// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1nkLS8KM1tk6rMWdsGAeWX230opb1e7Q",
  authDomain: "financely-rec-2925d.firebaseapp.com",
  projectId: "financely-rec-2925d",
  storageBucket: "financely-rec-2925d.appspot.com",
  messagingSenderId: "269394128850",
  appId: "1:269394128850:web:525a913b8f7626a91e620b",
  measurementId: "G-7CHQ994W7H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };

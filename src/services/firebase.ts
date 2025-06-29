import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCLotwUHuPLDYuYSlGCPtB-1pPaP0Lnbeg",
  authDomain: "mus1k0n.firebaseapp.com",
  projectId: "mus1k0n",
  storageBucket: "mus1k0n.appspot.com", // Cambiado a "appspot.com"
  messagingSenderId: "52548761937",
  appId: "1:52548761937:web:891466064d53d395f1fb70",
  measurementId: "G-4RK2WXGSNC", // No es necesario en React Native
  databaseURL: "https://mus1k0n-default-rtdb.firebaseio.com/", // Agrega la URL de la base de datos 
  // https://console.firebase.google.com/project/mus1k0n/firestore/databases/-default-/data/~2Fusers
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Obtén las instancias de Auth y Database
export const auth = getAuth(app);
export const database = getDatabase(app);














// // import { initializeApp } from 'firebase/app';
// // import { getAuth } from 'firebase/auth';
// // import { getDatabase } from 'firebase/database';
// // import AsyncStorage from "@react-native-async-storage/async-storage";

// // // Configuración de Firebase
// // const firebaseConfig = {
// //   apiKey: "TU_API_KEY",
// //   authDomain: "TU_AUTH_DOMAIN",
// //   databaseURL: "TU_DATABASE_URL",
// //   projectId: "TU_PROJECT_ID",
// //   storageBucket: "TU_STORAGE_BUCKET",
// //   messagingSenderId: "TU_MESSAGING_SENDER_ID",
// //   appId: "TU_APP_ID"
// // };

// // // Inicializa Firebase
// // const app = initializeApp(firebaseConfig);
// // export const auth = getAuth(app);
// // export const database = getDatabase(app);

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCLotwUHuPLDYuYSlGCPtB-1pPaP0Lnbeg",
//   authDomain: "mus1k0n.firebaseapp.com",
//   projectId: "mus1k0n",
//   storageBucket: "mus1k0n.firebasestorage.app",
//   messagingSenderId: "52548761937",
//   appId: "1:52548761937:web:891466064d53d395f1fb70",
//   measurementId: "G-4RK2WXGSNC"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

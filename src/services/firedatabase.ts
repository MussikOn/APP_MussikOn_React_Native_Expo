// import { getFirestore, doc, getDoc } from "firebase/firestore";
// import {app} from './firebase'; // Asegúrate de tener tu configuración de Firebase correctamente importada

// async function getUserData(userId: number): Promise<any | null> {
//     try {
//       const db = getFirestore(app);
//       const docRef = doc(db, "users", userId.toString()); //users es el nombre de tu coleccion
//       const docSnap = await getDoc(docRef);
  
//       if (docSnap.exists()) {
//         return docSnap.data();
//       } else {
//         console.log("No such document!");
//         return null;
//       }
//     } catch (error) {
//       console.error("Error getting document:", error);
//       return null;
//     }
//   }
  
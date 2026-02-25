// سكريبت Node.js رفع البيانات للفير بيس
// يتطلب: npm install firebase-admin
// تشغيل: node upload-services.js

import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCaY8D2WJ-JpWujUa2vnjxxHS-OiazDqxQ",
  authDomain: "eventsplanner-3cac4.firebaseapp.com",
  projectId: "eventsplanner-3cac4",
  storageBucket: "eventsplanner-3cac4.firebasestorage.app",
  messagingSenderId: "523995742417",
  appId: "1:523995742417:web:a5c63540f5eff50af145f0",
  measurementId: "G-PRV1S1ED81"
};

const services = [
  {
    id: "dj_1",
    name: "DJ Ramiz Events",
    category: "music",
    price: 3500,
    rating: 4.7,
    isAvailable: true,
    city: "Nazareth"
  },
  {
    id: "photo_2",
    name: "Golden Lens Studio",
    category: "photography",
    price: 5000,
    rating: 4.8,
    isAvailable: true,
    city: "Umm al-Fahm"
  }
];

async function uploadServices() {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const colRef = collection(db, "Collection");

    for (let service of services) {
      await setDoc(doc(colRef, service.id), service);
      console.log(`✅ تم رفع: ${service.name}`);
    }

    console.log("\n🎉 تم رفع جميع الخدمات بنجاح!");
  } catch (error) {
    console.error("❌ خطأ:", error);
  }
}

uploadServices();

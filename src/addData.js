import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase/config";

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

export const uploadServices = async () => {
  try {
    const colRef = collection(db, "Collection");

    for (let service of services) {
      await setDoc(doc(colRef, service.id), service);
      console.log(`تم رفع: ${service.name}`);
    }

    console.log("تم رفع جميع البيانات بنجاح ✓");
  } catch (error) {
    console.error("خطأ في رفع البيانات:", error);
  }
};

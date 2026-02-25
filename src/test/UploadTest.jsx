import { useState } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const services = [
  // ================= DJ (6) =================
  {
    id: "dj_1",
    name: "DJ Ramiz Events",
    category: "music",
    city: "Nazareth",
    price: 3500,
    rating: 4.7,
    experienceYears: 6,
    eventsCompleted: 220,
    isAvailable: true,
    bio: "Professional wedding DJ with modern Arabic and international music.",
    description: "Full DJ setup with sound system, lighting and MC service.",
    features: ["Sound System", "Lighting", "MC", "Zaffa"],
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
  },
  {
    id: "dj_2",
    name: "DJ Night Star",
    category: "music",
    city: "Haifa",
    price: 3200,
    rating: 4.5,
    experienceYears: 5,
    eventsCompleted: 180,
    isAvailable: true,
    bio: "High energy DJ for weddings and parties.",
    description: "Professional sound and LED lighting effects.",
    features: ["Sound", "LED Lights", "Party Effects"],
    image: "https://images.unsplash.com/photo-1571266028243-e4733b8b0d8d"
  },
  {
    id: "dj_3",
    name: "DJ Royal Mix",
    category: "music",
    city: "Umm al-Fahm",
    price: 3800,
    rating: 4.8,
    experienceYears: 8,
    eventsCompleted: 300,
    isAvailable: true,
    bio: "Luxury wedding DJ service.",
    description: "Premium sound and lighting for large events.",
    features: ["Premium Sound", "Lighting", "Smoke Machine"],
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063"
  },
  {
    id: "dj_4",
    name: "DJ Arabic Beats",
    category: "music",
    city: "Sakhnin",
    price: 3000,
    rating: 4.4,
    experienceYears: 4,
    eventsCompleted: 140,
    isAvailable: true,
    bio: "Specialized in Arabic weddings.",
    description: "Complete DJ service with traditional and modern music.",
    features: ["Sound System", "Zaffa Music"],
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819"
  },
  {
    id: "dj_5",
    name: "DJ Party Pro",
    category: "music",
    city: "Tayibe",
    price: 3400,
    rating: 4.6,
    experienceYears: 6,
    eventsCompleted: 200,
    isAvailable: true,
    bio: "Professional DJ for all event types.",
    description: "Sound, lighting and party atmosphere guaranteed.",
    features: ["Sound", "Lighting", "MC"],
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745"
  },
  {
    id: "dj_6",
    name: "DJ Elite Events",
    category: "music",
    city: "Shefa-Amr",
    price: 3600,
    rating: 4.7,
    experienceYears: 7,
    eventsCompleted: 250,
    isAvailable: true,
    bio: "Elite DJ for luxury weddings.",
    description: "Advanced lighting and professional sound system.",
    features: ["Premium Sound", "LED Screens", "Lighting"],
    image: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2"
  },

  // ================= Photography (6) =================
  {
    id: "photo_1",
    name: "Golden Lens",
    category: "photography",
    city: "Nazareth",
    price: 5000,
    rating: 4.8,
    experienceYears: 8,
    eventsCompleted: 300,
    isAvailable: true,
    bio: "Professional wedding photography team.",
    description: "Full day photo and cinematic video coverage.",
    features: ["Full Day", "Drone", "Album"],
    image: "https://images.unsplash.com/photo-1519741497674-611481863552"
  },
  {
    id: "photo_2",
    name: "Royal Studio",
    category: "photography",
    city: "Haifa",
    price: 4500,
    rating: 4.6,
    experienceYears: 6,
    eventsCompleted: 210,
    isAvailable: true,
    bio: "Creative wedding photography.",
    description: "Photo, video and editing package.",
    features: ["Photography", "Video"],
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf"
  },
  {
    id: "photo_3",
    name: "Dream Media",
    category: "photography",
    city: "Tayibe",
    price: 5200,
    rating: 4.9,
    experienceYears: 9,
    eventsCompleted: 350,
    isAvailable: true,
    bio: "Luxury wedding media production.",
    description: "Drone and cinematic highlight video included.",
    features: ["Drone", "Highlight Video"],
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  },
  {
    id: "photo_4",
    name: "Moments Studio",
    category: "photography",
    city: "Umm al-Fahm",
    price: 4000,
    rating: 4.5,
    experienceYears: 5,
    eventsCompleted: 170,
    isAvailable: true,
    bio: "Capture your best moments.",
    description: "Affordable full wedding coverage.",
    features: ["Full Day"],
    image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7"
  },
  {
    id: "photo_5",
    name: "Elite Wedding Films",
    category: "photography",
    city: "Sakhnin",
    price: 4800,
    rating: 4.7,
    experienceYears: 7,
    eventsCompleted: 240,
    isAvailable: true,
    bio: "Cinematic wedding storytelling.",
    description: "Professional editing and cinematic style.",
    features: ["Cinematic Video"],
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764b8a"
  },
  {
    id: "photo_6",
    name: "Bright Shot Studio",
    category: "photography",
    city: "Shefa-Amr",
    price: 4300,
    rating: 4.6,
    experienceYears: 6,
    eventsCompleted: 190,
    isAvailable: true,
    bio: "Modern wedding photography.",
    description: "Photo, video and album design.",
    features: ["Album", "Video"],
    image: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92"
  },

  // ================= Decoration (6) =================
  {
    id: "decor_1",
    name: "Elegant Decor",
    category: "decoration",
    city: "Nazareth",
    price: 6000,
    rating: 4.5,
    experienceYears: 7,
    eventsCompleted: 180,
    isAvailable: true,
    bio: "Luxury wedding decoration.",
    description: "Full hall decoration with flowers and stage.",
    features: ["Stage", "Flowers", "Tables"],
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed"
  },
  {
    id: "decor_2",
    name: "Royal Flowers",
    category: "decoration",
    city: "Haifa",
    price: 5800,
    rating: 4.4,
    experienceYears: 5,
    eventsCompleted: 150,
    isAvailable: true,
    bio: "Professional floral design.",
    description: "Elegant floral arrangements for weddings.",
    features: ["Floral Design"],
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329"
  },
  {
    id: "decor_3",
    name: "Dream Decor",
    category: "decoration",
    city: "Tayibe",
    price: 6200,
    rating: 4.7,
    experienceYears: 6,
    eventsCompleted: 210,
    isAvailable: true,
    bio: "Modern and classic decoration styles.",
    description: "Entrance, stage and table design.",
    features: ["Entrance", "Stage"],
    image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a"
  },
  {
    id: "decor_4",
    name: "Classic Wedding Design",
    category: "decoration",
    city: "Umm al-Fahm",
    price: 5200,
    rating: 4.3,
    experienceYears: 4,
    eventsCompleted: 120,
    isAvailable: true,
    bio: "Affordable wedding decoration.",
    description: "Simple and elegant designs.",
    features: ["Tables", "Centerpieces"],
    image: "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9"
  },
  {
    id: "decor_5",
    name: "Luxury Events Decor",
    category: "decoration",
    city: "Sakhnin",
    price: 6500,
    rating: 4.8,
    experienceYears: 8,
    eventsCompleted: 260,
    isAvailable: true,
    bio: "High-end wedding decoration.",
    description: "Premium flowers and lighting design.",
    features: ["Premium Flowers", "Lighting"],
    image: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde"
  },
  {
    id: "decor_6",
    name: "Floral Art Studio",
    category: "decoration",
    city: "Shefa-Amr",
    price: 5400,
    rating: 4.5,
    experienceYears: 5,
    eventsCompleted: 160,
    isAvailable: true,
    bio: "Creative floral decoration.",
    description: "Unique wedding flower concepts.",
    features: ["Floral Concepts"],
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf"
  },

  // ================= Venue (6) =================
  {
    id: "venue_1",
    name: "Royal Palace Hall",
    category: "venue",
    city: "Nazareth",
    price: 12000,
    rating: 4.6,
    capacity: 700,
    experienceYears: 10,
    eventsCompleted: 450,
    isAvailable: true,
    bio: "Luxury wedding hall.",
    description: "Large hall with catering and parking.",
    features: ["Catering", "Parking"],
    image: "https://images.unsplash.com/photo-1519167758481-83f29c6b9c4f"
  },
  {
    id: "venue_2",
    name: "Golden Nights",
    category: "venue",
    city: "Haifa",
    price: 11000,
    rating: 4.5,
    capacity: 600,
    experienceYears: 8,
    eventsCompleted: 380,
    isAvailable: true,
    bio: "Modern event venue.",
    description: "Fully equipped wedding hall.",
    features: ["Catering", "Lighting"],
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3"
  },
  {
    id: "venue_3",
    name: "Dream Hall",
    category: "venue",
    city: "Tayibe",
    price: 10000,
    rating: 4.4,
    capacity: 500,
    experienceYears: 7,
    eventsCompleted: 300,
    isAvailable: true,
    bio: "Perfect for medium weddings.",
    description: "Elegant and modern design.",
    features: ["Parking"],
    image: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde"
  },
  {
    id: "venue_4",
    name: "Al Salam Hall",
    category: "venue",
    city: "Umm al-Fahm",
    price: 9500,
    rating: 4.3,
    capacity: 450,
    experienceYears: 6,
    eventsCompleted: 260,
    isAvailable: true,
    bio: "Affordable event hall.",
    description: "Good for small to medium weddings.",
    features: ["Catering"],
    image: "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9"
  },
  {
    id: "venue_5",
    name: "Elite Events Hall",
    category: "venue",
    city: "Sakhnin",
    price: 10500,
    rating: 4.6,
    capacity: 550,
    experienceYears: 8,
    eventsCompleted: 320,
    isAvailable: true,
    bio: "Elegant wedding venue.",
    description: "Modern lighting and sound system.",
    features: ["Lighting", "Sound"],
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329"
  },
  {
    id: "venue_6",
    name: "Grand Celebration Hall",
    category: "venue",
    city: "Shefa-Amr",
    price: 11500,
    rating: 4.7,
    capacity: 650,
    experienceYears: 9,
    eventsCompleted: 390,
    isAvailable: true,
    bio: "Spacious luxury hall.",
    description: "Perfect for large weddings.",
    features: ["Catering", "Parking", "LED Screens"],
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622"
  }
];

export default function UploadTest() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const uploadServices = async () => {
    setLoading(true);
    setMessage("");
    
    try {
      const colRef = collection(db, "Collection");
      
      for (let service of services) {
        await setDoc(doc(colRef, service.id), service);
        console.log(`✅ تم رفع: ${service.name}`);
      }
      
      setMessage("✅ تم رفع جميع البيانات بنجاح! (24 خدمة)");
    } catch (error) {
      console.error("❌ خطأ:", error);
      setMessage(`❌ خطأ: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>رفع البيانات للفير بيس</h1>
      <p>سيتم رفع 24 خدمة: 6 DJs + 6 تصوير + 6 ديكور + 6 قاعات</p>
      
      <button 
        onClick={uploadServices}
        disabled={loading}
        style={{
          padding: "15px 30px",
          fontSize: "18px",
          backgroundColor: loading ? "#ccc" : "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "جاري الرفع..." : "رفع البيانات (24 خدمة)"}
      </button>
      
      {message && (
        <p style={{ marginTop: "20px", fontSize: "18px" }}>{message}</p>
      )}
    </div>
  );
}

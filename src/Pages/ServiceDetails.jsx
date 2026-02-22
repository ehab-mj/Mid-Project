import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [date, setDate] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "Collection", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setService({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Service not found");
        }
      } catch (err) {
        setError(err.message || "Failed to load service");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleBooking = async () => {
    if (!date) {
      alert("Please choose a date");
      return;
    }

    try {
      setBookingLoading(true);
      await addDoc(collection(db, "BOOKINGS"), {
        serviceId: service.id,
        serviceName: service.name,
        providerId: service.providerId || service.userId || null,
        category: service.category,
        date: date,
        status: "pending",
        createdAt: new Date()
      });

      alert("Booking sent successfully!");
      navigate("/");
    } catch (err) {
      alert("Failed to book service: " + err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <button 
        onClick={() => navigate(-1)}
        style={{ marginBottom: "20px", padding: "8px 16px", cursor: "pointer" }}
      >
        ← Back
      </button>

      {/* Service Image */}
      {service.imageUrl ? (
        <img 
          src={service.imageUrl} 
          alt={service.name} 
          style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "8px" }}
        />
      ) : (
        <div style={{ 
          width: "100%", 
          height: "300px", 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "24px"
        }}>
          No Image
        </div>
      )}

      {/* Service Details */}
      <div style={{ marginTop: "20px" }}>
        <h1 style={{ marginBottom: "10px" }}>{service.name}</h1>
        
        <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
          {typeof service.rating === "number" && (
            <span style={{ background: "#f0f0f0", padding: "5px 10px", borderRadius: "5px" }}>
              ⭐ {service.rating.toFixed(1)}
            </span>
          )}
          {service.category && (
            <span style={{ background: "#e3f2fd", padding: "5px 10px", borderRadius: "5px" }}>
              {service.category}
            </span>
          )}
          {service.isAvailable && (
            <span style={{ background: "#e8f5e9", padding: "5px 10px", borderRadius: "5px" }}>
              ✔ Available
            </span>
          )}
        </div>

        <p style={{ fontSize: "18px", lineHeight: "1.6", marginBottom: "20px" }}>
          {service.description || "No description available."}
        </p>

        {/* Features */}
        {service.features && service.features.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <h3>Features:</h3>
            <ul style={{ display: "flex", flexWrap: "wrap", gap: "10px", listStyle: "none", padding: 0 }}>
              {service.features.map((feature, index) => (
                <li key={index} style={{ background: "#f5f5f5", padding: "8px 15px", borderRadius: "20px" }}>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Price */}
        {typeof service.price === "number" && (
          <div style={{ marginBottom: "30px" }}>
            <h2 style={{ color: "#2e7d32" }}>${service.price.toLocaleString()}</h2>
          </div>
        )}

        {/* Experience */}
        {service.experienceYears && (
          <p style={{ marginBottom: "20px", color: "#666" }}>
            Experience: {service.experienceYears} years
          </p>
        )}

        {/* Booking Section */}
        <div style={{ 
          border: "2px solid #ddd", 
          borderRadius: "10px", 
          padding: "20px",
          marginTop: "30px",
          background: "#f9f9f9"
        }}>
          <h3>Book this service</h3>
          
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Select Date:
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "100%", maxWidth: "300px" }}
            />
          </div>

          <button 
            onClick={handleBooking}
            disabled={bookingLoading}
            style={{
              background: bookingLoading ? "#ccc" : "#1976d2",
              color: "white",
              border: "none",
              padding: "15px 30px",
              fontSize: "16px",
              borderRadius: "5px",
              cursor: bookingLoading ? "not-allowed" : "pointer",
              transition: "background 0.3s"
            }}
          >
            {bookingLoading ? "Booking..." : "Book Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

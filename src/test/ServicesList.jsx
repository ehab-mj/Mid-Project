import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";

export default function ServicesList({ selectedCategory }) {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      const servicesRef = collection(db, "Collection");

      // فلترة حسب category
      const q = query(servicesRef, where("category", "==", selectedCategory));

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setServices(data);
    };

    fetchServices();
  }, [selectedCategory]);

  return (
    <div>
      <h2>{selectedCategory} Services</h2>

      {services.map(service => (
        <div key={service.id}>
          <h3>{service.name}</h3>
          <p>Price: {service.price}</p>
          <p>Rating: {service.rating}</p>
          <p>Experience: {service.experienceYears} years</p>
          <p>Available: {service.isAvailable ? "Yes" : "No"}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import CardsList from "../Cards/CardsList";

export default function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, "Users");
      const snapshot = await getDocs(usersCollection);

      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setUsers(usersData);
      console.log("Fetched Users:", usersData);
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Users</h2>
      {users.map(user => (
        <div key={user.id}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <hr />
        </div>
      ))}
      <CardsList />
    </div>
  );
}
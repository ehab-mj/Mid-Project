import { collection, getDoc } from '@firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase/config';

export default function CardsList() {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        const fetchCards = async () => {
            const cardsCollection = collection(db, "BOOKINGS");
            const snapshot = await getDoc(cardsCollection);

            const cardsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setCards(cardsData);
            console.log("Fetched Cards:", cardsData);
        };

        fetchCards();
    }, []);

    return (
        <div>
            <h2>Cards</h2>
            {cards.map(card => (
                <div key={card.id}>
                    <p><strong>Event date:</strong> {card.eventDate}</p>
                    <p><strong>Event Type:</strong> {card.eventType}</p>
                    <p><strong>Location:</strong> {card.location}</p>
                    <p><strong>Number of people:</strong> {card.numberOfPeople}</p>
                    <p><strong>status:</strong> {card.status}</p>
                    <p><strong>Total Price:</strong> {card.totalPrice}</p>
                    <p><strong>Customer:</strong> {card.userId}</p>
                    <hr />
                </div>
            ))}
        </div>
    )
}

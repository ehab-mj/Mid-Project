// src/Components/Main/Services/providers.js    (or create categoryListeners.js)

import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../../../firebase/config";
// adjust path

// /**
//  * Listen to all documents in "Collection" where category === selectedCategory
//  * @param {string} category - e.g. "music", "decoration", "photography", "venue"
//  * @param {function} onData - (arrayOfItems) => void
//  * @param {function} onError - (error) => void
//  * @returns {function} unsubscribe
//  */

export function listenByCategory(category, onData, onError) {
    if (!category) {
        onError?.(new Error("No category provided"));
        return () => { };
    }

    const q = query(
        collection(db, "Collection"),
        where("category", "==", category)
    );

    return onSnapshot(
        q,
        (snapshot) => {
            const items = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            onData(items);
        },
        (err) => {
            console.error(`Error listening to category ${category}:`, err);
            onError?.(err);
        }
    );
}

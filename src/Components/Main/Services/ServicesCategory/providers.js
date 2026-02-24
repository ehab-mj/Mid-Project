import { collection, getDocs, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { db } from "../../../../firebase/config";


// category must be one of: music | decoration | photography | venue
export async function getProvidersByCategory(category) {
    const colRef = collection(db, "Collection");
    const q = query(colRef,
        where("category", "==", category),
        orderBy("name", "asc"));
    const snap = await getDocs(q);

    return snap.docs.map(d =>
        ({ id: d.id, ...d.data() }));
}

export function listenProvidersByCategory(category, onData, onError) {
    const colRef = collection(db, "Collection");
    const q = query(colRef,
        where("category", "==", category),
        orderBy("name", "asc"));

    const unsub = onSnapshot(
        q,
        (snap) => {
            const arr = snap.docs.map((d) =>
                ({ id: d.id, ...d.data() }));
            onData(arr);
        },
        (err) => {
            if (onError) onError(err);
        }
    );

    return unsub;
}
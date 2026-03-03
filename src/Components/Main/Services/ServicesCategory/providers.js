import { collection, getDocs, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { db } from "../../../../firebase/config";


// category must be one of: music | decoration | photography | venue
export async function getProvidersByCategory(category) {
    const colRef = collection(db, "Collection");
    const q = query(colRef,
        where("category", "==", category),
        orderBy("name"));
    const snap = await getDocs(q);

    return snap.docs.map(d =>
        ({ id: d.id, ...d.data() }));
}


export function listenDjUsersByRole(onData, onError) {
    const q = query(collection(db, "Users"), where("role", "==", "dj"));

    return onSnapshot(
        q,
        (snap) => {
            const data = snap.docs.map((doc) => {
                const u = doc.data() || {};
                return {
                    id: doc.id,

                    category: "dj",

                    title: u.name || u.title || "DJ",
                    name: u.name || "",
                    email: u.email || "",
                    phone: u.phone || "",
                    image: u.profileImage || u.image || u.photoURL || "",

                    isAvailable: typeof u.isAvailable === "boolean" ? u.isAvailable : true,
                    ...u,
                };
            });

            onData?.(data);
        },
        (err) => onError?.(err)
    );
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
// import { collection, getDocs, onSnapshot, query, where, orderBy } from "firebase/firestore";
// import { db } from "../../../../firebase/config";


// // category must be one of: music | decoration | photography | venue
// export async function getProvidersByCategory(decor_1) {
//     const colRef = collection(db, "Collection");
//     const q = query(colRef,
//         where("decor_1", "==", decor_1),
//         orderBy("name", "asc"));
//     const snap = await getDocs(q);

//     return snap.docs.map(d =>
//         ({ id: d.id, ...d.data() }));
// }

// export function listenProvidersByCategory(decor_1, onData, onError) {
//     const colRef = collection(db, "Collection");
//     const q = query(colRef,
//         where("decor_1", "==", decor_1),
//         orderBy("name", "asc"));

//     const unsub = onSnapshot(
//         q,
//         (snap) => {
//             const arr = snap.docs.map((d) =>
//                 ({ id: d.id, ...d.data() }));
//             onData(arr);
//         },
//         (err) => {
//             if (onError) onError(err);
//         }
//     );

//     return unsub;
// }
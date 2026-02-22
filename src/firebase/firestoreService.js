import { 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    query, 
    where, 
    orderBy,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc
} from "firebase/firestore";
import { db } from "./config";

/**
 * ============================================
 * طريقة جلب البيانات من Firebase Firestore
 * ============================================
 */

// 1️⃣ جلب مستند واحد (Document)
export const getSingleDocument = async (collectionName, documentId) => {
    try {
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.log("المستند غير موجود!");
            return null;
        }
    } catch (error) {
        console.error("خطأ في جلب المستند:", error);
        throw error;
    }
};

// 2️⃣ جلب كل المستندات من مجموعة (Collection)
export const getAllDocuments = async (collectionName) => {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const documents = [];
        
        querySnapshot.forEach((doc) => {
            documents.push({ id: doc.id, ...doc.data() });
        });
        
        return documents;
    } catch (error) {
        console.error("خطأ في جلب المستندات:", error);
        throw error;
    }
};

// 3️⃣ جلب مستندات مع فلترة (Query)
export const getFilteredDocuments = async (collectionName, field, operator, value) => {
    try {
        const q = query(
            collection(db, collectionName),
            where(field, operator, value)
        );
        
        const querySnapshot = await getDocs(q);
        const documents = [];
        
        querySnapshot.forEach((doc) => {
            documents.push({ id: doc.id, ...doc.data() });
        });
        
        return documents;
    } catch (error) {
        console.error("خطأ في الفلترة:", error);
        throw error;
    }
};

// 4️⃣ جلب مستندات مرتبة (Order By)
export const getOrderedDocuments = async (collectionName, orderField, direction = "asc") => {
    try {
        const q = query(
            collection(db, collectionName),
            orderBy(orderField, direction)
        );
        
        const querySnapshot = await getDocs(q);
        const documents = [];
        
        querySnapshot.forEach((doc) => {
            documents.push({ id: doc.id, ...doc.data() });
        });
        
        return documents;
    } catch (error) {
        console.error("خطأ في الترتيب:", error);
        throw error;
    }
};

// 5️⃣ استماع للتغييرات الوقت الحقيقي (Real-time Listener)
export const subscribeToCollection = (collectionName, callback) => {
    const unsubscribe = onSnapshot(collection(db, collectionName), (snapshot) => {
        const documents = [];
        snapshot.forEach((doc) => {
            documents.push({ id: doc.id, ...doc.data() });
        });
        callback(documents);
    });
    
    return unsubscribe; // استخدم هذا لإلغاء الاشتراك
};

// 6️⃣ استماع لمستند واحد (Single Document Real-time)
export const subscribeToDocument = (collectionName, documentId, callback) => {
    const unsubscribe = onSnapshot(doc(db, collectionName, documentId), (docSnap) => {
        if (docSnap.exists()) {
            callback({ id: docSnap.id, ...docSnap.data() });
        } else {
            callback(null);
        }
    });
    
    return unsubscribe;
};

// 7️⃣ إضافة مستند جديد (Create)
export const addDocument = async (collectionName, data) => {
    try {
        const docRef = await addDoc(collection(db, collectionName), {
            ...data,
            createdAt: new Date().toISOString()
        });
        return { id: docRef.id, ...data };
    } catch (error) {
        console.error("خطأ في إضافة المستند:", error);
        throw error;
    }
};

// 8️⃣ تحديث مستند (Update)
export const updateDocument = async (collectionName, documentId, data) => {
    try {
        const docRef = doc(db, collectionName, documentId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: new Date().toISOString()
        });
        return { id: documentId, ...data };
    } catch (error) {
        console.error("خطأ في تحديث المستند:", error);
        throw error;
    }
};

// 9️⃣ حذف مستند (Delete)
export const deleteDocument = async (collectionName, documentId) => {
    try {
        const docRef = doc(db, collectionName, documentId);
        await deleteDoc(docRef);
        return { id: documentId, deleted: true };
    } catch (error) {
        console.error("خطأ في حذف المستند:", error);
        throw error;
    }
};

export default {
    getSingleDocument,
    getAllDocuments,
    getFilteredDocuments,
    getOrderedDocuments,
    subscribeToCollection,
    subscribeToDocument,
    addDocument,
    updateDocument,
    deleteDocument
};

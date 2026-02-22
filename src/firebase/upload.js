import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "./config";

export async function uploadImage(file, path) {
    const fileRef = ref(auth, path);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
}
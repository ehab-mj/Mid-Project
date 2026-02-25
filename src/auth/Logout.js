import { STORAGE_KEY } from "./StorageKEY";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";

export async function Logout() {
    // Remove user from localStorage
    localStorage.removeItem(STORAGE_KEY);
}
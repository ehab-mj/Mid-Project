import { STORAGE_KEY } from "./StorageKEY";


export function getCurrentUser() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
}
import { STORAGE_KEY } from "./StorageKEY";

export function setCurrentUser(user) {
    if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(STORAGE_KEY);
    }
}

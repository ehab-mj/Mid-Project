import { STORAGE_KEY } from "./StorageKEY";


export function Logout() {
    localStorage.removeItem(STORAGE_KEY);
}
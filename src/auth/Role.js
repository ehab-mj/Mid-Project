import { useContext } from "react";
import { STORAGE_KEY } from "./StorageKEY";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Context";

export function setCurrentUser(user) {
    if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(STORAGE_KEY);
    }
}

export function SafeRoute({ children, allow }) {
    const { AuthUser } = useContext(AuthContext);
    const goHome = useNavigate()
    if (!AuthUser) {
        return goHome("/")
    }

    if (AuthUser.role !== allow && allow) {
        return goHome("/")
    }

    return children;
}
import { useContext, useEffect } from "react";
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

// Role mapping: maps database roles to expected roles
// "provider" in DB = "dj" in code
// "customer" in DB = "user" in code
const roleMapping = {
    "provider": "dj",
    "customer": "user"
};

// Get the mapped role for a user
const getMappedRole = (role) => {
    return roleMapping[role] || role;
};

export function SafeRoute({ children, allow }) {
    const { AuthUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Navigate after component mounts and auth state is checked
        if (!AuthUser) {
            navigate("/", { replace: true });
        } else if (allow) {
            // Check both the actual role and the mapped role
            const mappedRole = getMappedRole(AuthUser.role);
            if (AuthUser.role !== allow && mappedRole !== allow) {
                navigate("/", { replace: true });
            }
        }
    }, [AuthUser, allow, navigate]);

    // While checking auth or not authorized, return null
    // This prevents rendering children during redirect
    if (!AuthUser || (allow && AuthUser.role !== allow && getMappedRole(AuthUser.role) !== allow)) {
        return null;
    }

    // If auth check is complete and user is authorized, render children
    return children;
}

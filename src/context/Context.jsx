import { createContext, useState } from "react";
import { getCurrentUser } from "../auth/getCurrentUser";
import { setCurrentUser } from "../auth/Role";
import { Logout } from "../auth/Logout";


export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [AuthUser, SetAuthUser] = useState(getCurrentUser());

    const login = (userObj) => {
        setCurrentUser(userObj)
        SetAuthUser(userObj)
    }
    const logout = () => {
        Logout();
        SetAuthUser(null)
    }
    return (
        <AuthContext.Provider
            value={{ AuthUser, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    )
}
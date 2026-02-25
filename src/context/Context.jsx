import { createContext, useState } from "react";
import { getCurrentUser } from "../auth/getCurrentUser";
import { setCurrentUser } from "../auth/Role";
import { Logout } from "../auth/Logout";


// eslint-disable-next-line react-refresh/only-export-components
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
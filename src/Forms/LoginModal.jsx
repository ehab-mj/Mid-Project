import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/Context'
import './css/LoginModal.css';
import Modal from './Modal';
import './css/UserType.css'

// Import Firebase auth functions
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    updateProfile,
    reload 
} from "firebase/auth";
import { auth, db } from "../firebase/config";

// Import Firestore functions
import { 
    collection, 
    query, 
    where, 
    getDocs,
    addDoc 
} from "firebase/firestore";

export default function LoginModal({ onClose, onLogin }) {
    // Using AuthContext - login is passed via onLogin prop
    useContext(AuthContext);
    const [mode, setMode] = useState("login");
    const [role, setRole] = useState("user");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("");

    // دالة لجلب بيانات المستخدم من Firestore
    const getFirestoreUserData = async (userEmail) => {
        try {
            const usersRef = collection(db, "Users");
            const q = query(usersRef, where("email", "==", userEmail));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const docSnap = querySnapshot.docs[0];
                return { id: docSnap.id, ...docSnap.data() };
            }
            return null;
        } catch (error) {
            console.error("خطأ في جلب بيانات Firestore:", error);
            return null;
        }
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            let firebaseUser;
            
            if (mode === "login") {
                // Login with Firebase
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                firebaseUser = userCredential.user;
            } else {
                // Register with Firebase
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                firebaseUser = userCredential.user;
                
                // Update the user's display name
                await updateProfile(firebaseUser, {
                    displayName: name || (role === "dj" ? "DJ" : "User")
                });
                
                // Reload user to get updated displayName
                await reload(firebaseUser);
            }

            // Get fresh user from auth to ensure we have the latest data
            const freshUser = auth.currentUser;

            // جلب بيانات المستخدم من Firestore
            let firestoreData = null;
            if (mode === "login") {
                // في حالة الدخول، نبحث بالميل
                firestoreData = await getFirestoreUserData(freshUser.email);
            } else {
            // في حالة التسجيل، ننشئ مستند جديد في Firestore
                firestoreData = {
                    name: name || (role === "dj" ? "DJ" : "User"),
                    email: freshUser.email,
                    phone: phone,
                    profileImage: "",
                    role: role,
                    createdAt: new Date().toISOString()
                };
                
                // Save user to Firestore
                await addDoc(collection(db, "Users"), firestoreData);
            }

            // Create user object - using Firestore data only (Name, Email, Phone, Role)
            // During login: get data from Firestore
            // During registration: use the data we just saved to Firestore
            const user = {
                id: freshUser.uid,
                // Get all user data from Firestore
                name: firestoreData?.name || (role === "dj" ? "DJ" : "User"),
                email: firestoreData?.email || freshUser.email,
                phone: firestoreData?.phone || "",
                profileImage: firestoreData?.profileImage || "",
                role: firestoreData?.role || role,
            }
            
            console.log("Firebase User:", user);
            console.log("Firestore Data:", firestoreData);
            onLogin(user)
            onClose();
            
        } catch (err) {
            console.error("Firebase Auth Error:", err.message);
            setError(err.message);
        }
    }

    return (
        <Modal
            onClose={onClose}
            className='btn-head'
        >
            <div className='login-modal'>
                <div className='login-section'>

                    {/* Btn Close */}
                    <div className='btn-sec'>
                        <button
                            id='closing-Section'
                            onClick={onClose}
                        >x</button>
                    </div>

                    <h2 id="title">Login</h2>

                    {/* User Type */}
                    <h2 id='subtitle'>Select User Type</h2>

                    <div className='type-container'>
                        <button
                            type='button'
                            className={`user-type ${role === "user" ? "active" : ""}`}
                            onClick={() =>
                                setRole("user")
                            }
                        >
                            <h4>Regular User</h4>
                            <p>Book DJs for events</p>
                        </button>

                        <button
                            type='button'
                            className={`user-type ${role === "dj" ? "active" : ""}`}
                            onClick={() =>
                                setRole("dj")
                            }
                        >
                            <h4>DJ/Business</h4>
                            <p>Manage bookings</p>
                        </button>
                    </div>

                    {/* Login/Register */}
                    <button
                        type='button'
                        className='reg-btn'
                        onClick={() =>
                            setMode(mode === "login" ? "register" : "login")
                        }>
                        {mode === "login" ? "Register" : "Login"}
                    </button>

                    <h3 className='log-reg-title'>
                        {mode === "login" ? "Welcome Back" : "Create an account"}
                    </h3>

                        {/* Inputs */}
                        <form onSubmit={handleSubmit}>
                        {mode === "register" && (
                            <>
                            <label className='label'>
                                Name
                                <input
                                    id='name-input'
                                    type="text"
                                    placeholder='Enter your name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </label>

                            <label className='label'>
                                Phone
                                <input
                                    id='phone-input'
                                    type="tel"
                                    placeholder='Enter your phone number'
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </label>
                            </>
                        )}

                        <label className='label'>
                            Email
                            <input
                                id='email-input'
                                type="email"
                                placeholder='email'
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                            />
                        </label>

                        <label className='label'>
                            Password
                            <input
                                id='pass-input'
                                type="password"
                                placeholder='password'
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                            />
                        </label>

                        {/* Error Message Display */}
                        {error && (
                            <p style={{ color: 'red', textAlign: 'center', margin: '10px 0' }}>
                                {error}
                            </p>
                        )}

                        {/* Submit */}
                        <button
                            type='submit'
                            id='submit'
                        >
                            Continue as {role ===
                                "user" ? "Regular User" : " DJ/Business"}
                        </button>
                    </form>

                </div>
            </div>
        </Modal >
    )
}

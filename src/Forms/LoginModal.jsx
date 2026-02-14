import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/Context'
import './css/LoginModal.css';
import Modal from './Modal';
import './css/UserType.css'

export default function LoginModal({ onClose, onSubmit }) {
    const { login } = useContext(AuthContext);
    const [mode, setMode] = useState("login");
    const [type, setType] = useState("user");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit({ name, email, password, mode, type });
        onClose();
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
                            className={`user-type ${type === "user" ? "active" : ""}`}
                            onClick={() =>
                                setType("user")
                            }
                        >
                            <h4>Regular User</h4>
                            <p>Book DJs for events</p>
                        </button>

                        <button
                            type='button'
                            className={`user-type ${type === "dj" ? "active" : ""}`}
                            onClick={() =>
                                setType("dj")
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
                        {mode === "login" ? "register" : "login"}
                    </button>

                    <h3 className='log-reg-title'>
                        {mode === "login" ? "Welcome Back" : "Create an account"}
                    </h3>

                    {/* Inputs */}
                    <form onSubmit={handleSubmit}>
                        {mode === "register" && (
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


                        {/* Submit */}
                        <button
                            type='submit'
                            id='submit'
                        >
                            {type === "user" ? "Continue as Regular User" : "Continue as DJ/Business"}
                        </button>
                    </form>

                </div>
            </div>
        </Modal >
    )
}

'use client'
import {useState} from "react";

export default function AuthModal() {
    const [email, setEmail] = useState<string>();
    const handleLogin = () => {
        console.log(email);
    }
    return <div>
        <span>Sign In</span>
        <input value={email} onChange={(e) => setEmail(e.target.value)}/>
        <button onClick={handleLogin}>Continue</button>
    </div>
}
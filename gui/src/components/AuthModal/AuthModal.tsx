'use client'
import {useState} from "react";
import CustomInput from "@/components/CustomInput/CustomInput";

export default function AuthModal() {
    const [email, setEmail] = useState<string>('');
    const handleLogin = () => {
        console.log(email);
    }
    return <div>
        <span>Sign In</span>
        <CustomInput format={'text'} value={email} setter={setEmail}/>
        <input value={email} onChange={(e) => setEmail(e.target.value)}/>
        <button onClick={handleLogin}>Continue</button>
    </div>
}
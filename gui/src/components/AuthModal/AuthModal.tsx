// components/AuthModal.tsx
import React, {useState} from 'react';
import styles from './auth_modal.module.css';
import {Button, Input} from "@nextui-org/react";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({isOpen, onClose}) => {
    const [emailExists, setEmailExists] = useState<boolean | null>(null)
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    if (!isOpen) return null;


    const getButtonFields = () => {
        switch (emailExists) {
            case null:
                return {text: 'Continue', onClick: () => console.log('check_user')};
            case true:
                return {text: 'Sign In', onClick: () => console.log('login')};
            case false:
                return {text: 'Create Account', onClick: () => console.log('sign_up')};
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <Input
                    key="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {emailExists !== null &&
                    <Input
                        key="password"
                        type="password"
                        placeholder={emailExists ? "Enter your password" : "Set Password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />}
                <Button onClick={getButtonFields().onClick}>{getButtonFields().text}</Button>
            </div>

            <div></div>
        </div>
    );
};

export default AuthModal;
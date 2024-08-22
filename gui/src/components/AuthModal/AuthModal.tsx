// components/AuthModal.tsx
import React, {useState} from 'react';
import styles from './auth_modal.module.css';
import {Button, Input} from "@nextui-org/react";
import {checkUserEmailExists, login, signUp} from "@/services/api/authService";
import {validateEmail} from "@/utils/utils";
import {authPayload} from "@/types/auth";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({isOpen, onClose}) => {
    const [emailExists, setEmailExists] = useState<boolean | null>(null);
    const [emailErrorMsg, setEmailErrorMsg] = useState<string>('');
    const [passwordErrorMsg, setPasswordErrorMsg] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    if (!isOpen) return null;

    const handleSetEmail = (e) => {
        setEmail(e.target.value);
        setEmailExists(null);
        setEmailErrorMsg('');
        setPassword('');
        // setShowPassword(false);
        setPasswordErrorMsg('');
    }

    const handleSetPassword = (e) => {
        setPassword(e.target.value);
        setPasswordErrorMsg('');
    }


    async function checkEmailExists() {
        try {
            if (!validateEmail(email)) {
                setEmailErrorMsg("Enter Valid Email")
                return;
            }
            setLoading(true);
            const response = await checkUserEmailExists(email);
            if (response) {
                const data = response.data;
                if (data.success) {
                    const data = response.data;
                    setEmailExists(data.user_exists);
                }
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    }

    async function loginUser() {
        try {
            setLoading(true);
            const payload: authPayload = {
                email: email,
                password: password,
            };
            const response = await login(payload);
            if (response) {
                const data = response.data;
                if (data.success) {
                    console.log(data);
                } else {
                    setPasswordErrorMsg('Password entered is incorrect.');
                }
            }
        } catch (error) {
            console.error('Error: ', error);
        } finally {
            setLoading(true);
        }
    }

    async function createAccount() {
        try {
            if (password.length < 8) {
                setPasswordErrorMsg('Password must be atleast 8 characters');
                return;
            }
            setLoading(true);
            const payload: authPayload = {
                email: email,
                password: password,
            };
            const response = await signUp(payload);
            if (response) {
                const data = response.data;
                if (data.success) {
                    console.log(data);
                }
            }
        } catch (error) {
            console.error('Error: ', error);
        } finally {
            setLoading(true);
        }
    }

    const getButtonFields = () => {
        switch (emailExists) {
            case null:
                return {text: 'Continue', onClick: checkEmailExists};
            case true:
                return {text: 'Sign In', onClick: loginUser};
            case false:
                return {text: 'Create Account', onClick: createAccount};
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <Input
                    key="email"
                    type="email"
                    placeholder="Enter your email"
                    isInvalid={emailErrorMsg !== ''}
                    errorMessage={emailErrorMsg}
                    value={email}
                    onChange={handleSetEmail}
                />
                {emailExists !== null &&
                    <Input
                        key="password"
                        type="password"
                        placeholder={emailExists ? "Enter your password" : "Set Password"}
                        isInvalid={passwordErrorMsg !== ''}
                        errorMessage={passwordErrorMsg}
                        value={password}
                        onChange={handleSetPassword}
                    />}
                <Button onClick={getButtonFields().onClick} isLoading={loading}>{getButtonFields().text}</Button>
            </div>

            <div></div>
        </div>
    );
};

export default AuthModal;
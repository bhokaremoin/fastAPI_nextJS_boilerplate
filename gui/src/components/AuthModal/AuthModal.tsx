import React, {useCallback, useEffect, useRef, useState} from 'react';
import styles from './auth_modal.module.css';
import {Button, Input} from "@nextui-org/react";
import {checkUserEmailExists, login, signUp} from "@/services/api/authService";
import {validateEmail} from "@/utils/utils";
import {authPayload} from "@/types/auth";
import {setCookie} from "@/utils/cookies";

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

    const modalRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleSetEmail = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setEmailExists(null);
        setEmailErrorMsg('');
        setPassword('');
        setPasswordErrorMsg('');
    }, []);

    const handleSetPassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setPasswordErrorMsg('');
    }, []);

    const checkEmailExists = useCallback(async () => {
        if (!validateEmail(email)) {
            setEmailErrorMsg("Enter Valid Email");
            return;
        }
        setLoading(true);
        try {
            const response = await checkUserEmailExists(email);
            if (response && response.data.success) {
                setEmailExists(response.data.user_exists);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [email]);

    const loginUser = useCallback(async () => {
        setLoading(true);
        try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const payload: authPayload = {email, password, timezone};
            const response = await login(payload);
            if (response && response.data.success) {
                setCookie("accessToken", response.data.access_token);
                onClose();
            } else {
                setPasswordErrorMsg('Password entered is incorrect.');
            }
        } catch (error) {
            console.error('Error: ', error);
        } finally {
            setLoading(false);
        }
    }, [email, password]);

    const createAccount = useCallback(async () => {
        if (password.length < 8) {
            setPasswordErrorMsg('Password must be at least 8 characters');
            return;
        }
        setLoading(true);
        try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const payload: authPayload = {email, password, timezone};
            const response = await signUp(payload);
            if (response && response.data.success) {
                setCookie("accessToken", response.data.access_token);
                onClose();
            }
        } catch (error) {
            console.error('Error: ', error);
        } finally {
            setLoading(false);
        }
    }, [email, password]);

    const getButtonFields = useCallback(() => {
        switch (emailExists) {
            case null:
                return {text: 'Continue', onClick: checkEmailExists};
            case true:
                return {text: 'Sign In', onClick: loginUser};
            case false:
                return {text: 'Create Account', onClick: createAccount};
        }
    }, [emailExists, checkEmailExists, loginUser, createAccount]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                if (emailExists === null) {
                    checkEmailExists().then().catch();
                } else if (emailExists) {
                    loginUser().then().catch();
                } else {
                    createAccount().then().catch();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [emailExists, checkEmailExists, loginUser, createAccount]);

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent} ref={modalRef}>
                <Input
                    key="email"
                    type="email"
                    placeholder="Enter your email"
                    isInvalid={emailErrorMsg !== ''}
                    errorMessage={emailErrorMsg}
                    value={email}
                    onChange={handleSetEmail}
                />
                {emailExists !== null && (
                    <Input
                        key="password"
                        type="password"
                        autoFocus={true}
                        placeholder={emailExists ? "Enter your password" : "Set Password"}
                        isInvalid={passwordErrorMsg !== ''}
                        errorMessage={passwordErrorMsg}
                        value={password}
                        onChange={handleSetPassword}
                    />
                )}
                <Button onClick={getButtonFields().onClick} isLoading={loading}>
                    {getButtonFields().text}
                </Button>
            </div>
        </div>
    );
};

export default AuthModal;
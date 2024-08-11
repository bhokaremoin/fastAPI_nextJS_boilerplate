// components/AuthModal.tsx
import React, {useState} from 'react';
import styles from './auth_modal.module.css';
import CustomInput from "@/components/CustomInput/CustomInput";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({isOpen, onClose}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle authentication logic here
        console.log('Login attempt with:', email, password);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <CustomInput format={'text'} value={email} setter={setEmail} type={'primary'}/>
            </div>
        </div>
    );
};

export default AuthModal;
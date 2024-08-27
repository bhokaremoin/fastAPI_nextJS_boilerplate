import {removeCookie} from "@/utils/cookies";

export function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function logout() {
    removeCookie('accessToken');
    window.location.reload();
}
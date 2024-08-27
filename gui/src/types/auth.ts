export interface authPayload {
    email: string;
    password: string;
    timezone: string;
    enc_password?: string;
}

export interface userData {
    userEmail: string;
    userName: string;
    accessToken: string;
}

export interface TodoItem {
    _id: string;
    user_id: number;
    title: string;
    description?: string;
    is_done: boolean;
}

export interface TodoCreatePayload {
    title: string;
    description?: string;
}

export interface TodoUpdatePayload {
    title?: string;
    description?: string;
    is_done?: boolean;
}
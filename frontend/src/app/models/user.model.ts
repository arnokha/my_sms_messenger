export interface User {
    id: string;
    username: string;
    token: string;
}

// Backend response wrappers
export interface UserResponse {
    user: {
        id: string;
        username: string;
    };
}

export interface AuthResponse {
    user: {
        id: string;
        username: string;
    };
    token: string;
}
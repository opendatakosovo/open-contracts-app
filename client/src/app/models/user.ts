export interface User {
        _id ?: string;
        firstName: string;
        lastName: string;
        gender: string;
        email: string;
        password: string;
        role: string;
        department?: string;
        isActive: boolean;
}

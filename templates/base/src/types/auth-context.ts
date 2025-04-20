export interface AuthContext {
    user: {
        id: string;
    };
    tenantId: string;
    scopes: string[];
}
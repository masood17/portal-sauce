// Profile.d.ts

/**
 * Temporary declaration for the ClientProfile interface based on the defaults object.
 * This resolves the "Cannot find module" error for the import.
 */
export default interface Profile {
    id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    cell_number: string;
    address: string;
    country: string;
    city: string;
    state: string;
    zip: string;
    avatar: string;
    created_at: string;
    updated_at: string;
    heds: string;
    // Assuming 'INDIVIDUAL' is one of the possible string literal types
    hed_type: "INDIVIDUAL" | "TEAM"; 
    hed_name: string;
    hed_phone_number: string;
    hed_email: string;
}

export interface ClientProfile {
    id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    cell_number: string;
    address: string;
    country: string;
    city: string;
    state: string;
    zip: string;
    avatar: string;
    created_at: string;
    updated_at: string;
    heds: string;
    // Assuming 'INDIVIDUAL' is one of the possible string literal types
    hed_type: "INDIVIDUAL" | "TEAM"; 
    hed_name: string;
    hed_phone_number: string;
    hed_email: string;
}
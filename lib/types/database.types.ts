// Database Types based on Supabase Schema
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    first_name: string | null
                    last_name: string | null
                    role: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    first_name?: string | null
                    last_name?: string | null
                    role?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    first_name?: string | null
                    last_name?: string | null
                    role?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            modeles: {
                Row: {
                    id: string
                    nom: string
                    description: string | null
                    prix_base: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    nom: string
                    description?: string | null
                    prix_base: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    nom?: string
                    description?: string | null
                    prix_base?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            tissus: {
                Row: {
                    id: string
                    nom: string
                    texture: string | null
                    prix_metre: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    nom: string
                    texture?: string | null
                    prix_metre: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    nom?: string
                    texture?: string | null
                    prix_metre?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            orders: {
                Row: {
                    id: string
                    user_id: string
                    model_name: string
                    total_amount: number
                    status: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    model_name: string
                    total_amount: number
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    model_name?: string
                    total_amount?: number
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            measurements: {
                Row: {
                    id: string
                    user_id: string
                    height: number
                    weight: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    height: number
                    weight: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    height?: number
                    weight?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            appointments: {
                Row: {
                    id: string
                    user_id: string
                    appointment_date: string
                    status: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    appointment_date: string
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    appointment_date?: string
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            messages_chat: {
                Row: {
                    id: string
                    user_id: string
                    message: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    message: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    message?: string
                    created_at?: string
                }
            }
            professional_profiles: {
                Row: {
                    id: string
                    user_id: string
                    business_name: string
                    base_rate: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    business_name: string
                    base_rate: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    business_name?: string
                    base_rate?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            reviews: {
                Row: {
                    id: string
                    order_id: string
                    rating: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    order_id: string
                    rating: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    order_id?: string
                    rating?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            agent_availabilities: {
                Row: {
                    id: string
                    agent_id: string
                    start_time: string
                    end_time: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    agent_id: string
                    start_time: string
                    end_time: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    agent_id?: string
                    start_time?: string
                    end_time?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            incidents: {
                Row: {
                    id: string
                    appointment_id: string
                    incident_type: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    appointment_id: string
                    incident_type: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    appointment_id?: string
                    incident_type?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            admin_audit_logs: {
                Row: {
                    id: string
                    actor_user_id: string
                    action: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    actor_user_id: string
                    action: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    actor_user_id?: string
                    action?: string
                    created_at?: string
                }
            }
        }
    }
}
